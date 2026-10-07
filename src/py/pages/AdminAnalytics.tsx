import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Users, Smartphone, Globe, ArrowUpRight,
  Download, RefreshCw, Trash2, ShieldCheck,
  Activity, Play, CheckCircle2, Award, Terminal,
  ExternalLink, BarChart3, AlertCircle, Lock,
  KeyRound, ShieldAlert, LogOut
} from 'lucide-react';
import { clsx } from 'clsx';
import { useIsSuperUser } from '@/lib/superUser';
import {
  getAnalyticsSummary,
  getRecentEvents,
  exportAnalyticsData,
  clearAnalyticsData,
  type AnalyticsSummary,
  type StoredTelemetryEvent,
} from '@/lib/analytics';

const ADMIN_PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE || 'CS-ADMIN-2026';
const SESSION_STORAGE_KEY = 'cholosikhi_admin_session';
const LOCKOUT_KEY = 'cholosikhi_admin_lockout_until';
const ATTEMPTS_KEY = 'cholosikhi_admin_failed_attempts';

export default function AdminAnalytics() {
  const navigate = useNavigate();
  const isSuper = useIsSuperUser();
  const [summary, setSummary] = useState<AnalyticsSummary>(getAnalyticsSummary);
  const [events, setEvents] = useState<StoredTelemetryEvent[]>(() => getRecentEvents(100));
  const [activeTab, setActiveTab] = useState<'overview' | 'feed'>('overview');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Master security passcode state
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    try {
      const sessionRaw = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (sessionRaw) {
        const session = JSON.parse(sessionRaw);
        return Boolean(session.auth && session.expiresAt > Date.now());
      }
    } catch {
      // Ignore sessionStorage access errors
    }
    return false;
  });
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  // Prevent search engine indexing
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

  // Check lockout
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

  // Security barrier: only superuser neamulmorshed@gmail.com can view
  useEffect(() => {
    if (!isSuper) {
      navigate('/py', { replace: true });
    }
  }, [isSuper, navigate]);

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
      const attempts = (parseInt(localStorage.getItem(ATTEMPTS_KEY) || '0', 10) + 1);
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

  const refreshData = () => {
    setSummary(getAnalyticsSummary());
    setEvents(getRecentEvents(100));
  };

  const handleClear = () => {
    clearAnalyticsData();
    refreshData();
    setShowClearConfirm(false);
  };

  if (!isSuper) {
    return (
      <div className="min-h-screen bg-app-bg text-app-fg flex items-center justify-center p-4">
        <div className="p-6 rounded-2xl bg-panel border border-border-subtle text-center space-y-3">
          <AlertCircle size={32} className="text-duo-red mx-auto" />
          <h2 className="text-lg font-black">Access Restricted</h2>
          <p className="text-xs text-app-fg-muted">This telemetry dashboard is only accessible to authorized platform administrators.</p>
          <Link to="/py" className="btn-duo btn-duo-green px-4 py-2 text-xs font-bold inline-block">
            Return to Lessons
          </Link>
        </div>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-app-bg text-app-fg flex items-center justify-center p-4 selection:bg-duo-green/30">
        <div className="max-w-md w-full bg-panel border-2 border-border-subtle rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-duo-blue/10 border border-duo-blue/30 flex items-center justify-center text-duo-blue shadow-inner">
            <KeyRound size={32} />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-blue-500/10 text-cyan-400 border border-blue-500/20 mb-2">
              <ShieldCheck size={13} />
              <span>Superuser Authentication Challenge</span>
            </div>
            <h1 className="text-2xl font-black text-app-fg">Admin Security Gateway</h1>
            <p className="text-xs text-app-fg-muted mt-2">
              Please enter the master security passcode to access real-time telemetry, reel analytics, and user metrics.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-bold text-app-fg block mb-1.5">Master Security Passcode</label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode..."
                disabled={lockoutRemaining > 0}
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-app-bg border border-border-subtle text-app-fg text-sm font-mono focus:border-duo-blue focus:outline-none disabled:opacity-50"
              />
            </div>

            {passcodeError && (
              <div className="p-3 rounded-xl bg-duo-red/10 border border-duo-red/30 flex items-center gap-2 text-xs text-duo-red font-bold">
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
              className="btn-duo btn-duo-green w-full py-3.5 text-sm font-black flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Lock size={16} />
              <span>Unlock Admin Panel</span>
            </button>
          </form>

          <div className="pt-2 border-t border-border-subtle">
            <Link to="/py" className="text-xs text-app-fg-muted hover:text-app-fg font-medium">
              ← Return to Learning Platform
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate percentages
  const mobileCount = summary.devices['mobile'] || 0;
  const totalDeviceCount = Object.values(summary.devices).reduce((a, b) => a + b, 0) || 1;
  const mobilePct = Math.round((mobileCount / totalDeviceCount) * 100);

  return (
    <div className="min-h-screen bg-app-bg text-app-fg py-8 px-4 sm:px-6 lg:px-8 font-sans selection:bg-duo-green/30">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-panel border-2 border-border-subtle rounded-3xl shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black bg-blue-500/10 text-cyan-400 border border-blue-500/20 mb-2">
              <ShieldCheck size={14} />
              <span>Superuser Master Telemetry • Live Tracking</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-app-fg tracking-tight">
              Reel Traffic & Stealth Analytics
            </h1>
            <p className="text-xs text-app-fg-muted mt-1 font-medium">
              Real-time user attribution, social reel conversions, and engagement funnels (100% hidden from users).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={refreshData}
              className="p-2.5 rounded-xl bg-app-bg border border-border-subtle hover:bg-white/5 text-app-fg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              title="Refresh Telemetry"
            >
              <RefreshCw size={14} />
              <span>Refresh</span>
            </button>
            <button
              onClick={exportAnalyticsData}
              className="p-2.5 rounded-xl bg-app-bg border border-border-subtle hover:bg-white/5 text-app-fg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              title="Download Data JSON"
            >
              <Download size={14} />
              <span>Export JSON</span>
            </button>
            <a
              href="https://cholosikhi.com/admin"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-black transition flex items-center gap-1.5 shadow-md"
              title="Open Central Master Admin on cholosikhi.com"
            >
              <span>Central Admin (cholosikhi.com)</span>
              <ExternalLink size={13} />
            </a>
            <a
              href="https://vercel.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-black transition flex items-center gap-1.5 shadow-md"
            >
              <span>Vercel Analytics</span>
              <ExternalLink size={13} />
            </a>
            <button
              onClick={handleLockSession}
              className="p-2.5 rounded-xl bg-app-bg border border-duo-red/30 hover:bg-duo-red/10 text-duo-red text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              title="Lock Admin Session"
            >
              <LogOut size={14} />
              <span>Lock Session</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-border-subtle pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={clsx(
              'px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5',
              activeTab === 'overview'
                ? 'bg-duo-green text-white shadow-sm'
                : 'text-app-fg-muted hover:text-app-fg'
            )}
          >
            <BarChart3 size={14} />
            <span>Overview & Funnels</span>
          </button>
          <button
            onClick={() => setActiveTab('feed')}
            className={clsx(
              'px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5',
              activeTab === 'feed'
                ? 'bg-duo-green text-white shadow-sm'
                : 'text-app-fg-muted hover:text-app-fg'
            )}
          >
            <Activity size={14} />
            <span>Live Activity Stream ({events.length})</span>
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">

            {/* Row 1: Key Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Total Visits */}
              <div className="p-5 rounded-2xl bg-panel border border-border-subtle shadow-sm space-y-1">
                <div className="flex items-center justify-between text-app-fg-muted">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Visits</span>
                  <Globe size={18} className="text-blue-400" />
                </div>
                <div className="text-3xl font-black text-app-fg">
                  {summary.totalVisits || summary.funnel.landed || 0}
                </div>
                <div className="text-[11px] text-app-fg-muted font-bold">
                  {summary.totalEvents} total interactions
                </div>
              </div>

              {/* Social Reel Traffic */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-panel border-2 border-pink-500/30 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-pink-400">
                  <span className="text-xs font-black uppercase tracking-wider">Reel Traffic</span>
                  <Smartphone size={18} />
                </div>
                <div className="text-3xl font-black text-pink-400">
                  {summary.reelVisits || 0}
                </div>
                <div className="text-[11px] text-pink-400/80 font-bold flex items-center gap-1">
                  <ArrowUpRight size={12} />
                  <span>From Instagram & Social Reels</span>
                </div>
              </div>

              {/* Mobile Phone Share */}
              <div className="p-5 rounded-2xl bg-panel border border-border-subtle shadow-sm space-y-1">
                <div className="flex items-center justify-between text-app-fg-muted">
                  <span className="text-xs font-bold uppercase tracking-wider">Mobile Ratio</span>
                  <Smartphone size={18} className="text-duo-green" />
                </div>
                <div className="text-3xl font-black text-duo-green">
                  {mobilePct}%
                </div>
                <div className="text-[11px] text-app-fg-muted font-bold">
                  {mobileCount} mobile sessions
                </div>
              </div>

              {/* Lessons Started */}
              <div className="p-5 rounded-2xl bg-panel border border-border-subtle shadow-sm space-y-1">
                <div className="flex items-center justify-between text-app-fg-muted">
                  <span className="text-xs font-bold uppercase tracking-wider">Active Learners</span>
                  <Users size={18} className="text-amber-400" />
                </div>
                <div className="text-3xl font-black text-app-fg">
                  {summary.funnel.lessonStarted || 0}
                </div>
                <div className="text-[11px] text-app-fg-muted font-bold">
                  {summary.funnel.lessonCompleted} lessons completed
                </div>
              </div>
            </div>

            {/* Row 2: Conversion Funnel */}
            <div className="p-6 rounded-3xl bg-panel border-2 border-border-subtle shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-app-fg">User Progression Funnel</h3>
                  <p className="text-xs text-app-fg-muted font-medium">Tracking learner drop-off from Reel view to certification.</p>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-white/5 border border-border-subtle text-app-fg-muted uppercase">
                  End-to-End Flow
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
                {[
                  { label: 'Landed', value: summary.funnel.landed, icon: Globe, color: 'text-blue-400' },
                  { label: 'Lesson 1 Start', value: summary.funnel.lessonStarted, icon: Play, color: 'text-cyan-400' },
                  { label: 'Lesson Done', value: summary.funnel.lessonCompleted, icon: CheckCircle2, color: 'text-duo-green' },
                  { label: 'Code Run', value: summary.funnel.codeRan, icon: Terminal, color: 'text-amber-400' },
                  { label: 'Exam Taken', value: summary.funnel.examTaken, icon: Activity, color: 'text-purple-400' },
                  { label: 'Certified', value: summary.funnel.certificateEarned, icon: Award, color: 'text-yellow-400' },
                ].map((step, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-app-bg border border-border-subtle text-center space-y-1 relative">
                    <step.icon size={16} className={clsx('mx-auto', step.color)} />
                    <div className="text-2xl font-black text-app-fg">{step.value}</div>
                    <div className="text-[10px] font-bold text-app-fg-muted uppercase">{step.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Row 3: Traffic Sources & Hardware Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Traffic Sources */}
              <div className="p-5 rounded-3xl bg-panel border border-border-subtle shadow-sm space-y-3">
                <h4 className="text-sm font-black text-app-fg flex items-center justify-between">
                  <span>Top Referral Sources</span>
                  <Globe size={15} className="text-app-fg-muted" />
                </h4>
                <div className="space-y-2">
                  {Object.keys(summary.sources).length === 0 ? (
                    <div className="text-xs text-app-fg-muted py-4 text-center">No traffic recorded yet</div>
                  ) : (
                    Object.entries(summary.sources)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 5)
                      .map(([src, count]) => (
                        <div key={src} className="flex items-center justify-between text-xs p-2 rounded-xl bg-app-bg">
                          <span className="font-bold text-app-fg capitalize">
                            {src.replace('_', ' ')}
                            {src.includes('instagram') && ' 📸'}
                            {src.includes('facebook') && ' 👥'}
                            {src.includes('reel') && ' 🎬'}
                          </span>
                          <span className="font-mono font-bold text-duo-green">{count}</span>
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* Devices */}
              <div className="p-5 rounded-3xl bg-panel border border-border-subtle shadow-sm space-y-3">
                <h4 className="text-sm font-black text-app-fg flex items-center justify-between">
                  <span>Device Types</span>
                  <Smartphone size={15} className="text-app-fg-muted" />
                </h4>
                <div className="space-y-2">
                  {Object.keys(summary.devices).length === 0 ? (
                    <div className="text-xs text-app-fg-muted py-4 text-center">No devices recorded yet</div>
                  ) : (
                    Object.entries(summary.devices)
                      .sort((a, b) => b[1] - a[1])
                      .map(([dev, count]) => (
                        <div key={dev} className="flex items-center justify-between text-xs p-2 rounded-xl bg-app-bg">
                          <span className="font-bold text-app-fg capitalize">{dev}</span>
                          <span className="font-mono font-bold text-cyan-400">{count}</span>
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* Operating Systems */}
              <div className="p-5 rounded-3xl bg-panel border border-border-subtle shadow-sm space-y-3">
                <h4 className="text-sm font-black text-app-fg flex items-center justify-between">
                  <span>Operating Systems</span>
                  <Terminal size={15} className="text-app-fg-muted" />
                </h4>
                <div className="space-y-2">
                  {Object.keys(summary.platforms).length === 0 ? (
                    <div className="text-xs text-app-fg-muted py-4 text-center">No OS recorded yet</div>
                  ) : (
                    Object.entries(summary.platforms)
                      .sort((a, b) => b[1] - a[1])
                      .map(([plat, count]) => (
                        <div key={plat} className="flex items-center justify-between text-xs p-2 rounded-xl bg-app-bg">
                          <span className="font-bold text-app-fg capitalize">{plat}</span>
                          <span className="font-mono font-bold text-amber-400">{count}</span>
                        </div>
                      ))
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Tab 2: Live Activity Feed */}
        {activeTab === 'feed' && (
          <div className="p-6 rounded-3xl bg-panel border-2 border-border-subtle shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-app-fg">Live User Events Feed</h3>
                <p className="text-xs text-app-fg-muted font-medium">Real-time anonymous stream of visitor actions.</p>
              </div>
              <span className="text-xs font-bold text-app-fg-muted">
                Showing last {events.length} events
              </span>
            </div>

            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-2">
              {events.length === 0 ? (
                <div className="text-center py-12 text-app-fg-muted text-sm font-bold">
                  No activity recorded yet. Browse the site to see live events appear here!
                </div>
              ) : (
                events.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3.5 rounded-2xl bg-app-bg border border-border-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className={clsx(
                        'px-2.5 py-1 rounded-lg font-mono font-bold text-[10px] uppercase tracking-wider',
                        ev.name.includes('reel') ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' :
                        ev.name.includes('lesson') ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        ev.name.includes('code') ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      )}>
                        {ev.name}
                      </span>
                      <div className="space-x-1.5 font-medium text-app-fg">
                        <span className="font-bold capitalize">{ev.context.source || 'Direct'}</span>
                        <span className="text-app-fg-muted">•</span>
                        <span className="text-app-fg-muted capitalize">{ev.context.deviceType} ({ev.context.platform})</span>
                      </div>
                    </div>

                    <div className="text-[11px] font-mono text-app-fg-muted shrink-0">
                      {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Footer Danger Zone (Reset/Clear Data) */}
        <div className="pt-4 flex items-center justify-between text-xs text-app-fg-muted">
          <div>
            Data is stored in persistent local buffer and synced to Vercel/Supabase.
          </div>
          <div>
            {showClearConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-duo-red font-bold">Clear all local telemetry?</span>
                <button
                  onClick={handleClear}
                  className="px-2.5 py-1 bg-duo-red text-white rounded-lg font-bold"
                >
                  Yes, Clear
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-2.5 py-1 bg-slate-700 text-white rounded-lg font-bold"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="text-app-fg-muted hover:text-duo-red transition flex items-center gap-1"
              >
                <Trash2 size={13} />
                <span>Reset Telemetry Buffer</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
