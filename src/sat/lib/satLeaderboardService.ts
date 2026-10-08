import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { loadSatUserState } from './satStorage';
import { calculatePredictedScore } from './scorePredictor';
import { getSatLeagueFromScore } from '../pages/profile/satLeague';
import type { SatLeaderboardUser, QuestionAttemptLog } from '../types';

export interface FetchSatLeaderboardOptions {
  scope?: 'global' | 'friends';
  timeframe?: 'weekly' | 'allTime';
  limit?: number;
}

/**
 * Fetch dedicated SAT Scholars Leaderboard with authentic, real user data only.
 */
export async function fetchSatLeaderboard(options: FetchSatLeaderboardOptions = {}): Promise<SatLeaderboardUser[]> {
  const { scope = 'global', limit = 50 } = options;
  const localState = loadSatUserState();
  const localPrediction = calculatePredictedScore(localState.attempts);
  const localSolvedCount = localState.attempts.length;
  const localCorrectCount = localState.attempts.filter(a => a.isCorrect).length;
  const localAccuracy = localSolvedCount > 0 ? Math.round((localCorrectCount / localSolvedCount) * 100) : 0;

  let currentUserId: string | undefined;
  let currentUserName = (typeof window !== 'undefined' ? localStorage.getItem('cs_sat_user_name') || localStorage.getItem('cholosikhi_user_name') : '') || 'Digital SAT Scholar';
  let currentUserAvatar = 'scholar';
  let currentUserAvatarUrl: string | undefined;
  const followedSet = new Set<string>();

  if (isSupabaseConfigured) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        currentUserId = user.id;
        currentUserName = user.user_metadata?.full_name || currentUserName;

        // Fetch user profile
        const { data: profile } = await supabase.from('profiles').select('name, avatar, avatar_url').eq('id', user.id).maybeSingle();
        if (profile) {
          if (profile.name) currentUserName = profile.name;
          if (profile.avatar) currentUserAvatar = profile.avatar;
          if (profile.avatar_url) currentUserAvatarUrl = profile.avatar_url;
        }

        // Fetch followed IDs
        const { data: follows } = await supabase.from('follows').select('following_id').eq('follower_id', user.id);
        if (follows) {
          follows.forEach(f => followedSet.add(f.following_id));
        }
      }
    } catch {
      // offline fallback
    }
  }

  const currentUserObj: SatLeaderboardUser = {
    id: currentUserId || 'me',
    name: currentUserName,
    avatar: currentUserAvatar,
    avatarUrl: currentUserAvatarUrl,
    xp: localState.xp,
    solvedCount: localSolvedCount,
    accuracy: localAccuracy,
    predictedScore: localPrediction.compositeScore,
    league: getSatLeagueFromScore(localPrediction.compositeScore),
    rank: 1,
    isCurrentUser: true,
    isFollowing: false
  };

  if (!isSupabaseConfigured) {
    return [currentUserObj];
  }

  try {
    let routinesQuery = supabase
      .from('sat_user_routines')
      .select('user_id, target_score, daily_tasks, updated_at');

    if (scope === 'friends' && currentUserId) {
      const friendIds = Array.from(followedSet);
      friendIds.push(currentUserId);
      routinesQuery = routinesQuery.in('user_id', friendIds);
    }

    const { data: routines, error } = await routinesQuery
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error || !routines || routines.length === 0) {
      if (scope === 'friends' && followedSet.size === 0) {
        return [currentUserObj];
      }
      return [currentUserObj];
    }

    const userIds = Array.from(new Set(routines.map(r => r.user_id)));
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, name, avatar, avatar_url')
      .in('id', userIds);

    const profileMap = new Map((profiles || []).map(p => [p.id, p]));
    const seenUserIds = new Set<string>();
    const cloudScholars: SatLeaderboardUser[] = [];

    for (const r of routines) {
      if (seenUserIds.has(r.user_id)) continue;
      seenUserIds.add(r.user_id);

      const isMe = r.user_id === currentUserId;
      if (isMe) {
        cloudScholars.push(currentUserObj);
        continue;
      }

      interface RoutineStorePayload {
        id?: string;
        xp?: number;
        streak?: number;
        attempts?: QuestionAttemptLog[];
      }

      let attempts: QuestionAttemptLog[] = [];
      let userXp = 0;
      if (Array.isArray(r.daily_tasks)) {
        const store = (r.daily_tasks as RoutineStorePayload[]).find(t => t && t.id === '__sat_attempts_store__');
        if (store) {
          attempts = store.attempts || [];
          userXp = Number(store.xp) || 0;
        }
      }

      const p = profileMap.get(r.user_id);
      const solved = attempts.length;
      const correct = attempts.filter(a => a.isCorrect).length;
      const acc = solved > 0 ? Math.round((correct / solved) * 100) : 0;
      const predictionObj = calculatePredictedScore(attempts);
      const score = solved > 0 ? predictionObj.compositeScore : (r.target_score || 1000);
      const finalXp = userXp > 0 ? userXp : (solved * 15);

      cloudScholars.push({
        id: r.user_id,
        name: p?.name || 'Digital SAT Scholar',
        avatar: p?.avatar || 'scholar',
        avatarUrl: p?.avatar_url || undefined,
        xp: finalXp,
        solvedCount: solved,
        accuracy: acc,
        predictedScore: score,
        league: getSatLeagueFromScore(score),
        rank: 1,
        isCurrentUser: false,
        isFollowing: followedSet.has(r.user_id)
      });
    }

    if (currentUserId && !seenUserIds.has(currentUserId)) {
      cloudScholars.push(currentUserObj);
      seenUserIds.add(currentUserId);
    } else if (!currentUserId && cloudScholars.length === 0) {
      cloudScholars.push(currentUserObj);
    }

    // Sort strictly by real SAT XP descending and assign 1-indexed ranks
    const sorted = cloudScholars
      .sort((a, b) => b.xp - a.xp)
      .map((u, idx) => ({ ...u, rank: idx + 1 }));

    return sorted.slice(0, limit);
  } catch (err) {
    console.debug('[satLeaderboardService] fetch error:', err);
    return [currentUserObj];
  }
}

