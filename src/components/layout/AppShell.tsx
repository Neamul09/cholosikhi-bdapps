import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Trophy, User, Flame, Heart, Gem, Moon, Sun, Code, Award, AlertTriangle, Lock, RefreshCw, X } from 'lucide-react';
import { clsx } from 'clsx';
import { useSettingsStore } from '@/store/settingsStore';
import { useUserStore } from '@/store/userStore';
import { useAuthStore } from '@/store/authStore';
import Tutorial from '@/components/modals/Tutorial';
import LevelUpModal from '@/components/modals/LevelUpModal';
import StreakModal from '@/components/modals/StreakModal';
import { play, unlockAudio } from '@/lib/audio';

const LOGO_URL = "https://i.ibb.co.com/gZ5tDFn2/wordmark.png";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { streak, hearts, gems } = useUserStore();
  const location = useLocation();
  const navigate = useNavigate();
  const { language, theme, toggleTheme, currentCourse } = useSettingsStore();
  const { subscriptionStatus, isSubscribed, user, checkMobileSubscription } = useAuthStore();
  const { showLevelUp, setShowLevelUp, showStreak, setShowStreak, hasSeenTutorial, setHasSeenTutorial, achievements, level } = useUserStore();
  const [shouldShowTutorial, setShouldShowTutorial] = useState(false);
  const [checkingSub, setCheckingSub] = useState(false);
  const [showPendingPopup, setShowPendingPopup] = useState(true);

  const rawStatus = (subscriptionStatus || '').toUpperCase();
  const isPending = rawStatus.includes('PENDING') || rawStatus.includes('INITIAL');
  const isRegistered = rawStatus === 'REGISTERED' || isSubscribed === true;

  // STRICT ACCESS RULE: Only /profile is accessible without an active paid subscription!
  // Any route other than /profile is LOCKED for non-subscribers or payment-pending users.
  const isLockedRoute = location.pathname !== '/profile' && !isRegistered;

  const handleRecheckSubscription = async () => {
    if (!user?.mobile) return;
    setCheckingSub(true);
    try {
      await checkMobileSubscription(user.mobile);
    } finally {
      setCheckingSub(false);
    }
  };

  useEffect(() => {
    const unlock = () => {
      unlockAudio();
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('pointerdown', unlock, { once: true, passive: true });
    window.addEventListener('keydown', unlock, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  const lastAchievementCount = useRef(achievements.length);
  useEffect(() => {
    if (achievements.length > lastAchievementCount.current) {
      play('achievement');
    }
    lastAchievementCount.current = achievements.length;
  }, [achievements.length]);

  const lastLevel = useRef(level);
  useEffect(() => {
    if (level > lastLevel.current) {
      play('levelUp');
    }
    lastLevel.current = level;
  }, [level]);

  const lastStreak = useRef(streak);
  useEffect(() => {
    if (streak > lastStreak.current && streak > 0) {
      play('streak');
    }
    lastStreak.current = streak;
  }, [streak]);

  useEffect(() => {
    if (hasSeenTutorial) return;
    const timer = setTimeout(() => setShouldShowTutorial(true), 1500);
    return () => clearTimeout(timer);
  }, [hasSeenTutorial]);

  const showTutorial = shouldShowTutorial && !hasSeenTutorial;

  const navItems = [
    { id: '/',            icon: Home,     label: language === 'bn' ? 'শিখুন'     : 'Learn'        },
    { id: '/playground',  icon: Code,     label: language === 'bn' ? 'প্লেগ্রাউন্ড' : 'Playground' },
    { id: '/leaderboard', icon: Trophy,   label: language === 'bn' ? 'সেরা শিক্ষার্থী' : 'Leaderboard' },
    { id: '/achievements', icon: Award,   label: language === 'bn' ? 'অর্জন'      : 'Achievements' },
    { id: '/profile',     icon: User,     label: language === 'bn' ? 'প্রোফাইল'  : 'Profile'      },
  ];

  return (
    <div className="flex h-screen bg-app-bg text-app-fg overflow-hidden font-['Hind_Siliguri',_sans-serif]">
      <Tutorial isOpen={showTutorial} onClose={() => { setShouldShowTutorial(false); setHasSeenTutorial(true); }} />
      <LevelUpModal 
        isOpen={showLevelUp !== null} 
        level={showLevelUp || 0} 
        onClose={() => setShowLevelUp(null)} 
      />
      <StreakModal 
        isOpen={showStreak !== null} 
        streak={showStreak || 0} 
        onClose={() => setShowStreak(null)} 
      />

      {/* ── Sidebar (Desktop) / Bottom Nav (Mobile) ── */}
      <nav className={clsx(
        'z-50 border-[var(--border-subtle)] bg-panel/90 backdrop-blur-xl',
        'fixed bottom-0 left-0 right-0 h-16 border-t flex flex-row items-center justify-around px-2',
        'md:relative md:h-full md:w-64 md:flex-col md:justify-start md:p-6 md:border-t-0 md:border-r md:gap-8'
      )}>
        {/* Desktop Brand Logo */}
        <div className="hidden md:flex items-center gap-3">
          <img
            src={LOGO_URL}
            alt="CholoSikhi"
            className="h-10 w-auto drop-shadow-md"
          />
        </div>

        {/* Navigation Items */}
        <div className="flex md:flex-col gap-1 md:gap-2 w-full">
          {navItems.map((item) => {
            const isActive = location.pathname === item.id;
            const isItemLocked = item.id !== '/profile' && !isRegistered;
            return (
              <NavLink
                key={item.id}
                to={item.id}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-2xl font-black transition-all text-sm relative',
                  'flex-1 md:flex-none justify-center md:justify-start',
                  isActive
                    ? 'text-blue-400 bg-blue-500/10 border-2 border-blue-500/25 shadow-[0_0_12px_rgba(59,130,246,0.12)]'
                    : 'text-app-fg-muted border-2 border-transparent hover:bg-blue-500/5 hover:text-blue-400',
                  isItemLocked && 'opacity-60'
                )}
              >
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="hidden md:block uppercase tracking-wider text-xs">{item.label}</span>
                {isItemLocked && (
                  <Lock size={12} className="ml-auto text-amber-400 hidden md:block" />
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Theme Toggle */}
        <div className="hidden md:flex flex-col gap-3 mt-auto pt-6 border-t border-border-subtle w-full">
          <button
            type="button"
            onClick={() => { toggleTheme(); play('toggle'); }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all text-app-fg-muted border-2 border-transparent hover:bg-blue-500/5 hover:text-blue-400"
          >
            {theme === 'dark' ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} />}
            <span className="text-xs">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col relative overflow-hidden pb-16 md:pb-0 h-full">

        {/* Top Header */}
        <header className={clsx(
          'absolute top-0 w-full h-16 flex items-center justify-between px-4 md:px-8 z-40',
          'bg-app-bg/80 backdrop-blur-md',
          'border-b border-border-subtle'
        )}>
          <div className="flex items-center md:hidden gap-2">
            <img
              src={LOGO_URL}
              alt="CholoSikhi"
              className="h-8 w-auto drop-shadow"
            />
          </div>
          <div className="hidden md:block" />

          {/* Stats & Controls */}
          <div className="flex items-center gap-2 md:gap-4 font-bold text-sm">
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-panel border border-border-subtle">
              <Flame size={16} className="fill-amber-500 text-amber-500" />
              <span className="text-amber-500">{streak}</span>
            </div>

            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-panel border border-border-subtle">
              <Gem size={16} className="fill-blue-400 text-blue-400" />
              <span className="text-blue-400">{gems}</span>
            </div>

            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-panel border border-border-subtle">
              <Heart size={16} className="fill-pink-400 text-pink-400" />
              <span className="text-pink-400 font-black">{hearts}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto pt-16 relative">
          
          {/* Closable Floating Payment Pending Toast */}
          <AnimatePresence>
            {isPending && showPendingPopup && location.pathname === '/profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="fixed bottom-20 right-6 z-50 max-w-sm glass rounded-3xl p-5 border-2 border-amber-500/30 shadow-2xl bg-panel/95 backdrop-blur-xl text-app-fg space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 text-amber-400 font-black text-sm">
                    <AlertTriangle size={18} className="shrink-0" />
                    <span>{language === 'bn' ? 'পেমেন্ট মুলতবি রয়েছে' : 'Payment Pending'}</span>
                  </div>
                  <button
                    onClick={() => setShowPendingPopup(false)}
                    className="p-1 rounded-lg text-app-fg-muted hover:text-app-fg hover:bg-app-bg transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                <p className="text-xs font-bold text-app-fg-muted leading-relaxed">
                  {language === 'bn'
                    ? 'আপনার রবি/সার্কেল সাবস্ক্রিপশন পেমেন্ট পেন্ডিং (৳২.৭৮/দিন)। কেবল প্রোফাইল ছাড়া অন্য সব সেবা আনলক করতে ব্যালেন্স রিচার্জ করুন।'
                    : 'Subscription payment pending (৳2.78/day). Recharge mobile balance to unlock all courses & playground.'}
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleRecheckSubscription}
                    disabled={checkingSub}
                    className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-amber-500/20"
                  >
                    <RefreshCw size={14} className={checkingSub ? 'animate-spin' : ''} />
                    <span>{language === 'bn' ? 'স্ট্যাটাস পুনঃপরীক্ষা' : 'Re-check Status'}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Premium Locked Feature Guard (Only /profile is accessible without payment) */}
          {isLockedRoute ? (
            <div className="p-8 max-w-lg mx-auto text-center space-y-6 mt-12">
              <div className="w-20 h-20 rounded-3xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border-2 border-amber-500/30 shadow-inner">
                <Lock size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-app-fg">
                  {language === 'bn' ? 'সাবস্ক্রিপশন প্রয়োজন' : 'bdapps Subscription Required'}
                </h3>
                <p className="text-sm font-bold text-app-fg-muted leading-relaxed">
                  {language === 'bn'
                    ? 'প্রোফাইল ব্যতীত CholoSikhi-এর কোনো সেবাই সাবস্ক্রিপশন ছাড়া ব্যবহার করা যাবে না। সকল কোর্স ও ফিচার আনলক করতে আপনার রবি বা সার্কেল নম্বর ব্যালেন্স রিচার্জ করুন (৳২.৭৮/দিন)।'
                    : 'Nothing except your profile is accessible without an active bdapps subscription (৳2.78/day). Recharge your mobile balance and re-check status.'}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={handleRecheckSubscription}
                  disabled={checkingSub}
                  className="w-full py-4 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-black text-base shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <RefreshCw size={18} className={checkingSub ? 'animate-spin' : ''} />
                  <span>{language === 'bn' ? 'পেমেন্ট স্ট্যাটাস চেক করুন' : 'Re-check Payment Status'}</span>
                </button>

                <button
                  onClick={() => navigate('/profile')}
                  className="w-full py-3 rounded-2xl bg-panel border border-border-subtle text-app-fg font-bold text-sm hover:border-blue-500 transition-colors"
                >
                  {language === 'bn' ? 'প্রোফাইলে যান' : 'Go to Profile'}
                </button>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="min-h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}
