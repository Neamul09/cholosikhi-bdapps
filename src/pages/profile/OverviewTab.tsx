import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, BookOpen, Clock, Target, Flame, BarChart3, Edit2, Share2, Check, User as UserIcon,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useUserStore, getLevelProgress, type LeaderboardUser } from '@/store/userStore';
import { useSettingsStore } from '@/store/settingsStore';
import IconAvatar from '@/components/common/IconAvatar';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from 'recharts';
import { LEAGUES, LEAGUE_NAMES, LEAGUE_ICONS, LEAGUE_COLORS, type League } from './league';
import AvatarModal from './AvatarModal';

export default function OverviewTab() {
  const {
    name, avatar, avatarUrl, level, totalXp, streak, league, lessonsCompleted,
    totalTimeMinutes, xpHistory, followersCount, followingCount,
    loadFriendsLeaderboard, searchUsers, toggleFollow,
  } = useUserStore();
  const { language } = useSettingsStore();

  const progress = getLevelProgress(totalXp);

  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [friends, setFriends] = useState<LeaderboardUser[]>([]);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LeaderboardUser[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadFriendsLeaderboard().then(setFriends);
  }, [loadFriendsLeaderboard]);

  useEffect(() => {
    const term = query.trim();
    if (!term) {
      setResults([]);
      return;
    }
    setSearching(true);
    const id = window.setTimeout(async () => {
      try {
        const r = await searchUsers(term);
        setResults(r);
      } finally {
        setSearching(false);
      }
    }, 250);
    return () => window.clearTimeout(id);
  }, [query, searchUsers]);

  const handleShare = useCallback(async () => {
    const shareData = {
      title: 'py.cholosikhi Profile',
      text: `Check out my progress on py.cholosikhi! I'm level ${level} with ${totalXp} XP.`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 2000);
      }
    } catch (err) {
      console.log('Error sharing:', err);
    }
  }, [level, totalXp]);

  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    return { name: dayName, xp: xpHistory[dateStr] || 0, fullDate: dateStr };
  });

  const onFollow = useCallback(async (userId: string) => {
    await toggleFollow(userId);
    const term = query.trim();
    if (term) {
      const r = await searchUsers(term);
      setResults(r);
    }
  }, [toggleFollow, query, searchUsers]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      <div className="md:col-span-5 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-6 text-center border-t border-brand-500/30"
        >
          <div className="relative w-24 h-24 mx-auto mb-4 group">
            <div className="w-full h-full bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 border-2 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.2)] overflow-hidden">
              {avatarUrl
                ? <img src={avatarUrl} alt={name || 'avatar'} className="w-full h-full object-cover" />
                : <IconAvatar name={avatar} size={48} strokeWidth={2.5} />}
            </div>
            <button
              onClick={() => setIsEditingAvatar(true)}
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-app-bg border-2 border-border-subtle rounded-xl flex items-center justify-center text-blue-400 shadow-xl hover:scale-110 active:scale-90 transition-all z-10"
              aria-label={language === 'bn' ? 'অবতার পরিবর্তন' : 'Change avatar'}
            >
              <Edit2 size={14} />
            </button>
          </div>
          <div>
            <div className="flex items-center justify-center gap-3">
              <h1 className="text-2xl font-black">{name || 'কোডার'}</h1>
              <button
                onClick={handleShare}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-brand-400 hover:bg-brand-500/10 transition-colors"
                aria-label="Share profile"
              >
                <Share2 size={16} />
              </button>
            </div>
            <p className="text-brand-400 font-bold text-sm mt-1">Level {level} • {totalXp} XP</p>
            <div className="flex items-center justify-center gap-4 mt-2 text-sm">
              <div className="flex flex-col items-center">
                <span className="font-black text-app-fg">{followingCount}</span>
                <span className="text-app-fg-muted uppercase text-[10px] tracking-widest">
                  {language === 'bn' ? 'ফলোয়িং' : 'Following'}
                </span>
              </div>
              <div className="w-px h-4 bg-app-fg/10" />
              <div className="flex flex-col items-center">
                <span className="font-black text-app-fg">{followersCount}</span>
                <span className="text-app-fg-muted uppercase text-[10px] tracking-widest">
                  {language === 'bn' ? 'ফলোয়ার' : 'Followers'}
                </span>
              </div>
            </div>
          </div>
          <div className="h-2 bg-app-fg/10 rounded-full w-48 mx-auto mb-2 overflow-hidden">
            <motion.div
              className="h-full gradient-brand rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(progress.xpInLevel / progress.nextLevelXp) * 100}%` }}
            />
          </div>
          <p className="text-xs text-app-fg-muted">
            {language === 'bn'
              ? `পরবর্তী লেভেলের জন্য ${progress.remaining} এক্সপি দরকার`
              : `${progress.remaining} XP needed for next level`}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          <div className="glass p-4 rounded-2xl flex flex-col gap-2">
            <Flame className="text-amber-500" size={24} />
            <div className="text-2xl font-black">{streak}</div>
            <div className="text-xs text-app-fg-muted">ডেইলি স্ট্রিক</div>
          </div>
          <div className="glass p-4 rounded-2xl flex flex-col gap-2">
            <Zap className="text-brand-400" size={24} />
            <div className="text-2xl font-black">{totalXp}</div>
            <div className="text-xs text-app-fg-muted">টোটাল এক্সপি</div>
          </div>
          <div className="glass p-4 rounded-2xl flex flex-col gap-2">
            <BookOpen className="text-emerald-400" size={24} />
            <div className="text-2xl font-black">{lessonsCompleted}</div>
            <div className="text-xs text-app-fg-muted">সম্পন্নকৃত পাঠ</div>
          </div>
          <div className="glass p-4 rounded-2xl flex flex-col gap-2">
            <Clock className="text-cyan-400" size={24} />
            <div className="text-2xl font-black">{totalTimeMinutes}m</div>
            <div className="text-xs text-app-fg-muted">ব্যয়িত সময়</div>
          </div>
        </div>

        <div className="glass p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-sm uppercase tracking-widest text-app-fg/40 flex items-center gap-2">
              <BarChart3 size={16} />
              {language === 'bn' ? 'সাপ্তাহিক অগ্রগতি' : 'WEEKLY PROGRESS'}
            </h3>
            <div className="text-xs font-bold text-blue-400">
              {chartData.reduce((acc, curr) => acc + curr.xp, 0)} XP This Week
            </div>
          </div>
          <div className="h-48 w-full min-h-[192px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'currentColor', opacity: 0.4, fontSize: 10, fontWeight: 700 }}
                  dy={10}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(59, 130, 246, 0.1)', radius: 8 }}
                  contentStyle={{
                    backgroundColor: '#0d1b35',
                    borderRadius: '16px',
                    border: '2px solid rgba(59, 130, 246, 0.2)',
                    fontWeight: '800',
                  }}
                  itemStyle={{ color: '#60a5fa' }}
                />
                <Bar dataKey="xp" radius={[6, 6, 6, 6]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.xp > 0 ? '#3b82f6' : 'rgba(255,255,255,0.05)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="md:col-span-7 space-y-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-3xl p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 blur-[100px] rounded-full" />
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">বর্তমান লিগ</h2>
            <div
              className="text-sm font-bold px-3 py-1 rounded-full bg-white/10"
              style={{ color: LEAGUE_COLORS[league as League] }}
            >
              {LEAGUE_NAMES[league as League][language === 'bn' ? 'bn' : 'en']}
            </div>
          </div>
          <div className="flex justify-between px-2 mb-2 relative z-10">
            {LEAGUES.map((l, i) => {
              const Icon = LEAGUE_ICONS[l];
              const reached = i <= LEAGUES.indexOf(league as League);
              return (
                <div
                  key={l}
                  className={clsx(
                    'flex flex-col items-center gap-2',
                    reached ? 'opacity-100' : 'opacity-30 grayscale',
                  )}
                >
                  <Icon size={24} style={{ color: LEAGUE_COLORS[l] }} />
                  {l === league && (
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: LEAGUE_COLORS[l] }} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="h-1 bg-white/10 w-full mt-2 relative overflow-hidden rounded-full">
            <motion.div
              className="absolute top-0 left-0 h-full gradient-brand"
              animate={{ width: `${(LEAGUES.indexOf(league as League) / 5) * 100}%` }}
            />
          </div>
          <p className="text-xs text-center text-gray-500 mt-4">
            পরবর্তী লিগে যেতে শীর্ষ ৩ জনের মধ্যে থাকুন!
          </p>
        </motion.div>

        <div className="glass rounded-3xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Target className="text-emerald-400" size={20} />
              সাপ্তাহিক লিডারবোর্ড
            </h2>
            <span className="text-xs text-gray-500">Resets in 2d 14h</span>
          </div>
          <div className="space-y-2">
            {friends.length === 0 && (
              <p className="text-sm text-app-fg/40 text-center py-6">
                {language === 'bn'
                  ? 'কোনো ফ্রেন্ড নেই — সার্চে নাম লিখে যোগ দিন।'
                  : 'No friends yet — search below to add some.'}
              </p>
            )}
            {friends.map((f, i) => (
              <div
                key={`${f.id}-${i}`}
                className={clsx(
                  'flex items-center gap-4 p-3 rounded-2xl',
                  f.isMe ? 'bg-brand-500/10 border border-brand-500/20' : 'hover:bg-white/5',
                )}
              >
                <div
                  className={clsx(
                    'w-8 h-8 flex items-center justify-center font-bold text-sm rounded-full bg-white/5',
                    i === 0 && 'text-amber-400 bg-amber-400/10',
                    i === 1 && 'text-gray-300 bg-gray-300/10',
                    i === 2 && 'text-[#cd7f32] bg-[#cd7f32]/10',
                  )}
                >
                  {i + 1}
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 overflow-hidden">
                  {f.avatarUrl
                    ? <img src={f.avatarUrl} alt={f.name} className="w-full h-full object-cover" />
                    : <IconAvatar name={f.avatar} size={20} />}
                </div>
                <div className="flex-1 font-bold">{f.name}</div>
                <div className="text-brand-400 font-mono text-sm">{f.xp} XP</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-3xl p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <UserIcon className="text-blue-400" size={20} />
            {language === 'bn' ? 'শিক্ষার্থী খুঁজুন' : 'Find learners'}
          </h2>
          <div className="relative">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={language === 'bn' ? 'নাম লিখুন...' : 'Type a name...'}
              className="w-full bg-app-bg border-2 border-border-subtle rounded-2xl px-4 py-3 outline-none focus:border-blue-500 transition-all font-bold placeholder:text-app-fg/30"
              aria-label={language === 'bn' ? 'ব্যবহারকারী খুঁজুন' : 'Search users'}
            />
          </div>
          <div className="mt-4 space-y-2 min-h-[60px]">
            {query.trim() && !searching && results.length === 0 && (
              <p className="text-sm text-app-fg/40 text-center py-4">
                {language === 'bn' ? 'কোনো মিল পাওয়া যায়নি' : 'No matches found'}
              </p>
            )}
            {searching && (
              <p className="text-sm text-app-fg/40 text-center py-4">
                {language === 'bn' ? 'খোঁজা হচ্ছে...' : 'Searching...'}
              </p>
            )}
            {results.map((u) => (
              <div key={u.id} className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white/5">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 overflow-hidden">
                  {u.avatarUrl
                    ? <img src={u.avatarUrl} alt={u.name} className="w-full h-full object-cover" />
                    : <IconAvatar name={u.avatar} size={20} />}
                </div>
                <div className="flex-1">
                  <div className="font-bold">{u.name}</div>
                  <div className="text-xs text-app-fg/40 font-mono">{u.xp} XP</div>
                </div>
                <button
                  onClick={() => onFollow(u.id)}
                  className={clsx(
                    'px-3 py-1.5 rounded-xl text-xs font-black transition-colors',
                    u.isFollowing
                      ? 'bg-white/5 border border-border-subtle text-app-fg/60 hover:text-rose-400'
                      : 'bg-blue-500 text-white hover:bg-blue-600',
                  )}
                  aria-label={u.isFollowing
                    ? (language === 'bn' ? `আনফলো ${u.name}` : `Unfollow ${u.name}`)
                    : (language === 'bn' ? `ফলো ${u.name}` : `Follow ${u.name}`)}
                >
                  {u.isFollowing
                    ? (language === 'bn' ? 'আনফলো' : 'Following')
                    : (language === 'bn' ? 'ফলো' : 'Follow')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AvatarModal open={isEditingAvatar} onClose={() => setIsEditingAvatar(false)} />

      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[110] bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black shadow-2xl flex items-center gap-3"
          >
            <Check size={20} strokeWidth={3} />
            {language === 'bn' ? 'লিঙ্ক কপি করা হয়েছে!' : 'LINK COPIED!'}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}