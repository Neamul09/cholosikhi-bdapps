import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Flame,
  Zap,
  Target,
  BookOpen,
  Award,
  AlertTriangle,
  Skull,
  FileText,
  Calendar,
  Home,
  Sliders,
  Library,
  MessageSquare,
  LogIn,
  LogOut,
  User as UserIcon,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles
} from 'lucide-react';
import { clsx } from 'clsx';
import { play } from '../../lib/audio';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';

interface SatNavbarProps {
  xp: number;
  streak: number;
  onOpenCustomQuiz?: () => void;
  onOpenFeedback?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function SatNavbar({
  xp,
  streak,
  onOpenCustomQuiz,
  onOpenFeedback,
  isCollapsed = false,
  onToggleCollapse
}: SatNavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { user, signOut } = useAuthStore();
  const userStore = useUserStore();

  // Dynamic user name synchronization
  const [localName, setLocalName] = useState(() => {
    return (
      (typeof window !== 'undefined'
        ? localStorage.getItem('cs_sat_user_name') || localStorage.getItem('cholosikhi_user_name')
        : '') || ''
    );
  });

  useEffect(() => {
    const handleNameChange = (e: any) => {
      if (e?.detail?.name) {
        setLocalName(e.detail.name);
      }
    };
    window.addEventListener('cs_user_name_changed', handleNameChange);
    return () => window.removeEventListener('cs_user_name_changed', handleNameChange);
  }, []);

  const displayName =
    user?.name ||
    (user as any)?.user_metadata?.full_name ||
    userStore.name ||
    localName ||
    (user?.mobile ? user.mobile : 'Scholar');

  // Navigation warning state when test/practice session is active
  const [showNavWarning, setShowNavWarning] = useState(false);
  const [pendingNavPath, setPendingNavPath] = useState<string | null>(null);

  const isTestActive = () => {
    if (typeof window === 'undefined') return false;
    const sessionFlag = sessionStorage.getItem('cs_sat_test_in_progress') === 'true';
    const isQuizRoute = currentPath.startsWith('/sat/quiz');
    return sessionFlag || isQuizRoute;
  };

  const handleNavClick = (e: React.MouseEvent, targetPath: string) => {
    if (targetPath === currentPath) {
      play('tap');
      return;
    }
    if (isTestActive()) {
      e.preventDefault();
      setPendingNavPath(targetPath);
      setShowNavWarning(true);
      return;
    }
    play('tap');
  };

  const handleCustomPracticeClick = () => {
    if (isTestActive()) {
      setPendingNavPath('custom_practice');
      setShowNavWarning(true);
      return;
    }
    play('tap');
    onOpenCustomQuiz?.();
  };

  const confirmLeaveTest = () => {
    sessionStorage.removeItem('cs_sat_test_in_progress');
    window.dispatchEvent(new CustomEvent('cs_sat_test_force_exit'));
    setShowNavWarning(false);
    if (pendingNavPath === 'custom_practice') {
      onOpenCustomQuiz?.();
    } else if (pendingNavPath) {
      navigate(pendingNavPath);
    }
    setPendingNavPath(null);
  };

  const masteryLinks = [
    { label: 'Nini AI Tutor', path: '/sat/ai-tutor', icon: Sparkles, isAi: true },
    { label: 'Vocab Vault', path: '/sat/vocab', icon: FileText },
    { label: 'Study Routine', path: '/sat/routine', icon: Calendar },
    { label: 'Leaderboard', path: '/sat/leaderboard', icon: Award },
    { label: 'Resource Library', path: '/sat/resources', icon: Library },
    { label: 'My Profile', path: '/sat/profile', icon: UserIcon }
  ];

  const mobileNavItems = [
    { label: 'Home', path: '/sat', icon: Target },
    { label: 'AI Tutor', path: '/sat/ai-tutor', icon: Sparkles },
    { label: 'Custom', action: 'custom_practice', icon: Sliders },
    { label: 'Types', path: '/sat/types', icon: BookOpen },
    { label: 'Mistakes', path: '/sat/mistakes', icon: AlertTriangle, isMistake: true },
    { label: 'Hardest', path: '/sat/hardest', icon: Skull },
    { label: 'Vocab', path: '/sat/vocab', icon: FileText },
    { label: 'Profile', path: '/sat/profile', icon: UserIcon }
  ];

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────────
          DESKTOP: Floating Sidebar Re-open Toggle (When Left Bar is Hidden)
      ───────────────────────────────────────────────────────────────── */}
      {isCollapsed && onToggleCollapse && (
        <button
          type="button"
          onClick={() => {
            play('tap');
            onToggleCollapse();
          }}
          className="hidden md:flex fixed left-4 top-4 z-40 p-2.5 rounded-2xl bg-panel-solid/95 backdrop-blur-md border border-border-subtle hover:border-blue-500/50 shadow-2xl text-app-fg hover:text-blue-400 transition-all items-center gap-2 group animate-fadeIn"
          title="Show sidebar navigation"
          aria-label="Show sidebar navigation"
        >
          <PanelLeftOpen size={18} className="text-blue-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-black tracking-tight pr-1">Sidebar</span>
        </button>
      )}

