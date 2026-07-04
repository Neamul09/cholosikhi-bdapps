import { motion, AnimatePresence } from 'framer-motion';
import { Zap, BookOpen, Clock, Target, Flame, Shield, Trophy, Gem, Crown, Circle, BarChart3, X, Edit2, Share2, Check } from 'lucide-react';
import { clsx } from 'clsx';
import { useUserStore, getLevelProgress, type LeaderboardUser } from '@/store/userStore';
import { useSettingsStore } from '@/store/settingsStore';
import IconAvatar, { AVATAR_ICONS } from '@/components/common/IconAvatar';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from 'recharts';
import { useState, useEffect } from 'react';

const LEAGUES = ['wood', 'bronze', 'iron', 'gold', 'diamond', 'legendary'];
const LEAGUE_NAMES = { wood: 'Wood', bronze: 'Bronze', iron: 'Iron', gold: 'Gold', diamond: 'Diamond', legendary: 'Legendary' };
const LEAGUE_ICONS = { wood: Circle, bronze: Shield, iron: Zap, gold: Trophy, diamond: Gem, legendary: Crown };
const LEAGUE_COLORS = { wood: '#92400e', bronze: '#b45309', iron: '#64748b', gold: '#d97706', diamond: '#06b6d4', legendary: '#a855f7' };

