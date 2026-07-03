import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Trophy, User, BookOpen, Settings, Flame, Heart, Gem, Moon, Sun, Zap, ShoppingBag, Code } from 'lucide-react';
import { clsx } from 'clsx';
import { useSettingsStore } from '@/store/settingsStore';
import { useUserStore } from '@/store/userStore';
import Tutorial from '@/components/modals/Tutorial';
import LevelUpModal from '@/components/modals/LevelUpModal';
import StreakModal from '@/components/modals/StreakModal';
import { useState, useEffect } from 'react';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { streak, hearts, gems } = useUserStore();
  const location = useLocation();
  const { language, theme, toggleTheme, currentCourse } = useSettingsStore();
  const { showLevelUp, setShowLevelUp, showStreak, setShowStreak, hasSeenTutorial, setHasSeenTutorial } = useUserStore();
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    if (!hasSeenTutorial) {
      const timer = setTimeout(() => setShowTutorial(true), 1500);
      return () => clearTimeout(timer);
    } else {
      setShowTutorial(false);
    }
  }, [hasSeenTutorial]);

  const navItems = [
    { id: '/',            icon: Home,     label: language === 'bn' ? 'শিখুন'       : 'LEARN'       },
    { id: '/playground',  icon: Code,     label: language === 'bn' ? 'কোড প্লেগ্রাউন্ড' : 'PLAYGROUND'  },
    { id: '/dsa',         icon: BookOpen,  label: language === 'bn' ? 'ভিজ্যুয়ালাইজার' : 'VISUALIZER'    },
    { id: '/leaderboard', icon: Trophy,    label: language === 'bn' ? 'লিডারবোর্ড'  : 'LEADERBOARD' },
    { id: '/shop',        icon: ShoppingBag, label: language === 'bn' ? 'শপ'        : 'SHOP'        },
    { id: '/profile',     icon: User,      label: language === 'bn' ? 'প্রোফাইল'    : 'PROFILE'     },
    { id: '/settings',    icon: Settings,  label: language === 'bn' ? 'সেটিংস'      : 'SETTINGS'    },
  ];

  const isPython = currentCourse === 'python';

  return (
    <div className="flex h-screen bg-app-bg text-app-fg overflow-hidden">
      <Tutorial isOpen={showTutorial} onClose={() => { setShowTutorial(false); setHasSeenTutorial(true); }} />
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
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Zap size={22} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="font-black text-2xl tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              {isPython ? 'py.' : 'cpp.'}
            </span>
            <span className="text-app-fg">cholosikhi</span>
          </div>
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
            onClick={toggleTheme}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all text-[var(--app-fg-muted)] border-2 border-transparent hover:bg-blue-500/5 hover:text-blue-400"
          >
            {theme === 'dark'
              ? <Sun size={22} className="text-amber-400" />
              : <Moon size={22} />}
            <span className="uppercase tracking-wider text-xs">
              {theme === 'dark'
                ? (language === 'bn' ? 'লাইট' : 'LIGHT')
                : (language === 'bn' ? 'ডার্ক' : 'DARK')}
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
            <span className="font-black text-lg">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                {isPython ? 'py.' : 'cpp.'}
              </span>
              <span className="text-app-fg">cholosikhi</span>
            </span>
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
              <button onClick={toggleTheme} className="p-1.5 rounded-xl hover:bg-blue-500/10 transition text-[var(--app-fg-muted)]">
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
