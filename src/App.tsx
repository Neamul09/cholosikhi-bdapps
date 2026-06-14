import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSettingsStore } from './store/settingsStore';
import AppShell from './components/layout/AppShell';

import { useAuthStore } from './store/authStore';
import { useUserStore } from './store/userStore';
import { useProgressStore } from './store/progressStore';
import { useQuestStore } from './store/questStore';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Session from './pages/Session';
import DSAPlayground from './pages/DSAPlayground';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import Achievements from './pages/Achievements';
import Settings from './pages/Settings';
import Shop from './pages/Shop';
import Auth from './pages/Auth';
import Welcome from './pages/Welcome';
import CodePlayground from './pages/CodePlayground';

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
          <Route path="/session/:lessonId" element={<Session />} />

          {/* Dashboard Routes wrapped in AppShell structure */}
          <Route path="/" element={<AppShell><Home /></AppShell>} />
          <Route path="/dsa" element={<AppShell><DSAPlayground /></AppShell>} />
          <Route path="/leaderboard" element={<AppShell><Leaderboard /></AppShell>} />
          <Route path="/profile" element={<AppShell><Profile /></AppShell>} />
          <Route path="/shop" element={<AppShell><Shop /></AppShell>} />
          <Route path="/playground" element={<AppShell><CodePlayground /></AppShell>} />
          <Route path="/achievements" element={<AppShell><Achievements /></AppShell>} />
          <Route path="/settings" element={<AppShell><Settings /></AppShell>} />
        </Route>

        {/* Redirect based on session */}
        <Route path="*" element={session ? <Navigate to="/" replace /> : <Navigate to="/welcome" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
