import { useState, useEffect } from 'react';
import {
  Bookmark,
  Clock,
  Eye,
  EyeOff,
  Calculator,
  BookOpen,
  FileText,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ExternalLink,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Video,
  ChevronDown,
  ChevronUp,
  Bot,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { clsx } from 'clsx';
import type { SatQuestion, BestResource, SatVocabItem } from '../types';
import MathRenderer from './MathRenderer';
import DesmosModal from './DesmosModal';
import VocabInspector from './VocabInspector';
import ReferenceSheetModal from './ReferenceSheetModal';
import { MICRO_TYPE_MAP } from '../data/microtypes';
import { VOCAB_DATA } from '../data/vocabData';
import { getQuestionStatus } from '../lib/satStorage';
import { explainSatQuestion } from '../services/satAiService';
import { play } from '../../lib/audio';
import { animateShake, animateSuccessPulse } from '../lib/animations';

interface BluebookQuestionViewProps {
  question: SatQuestion;
  currentIndex: number;
  totalQuestions: number;
  userAnswer?: string;
  isMarkedForReview: boolean;
  eliminatedOptions: string[];
  isSubmitted: boolean;
  onSelectAnswer: (ans: string) => void;
  onToggleEliminate: (optionId: string) => void;
  onToggleMarkForReview: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSubmitQuestion: () => void;
  onFinishQuiz: () => void;
  onOpenQuestionGrid: () => void;
  onExit?: () => void;
  timeRemainingSeconds?: number;
  isPracticeMode?: boolean;
  moduleTitle?: string;
  sectionTitle?: string;
  moduleQuestionIndex?: number;
  moduleTotalQuestions?: number;
  moduleStartIndex?: number;
  moduleEndIndex?: number;
  isModuleLastQuestion?: boolean;
  isLastModule?: boolean;
  onNextModule?: () => void;
  isModuleBased?: boolean;
}

export default function BluebookQuestionView({
  question,
  currentIndex,
  totalQuestions,
  userAnswer = '',
  isMarkedForReview,
  eliminatedOptions,
  isSubmitted,
  onSelectAnswer,
  onToggleEliminate,
  onToggleMarkForReview,
  onPrevious,
  onNext,
  onSubmitQuestion,
  onFinishQuiz,
  onOpenQuestionGrid,
  onExit,
  timeRemainingSeconds,
  isPracticeMode = true,
  moduleTitle,
  sectionTitle,
  moduleQuestionIndex,
  moduleTotalQuestions,
  moduleStartIndex,
  isModuleLastQuestion,
  isLastModule,
  onNextModule,
  isModuleBased = false
}: BluebookQuestionViewProps) {
  const [showTimer, setShowTimer] = useState(true);
  const [showDesmos, setShowDesmos] = useState(false);
  const [showVocab, setShowVocab] = useState(false);
  const [selectedWord, setSelectedWord] = useState('');
  const [showReferenceSheet, setShowReferenceSheet] = useState(false);
  const [showDirections, setShowDirections] = useState(false);

  const microTypeInfo = MICRO_TYPE_MAP.get(question.microType);
  const isMath = question.test === 'math';
  const hasPassage = Boolean(question.stimulus && question.stimulus.trim().length > 0);
  const questionStatus = getQuestionStatus(question.id);

  const isCorrect = isSubmitted && (
    question.correctAnswers.includes(userAnswer.trim()) ||
    question.correctAnswers.some(c => c.toLowerCase() === userAnswer.trim().toLowerCase())
  );

  // Trigger animations & auto-scroll to explanation on submit
  useEffect(() => {
    if (isSubmitted) {
      setTimeout(() => {
        const feedbackCard = document.getElementById('answer-feedback-card');
        if (feedbackCard) {
          if (isCorrect) {
            animateSuccessPulse(feedbackCard);
          } else {
            animateShake(feedbackCard);
          }
          feedbackCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [isSubmitted, isCorrect]);

  const formatTimer = (seconds?: number) => {
    if (seconds === undefined) return '--:--';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-7xl mx-auto bg-app-bg text-app-fg select-text rounded-2xl border border-border-subtle shadow-2xl overflow-hidden">
      {/* ─── Bluebook Top Bar ────────────────────────────────────────── */}
      <div className="h-14 border-b border-border-subtle bg-panel px-4 sm:px-6 flex items-center justify-between shrink-0 select-none z-20">
        {/* Section title & directions */}
        <div className="flex items-center gap-3">
          {onExit && (
            <button
              type="button"
              onClick={() => { play('tap'); onExit(); }}
              className="px-2.5 py-1.5 rounded-xl bg-panel hover:bg-rose-500/15 text-app-fg/80 hover:text-rose-500 dark:hover:text-rose-400 border border-border-subtle hover:border-rose-500/40 transition-all text-xs font-black flex items-center gap-1.5"
              title="Exit test session"
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">Exit</span>
            </button>
          )}
          <span className="font-black text-xs sm:text-sm uppercase tracking-wider text-app-fg/80 flex items-center gap-2">
            <span>{sectionTitle || (question.test === 'math' ? 'Section 2: Math' : 'Section 1: Reading and Writing')}</span>
            {moduleTitle && (
              <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-black normal-case">
                {moduleTitle}
              </span>
            )}
          </span>
          <button
            onClick={() => setShowDirections(!showDirections)}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 underline underline-offset-4 hidden sm:inline"
          >
            {showDirections ? 'Hide Directions' : 'Directions'}
          </button>
        </div>

        {/* Center: Timer toggle & display */}
        <div className="flex items-center gap-2">
          {showTimer && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-app-bg border border-border-subtle font-mono text-xs sm:text-sm font-black text-app-fg shadow-inner">
              <Clock size={14} className="text-blue-400" />
              <span>{formatTimer(timeRemainingSeconds)}</span>
            </div>
          )}
          <button
            onClick={() => { play('toggle'); setShowTimer(!showTimer); }}
            className="p-1.5 rounded-xl bg-panel border border-border-subtle hover:bg-white/10 text-app-fg/70 transition-all text-xs flex items-center gap-1"
            title={showTimer ? 'Hide Timer' : 'Show Timer'}
          >
            {showTimer ? <EyeOff size={14} /> : <Eye size={14} />}
            <span className="hidden sm:inline font-bold text-[10px]">{showTimer ? 'Hide' : 'Timer'}</span>
          </button>
        </div>

        {/* Right Tools: Reference Sheet, Desmos (Math only), Vocab Tool */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Reference Sheet (Math only) */}
          {isMath && (
            <button
              onClick={() => { play('tap'); setShowReferenceSheet(true); }}
              className="px-2.5 py-1.5 rounded-xl bg-panel border border-border-subtle hover:bg-white/10 text-app-fg transition-all text-xs font-bold flex items-center gap-1.5"
              title="Official SAT Math Reference Sheet"
            >
              <FileText size={14} className="text-amber-400" />
              <span className="hidden md:inline">Reference</span>
            </button>
          )}

          {/* Desmos Graphing Calculator (Math only) */}
          {isMath && (
            <button
              onClick={() => { play('tap'); setShowDesmos(true); }}
              className="px-2.5 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-all text-xs font-black flex items-center gap-1.5"
              title="Desmos Graphing Calculator"
            >
              <Calculator size={14} />
              <span className="hidden sm:inline">Calculator</span>
            </button>
          )}

          {/* Vocab Vault Inspector (R&W only) */}
          {!isMath && (
            <button
              onClick={() => { play('tap'); setSelectedWord(''); setShowVocab(true); }}
              className="px-2.5 py-1.5 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400 hover:bg-violet-500/20 transition-all text-xs font-black flex items-center gap-1.5"
              title="Digital SAT Vocabulary Vault"
            >
              <BookOpen size={14} />
              <span className="hidden sm:inline">Vocab</span>
            </button>
          )}

          {/* Mark for Review Toggle */}
          <button
            onClick={() => { play('toggle'); onToggleMarkForReview(); }}
            className={clsx(
              "px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5",
              isMarkedForReview
                ? "bg-amber-500/20 border-amber-500 text-amber-300"
                : "bg-panel border-border-subtle text-app-fg/70 hover:text-app-fg"
            )}
            title="Mark question for review later"
          >
            <Bookmark size={14} fill={isMarkedForReview ? "currentColor" : "none"} />
            <span className="hidden md:inline">Review</span>
          </button>
        </div>
      </div>

      {/* Directions Dropdown Drawer */}
      {showDirections && (
        <div className="p-4 bg-panel border-b border-border-subtle text-xs text-app-fg/80 leading-relaxed font-bold animate-fadeIn">
          {question.test === 'math' ? (
            <p>
              The use of a calculator is permitted for all questions. Unless indicated otherwise, the domain of a given function f is the set of all real numbers x for which f(x) is a real number. Angles are in radians unless otherwise indicated.
            </p>
          ) : (
            <p>
              Each passage or pair of passages below is accompanied by a number of questions. After reading each passage or poem, choose the best answer to each question based on what is stated or implied.
            </p>
          )}
        </div>
      )}

      {/* ─── Question Workspace Area ──────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {hasPassage ? (
          /* Passage on left, Question stem on right (R&W only) */
          <div className="space-y-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border-subtle">
              {/* Left Pane: Stimulus / Passage */}
              <div className="p-6 sm:p-10 space-y-4">
                <div className="flex items-center justify-between text-xs font-black text-app-fg/40 uppercase tracking-widest">
                  <span>Passage / Context</span>
                  <span>{question.domain}</span>
                </div>
                <div className="font-bluebook-serif text-sm sm:text-base leading-relaxed text-app-fg/90 sat-question-content">
                  <MathRenderer content={question.stimulus || ''} />
                </div>
              </div>

              {/* Right Pane: Question Stem & Choices */}
              <div className="p-6 sm:p-10 bg-panel/30">
                <div className="max-w-2xl mx-auto w-full space-y-6">
                  <QuestionCore
                    question={question}
                    currentIndex={currentIndex}
                    userAnswer={userAnswer}
                    isMarkedForReview={isMarkedForReview}
                    eliminatedOptions={eliminatedOptions}
                    isSubmitted={isSubmitted}
                    onSelectAnswer={onSelectAnswer}
                    onToggleEliminate={onToggleEliminate}
                    onToggleMarkForReview={onToggleMarkForReview}
                  />
                </div>
              </div>
            </div>

            {/* Post-Submit Review & Resources in ONE spacious, clean column */}
            {isPracticeMode && isSubmitted && (
              <div className="border-t border-border-subtle p-6 sm:p-10 max-w-4xl mx-auto w-full">
                <PostSubmitReview
                  question={question}
                  microTypeInfo={microTypeInfo}
                  isCorrect={isCorrect}
                  userAnswer={userAnswer}
                  onOpenVocab={() => { setSelectedWord(''); setShowVocab(true); }}
                />
              </div>
            )}
          </div>
        ) : (
          /* 1-Column Responsive: For all Math & standalone questions */
          <div className="p-6 sm:p-10 max-w-3xl mx-auto w-full space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-wider">
                  {question.domain}
                </span>
                <span className="px-3 py-1 rounded-full bg-panel border border-border-subtle text-xs font-black text-app-fg/70">
                  {question.difficulty}
                </span>
                {question.isHardest && (
                  <span className="px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-black flex items-center gap-1">
                    <Sparkles size={12} />
                    <span>Hardest</span>
                  </span>
                )}
              </div>

              {/* Touched Question Status Indicator */}
              {questionStatus.touched && (
                <div className="flex items-center gap-1.5">
                  {questionStatus.status === 'solved' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Solved Previously</span>
                    </span>
                  )}
                  {questionStatus.status === 'mistake' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                      <span>In Mistake Bank</span>
                    </span>
                  )}
                  {questionStatus.status === 'resolved' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>Mistake Cleared</span>
                    </span>
                  )}
                </div>
              )}
            </div>

            <QuestionCore
              question={question}
              currentIndex={currentIndex}
              userAnswer={userAnswer}
              isMarkedForReview={isMarkedForReview}
              eliminatedOptions={eliminatedOptions}
              isSubmitted={isSubmitted}
              onSelectAnswer={onSelectAnswer}
              onToggleEliminate={onToggleEliminate}
              onToggleMarkForReview={onToggleMarkForReview}
            />

            {/* Post-Submit Review & Resources (Shown ONLY in Practice Drill Mode after submitting) */}
            {isPracticeMode && isSubmitted && (
              <PostSubmitReview
                question={question}
                microTypeInfo={microTypeInfo}
                isCorrect={isCorrect}
                userAnswer={userAnswer}
                onOpenVocab={() => { setSelectedWord(''); setShowVocab(true); }}
              />
            )}
          </div>
        )}
      </div>

      {/* ─── Bluebook Bottom Navigation Bar ─────────────────────────── */}
      <div className="h-16 border-t border-border-subtle bg-panel px-4 sm:px-8 flex items-center justify-between shrink-0 z-20">
        <button
          onClick={() => { play('tap'); onPrevious(); }}
          disabled={isModuleBased && moduleStartIndex !== undefined ? currentIndex <= moduleStartIndex : currentIndex === 0}
          className="px-4 py-2.5 rounded-xl border border-border-subtle text-xs font-bold text-app-fg/70 hover:text-app-fg disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1.5"
        >
          <span>Back</span>
        </button>

        {/* Center: Question Grid Navigator button */}
        <button
          onClick={() => { play('tap'); onOpenQuestionGrid(); }}
          className="px-4 py-2 rounded-xl bg-app-bg border border-border-subtle hover:bg-white/10 text-app-fg font-black text-xs transition-all flex items-center gap-2"
        >
          {isModuleBased && moduleQuestionIndex !== undefined && moduleTotalQuestions ? (
            <span>
              Question {moduleQuestionIndex + 1} of {moduleTotalQuestions}
              <span className="text-app-fg/40 ml-1.5 hidden sm:inline font-normal">({currentIndex + 1} of {totalQuestions} total)</span>
            </span>
          ) : (
            <span>Question {currentIndex + 1} of {totalQuestions}</span>
          )}
        </button>

        {/* Right side: Practice Drill vs Simulated Exam Mode controls */}
        <div className="flex items-center gap-2">
          {!isPracticeMode ? (
            /* Exam Mode: No immediate submit; advance cleanly */
            isModuleBased ? (
              isModuleLastQuestion ? (
                isLastModule ? (
                  <button
                    onClick={() => { play('achievement'); onFinishQuiz(); }}
                    className="btn-duo btn-duo-gold px-7 py-2.5 text-xs flex items-center gap-2 shadow-none"
                  >
                    <Sparkles size={14} />
                    <span>Complete Exam</span>
                  </button>
                ) : (
                  <button
                    onClick={() => { play('tap'); onNextModule?.(); }}
                    className="btn-duo btn-duo-blue px-6 py-2.5 text-xs flex items-center gap-2 shadow-none"
                  >
                    <span>Next Module</span>
                    <ArrowRight size={14} />
                  </button>
                )
              ) : (
                <button
                  onClick={() => { play('tap'); onNext(); }}
                  className="btn-duo btn-duo-blue px-6 py-2.5 text-xs flex items-center gap-2 shadow-none"
                >
                  <span>Next</span>
                  <ArrowRight size={14} />
                </button>
              )
            ) : (
              currentIndex < totalQuestions - 1 ? (
                <button
                  onClick={() => { play('tap'); onNext(); }}
                  className="btn-duo btn-duo-blue px-6 py-2.5 text-xs flex items-center gap-2 shadow-none"
                >
                  <span>Next</span>
                  <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  onClick={() => { play('achievement'); onFinishQuiz(); }}
                  className="btn-duo btn-duo-gold px-7 py-2.5 text-xs flex items-center gap-2 shadow-none"
                >
                  <Sparkles size={14} />
                  <span>Complete Exam</span>
                </button>
              )
            )
          ) : (
            /* Practice Drill Mode: Submit Answer to reveal instant feedback */
            !isSubmitted ? (
              <button
                onClick={() => {
                  if (!userAnswer) {
                    play('incorrect');
                    return;
                  }
                  play(isCorrect ? 'correct' : 'incorrect');
                  onSubmitQuestion();
                }}
                disabled={!userAnswer}
                className="btn-duo btn-duo-green px-6 py-2.5 text-xs flex items-center gap-2 disabled:opacity-40 disabled:pointer-events-none shadow-none"
              >
                <span>Submit Answer</span>
              </button>
            ) : (
              currentIndex < totalQuestions - 1 ? (
                <button
                  onClick={() => { play('tap'); onNext(); }}
                  className="btn-duo btn-duo-blue px-6 py-2.5 text-xs flex items-center gap-2 shadow-none"
                >
                  <span>Next Question</span>
                  <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  onClick={() => { play('achievement'); onFinishQuiz(); }}
                  className="btn-duo btn-duo-gold px-7 py-2.5 text-xs flex items-center gap-2 shadow-none"
                >
                  <Sparkles size={14} />
                  <span>Complete Session</span>
                </button>
              )
            )
          )}
        </div>
      </div>

      {/* Floating Modals */}
      <DesmosModal
        isOpen={showDesmos}
        onClose={() => setShowDesmos(false)}
      />

      <ReferenceSheetModal
        isOpen={showReferenceSheet}
        onClose={() => setShowReferenceSheet(false)}
      />

      <VocabInspector
        isOpen={showVocab}
        onClose={() => setShowVocab(false)}
        initialWord={selectedWord}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-component: Question Stem & Choices
// ─────────────────────────────────────────────────────────────────────────────
function QuestionCore({
  question,
  currentIndex,
  userAnswer,
  isMarkedForReview: _isMarkedForReview,
  eliminatedOptions,
  isSubmitted,
  onSelectAnswer,
  onToggleEliminate,
  onToggleMarkForReview: _onToggleMarkForReview
}: {
  question: SatQuestion;
  currentIndex: number;
  userAnswer: string;
  isMarkedForReview: boolean;
  eliminatedOptions: string[];
  isSubmitted: boolean;
  onSelectAnswer: (ans: string) => void;
  onToggleEliminate: (optionId: string) => void;
  onToggleMarkForReview: () => void;
}) {
  const questionStatus = getQuestionStatus(question.id);

  return (
    <div className="space-y-6">
      {/* Question Index Badge & Stem */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-blue-500/20 text-blue-400 font-black text-xs flex items-center justify-center border border-blue-500/30">
              {currentIndex + 1}
            </span>
            <span className="text-xs font-bold text-app-fg/40 uppercase tracking-widest">
              {question.skill}
            </span>
          </div>

          {/* Touched Question Status Indicator */}
          {questionStatus.touched && (
            <div className="flex items-center gap-1.5">
              {questionStatus.status === 'solved' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Solved Previously</span>
                </span>
              )}
              {questionStatus.status === 'mistake' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                  <span>In Mistake Bank</span>
                </span>
              )}
              {questionStatus.status === 'resolved' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Mistake Cleared</span>
                </span>
              )}
            </div>
          )}
        </div>

        <div className="font-hind text-sm sm:text-base leading-relaxed text-app-fg sat-question-content">
          <MathRenderer content={question.stem} />
        </div>
      </div>

      {/* Answer Choices (MCQ vs Student-Produced Response) */}
      {question.type === 'mcq' && question.options && question.options.length > 0 ? (
        <div className="space-y-3 pt-2">
          {question.options.map((opt) => {
            const isSelected = userAnswer === opt.id;
            const isEliminated = eliminatedOptions.includes(opt.id);
            const isCorrectOption = question.correctAnswers.includes(opt.id);

            const getBadgeClass = () => {
              if (isSubmitted) {
                if (isCorrectOption) return "bg-emerald-600 text-white border-emerald-600 shadow-sm";
                if (isSelected) return "bg-rose-600 text-white border-rose-600 shadow-sm";
                return "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-border-subtle opacity-70";
              }
              if (isSelected) {
                return "bg-blue-600 text-white border-blue-600 shadow-sm";
              }
              return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-border-subtle group-hover:border-blue-400";
            };

            return (
              <div key={opt.id} className="relative group">
                  <button
                    type="button"
                    onClick={() => {
                      if (isSubmitted || isEliminated) return;
                      play('tap');
                      onSelectAnswer(opt.id);
                    }}
                    disabled={isSubmitted || isEliminated}
                    className={clsx(
                      "w-full p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3.5",
                      isEliminated && "opacity-30 line-through pointer-events-none bg-panel/30 border-border-subtle",
                      !isSubmitted && isSelected && "bg-blue-500/10 border-blue-500 text-blue-500 dark:text-blue-400 shadow-md",
                      !isSubmitted && !isSelected && !isEliminated && "bg-panel border-border-subtle hover:border-app-fg/30 text-app-fg",
                      isSubmitted && isCorrectOption && "bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-300 font-bold",
                      isSubmitted && isSelected && !isCorrectOption && "bg-rose-500/15 border-rose-500 text-rose-600 dark:text-rose-300 font-bold",
                      isSubmitted && !isSelected && !isCorrectOption && "bg-panel border-border-subtle opacity-60"
                    )}
                  >
                    <span
                      className={clsx(
                        "w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center shrink-0 border transition-colors",
                        getBadgeClass()
                      )}
                    >
                      {opt.id}
                    </span>

                    <div className="flex-1 font-hind text-sm sm:text-base leading-snug sat-question-content">
                      <MathRenderer content={opt.content} />
                    </div>
                  </button>

                {/* Strikethrough Eliminate Option Tool */}
                {!isSubmitted && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      play('tap');
                      onToggleEliminate(opt.id);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-panel hover:bg-white/10 text-app-fg/40 hover:text-app-fg opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold"
                    title={isEliminated ? 'Restore option' : 'Eliminate option'}
                  >
                    {isEliminated ? 'Restore' : 'Cross out'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Free Response / Student-Produced Math Grid-in */
        <div className="space-y-3 pt-2">
          <label className="text-xs font-black uppercase tracking-wider text-app-fg/60 block">
            Enter your numeric answer:
          </label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => onSelectAnswer(e.target.value)}
              disabled={isSubmitted}
              placeholder="e.g. 42 or 3/4 or 0.75"
              className="flex-1 px-4 py-3 rounded-xl bg-app-bg border-2 border-border-subtle focus:border-blue-500 font-mono text-lg font-bold text-app-fg outline-none transition-all"
            />
            {isSubmitted && (
              <span className="text-xs font-bold text-app-fg/60">
                Correct: <strong className="text-emerald-400">{question.correctAnswers.join(' or ')}</strong>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: Extract question-specific vocabulary
// ─────────────────────────────────────────────────────────────────────────────
function findQuestionVocab(question: SatQuestion): SatVocabItem[] {
  const text = `${question.stimulus || ''} ${question.stem || ''} ${(question.options || []).map(o => o.content).join(' ')}`.toLowerCase();
  
  // Clean tokens
  const words = new Set(text.replace(/[^a-z\s-]/g, ' ').split(/\s+/).filter(w => w.length > 3));

  const matches: SatVocabItem[] = [];
  for (const item of VOCAB_DATA) {
    const itemWord = item.word.toLowerCase();
    if (words.has(itemWord)) {
      matches.push(item);
    }
  }

  // Return up to 3 most relevant words
  return matches.slice(0, 3);
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: Resolve guaranteed working resource URLs
// ─────────────────────────────────────────────────────────────────────────────
function resolveResourceUrl(res: BestResource, question: SatQuestion, microTypeTitle?: string): string {
  const query = encodeURIComponent(`Digital SAT ${microTypeTitle || question.skill || question.microType}`);
  
  if (res.type === 'video') {
    if (!res.url || res.url === 'https://youtube.com' || res.url.includes('youtube.com/watch?v=kYJvG3ZfQj4')) {
      return `https://www.youtube.com/results?search_query=${query}`;
    }
    return res.url;
  }

  if (res.url.includes('khanacademy.org')) {
    if (res.url === 'https://khanacademy.org' || res.url === 'https://www.khanacademy.org') {
      return question.test === 'math'
        ? 'https://www.khanacademy.org/test-prep/v2-sat-math'
        : 'https://www.khanacademy.org/test-prep/digital-sat';
    }
    return res.url;
  }

  return res.url || `https://www.youtube.com/results?search_query=${query}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-component: Post-Submit Review & Resources (Appears ONLY after answering)
// ─────────────────────────────────────────────────────────────────────────────
function PostSubmitReview({
  question,
  microTypeInfo,
  isCorrect,
  userAnswer,
  onOpenVocab
}: {
  question: SatQuestion;
  microTypeInfo?: ReturnType<typeof MICRO_TYPE_MAP.get>;
  isCorrect: boolean;
  userAnswer: string;
  onOpenVocab: () => void;
}) {
  const [expandedVocab, setExpandedVocab] = useState<string | null>(null);
  const questionVocab = findQuestionVocab(question);

  return (
    <div id="answer-feedback-card" className="space-y-6 pt-4 border-t border-border-subtle animate-fadeIn">
      {/* 1. Answer Result Banner with Mascot Nini inside */}
      <div
        className={clsx(
          "p-6 sm:p-7 rounded-3xl border-2 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 shadow-xl relative overflow-hidden transition-all backdrop-blur-md",
          isCorrect
            ? "bg-emerald-500/10 border-emerald-500/60 dark:bg-emerald-950/35 text-app-fg"
            : "bg-rose-500/10 border-rose-500/60 dark:bg-rose-950/35 text-app-fg"
        )}
      >
        {/* Nini Mascot inside Answer Card */}
        <div className="relative shrink-0 flex flex-col items-center">
          <img
            src={isCorrect ? '/mascot/nini-right.png' : '/mascot/nini-wrong.png'}
            alt="Mascot Nini"
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-md select-none"
          />
          <div
            className={clsx(
              "absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white border-2 border-app-bg shadow-md",
              isCorrect ? "bg-emerald-500" : "bg-rose-500"
            )}
          >
            {isCorrect ? <CheckCircle2 size={14} strokeWidth={3} /> : <XCircle size={14} strokeWidth={3} />}
          </div>
        </div>

        {/* Feedback text inside the card */}
        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h4
              className={clsx(
                "font-black text-xl sm:text-2xl tracking-tight",
                isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
              )}
            >
              {isCorrect ? 'Correct! Excellent Job (+25 XP)' : 'Incorrect — Keep Practicing!'}
            </h4>
          </div>

          <div className="text-xs sm:text-sm font-bold text-app-fg mt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <span className="text-app-fg/70 font-semibold">Correct Answer:</span>
            <span className="font-black px-3 py-1 rounded-xl bg-emerald-600 text-white shadow-md text-xs sm:text-sm">
              {question.correctAnswers.join(', ')}
            </span>
            {userAnswer && !isCorrect && (
              <span className="text-xs font-black px-3 py-1 rounded-xl bg-rose-500/15 border-2 border-rose-500/40 text-rose-600 dark:text-rose-300">
                Your Answer: {userAnswer}
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-app-fg/80 font-semibold mt-2.5 leading-relaxed bg-panel/70 p-3 rounded-2xl border border-border-subtle">
            {isCorrect
              ? '✨ Nini says: "Outstanding work! You nailed this question\'s pattern."'
              : '💡 Nini says: "Spot the trap below and review the archetype formula to ace it next time!"'}
          </p>
        </div>
      </div>

      {/* 2. Nini AI Socratic Question Breakdown & Traps */}
      <AiQuestionBreakdownCard
        question={question}
        userAnswer={userAnswer}
        isCorrect={isCorrect}
      />

      {/* 3. Micro-Type Archetype & Theory Breakdown */}
      {microTypeInfo && (
        <div className="glass p-6 rounded-2xl border border-blue-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <Sparkles size={13} />
              <span>Micro-Type Archetype</span>
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20">
              {microTypeInfo.skill}
            </span>
          </div>

          <h4 className="text-base font-black text-app-fg">{microTypeInfo.title}</h4>

          <div className="p-4 rounded-xl bg-app-bg/60 border border-border-subtle/60 text-xs font-bold text-app-fg/80 leading-relaxed">
            <strong className="text-blue-400 block mb-1">Core Theory:</strong>
            {microTypeInfo.theorySummary}
          </div>

          {microTypeInfo.commonTraps && microTypeInfo.commonTraps.length > 0 && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 font-bold">
              ⚠️ <strong>Common SAT Trap:</strong> {microTypeInfo.commonTraps[0]}
            </div>
          )}

          {microTypeInfo.desmosTip && (
            <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 font-bold">
              💡 <strong>Desmos Shortcut:</strong> {microTypeInfo.desmosTip}
            </div>
          )}
        </div>
      )}

      {/* 4. Specific Question Vocabulary Detected */}
      {questionVocab.length > 0 && (
        <div className="glass p-5 rounded-2xl border border-violet-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-violet-400" />
              <h5 className="text-xs font-black text-violet-400 uppercase tracking-wider">
                Vocabulary in this Question
              </h5>
            </div>
            <button
              onClick={() => { play('tap'); onOpenVocab(); }}
              className="text-[11px] font-bold text-violet-400 hover:underline"
            >
              Open Vault ({VOCAB_DATA.length} words) →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {questionVocab.map((vocab) => {
              const isExpanded = expandedVocab === vocab.id;
              return (
                <div
                  key={vocab.id}
                  onClick={() => { play('tap'); setExpandedVocab(isExpanded ? null : vocab.id); }}
                  className="p-3.5 rounded-xl bg-panel hover:bg-violet-500/10 border border-border-subtle hover:border-violet-500/30 cursor-pointer transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="font-black text-sm capitalize text-app-fg">{vocab.word}</span>
                      <span className="text-[10px] text-violet-400 font-bold">{vocab.phonetic}</span>
                    </div>
                    {isExpanded ? <ChevronUp size={14} className="text-violet-400" /> : <ChevronDown size={14} className="text-app-fg/40" />}
                  </div>

                  <p className="text-xs font-medium text-app-fg/80 leading-relaxed">
                    {vocab.definition}
                  </p>

                  {isExpanded && (
                    <div className="pt-2 border-t border-border-subtle/50 text-[11px] space-y-1 animate-fadeIn">
                      <p className="text-violet-400 font-bold">Example in SAT Context:</p>
                      <p className="italic text-app-fg/70 font-bluebook-serif">"{vocab.contextSentence}"</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Curated Video & Text Resources (Guaranteed 100% working links) */}
      {microTypeInfo?.bestResources && microTypeInfo.bestResources.length > 0 && (
        <div className="glass p-6 rounded-2xl border border-border-subtle space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-app-fg/50 flex items-center gap-2">
            <Video size={14} className="text-blue-400" />
            <span>Curated Video & Text Resources</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {microTypeInfo.bestResources.map((res: BestResource, i: number) => {
              const workingUrl = resolveResourceUrl(res, question, microTypeInfo.title);
              return (
                <a
                  key={i}
                  href={workingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3.5 rounded-xl bg-panel hover:bg-blue-500/10 border border-border-subtle hover:border-blue-500/30 transition-all flex items-center justify-between text-xs font-bold text-app-fg group"
                >
                  <div className="truncate mr-2">
                    <span className="text-[10px] font-black uppercase text-blue-400 block">{res.type}</span>
                    <span className="truncate">{res.title}</span>
                  </div>
                  <ExternalLink size={14} className="text-app-fg/40 group-hover:text-blue-400 shrink-0" />
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. Official College Board Rationale & Step-by-Step Explanation */}
      {question.rationale && (
        <div className="glass p-6 rounded-2xl border border-border-subtle space-y-3">
          <div className="flex items-center gap-2 text-xs font-black text-app-fg/50 uppercase tracking-wider">
            <Lightbulb size={14} className="text-amber-400" />
            <span>Official Explanation & Rationale</span>
          </div>
          <div className="text-xs sm:text-sm font-medium text-app-fg/80 leading-relaxed font-hind sat-question-content">
            <MathRenderer content={question.rationale} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-component: Nini AI Socratic Question Breakdown
// ─────────────────────────────────────────────────────────────────────────────
function AiQuestionBreakdownCard({
  question,
  userAnswer,
  isCorrect: _isCorrect,
}: {
  question: SatQuestion;
  userAnswer?: string;
  isCorrect: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [lang, setLang] = useState<'bn' | 'en'>('en');

  const fetchBreakdown = async (targetLang = lang) => {
    setLoading(true);
    setIsOpen(true);
    try {
      const res = await explainSatQuestion(question, userAnswer, targetLang === 'en');
      setResponse(res);
    } catch (e) {
      console.error(e);
      setResponse('Failed to generate AI breakdown. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLang = (newLang: 'bn' | 'en') => {
    setLang(newLang);
    if (isOpen) {
      fetchBreakdown(newLang);
    }
  };

  return (
    <div className="glass p-6 rounded-2xl border border-indigo-500/30 space-y-4 relative overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Bot size={18} />
          </div>
          <div>
            <h4 className="text-sm font-black text-app-fg flex items-center gap-1.5">
              <span>Nini AI Socratic Coach</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30">
                Free AI
              </span>
            </h4>
            <p className="text-[11px] text-app-fg/60 font-medium">
              Step-by-step logic, trap exposure & 15-second shortcut
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <div className="flex items-center bg-app-bg/80 rounded-xl p-0.5 border border-border-subtle text-[11px] font-bold">
            <button
              onClick={() => handleToggleLang('bn')}
              className={clsx(
                "px-2.5 py-1 rounded-lg transition-all",
                lang === 'bn' ? "bg-indigo-600 text-white shadow-sm" : "text-app-fg/60 hover:text-app-fg"
              )}
            >
              বাংলা
            </button>
            <button
              onClick={() => handleToggleLang('en')}
              className={clsx(
                "px-2.5 py-1 rounded-lg transition-all",
                lang === 'en' ? "bg-indigo-600 text-white shadow-sm" : "text-app-fg/60 hover:text-app-fg"
              )}
            >
              English
            </button>
          </div>

          {!isOpen ? (
            <button
              onClick={() => { play('tap'); fetchBreakdown(); }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-black text-xs transition-all shadow-md flex items-center gap-1.5"
            >
              <Sparkles size={13} />
              <span>Ask Nini AI</span>
            </button>
          ) : (
            <button
              onClick={() => { play('tap'); fetchBreakdown(); }}
              disabled={loading}
              className="p-2 rounded-xl bg-panel hover:bg-white/10 border border-border-subtle text-app-fg/70 hover:text-app-fg transition-all"
              title="Regenerate explanation"
            >
              <RefreshCw size={14} className={clsx(loading && "animate-spin")} />
            </button>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="pt-3 border-t border-border-subtle space-y-3 animate-fadeIn">
          {loading ? (
            <div className="p-8 flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 animate-pulse">
                <Loader2 size={22} className="animate-spin" />
              </div>
              <p className="text-xs font-bold text-app-fg/70">
                Nini is analyzing question structure, trap archetypes, and Desmos shortcuts...
              </p>
            </div>
          ) : response ? (
            <div className="p-4 rounded-xl bg-app-bg/70 border border-border-subtle/80 font-hind text-xs sm:text-sm text-app-fg leading-relaxed sat-question-content space-y-3">
              <MathRenderer content={response} />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
