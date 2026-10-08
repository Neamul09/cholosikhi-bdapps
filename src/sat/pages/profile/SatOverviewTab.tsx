import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  Zap,
  Target,
  BookOpen,
  BarChart3,
  Edit2,
  Share2,
  Check,
  User as UserIcon,
  AlertTriangle,
  Skull,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { clsx } from 'clsx';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from 'recharts';
import { useAuthStore } from '@/store/authStore';
import { useUserStore, getLevelProgress } from '@/store/userStore';
import { useSettingsStore } from '@/store/settingsStore';
import IconAvatar from '@/components/common/IconAvatar';
import AvatarModal from '@/pages/profile/AvatarModal';
import { loadSatUserState } from '../../lib/satStorage';
import { calculatePredictedScore } from '../../lib/scorePredictor';
import { fetchSatLeaderboard, searchSatScholars } from '../../lib/satLeaderboardService';
import type { SatLeaderboardUser } from '../../types';
import { MICRO_TYPES } from '../../data/microtypes';
import { supabase } from '../../../lib/supabase';
import { play } from '../../../lib/audio';
import {
  SAT_LEAGUES,
  SAT_LEAGUE_NAMES,
  SAT_LEAGUE_ICONS,
  SAT_LEAGUE_COLORS,
  getSatLeagueFromScore,
  type SatLeague
} from './satLeague';