/**
 * Search specifically for real registered SAT Scholars and classmates
 */
export async function searchSatScholars(query: string): Promise<SatLeaderboardUser[]> {
  const term = query.trim().toLowerCase();
  if (!term || term.length < 2) return [];

  let currentUserId: string | undefined;
  const followedSet = new Set<string>();

  if (isSupabaseConfigured) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        currentUserId = user.id;
        const { data: follows } = await supabase.from('follows').select('following_id').eq('follower_id', user.id);
        if (follows) follows.forEach(f => followedSet.add(f.following_id));
      }
    } catch {
      // ignore
    }
  }

  if (!isSupabaseConfigured) return [];

  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, name, avatar, avatar_url')
      .ilike('name', `%${term}%`)
      .limit(10);

    if (error || !profiles || profiles.length === 0) return [];

    const userIds = profiles.map(p => p.id);
    const { data: routines } = await supabase
      .from('sat_user_routines')
      .select('user_id, target_score, daily_tasks')
      .in('user_id', userIds);

    const routineMap = new Map((routines || []).map(r => [r.user_id, r]));

    return profiles.map((p, idx): SatLeaderboardUser => {
      const r = routineMap.get(p.id);
      let userXp = 0;
      let attempts: QuestionAttemptLog[] = [];
      if (r && Array.isArray(r.daily_tasks)) {
        const store = r.daily_tasks.find((t: { id?: string; xp?: number; attempts?: QuestionAttemptLog[] }) => t && t.id === '__sat_attempts_store__');
        if (store) {
          userXp = Number(store.xp) || 0;
          attempts = store.attempts || [];
        }
      }
      const pred = calculatePredictedScore(attempts);
      const score = attempts.length > 0 ? pred.compositeScore : (r?.target_score || 1000);
      const correctCount = attempts.filter(a => a.isCorrect).length;
      const acc = attempts.length > 0 ? Math.round((correctCount / attempts.length) * 100) : 0;

      return {
        id: p.id,
        name: p.name || 'Digital SAT Scholar',
        avatar: p.avatar || 'scholar',
        avatarUrl: p.avatar_url || undefined,
        xp: userXp > 0 ? userXp : (attempts.length * 15),
        solvedCount: attempts.length,
        accuracy: acc,
        predictedScore: score,
        league: getSatLeagueFromScore(score),
        rank: idx + 1,
        isCurrentUser: p.id === currentUserId,
        isFollowing: followedSet.has(p.id)
      };
    });
  } catch (e) {
    console.debug('[searchSatScholars] Supabase error:', e);
    return [];
  }
}
