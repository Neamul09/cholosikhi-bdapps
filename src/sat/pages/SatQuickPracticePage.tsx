import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Zap,
  Target,
  AlertTriangle,
  Play,
  Skull,
  Award,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { loadSatUserState } from '../lib/satStorage';
import { calculatePredictedScore } from '../lib/scorePredictor';
import { MICRO_TYPES, MICRO_TYPE_MAP } from '../data/microtypes';
import NiniCoach from '../components/NiniCoach';
import type { SatUserState } from '../types';
import { play } from '../../lib/audio';

export default function SatQuickPracticePage() {
  const navigate = useNavigate();
  const [userState, setUserState] = useState<SatUserState>(loadSatUserState);

  useEffect(() => {
    setUserState(loadSatUserState());
    const handleUpdate = () => setUserState(loadSatUserState());
    window.addEventListener('sat_state_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('sat_state_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const totalAttempted = userState.attempts.length;
  const prediction = calculatePredictedScore(userState.attempts);
  const pendingMistakes = userState.mistakes.filter(m => !m.resolved);

  // Diagnose weakest micro-types based on actual attempts
  const attemptedTypeIds = Array.from(new Set(userState.attempts.map(a => a.microType).filter((mt): mt is string => Boolean(mt))));
  const typePerformance = attemptedTypeIds.map(typeId => {
    const attempts = userState.attempts.filter(a => a.microType === typeId);
    const correct = attempts.filter(a => a.isCorrect).length;
    const accuracy = attempts.length > 0 ? Math.round((correct / attempts.length) * 100) : 0;
    const info = MICRO_TYPE_MAP.get(typeId);
    return {
      typeId,
      title: info?.title || typeId,
      domain: info?.domain || 'General',
      section: info?.section || 'math',
      accuracy,
      total: attempts.length,
      errors: attempts.length - correct
    };
  });

  // Sort by lowest accuracy & highest error count
  const weakTypes = typePerformance
    .filter(t => t.total >= 1 && t.accuracy < 75)
    .sort((a, b) => a.accuracy - b.accuracy || b.errors - a.errors)
    .slice(0, 4);

  const startDrill = (url: string) => {
    play('tap');
    navigate(url);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-24">
      {/* ─── Top Header & Mascot Diagnosis ────────────────────────────── */}
      <section className="glass p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[3.5rem] border border-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-2xl text-left w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black text-xs uppercase tracking-wider">
            <Zap size={13} />
            <span>AI-Tailored Practice Engine</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-app-fg">
            Quick Practice
          </h1>

          <p className="text-sm sm:text-base text-app-fg/80 font-bold leading-relaxed">
            {totalAttempted === 0
              ? "Start with an adaptive diagnostic drill. Our algorithm pinpoints your strengths and weaknesses to personalize future practice."
              : weakTypes.length > 0
              ? `We analyzed your ${totalAttempted} practice questions. Your practice below targets ${weakTypes.map(w => (w.title || 'Topic').split(':')[0]).join(', ')} to maximize score gains.`
              : `Great work! With ${totalAttempted} questions solved and a ${prediction.compositeScore} predicted score, take a high-difficulty booster below.`}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-bold text-app-fg/60">
            <span className="flex items-center gap-1.5">
              <Target size={14} className="text-blue-400" />
              <span>Target: <strong>{userState.routine?.targetScore || 1520}</strong></span>
            </span>
            <span className="flex items-center gap-1.5">
              <TrendingUp size={14} className="text-emerald-400" />
              <span>Predicted: <strong>{prediction.compositeScore}</strong></span>
            </span>
            <span className="flex items-center gap-1.5">
              <AlertTriangle size={14} className="text-pink-400" />
              <span>Mistakes: <strong>{pendingMistakes.length}</strong></span>
            </span>
          </div>
        </div>

        {/* Mascot Nini */}
        <div className="shrink-0 flex flex-col items-center">
          <NiniCoach
            mood={weakTypes.length > 0 ? 'thoughtful' : 'happy'}
            message={
              totalAttempted === 0
                ? "Let's take a 10-question diagnostic drill to measure your baseline score!"
                : weakTypes.length > 0
                ? `I customized a 10-question drill targeting your weakest micro-types. Let's conquer them!`
                : "Looking sharp! Let's clear any pending mistakes or take the 800-band drill."
            }
            size="md"
          />
        </div>
      </section>

      {/* ─── Weak Spots Diagnosis Bar ─────────────────────────────────── */}
      {weakTypes.length > 0 && (
        <section className="p-6 rounded-3xl bg-panel border border-border-subtle space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center gap-2">
              <BarChart3 size={15} />
              <span>Identified Growth Areas ({weakTypes.length})</span>
            </h3>
            <span className="text-xs font-bold text-app-fg/40">Accuracy below 75%</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {weakTypes.map(t => (
              <div key={t.typeId} className="p-4 rounded-2xl bg-app-bg border border-border-subtle space-y-2">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider">
                  <span className="text-blue-400">{t.domain}</span>
                  <span className="text-rose-400">{t.accuracy}% Acc</span>
                </div>
                <h4 className="text-xs font-bold text-app-fg line-clamp-2">{t.title}</h4>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-app-fg/40 font-bold">{t.errors} errors made</span>
                  <Link
                    to={`/sat/types?type=${t.typeId}`}
                    onClick={() => play('tap')}
                    className="text-[11px] font-black text-blue-400 hover:underline flex items-center gap-0.5"
                  >
                    <span>Theory</span>
                    <ArrowRight size={10} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── Curated Practice Modes ───────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-app-fg flex items-center gap-2">
          <Sparkles size={20} className="text-amber-400" />
          <span>Select Your Quick Practice Mode</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 1. Personalized Adaptive Drill (PRIMARY) */}
          <div className="p-6 sm:p-8 rounded-3xl border-2 border-blue-500 bg-gradient-to-br from-blue-500/10 via-panel to-panel flex flex-col justify-between space-y-5 relative overflow-hidden group">
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-blue-500 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
              Recommended
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-black text-blue-400 uppercase tracking-wider">
                <Zap size={14} />
                <span>Smart Mix • 10 Questions</span>
              </div>
              <h3 className="text-2xl font-black text-app-fg">
                Personalized Weak-Spot Drill
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-app-fg/70 leading-relaxed">
                Dynamically combines questions from your lowest-accuracy micro-types and unmastered mistakes to target your biggest score increase.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs font-black text-emerald-400">+50 XP per completion</span>
              <button
                onClick={() => startDrill('/sat/quiz?mode=personalized&count=10')}
                className="btn-duo btn-duo-green px-6 py-3 text-xs font-black flex items-center gap-2"
              >
                <Play size={14} fill="currentColor" />
                <span>Start Drill (10 Qs)</span>
              </button>
            </div>
          </div>

          {/* 2. Mistake Bank Clearance Drill */}
          <div className="p-6 sm:p-8 rounded-3xl border-2 border-pink-500/30 bg-panel hover:border-pink-500/60 transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-black text-pink-400 uppercase tracking-wider">
                <AlertTriangle size={14} />
                <span>Mistake Bank • {pendingMistakes.length} Pending</span>
              </div>
              <h3 className="text-2xl font-black text-app-fg">
                Mistake Bank Drill
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-app-fg/70 leading-relaxed">
                {pendingMistakes.length > 0
                  ? `Re-solve all ${pendingMistakes.length} questions you previously missed until they are cleared from your bank.`
                  : "You have 0 pending mistakes right now! Take another drill to identify any new knowledge gaps."}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs font-bold text-app-fg/40">Immediate Feedback</span>
              <button
                onClick={() => startDrill('/sat/quiz?mode=mistakes_drill')}
                disabled={pendingMistakes.length === 0}
                className="btn-duo btn-duo-secondary text-pink-400 px-6 py-3 text-xs font-black flex items-center gap-2 disabled:opacity-40"
              >
                <Play size={14} fill="currentColor" />
                <span>Clear Mistakes →</span>
              </button>
            </div>
          </div>

          {/* 3. Section Focus: Math Weak Spots */}
          <div className="p-6 sm:p-7 rounded-3xl bg-panel border border-border-subtle hover:border-blue-500/40 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-black text-cyan-400 uppercase tracking-wider">
                <Target size={14} />
                <span>Math Focus • 10 Questions</span>
              </div>
              <h3 className="text-xl font-black text-app-fg">
                Math Speed & Accuracy Drill
              </h3>
              <p className="text-xs font-semibold text-app-fg/70 leading-relaxed">
                Algebra, Advanced Math, and Geometry questions balanced to simulate module 2 pacing with embedded Desmos support.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs font-bold text-app-fg/40">Desmos Calculator Active</span>
              <button
                onClick={() => startDrill('/sat/quiz?mode=personalized&section=math&count=10')}
                className="px-5 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 text-xs font-black flex items-center gap-2 transition-all"
              >
                <span>Launch Math (10 Qs)</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* 4. Section Focus: R&W Focus */}
          <div className="p-6 sm:p-7 rounded-3xl bg-panel border border-border-subtle hover:border-violet-500/40 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-black text-violet-400 uppercase tracking-wider">
                <BookOpen size={14} />
                <span>Reading & Writing • 10 Questions</span>
              </div>
              <h3 className="text-xl font-black text-app-fg">
                R&W Logic & Conventions Drill
              </h3>
              <p className="text-xs font-semibold text-app-fg/70 leading-relaxed">
                Craft & Structure, Transitions, Boundaries, and Evidence questions with official Bluebook passage view.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs font-bold text-app-fg/40">Official Passage Layout</span>
              <button
                onClick={() => startDrill('/sat/quiz?mode=personalized&section=reading_writing&count=10')}
                className="px-5 py-2.5 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400 hover:bg-violet-500/20 text-xs font-black flex items-center gap-2 transition-all"
              >
                <span>Launch R&W (10 Qs)</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* 5. Hardest 800-Band Blitz */}
          <div className="md:col-span-2 p-6 sm:p-7 rounded-3xl bg-panel border border-border-subtle hover:border-pink-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-black text-pink-400 uppercase tracking-wider">
                <Skull size={14} />
                <span>Score Band 750-800 • 5 Hardest Questions</span>
              </div>
              <h3 className="text-xl font-black text-app-fg">
                Hardest Questions Blitz (5 Questions)
              </h3>
              <p className="text-xs font-semibold text-app-fg/70 max-w-xl">
                Only the hardest benchmark questions from across both Math and Reading & Writing. Test yourself under true 800-band pressure.
              </p>
            </div>

            <button
              onClick={() => startDrill('/sat/quiz?mode=hardest&count=5')}
              className="btn-duo btn-duo-secondary text-pink-400 px-6 py-3 text-xs font-black flex items-center justify-center gap-2 shrink-0"
            >
              <Skull size={15} />
              <span>Launch 800 Blitz (5 Qs)</span>
            </button>
          </div>
        </div>
      </section>

      {/* ─── Micro-Type Directory Jump ────────────────────────────────── */}
      <section className="p-6 sm:p-8 rounded-3xl bg-panel border border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg font-black text-app-fg">Prefer studying one specific archetype?</h3>
          <p className="text-xs text-app-fg/60 font-semibold">
            Explore all {MICRO_TYPES.length} micro-types with archetype theory, Desmos formulas, and targeted practice.
          </p>
        </div>

        <Link
          to="/sat/types"
          onClick={() => play('tap')}
          className="btn-duo btn-duo-blue px-6 py-3 text-xs font-black flex items-center gap-2 shrink-0"
        >
          <Award size={15} />
          <span>Explore All {MICRO_TYPES.length} Micro-Types →</span>
        </Link>
      </section>
    </div>
  );
}
