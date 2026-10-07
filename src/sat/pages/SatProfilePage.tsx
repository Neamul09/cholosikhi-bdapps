import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Calendar,
  Target,
  Flame,
  Zap,
  Award,
  AlertTriangle,
  Skull,
  LogOut,
  Edit2,
  Check,
  X,
  BookOpen,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { loadSatUserState } from '../lib/satStorage';
import { calculatePredictedScore } from '../lib/scorePredictor';
import { MICRO_TYPES } from '../data/microtypes';
import { supabase } from '../../lib/supabase';
import { play } from '../../lib/audio';

export default function SatProfilePage() {
  const { user, signOut, session, setSession } = useAuthStore();
  const userStore = useUserStore();
  const navigate = useNavigate();
  const [userState] = useState(() => loadSatUserState());
  const prediction = calculatePredictedScore(userState.attempts);

  // Helper to resolve user name across all sources
  const getResolvedName = useCallback(() => {
    return (
      user?.name ||
      session?.name ||
      (user as any)?.user_metadata?.full_name ||
      userStore.name ||
      (typeof window !== 'undefined' ? (localStorage.getItem('cs_sat_user_name') || localStorage.getItem('cholosikhi_user_name')) : '') ||
      'Scholar'
    );
  }, [user, session?.name, userStore.name]);

  // Edit name state
  const [fullName, setFullName] = useState(getResolvedName);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync fullName when external user state resolves
  useEffect(() => {
    if (!isEditingName) {
      setFullName(getResolvedName());
    }
  }, [getResolvedName, isEditingName]);

  // Mastery calculation
  const totalMicroTypes = MICRO_TYPES.length;
  const masteredMicroTypes = Object.values(userState.mastery).filter(
    (m) => m.masteryPercentage >= 80
  ).length;

  const totalAttempts = userState.attempts.length;
  const correctAttempts = userState.attempts.filter((a) => a.isCorrect).length;
  const overallAccuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

  // Unresolved mistakes
  const unresolvedMistakes = userState.mistakes.filter((m) => !m.resolved).length;

  const handleSaveName = async () => {
    const trimmed = fullName.trim();
    if (!trimmed) return;
    setIsSavingName(true);
    try {
      // 1. Immediately cache in localStorage & userStore so UI updates instantaneously
      if (typeof window !== 'undefined') {
        localStorage.setItem('cs_sat_user_name', trimmed);
        localStorage.setItem('cholosikhi_user_name', trimmed);
      }
      userStore.setName(trimmed);

      // 2. Update authStore session
      if (session) {
        setSession({
          ...session,
          name: trimmed
        });
      }

      // 3. Update Supabase bdapps_users & profiles table if user is authenticated
      const userId = session?.id || user?.id;
      if (userId) {
        try {
          await supabase
            .from('bdapps_users')
            .update({ name: trimmed, updated_at: new Date().toISOString() })
            .eq('id', userId);
        } catch (dbErr) {
          console.warn('bdapps_users update non-fatal warning:', dbErr);
        }
        try {
          await supabase
            .from('profiles')
            .update({ name: trimmed, updated_at: new Date().toISOString() })
            .eq('id', userId);
        } catch (dbErr) {
          console.warn('Supabase profiles update non-fatal error:', dbErr);
        }
      }

      // 4. Notify all components across the app
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cs_user_name_changed', { detail: { name: trimmed } }));
      }

      setSaveSuccess(true);
      setIsEditingName(false);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to update name:', err);
      // Fallback: local save worked
      setSaveSuccess(true);
      setIsEditingName(false);
      setTimeout(() => setSaveSuccess(false), 2500);
    } finally {
      setIsSavingName(false);
    }
  };

  const handleSignOut = async () => {
    play('tap');
    await signOut();
    navigate('/auth?redirect=/sat');
  };

  const resolvedDisplayName = getResolvedName() || 'Digital SAT Scholar';
  const avatarInitial = resolvedDisplayName
    ? resolvedDisplayName[0].toUpperCase()
    : (user?.email ? user.email[0].toUpperCase() : (user?.name ? user.name[0].toUpperCase() : 'S'));

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* ─── Profile Header Card ─────────────────────────────────────── */}
      <div className="glass p-6 sm:p-8 rounded-[3rem] border border-blue-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/10 via-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Avatar circle */}
          <div className="relative">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center text-slate-950 font-black text-4xl shadow-xl shadow-blue-500/20">
              {avatarInitial}
            </div>
            <div className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-panel border-2 border-border-subtle shadow-md text-amber-400">
              <Award size={18} />
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 space-y-2 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveName();
                      if (e.key === 'Escape') setIsEditingName(false);
                    }}
                    placeholder="Enter your name"
                    className="px-3 py-1.5 rounded-xl bg-app-bg border-2 border-blue-500 text-lg font-black text-app-fg outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={isSavingName}
                    className="p-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                    title="Save (Enter)"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={() => setIsEditingName(false)}
                    className="p-2 rounded-xl bg-panel border border-border-subtle text-app-fg/60 hover:text-app-fg transition-colors"
                    title="Cancel (Esc)"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-app-fg tracking-tight truncate">
                    {resolvedDisplayName}
                  </h1>
                  <button
                    onClick={() => {
                      setFullName(resolvedDisplayName === 'Digital SAT Scholar' ? '' : resolvedDisplayName);
                      setIsEditingName(true);
                    }}
                    className="p-1.5 rounded-lg hover:bg-panel text-app-fg/40 hover:text-blue-400 transition-colors"
                    title="Edit Name"
                  >
                    <Edit2 size={15} />
                  </button>
                </div>
              )}

              <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-black text-xs uppercase tracking-wider">
                SAT Suite Member
              </span>
            </div>

            {saveSuccess && (
              <p className="text-xs font-bold text-emerald-400">Name updated successfully!</p>
            )}

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-semibold text-app-fg/60 pt-1">
              <span className="flex items-center gap-1.5">
                <Mail size={14} className="text-cyan-400" />
                <span className="truncate">{user?.email || (user?.mobile ? `Mobile: ${user.mobile}` : 'scholar@cholosikhi.com')}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-blue-400" />
                <span>Joined {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '2026'}</span>
              </span>
            </div>

            {/* Quick summary stats chips */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-panel border border-border-subtle text-xs font-black text-app-fg">
                <Flame size={14} className="text-orange-500 fill-orange-500" />
                <span>{userState.streak} Day Streak</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-panel border border-border-subtle text-xs font-black text-amber-400">
                <Zap size={14} className="fill-amber-400" />
                <span>{userState.xp} Total XP</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-panel border border-border-subtle text-xs font-black text-emerald-400">
                <Target size={14} />
                <span>{overallAccuracy}% Accuracy</span>
              </div>
            </div>
          </div>

          {/* Sign Out Button */}
          <div className="sm:self-start">
            <button
              onClick={handleSignOut}
              className="px-4 py-2 rounded-2xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-400 text-xs font-black flex items-center gap-2 transition-all shadow-sm"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── Predicted SAT Score Banner ─────────────────────────────── */}
      <div className="p-6 sm:p-8 rounded-[3rem] bg-gradient-to-br from-blue-950/40 via-panel to-panel border-2 border-blue-500/30 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-blue-400">
                Performance Analytics
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
            </div>
            <h2 className="text-2xl font-black text-app-fg mt-1">Official Score Prediction</h2>
            <p className="text-xs font-bold text-app-fg/50">
              Calibrated strictly to Digital SAT adaptive scaling and 3,315 question items
            </p>
          </div>

          <div className="text-center sm:text-right shrink-0">
            <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400">
              {prediction.compositeScore}
              <span className="text-xl font-bold text-app-fg/40 ml-1">/ 1600</span>
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-app-fg/50">
              Composite Predicted Band: {prediction.compositeRange[0]} - {prediction.compositeRange[1]}
            </span>
          </div>
        </div>

        {/* Section score breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Math */}
          <div className="p-4 rounded-2xl bg-panel border border-border-subtle flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-app-fg/50">Math Section</span>
              <div className="text-2xl font-black text-cyan-400">{prediction.mathScore} <span className="text-xs font-normal text-app-fg/40">/ 800</span></div>
            </div>
            <div className="text-right text-xs font-bold text-app-fg/60">
              <div>Target: 780+</div>
              <div className="text-[11px] text-cyan-400">Full Desmos Mastery</div>
            </div>
          </div>

          {/* Reading & Writing */}
          <div className="p-4 rounded-2xl bg-panel border border-border-subtle flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-app-fg/50">Reading & Writing</span>
              <div className="text-2xl font-black text-violet-400">{prediction.rwScore} <span className="text-xs font-normal text-app-fg/40">/ 800</span></div>
            </div>
            <div className="text-right text-xs font-bold text-app-fg/60">
              <div>Target: 740+</div>
              <div className="text-[11px] text-violet-400">Craft & Structure Priority</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 4-Grid SAT Progress Metrics ─────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-3xl bg-panel border border-border-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-app-fg/50">Questions Solved</span>
            <Target size={16} className="text-blue-400" />
          </div>
          <div className="text-3xl font-black text-app-fg">{totalAttempts}</div>
          <p className="text-[11px] font-bold text-app-fg/50">{correctAttempts} answered correctly</p>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-3xl bg-panel border border-border-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-app-fg/50">Type Mastery</span>
            <BookOpen size={16} className="text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400">
            {masteredMicroTypes}
            <span className="text-base font-bold text-app-fg/40">/{totalMicroTypes}</span>
          </div>
          <p className="text-[11px] font-bold text-app-fg/50">80%+ archetype threshold</p>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-3xl bg-panel border border-border-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-app-fg/50">Mistake Bank</span>
            <AlertTriangle size={16} className="text-rose-400" />
          </div>
          <div className="text-3xl font-black text-rose-400">{unresolvedMistakes}</div>
          <p className="text-[11px] font-bold text-app-fg/50">Traps requiring review</p>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-3xl bg-panel border border-border-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-app-fg/50">Routine Target</span>
            <TrendingUp size={16} className="text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">{userState.routine?.targetScore ?? 1500}</div>
          <p className="text-[11px] font-bold text-app-fg/50">Exam: {userState.routine?.examDate ?? '2026-11-07'}</p>
        </div>
      </div>

      {/* ─── Direct Navigation Hub ──────────────────────────────────── */}
      <div className="p-6 sm:p-8 rounded-[3rem] bg-panel border border-border-subtle space-y-4">
        <h3 className="text-base font-black text-app-fg">Direct Shortcuts</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            to="/sat/types"
            onClick={() => play('tap')}
            className="p-4 rounded-2xl bg-app-bg border border-border-subtle hover:border-blue-500/40 hover:bg-white/5 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                <BookOpen size={18} />
              </div>
              <div>
                <h4 className="text-xs font-black text-app-fg group-hover:text-blue-400 transition-colors">Type Mastery Drill</h4>
                <p className="text-[10px] text-app-fg/50 font-bold">Step through all {MICRO_TYPES.length} archetypes</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-app-fg/30 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            to="/sat/mistakes"
            onClick={() => play('tap')}
            className="p-4 rounded-2xl bg-app-bg border border-border-subtle hover:border-rose-500/40 hover:bg-white/5 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                <AlertTriangle size={18} />
              </div>
              <div>
                <h4 className="text-xs font-black text-app-fg group-hover:text-rose-400 transition-colors">Review Mistake Bank</h4>
                <p className="text-[10px] text-app-fg/50 font-bold">{unresolvedMistakes} questions logged</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-app-fg/30 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            to="/sat/hardest"
            onClick={() => play('tap')}
            className="p-4 rounded-2xl bg-app-bg border border-border-subtle hover:border-pink-500/40 hover:bg-white/5 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center">
                <Skull size={18} />
              </div>
              <div>
                <h4 className="text-xs font-black text-app-fg group-hover:text-pink-400 transition-colors">Hardest 800-Vault</h4>
                <p className="text-[10px] text-app-fg/50 font-bold">Hardest 99th-percentile items</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-app-fg/30 group-hover:text-pink-400 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
}
