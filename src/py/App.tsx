import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSettingsStore } from './store/settingsStore';
import AppShell from './components/layout/AppShell';

import { useAuthStore } from './store/authStore';
import { useUserStore } from './store/userStore';
import { useProgressStore } from './store/progressStore';
import { useQuestStore } from './store/questStore';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Toaster from './components/common/Toaster';
import NiniNotification from './components/common/NiniNotification';
import { Analytics } from '@vercel/analytics/react';

// Eager-loaded core pages
import Home from './pages/Home';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import Welcome from './pages/Welcome';

// Lazy-loaded heavy pages (code-split)
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

export default function App() {
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

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <BrowserRouter>
      <Toaster />
      <NiniNotification />
      <Analytics />
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/privacy" element={<Suspense fallback={null}><Privacy /></Suspense>} />
        <Route path="/terms" element={<Suspense fallback={null}><Terms /></Suspense>} />
        {/* Superuser Secret Analytics Dashboard */}
        <Route path="/admin" element={<Suspense fallback={null}><AdminAnalytics /></Suspense>} />
        <Route path="/admin/analytics" element={<Suspense fallback={null}><AdminAnalytics /></Suspense>} />
        {/* Public Certificate & QR Verification Route */}
        <Route
          path="/certificate"
          element={
            <Suspense fallback={null}>
              {session ? <AppShell><Certificate /></AppShell> : <Certificate />}
            </Suspense>
          }
        />

        <Route element={<ProtectedRoute />}>
          {/* Full screen Immersive Session Route */}
          <Route path="/session/:lessonId" element={<Suspense fallback={null}><Session /></Suspense>} />

          {/* Dashboard Routes wrapped in AppShell structure */}
          <Route
            path="/"
            element={
              <Suspense fallback={null}>
                <AppShell><Home /></AppShell>
              </Suspense>
            }
          />
          <Route path="/playground" element={<Suspense fallback={null}><AppShell><CodePlayground /></AppShell></Suspense>} />
          <Route path="/leaderboard" element={<Suspense fallback={null}><AppShell><Leaderboard /></AppShell></Suspense>} />
          <Route path="/achievements" element={<Suspense fallback={null}><AppShell><Achievements /></AppShell></Suspense>} />
          <Route path="/certificate/exam" element={<Suspense fallback={null}><CertificationExam /></Suspense>} />
          <Route path="/profile" element={<AppShell><Profile /></AppShell>} />
          {/* /discover kept for backward compat — no nav link */}
          <Route path="/discover" element={<Suspense fallback={null}><AppShell><Discover /></AppShell></Suspense>} />
          {/* /learn alias for direct navigation */}
          <Route path="/learn" element={<Navigate to="/" replace />} />
        </Route>

        {/* Redirect based on session */}
        <Route path="*" element={session ? <Navigate to="/" replace /> : <Navigate to="/welcome" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