export default function ProfileView() {
  const { name, avatar, level, totalXp, streak, league, lessonsCompleted, totalTimeMinutes, xpHistory, setAvatar, followersCount, followingCount, loadFriendsLeaderboard } = useUserStore();
  const { language } = useSettingsStore();
  
  const progress = getLevelProgress(totalXp);
  
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [friends, setFriends] = useState<LeaderboardUser[]>([]);

  useEffect(() => {
    loadFriendsLeaderboard().then(setFriends);
  }, [loadFriendsLeaderboard]);

  const handleShare = async () => {
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
  };

  // Prepare chart data for last 7 days
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    return {
      name: dayName,
      xp: xpHistory[dateStr] || 0,
      fullDate: dateStr
    };
  });


  return (
    <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-12 gap-6">
      
      {/* Left Column - Profile Card & Stats */}
      <div className="md:col-span-5 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-6 text-center border-t border-brand-500/30">
          <div className="relative w-24 h-24 mx-auto mb-4 group">
            <div className="w-full h-full bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 border-2 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
              <IconAvatar name={avatar} size={48} strokeWidth={2.5} />
            </div>
            <button 
              onClick={() => setIsEditingAvatar(true)}
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-app-bg border-2 border-border-subtle rounded-xl flex items-center justify-center text-blue-400 shadow-xl hover:scale-110 active:scale-90 transition-all z-10"
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
               >
                 <Share2 size={16} />
               </button>
            </div>
            <p className="text-brand-400 font-bold text-sm mt-1">Level {level} • {totalXp} XP</p>
            <div className="flex items-center justify-center gap-4 mt-2 text-sm">
              <div className="flex flex-col items-center">
                <span className="font-black text-app-fg">{followingCount}</span>
                <span className="text-app-fg-muted uppercase text-[10px] tracking-widest">{language === 'bn' ? 'ফলোয়িং' : 'Following'}</span>
              </div>
              <div className="w-px h-4 bg-app-fg/10" />
              <div className="flex flex-col items-center">
                <span className="font-black text-app-fg">{followersCount}</span>
                <span className="text-app-fg-muted uppercase text-[10px] tracking-widest">{language === 'bn' ? 'ফলোয়ার' : 'Followers'}</span>
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

        {/* Stats Grid */}
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
            <div className="text-xs text-app-fg-muted">ব্যয়িত সময়</div>
          </div>
        </div>

        {/* XP Chart */}
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
                    fontWeight: '800'
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

      {/* Right Column - League & Leaderboard */}
      <div className="md:col-span-7 space-y-6">
        
        {/* League Info */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 blur-[100px] rounded-full" />
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">বর্তমান লিগ</h2>
            <div className="text-sm font-bold px-3 py-1 rounded-full bg-white/10" style={{ color: LEAGUE_COLORS[league as keyof typeof LEAGUE_COLORS] }}>
              {LEAGUE_NAMES[league as keyof typeof LEAGUE_NAMES]}
            </div>
          </div>

          <div className="flex justify-between px-2 mb-2 relative z-10">
            {LEAGUES.map((l, i) => {
              const Icon = LEAGUE_ICONS[l as keyof typeof LEAGUE_ICONS];
              return (
                <div key={l} className={clsx('flex flex-col items-center gap-2', 
                  i <= LEAGUES.indexOf(league) ? 'opacity-100' : 'opacity-30 grayscale'
                )}>
                  <Icon size={24} style={{ color: LEAGUE_COLORS[l as keyof typeof LEAGUE_COLORS] }} />
                  {l === league && <div className="w-1.5 h-1.5 rounded-full bg-current" style={{ backgroundColor: LEAGUE_COLORS[l as keyof typeof LEAGUE_COLORS] }} />}
                </div>
              );
            })}
          </div>
          {/* Progress track */}
          <div className="h-1 bg-white/10 w-full mt-2 relative overflow-hidden rounded-full">
            <motion.div className="absolute top-0 left-0 h-full gradient-brand"
              animate={{ width: `${(LEAGUES.indexOf(league) / 5) * 100}%` }} />
          </div>
          <p className="text-xs text-center text-gray-500 mt-4">
            পরবর্তী লিগে যেতে শীর্ষ ৩ জনের মধ্যে থাকুন!
          </p>
        </motion.div>

        {/* Weekly Leaderboard Mockup */}
        <div className="glass rounded-3xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Target className="text-emerald-400" size={20} />
              সাপ্তাহিক লিডারবোর্ড
            </h2>
            <span className="text-xs text-gray-500">Resets in 2d 14h</span>
          </div>

          <div className="space-y-2">
            {friends.map((f, i) => (
              <div key={i} className={clsx('flex items-center gap-4 p-3 rounded-2xl', f.isMe ? 'bg-brand-500/10 border border-brand-500/20' : 'hover:bg-white/5')}>
                <div className={clsx('w-8 h-8 flex items-center justify-center font-bold text-sm rounded-full bg-white/5',
                  i === 0 && 'text-amber-400 bg-amber-400/10',
                  i === 1 && 'text-gray-300 bg-gray-300/10',
                  i === 2 && 'text-[#cd7f32] bg-[#cd7f32]/10'
                )}>{i + 1}</div>
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <IconAvatar name={f.avatar} size={20} />
                </div>
                <div className="flex-1 font-bold">{f.name}</div>
                <div className="text-brand-400 font-mono text-sm">{f.xp} XP</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Avatar Selection Modal */}
      <AnimatePresence>
        {isEditingAvatar && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditingAvatar(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-panel border-2 border-border-subtle rounded-[3rem] p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black">{language === 'bn' ? 'অবতার পরিবর্তন করুন' : 'SELECT AVATAR'}</h2>
                <button 
                  onClick={() => setIsEditingAvatar(false)}
                  className="w-10 h-10 rounded-2xl bg-app-bg border-2 border-border-subtle flex items-center justify-center text-app-fg/40 hover:text-app-fg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
                {AVATAR_ICONS.map((iconName) => (
                  <button
                    key={iconName}
                    onClick={() => {
                      setAvatar(iconName);
                      setIsEditingAvatar(false);
                    }}
                    className={clsx(
                      "w-full aspect-square rounded-2xl flex items-center justify-center transition-all active:scale-90",
                      avatar === iconName 
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30 border-2 border-blue-400" 
                        : "bg-app-bg border-2 border-border-subtle text-app-fg/60 hover:border-blue-500/50 hover:text-blue-400"
                    )}
                  >
                    <IconAvatar name={iconName} size={24} />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Share Toast */}
      <AnimatePresence>
        {showShareToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[110] bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black shadow-2xl flex items-center gap-3"
          >
            <Check size={20} strokeWidth={3} />
            {language === 'bn' ? 'লিঙ্ক কপি করা হয়েছে!' : 'LINK COPIED!'}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
