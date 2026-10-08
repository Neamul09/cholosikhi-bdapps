import { useState, useEffect, useCallback } from 'react';
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
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import IconAvatar from '@/components/common/IconAvatar';
import { fetchSatLeaderboard, searchSatScholars } from '../lib/satLeaderboardService';
import type { SatLeaderboardUser } from '../types';
import { play } from '../../lib/audio';

export default function SatLeaderboard() {
  const [timeframe, setTimeframe] = useState<'weekly' | 'allTime'>('weekly');
  const [viewScope, setViewScope] = useState<'global' | 'friends'>('global');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SatLeaderboardUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [scholars, setScholars] = useState<SatLeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuthStore();
  const userStore = useUserStore();

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchSatLeaderboard({
        scope: viewScope,
        timeframe,
        limit: 50
      });
      setScholars(data);
    } catch (err) {
      console.debug('[SatLeaderboard] fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [viewScope, timeframe]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Real-time student search in SAT
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const matches = await searchSatScholars(q);
        setSearchResults(matches);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Toggle follow action
  const handleToggleFollow = async (targetUserId: string) => {
    play('tap');
    await userStore.toggleFollow(targetUserId);
    // Refresh current leaderboard & search results
    loadData();
    const q = searchQuery.trim();
    if (q.length >= 2) {
      const matches = await searchSatScholars(q);
      setSearchResults(matches);
    }
  };

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
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center font-black text-xs text-blue-400 overflow-hidden">
                      {scholar.avatarUrl ? (
                        <img src={scholar.avatarUrl} alt={scholar.name} className="w-full h-full object-cover" />
                      ) : (
                        <IconAvatar name={scholar.avatar} size={16} />
                      )}
                    </div>
                    <div>
                      <h5 className="font-black text-xs text-app-fg">{scholar.name}</h5>
                      <span className="text-[10px] text-app-fg/50 font-bold">
                        {scholar.xp} XP • Predicted {scholar.predictedScore}
                      </span>
                    </div>
                  </div>

                  {!scholar.isCurrentUser && user?.id && (
                    <button
                      onClick={() => handleToggleFollow(scholar.id)}
                      className={clsx(
                        "px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1",
                        scholar.isFollowing
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-blue-500 hover:bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      )}
                    >
                      {scholar.isFollowing ? (
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
        ) : scholars.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Users size={36} className="text-app-fg/30 mx-auto" />
            <h4 className="text-base font-black text-app-fg">No friends in your leaderboard yet</h4>
            <p className="text-xs font-bold text-app-fg/50 max-w-sm mx-auto">
              Search your friends above and click &quot;Follow&quot; to track their daily SAT progress and compete together!
            </p>
          </div>
        ) : (
          scholars.map((scholar) => {
            const isTop3 = scholar.rank <= 3;
            const rankColors = {
              1: 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-lg shadow-amber-400/20',
              2: 'bg-slate-300 text-slate-950 border-slate-200 font-black',
              3: 'bg-amber-700 text-white border-amber-600 font-black'
            };

            return (
              <div
                key={`${scholar.id}-${scholar.rank}`}
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

                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 overflow-hidden shrink-0 border border-blue-500/20">
                    {scholar.avatarUrl ? (
                      <img src={scholar.avatarUrl} alt={scholar.name} className="w-full h-full object-cover" />
                    ) : (
                      <IconAvatar name={scholar.avatar} size={20} />
                    )}
                  </div>

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
                  {!scholar.isCurrentUser && user?.id && (
                    <button
                      onClick={() => handleToggleFollow(scholar.id)}
                      title={scholar.isFollowing ? "Unfollow friend" : "Follow friend"}
                      className={clsx(
                        "hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition",
                        scholar.isFollowing
                          ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30"
                          : "bg-panel border border-border-subtle text-app-fg/70 hover:bg-blue-500 hover:text-white"
                      )}
                    >
                      {scholar.isFollowing ? (
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
