import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { clsx } from 'clsx';
import SatNavbar from './components/SatNavbar';
import SatDashboard from './pages/SatDashboard';
import SatQuizPage from './pages/SatQuizPage';
import SatHardestVault from './pages/SatHardestVault';
import SatMistakeBank from './pages/SatMistakeBank';
import SatLeaderboard from './pages/SatLeaderboard';
import SatRoutinePage from './pages/SatRoutinePage';
import SatVocabPage from './pages/SatVocabPage';
import SatResourcesPage from './pages/SatResourcesPage';
import SatQuickPracticePage from './pages/SatQuickPracticePage';
import SatTypeDrillPage from './pages/SatTypeDrillPage';
import SatProfilePage from './pages/SatProfilePage';
import SatAiTutor from './pages/SatAiTutor';
import SatNiniNotification from './components/SatNiniNotification';
import CustomTestModal from './components/CustomTestModal';
import SatFeedbackModal from './components/SatFeedbackModal';
import { loadSatUserState, loadSatUserStateFromCloud } from './lib/satStorage';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import type { SatUserState } from './types';

export default function SatApp() {
  const [userState, setUserState] = useState<SatUserState>(loadSatUserState);
  const [showCustomQuizModal, setShowCustomQuizModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('cs_sat_sidebar_collapsed') === 'true';
  });

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('cs_sat_sidebar_collapsed', String(next));
      return next;
    });
  };

  const { session, initialized, initialize } = useAuthStore();

  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  // Initialize auth & sync cloud state
  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (session) {
      useUserStore.getState().loadFromSupabase();
      loadSatUserStateFromCloud().then((cloudState) => {
        if (cloudState) setUserState(cloudState);
      });
    }
  }, [session]);

  // Refresh user state when window gains focus, storage event, or cloud sync
  useEffect(() => {
    const handleStorage = () => setUserState(loadSatUserState());
    window.addEventListener('storage', handleStorage);
    window.addEventListener('sat_state_updated', handleStorage);
    window.addEventListener('focus', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('sat_state_updated', handleStorage);
      window.removeEventListener('focus', handleStorage);
    };
  }, []);

  // Loading state while auth initializes
  if (!initialized) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-app-bg text-app-fg font-bluebook-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-black uppercase tracking-wider text-app-fg/50">Loading SAT Suite...</p>
        </div>
      </div>
    );
  }

  // Enforce authentication across the product
  if (!session) {
    const currentLoc = window.location.pathname + window.location.search;
    return <Navigate to={`/auth?redirect=${encodeURIComponent(currentLoc)}`} replace />;
  }

  return (
    <div className="min-h-screen bg-app-bg text-app-fg font-bluebook-sans selection:bg-blue-500/30 flex flex-col md:flex-row">
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 blur-[140px] rounded-full" />
      </div>

      {/* Navigation: PC Left Sidebar & Mobile Top/Bottom Bar */}
      <SatNavbar
        xp={userState.xp}
        streak={userState.streak}
        onOpenCustomQuiz={() => setShowCustomQuizModal(true)}
        onOpenFeedback={() => setShowFeedbackModal(true)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
      />

      {/* Main Page Content Workspace (Responsive to Sidebar Collapse) */}
      <main
        className={clsx(
          "flex-1 min-h-screen pt-16 md:pt-6 pb-24 md:pb-8 px-3 sm:px-6 w-full max-w-7xl mx-auto overflow-x-hidden transition-all duration-300 ease-in-out",
          !isSidebarCollapsed ? "md:pl-64 lg:pl-72" : "md:pl-6 lg:pl-8"
        )}
      >
        <Routes>
          <Route path="/" element={<SatDashboard onOpenCustomTest={() => setShowCustomQuizModal(true)} />} />
          <Route path="/dashboard" element={<SatDashboard onOpenCustomTest={() => setShowCustomQuizModal(true)} />} />
          <Route path="/quick-practice" element={<SatQuickPracticePage />} />
          <Route path="/types" element={<SatTypeDrillPage />} />
          <Route path="/quiz" element={<SatQuizPage />} />
          <Route path="/hardest" element={<SatHardestVault />} />
          <Route path="/mistakes" element={<SatMistakeBank />} />
          <Route path="/leaderboard" element={<SatLeaderboard />} />
          <Route path="/routine" element={<SatRoutinePage />} />
          <Route path="/vocab" element={<SatVocabPage />} />
          <Route path="/resources" element={<SatResourcesPage />} />
          <Route path="/ai-tutor" element={<SatAiTutor />} />
          <Route path="/profile" element={<SatProfilePage />} />
          <Route path="*" element={<Navigate to="/sat" replace />} />
        </Routes>
      </main>

      {/* Custom Quiz & Practice Test Modal */}
      <CustomTestModal
        isOpen={showCustomQuizModal}
        onClose={() => setShowCustomQuizModal(false)}
      />

      {/* SAT Feedback Modal */}
      <SatFeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />

      {/* Contextual Nini Mascot Coaching Toasts */}
      <SatNiniNotification />
    </div>
  );
}