      {/* ─────────────────────────────────────────────────────────────────
          DESKTOP: Left Sidebar Navigation
      ───────────────────────────────────────────────────────────────── */}
      <aside
        className={clsx(
          "hidden md:flex md:w-64 lg:w-72 fixed left-0 top-0 bottom-0 z-40 flex-col justify-between bg-panel border-r border-border-subtle p-5 select-none overflow-y-auto transition-transform duration-300 ease-in-out",
          isCollapsed && "-translate-x-full pointer-events-none"
        )}
      >
        {/* Top: Brand & Platform Badge */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Link
              to="/sat"
              onClick={() => play('tap')}
              className="flex items-center gap-2 group"
            >
              <img
                src="/wordmark.png"
                alt="CholoSikhi"
                className="h-7 w-auto drop-shadow-sm group-hover:scale-105 transition-transform"
              />
            </Link>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 font-black text-[10px] uppercase tracking-wider">
                Digital SAT
              </span>

              {onToggleCollapse && (
                <button
                  type="button"
                  onClick={() => {
                    play('tap');
                    onToggleCollapse();
                  }}
                  className="p-1.5 rounded-xl hover:bg-white/10 text-app-fg/50 hover:text-app-fg transition-colors"
                  title="Hide sidebar (Expand workspace)"
                  aria-label="Hide sidebar"
                >
                  <PanelLeftClose size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Gamification Stats: Streak & XP */}
          <div className="grid grid-cols-2 gap-2 p-2.5 rounded-2xl bg-app-bg border border-border-subtle shadow-inner">
            <div className="flex items-center gap-2 px-2 py-1">
              <Flame size={16} className="text-orange-500 fill-orange-500 animate-pulse" />
              <div>
                <div className="text-xs font-black text-app-fg">{streak} Days</div>
                <div className="text-[9px] font-bold text-app-fg/40 uppercase">Streak</div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-2 py-1 border-l border-border-subtle">
              <Zap size={16} className="text-amber-400 fill-amber-400" />
              <div>
                <div className="text-xs font-black text-app-fg">{xp} XP</div>
                <div className="text-[9px] font-bold text-app-fg/40 uppercase">Mastery</div>
              </div>
            </div>
          </div>

          {/* Navigation Links: Practice Section (Strict Sequence) */}
          <div className="space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-app-fg/40 px-3 py-1">
              Practice & Quizzes
            </div>

            {/* 1. Dashboard */}
            <Link
              to="/sat"
              onClick={(e) => handleNavClick(e, '/sat')}
              className={clsx(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-all",
                currentPath === '/sat'
                  ? "bg-blue-500/15 border border-blue-500/30 text-blue-400 font-black shadow-sm"
                  : "text-app-fg/70 hover:text-app-fg hover:bg-panel border border-transparent"
              )}
            >
              <Target size={16} strokeWidth={currentPath === '/sat' ? 2.5 : 2} />
              <span>Dashboard</span>
            </Link>

            {/* 2. Custom Practice Builder */}
            {onOpenCustomQuiz && (
              <button
                type="button"
                onClick={handleCustomPracticeClick}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-bold text-xs text-cyan-400 hover:bg-cyan-500/10 border border-transparent transition-all text-left group"
              >
                <Sliders size={16} className="text-cyan-400 group-hover:rotate-45 transition-transform" />
                <span>Custom Practice Builder</span>
              </button>
            )}

            {/* 3. Type Mastery */}
            <Link
              to="/sat/types"
              onClick={(e) => handleNavClick(e, '/sat/types')}
              className={clsx(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-all",
                currentPath.startsWith('/sat/types')
                  ? "bg-blue-500/15 border border-blue-500/30 text-blue-400 font-black shadow-sm"
                  : "text-app-fg/70 hover:text-app-fg hover:bg-panel border border-transparent"
              )}
            >
              <BookOpen size={16} strokeWidth={currentPath.startsWith('/sat/types') ? 2.5 : 2} />
              <span>Type Mastery</span>
            </Link>

            {/* 4. Mistake Bank (Glowing Red, matches theme) */}
            <Link
              to="/sat/mistakes"
              onClick={(e) => handleNavClick(e, '/sat/mistakes')}
              className={clsx(
                "relative flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-black text-xs transition-all overflow-hidden",
                currentPath.startsWith('/sat/mistakes')
                  ? "bg-rose-500/20 border border-rose-500/60 text-rose-300 shadow-[0_0_16px_rgba(244,63,94,0.45)]"
                  : "text-rose-400 bg-rose-500/[0.08] hover:bg-rose-500/15 border border-rose-500/25 hover:border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.2)] hover:shadow-[0_0_16px_rgba(244,63,94,0.35)]"
              )}
            >
              <AlertTriangle size={16} className="text-rose-400 drop-shadow-[0_0_6px_rgba(244,63,94,0.6)]" strokeWidth={2.5} />
              <span className="tracking-tight">Mistake Bank</span>
              <span className="relative flex h-2 w-2 ml-auto">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 shadow-[0_0_8px_#f43f5e]"></span>
              </span>
            </Link>

            {/* 5. Hardest Vault */}
            <Link
              to="/sat/hardest"
              onClick={(e) => handleNavClick(e, '/sat/hardest')}
              className={clsx(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-all",
                currentPath.startsWith('/sat/hardest')
                  ? "bg-pink-500/15 border border-pink-500/40 text-pink-400 font-black shadow-sm"
                  : "text-pink-400 hover:bg-pink-500/10 border border-transparent"
              )}
            >
              <Skull size={16} strokeWidth={currentPath.startsWith('/sat/hardest') ? 2.5 : 2} />
              <span>Hardest Vault</span>
            </Link>

            {/* 6. Quick Practice */}
            <Link
              to="/sat/quick-practice"
              onClick={(e) => handleNavClick(e, '/sat/quick-practice')}
              className={clsx(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-all",
                currentPath.startsWith('/sat/quick-practice')
                  ? "bg-blue-500/15 border border-blue-500/30 text-blue-400 font-black shadow-sm"
                  : "text-app-fg/70 hover:text-app-fg hover:bg-panel border border-transparent"
              )}
            >
              <Zap size={16} strokeWidth={currentPath.startsWith('/sat/quick-practice') ? 2.5 : 2} />
              <span>Quick Practice</span>
            </Link>
          </div>

          {/* Navigation Links: Mastery & Tools Section */}
          <div className="space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-app-fg/40 px-3 py-1">
              Mastery & Tools
            </div>
            {masteryLinks.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path || currentPath.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={(e) => handleNavClick(e, item.path)}
                  className={clsx(
                    "flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-all group",
                    isActive
                      ? "bg-blue-500/15 border border-blue-500/30 text-blue-400 font-black shadow-sm"
                      : item.isAi
                      ? "text-cyan-300 hover:text-cyan-200 hover:bg-cyan-500/10 border border-cyan-500/20"
                      : "text-app-fg/70 hover:text-app-fg hover:bg-panel border border-transparent"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} strokeWidth={isActive ? 2.5 : 2} className={item.isAi ? "text-cyan-400 animate-pulse" : ""} />
                    <span>{item.label}</span>
                  </div>
                  {item.isAi && (
                    <span className="px-1.5 py-0.5 rounded-md bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-black text-[9px] uppercase tracking-wider shadow-sm">
                      AI 24/7
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Desktop Bottom: User Account, Feedback, Theme Toggle & Home */}
        <div className="pt-4 border-t border-border-subtle space-y-3">
          {/* User Account / Profile Card */}
          <div>
            {user ? (
              <div className="p-2.5 rounded-2xl bg-panel border border-border-subtle flex items-center justify-between gap-2 shadow-sm group hover:border-blue-500/40 transition-colors">
                <Link
                  to="/sat/profile"
                  onClick={(e) => handleNavClick(e, '/sat/profile')}
                  className="flex items-center gap-2 overflow-hidden flex-1"
                  title="View Your SAT Profile"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-black text-xs shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                    {displayName[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-black text-app-fg truncate group-hover:text-blue-400 transition-colors">
                      {displayName}
                    </p>
                    <p className="text-[10px] text-app-fg/50 truncate font-semibold">
                      {user.email || user.mobile}
                    </p>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => { play('tap'); signOut(); }}
                  className="p-1.5 rounded-xl hover:bg-white/10 text-app-fg/50 hover:text-rose-400 transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <Link
                to="/auth?redirect=/sat"
                onClick={(e) => handleNavClick(e, '/auth?redirect=/sat')}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <LogIn size={14} />
                <span>Log In / Sign Up</span>
              </Link>
            )}
          </div>

          {onOpenFeedback && (
            <button
              type="button"
              onClick={() => { play('tap'); onOpenFeedback(); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-app-fg/70 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
            >
              <MessageSquare size={15} className="text-emerald-400" />
              <span>Send Feedback</span>
            </button>
          )}

          <div className="pt-1">
            <Link
              to="/"
              onClick={(e) => handleNavClick(e, '/')}
              className="text-xs font-bold text-app-fg/50 hover:text-app-fg transition-colors flex items-center gap-1.5"
            >
              <Home size={14} />
              <span>CholoSikhi Hub</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────────
          MOBILE: Top Header Bar (No Dropdown)
      ───────────────────────────────────────────────────────────────── */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-panel/95 backdrop-blur-md border-b border-border-subtle z-40 flex items-center justify-between px-4 select-none">
        <div className="flex items-center gap-2.5">
          <Link to="/sat" onClick={(e) => handleNavClick(e, '/sat')}>
            <img src="/wordmark.png" alt="CholoSikhi" className="h-6 w-auto" />
          </Link>
          <span className="px-2 py-0.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-black">
            SAT
          </span>
        </div>

        {/* Mobile Stats, Profile & Theme */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-app-bg border border-border-subtle text-xs font-black">
            <Flame size={13} className="text-orange-500 fill-orange-500" />
            <span>{streak}</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-app-bg border border-border-subtle text-xs font-black text-amber-400">
            <Zap size={13} className="fill-amber-400" />
            <span>{xp}</span>
          </div>

          {user ? (
            <Link
              to="/sat/profile"
              onClick={(e) => handleNavClick(e, '/sat/profile')}
              className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-black text-[11px] shrink-0"
              title="My Profile"
            >
              {displayName[0]?.toUpperCase() || 'U'}
            </Link>
          ) : (
            <Link
              to="/auth?redirect=/sat"
              onClick={(e) => handleNavClick(e, '/auth?redirect=/sat')}
              className="px-2 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-black flex items-center gap-1"
            >
              <LogIn size={12} />
              <span>Login</span>
            </Link>
          )}

          {onOpenFeedback && (
            <button
              onClick={() => { play('tap'); onOpenFeedback(); }}
              className="p-1.5 rounded-xl bg-app-bg border border-border-subtle text-app-fg hover:text-emerald-400"
              title="Send Feedback"
              aria-label="Send Feedback"
            >
              <MessageSquare size={14} />
            </button>
          )}
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────────
          MOBILE: Bottom Navigation Bar (With Profile)
      ───────────────────────────────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-panel/95 backdrop-blur-md border-t border-border-subtle py-1.5 px-2 flex justify-around items-center pb-[calc(0.5rem+env(safe-area-inset-bottom))] select-none shadow-2xl overflow-x-auto">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.path ? (currentPath === item.path || (item.path !== '/sat' && currentPath.startsWith(item.path))) : false;

          if (item.action === 'custom_practice') {
            return (
              <button
                key="mob-custom"
                type="button"
                onClick={handleCustomPracticeClick}
                className="flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all min-w-[50px] text-cyan-400 hover:text-cyan-300"
              >
                <Icon size={17} strokeWidth={2} />
                <span className="text-[9px] mt-0.5 font-bold tracking-tight">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path!}
              onClick={(e) => handleNavClick(e, item.path!)}
              className={clsx(
                "flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all min-w-[50px]",
                isActive
                  ? item.isMistake ? "text-rose-400 font-black scale-105" : "text-blue-400 font-black scale-105"
                  : item.isMistake
                  ? "text-rose-400/80 hover:text-rose-300 font-semibold"
                  : "text-app-fg/50 hover:text-app-fg"
              )}
            >
              <Icon size={17} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-[9px] mt-0.5 font-bold tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ─────────────────────────────────────────────────────────────────
          ACTIVE PRACTICE / QUIZ EXIT CONFIRMATION WARNING MODAL
      ───────────────────────────────────────────────────────────────── */}
      {showNavWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-panel-solid border-2 border-rose-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border-2 border-rose-500/30 text-rose-500 flex items-center justify-center mx-auto shadow-lg animate-pulse">
              <AlertTriangle size={32} />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-400">
                Active Test Session
              </span>
              <h3 className="text-2xl font-black text-app-fg tracking-tight">
                Leave Active Practice / Quiz?
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-app-fg/70 leading-relaxed">
                You have an ongoing practice test or quiz session in progress. If you leave now, your session will end and unsubmitted answers will not be recorded.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  play('tap');
                  setShowNavWarning(false);
                  setPendingNavPath(null);
                }}
                className="flex-1 btn-duo btn-duo-blue py-3 text-xs font-black shadow-none"
              >
                <span>Stay in Test</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  play('tap');
                  confirmLeaveTest();
                }}
                className="px-5 py-3 rounded-2xl bg-panel hover:bg-rose-500/15 border border-border-subtle hover:border-rose-500/40 text-xs font-bold text-rose-500 dark:text-rose-400 transition-all"
              >
                <span>Leave Anyway</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
