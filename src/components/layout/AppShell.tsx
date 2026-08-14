import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Trophy, User, BookOpen, Settings, Flame, Heart, Gem, Moon, Sun, ShoppingBag, Code, Users, Search } from 'lucide-react';
import { clsx } from 'clsx';
import { useSettingsStore } from '@/store/settingsStore';
import { useUserStore } from '@/store/userStore';
import Tutorial from '@/components/modals/Tutorial';
import LevelUpModal from '@/components/modals/LevelUpModal';
import StreakModal from '@/components/modals/StreakModal';
import { useState, useEffect, useRef } from 'react';
import { play, unlockAudio } from '@/lib/audio';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { streak, hearts, gems } = useUserStore();
  const location = useLocation();
  const { language, theme, toggleTheme, currentCourse } = useSettingsStore();
  const { showLevelUp, setShowLevelUp, showStreak, setShowStreak, hasSeenTutorial, setHasSeenTutorial, achievements, level } = useUserStore();
  const [shouldShowTutorial, setShouldShowTutorial] = useState(false);

  // Unlock the AudioContext on the user's first interaction (browser autoplay policy).
  // The handler attaches once, fires `unlockAudio()` once, then self-destructs.
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

  // Achievement unlock sound — fires once when the achievements list grows.
  // Uses `useRef` to compare lengths without re-running the effect.
  const lastAchievementCount = useRef(achievements.length);
  useEffect(() => {
    if (achievements.length > lastAchievementCount.current) {
      play('achievement');
    }
    lastAchievementCount.current = achievements.length;
  }, [achievements.length]);

  // Level-up sound — fires once when the level crosses upward.
  const lastLevel = useRef(level);
  useEffect(() => {
    if (level > lastLevel.current) {
      play('levelUp');
    }
    lastLevel.current = level;
  }, [level]);

  // Streak bonus sound — fires when the user lands on a brand-new streak day.
  const lastStreak = useRef(streak);
  useEffect(() => {
    if (streak > lastStreak.current && streak > 0) {
      play('streak');
    }
    lastStreak.current = streak;
  }, [streak]);

  // Schedule the tutorial popup the first time the user lands here.
  // `showTutorial` is a pure derivation: visible while deferred AND not yet seen.
  useEffect(() => {
    if (hasSeenTutorial) return;
    const timer = setTimeout(() => setShouldShowTutorial(true), 1500);
    return () => clearTimeout(timer);
  }, [hasSeenTutorial]);

  const showTutorial = shouldShowTutorial && !hasSeenTutorial;

  const navItems = [
    { id: '/',            icon: Home,     label: language === 'bn' ? 'শিখুন'         : 'Learn'        },
    { id: '/playground',  icon: Code,     label: language === 'bn' ? 'কোড প্লে'      : 'Playground'   },
    { id: '/dsa',         icon: BookOpen, label: language === 'bn' ? 'ভিজ্যুয়ালাইজার' : 'Visualizer' },
    { id: '/leaderboard', icon: Trophy,   label: language === 'bn' ? 'সেরা শিক্ষার্থী'  : 'Leaderboard'  },
    { id: '/community',   icon: Users,    label: language === 'bn' ? 'কমিউনিটি'        : 'Community'    },
    { id: '/discover',    icon: Search,   label: language === 'bn' ? 'খুঁজুন'           : 'Discover'     },
    { id: '/shop',        icon: ShoppingBag, label: language === 'bn' ? 'দোকান'       : 'Shop'         },
    { id: '/profile',     icon: User,     label: language === 'bn' ? 'প্রোফাইল'       : 'Profile'      },
    { id: '/settings',    icon: Settings, label: language === 'bn' ? 'সেটিংস'         : 'Settings'     },
  ];

  const isPython = currentCourse === 'python';

  return (
    <div className="flex h-screen bg-app-bg text-app-fg overflow-hidden">
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
        'fixed bottom-0 w-full md:relative md:w-64 lg:w-72 z-50',
        'flex md:flex-col justify-between py-2 px-4 md:py-8 md:px-5',
        'border-t md:border-t-0 md:border-r',
        'bg-[var(--duo-card-bg)] pb-[calc(0.5rem+env(safe-area-inset-bottom))] md:pb-8',
        'border-[var(--border-subtle)]',
        // subtle inner blue glow on desktop
        'md:shadow-[inset_-1px_0_0_rgba(59,130,246,0.08)]'
      )}>

        {/* Logo */}
        <div className="hidden md:flex items-center gap-3 mb-10 px-2">
          <img
            src="/py-wordmark.png"
            alt={isPython ? 'py.cholosikhi' : 'cpp.cholosikhi'}
            className="h-10 w-auto drop-shadow"
            width={160}
            height={40}
          />
        </div>

        {/* Nav Links */}
        <motion.div
          initial="hidden" animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07 } }, hidden: {} }}
          className="flex w-full md:w-auto md:flex-col justify-between md:justify-start gap-1 md:gap-1.5"
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.id ||
              (item.id !== '/' && location.pathname.startsWith(item.id));
            return (
              <motion.div
                key={item.id}
                variants={{ hidden: { x: -16, opacity: 0 }, visible: { x: 0, opacity: 1 } }}
              >
                <NavLink
                  to={item.id}
                  onClick={() => play('tap')}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all',
                    'flex-1 md:flex-none justify-center md:justify-start',
                    isActive
                      ? 'text-blue-400 bg-blue-500/10 border-2 border-blue-500/25 shadow-[0_0_12px_rgba(59,130,246,0.12)]'
                      : 'text-[var(--app-fg-muted)] border-2 border-transparent hover:bg-blue-500/5 hover:text-blue-400'
                  )}
                >
                  <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="hidden md:block uppercase tracking-wider text-xs">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="hidden md:block ml-auto w-1.5 h-5 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500"
                    />
                  )}
                </NavLink>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Desktop bottom: theme toggle */}
        <div className="hidden md:flex flex-col gap-3 mt-auto pt-6 border-t border-[var(--border-subtle)]">
          <button
            type="button"
            onClick={() => { toggleTheme(); play('toggle'); }}
