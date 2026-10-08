import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { loadSatUserState } from './satStorage';
import { calculatePredictedScore } from './scorePredictor';
import { getSatLeagueFromScore } from '../pages/profile/satLeague';
import type { SatLeaderboardUser, QuestionAttemptLog } from '../types';

export const SAT_BENCHMARK_SCHOLARS: SatLeaderboardUser[] = [
  {
    id: 'u-bench-1',
    name: 'Tanvir Hossain',
    avatar: 'scholar',
    xp: 2450,
    solvedCount: 168,
    accuracy: 94,
    predictedScore: 1560,
    league: 'diamond',
    rank: 1
  },
  {
    id: 'u-bench-2',
    name: 'Nafisa Rahman',
    avatar: 'astronaut',
    xp: 2180,
    solvedCount: 142,
    accuracy: 91,
    predictedScore: 1530,
    league: 'diamond',
    rank: 2
  },
  {
    id: 'u-bench-3',
    name: 'Farhan Kabir',
    avatar: 'robot',
    xp: 1920,
    solvedCount: 125,
    accuracy: 88,
    predictedScore: 1490,
    league: 'ruby',
    rank: 3
  },
  {
    id: 'u-bench-4',
    name: 'Ayesha Siddiqua',
    avatar: 'code',
    xp: 1750,
    solvedCount: 110,
    accuracy: 85,
    predictedScore: 1460,
    league: 'ruby',
    rank: 4
  },
  {
    id: 'u-bench-5',
    name: 'Zubair Ahmed',
    avatar: 'cat',
    xp: 1390,
    solvedCount: 88,
    accuracy: 82,
    predictedScore: 1410,
    league: 'sapphire',
    rank: 5
  },
  {
    id: 'u-bench-6',
    name: 'Tasnim Ferdous',
    avatar: 'target',
    xp: 1120,
    solvedCount: 74,
    accuracy: 80,
    predictedScore: 1360,
    league: 'sapphire',
    rank: 6
  },
  {
    id: 'u-bench-7',
    name: 'Sadman Sakib',
    avatar: 'zap',
    xp: 890,
    solvedCount: 56,
    accuracy: 78,
    predictedScore: 1280,
    league: 'gold',
    rank: 7
  }
];

export interface FetchSatLeaderboardOptions {
  scope?: 'global' | 'friends';
  timeframe?: 'weekly' | 'allTime';
  limit?: number;
}

/**
 * Fetch dedicated SAT Scholars Leaderboard, strictly isolated from Python track progress.
 */
export async function fetchSatLeaderboard(options: FetchSatLeaderboardOptions = {}): Promise<SatLeaderboardUser[]> {
  const { scope = 'global', limit = 50 } = options;
  const localState = loadSatUserState();
  const localPrediction = calculatePredictedScore(localState.attempts);
  const localSolvedCount = localState.attempts.length;
  const localCorrectCount = localState.attempts.filter(a => a.isCorrect).length;
  const localAccuracy = localSolvedCount > 0 ? Math.round((localCorrectCount / localSolvedCount) * 100) : 85;

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
    const all = [currentUserObj, ...SAT_BENCHMARK_SCHOLARS.filter(b => b.id !== currentUserObj.id)]
      .sort((a, b) => b.xp - a.xp)
      .map((u, idx) => ({ ...u, rank: idx + 1 }));
    return all.slice(0, limit);
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
      const all = [currentUserObj, ...SAT_BENCHMARK_SCHOLARS.filter(b => b.id !== currentUserObj.id)]
        .sort((a, b) => b.xp - a.xp)
        .map((u, idx) => ({ ...u, rank: idx + 1 }));
      return all.slice(0, limit);
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
      const acc = solved > 0 ? Math.round((correct / solved) * 100) : 85;
      const predictionObj = calculatePredictedScore(attempts);
      const score = solved > 0 ? predictionObj.compositeScore : (r.target_score || 1400);
      const finalXp = userXp > 0 ? userXp : Math.max(80, solved * 15);

      cloudScholars.push({
        id: r.user_id,
        name: p?.name || 'Digital SAT Scholar',
        avatar: p?.avatar || 'scholar',
        avatarUrl: p?.avatar_url || undefined,
        xp: finalXp,
        solvedCount: Math.max(1, solved),
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
    }

    // If fewer than 5 scholars, supplement with benchmark scholars
    if (cloudScholars.length < 5) {
      for (const b of SAT_BENCHMARK_SCHOLARS) {
        if (!seenUserIds.has(b.id)) {
          cloudScholars.push(b);
          seenUserIds.add(b.id);
        }
      }
    }

    // Sort by SAT XP descending and assign 1-indexed rank
    const sorted = cloudScholars
      .sort((a, b) => b.xp - a.xp)
      .map((u, idx) => ({ ...u, rank: idx + 1 }));

    return sorted.slice(0, limit);
  } catch (err) {
    console.debug('[satLeaderboardService] fetch error:', err);
    const all = [currentUserObj, ...SAT_BENCHMARK_SCHOLARS.filter(b => b.id !== currentUserObj.id)]
      .sort((a, b) => b.xp - a.xp)
      .map((u, idx) => ({ ...u, rank: idx + 1 }));
    return all.slice(0, limit);
  }
}

/**
 * Search specifically for SAT Scholars and classmates
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

  // 1. Search Supabase profiles
  if (isSupabaseConfigured) {
    try {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name, avatar, avatar_url')
        .ilike('name', `%${term}%`)
        .limit(10);

      if (profiles && profiles.length > 0) {
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
          const score = attempts.length > 0 ? pred.compositeScore : (r?.target_score || 1420);

          return {
            id: p.id,
            name: p.name || 'Digital SAT Scholar',
            avatar: p.avatar || 'scholar',
            avatarUrl: p.avatar_url || undefined,
            xp: userXp > 0 ? userXp : Math.max(90, attempts.length * 15),
            solvedCount: Math.max(1, attempts.length),
            accuracy: 88,
            predictedScore: score,
            league: getSatLeagueFromScore(score),
            rank: idx + 1,
            isCurrentUser: p.id === currentUserId,
            isFollowing: followedSet.has(p.id)
          };
        });
      }
    } catch (e) {
      console.debug('[searchSatScholars] Supabase error:', e);
    }
  }

  // Fallback to benchmark cohort
  const benchmarkMatches = SAT_BENCHMARK_SCHOLARS.filter(b => b.name.toLowerCase().includes(term));
  return benchmarkMatches.map(b => ({
    ...b,
    isFollowing: followedSet.has(b.id)
  }));
}
