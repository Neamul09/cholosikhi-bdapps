import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSettingsStore } from './store/settingsStore';
import AppShell from './components/layout/AppShell';

import { useAuthStore } from './store/authStore';
import { useUserStore } from './store/userStore';
import { useProgressStore } from './store/progressStore';
import { useQuestStore } from './store/questStore';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Eager-loaded core pages
import Home from './pages/Home';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Shop from './pages/Shop';
import Auth from './pages/Auth';
import Welcome from './pages/Welcome';

// Lazy-loaded heavy pages (code-split)
const Session = lazy(() => import('./pages/Session'));
const DSAPlayground = lazy(() => import('./pages/DSAPlayground'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Achievements = lazy(() => import('./pages/Achievements'));
const CodePlayground = lazy(() => import('./pages/CodePlayground'));
const CommunityHub = lazy(() => import('./pages/CommunityHub'));
const Discover = lazy(() => import('./pages/Discover'));

export default function App() {
  const { theme, loadSettings } = useSettingsStore();
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
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/welcome" element={<Welcome />} />

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
          <Route path="/dsa" element={<Suspense fallback={null}><AppShell><DSAPlayground /></AppShell></Suspense>} />
          <Route path="/leaderboard" element={<Suspense fallback={null}><AppShell><Leaderboard /></AppShell></Suspense>} />
          <Route path="/profile" element={<AppShell><Profile /></AppShell>} />
          <Route path="/shop" element={<AppShell><Shop /></AppShell>} />
          <Route path="/playground" element={<Suspense fallback={null}><AppShell><CodePlayground /></AppShell></Suspense>} />
          <Route path="/achievements" element={<Suspense fallback={null}><AppShell><Achievements /></AppShell></Suspense>} />
          <Route path="/settings" element={<AppShell><Settings /></AppShell>} />
          <Route path="/community" element={<Suspense fallback={null}><AppShell><CommunityHub /></AppShell></Suspense>} />
          <Route path="/discover" element={<Suspense fallback={null}><AppShell><Discover /></AppShell></Suspense>} />
        </Route>

        {/* Redirect based on session */}
        <Route path="*" element={session ? <Navigate to="/" replace /> : <Navigate to="/welcome" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