export default function SatOverviewTab() {
  const { user, session, setSession } = useAuthStore();
  const userStore = useUserStore();
  const { language } = useSettingsStore();

  const [userState] = useState(() => loadSatUserState());
  const [streakCount, setStreakCount] = useState(() => userState.streak);
  const prediction = calculatePredictedScore(userState.attempts);

  // Derive league from predicted score
  const league: SatLeague = getSatLeagueFromScore(prediction.compositeScore);

  // Helper to resolve user name across all sources
  const getResolvedName = useCallback(() => {
    return (
      (user as any)?.user_metadata?.full_name ||
      user?.name ||
      session?.name ||
      userStore.name ||
      (typeof window !== 'undefined'
        ? localStorage.getItem('cs_sat_user_name') || localStorage.getItem('cholosikhi_user_name')
        : '') ||
      ''
    );
  }, [user, session, userStore.name]);

  // Edit name state
  const [fullName, setFullName] = useState(getResolvedName);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Avatar edit modal & Share toast
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  // SAT Scholars Leaderboard & Search state
  const [scholars, setScholars] = useState<SatLeaderboardUser[]>([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SatLeaderboardUser[]>([]);
  const [searching, setSearching] = useState(false);

  // Sync fullName when external user state changes
  useEffect(() => {
    if (!isEditingName) {
      setFullName(getResolvedName());
    }
  }, [getResolvedName, isEditingName]);

  // Listen for real-time streak updates
  useEffect(() => {
    const handleStreak = (e: Event) => {
      const customEvent = e as CustomEvent<{ streak?: number }>;
      if (typeof customEvent?.detail?.streak === 'number') {
        setStreakCount(customEvent.detail.streak);
      }
    };
    window.addEventListener('cs_sat_streak_updated', handleStreak);
    return () => window.removeEventListener('cs_sat_streak_updated', handleStreak);
  }, []);

  // Load dedicated SAT leaderboard (completely isolated from Python XP)
  useEffect(() => {
    fetchSatLeaderboard({ scope: 'global', limit: 5 }).then(setScholars);
  }, []);

  // Search specifically for SAT scholars
  useEffect(() => {
    const term = query.trim();
    if (!term || term.length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    const id = window.setTimeout(async () => {
      try {
        const r = await searchSatScholars(term);
        setResults(r);
      } finally {
        setSearching(false);
      }
    }, 250);
    return () => window.clearTimeout(id);
  }, [query]);

  const onFollow = useCallback(
    async (userId: string) => {
      await userStore.toggleFollow(userId);
      const updated = await fetchSatLeaderboard({ scope: 'global', limit: 5 });
      setScholars(updated);
      const term = query.trim();
      if (term) {
        const r = await searchSatScholars(term);
        setResults(r);
      }
    },
    [userStore, query]
  );

  const handleSaveName = async () => {
    const trimmed = fullName.trim();
    if (!trimmed) return;
    setIsSavingName(true);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('cs_sat_user_name', trimmed);
        localStorage.setItem('cholosikhi_user_name', trimmed);
      }
      userStore.setName(trimmed);

      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: trimmed }
      });

      if (authError) {
        console.warn('Supabase auth.updateUser non-fatal warning:', authError);
      }

      if (session) {
        setSession({ ...session, name: trimmed });
      }

      if (user?.id) {
        try {
          await supabase
            .from('profiles')
            .update({ name: trimmed, updated_at: new Date().toISOString() })
            .eq('id', user.id);
        } catch (dbErr) {
          console.warn('Supabase profiles update non-fatal error:', dbErr);
        }
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cs_user_name_changed', { detail: { name: trimmed } }));
      }

      setSaveSuccess(true);
      setIsEditingName(false);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to update name:', err);
      setSaveSuccess(true);
      setIsEditingName(false);
      setTimeout(() => setSaveSuccess(false), 2500);
    } finally {
      setIsSavingName(false);
    }
  };

  const handleShare = useCallback(async () => {
    const shareData = {
      title: 'CholoSikhi Digital SAT Profile',
      text: `Check out my Digital SAT progress on CholoSikhi! Predicted score: ${prediction.compositeScore}/1600 with ${userState.xp || userStore.totalXp} XP.`,
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
      if (import.meta.env.DEV) console.log('Error sharing:', err);
    }
  }, [prediction.compositeScore, userState.xp, userStore.totalXp]);

  // Overall SAT Accuracy
  const totalAttempts = userState.attempts.length;
  const correctAttempts = userState.attempts.filter((a) => a.isCorrect).length;
  const overallAccuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;
  const unresolvedMistakes = userState.mistakes.filter((m) => !m.resolved).length;

  // Level & XP Progress
  const currentTotalXp = (userState.xp || 0) + (userStore.totalXp || 0);
  const progress = getLevelProgress(currentTotalXp);

  // 7-Day practice chart data
  const chartData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      // Calculate daily activity or fallback to xpHistory
      const dailyXp = userStore.xpHistory[dateStr] || 0;
      return { name: dayName, xp: dailyXp, fullDate: dateStr };
    });
  }, [userStore.xpHistory]);

  const resolvedDisplayName = getResolvedName() || (language === 'bn' ? 'ডিজিটাল SAT স্কলার' : 'Digital SAT Scholar');

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      {/* ─── LEFT COLUMN: Profile Hero, 4-Stats, Weekly Chart ─── */}
      <div className="md:col-span-5 space-y-6">
        {/* Profile Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-6 text-center border-t border-blue-500/30 relative overflow-hidden"
        >
          <div className="relative w-24 h-24 mx-auto mb-4 group">
            <div className="w-full h-full bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 border-2 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.2)] overflow-hidden">
              {userStore.avatarUrl ? (
                <img src={userStore.avatarUrl} alt={resolvedDisplayName} className="w-full h-full object-cover" />
              ) : (
                <IconAvatar name={userStore.avatar || 'scholar'} size={48} strokeWidth={2.5} />
              )}
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
            <div className="flex items-center justify-center gap-2">
              {isEditingName ? (
                <div className="flex items-center gap-1.5 my-1">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveName();
                      if (e.key === 'Escape') setIsEditingName(false);
                    }}
                    placeholder="Enter name"
                    className="px-2.5 py-1 rounded-xl bg-app-bg border-2 border-blue-500 text-base font-black text-app-fg outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={isSavingName}
                    className="p-1.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                    title="Save"
                  >
                    <Check size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-app-fg tracking-tight truncate">
                    {resolvedDisplayName}
                  </h2>
                  <button
                    onClick={() => {
                      setFullName(resolvedDisplayName);
                      setIsEditingName(true);
                    }}
                    className="p-1 rounded-lg hover:bg-panel text-app-fg/40 hover:text-blue-400 transition-colors"
                    title="Edit Name"
                  >
                    <Edit2 size={13} />
                  </button>
                </div>
              )}

              <button
                onClick={handleShare}
                className="p-1.5 rounded-xl bg-white/5 border border-white/10 text-blue-400 hover:bg-blue-500/10 transition-colors"
                aria-label="Share profile"
              >
                <Share2 size={15} />
              </button>
            </div>

            {saveSuccess && (
              <p className="text-xs font-bold text-emerald-400 mt-1">Name saved successfully!</p>
            )}

            <p className="text-blue-400 font-bold text-xs sm:text-sm mt-1">
              {language === 'bn' ? `লেভেল ${userStore.level} • ${currentTotalXp} XP` : `Level ${userStore.level} • ${currentTotalXp} XP`}
            </p>

            <div className="flex items-center justify-center gap-4 mt-3 text-sm">
              <div className="flex flex-col items-center">
                <span className="font-black text-app-fg">{userStore.followingCount}</span>
                <span className="text-app-fg/40 uppercase text-[10px] tracking-widest font-bold">
                  {language === 'bn' ? 'ফলোয়িং' : 'Following'}
                </span>
              </div>
              <div className="w-px h-4 bg-app-fg/10" />
              <div className="flex flex-col items-center">
                <span className="font-black text-app-fg">{userStore.followersCount}</span>
                <span className="text-app-fg/40 uppercase text-[10px] tracking-widest font-bold">
                  {language === 'bn' ? 'ফলোয়ার' : 'Followers'}
                </span>
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="mt-4">
            <div className="h-2 bg-app-fg/10 rounded-full w-48 mx-auto mb-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(progress.xpInLevel / progress.nextLevelXp) * 100}%` }}
              />
            </div>
            <p className="text-[11px] font-bold text-app-fg/50">
              {language === 'bn'
                ? `পরবর্তী লেভেলের জন্য ${progress.remaining} XP প্রয়োজন`
                : `${progress.remaining} XP needed for next level`}
            </p>
          </div>
        </motion.div>

        {/* 4-Stat Glass Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass p-4 rounded-2xl flex flex-col gap-1.5 border border-border-subtle">
            <div className="flex items-center justify-between">
              <Flame className="text-amber-500 fill-amber-500" size={22} />
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-500/80">Streak</span>
            </div>
            <div className="text-2xl font-black text-app-fg">{streakCount}</div>
            <div className="text-xs text-app-fg/50 font-bold">
              {language === 'bn' ? 'ডেইলি স্ট্রিক' : 'Daily Streak'}
            </div>
          </div>

          <div className="glass p-4 rounded-2xl flex flex-col gap-1.5 border border-border-subtle">
            <div className="flex items-center justify-between">
              <Zap className="text-blue-400 fill-blue-400" size={22} />
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-400/80">Total</span>
            </div>
            <div className="text-2xl font-black text-blue-400">{currentTotalXp}</div>
            <div className="text-xs text-app-fg/50 font-bold">
              {language === 'bn' ? 'টোটাল এক্সপি' : 'Total SAT XP'}
            </div>
          </div>

          <div className="glass p-4 rounded-2xl flex flex-col gap-1.5 border border-border-subtle">
            <div className="flex items-center justify-between">
              <Target className="text-emerald-400" size={22} />
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400/80">Accuracy</span>
            </div>
            <div className="text-2xl font-black text-emerald-400">{overallAccuracy}%</div>
            <div className="text-xs text-app-fg/50 font-bold">
              {language === 'bn' ? 'সার্বিক নির্ভুলতা' : 'Overall Accuracy'}
            </div>
          </div>

          <div className="glass p-4 rounded-2xl flex flex-col gap-1.5 border border-border-subtle">
            <div className="flex items-center justify-between">
              <BookOpen className="text-cyan-400" size={22} />
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400/80">Items</span>
            </div>
            <div className="text-2xl font-black text-app-fg">{totalAttempts}</div>
            <div className="text-xs text-app-fg/50 font-bold">
              {language === 'bn' ? 'প্রশ্ন সমাধান' : 'Questions Solved'}
            </div>
          </div>
        </div>

        {/* Weekly Progress Recharts Chart */}
        <div className="glass p-6 rounded-3xl space-y-4 border border-border-subtle">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-xs uppercase tracking-widest text-app-fg/50 flex items-center gap-2">
              <BarChart3 size={15} />
              {language === 'bn' ? 'সাপ্তাহিক অগ্রগতি' : 'WEEKLY PROGRESS'}
            </h3>
            <div className="text-xs font-bold text-blue-400">
              {chartData.reduce((acc, curr) => acc + curr.xp, 0)} XP This Week
            </div>
          </div>
          <div className="h-44 w-full min-h-[176px]">
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

      {/* ─── RIGHT COLUMN: League, Leaderboard, Direct Shortcuts ─── */}
      <div className="md:col-span-7 space-y-6">
        {/* Scholar League Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-3xl p-6 relative overflow-hidden border border-border-subtle"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-black text-app-fg">
                {language === 'bn' ? 'বর্তমান স্কলার স্তর' : 'Scholar League Tier'}
              </h3>
              <p className="text-xs text-app-fg/50 font-bold">
                {language === 'bn' ? 'আপনার স্কোর অনুযায়ী স্তর নির্ধারিত' : 'Calibrated to your SAT predicted percentile'}
              </p>
            </div>
            <div
              className="text-xs font-black px-3 py-1.5 rounded-full bg-white/10 flex items-center gap-1.5"
              style={{ color: SAT_LEAGUE_COLORS[league] }}
            >
              <Sparkles size={12} />
              <span>{SAT_LEAGUE_NAMES[league][language === 'bn' ? 'bn' : 'en']}</span>
            </div>
          </div>

          <div className="flex justify-between px-2 mb-3 relative z-10">
            {SAT_LEAGUES.map((l, i) => {
              const Icon = SAT_LEAGUE_ICONS[l];
              const reached = i <= SAT_LEAGUES.indexOf(league);
              return (
                <div
                  key={l}
                  className={clsx(
                    'flex flex-col items-center gap-1.5 transition-all',
                    reached ? 'opacity-100 scale-105' : 'opacity-30 grayscale',
                  )}
                  title={SAT_LEAGUE_NAMES[l].en}
                >
                  <Icon size={22} style={{ color: SAT_LEAGUE_COLORS[l] }} />
                  {l === league && (
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: SAT_LEAGUE_COLORS[l] }} />
                  )}
                </div>
              );
            })}
          </div>

          <div className="h-1.5 bg-white/10 w-full mt-2 relative overflow-hidden rounded-full">
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
              animate={{ width: `${((SAT_LEAGUES.indexOf(league) + 1) / SAT_LEAGUES.length) * 100}%` }}
            />
          </div>
          <p className="text-xs text-center text-app-fg/50 font-bold mt-4">
            {language === 'bn'
              ? '১৫০০+ স্কোর অর্জন করে ডায়মন্ড এলিট ক্লাবে যুক্ত হোন!'
              : 'Target a 1500+ score to unlock the Diamond Elite Scholar tier!'}
          </p>
        </motion.div>

        {/* Weekly Leaderboard Preview */}
        <div className="glass rounded-3xl p-6 border border-border-subtle space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-black flex items-center gap-2 text-app-fg">
              <Target className="text-emerald-400" size={18} />
              {language === 'bn' ? 'সাপ্তাহিক স্কলার লিডারবোর্ড' : 'Weekly Scholars Leaderboard'}
            </h3>
            <Link
              to="/sat/leaderboard"
              onClick={() => play('tap')}
              className="text-xs font-black text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
            >
              <span>{language === 'bn' ? 'সব দেখুন' : 'View All'}</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="space-y-2">
            {scholars.length === 0 ? (
              <p className="text-xs text-app-fg/40 text-center py-5 font-bold">
                {language === 'bn'
                  ? 'কোনো সহপাঠী নেই — নিচে নাম লিখে যুক্ত করুন।'
                  : 'No peers added yet — search below to connect with scholars.'}
              </p>
            ) : (
              scholars.slice(0, 5).map((f, i) => (
                <div
                  key={`${f.id}-${i}`}
                  className={clsx(
                    'flex items-center gap-3.5 p-2.5 rounded-2xl transition-all',
                    f.isCurrentUser ? 'bg-blue-500/10 border border-blue-500/30' : 'hover:bg-white/5',
                  )}
                >
                  <div
                    className={clsx(
                      'w-7 h-7 flex items-center justify-center font-black text-xs rounded-full bg-white/5',
                      i === 0 && 'text-amber-400 bg-amber-400/10',
                      i === 1 && 'text-gray-300 bg-gray-300/10',
                      i === 2 && 'text-[#cd7f32] bg-[#cd7f32]/10',
                    )}
                  >
                    {i + 1}
                  </div>
                  <div className="w-9 h-9 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 overflow-hidden">
                    {f.avatarUrl ? (
                      <img src={f.avatarUrl} alt={f.name} className="w-full h-full object-cover" />
                    ) : (
                      <IconAvatar name={f.avatar} size={18} />
                    )}
                  </div>
                  <div className="flex-1 font-black text-sm text-app-fg truncate">
                    <span>{f.name}</span>
                    {f.isCurrentUser && (
                      <span className="ml-2 text-[10px] font-black px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-blue-400 font-mono text-xs font-black">{f.xp} XP</div>
                    <div className="text-[10px] text-app-fg/40 font-bold">Predicted {f.predictedScore}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Find Scholars Search */}
        <div className="glass rounded-3xl p-6 border border-border-subtle space-y-4">
          <h3 className="text-lg font-black flex items-center gap-2 text-app-fg">
            <UserIcon className="text-blue-400" size={18} />
            {language === 'bn' ? 'স্কলার খুঁজুন' : 'Find Scholars & Classmates'}
          </h3>
          <div className="relative">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={language === 'bn' ? 'স্কলারের নাম লিখুন...' : 'Search scholars by name...'}
              className="w-full bg-app-bg border-2 border-border-subtle rounded-2xl px-4 py-2.5 outline-none focus:border-blue-500 transition-all font-bold text-sm placeholder:text-app-fg/30"
              aria-label={language === 'bn' ? 'স্কলার খুঁজুন' : 'Search scholars'}
            />
          </div>
          <div className="space-y-2 min-h-[40px]">
            {query.trim() && !searching && results.length === 0 && (
              <p className="text-xs text-app-fg/40 text-center py-3 font-bold">
                {language === 'bn' ? 'কোনো ফলাফল পাওয়া যায়নি' : 'No scholars found'}
              </p>
            )}
            {searching && (
              <p className="text-xs text-app-fg/40 text-center py-3 font-bold">
                {language === 'bn' ? 'অনুসন্ধান চলছে...' : 'Searching scholars...'}
              </p>
            )}
            {results.map((u) => (
              <div key={u.id} className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white/5">
                <div className="w-9 h-9 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 overflow-hidden">
                  {u.avatarUrl ? (
                    <img src={u.avatarUrl} alt={u.name} className="w-full h-full object-cover" />
                  ) : (
                    <IconAvatar name={u.avatar} size={18} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-app-fg truncate">{u.name}</div>
                  <div className="text-[11px] text-app-fg/40 font-mono font-bold">{u.xp} XP</div>
                </div>
                <button
                  onClick={() => onFollow(u.id)}
                  className={clsx(
                    'px-3 py-1.5 rounded-xl text-xs font-black transition-colors',
                    u.isFollowing
                      ? 'bg-white/5 border border-border-subtle text-app-fg/60 hover:text-rose-400'
                      : 'bg-blue-500 text-white hover:bg-blue-600',
                  )}
                >
                  {u.isFollowing
                    ? language === 'bn' ? 'আনফলো' : 'Following'
                    : language === 'bn' ? 'ফলো' : 'Follow'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Direct Shortcuts Hub */}
        <div className="glass p-6 rounded-3xl border border-border-subtle space-y-3">
          <h3 className="text-sm font-black uppercase tracking-wider text-app-fg/50">
            {language === 'bn' ? 'সরাসরি শর্টকাট' : 'Direct Practice Hub'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              to="/sat/types"
              onClick={() => play('tap')}
              className="p-3.5 rounded-2xl bg-app-bg border border-border-subtle hover:border-blue-500/40 hover:bg-white/5 transition-all flex flex-col justify-between gap-3 group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <BookOpen size={16} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-app-fg group-hover:text-blue-400 transition-colors truncate">
                    Type Drill
                  </h4>
                  <p className="text-[10px] text-app-fg/40 font-bold">{MICRO_TYPES.length} archetypes</p>
                </div>
              </div>
            </Link>

            <Link
              to="/sat/mistakes"
              onClick={() => play('tap')}
              className="p-3.5 rounded-2xl bg-app-bg border border-border-subtle hover:border-rose-500/40 hover:bg-white/5 transition-all flex flex-col justify-between gap-3 group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                  <AlertTriangle size={16} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-app-fg group-hover:text-rose-400 transition-colors truncate">
                    Mistake Bank
                  </h4>
                  <p className="text-[10px] text-app-fg/40 font-bold">{unresolvedMistakes} traps logged</p>
                </div>
              </div>
            </Link>

            <Link
              to="/sat/hardest"
              onClick={() => play('tap')}
              className="p-3.5 rounded-2xl bg-app-bg border border-border-subtle hover:border-pink-500/40 hover:bg-white/5 transition-all flex flex-col justify-between gap-3 group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center shrink-0">
                  <Skull size={16} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-app-fg group-hover:text-pink-400 transition-colors truncate">
                    Hardest Vault
                  </h4>
                  <p className="text-[10px] text-app-fg/40 font-bold">99th-percentile</p>
                </div>
              </div>
            </Link>
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
            <span>{language === 'bn' ? 'লিঙ্ক কপি করা হয়েছে!' : 'LINK COPIED!'}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