aria-label={theme === 'dark' ? (language === 'bn' ? 'লাইট মোডে যান' : 'Switch to light mode') : (language === 'bn' ? 'ডার্ক মোডে যান' : 'Switch to dark mode')}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all text-[var(--app-fg-muted)] border-2 border-transparent hover:bg-blue-500/5 hover:text-blue-400"
          >
            {theme === 'dark'
              ? <Sun size={22} className="text-amber-400" />
              : <Moon size={22} />}
            <span className="text-xs">
              {theme === 'dark'
                ? (language === 'bn' ? 'লাইট মোড' : 'Light mode')
                : (language === 'bn' ? 'ডার্ক মোড' : 'Dark mode')}
            </span>
          </button>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col relative overflow-hidden pb-16 md:pb-0 h-full">

        {/* Top Header */}
        <header className={clsx(
          'absolute top-0 w-full h-16 flex items-center justify-between px-4 md:px-8 z-40',
          'bg-app-bg/80 backdrop-blur-md',
          'border-b border-[var(--border-subtle)]',
          'shadow-[0_1px_0_rgba(59,130,246,0.06)]'
        )}>
          {/* Mobile logo only (toggle moved to right) */}
          <div className="flex items-center md:hidden">
            <img
              src="/py-wordmark.png"
              alt={isPython ? 'py.cholosikhi' : 'cpp.cholosikhi'}
              className="h-8 w-auto drop-shadow"
              width={128}
              height={32}
            />
          </div>
          <div className="hidden md:block" />

          {/* Stats */}
          {/* Stats & Theme Toggle */}
          <div className="flex items-center gap-1 md:gap-4 font-bold text-sm">
            {/* Streak */}
            <motion.div key="streak" initial={{ scale: 1.3 }} animate={{ scale: 1 }}
              className="flex items-center gap-1 px-1.5 md:px-2.5 py-1.5 rounded-xl hover:bg-amber-500/10 cursor-pointer transition">
              <Flame size={16} className="fill-amber-500 text-amber-500 md:w-[18px]" />
              <span className="text-amber-500">{streak}</span>
            </motion.div>

            {/* Gems */}
            <motion.div key="gems" initial={{ scale: 1.3 }} animate={{ scale: 1 }}
              className="flex items-center gap-1 px-1.5 md:px-2.5 py-1.5 rounded-xl hover:bg-blue-500/10 cursor-pointer transition">
              <Gem size={16} className="fill-blue-400 text-blue-400 md:w-[18px]" />
              <span className="text-blue-400">{gems}</span>
            </motion.div>

            {/* Hearts */}
            <motion.div key="hearts" initial={{ scale: 1.3 }} animate={{ scale: 1 }}
              className="flex items-center gap-1 px-1.5 md:px-2.5 py-1.5 rounded-xl hover:bg-pink-500/10 cursor-pointer transition">
              <Heart size={16} className="fill-pink-400 text-pink-400 md:w-[18px]" />
              <span className="text-pink-400 font-black">{hearts}</span>
            </motion.div>

            {/* Mobile theme toggle (Moved here) */}
            <div className="md:hidden border-l border-[var(--border-subtle)] ml-1 pl-2">
              <button
                type="button"
                onClick={() => { toggleTheme(); play('toggle'); }}
                aria-label={theme === 'dark' ? (language === 'bn' ? 'লাইট মোডে যান' : 'Switch to light mode') : (language === 'bn' ? 'ডার্ক মোডে যান' : 'Switch to dark mode')}
                className="p-1.5 rounded-xl hover:bg-blue-500/10 transition text-[var(--app-fg-muted)]"
              >
                {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto pt-16">
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
        </div>
      </main>
    </div>
  );
}
