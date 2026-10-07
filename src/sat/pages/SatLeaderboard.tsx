import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Trophy,
  Zap,
  Sparkles,
  Users,
  Globe,
  Search,
  UserPlus,
  UserCheck,
  X
} from 'lucide-react';
import { clsx } from 'clsx';
import { loadSatUserState } from '../lib/satStorage';
import { calculatePredictedScore } from '../lib/scorePredictor';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import type { SatLeaderboardUser, QuestionAttemptLog } from '../types';
import { play } from '../../lib/audio';

const BENCHMARK_COHORT: SatLeaderboardUser[] = [
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
    league: 'diamond',
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
    league: 'diamond',
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
    league: 'diamond',
    rank: 5
  }
];

export default function SatLeaderboard() {
  const [timeframe, setTimeframe] = useState<'weekly' | 'allTime'>('weekly');
  const [viewScope, setViewScope] = useState<'global' | 'friends'>('global');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SatLeaderboardUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [cloudUsers, setCloudUsers] = useState<SatLeaderboardUser[]>([]);
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  const { session, user } = useAuthStore();
  const userStore = useUserStore();
  const [localName, setLocalName] = useState(() => {
    return (
      (typeof window !== 'undefined'
        ? localStorage.getItem('cs_sat_user_name') || localStorage.getItem('cholosikhi_user_name')
        : '') || ''
    );
  });

  useEffect(() => {
    const handleNameChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ name?: string }>;
      if (customEvent?.detail?.name) {
        setLocalName(customEvent.detail.name);
      }
    };
    window.addEventListener('cs_user_name_changed', handleNameChange);
    return () => window.removeEventListener('cs_user_name_changed', handleNameChange);
  }, []);

  const currentUserId = session?.id || user?.id;
  const currentUserName =
    session?.name ||
    user?.name ||
    userStore.name ||
    localName ||
    'Digital SAT Scholar';

  const userState = loadSatUserState();
  const prediction = calculatePredictedScore(userState.attempts);
  const totalAttempts = userState.attempts.length;
  const correctAttempts = userState.attempts.filter((a) => a.isCorrect).length;
  const userAccuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 86;

  // Fetch real profiles and follows from Supabase
  const fetchLeaderboardData = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setCloudUsers([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // 1. Fetch who current user follows
      let followedSet = new Set<string>();
      if (currentUserId) {
        const { data: followsData } = await supabase
          .from('follows')
          .select('following_id')
          .eq('follower_id', currentUserId);

        if (followsData) {
          followedSet = new Set(followsData.map((f) => f.following_id));
          setFollowingIds(followedSet);
        }
      }

      // 2. Fetch SAT active students from sat_user_routines
      let routinesQuery = supabase
        .from('sat_user_routines')
        .select('user_id, target_score, weekly_hours, daily_tasks, updated_at');

      if (viewScope === 'friends' && currentUserId) {
        const friendIds = Array.from(followedSet);
        friendIds.push(currentUserId);
        routinesQuery = routinesQuery.in('user_id', friendIds);
      }

      const { data: routines, error } = await routinesQuery
        .order('updated_at', { ascending: false })
        .limit(50);

      if (error) {
        console.warn('[SatLeaderboard] Supabase fetch error:', error);
        setCloudUsers([]);
      } else if (routines && routines.length > 0) {
        const userIds = routines.map((r) => r.user_id);
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, name, avatar, avatar_url')
          .in('id', userIds);

        const profileMap = new Map((profiles || []).map((p) => [p.id, p]));

        const mappedUsers: SatLeaderboardUser[] = routines.map((r) => {
          interface RoutineStorePayload {
            id?: string;
            xp?: number;
            streak?: number;
            attempts?: QuestionAttemptLog[];
          }
          let attempts: QuestionAttemptLog[] = [];
          let userXp = 0;
          if (Array.isArray(r.daily_tasks)) {
            const store = (r.daily_tasks as RoutineStorePayload[]).find((t) => t && t.id === '__sat_attempts_store__');
            if (store) {
              attempts = store.attempts || [];
              userXp = Number(store.xp) || 0;
            }
          }

          const p = profileMap.get(r.user_id);
          const solvedCount = attempts.length;
          const correctCount = attempts.filter((a) => a.isCorrect).length;
          const acc = solvedCount > 0 ? Math.round((correctCount / solvedCount) * 100) : 85;
          const scorePrediction = calculatePredictedScore(attempts);
          const userScore = solvedCount > 0 ? scorePrediction.compositeScore : (r.target_score || 1420);
          const finalXp = userXp > 0 ? userXp : Math.max(120, solvedCount * 15);

          return {
            id: r.user_id,
            name: p?.name || 'Digital SAT Scholar',
            avatar: p?.avatar || 'scholar',
            avatarUrl: p?.avatar_url || undefined,
            xp: finalXp,
            solvedCount: Math.max(1, solvedCount),
            accuracy: acc,
            predictedScore: userScore,
            league: 'diamond',
            rank: 1,
            isCurrentUser: r.user_id === currentUserId,
            isFollowing: followedSet.has(r.user_id)
          };
        });

        setCloudUsers(mappedUsers);
      } else {
        setCloudUsers([]);
      }
    } catch (err) {
      console.debug('[SatLeaderboard] Error fetching leaderboard:', err);
      setCloudUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId, viewScope]);

  useEffect(() => {
    fetchLeaderboardData();
  }, [fetchLeaderboardData]);

  // Real-time student search in Supabase (filtered for SAT scholars)
  useEffect(() => {
    let cancelled = false;
    const executeSearch = async () => {
      const q = searchQuery.trim();
      if (q.length < 2) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      if (!isSupabaseConfigured) {
        // Local benchmark search fallback
        const matches = BENCHMARK_COHORT.filter((u) => u.name.toLowerCase().includes(q.toLowerCase()));
        setSearchResults(matches);
        return;
      }

      setIsSearching(true);
      try {
        const { data: matches, error } = await supabase
          .from('profiles')
          .select('id, name, avatar, avatar_url')
          .ilike('name', `%${q}%`)
          .limit(10);

        if (!cancelled && !error && matches && matches.length > 0) {
          const matchIds = matches.map((m) => m.id);
          const { data: routines } = await supabase
            .from('sat_user_routines')
            .select('user_id, target_score, daily_tasks')
            .in('user_id', matchIds);

          const routineMap = new Map((routines || []).map((r) => [r.user_id, r]));

          const results: SatLeaderboardUser[] = matches
            .filter((p) => routineMap.has(p.id) || p.id === currentUserId)
            .map((p) => {
              const r = routineMap.get(p.id);
              interface RoutineStorePayload {
                id?: string;
                xp?: number;
                streak?: number;
                attempts?: QuestionAttemptLog[];
              }
              let attempts: QuestionAttemptLog[] = [];
              let userXp = 120;
              if (r && Array.isArray(r.daily_tasks)) {
                const store = (r.daily_tasks as RoutineStorePayload[]).find((t) => t && t.id === '__sat_attempts_store__');
                if (store) {
                  attempts = store.attempts || [];
                  userXp = Number(store.xp) || attempts.length * 15 || 120;
                }
              }
              const totalAtts = attempts.length;
              const correctAtts = attempts.filter((a) => a.isCorrect).length;
              const acc = totalAtts > 0 ? Math.round((correctAtts / totalAtts) * 100) : 85;
              const score = totalAtts > 0 ? calculatePredictedScore(attempts).compositeScore : (r?.target_score || 1420);

              return {
                id: p.id,
                name: p.name || 'Digital SAT Scholar',
                avatar: p.avatar || 'scholar',
                avatarUrl: p.avatar_url || undefined,
                xp: userXp,
                solvedCount: Math.max(1, totalAtts),
                accuracy: acc,
                predictedScore: score,
                league: 'diamond',
                rank: 1,
                isCurrentUser: p.id === currentUserId,
                isFollowing: followingIds.has(p.id)
              };
            });

          setSearchResults(results);
        } else if (!cancelled) {
          setSearchResults([]);
        }
      } catch {
        if (!cancelled) setSearchResults([]);
      } finally {
        if (!cancelled) setIsSearching(false);
      }
    };

    const timer = setTimeout(executeSearch, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchQuery, currentUserId, followingIds]);

  // Toggle follow action
  const handleToggleFollow = async (targetUserId: string) => {
    play('tap');
    if (!currentUserId || !isSupabaseConfigured) return;

    const isCurrentlyFollowing = followingIds.has(targetUserId);

    // Optimistic UI update
    setFollowingIds((prev) => {
      const next = new Set(prev);
      if (isCurrentlyFollowing) {
        next.delete(targetUserId);
      } else {
        next.add(targetUserId);
      }
      return next;
    });

    try {
      if (isCurrentlyFollowing) {
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', currentUserId)
          .eq('following_id', targetUserId);
      } else {
        await supabase
          .from('follows')
          .insert({ follower_id: currentUserId, following_id: targetUserId });
      }
    } catch (err) {
      console.warn('[SatLeaderboard] Toggle follow error:', err);
    }
  };

  // Compile final leaderboard list
  const displayList = useMemo(() => {
    const effectiveId = currentUserId || 'u-local-scholar';
    const currentUserXp = userState.xp > 0 ? userState.xp : 2650;

    const currentUserEntry: SatLeaderboardUser = {
      id: effectiveId,
      name: `${currentUserName} (You)`,
      avatar: 'hero',
      xp: currentUserXp,
      solvedCount: totalAttempts > 0 ? totalAttempts : Math.max(25, Math.round(currentUserXp / 12)),
      accuracy: userAccuracy,
      predictedScore: prediction.compositeScore || 1420,
      league: 'diamond',
      rank: 1,
      isCurrentUser: true
    };

    let list: SatLeaderboardUser[];

    if (cloudUsers.length > 0) {
      // If current user is in cloudUsers, update their data with live local stats
      const existsInCloud = cloudUsers.some((u) => u.id === effectiveId);
      if (existsInCloud) {
        list = cloudUsers.map((u) => (u.id === effectiveId ? currentUserEntry : u));
      } else {
        list = [...cloudUsers, currentUserEntry];
      }
    } else {
      // Fallback with benchmark cohort
      list = [...BENCHMARK_COHORT, currentUserEntry];
    }

    // Sort by XP descending
    list.sort((a, b) => b.xp - a.xp);
    list.forEach((u, i) => {
      u.rank = i + 1;
      u.isFollowing = followingIds.has(u.id);
    });

    return list;
  }, [cloudUsers, currentUserId, userState.xp, currentUserName, totalAttempts, userAccuracy, prediction.compositeScore, followingIds]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* ─── Header Card ────────────────────────────────────────────── */}
      <div className="glass p-8 sm:p-12 rounded-[3.5rem] border border-blue-500/20 text-center space-y-6 relative overflow-hidden shadow-2xl">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-2xl">
          <Trophy size={42} />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-wider">
            <Sparkles size={12} />
            <span>Diamond League Live Rankings</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-app-fg">
            SAT Global Leaderboard
          </h1>
          <p className="text-sm font-bold text-app-fg/60 max-w-lg mx-auto">
            Compete with classmates, master question micro-types, and climb the live SAT ranks worldwide.
          </p>
        </div>

        {/* View Scope & Timeframe Switches */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {/* Scope: Global vs Friends */}
          <div className="inline-flex items-center gap-1 p-1.5 rounded-2xl bg-panel border border-border-subtle shadow-sm">
            <button
              onClick={() => {
                play('toggle');
                setViewScope('global');
              }}
              className={clsx(
                "px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5",
                viewScope === 'global'
                  ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                  : "text-app-fg/60 hover:text-app-fg"
              )}
            >
              <Globe size={14} />
              <span>Global Scholars</span>
            </button>
            <button
              onClick={() => {
                play('toggle');
                setViewScope('friends');
              }}
              className={clsx(
                "px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5",
                viewScope === 'friends'
                  ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                  : "text-app-fg/60 hover:text-app-fg"
              )}
            >
              <Users size={14} />
              <span>Friends & Following</span>
            </button>
          </div>

          {/* Timeframe: Weekly vs All-Time */}
          <div className="inline-flex items-center gap-1 p-1.5 rounded-2xl bg-panel border border-border-subtle shadow-sm">
            <button
              onClick={() => {
                play('toggle');
                setTimeframe('weekly');
              }}
              className={clsx(
                "px-4 py-2 rounded-xl text-xs font-black transition-all",
                timeframe === 'weekly'
                  ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                  : "text-app-fg/60 hover:text-app-fg"
              )}
            >
              Weekly XP
            </button>
            <button
              onClick={() => {
                play('toggle');
                setTimeframe('allTime');
              }}
              className={clsx(
                "px-4 py-2 rounded-xl text-xs font-black transition-all",
                timeframe === 'allTime'
                  ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                  : "text-app-fg/60 hover:text-app-fg"
              )}
            >
              All-Time
            </button>
          </div>
        </div>
      </div>

      {/* ─── Search Friends Bar ───────────────────────────────────────── */}
      <div className="relative">
        <div className="flex items-center gap-3 p-2 rounded-2xl bg-panel border border-border-subtle focus-within:border-blue-500/50 transition shadow-md">
          <Search className="text-app-fg/40 ml-3 shrink-0" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search classmates & friends by name to follow..."
            className="flex-1 bg-transparent text-sm font-bold text-app-fg placeholder:text-app-fg/40 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 rounded-lg text-app-fg/40 hover:text-app-fg transition"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {searchQuery.trim().length >= 2 && (
          <div className="absolute top-full left-0 right-0 mt-2 z-30 glass rounded-2xl border border-blue-500/30 p-3 shadow-2xl space-y-2">
            <div className="flex items-center justify-between px-2 pb-1 border-b border-border-subtle text-[11px] font-black uppercase text-app-fg/50">
              <span>Search Results ({searchResults.length})</span>
              {isSearching && <span className="animate-pulse text-blue-400">Searching...</span>}
            </div>

            {searchResults.length === 0 && !isSearching ? (
              <p className="p-4 text-center text-xs font-bold text-app-fg/50">
                No scholars found with &quot;{searchQuery}&quot;. Check the spelling or invite your friend!
              </p>
            ) : (
              searchResults.map((scholar) => (
                <div
                  key={scholar.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-panel/60 hover:bg-panel border border-border-subtle transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center font-black text-xs text-blue-400">
                      {scholar.name[0]?.toUpperCase() || 'S'}
                    </div>
                    <div>
                      <h5 className="font-black text-xs text-app-fg">{scholar.name}</h5>
                      <span className="text-[10px] text-app-fg/50 font-bold">
                        {scholar.xp} XP • Predicted {scholar.predictedScore}
                      </span>
                    </div>
                  </div>

                  {!scholar.isCurrentUser && (
                    <button
                      onClick={() => handleToggleFollow(scholar.id)}
                      className={clsx(
                        "px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1",
                        followingIds.has(scholar.id)
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-blue-500 hover:bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      )}
                    >
                      {followingIds.has(scholar.id) ? (
                        <>
                          <UserCheck size={13} />
                          <span>Following</span>
                        </>
                      ) : (
                        <>
                          <UserPlus size={13} />
                          <span>Follow</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* ─── Leaderboard Table List ───────────────────────────────────── */}
      <div className="glass rounded-[2.5rem] border border-border-subtle p-4 sm:p-6 space-y-2.5 shadow-xl">
        {isLoading ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-black uppercase tracking-wider text-app-fg/50">
              Loading Live Scholar Rankings...
            </p>
          </div>
        ) : displayList.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Users size={36} className="text-app-fg/30 mx-auto" />
            <h4 className="text-base font-black text-app-fg">No friends in your leaderboard yet</h4>
            <p className="text-xs font-bold text-app-fg/50 max-w-sm mx-auto">
              Search your friends above and click &quot;Follow&quot; to track their daily SAT progress and compete together!
            </p>
          </div>
        ) : (
          displayList.map((scholar) => {
            const isTop3 = scholar.rank <= 3;
            const rankColors = {
              1: 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-lg shadow-amber-400/20',
              2: 'bg-slate-300 text-slate-950 border-slate-200 font-black',
              3: 'bg-amber-700 text-white border-amber-600 font-black'
            };

            return (
              <div
                key={scholar.id}
                className={clsx(
                  "p-4 sm:p-5 rounded-2xl border transition-all flex items-center justify-between gap-4",
                  scholar.isCurrentUser
                    ? "bg-blue-500/10 border-blue-500/60 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/30"
                    : "bg-panel/40 border-border-subtle hover:bg-panel hover:border-blue-500/30"
                )}
              >
                {/* Rank & User Info */}
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <span
                    className={clsx(
                      "w-8 h-8 sm:w-9 sm:h-9 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center shrink-0 border",
                      isTop3
                        ? rankColors[scholar.rank as 1 | 2 | 3]
                        : "bg-panel border-border-subtle text-app-fg/60"
                    )}
                  >
                    {scholar.rank}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-black text-sm sm:text-base text-app-fg truncate">
                        {scholar.name}
                      </h4>
                      {scholar.isCurrentUser && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-500 text-white shadow-sm shrink-0">
                          YOU
                        </span>
                      )}
                      {scholar.isFollowing && !scholar.isCurrentUser && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
                          Friend
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-app-fg/50 font-bold mt-0.5">
                      <span>{scholar.solvedCount} solved</span>
                      <span>•</span>
                      <span>{scholar.accuracy}% accuracy</span>
                    </div>
                  </div>
                </div>

                {/* Follow Button, Predicted Score & XP */}
                <div className="flex items-center gap-3 sm:gap-6 shrink-0 text-right">
                  {!scholar.isCurrentUser && currentUserId && (
                    <button
                      onClick={() => handleToggleFollow(scholar.id)}
                      title={followingIds.has(scholar.id) ? "Unfollow friend" : "Follow friend"}
                      className={clsx(
                        "hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition",
                        followingIds.has(scholar.id)
                          ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30"
                          : "bg-panel border border-border-subtle text-app-fg/70 hover:bg-blue-500 hover:text-white"
                      )}
                    >
                      {followingIds.has(scholar.id) ? (
                        <>
                          <UserCheck size={13} />
                          <span>Following</span>
                        </>
                      ) : (
                        <>
                          <UserPlus size={13} />
                          <span>Follow</span>
                        </>
                      )}
                    </button>
                  )}

                  <div className="hidden sm:block text-right">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 block">
                      Predicted
                    </span>
                    <span className="text-base font-black text-app-fg">
                      {scholar.predictedScore}
                    </span>
                  </div>

                  <div className="text-right min-w-[70px]">
                    <div className="flex items-center justify-end gap-1 text-amber-400 font-black text-sm sm:text-lg">
                      <Zap size={15} fill="currentColor" />
                      <span>{scholar.xp}</span>
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-bold text-app-fg/40 uppercase tracking-widest block">
                      {timeframe === 'weekly' ? 'Weekly XP' : 'Total XP'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
