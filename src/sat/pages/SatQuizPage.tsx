import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { clsx } from 'clsx';
import confetti from 'canvas-confetti';
import {
  Trophy,
  RotateCcw,
  Home,
  Sparkles,
  AlertTriangle,
  Clock,
  Coffee,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import BluebookQuestionView from '../components/BluebookQuestionView';
import NiniCoach from '../components/NiniCoach';
import {
  getAllQuestions,
  getQuestionsByFilter,
  getHardestQuestions,
  getAllHardestQuestionsForMicroType,
  getRemainingQuestionsForMicroType,
  generateSatPracticeTest,
  getQuestionById
} from '../data/questionsRepo';
import { MICRO_TYPE_MAP } from '../data/microtypes';
import type { SatQuestion, QuizQuestionState, QuizSessionResult, SatTestSection, SatDifficulty } from '../types';
import { recordQuestionAttempt, recordQuizSession, loadSatUserState, getQuestionStatus } from '../lib/satStorage';
import { play } from '../../lib/audio';

function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export interface QuizModuleDefinition {
  moduleIndex: number;
  section: SatTestSection;
  sectionTitle: string;
  moduleTitle: string;
  startIndex: number;
  endIndex: number; // exclusive
  questionCount: number;
  timeLimitSeconds: number;
}

function computeModulesForTest(pool: SatQuestion[], isExamMode: boolean): QuizModuleDefinition[] {
  if (!isExamMode && pool.length < 40) {
    return [
      {
        moduleIndex: 0,
        section: pool[0]?.test || 'math',
        sectionTitle: pool[0]?.test === 'reading_writing' ? 'Section 1: Reading and Writing' : 'Section 2: Math',
        moduleTitle: 'Practice Drill',
        startIndex: 0,
        endIndex: pool.length,
        questionCount: pool.length,
        timeLimitSeconds: pool.length * 80
      }
    ];
  }

  // 1. Official Full Exam (98 questions)
  if (pool.length === 98) {
    return [
      {
        moduleIndex: 0,
        section: 'reading_writing',
        sectionTitle: 'Section 1: Reading and Writing',
        moduleTitle: 'Module 1',
        startIndex: 0,
        endIndex: 27,
        questionCount: 27,
        timeLimitSeconds: 32 * 60
      },
      {
        moduleIndex: 1,
        section: 'reading_writing',
        sectionTitle: 'Section 1: Reading and Writing',
        moduleTitle: 'Module 2',
        startIndex: 27,
        endIndex: 54,
        questionCount: 27,
        timeLimitSeconds: 32 * 60
      },
      {
        moduleIndex: 2,
        section: 'math',
        sectionTitle: 'Section 2: Math',
        moduleTitle: 'Module 1',
        startIndex: 54,
        endIndex: 76,
        questionCount: 22,
        timeLimitSeconds: 35 * 60
      },
      {
        moduleIndex: 3,
        section: 'math',
        sectionTitle: 'Section 2: Math',
        moduleTitle: 'Module 2',
        startIndex: 76,
        endIndex: 98,
        questionCount: 22,
        timeLimitSeconds: 35 * 60
      }
    ];
  }

  // 2. Official Reading & Writing Section Exam (54 questions)
  if (pool.length === 54) {
    return [
      {
        moduleIndex: 0,
        section: 'reading_writing',
        sectionTitle: 'Section 1: Reading and Writing',
        moduleTitle: 'Module 1',
        startIndex: 0,
        endIndex: 27,
        questionCount: 27,
        timeLimitSeconds: 32 * 60
      },
      {
        moduleIndex: 1,
        section: 'reading_writing',
        sectionTitle: 'Section 1: Reading and Writing',
        moduleTitle: 'Module 2',
        startIndex: 27,
        endIndex: 54,
        questionCount: 27,
        timeLimitSeconds: 32 * 60
      }
    ];
  }

  // 3. Official Math Section Exam (44 questions)
  if (pool.length === 44) {
    return [
      {
        moduleIndex: 0,
        section: 'math',
        sectionTitle: 'Section 2: Math',
        moduleTitle: 'Module 1',
        startIndex: 0,
        endIndex: 22,
        questionCount: 22,
        timeLimitSeconds: 35 * 60
      },
      {
        moduleIndex: 1,
        section: 'math',
        sectionTitle: 'Section 2: Math',
        moduleTitle: 'Module 2',
        startIndex: 22,
        endIndex: 44,
        questionCount: 22,
        timeLimitSeconds: 35 * 60
      }
    ];
  }

  // 4. Mini Full SAT (49 questions: 27 RW + 22 Math)
  if (pool.length === 49) {
    return [
      {
        moduleIndex: 0,
        section: 'reading_writing',
        sectionTitle: 'Section 1: Reading and Writing',
        moduleTitle: 'Module 1',
        startIndex: 0,
        endIndex: 27,
        questionCount: 27,
        timeLimitSeconds: 32 * 60
      },
      {
        moduleIndex: 1,
        section: 'math',
        sectionTitle: 'Section 2: Math',
        moduleTitle: 'Module 1',
        startIndex: 27,
        endIndex: 49,
        questionCount: 22,
        timeLimitSeconds: 35 * 60
      }
    ];
  }

  // Default: single module
  return [
    {
      moduleIndex: 0,
      section: pool[0]?.test || 'math',
      sectionTitle: pool[0]?.test === 'reading_writing' ? 'Section 1: Reading and Writing' : 'Section 2: Math',
      moduleTitle: 'Practice Session',
      startIndex: 0,
      endIndex: pool.length,
      questionCount: pool.length,
      timeLimitSeconds: pool.length * 80
    }
  ];
}

export default function SatQuizPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const mode = searchParams.get('mode') || 'custom_drill';
  const microTypeParam = searchParams.get('microType');
  const questionIdParam = searchParams.get('questionId');
  const sectionParam = (searchParams.get('section') || 'all') as SatTestSection | 'all';
  const countParam = Number(searchParams.get('count')) || 0;
  const domainParam = searchParams.get('domain') || undefined;
  const topicsParam = searchParams.get('topics') || searchParams.get('topic');
  const parsedTopics = useMemo(() => {
    return topicsParam ? topicsParam.split(',').map(s => s.trim()).filter(Boolean) : undefined;
  }, [topicsParam]);
  const difficultyParam = (searchParams.get('difficulty') || undefined) as SatDifficulty | 'all' | undefined;
  const diffMixParam = searchParams.get('diffMix') || undefined;
  const timedParam = searchParams.get('timed');
  const dueOnlyParam = searchParams.get('dueOnly') === 'true';

  // Quiz questions & navigation state
  const [questions, setQuestions] = useState<SatQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionStates, setQuestionStates] = useState<QuizQuestionState[]>([]);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [showQuestionGrid, setShowQuestionGrid] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showModuleReviewModal, setShowModuleReviewModal] = useState(false);

  // Module & Break states
  const [currentModuleIdx, setCurrentModuleIdx] = useState(0);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakRemainingSeconds, setBreakRemainingSeconds] = useState(10 * 60); // 10 minutes (600s)
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(35 * 60);

  const isExamMode = mode === 'practice_test';
  const modules = useMemo(() => {
    return computeModulesForTest(questions, isExamMode);
  }, [questions, isExamMode]);

  const activeModule = modules[currentModuleIdx] || modules[0] || {
    moduleIndex: 0,
    section: 'math',
    sectionTitle: 'Section 2: Math',
    moduleTitle: 'Module 1',
    startIndex: 0,
    endIndex: questions.length,
    questionCount: questions.length,
    timeLimitSeconds: 35 * 60
  };

  const isModuleBased = modules.length > 1;
  const isModuleLastQuestion = isModuleBased && currentIndex === activeModule.endIndex - 1;
  const isLastModule = isModuleBased && currentModuleIdx === modules.length - 1;

  // Intercept browser back button and reload during active test
  useEffect(() => {
    if (isQuizCompleted) {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('cs_sat_test_in_progress');
      }
      return;
    }

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('cs_sat_test_in_progress', 'true');
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    window.history.pushState({ inSatQuiz: true }, '');

    const handlePopState = () => {
      window.history.pushState({ inSatQuiz: true }, '');
      setShowExitConfirm(true);
    };

    const handleForceExit = () => {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('cs_sat_test_in_progress');
      }
      setIsQuizCompleted(true);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('cs_sat_test_force_exit', handleForceExit);

    return () => {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('cs_sat_test_in_progress');
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('cs_sat_test_force_exit', handleForceExit);
    };
  }, [isQuizCompleted]);

  // Initialize questions based on query params (Randomized Everywhere)
  useEffect(() => {
    let pool: SatQuestion[];

    if (mode === 'hardest_drill' && microTypeParam) {
      const allHardest = getAllHardestQuestionsForMicroType(microTypeParam);
      if (questionIdParam) {
        const specific = getQuestionById(questionIdParam);
        if (specific) {
          pool = [specific, ...shuffleArray(allHardest.filter(q => q.id !== specific.id))];
        } else {
          pool = shuffleArray(allHardest);
        }
      } else {
        pool = shuffleArray(allHardest);
      }
      if (countParam > 0) {
        pool = pool.slice(0, countParam);
      }
    } else if (mode === 'mistakes_drill') {
      const state = loadSatUserState();
      const todayStr = new Date().toISOString().split('T')[0];
      let targetMistakes = state.mistakes.filter(m => !m.resolved);

      // Support Spaced Repetition Due-Only filter
      if (dueOnlyParam) {
        const due = targetMistakes.filter(m => !m.nextReviewDate || m.nextReviewDate <= todayStr);
        if (due.length > 0) {
          targetMistakes = due;
        }
      }

      const mistakePool = targetMistakes
        .map(m => getQuestionById(m.questionId))
        .filter((q): q is SatQuestion => Boolean(q));
      pool = mistakePool.length ? shuffleArray(mistakePool) : getHardestQuestions(5);
    } else if (mode === 'drill' && microTypeParam) {
      const allTypeQs = getQuestionsByFilter({ microType: microTypeParam });
      if (questionIdParam) {
        const specific = getQuestionById(questionIdParam);
        if (specific) {
          pool = [specific, ...allTypeQs.filter(q => q.id !== specific.id)];
        } else {
          pool = allTypeQs;
        }
      } else {
        pool = allTypeQs;
      }
      if (countParam > 0) {
        pool = pool.slice(0, countParam);
      }
    } else if (mode === 'practice_test') {
      const section: SatTestSection | 'full' = sectionParam === 'all' ? 'full' : sectionParam;
      if (domainParam || (parsedTopics && parsedTopics.length > 0) || (difficultyParam && difficultyParam !== 'all') || diffMixParam === 'hard') {
        pool = getQuestionsByFilter({
          section: section !== 'full' ? section : undefined,
          domain: domainParam,
          skills: parsedTopics,
          difficulty: difficultyParam !== 'all' ? difficultyParam : undefined,
          onlyHardest: diffMixParam === 'hard',
          limit: countParam > 0 ? countParam : undefined
        });
      } else {
        const generated = generateSatPracticeTest(section, countParam > 0 ? countParam : undefined);
        pool = generated;
      }
    } else if (mode === 'personalized') {
      const state = loadSatUserState();
      const targetCount = countParam > 0 ? countParam : 10;
      const targetSection = sectionParam !== 'all' ? sectionParam : undefined;

      const unresolvedMistakes = state.mistakes
        .filter(m => !m.resolved)
        .map(m => getQuestionById(m.questionId))
        .filter((q): q is SatQuestion => Boolean(q && (!targetSection || q.test === targetSection)));

      const attemptedMicroTypes = new Set(
        state.attempts
          .filter(a => !targetSection || a.section === targetSection)
          .map(a => a.microType)
      );

      const weakMicroTypes = Array.from(attemptedMicroTypes).filter(mtId => {
        const att = state.attempts.filter(a => a.microType === mtId);
        const cor = att.filter(a => a.isCorrect).length;
        return att.length >= 1 && (cor / att.length) < 0.75;
      });

      const weakQuestions: SatQuestion[] = [];
      for (const mt of weakMicroTypes) {
        const qs = getQuestionsByFilter({ microType: mt, section: targetSection, limit: 3 });
        weakQuestions.push(...qs);
      }

      const supplement = getQuestionsByFilter({
        section: targetSection,
        limit: targetCount
      });

      const combined = [
        ...shuffleArray(unresolvedMistakes),
        ...shuffleArray(weakQuestions),
        ...supplement
      ];

      const seen = new Set<string>();
      const deduped: SatQuestion[] = [];
      for (const q of combined) {
        if (!seen.has(q.id)) {
          seen.add(q.id);
          deduped.push(q);
        }
        if (deduped.length >= targetCount) break;
      }
      pool = deduped.length ? deduped : shuffleArray(getAllQuestions()).slice(0, targetCount);
    } else if (mode === 'hardest') {
      const allHardest = getHardestQuestions();
      const filtered = sectionParam !== 'all' ? allHardest.filter(q => q.test === sectionParam) : allHardest;
      const unsolved = filtered.filter(q => getQuestionStatus(q.id).status !== 'solved');
      const solved = filtered.filter(q => getQuestionStatus(q.id).status === 'solved');
      const count = countParam > 0 ? countParam : 10;
      pool = [...shuffleArray(unsolved), ...shuffleArray(solved)].slice(0, count);
    } else {
      pool = getQuestionsByFilter({
        section: sectionParam !== 'all' ? sectionParam : undefined,
        domain: domainParam,
        skills: parsedTopics,
        difficulty: difficultyParam !== 'all' ? difficultyParam : undefined,
        onlyHardest: diffMixParam === 'hard',
        limit: countParam > 0 ? countParam : 10
      });
    }

    if (!pool.length) {
      pool = shuffleArray(getAllQuestions()).slice(0, 10);
    }

    setQuestions(pool);
    setCurrentIndex(0);
    setCurrentModuleIdx(0);
    setIsOnBreak(false);
    setIsQuizCompleted(false);

    setQuestionStates(
      pool.map(q => ({
        question: q,
        userAnswer: '',
        isCorrect: false,
        timeSpentSeconds: 0,
        isMarkedForReview: false,
        eliminatedOptions: []
      }))
    );

    // Initial module timer setup
    const initialMods = computeModulesForTest(pool, mode === 'practice_test');
    const firstModule = initialMods[0];
    setTimeRemainingSeconds(firstModule ? firstModule.timeLimitSeconds : pool.length * 80);
  }, [mode, microTypeParam, questionIdParam, sectionParam, countParam, domainParam, topicsParam, difficultyParam, diffMixParam, dueOnlyParam]);

  // Main active module timer countdown
  useEffect(() => {
    if (isQuizCompleted || timedParam === 'false' || isOnBreak) return;
    const timer = setInterval(() => {
      setTimeRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeExpiredAdvance();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isQuizCompleted, timedParam, isOnBreak, currentModuleIdx, modules]);

  // 10-Minute Break countdown timer
  useEffect(() => {
    if (!isOnBreak) return;
    const breakTimer = setInterval(() => {
      setBreakRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(breakTimer);
          handleResumeFromBreak();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(breakTimer);
  }, [isOnBreak, currentModuleIdx]);

  // Auto-advance when time expires in a module
  const handleTimeExpiredAdvance = () => {
    play('incorrect');
    if (!isModuleBased || isLastModule) {
      handleFinishQuiz();
      return;
    }

    // Check if transitioning from Reading & Writing to Math (Trigger 10-Minute Break)
    const isEnteringBreak = (questions.length === 98 && currentModuleIdx === 1) ||
                            (questions.length === 49 && currentModuleIdx === 0);

    if (isEnteringBreak) {
      setIsOnBreak(true);
      setBreakRemainingSeconds(10 * 60);
      play('achievement');
    } else {
      const nextIdx = currentModuleIdx + 1;
      const nextMod = modules[nextIdx];
      if (nextMod) {
        setCurrentModuleIdx(nextIdx);
        setCurrentIndex(nextMod.startIndex);
        setTimeRemainingSeconds(nextMod.timeLimitSeconds);
        play('toggle');
      } else {
        handleFinishQuiz();
      }
    }
  };

  // User confirmed advance to next module or break
  const handleConfirmAdvanceModule = () => {
    setShowModuleReviewModal(false);

    // Check if transitioning from Reading & Writing to Math (Section 1 -> Section 2: Trigger 10-Minute Break)
    const isEnteringBreak = (questions.length === 98 && currentModuleIdx === 1) ||
                            (questions.length === 49 && currentModuleIdx === 0);

    if (isEnteringBreak) {
      setIsOnBreak(true);
      setBreakRemainingSeconds(10 * 60);
      play('achievement');
    } else {
      const nextIdx = currentModuleIdx + 1;
      const nextMod = modules[nextIdx];
      if (nextMod) {
        setCurrentModuleIdx(nextIdx);
        setCurrentIndex(nextMod.startIndex);
        setTimeRemainingSeconds(nextMod.timeLimitSeconds);
        play('tap');
      } else {
        handleFinishQuiz();
      }
    }
  };

  // Resume early or after countdown from 10-minute break
  const handleResumeFromBreak = () => {
    play('tap');
    setIsOnBreak(false);

    const nextIdx = currentModuleIdx + 1;
    const nextMod = modules[nextIdx];
    if (nextMod) {
      setCurrentModuleIdx(nextIdx);
      setCurrentIndex(nextMod.startIndex);
      setTimeRemainingSeconds(nextMod.timeLimitSeconds);
    } else {
      handleFinishQuiz();
    }
  };

  const currentQ = questions[currentIndex];
  const currentState = questionStates[currentIndex] || {
    question: currentQ,
    userAnswer: '',
    isCorrect: false,
    timeSpentSeconds: 0,
    isMarkedForReview: false,
    eliminatedOptions: []
  };

  // Handlers
  const handleSelectAnswer = (ans: string) => {
    setQuestionStates(prev => {
      const copy = [...prev];
      copy[currentIndex] = { ...copy[currentIndex], userAnswer: ans };
      return copy;
    });
  };

  const handleToggleEliminate = (optionId: string) => {
    setQuestionStates(prev => {
      const copy = [...prev];
      const cur = copy[currentIndex];
      const eliminated = cur.eliminatedOptions.includes(optionId)
        ? cur.eliminatedOptions.filter(id => id !== optionId)
        : [...cur.eliminatedOptions, optionId];
      copy[currentIndex] = { ...cur, eliminatedOptions: eliminated };
      return copy;
    });
  };

  const handleToggleMarkForReview = () => {
    setQuestionStates(prev => {
      const copy = [...prev];
      const cur = copy[currentIndex];
      copy[currentIndex] = { ...cur, isMarkedForReview: !cur.isMarkedForReview };
      return copy;
    });
  };

  // Check / Submit single question for practice drill mode
  const [submittedCurrent, setSubmittedCurrent] = useState(false);

  useEffect(() => {
    setSubmittedCurrent(false);
  }, [currentIndex]);

  const handleSubmitQuestion = () => {
    const ans = currentState.userAnswer?.trim();
    if (!ans) return;

    const isAnsCorrect = currentQ.correctAnswers.includes(ans) ||
      currentQ.correctAnswers.some(c => c.toLowerCase() === ans.toLowerCase());

    if (isAnsCorrect) {
      play('correct');
    } else {
      play('incorrect');
    }

    setSubmittedCurrent(true);

    recordQuestionAttempt(
      currentQ.id,
      currentQ.test,
      currentQ.domain,
      currentQ.skill,
      currentQ.microType,
      currentQ.difficulty,
      ans,
      currentQ.correctAnswers[0] || '',
      isAnsCorrect
    );

    setQuestionStates(prev => {
      const copy = [...prev];
      copy[currentIndex] = { ...copy[currentIndex], isCorrect: isAnsCorrect };
      return copy;
    });
  };

  const handleFinishQuiz = () => {
    play('achievement');
    setIsQuizCompleted(true);
    confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });

    // Evaluate all answers
    const evaluatedStates = questionStates.map(state => {
      const q = state.question;
      const ans = state.userAnswer?.trim();
      const isAnsCorrect = Boolean(
        ans &&
        (q.correctAnswers.includes(ans) ||
         q.correctAnswers.some(c => c.toLowerCase() === ans.toLowerCase()))
      );

      if (ans) {
        recordQuestionAttempt(
          q.id,
          q.test,
          q.domain,
          q.skill,
          q.microType,
          q.difficulty,
          ans,
          q.correctAnswers[0] || '',
          isAnsCorrect
        );
      }

      return {
        ...state,
        isCorrect: isAnsCorrect
      };
    });

    setQuestionStates(evaluatedStates);

    const correctCount = evaluatedStates.filter(s => s.isCorrect).length;
    const accuracy = Math.round((correctCount / questions.length) * 100);

    const result: QuizSessionResult = {
      id: 'session-' + Date.now(),
      title: mode === 'practice_test' ? 'SAT Full Practice Test' : 'Diagnostic Drill',
      quizType: (mode as 'custom_drill' | 'hardest_drill' | 'practice_test' | 'mistake_review'),
      section: sectionParam === 'all' ? 'full' : sectionParam,
      totalQuestions: questions.length,
      correctCount,
      incorrectCount: questions.length - correctCount,
      unansweredCount: evaluatedStates.filter(s => !s.userAnswer).length,
      accuracy,
      timeSpentSeconds: questions.length * 80 - timeRemainingSeconds,
      xpEarned: correctCount * 20 + 25,
      predictedScoreImpact: Math.round((accuracy - 60) * 0.4),
      completedAt: new Date().toISOString(),
      questionStates: evaluatedStates
    };

    recordQuizSession(result);
  };

  const handlePracticeMoreInMicroType = () => {
    if (!microTypeParam) return;
    const shownIds = questions.map(q => q.id);
    const unshown = getRemainingQuestionsForMicroType(microTypeParam, shownIds);

    if (unshown.length > 0) {
      setQuestions(unshown);
      setCurrentIndex(0);
      setIsQuizCompleted(false);
      setSubmittedCurrent(false);
      setQuestionStates(
        unshown.map(q => ({
          question: q,
          userAnswer: '',
          isCorrect: false,
          timeSpentSeconds: 0,
          isMarkedForReview: false,
          eliminatedOptions: []
        }))
      );
    } else {
      const allInType = getQuestionsByFilter({ microType: microTypeParam, limit: 10 });
      setQuestions(allInType);
      setCurrentIndex(0);
      setIsQuizCompleted(false);
      setSubmittedCurrent(false);
    }
  };

  if (!questions.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <h3 className="text-xl font-black text-app-fg">Loading SAT Question Bank...</h3>
      </div>
    );
  }

  // ─── 10-Minute Official Scheduled Break Screen ──────────────────────
  if (isOnBreak) {
    const breakMinutes = Math.floor(breakRemainingSeconds / 60);
    const breakSeconds = breakRemainingSeconds % 60;
    const formatBreakTime = `${breakMinutes.toString().padStart(2, '0')}:${breakSeconds.toString().padStart(2, '0')}`;
    const breakProgressPct = Math.round(((600 - breakRemainingSeconds) / 600) * 100);

    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
        <div className="glass p-8 sm:p-14 rounded-[3.5rem] border-2 border-blue-500/30 w-full text-center space-y-8 relative overflow-hidden shadow-2xl">
          {/* Top Banner Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-black uppercase tracking-widest mx-auto">
            <Coffee size={15} />
            <span>Digital SAT Official Scheduled Break</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-app-fg">
              Take a 10-Minute Break
            </h1>
            <p className="text-sm sm:text-base font-bold text-app-fg/70 max-w-xl mx-auto">
              You have completed <strong>Section 1: Reading and Writing</strong>. Rest your eyes, hydrate, and prepare for <strong>Section 2: Math</strong>.
            </p>
          </div>

          {/* Big Countdown Timer Display */}
          <div className="p-8 sm:p-10 rounded-3xl bg-panel-solid border-2 border-border-subtle max-w-md mx-auto space-y-4 shadow-xl">
            <span className="text-xs font-black uppercase tracking-wider text-app-fg/50 flex items-center justify-center gap-1.5">
              <Clock size={14} className="text-blue-400" />
              <span>Break Time Remaining</span>
            </span>

            <div className="font-mono text-5xl sm:text-7xl font-black tracking-wider text-blue-400 drop-shadow-md">
              {formatBreakTime}
            </div>

            {/* Progress bar */}
            <div className="h-2 w-full bg-app-bg rounded-full overflow-hidden border border-border-subtle/40">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-1000"
                style={{ width: `${breakProgressPct}%` }}
              />
            </div>

            <p className="text-[11px] font-bold text-app-fg/40">
              Section 2 will automatically start when the timer reaches 00:00
            </p>
          </div>

          {/* Official Test Day Break Rules */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-2xl mx-auto">
            <div className="p-4 rounded-2xl bg-panel border border-border-subtle space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-black text-emerald-400">
                <CheckCircle2 size={14} />
                <span>Rest & Refresh</span>
              </div>
              <p className="text-[11px] font-bold text-app-fg/60 leading-relaxed">
                Step away from your screen, stretch, drink water, or use the restroom.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-panel border border-border-subtle space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-black text-rose-400">
                <AlertTriangle size={14} />
                <span>No Study Materials</span>
              </div>
              <p className="text-[11px] font-bold text-app-fg/60 leading-relaxed">
                Do not access phones, notes, calculators, or outside study resources during break.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-panel border border-border-subtle space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-black text-blue-400">
                <ShieldCheck size={14} />
                <span>Keep Tab Open</span>
              </div>
              <p className="text-[11px] font-bold text-app-fg/60 leading-relaxed">
                Do not close your browser tab. Your exam progress is secure and synced.
              </p>
            </div>
          </div>

          {/* Primary Resume Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleResumeFromBreak}
              className="btn-duo btn-duo-green px-8 py-4 text-sm font-black flex items-center justify-center gap-2 shadow-xl"
            >
              <span>Resume Testing (Start Section 2: Math)</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Quiz Results Screen ──────────────────────────────────────────
  if (isQuizCompleted) {
    const correctCount = questionStates.filter(s => s.isCorrect).length;
    const accuracy = Math.round((correctCount / questions.length) * 100);
    const xpGained = correctCount * 20 + 25;
    const microTypeInfo = microTypeParam ? MICRO_TYPE_MAP.get(microTypeParam) : null;

    return (
      <div className="max-w-3xl mx-auto py-12 px-4 space-y-8 animate-fadeIn">
        <div className="glass p-8 sm:p-12 rounded-[3.5rem] border border-blue-500/30 text-center space-y-6 relative overflow-hidden">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-2xl">
            <Trophy size={40} />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-blue-400">
              Exam Session Completed
            </span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-app-fg">
              Great Session!
            </h1>
            <p className="text-sm font-bold text-app-fg/60">
              You answered <strong className="text-app-fg">{correctCount} of {questions.length}</strong> questions correctly ({accuracy}% accuracy).
            </p>
          </div>

          <div className="flex justify-center pt-2">
            <NiniCoach
              mood={accuracy >= 70 ? 'celebrate' : 'thoughtful'}
              message={
                accuracy >= 70
                  ? `Outstanding! You earned +${xpGained} XP. Your predicted score is climbing!`
                  : "Keep practicing! Review your wrong answers in the Mistake Bank to master the traps."
              }
              size="md"
            />
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-4">
            <div className="p-4 rounded-2xl bg-panel border border-border-subtle">
              <span className="text-[10px] font-black uppercase tracking-wider text-app-fg/40 block">Correct</span>
              <span className="text-2xl font-black text-emerald-400">{correctCount}</span>
            </div>
            <div className="p-4 rounded-2xl bg-panel border border-border-subtle">
              <span className="text-[10px] font-black uppercase tracking-wider text-app-fg/40 block">Accuracy</span>
              <span className="text-2xl font-black text-blue-400">{accuracy}%</span>
            </div>
            <div className="p-4 rounded-2xl bg-panel border border-border-subtle">
              <span className="text-[10px] font-black uppercase tracking-wider text-app-fg/40 block">XP Gained</span>
              <span className="text-2xl font-black text-amber-400">+{xpGained}</span>
            </div>
          </div>

          {microTypeParam && (
            <div className="pt-4 border-t border-border-subtle/80 max-w-md mx-auto space-y-2">
              <span className="text-xs font-bold text-app-fg/60 block">
                Want to practice more in <strong>{microTypeInfo?.title || 'this micro-type'}</strong>?
              </span>
              <button
                onClick={handlePracticeMoreInMicroType}
                className="btn-duo btn-duo-green w-full py-4 text-sm flex items-center justify-center gap-2"
              >
                <Sparkles size={16} />
                <span>Practice More Questions in this Micro-Type →</span>
              </button>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-3 pt-6">
            <Link
              to="/sat"
              onClick={() => play('tap')}
              className="px-6 py-3.5 rounded-2xl bg-panel border border-border-subtle hover:bg-white/10 text-xs font-black text-app-fg transition-all flex items-center gap-2"
            >
              <Home size={15} />
              <span>Back to Dashboard</span>
            </Link>

            <Link
              to="/sat/mistakes"
              onClick={() => play('tap')}
              className="px-6 py-3.5 rounded-2xl bg-pink-500/10 border border-pink-500/30 hover:bg-pink-500/20 text-xs font-black text-pink-400 transition-all flex items-center gap-2"
            >
              <span>Review Mistake Bank</span>
            </Link>

            <button
              onClick={() => {
                play('tap');
                window.location.reload();
              }}
              className="btn-duo btn-duo-blue px-6 py-3.5 text-xs flex items-center gap-2"
            >
              <RotateCcw size={15} />
              <span>Try Another Drill</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active module question indexing
  const moduleQuestionIndex = isModuleBased ? currentIndex - activeModule.startIndex : currentIndex;
  const moduleTotalQuestions = isModuleBased ? activeModule.questionCount : questions.length;

  return (
    <div className="relative">
      {/* ─── Bluebook Question Runner ──────────────────────────────── */}
      <BluebookQuestionView
        question={currentQ}
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        userAnswer={currentState.userAnswer}
        isMarkedForReview={currentState.isMarkedForReview}
        eliminatedOptions={currentState.eliminatedOptions}
        isSubmitted={submittedCurrent}
        onSelectAnswer={handleSelectAnswer}
        onToggleEliminate={handleToggleEliminate}
        onToggleMarkForReview={handleToggleMarkForReview}
        onPrevious={() => {
          if (isModuleBased) {
            if (currentIndex > activeModule.startIndex) {
              setCurrentIndex(currentIndex - 1);
            }
          } else if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
          }
        }}
        onNext={() => {
          if (isModuleBased) {
            if (currentIndex + 1 < activeModule.endIndex) {
              setCurrentIndex(currentIndex + 1);
            }
          } else if (currentIndex + 1 < questions.length) {
            setCurrentIndex(currentIndex + 1);
          }
        }}
        onSubmitQuestion={handleSubmitQuestion}
        onFinishQuiz={handleFinishQuiz}
        onOpenQuestionGrid={() => setShowQuestionGrid(true)}
        onExit={() => setShowExitConfirm(true)}
        timeRemainingSeconds={timeRemainingSeconds}
        isPracticeMode={mode !== 'practice_test'}
        moduleTitle={isModuleBased ? activeModule.moduleTitle : undefined}
        sectionTitle={isModuleBased ? activeModule.sectionTitle : undefined}
        moduleQuestionIndex={moduleQuestionIndex}
        moduleTotalQuestions={moduleTotalQuestions}
        moduleStartIndex={isModuleBased ? activeModule.startIndex : 0}
        moduleEndIndex={isModuleBased ? activeModule.endIndex : questions.length}
        isModuleLastQuestion={isModuleLastQuestion}
        isLastModule={isLastModule}
        onNextModule={() => setShowModuleReviewModal(true)}
        isModuleBased={isModuleBased}
      />

      {/* ─── Question Grid Navigator Popover ────────────────────────── */}
      {showQuestionGrid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-panel-solid border-2 border-border-subtle rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
              <div>
                <h3 className="text-lg font-black text-app-fg">
                  {isModuleBased ? `${activeModule.sectionTitle} • ${activeModule.moduleTitle}` : 'Question Navigation'}
                </h3>
                <p className="text-xs font-bold text-app-fg/50">
                  {isModuleBased ? `Items 1 to ${activeModule.questionCount} in this module` : 'Jump directly to any item'}
                </p>
              </div>
              <button
                onClick={() => setShowQuestionGrid(false)}
                className="text-app-fg/40 hover:text-app-fg font-black text-sm"
              >
                Close ✕
              </button>
            </div>

            {/* Grid Scoped to Active Module */}
            <div className="grid grid-cols-5 sm:grid-cols-6 gap-2.5 max-h-72 overflow-y-auto p-1">
              {(isModuleBased ? questions.slice(activeModule.startIndex, activeModule.endIndex) : questions).map((q, localIdx) => {
                const globalIdx = isModuleBased ? activeModule.startIndex + localIdx : localIdx;
                const s = questionStates[globalIdx];
                const isCurrent = globalIdx === currentIndex;
                const isAnswered = Boolean(s?.userAnswer);
                const isFlagged = Boolean(s?.isMarkedForReview);

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      play('tap');
                      setCurrentIndex(globalIdx);
                      setShowQuestionGrid(false);
                    }}
                    className={clsx(
                      "h-12 rounded-xl border-2 font-black text-xs flex flex-col items-center justify-center relative transition-all",
                      isCurrent
                        ? "border-blue-500 bg-blue-500/20 text-blue-400 scale-105"
                        : isAnswered
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                        : "border-border-subtle bg-panel text-app-fg/70 hover:border-app-fg/40"
                    )}
                  >
                    <span>{localIdx + 1}</span>
                    {isFlagged && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-1.5 right-1.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between text-[11px] font-bold text-app-fg/50 pt-2 border-t border-border-subtle">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-500/40 border border-blue-500" /> Current
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500/40 border border-emerald-500" /> Answered
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Flagged
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ─── Module Review & Transition Modal ───────────────────────── */}
      {showModuleReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-panel-solid border-2 border-blue-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-blue-500/10 border-2 border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 size={32} />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-400">
                End of {activeModule.moduleTitle}
              </span>
              <h3 className="text-2xl font-black text-app-fg tracking-tight">
                Submit & Proceed?
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-app-fg/70 leading-relaxed">
                Once you submit this module, you cannot return to review or change any answers in <strong>{activeModule.sectionTitle} ({activeModule.moduleTitle})</strong>.
              </p>
            </div>

            {/* Module Answered Breakdown */}
            {(() => {
              const slice = questionStates.slice(activeModule.startIndex, activeModule.endIndex);
              const answered = slice.filter(s => Boolean(s.userAnswer)).length;
              const flagged = slice.filter(s => Boolean(s.isMarkedForReview)).length;
              const unanswered = slice.length - answered;

              return (
                <div className="grid grid-cols-3 gap-2.5 p-4 rounded-2xl bg-panel border border-border-subtle">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">Answered</span>
                    <span className="text-xl font-black text-emerald-400">{answered}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">Flagged</span>
                    <span className="text-xl font-black text-amber-400">{flagged}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 block">Unanswered</span>
                    <span className="text-xl font-black text-rose-400">{unanswered}</span>
                  </div>
                </div>
              );
            })()}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  play('tap');
                  setShowModuleReviewModal(false);
                }}
                className="flex-1 px-5 py-3 rounded-2xl bg-panel hover:bg-white/10 border border-border-subtle text-xs font-black text-app-fg transition-all"
              >
                <span>Back to Review Questions</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmAdvanceModule}
                className="flex-1 btn-duo btn-duo-green py-3 text-xs font-black shadow-none"
              >
                <span>Confirm & Submit Module →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Exit Test Confirmation Modal ───────────────────────────── */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-panel-solid border-2 border-rose-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border-2 border-rose-500/30 text-rose-500 flex items-center justify-center mx-auto shadow-lg">
              <AlertTriangle size={32} />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-400">
                Active Test Session
              </span>
              <h3 className="text-2xl font-black text-app-fg tracking-tight">
                Leave Test in Progress?
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-app-fg/70 leading-relaxed">
                You have answered <strong className="text-app-fg">{questionStates.filter(s => s.userAnswer).length} of {questions.length}</strong> questions. If you exit now, your active session will end and unsubmitted answers will not be recorded.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  play('tap');
                  setShowExitConfirm(false);
                }}
                className="flex-1 btn-duo btn-duo-blue py-3 text-xs font-black shadow-none"
              >
                <span>Stay & Continue Test</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  play('tap');
                  if (typeof window !== 'undefined') {
                    sessionStorage.removeItem('cs_sat_test_in_progress');
                  }
                  setShowExitConfirm(false);
                  navigate('/sat');
                }}
                className="px-5 py-3 rounded-2xl bg-panel hover:bg-rose-500/15 border border-border-subtle hover:border-rose-500/40 text-xs font-bold text-rose-500 dark:text-rose-400 transition-all"
              >
                <span>Exit Test</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
