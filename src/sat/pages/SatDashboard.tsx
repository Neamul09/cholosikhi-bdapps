import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Target,
  ArrowRight,
  Sparkles,
  Skull,
  ChevronRight,
  ChevronDown,
  Play,
  Calendar,
  Zap,
  BookOpen
} from 'lucide-react';
import { clsx } from 'clsx';
import ScorePredictionCard from '../components/ScorePredictionCard';
import ScoreHistoryGraph from '../components/ScoreHistoryGraph';
import NiniCoach from '../components/NiniCoach';
import CustomTestModal from '../components/CustomTestModal';
import { loadSatUserState, loadSatUserStateFromCloud } from '../lib/satStorage';
import { calculatePredictedScore } from '../lib/scorePredictor';
import { MICRO_TYPES } from '../data/microtypes';
import { getMicroTypeStats, getHardestQuestionForMicroType, getHardestQuestions } from '../data/questionsRepo';
import type { SatUserState, MicroTypeInfo } from '../types';
import { play } from '../../lib/audio';

interface SatDashboardProps {
  onOpenCustomTest?: () => void;
}

export default function SatDashboard({ onOpenCustomTest }: SatDashboardProps = {}) {
  const navigate = useNavigate();
  const [userState, setUserState] = useState<SatUserState>(loadSatUserState);
  const [selectedSection, setSelectedSection] = useState<'all' | 'math' | 'reading_writing'>('all');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [showCustomTest, setShowCustomTest] = useState(false);
  const [showAllMicroTypes, setShowAllMicroTypes] = useState(false);

  useEffect(() => {
    setUserState(loadSatUserState());
    const handleUpdate = () => setUserState(loadSatUserState());
    window.addEventListener('sat_state_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    loadSatUserStateFromCloud().then(cloud => {
      if (cloud) setUserState(cloud);
    });
    return () => {
      window.removeEventListener('sat_state_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const prediction = calculatePredictedScore(userState.attempts);
  const microStats = getMicroTypeStats();

  // Filtered micro-types for the mastery system
  const filteredMicroTypes = MICRO_TYPES.filter(mt => {
    if (selectedSection !== 'all' && mt.section !== selectedSection) return false;
    if (selectedDomain !== 'all' && mt.domain !== selectedDomain) return false;
    return true;
  });

  const visibleMicroTypes = showAllMicroTypes ? filteredMicroTypes : filteredMicroTypes.slice(0, 6);

  // Calculate overall and section stats
  const totalAttempted = userState.attempts.length;
  const totalCorrect = userState.attempts.filter(a => a.isCorrect).length;
  const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  const mathAttempts = userState.attempts.filter(a => a.section === 'math');
  const mathCorrect = mathAttempts.filter(a => a.isCorrect).length;
  const mathAccuracy = mathAttempts.length > 0 ? Math.round((mathCorrect / mathAttempts.length) * 100) : 0;

  const rwAttempts = userState.attempts.filter(a => a.section === 'reading_writing');
  const rwCorrect = rwAttempts.filter(a => a.isCorrect).length;
  const rwAccuracy = rwAttempts.length > 0 ? Math.round((rwCorrect / rwAttempts.length) * 100) : 0;

  // Average time per question & pacing
  const totalQuizQuestions = userState.quizzes.reduce((sum, q) => sum + (q.totalQuestions || 0), 0);
  const totalQuizSeconds = userState.quizzes.reduce((sum, q) => sum + (q.timeSpentSeconds || 0), 0);
  const avgTimePerQuestion = totalQuizQuestions > 0 ? Math.round(totalQuizSeconds / totalQuizQuestions) : 68;

  // Daily target and today's solved count
  const dailyTasks = userState.routine?.dailyTasks || [];
  const dailyTarget = dailyTasks.reduce((acc, t) => acc + t.targetCount, 0) || 17;
  const dailyCompleted = dailyTasks.reduce((acc, t) => acc + t.completedCount, 0) || Math.min(dailyTarget, totalAttempted);

  const domains = Array.from(new Set(MICRO_TYPES.map(m => m.domain)));

  // Hardest question mastery calculation
  const hardestQuestions = getHardestQuestions();
  const hardestQuestionIds = new Set(hardestQuestions.map(q => q.id));
  const hardestAttempts = userState.attempts.filter(a => Boolean(a.questionId && hardestQuestionIds.has(a.questionId)));
  const hardestSolved = hardestAttempts.filter(a => a.isCorrect).length;
  const totalHardest = hardestQuestions.length;
  const hardestMasteryPct = totalHardest > 0 ? Math.round((hardestSolved / totalHardest) * 100) : 0;
  const hardestAccuracy = hardestAttempts.length > 0 ? Math.round((hardestSolved / hardestAttempts.length) * 100) : 0;

  // Micro-type mastery stats
  const totalTypesCount = MICRO_TYPES.length;
  const masteredTypesCount = MICRO_TYPES.filter(mt => {
    const m = userState.mastery[mt.id];
    if (m && m.attempted >= 2 && m.masteryPercentage >= 75) return true;
    const atts = userState.attempts.filter(a => a.microType === mt.id);
    return atts.length >= 2 && (atts.filter(a => a.isCorrect).length / atts.length) >= 0.75;
  }).length;
  const typeMasteryPct = totalTypesCount > 0 ? Math.round((masteredTypesCount / totalTypesCount) * 100) : 0;

  const mathTypes = MICRO_TYPES.filter(mt => mt.section === 'math');
  const rwTypes = MICRO_TYPES.filter(mt => mt.section === 'reading_writing');
  const mathMasteredCount = mathTypes.filter(mt => {
    const m = userState.mastery[mt.id];
    if (m && m.attempted >= 2 && m.masteryPercentage >= 75) return true;
    const atts = userState.attempts.filter(a => a.microType === mt.id);
    return atts.length >= 2 && (atts.filter(a => a.isCorrect).length / atts.length) >= 0.75;
  }).length;
  const rwMasteredCount = rwTypes.filter(mt => {
    const m = userState.mastery[mt.id];
    if (m && m.attempted >= 2 && m.masteryPercentage >= 75) return true;
    const atts = userState.attempts.filter(a => a.microType === mt.id);
    return atts.length >= 2 && (atts.filter(a => a.isCorrect).length / atts.length) >= 0.75;
  }).length;

  const handleLaunchHardestDrill = (microType: MicroTypeInfo) => {
    play('tap');
    const hardestQ = getHardestQuestionForMicroType(microType.id);
    if (hardestQ) {
      navigate(`/sat/quiz?mode=hardest_drill&microType=${microType.id}&questionId=${hardestQ.id}`);
    } else {
      navigate(`/sat/quiz?mode=drill&microType=${microType.id}`);
    }
  };

  return (
    <div className="space-y-10 pb-24">
      {/* ─── Top Header & Primary Action CTAs (Replaces Hero) ─────────── */}
      <section className="pt-2 sm:pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black text-xs uppercase tracking-wider mb-2">
            <Sparkles size={13} />
            <span>Digital SAT Suite • Adaptive Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-app-fg">
            Score Engine & Diagnostics
          </h1>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              play('tap');
              if (onOpenCustomTest) onOpenCustomTest();
              else setShowCustomTest(true);
            }}
            className="btn-duo btn-duo-green px-5 py-2.5 text-xs font-black flex items-center gap-2"
          >
            <Play size={15} fill="currentColor" />
            <span>Custom Practice Test</span>
          </button>

          <button
            onClick={() => {
              play('tap');
              navigate('/sat/quick-practice');
            }}
            className="btn-duo btn-duo-blue px-4 py-2.5 text-xs font-black flex items-center gap-2"
          >
            <Zap size={15} />
            <span>Quick Practice</span>
          </button>

          <button
            onClick={() => {
              play('tap');
              navigate('/sat/types');
            }}
            className="px-4 py-2.5 rounded-2xl bg-panel border border-border-subtle hover:bg-white/10 text-xs font-black text-app-fg transition-all flex items-center gap-2"
          >
            <BookOpen size={15} className="text-blue-400" />
            <span>Type Drill</span>
          </button>

          <button
            onClick={() => {
              play('tap');
              navigate('/sat/hardest');
            }}
            className="px-4 py-2.5 rounded-2xl bg-pink-500/10 border border-pink-500/30 text-pink-400 hover:bg-pink-500/20 text-xs font-black transition-all flex items-center gap-2"
          >
            <Skull size={15} />
            <span>Hardest Vault</span>
          </button>
        </div>
      </section>

      {/* ─── Score Prediction & Key Metrics Grid (DIRECTLY ON TOP) ────── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Predicted Score Card, Mastery Cards & Performance Breakdown */}
        <div className="lg:col-span-2 space-y-4 flex flex-col">
          <ScorePredictionCard
            prediction={prediction}
            targetScore={userState.routine?.targetScore || 1520}
          />

          {/* ─── Micro-Type Mastery & Hardest Questions Mastery Row (Fills Space) ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Card 1: Micro-Type Mastery Percentage */}
            <div className="p-5 rounded-[2rem] bg-panel border border-border-subtle hover:border-blue-500/40 transition-all shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-app-fg">Micro-Type Mastery</h3>
                    <p className="text-[10px] font-bold text-app-fg/50">Digital SAT Archetypes</p>
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-black">
                  {masteredTypesCount} / {totalTypesCount} Types
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black tracking-tight text-app-fg">{typeMasteryPct}%</span>
                  <span className="text-[11px] font-bold text-app-fg/60">
                    Math: <strong className="text-blue-400">{mathMasteredCount}/{mathTypes.length}</strong> · R&W: <strong className="text-violet-400">{rwMasteredCount}/{rwTypes.length}</strong>
                  </span>
                </div>
                <div className="h-2.5 w-full bg-app-bg/80 rounded-full overflow-hidden p-0.5 border border-border-subtle/40">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-700"
                    style={{ width: `${typeMasteryPct}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-border-subtle/40">
                <span className="text-[10px] font-bold text-app-fg/40">
                  Target: 80%+ accuracy per type
                </span>
                <Link
                  to="/sat/types"
                  onClick={() => play('tap')}
                  className="text-xs font-black text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                >
                  <span>Type Drill</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            {/* Card 2: Hardest Questions Mastery Percentage */}
            <div className="p-5 rounded-[2rem] bg-panel border border-border-subtle hover:border-pink-500/40 transition-all shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                    <Skull size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-app-fg">Hard Questions Mastery</h3>
                    <p className="text-[10px] font-bold text-app-fg/50">99th Percentile Traps</p>
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-[10px] font-black">
                  {hardestSolved} / {totalHardest} Mastered
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black tracking-tight text-app-fg">{hardestMasteryPct}%</span>
                  <span className="text-[11px] font-bold text-app-fg/60">
                    Hard Accuracy: <strong className="text-pink-400">{hardestAccuracy}%</strong> ({hardestSolved} solved)
                  </span>
                </div>
                <div className="h-2.5 w-full bg-app-bg/80 rounded-full overflow-hidden p-0.5 border border-border-subtle/40">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 rounded-full transition-all duration-700"
                    style={{ width: `${hardestMasteryPct}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-border-subtle/40">
                <span className="text-[10px] font-bold text-app-fg/40">
                  Official College Board Level 5
                </span>
                <Link
                  to="/sat/hardest"
                  onClick={() => play('tap')}
                  className="text-xs font-black text-pink-400 hover:text-pink-300 flex items-center gap-1 transition-colors"
                >
                  <span>Hardest Vault</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>

          {/* Detailed Performance Breakdown & Pacing Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 rounded-[2.5rem] bg-panel border border-border-subtle shadow-sm">
            {/* Math Accuracy */}
            <div className="p-3.5 rounded-2xl bg-app-bg/60 border border-border-subtle/50 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-400">Math Accuracy</span>
                <span className="text-xs font-black text-app-fg">{mathAccuracy}%</span>
              </div>
              <div className="h-2 w-full bg-panel rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-700"
                  style={{ width: `${mathAccuracy}%` }}
                />
              </div>
              <p className="text-[10px] font-bold text-app-fg/40">{mathCorrect} / {Math.max(1, mathAttempts.length)} questions</p>
            </div>

            {/* R&W Accuracy */}
            <div className="p-3.5 rounded-2xl bg-app-bg/60 border border-border-subtle/50 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-violet-400">R&W Accuracy</span>
                <span className="text-xs font-black text-app-fg">{rwAccuracy}%</span>
              </div>
              <div className="h-2 w-full bg-panel rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-pink-400 rounded-full transition-all duration-700"
                  style={{ width: `${rwAccuracy}%` }}
                />
              </div>
              <p className="text-[10px] font-bold text-app-fg/40">{rwCorrect} / {Math.max(1, rwAttempts.length)} questions</p>
            </div>

            {/* Time Per Question */}
            <div className="p-3.5 rounded-2xl bg-app-bg/60 border border-border-subtle/50 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">Time / Question</span>
              <div className="text-lg font-black text-app-fg">{avgTimePerQuestion}s</div>
              <span className="inline-block text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {avgTimePerQuestion <= 85 ? 'On Target Pace' : 'Pacing Practice'}
              </span>
            </div>

            {/* Daily Target Progress */}
            <div className="p-3.5 rounded-2xl bg-app-bg/60 border border-border-subtle/50 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Today's Goal</span>
                <span className="text-xs font-black text-app-fg">
                  {Math.round((dailyCompleted / Math.max(1, dailyTarget)) * 100)}%
                </span>
              </div>
              <div className="h-2 w-full bg-panel rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, Math.round((dailyCompleted / Math.max(1, dailyTarget)) * 100))}%` }}
                />
              </div>
              <p className="text-[10px] font-bold text-app-fg/40">{dailyCompleted} / {dailyTarget} completed</p>
            </div>
          </div>
        </div>

        {/* Right Col: Mascot Nini + Diagnostic Stats Strip with Hardest Mastery */}
        <div className="glass p-6 rounded-[2.5rem] border border-border-subtle flex flex-col justify-between space-y-5">
          {/* Mascot Nini Coach compact card */}
          <div className="p-4 rounded-2xl bg-panel border border-border-subtle flex items-center gap-3">
            <NiniCoach
              mood={totalAttempted > 0 && overallAccuracy > 65 ? 'happy' : 'thoughtful'}
              message={
                totalAttempted === 0
                  ? "Welcome! Let's take your first diagnostic drill."
                  : `Solved ${totalAttempted} Qs with ${overallAccuracy}% accuracy. Keep rolling!`
              }
              size="sm"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-panel border border-border-subtle">
              <span className="text-xs font-bold text-app-fg/60">Total Questions Solved</span>
              <span className="text-lg font-black text-app-fg">{totalAttempted}</span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-panel border border-border-subtle">
              <span className="text-xs font-bold text-app-fg/60">Overall Accuracy</span>
              <span className="text-lg font-black text-emerald-400">{overallAccuracy}%</span>
            </div>

            {/* Micro-Type Coverage Progress */}
            <div className="p-3.5 rounded-2xl bg-panel border border-border-subtle space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-app-fg/70 flex items-center gap-1.5">
                  <BookOpen size={14} className="text-blue-400" />
                  <span>Type Mastery Coverage</span>
                </span>
                <span className="text-xs font-black text-blue-400">{typeMasteryPct}%</span>
              </div>
              <div className="h-2 w-full bg-app-bg rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-700"
                  style={{ width: `${typeMasteryPct}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] font-bold text-app-fg/40">
                <span>{masteredTypesCount} / {totalTypesCount} types</span>
                <Link to="/sat/types" className="text-blue-400 hover:underline">
                  Drill →
                </Link>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-panel border border-border-subtle">
              <span className="text-xs font-bold text-app-fg/60">Mistake Bank</span>
              <Link
                to="/sat/mistakes"
                onClick={() => play('tap')}
                className="text-xs font-black text-pink-400 hover:underline flex items-center gap-1"
              >
                <span>{userState.mistakes.filter(m => !m.resolved).length} Pending</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-panel border border-border-subtle">
              <span className="text-xs font-bold text-app-fg/60">Exam Countdown</span>
              <span className="text-xs font-black text-app-fg flex items-center gap-1.5">
                <Calendar size={13} className="text-blue-400" />
                <span>{userState.routine?.daysRemaining || 33} Days Left</span>
              </span>
            </div>
          </div>

          <Link
            to="/sat/routine"
            onClick={() => play('tap')}
            className="w-full py-2.5 rounded-xl bg-panel border border-border-subtle hover:bg-white/10 text-xs font-black text-center text-app-fg transition-all block"
          >
            Adjust Target Date & Score →
          </Link>
        </div>
      </section>

      {/* ─── Score History & Progress Trajectory Graph ─────────────────── */}
      <section>
        <ScoreHistoryGraph
          quizzes={userState.quizzes}
          currentScore={prediction.compositeScore}
          mathScore={prediction.mathScore}
          rwScore={prediction.rwScore}
          targetScore={userState.routine?.targetScore || 1520}
        />
      </section>

      {/* ─── Personalized Daily Routine System ──────────────────────── */}
      {userState.routine && (
        <section className="glass p-8 sm:p-10 rounded-[3rem] border border-border-subtle space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-400">
                <Target size={14} />
                <span>Personalized Daily Routine</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-app-fg">
                Today's SAT Mission
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-app-fg/50">
                Target: <strong className="text-app-fg">{userState.routine.targetScore}</strong> by {userState.routine.examDate}
              </span>
              <Link
                to="/sat/routine"
                onClick={() => play('tap')}
                className="px-4 py-2 rounded-xl bg-panel border border-border-subtle text-xs font-black text-blue-400 hover:bg-white/10 transition-all"
              >
                Edit Plan
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {userState.routine.dailyTasks.map((task) => (
              <div
                key={task.id}
                className={clsx(
                  "p-6 rounded-2xl border-2 transition-all flex flex-col justify-between space-y-4",
                  task.isCompleted
                    ? "bg-emerald-500/10 border-emerald-500/30"
                    : "bg-panel border-border-subtle hover:border-blue-500/30"
                )}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-400">
                      {task.category.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-black text-amber-400">+{task.xpReward} XP</span>
                  </div>
                  <h4 className="text-base font-black text-app-fg">{task.title}</h4>
                  <p className="text-xs text-app-fg/60 font-bold leading-relaxed">{task.description}</p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-app-fg/40">
                    {task.completedCount} / {task.targetCount} done
                  </span>

                  <button
                    onClick={() => {
                      play('tap');
                      if (task.microTypeId) {
                        navigate(`/sat/quiz?mode=drill&microType=${task.microTypeId}`);
                      } else if (task.category === 'vocab') {
                        navigate('/sat/vocab');
                      } else if (task.category === 'mistake_review') {
                        navigate('/sat/mistakes');
                      } else {
                        navigate('/sat/quiz');
                      }
                    }}
                    className={clsx(
                      "px-4 py-2 rounded-xl text-xs font-black transition-all",
                      task.isCompleted
                        ? "bg-emerald-500 text-white"
                        : "btn-duo btn-duo-blue text-white"
                    )}
                  >
                    {task.isCompleted ? 'Completed ✓' : 'Start Task →'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── Micro-Type Mastery Tree System ─────────────────────────── */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="text-blue-400 font-black text-xs uppercase tracking-wider">
              College Board Granular Taxonomy
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-app-fg">
              Micro-Type Mastery Matrix
            </h2>
            <p className="text-sm font-bold text-app-fg/50 max-w-2xl">
              Every archetype broken down. Test yourself with the benchmark <strong>Hardest Drill</strong> or dive into full sets.
            </p>
          </div>

          {/* Section Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => { play('toggle'); setSelectedSection('all'); }}
              className={clsx(
                "px-4 py-2 rounded-xl text-xs font-black transition-all",
                selectedSection === 'all'
                  ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                  : "bg-panel border border-border-subtle text-app-fg/70 hover:text-app-fg"
              )}
            >
              All Sections ({MICRO_TYPES.length})
            </button>
            <button
              onClick={() => { play('toggle'); setSelectedSection('math'); }}
              className={clsx(
                "px-4 py-2 rounded-xl text-xs font-black transition-all",
                selectedSection === 'math'
                  ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                  : "bg-panel border border-border-subtle text-app-fg/70 hover:text-app-fg"
              )}
            >
              Math Only
            </button>
            <button
              onClick={() => { play('toggle'); setSelectedSection('reading_writing'); }}
              className={clsx(
                "px-4 py-2 rounded-xl text-xs font-black transition-all",
                selectedSection === 'reading_writing'
                  ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                  : "bg-panel border border-border-subtle text-app-fg/70 hover:text-app-fg"
              )}
            >
              Reading & Writing
            </button>
          </div>
        </div>

        {/* Domain Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar text-xs">
          <button
            onClick={() => { play('toggle'); setSelectedDomain('all'); }}
            className={clsx(
              "px-3.5 py-1.5 rounded-lg whitespace-nowrap font-black transition-all",
              selectedDomain === 'all'
                ? "bg-panel border-2 border-blue-500 text-blue-400"
                : "bg-panel border border-border-subtle text-app-fg/60 hover:text-app-fg"
            )}
          >
            All Domains
          </button>
          {domains.map((dom) => (
            <button
              key={dom}
              onClick={() => { play('toggle'); setSelectedDomain(dom); }}
              className={clsx(
                "px-3.5 py-1.5 rounded-lg whitespace-nowrap font-black transition-all",
                selectedDomain === dom
                  ? "bg-panel border-2 border-blue-500 text-blue-400"
                  : "bg-panel border border-border-subtle text-app-fg/60 hover:text-app-fg"
              )}
            >
              {dom}
            </button>
          ))}
        </div>

        {/* Micro-Types Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleMicroTypes.map((mt) => {
            const mastery = userState.mastery[mt.id];
            const stats = microStats[mt.id] || { total: 3, hardCount: 1 };
            const status = mastery?.status || 'novice';

            const statusColors = {
              novice: 'bg-panel text-app-fg/50 border-border-subtle',
              practicing: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
              proficient: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
              mastered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            };

            return (
              <div
                key={mt.id}
                className="glass p-6 rounded-3xl border border-border-subtle hover:border-blue-500/30 transition-all flex flex-col justify-between space-y-5 group"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-400">
                      {mt.domain} • {stats.total} Qs
                    </span>
                    <span className={clsx("text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border", statusColors[status])}>
                      {status}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-black text-app-fg group-hover:text-blue-400 transition-colors leading-snug">
                    {mt.title}
                  </h3>

                  {/* Description & Theory */}
                  <p className="text-xs text-app-fg/60 font-bold leading-relaxed line-clamp-2">
                    {mt.theorySummary}
                  </p>

                  {/* Mastery Progress Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px] font-black text-app-fg/50">
                      <span>Mastery Score</span>
                      <span>{mastery ? `${mastery.masteryPercentage}%` : '0%'}</span>
                    </div>
                    <div className="h-2 w-full bg-app-bg rounded-full overflow-hidden border border-border-subtle/50">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-700"
                        style={{ width: `${mastery?.masteryPercentage || 0}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Actions: Quick Hardest Drill vs Full Set */}
                <div className="pt-3 border-t border-border-subtle/60 flex items-center gap-2">
                  {/* Quick Drill: Hardest question only */}
                  <button
                    onClick={() => handleLaunchHardestDrill(mt)}
                    className="flex-1 btn-duo btn-duo-red py-2.5 text-xs flex items-center justify-center gap-1.5 shadow-none"
                    title="Practice the single hardest question for this micro-type"
                  >
                    <Skull size={13} />
                    <span>Hardest Drill</span>
                  </button>

                  {/* Practice full set */}
                  <button
                    onClick={() => {
                      play('tap');
                      navigate(`/sat/quiz?mode=drill&microType=${mt.id}`);
                    }}
                    className="px-3.5 py-2.5 rounded-xl bg-panel border border-border-subtle hover:bg-white/10 text-xs font-bold text-app-fg transition-all flex items-center gap-1"
                    title="Practice all questions in this microtype"
                  >
                    <span>All</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Show More / Show Less Toggle Button */}
        {filteredMicroTypes.length > 6 && (
          <div className="flex justify-center pt-4">
            <button
              onClick={() => {
                play('toggle');
                setShowAllMicroTypes(!showAllMicroTypes);
              }}
              className="px-6 py-3 rounded-2xl bg-panel border-2 border-blue-500/40 hover:border-blue-400 text-blue-400 font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-blue-500/10 transition-all shadow-lg shadow-blue-500/10"
            >
              <span>
                {showAllMicroTypes
                  ? 'Show Less Micro-Types'
                  : `Show All ${filteredMicroTypes.length} Micro-Types (+${filteredMicroTypes.length - 6})`}
              </span>
              <ChevronDown size={14} className={clsx("transition-transform duration-300", showAllMicroTypes && "rotate-180")} />
            </button>
          </div>
        )}
      </section>

      <CustomTestModal isOpen={showCustomTest} onClose={() => setShowCustomTest(false)} />
    </div>
  );
}
