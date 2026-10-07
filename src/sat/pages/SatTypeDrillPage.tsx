import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Award,
  Calculator,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  Play,
  Skull
} from 'lucide-react';
import { clsx } from 'clsx';
import { MICRO_TYPES } from '../data/microtypes';
import { ALL_QUESTIONS, getHardestQuestionForMicroType } from '../data/questionsRepo';
import { loadSatUserState, recordSatAttempt, getQuestionStatus } from '../lib/satStorage';
import type { MicroTypeInfo, SatQuestion, SatUserState } from '../types';
import MathRenderer from '../components/MathRenderer';
import BluebookQuestionView from '../components/BluebookQuestionView';
import { play } from '../../lib/audio';

export default function SatTypeDrillPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [userState, setUserState] = useState<SatUserState>(loadSatUserState);
  const [selectedSection, setSelectedSection] = useState<'all' | 'math' | 'reading_writing'>('all');

  // Filtered types by section
  const availableTypes = MICRO_TYPES.filter(t => {
    if (selectedSection === 'all') return true;
    return t.section === selectedSection;
  });

  // Read active type from query param or default to first
  const queryTypeId = searchParams.get('type');
  const initialIndex = availableTypes.findIndex(t => t.id === queryTypeId);
  const [currentIndex, setCurrentIndex] = useState(initialIndex >= 0 ? initialIndex : 0);

  // Sync index when filter or query changes
  useEffect(() => {
    if (queryTypeId) {
      const idx = availableTypes.findIndex(t => t.id === queryTypeId);
      if (idx >= 0) setCurrentIndex(idx);
    }
  }, [queryTypeId, availableTypes]);

  const currentType: MicroTypeInfo = availableTypes[currentIndex] || availableTypes[0];

  // Refresh user state
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

  // Questions for this specific microtype: stored in state so answering/submitting NEVER re-shuffles questions under the user
  const [typeQuestions, setTypeQuestions] = useState<SatQuestion[]>([]);
  const [shuffleKey, setShuffleKey] = useState(0);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);
  const [isMarkedForReview, setIsMarkedForReview] = useState(false);

  useEffect(() => {
    const all = ALL_QUESTIONS.filter(q => q.microType === currentType.id);
    const unsolved = all.filter(q => getQuestionStatus(q.id).status !== 'solved');
    const solved = all.filter(q => getQuestionStatus(q.id).status === 'solved');

    // Shuffle unsolved questions once when archetype is loaded
    const shuffled = [...unsolved];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    setTypeQuestions([...shuffled, ...solved]);
    setActiveQuestionIdx(0);
    setUserAnswer('');
    setIsSubmitted(false);
    setEliminatedOptions([]);
    setIsMarkedForReview(false);
  }, [currentType.id, shuffleKey]);

  // Reset question state when active question index changes
  useEffect(() => {
    setUserAnswer('');
    setIsSubmitted(false);
    setEliminatedOptions([]);
    setIsMarkedForReview(false);
  }, [activeQuestionIdx]);

  const activeQuestion: SatQuestion | undefined = typeQuestions[activeQuestionIdx];

  // User mastery metrics for current micro-type
  const attempts = userState.attempts.filter(a => a.microType === currentType.id);
  const correctCount = attempts.filter(a => a.isCorrect).length;
  const masteryPercentage = attempts.length > 0 ? Math.round((correctCount / attempts.length) * 100) : 0;

  const getMasteryBadge = (pct: number, total: number) => {
    if (total === 0) return { label: 'Not Started', color: 'text-slate-400 bg-slate-500/10 border-slate-500/20' };
    if (pct >= 85) return { label: 'Mastered 🌟', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    if (pct >= 60) return { label: 'Proficient', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    return { label: 'Needs Practice', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
  };

  const masteryBadge = getMasteryBadge(masteryPercentage, attempts.length);

  const goToType = (index: number) => {
    play('tap');
    if (index >= 0 && index < availableTypes.length) {
      setCurrentIndex(index);
      setSearchParams({ type: availableTypes[index].id });
    }
  };

  const handleSelectAnswer = (ans: string) => {
    setUserAnswer(ans);
  };

  const handleToggleEliminate = (optionId: string) => {
    setEliminatedOptions(prev =>
      prev.includes(optionId) ? prev.filter(id => id !== optionId) : [...prev, optionId]
    );
  };

  const handleToggleMarkForReview = () => {
    setIsMarkedForReview(prev => !prev);
  };

  const handlePreviousQuestion = () => {
    if (activeQuestionIdx > 0) {
      play('tap');
      setActiveQuestionIdx(prev => prev - 1);
    }
  };

  const handleNextQuestion = () => {
    if (activeQuestionIdx < typeQuestions.length - 1) {
      play('tap');
      setActiveQuestionIdx(prev => prev + 1);
    } else {
      goToType(currentIndex + 1);
    }
  };

  const handleSubmitAnswer = () => {
    if (!activeQuestion || !userAnswer.trim() || isSubmitted) return;
    setIsSubmitted(true);

    const isCorrect =
      activeQuestion.correctAnswers.includes(userAnswer.trim()) ||
      activeQuestion.correctAnswers.some(c => c.toLowerCase() === userAnswer.trim().toLowerCase());

    if (isCorrect) play('correct');
    else play('incorrect');

    // Record attempt
    recordSatAttempt({
      questionId: activeQuestion.id,
      selectedAnswer: userAnswer.trim(),
      isCorrect,
      timeSpentSeconds: 45,
      section: activeQuestion.test,
      microType: activeQuestion.microType,
      difficulty: activeQuestion.difficulty
    });

    setUserState(loadSatUserState());
  };

  const hardestQ = getHardestQuestionForMicroType(currentType.id);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-24">
      {/* ─── Top Header & Section Filter Tabs ─────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black text-xs uppercase tracking-wider mb-2">
            <BookOpen size={13} />
            <span>Official Archetype Mastery</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-app-fg">
            Micro-Type Drill
          </h1>
          <p className="text-sm font-bold text-app-fg/60 mt-1">
            Master every College Board question type one by one with theory, traps, and real test questions.
          </p>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          {(['all', 'math', 'reading_writing'] as const).map(sec => (
            <button
              key={sec}
              onClick={() => {
                play('toggle');
                setSelectedSection(sec);
                setCurrentIndex(0);
              }}
              className={clsx(
                "px-4 py-2 rounded-xl text-xs font-black transition-all",
                selectedSection === sec
                  ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                  : "bg-panel border border-border-subtle text-app-fg/70 hover:text-app-fg"
              )}
            >
              {sec === 'all' ? `All (${MICRO_TYPES.length})` : sec === 'math' ? 'Math' : 'R&W'}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Type-by-Type Navigation Bar with Jump Selector ───────────── */}
      <div className="glass p-4 sm:p-5 rounded-3xl border border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Prev Button */}
        <button
          onClick={() => goToType(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-panel border border-border-subtle text-app-fg hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center justify-center gap-2 text-xs font-black"
        >
          <ChevronLeft size={16} />
          <span>Previous Type</span>
        </button>

        {/* Center: Current Index & Quick Dropdown Picker */}
        <div className="flex items-center gap-3 text-center">
          <span className="text-xs font-black uppercase tracking-wider text-blue-400 px-3 py-1 rounded-xl bg-blue-500/10 border border-blue-500/20">
            Type {currentIndex + 1} of {availableTypes.length}
          </span>
          <select
            value={currentType.id}
            onChange={(e) => {
              const idx = availableTypes.findIndex(t => t.id === e.target.value);
              if (idx >= 0) goToType(idx);
            }}
            className="px-3 py-1.5 rounded-xl bg-panel border border-border-subtle text-xs font-bold text-app-fg outline-none max-w-[220px] sm:max-w-xs truncate cursor-pointer"
          >
            {availableTypes.map((t, idx) => (
              <option key={t.id} value={t.id}>
                #{idx + 1}: {t.title}
              </option>
            ))}
          </select>
        </div>

        {/* Next Button */}
        <button
          onClick={() => goToType(currentIndex + 1)}
          disabled={currentIndex === availableTypes.length - 1}
          className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-panel border border-border-subtle text-app-fg hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center justify-center gap-2 text-xs font-black"
        >
          <span>Next Type</span>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* ─── Current Type Info & Mastery Gauge Card ───────────────────── */}
      <div className="glass p-6 sm:p-8 rounded-[2.5rem] border border-blue-500/20 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-wider">
                {currentType.domain}
              </span>
              <span className="px-3 py-1 rounded-full bg-panel border border-border-subtle text-xs font-black text-app-fg/70">
                {currentType.skill}
              </span>
              <span className={clsx("px-3 py-1 rounded-full border text-xs font-black", masteryBadge.color)}>
                {masteryBadge.label}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-app-fg pt-1">
              {currentType.title}
            </h2>

            <p className="text-sm text-app-fg/80 font-semibold leading-relaxed">
              {currentType.description}
            </p>
          </div>

          {/* Mastery Progress Dial / Percentage Card */}
          <div className="p-5 rounded-3xl bg-panel border border-border-subtle shrink-0 min-w-[240px] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-app-fg/50 flex items-center gap-1.5">
                <Award size={14} className="text-amber-400" />
                <span>Your Mastery</span>
              </span>
              <span className="text-xl font-black text-app-fg">{masteryPercentage}%</span>
            </div>

            <div className="h-3 w-full bg-app-bg rounded-full overflow-hidden">
              <div
                className={clsx(
                  "h-full rounded-full transition-all duration-700",
                  masteryPercentage >= 80 ? "bg-gradient-to-r from-emerald-500 to-teal-400" :
                  masteryPercentage >= 50 ? "bg-gradient-to-r from-blue-500 to-cyan-400" :
                  "bg-gradient-to-r from-pink-500 to-rose-400"
                )}
                style={{ width: `${masteryPercentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-app-fg/50">
              <span>{correctCount} correct / {attempts.length} attempts</span>
              <span>{typeQuestions.length} bank Qs</span>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 flex items-center gap-2">
              {hardestQ && (
                <button
                  onClick={() => {
                    play('tap');
                    navigate(`/sat/quiz?mode=hardest_drill&microType=${currentType.id}&questionId=${hardestQ.id}`);
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 hover:bg-pink-500/20 text-xs font-black flex items-center justify-center gap-1.5 transition-all"
                >
                  <Skull size={13} />
                  <span>Hardest Drill</span>
                </button>
              )}

              <button
                onClick={() => {
                  play('tap');
                  navigate(`/sat/quiz?mode=drill&microType=${currentType.id}`);
                }}
                className="flex-1 py-2 px-3 rounded-xl btn-duo btn-duo-blue text-xs font-black flex items-center justify-center gap-1.5"
              >
                <Play size={13} fill="currentColor" />
                <span>Full Quiz</span>
              </button>
            </div>
          </div>
        </div>

        {/* ─── Theory, Formulas & Common Traps ───────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border-subtle">
          {/* Core Theory & Formulas */}
          <div className="p-5 rounded-3xl bg-panel border border-border-subtle space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-blue-400 flex items-center gap-2">
              <Lightbulb size={15} />
              <span>Core Theory & Archetype Rules</span>
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-app-fg/80 leading-relaxed">
              <MathRenderer content={currentType.theorySummary} />
            </p>

            {currentType.formulasOrRules.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-border-subtle/50">
                <span className="text-[10px] font-black uppercase tracking-wider text-app-fg/40">Formulas / Steps:</span>
                <ul className="space-y-1">
                  {currentType.formulasOrRules.map((rule, idx) => (
                    <li key={idx} className="text-xs font-bold text-app-fg/90 flex items-start gap-2">
                      <span className="text-blue-400 font-mono font-black shrink-0">•</span>
                      <span><MathRenderer content={rule} /></span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Common Traps & Desmos Tips */}
          <div className="space-y-4">
            {/* Traps */}
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center gap-2">
                <AlertTriangle size={14} />
                <span>Common SAT Traps to Avoid</span>
              </h4>
              <ul className="space-y-1">
                {currentType.commonTraps.map((trap, idx) => (
                  <li key={idx} className="text-xs font-semibold text-app-fg/80 flex items-start gap-2">
                    <span className="text-rose-400 font-mono font-black shrink-0">✕</span>
                    <span><MathRenderer content={trap} /></span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Desmos Tip */}
            {currentType.desmosTip && (
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 space-y-1.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                  <Calculator size={14} />
                  <span>Desmos / Bluebook Strategy</span>
                </h4>
                <p className="text-xs font-semibold text-app-fg/90 leading-relaxed">
                  <MathRenderer content={currentType.desmosTip} />
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ─── Best Resources ────────────────────────────────────────── */}
        {currentType.bestResources.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-border-subtle">
            <h3 className="text-xs font-black uppercase tracking-wider text-app-fg/50 flex items-center gap-2">
              <ExternalLink size={14} className="text-amber-400" />
              <span>Recommended High-Yield Resources</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {currentType.bestResources.map((res, idx) => (
                <a
                  key={idx}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-2xl bg-panel border border-border-subtle hover:border-blue-400 hover:bg-white/5 transition-all block group"
                >
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-app-fg/50 mb-1">
                    <span className="text-blue-400">{res.provider}</span>
                    <span>{res.durationOrLength || (res.type === 'video' ? 'Video' : 'Article')}</span>
                  </div>
                  <h4 className="text-xs font-black text-app-fg group-hover:text-blue-400 transition-colors line-clamp-2">
                    {res.title}
                  </h4>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ─── Question Demonstration (Identical to Official Bluebook View) ─ */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <h3 className="text-xs font-black uppercase tracking-wider text-app-fg/60">
              Official Bluebook Question Demonstration • {activeQuestionIdx + 1} of {typeQuestions.length}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                play('tap');
                setShuffleKey(k => k + 1);
              }}
              className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
              title="Shuffle question order for this archetype"
            >
              Shuffle Order
            </button>
            <span className="text-xs font-bold text-app-fg/40">
              Difficulty: {activeQuestion?.difficulty || 'Medium'} {activeQuestion?.isHardest ? '• ☠ Hardest' : ''}
            </span>
          </div>
        </div>

        {activeQuestion ? (
          <BluebookQuestionView
            question={activeQuestion}
            currentIndex={activeQuestionIdx}
            totalQuestions={typeQuestions.length}
            userAnswer={userAnswer}
            isMarkedForReview={isMarkedForReview}
            eliminatedOptions={eliminatedOptions}
            isSubmitted={isSubmitted}
            onSelectAnswer={handleSelectAnswer}
            onToggleEliminate={handleToggleEliminate}
            onToggleMarkForReview={handleToggleMarkForReview}
            onPrevious={handlePreviousQuestion}
            onNext={handleNextQuestion}
            onSubmitQuestion={handleSubmitAnswer}
            onFinishQuiz={() => goToType(currentIndex + 1)}
            onOpenQuestionGrid={() => {}}
            isPracticeMode={true}
          />
        ) : (
          <div className="glass p-12 text-center text-app-fg/50 font-bold rounded-3xl border border-border-subtle">
            No practice questions found for this archetype.
          </div>
        )}
      </div>
    </div>
  );
}
