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

/**
 * Main Application Routing and Context Provider Component
 * Configures React Router, global stores initialization, theme toggling, and page code-splitting.
 */
export default function App() {
  const { theme, loadSettings } = useSettingsStore();
  const { initialize, session } = useAuthStore();
  const { loadFromSupabase: loadUser } = useUserStore();
  const { loadFromSupabase: loadProgress } = useProgressStore();
  const { loadQuests, initializeQuests } = useQuestStore();

  // 1. Initialize bdapps session state on application boot
  useEffect(() => {
    initialize();
  }, [initialize]);

  // 2. Synchronize user profile, progress, settings, and quests when an active session exists
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

  // 3. Apply active theme (Dark/Light mode) to document root
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <BrowserRouter>
      {/* Toast Notification Container */}
      <Toaster />

      <Routes>
        {/* Public Gateway Routes */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/welcome" element={<Welcome />} />

        {/* Protected Application Routes (Requires valid session) */}
        <Route element={<ProtectedRoute />}>
          {/* Immersive Fullscreen Coding Session Route */}
          <Route path="/session/:lessonId" element={<Suspense fallback={null}><Session /></Suspense>} />

          {/* Core Dashboard Views wrapped in AppShell Layout */}
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
          <Route path="/profile" element={<AppShell><Profile /></AppShell>} />
          
          {/* Legacy route fallback */}
          <Route path="/discover" element={<Suspense fallback={null}><AppShell><Discover /></AppShell></Suspense>} />
        </Route>

        {/* Fallback wildcard redirect */}
        <Route path="*" element={session ? <Navigate to="/" replace /> : <Navigate to="/welcome" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
