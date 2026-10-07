import { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSettingsStore } from './store/settingsStore';
import AppShell from './components/layout/AppShell';

import { useAuthStore } from './store/authStore';
import { useUserStore } from './store/userStore';
import { useProgressStore } from './store/progressStore';
import { useQuestStore } from './store/questStore';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Toaster from './components/common/Toaster';
import NiniNotification from './components/common/NiniNotification';
import SuspensePageLoader from '../components/SuspensePageLoader';

// Eager-loaded core pages
import Home from './pages/Home';
import Profile from './pages/Profile';
import Welcome from './pages/Welcome';
import Auth from './pages/Auth';

// Lazy-loaded heavy pages
const Session = lazy(() => import('./pages/Session'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Achievements = lazy(() => import('./pages/Achievements'));
const CodePlayground = lazy(() => import('./pages/CodePlayground'));
const Discover = lazy(() => import('./pages/Discover'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Certificate = lazy(() => import('./pages/Certificate'));
const CertificationExam = lazy(() => import('./pages/CertificationExam'));
const AdminAnalytics = lazy(() => import('./pages/AdminAnalytics'));
const AiTutor = lazy(() => import('./pages/AiTutor'));

export default function PyApp() {
  const { loadSettings } = useSettingsStore();
  const { initialize, session } = useAuthStore();
  const { loadFromSupabase: loadUser } = useUserStore();
  const { loadFromSupabase: loadProgress } = useProgressStore();
  const { loadQuests, initializeQuests } = useQuestStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Load cloud data on login
  useEffect(() => {
    if (session) {
      loadUser().then(() => {
        useUserStore.getState().checkAndUpdateStreak();
      });
      loadProgress();
      loadSettings();
      loadQuests().then(() => initializeQuests());
    }
  }, [session, loadUser, loadProgress, loadSettings, loadQuests, initializeQuests]);

  return (
    <>
      <Toaster />
      <NiniNotification />
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/privacy" element={<Suspense fallback={<SuspensePageLoader />}><Privacy /></Suspense>} />
        <Route path="/terms" element={<Suspense fallback={<SuspensePageLoader />}><Terms /></Suspense>} />
        <Route path="/admin" element={<Suspense fallback={<SuspensePageLoader />}><AdminAnalytics /></Suspense>} />
        <Route path="/admin/analytics" element={<Suspense fallback={<SuspensePageLoader />}><AdminAnalytics /></Suspense>} />
        <Route
          path="/certificate"
          element={
            <Suspense fallback={<SuspensePageLoader />}>
              {session ? <AppShell><Certificate /></AppShell> : <Certificate />}
            </Suspense>
          }
        />

        <Route element={<ProtectedRoute />}>
          <Route path="/session/:lessonId" element={<Suspense fallback={<SuspensePageLoader />}><Session /></Suspense>} />
          <Route
            path="/"
            element={
              <Suspense fallback={<SuspensePageLoader />}>
                <AppShell><Home /></AppShell>
              </Suspense>
            }
          />
          <Route path="/playground" element={<Suspense fallback={<SuspensePageLoader />}><AppShell><CodePlayground /></AppShell></Suspense>} />
          <Route path="/leaderboard" element={<Suspense fallback={<SuspensePageLoader />}><AppShell><Leaderboard /></AppShell></Suspense>} />
          <Route path="/achievements" element={<Suspense fallback={<SuspensePageLoader />}><AppShell><Achievements /></AppShell></Suspense>} />
          <Route path="/certificate/exam" element={<Suspense fallback={<SuspensePageLoader />}><CertificationExam /></Suspense>} />
          <Route path="/ai-tutor" element={<Suspense fallback={<SuspensePageLoader />}><AppShell><AiTutor /></AppShell></Suspense>} />
          <Route path="/tutor" element={<Navigate to="/py/ai-tutor" replace />} />
          <Route path="/profile" element={<AppShell><Profile /></AppShell>} />
          <Route path="/discover" element={<Suspense fallback={<SuspensePageLoader />}><AppShell><Discover /></AppShell></Suspense>} />
          <Route path="/learn" element={<Navigate to="/py" replace />} />
        </Route>

        <Route path="*" element={session ? <Navigate to="/py" replace /> : <Navigate to="/auth?redirect=/py" replace />} />
      </Routes>
    </>
  );
}
