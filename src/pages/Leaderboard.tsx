import { motion } from 'framer-motion';
import { useUserStore, type LeaderboardUser } from '@/store/userStore';
import { useSettingsStore } from '@/store/settingsStore';
import { Trophy, ArrowUp, ArrowDown, Search, X } from 'lucide-react';
import IconAvatar from '@/components/common/IconAvatar';
import { clsx } from 'clsx';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function LeaderboardView() {
  const { league } = useUserStore();
  const { loadLeaderboard, loadFriendsLeaderboard, toggleFollow, searchUsers } = useUserStore();
  const { language } = useSettingsStore();
  const [filter, setFilter] = useState<'global' | 'friends'>('global');
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LeaderboardUser[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    // Cancellation flag — if filter/league change mid-fetch (e.g. user toggles
    // GLOBAL↔FRIENDS faster than the network responds), discard stale writes
    // instead of overwriting the new state with old data.
    let cancelled = false;
    const fetchLeaderboard = async () => {
      setLoading(true);
      const data = filter === 'global' ? await loadLeaderboard() : await loadFriendsLeaderboard();
      if (cancelled) return;
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      // Fetch following status for all users in view
      if (userId) {
        const { data: follows } = await supabase.from('follows').select('following_id').eq('follower_id', userId);
        if (!cancelled) setFollowingIds(new Set(follows?.map(f => f.following_id) || []));
      }

      const mapped = data.map((u) => ({
        ...u,
        isMe: u.id === userId
      }));

      if (!cancelled) {
        setUsers(mapped);
        setLoading(false);
      }
    };
    fetchLeaderboard();
    return () => { cancelled = true; };
  }, [loadLeaderboard, loadFriendsLeaderboard, filter, league]);

  useEffect(() => {
    let cancelled = false;
    const handleSearch = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }
      setSearching(true);
      const results = await searchUsers(searchQuery);
      if (cancelled) return;
      setSearchResults(results);
      setSearching(false);
    };

    const timer = setTimeout(handleSearch, 500);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [searchQuery, searchUsers]);

  const handleToggleFollow = async (targetId: string) => {
    await toggleFollow(targetId);
    setFollowingIds(prev => {
      const next = new Set(prev);
      if (next.has(targetId)) next.delete(targetId);
      else next.add(targetId);
      return next;
    });
  };

  if (loading) return <div className="p-20 text-center text-app-fg/40 font-black animate-pulse uppercase tracking-widest">{language === 'bn' ? 'লোড হচ্ছে...' : 'LOADING...'}</div>;



  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.5, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring' }}
          className="w-24 h-24 mx-auto glass rounded-3xl flex items-center justify-center text-violet-400 shadow-[0_0_40px_rgba(168,85,247,0.3)] mb-4"
        >
          <Trophy size={48} strokeWidth={2.5} />
        </motion.div>
        <h1 className="text-3xl font-black uppercase tracking-tighter">
          {filter === 'friends' 
            ? (language === 'bn' ? 'ফ্রেন্ডস লিগ' : 'FRIENDS LEAGUE')
            : (language === 'bn' ? `${league} লিগ` : `${league} LEAGUE`)
          }
        </h1>
        <p className="text-gray-400 max-w-md mx-auto">
          {filter === 'friends'
            ? (language === 'bn' ? 'আপনার বন্ধুদের মধ্যে নিজস্ব অবস্থান দেখুন।' : 'See how you rank against your friends!')
            : (language === 'bn' ? 'আপনার লিগের অন্যদের সাথে প্রতিযোগিতা করুন। শীর্ষ ৩ জন পরবর্তী লিগে উত্তীর্ণ হবেন!' : 'Compete with others in your league. Top 3 move up!')
          }
        </p>

        {/* Filter Toggle */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-6">
          <div className="bg-panel border-2 border-border-subtle p-1 rounded-2xl flex gap-1 items-center">
            <button
              onClick={() => {
                setFilter('global');
                setSearchQuery('');
                setSearchResults([]);
              }}
              className={clsx(
                "px-6 py-2 rounded-xl font-black text-xs transition-all uppercase tracking-widest",
                filter === 'global' ? "bg-blue-500 text-white shadow-lg" : "text-app-fg/40 hover:text-app-fg"
              )}
            >
              {language === 'bn' ? 'গ্লোবাল' : 'GLOBAL'}
            </button>
            <button
              onClick={() => {
                setFilter('friends');
                setSearchQuery('');
                setSearchResults([]);
              }}
              className={clsx(
                "px-6 py-2 rounded-xl font-black text-xs transition-all uppercase tracking-widest",
                filter === 'friends' ? "bg-blue-500 text-white shadow-lg" : "text-app-fg/40 hover:text-app-fg"
              )}
            >
              {language === 'bn' ? 'বন্ধু' : 'FRIENDS'}
            </button>
          </div>

          <div className="relative w-full max-w-xs group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-app-fg/30 group-focus-within:text-blue-400 transition-colors" size={18} />
            <input
              type="text"
              placeholder={language === 'bn' ? 'বন্ধু খুঁজুন...' : 'Find friends...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-panel border-2 border-border-subtle rounded-2xl py-2 pl-12 pr-10 text-sm font-bold focus:border-blue-500/50 outline-none transition-all placeholder:text-app-fg/20"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-white/5 text-app-fg/30"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search Results Overlay */}
      {searchQuery.length >= 2 && (
        <div className="space-y-2 animate-slide-up">
          <div className="text-xs font-black text-blue-400 uppercase tracking-widest px-2 mb-3 flex items-center gap-2">
            <Search size={14} />
            {language === 'bn' ? 'রেজাল্ট সার্চ করুন' : 'SEARCH RESULTS'}
            {searching && <div className="w-3 h-3 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />}
          </div>
          {searchResults.length === 0 && !searching ? (
            <div className="glass p-8 rounded-2xl text-center text-app-fg/40 font-bold italic">
              {language === 'bn' ? 'কাউকে খুঁজে পাওয়া যায়নি' : 'No users found'}
            </div>
          ) : (
            searchResults.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 px-6 py-4 rounded-2xl glass hover:bg-white/5 transition-all border border-blue-500/10 shadow-lg shadow-blue-500/5"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <IconAvatar name={user.avatar} size={24} />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-lg">{user.name}</div>
                  <div className="text-[10px] uppercase font-black text-blue-400/60 tracking-wider">
                    {user.league} LEAGUE • {user.xp} XP
                  </div>
                </div>
                <button
                  onClick={() => handleToggleFollow(user.id)}
                  className={clsx(
                    'px-4 py-2 rounded-xl text-xs font-black transition-all active:scale-95',
                    followingIds.has(user.id)
                      ? 'bg-app-fg-muted/10 text-app-fg-muted hover:bg-rose-500/10 hover:text-rose-400'
                      : 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                  )}
                >
                  {followingIds.has(user.id) 
                    ? (language === 'bn' ? 'ফলো করা হয়েছে' : 'FOLLOWING') 
                    : (language === 'bn' ? 'ফলো করুন' : 'FOLLOW')}
                </button>
              </motion.div>
            ))
          )}
          <div className="h-8" /> {/* Spacer */}
        </div>
      )}

      {!searchQuery && (
        <>
          {/* Podium (Top 3) */}
          <div className="flex justify-center items-end gap-2 md:gap-4 h-64 mt-12 mb-8">
            {[1, 0, 2].map((idx) => {
              const user = users[idx];
              if (!user) return null;
              
              const height = idx === 0 ? 'h-48' : idx === 1 ? 'h-36' : 'h-28';
              const color = idx === 0 ? 'text-amber-400 bg-amber-400/20' : idx === 1 ? 'text-gray-300 bg-gray-300/20' : 'text-[#cd7f32] bg-[#cd7f32]/20';
              const delay = idx === 0 ? 0.3 : idx === 1 ? 0.4 : 0.5;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay, type: 'spring' }}
                  className="flex flex-col items-center w-24 md:w-32 relative group"
                >
                  <div className="mb-2">
                    <IconAvatar name={user.avatar} size={32} />
                  </div>
                  <div className="text-xs font-bold mb-1 truncate w-full text-center px-2">{user.name}</div>
                  <div className="text-[10px] text-blue-400 font-mono mb-2">{user.xp} XP</div>
                  
                  <div className={clsx(
                    'w-full rounded-t-2xl flex flex-col items-center justify-start pt-4 transition-all',
                    height, color,
                    user.isMe ? 'shadow-[0_0_30px_rgba(168,85,247,0.4)]' : ''
                  )}>
                    <div className="text-4xl font-black opacity-50">{idx + 1}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Promotion Zone Info */}
          <div className="glass px-6 py-3 rounded-2xl flex items-center justify-center gap-3 text-sm text-emerald-400 border border-emerald-500/20 bg-emerald-500/5">
            <ArrowUp size={18} strokeWidth={3} />
            {language === 'bn' ? 'শীর্ষ ৩ জন উত্তীর্ণ হবেন' : 'TOP 3 WILL BE PROMOTED'}
          </div>
        </>
      )}

      {/* List */}
      {!searchQuery && (
        <div className="space-y-2">
          {users.map((user, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={clsx(
                'flex items-center gap-4 px-6 py-4 rounded-2xl transition-all',
                user.isMe ? 'glass border-2 border-brand shadow-lg scale-[1.02]' : 'hover:bg-white/5',
                i === 3 && 'border-t-2 border-t-emerald-500/30 rounded-t-none mt-4', // promotion line
                i === users.length - 3 && 'border-t-2 border-t-rose-500/30 rounded-t-none mt-4' // demotion line
              )}
            >
              <div className={clsx(
                'w-8 text-center font-bold text-lg',
                i === 0 ? 'text-amber-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-[#cd7f32]' : 'text-gray-500'
              )}>
                {i + 1}
              </div>
              
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <IconAvatar name={user.avatar} size={24} />
              </div>
              
              <div className="flex-1">
                <div className="font-bold text-lg">{user.name}</div>
                <div className="text-xs text-blue-400 font-mono">{user.xp} XP</div>
              </div>

              {!user.isMe && (
                <button
                  onClick={() => handleToggleFollow(user.id)}
                  className={clsx(
                    'px-4 py-2 rounded-xl text-xs font-black transition-all active:scale-95',
                    followingIds.has(user.id)
                      ? 'bg-app-fg-muted/10 text-app-fg-muted hover:bg-rose-500/10 hover:text-rose-400'
                      : 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                  )}
                >
                  {followingIds.has(user.id) 
                    ? (language === 'bn' ? 'ফলো করা হয়েছে' : 'FOLLOWING') 
                    : (language === 'bn' ? 'ফলো করুন' : 'FOLLOW')}
                </button>
              )}
            </motion.div>
          ))}
          
          {/* Demotion Zone Info */}
          <div className="glass px-6 py-3 rounded-2xl flex items-center justify-center gap-3 text-sm text-rose-400 border border-rose-500/20 bg-rose-500/5 mt-4">
            <ArrowDown size={18} strokeWidth={3} />
            {language === 'bn' ? 'নিচের ৩ জনের অবনমন হবে' : 'BOTTOM 3 WILL BE DEMOTED'}
          </div>
        </div>
      )}
    </div>
  );
}
