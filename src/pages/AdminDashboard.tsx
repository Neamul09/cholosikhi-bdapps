import { useState, useEffect } from 'react';
import {
  Users, Smartphone, Globe, ArrowUpRight,
  Download, RefreshCw, ShieldCheck,
  Activity, Play, CheckCircle2, Award, Terminal,
  BarChart3, Lock,
  KeyRound, ShieldAlert, LogOut, Sparkles,
  Database, DatabaseZap, TrendingUp
} from 'lucide-react';
import { clsx } from 'clsx';
import {
  fetchLiveDatabaseMetrics,
  getBufferedEvents,
  clearTelemetryBuffer,
  exportTelemetryData,
  type DatabaseMetrics,
  type TelemetryEvent,
} from '../lib/telemetry';
import { isSupabaseConfigured } from '../lib/supabase';

const ADMIN_PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE || 'CS-ADMIN-2026';
const SESSION_STORAGE_KEY = 'cholosikhi_master_admin_session';
const LOCKOUT_KEY = 'cholosikhi_admin_lockout_until';
const ATTEMPTS_KEY = 'cholosikhi_admin_failed_attempts';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<DatabaseMetrics>(() => ({
    uniqueVisitorsTotal: 1,
    uniqueVisitorsToday: 1,
    registeredUsersTotal: 0,
    lessonsCompletedTotal: 0,
    testsCompletedTotal: 0,
    reelVisitorsTotal: 0,
    directVisitorsTotal: 0,
    sources: {},
    devices: {},
    isLiveDatabase: false,
    lastUpdated: 0,
  }));

  const [events, setEvents] = useState<TelemetryEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'feed' | 'database'>('overview');
  const [copiedSql, setCopiedSql] = useState(false);

  // Security passcode state
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    try {
      const sessionRaw = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (sessionRaw) {
        const session = JSON.parse(sessionRaw);
        return Boolean(session.auth && session.expiresAt > Date.now());
      }
    } catch {
      // Ignore parse errors
    }
    return false;
  });

  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  // Prevent search engine crawlers from indexing the admin dashboard
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
    let created = false;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
      created = true;
    }
    meta.content = 'noindex, nofollow';
    return () => {
      if (created && meta.parentNode) {
        meta.parentNode.removeChild(meta);
      } else if (meta) {
        meta.content = 'index, follow';
      }
    };
  }, []);

  // Lockout countdown timer
  useEffect(() => {
    const checkLockout = () => {
      try {
        const lockoutUntil = parseInt(localStorage.getItem(LOCKOUT_KEY) || '0', 10);
        if (lockoutUntil > Date.now()) {
          setLockoutRemaining(Math.ceil((lockoutUntil - Date.now()) / 1000));
        } else {
          setLockoutRemaining(0);
        }
      } catch {
        // Ignore localStorage access errors
      }
    };

    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = async () => {
    setLoading(true);
    try {
      const live = await fetchLiveDatabaseMetrics();
      setMetrics(live);
      setEvents(getBufferedEvents());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isUnlocked) return;
    let isCancelled = false;

    void fetchLiveDatabaseMetrics().then((live) => {
      if (!isCancelled) {
        setMetrics(live);
        setEvents(getBufferedEvents());
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [isUnlocked]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutRemaining > 0) return;

    if (passcode === ADMIN_PASSCODE) {
      setIsUnlocked(true);
      setPasscode('');
      setPasscodeError('');
      localStorage.removeItem(ATTEMPTS_KEY);
      localStorage.removeItem(LOCKOUT_KEY);
      // Valid for 30 minutes
      sessionStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify({ auth: true, expiresAt: Date.now() + 30 * 60 * 1000 })
      );
    } else {
      const attempts = parseInt(localStorage.getItem(ATTEMPTS_KEY) || '0', 10) + 1;
      if (attempts >= 3) {
        const lockUntil = Date.now() + 5 * 60 * 1000; // 5 min lockout
        localStorage.setItem(LOCKOUT_KEY, lockUntil.toString());
        localStorage.removeItem(ATTEMPTS_KEY);
        setLockoutRemaining(300);
        setPasscodeError('Too many failed attempts. Console locked for 5 minutes.');
      } else {
        localStorage.setItem(ATTEMPTS_KEY, attempts.toString());
        setPasscodeError(`Invalid security passcode. ${3 - attempts} attempt(s) remaining.`);
      }
    }
  };

  const handleLockSession = () => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    setIsUnlocked(false);
  };

  const handleClearLocalBuffer = () => {
    if (window.confirm('Clear all local telemetry buffer? (Cloud Supabase data will remain safe)')) {
      clearTelemetryBuffer();
      void handleManualRefresh();
    }
  };

  const sqlSetupScript = `-- Run this in your Supabase SQL Editor if not already created:
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  source TEXT DEFAULT 'direct',
  is_reel BOOLEAN DEFAULT false,
  device_type TEXT DEFAULT 'desktop',
  platform TEXT DEFAULT 'unknown',
  properties JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow all users (anonymous and authenticated) to log analytics events
DROP POLICY IF EXISTS "Allow all users to insert analytics events" ON public.analytics_events;
CREATE POLICY "Allow all users to insert analytics events" ON public.analytics_events
  FOR INSERT WITH CHECK (true);

-- Allow viewing analytics events for admin reporting
DROP POLICY IF EXISTS "Allow authenticated users to view analytics events" ON public.analytics_events;
CREATE POLICY "Allow authenticated users to view analytics events" ON public.analytics_events
  FOR SELECT USING (true);

-- Index for instant unique user queries and real-time reel reporting
CREATE INDEX IF NOT EXISTS idx_analytics_visitor_id ON public.analytics_events(visitor_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_source ON public.analytics_events(source);
CREATE INDEX IF NOT EXISTS idx_analytics_is_reel ON public.analytics_events(is_reel);
CREATE INDEX IF NOT EXISTS idx_analytics_event_name ON public.analytics_events(event_name);
`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSetupScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE 1: SECURITY GATE (PIN / PASSCODE CHALLENGE)
  // ═══════════════════════════════════════════════════════════════════════════
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 selection:bg-cyan-500/30">
        <div className="max-w-md w-full bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner">
            <KeyRound size={32} />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-2">
              <ShieldCheck size={13} />
              <span>CholoSikhi Central Admin Console</span>
            </div>
            <h1 className="text-2xl font-black text-white">Master Security Challenge</h1>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Enter the master security passcode to access real-time visitor attribution, unique users count, and database progression telemetry.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">Master Security Passcode</label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode (e.g. CS-ADMIN-2026)..."
                disabled={lockoutRemaining > 0}
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-mono focus:border-cyan-400 focus:outline-none disabled:opacity-50 transition"
              />
            </div>

            {passcodeError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-400 font-bold">
                <ShieldAlert size={16} className="shrink-0" />
                <span>{passcodeError}</span>
              </div>
            )}

            {lockoutRemaining > 0 && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-400 font-bold">
                <span>Security Cooldown Active:</span>
                <span className="font-mono">
                  {Math.floor(lockoutRemaining / 60)}:{(lockoutRemaining % 60).toString().padStart(2, '0')}
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={lockoutRemaining > 0 || !passcode}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-sm font-black flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 transition"
            >
              <Lock size={16} />
              <span>Unlock Command Center</span>
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800">
            <a href="/" className="text-xs text-slate-400 hover:text-white font-medium transition">
              ← Return to CholoSikhi Landing Page
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE 2: UNLOCKED MASTER ADMIN COMMAND CENTER
  // ═══════════════════════════════════════════════════════════════════════════
  const totalSourcesCount = Object.values(metrics.sources).reduce((a, b) => a + b, 0) || 1;
  const totalDevicesCount = Object.values(metrics.devices).reduce((a, b) => a + b, 0) || 1;
  const mobileCount = (metrics.devices['mobile'] || 0);
  const mobilePercentage = Math.round((mobileCount / totalDevicesCount) * 100);
  const reelPercentage = Math.round((metrics.reelVisitorsTotal / (metrics.uniqueVisitorsTotal || 1)) * 100);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-sans selection:bg-cyan-500/30">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── Top Header Banner ── */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-6 bg-slate-900 border-2 border-slate-800 rounded-3xl shadow-xl">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <ShieldCheck size={13} />
                <span>cholosikhi.com Master Command Center</span>
              </div>
              <div className={clsx(
                'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border',
                metrics.isLiveDatabase
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              )}>
                {metrics.isLiveDatabase ? <DatabaseZap size={13} /> : <Database size={13} />}
                <span>{metrics.isLiveDatabase ? 'Supabase Database: Live Connected' : 'Telemetry: Local Buffer Mode'}</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Platform Intelligence & Unique Users Hub
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Comprehensive telemetry across social reel campaigns, unique user counts, learning progression funnels, and data-driven improvements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleManualRefresh}
              disabled={loading}
              className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              title="Refresh Live Metrics"
            >
              <RefreshCw size={14} className={clsx(loading && 'animate-spin')} />
              <span>Refresh</span>
            </button>
            <button
              onClick={exportTelemetryData}
              className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              title="Export Events JSON"
            >
              <Download size={14} />
              <span>Export JSON</span>
            </button>
            <a
              href="https://py.cholosikhi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <span>Python App</span>
              <ArrowUpRight size={13} />
            </a>
            <button
              onClick={handleLockSession}
              className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              title="Lock Admin Session"
            >
              <LogOut size={14} />
              <span>Lock Session</span>
            </button>
          </div>
        </div>

        {/* ── Key Performance Indicators (Unique Users & Funnel) ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          
          {/* 1. Total Unique Users */}
          <div className="p-4 rounded-2xl bg-slate-900 border-2 border-cyan-500/30 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-cyan-400 font-bold mb-1">
              <span>Unique Visitors</span>
              <Users size={16} />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {metrics.uniqueVisitorsTotal.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-medium">All-time distinct devices</div>
            <div className="absolute -bottom-6 -right-6 w-16 h-16 rounded-full bg-cyan-500/5 pointer-events-none" />
          </div>

          {/* 2. Today's Unique Users */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between text-xs text-emerald-400 font-bold mb-1">
              <span>Today Unique</span>
              <Activity size={16} />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {metrics.uniqueVisitorsToday.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-medium">Active visitors today</div>
          </div>

          {/* 3. Reel Traffic Visitors */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between text-xs text-pink-400 font-bold mb-1">
              <span>Reel Visitors</span>
              <Play size={16} />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {metrics.reelVisitorsTotal.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-medium">{reelPercentage}% of all traffic</div>
          </div>

          {/* 4. Registered Learners (Database Profiles) */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between text-xs text-blue-400 font-bold mb-1">
              <span>Registered Accounts</span>
              <ShieldCheck size={16} />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {metrics.registeredUsersTotal.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-medium">Supabase Profiles</div>
          </div>

          {/* 5. Lessons Completed */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between text-xs text-amber-400 font-bold mb-1">
              <span>Completed Lessons</span>
              <CheckCircle2 size={16} />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {metrics.lessonsCompletedTotal.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-medium">Across all units</div>
          </div>

          {/* 6. Mobile Traffic Share */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between text-xs text-purple-400 font-bold mb-1">
              <span>Mobile Share</span>
              <Smartphone size={16} />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {mobilePercentage}%
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-medium">{mobileCount} mobile users</div>
          </div>

        </div>

        {/* ── Actionable Data-Driven Improvement Recommendations ("Use data to improve further") ── */}
        <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-cyan-950/40 border-2 border-cyan-500/20 shadow-md space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                Data-Driven Improvement Engine • Actionable Growth Recommendations
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Real-time recommendations generated automatically from your current visitor behavior and conversion funnels:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Recommendation 1 */}
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-black text-cyan-400">
                <TrendingUp size={14} />
                <span>Reel Funnel Conversion</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {metrics.reelVisitorsTotal > 0
                  ? `You have attracted ${metrics.reelVisitorsTotal} reel viewers! To maximize conversion into learners, highlight the '১০ সেকেন্ডে প্রথম কোড রান করো' button directly on top of mobile screens.`
                  : 'Start posting short 30-sec reels demonstrating Nini mascot interactive Python challenges with link in bio or sticker link to generate viral top-of-funnel traffic.'}
              </p>
            </div>

            {/* Recommendation 2 */}
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-black text-pink-400">
                <Smartphone size={14} />
                <span>In-App Mobile Browser UX</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Mobile visitors account for {mobilePercentage}% of your audience. Ensure the code keyboard on mobile screens doesn&apos;t obscure the &apos;Check Answer&apos; button so reel visitors never drop out.
              </p>
            </div>

            {/* Recommendation 3 */}
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-black text-emerald-400">
                <Award size={14} />
                <span>Social Proof & LinkedIn Shares</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Students who earn verified certificates love sharing them on LinkedIn and Facebook. Our scannable QR verification guarantees zero fraud and brings viral organic traffic back to cholosikhi.com.
              </p>
            </div>
          </div>
        </div>

        {/* ── Tab Switcher ── */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={clsx(
              'px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5',
              activeTab === 'overview'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            )}
          >
            <BarChart3 size={14} />
            <span>Traffic & Funnel Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab('feed')}
            className={clsx(
              'px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5',
              activeTab === 'feed'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            )}
          >
            <Activity size={14} />
            <span>Live Event Stream ({events.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={clsx(
              'px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5',
              activeTab === 'database'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            )}
          >
            <Database size={14} />
            <span>Supabase Cloud Integration</span>
          </button>
        </div>

        {/* ── TAB 1: OVERVIEW & FUNNELS ── */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Traffic Sources Breakdown */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Globe size={16} className="text-cyan-400" />
                  <span>Traffic Sources & Reel Attribution</span>
                </h3>
                <span className="text-xs text-slate-500 font-mono">{totalSourcesCount} total hits</span>
              </div>

              <div className="space-y-3">
                {Object.entries(metrics.sources).length === 0 ? (
                  <div className="text-xs text-slate-500 italic py-6 text-center">
                    No traffic source records yet. As visitors land from Instagram, Facebook, and Reels, sources will appear here automatically.
                  </div>
                ) : (
                  Object.entries(metrics.sources)
                    .sort(([, a], [, b]) => b - a)
                    .map(([source, count]) => {
                      const pct = Math.round((count / totalSourcesCount) * 100);
                      const isReel = source.includes('reel') || source.includes('instagram') || source.includes('tiktok');
                      return (
                        <div key={source} className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className={clsx('capitalize flex items-center gap-1.5', isReel ? 'text-pink-400' : 'text-slate-300')}>
                              {isReel && <Play size={12} className="fill-pink-400" />}
                              <span>{source.replace(/_/g, ' ')}</span>
                            </span>
                            <span className="text-slate-400 font-mono">{count} ({pct}%)</span>
                          </div>
                          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                              className={clsx('h-full rounded-full transition-all duration-500', isReel ? 'bg-pink-500' : 'bg-cyan-500')}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>

            {/* Device Hardware Profiles */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Smartphone size={16} className="text-purple-400" />
                  <span>Device Hardware & In-App Browsers</span>
                </h3>
                <span className="text-xs text-slate-500 font-mono">{totalDevicesCount} sessions</span>
              </div>

              <div className="space-y-3">
                {Object.entries(metrics.devices).length === 0 ? (
                  <div className="text-xs text-slate-500 italic py-6 text-center">
                    Hardware profiling will display device breakdowns as visitors arrive.
                  </div>
                ) : (
                  Object.entries(metrics.devices).map(([device, count]) => {
                    const pct = Math.round((count / totalDevicesCount) * 100);
                    return (
                      <div key={device} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="capitalize text-slate-300">{device}</span>
                          <span className="text-slate-400 font-mono">{count} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-purple-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
                <div className="font-bold text-slate-300">💡 Optimization Note:</div>
                <p>
                  Instagram &amp; Facebook mobile in-app browsers have custom viewport heights. CholoSikhi layout dynamically scales using <code className="text-cyan-400">100dvh</code> so exercises fit smoothly on smartphones.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* ── TAB 2: LIVE EVENT STREAM ── */}
        {activeTab === 'feed' && (
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Terminal size={16} className="text-cyan-400" />
                  <span>Real-Time Visitor Telemetry Audit Stream</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Recent actions, reel arrivals, page visits, and conversion touchpoints.
                </p>
              </div>
              <button
                onClick={handleClearLocalBuffer}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
              >
                Clear Local Ring-Buffer
              </button>
            </div>

            {events.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No events in buffer yet. Open the site in an incognito window or reel link to witness live events streaming here!
              </div>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                {events.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={clsx(
                        'px-2 py-0.5 rounded text-[10px] font-bold uppercase',
                        ev.name.includes('reel') ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      )}>
                        {ev.name}
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        ID: <span className="text-slate-200">{ev.context.visitorId.slice(0, 10)}...</span>
                      </span>
                      {ev.context.isReelTraffic && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-pink-500/10 text-pink-300 border border-pink-500/20">
                          Reel
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>Source: <strong className="text-slate-200">{ev.context.source}</strong></span>
                      <span>•</span>
                      <span>Device: <strong className="text-slate-200">{ev.context.deviceType}</strong></span>
                      <span>•</span>
                      <span className="text-slate-500">
                        {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: SUPABASE CLOUD INTEGRATION ── */}
        {activeTab === 'database' && (
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Database size={18} className="text-cyan-400" />
                  <span>Supabase Database Telemetry Configuration</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  CholoSikhi uses Supabase PostgreSQL to persist user progress, credentials, and telemetry events.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={copySql}
                  className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow"
                >
                  <Terminal size={14} />
                  <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL Schema'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-400">Database Connection Status</span>
                <div className="flex items-center gap-2 text-sm font-black">
                  <span className={clsx('w-2.5 h-2.5 rounded-full', isSupabaseConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400')} />
                  <span>{isSupabaseConfigured ? 'Supabase Credentials Configured' : 'Local Standby (Awaiting VITE_SUPABASE_URL)'}</span>
                </div>
                <p className="text-xs text-slate-500">
                  {isSupabaseConfigured
                    ? 'All events are asynchronously mirrored to the analytics_events table in Supabase.'
                    : 'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your Vercel Project Settings to activate cloud sync.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-400">Active Tables Tracked</span>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-cyan-300">profiles</div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-cyan-300">lesson_progress</div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-cyan-300">test_results</div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-cyan-300">analytics_events</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">Supabase SQL Table Setup Script</label>
              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-mono overflow-x-auto leading-relaxed">
                {sqlSetupScript}
              </pre>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
