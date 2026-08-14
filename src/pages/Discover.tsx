import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Users, Flame, Trophy, UserPlus, UserCheck, X } from 'lucide-react';
import { useUserStore, type LeaderboardUser } from '@/store/userStore';
import { useSettingsStore } from '@/store/settingsStore';
import IconAvatar from '@/components/common/IconAvatar';

/**
 * Discover — global learner search.
 *
 * Wires `userStore.searchUsers` to the database so users can find and follow
 * other learners anywhere in the app. Previously the follow graph existed but
 * had no entry point — Profile was the only place with a follower/follower count
 * and no input to discover new accounts.
 */
export default function Discover() {
  const { searchUsers, toggleFollow, isFollowing } = useUserStore();
  const { language } = useSettingsStore();
  const isBn = language === 'bn';

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});

  const t = {
    title: isBn ? 'শিক্ষার্থীদের খুঁজুন' : 'Discover learners',
    sub: isBn
      ? 'নাম লিখে অন্য শিক্ষার্থীদের খুঁজুন এবং ফলো করুন।'
      : 'Type a name to find other learners and follow them.',
    placeholder: isBn ? 'নাম লিখুন... (কমপক্ষে ২ অক্ষর)' : 'Type a name… (at least 2 characters)',
    empty: isBn ? 'কোনো শিক্ষার্থী পাওয়া যায়নি' : 'No learners found',
    tooShort: isBn ? 'কমপক্ষে ২ অক্ষর লিখুন' : 'Type at least 2 characters to search',
    follow: isBn ? 'ফলো' : 'Follow',
    following: isBn ? 'ফলো করছেন' : 'Following',
    errorPrefix: isBn ? 'একটি সমস্যা হয়েছে' : 'Something went wrong',
  };

  // Debounced search so we don't hit Supabase on every keystroke.
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setError(null);
      return;
    }

    const handle = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const users = await searchUsers(query.trim());
        setResults(users);
      } catch (err) {
        if (import.meta.env.DEV) console.error('[Discover] search failed:', err);
        setError(t.errorPrefix);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(handle);
  }, [query, searchUsers, t.errorPrefix]);

  // Hydrate the follow state for each result so we don't flicker.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const next: Record<string, boolean> = {};
      for (const u of results) {
        if (cancelled) return;
        next[u.id] = await isFollowing(u.id);
      }
      if (!cancelled) setFollowingMap(next);
    })();
    return () => {
      cancelled = true;
    };
  }, [results, isFollowing]);

  const handleToggleFollow = useCallback(
    async (userId: string) => {
      await toggleFollow(userId);
      setFollowingMap((prev) => ({ ...prev, [userId]: !prev[userId] }));
    },
    [toggleFollow],
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 pb-24">
      <header className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black text-xs uppercase tracking-[0.3em]">
          <Users size={14} />
          {isBn ? 'ডিসকভার' : 'DISCOVER'}
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">{t.title}</h1>
        <p className="text-app-fg/60 font-bold max-w-md mx-auto">{t.sub}</p>
      </header>

      {/* Search input */}
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-app-fg/40 pointer-events-none"
          size={20}
          aria-hidden="true"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.placeholder}
          aria-label={t.placeholder}
          className="w-full pl-12 pr-12 py-4 rounded-2xl bg-panel border-2 border-border-subtle focus:border-blue-500/50 focus:outline-none font-bold text-lg"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label={isBn ? 'ক্লিয়ার' : 'Clear search'}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-app-fg/40 hover:text-app-fg hover:bg-white/5"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Results */}
      {error && (
        <div className="bg-rose-500/10 border-2 border-rose-500/30 text-rose-400 rounded-2xl p-4 font-bold text-center">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center text-app-fg/50 font-bold py-12 animate-pulse">
          {isBn ? 'খোঁজা হচ্ছে…' : 'Searching…'}
        </div>
      )}

      {!loading && !error && query.trim().length < 2 && (
        <div className="text-center text-app-fg/40 font-bold py-12">
          {t.tooShort}
        </div>
      )}

      {!loading && !error && query.trim().length >= 2 && results.length === 0 && (
        <div className="text-center text-app-fg/40 font-bold py-12">
          {t.empty}
        </div>
      )}

      <AnimatePresence>
        <div className="space-y-2">
          {results.map((u, idx) => {
            const isFollowed = !!followingMap[u.id];
            return (
              <motion.div
                key={u.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="bg-panel border-2 border-border-subtle rounded-2xl p-4 flex items-center gap-4"
              >
                <div className="shrink-0">
                  <IconAvatar name={u.avatar} size={48} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-black truncate">{u.name}</div>
                  <div className="flex items-center gap-3 text-xs text-app-fg/50 font-bold mt-1">
                    <span className="flex items-center gap-1">
                      <Trophy size={12} className="text-amber-400" />
                      {(u.xp ?? 0).toLocaleString()} XP
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame size={12} className="text-amber-500" />
                      {u.streak}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleFollow(u.id)}
                  aria-pressed={isFollowed}
                  aria-label={isFollowed ? `Unfollow ${u.name}` : `Follow ${u.name}`}
                  className={`shrink-0 px-4 py-2 rounded-xl font-black text-sm inline-flex items-center gap-2 transition-colors ${
                    isFollowed
                      ? 'bg-emerald-500/10 text-emerald-400 border-2 border-emerald-500/30 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {isFollowed ? <UserCheck size={16} /> : <UserPlus size={16} />}
                  <span className="hidden md:inline">
                    {isFollowed ? t.following : t.follow}
                  </span>
                </button>
              </motion.div>
            );
          })}
        </div>
      </AnimatePresence>
    </div>
  );
}
