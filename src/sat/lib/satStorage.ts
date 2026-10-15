import type {
  QuizSessionResult,
  RoutinePlan,
  RoutineTask,
  SatScorePrediction,
  SatTestSection,
  SatUserState,
  QuestionAttemptLog,
  MistakeRecord
} from '../types';
import { calculatePredictedScore } from './scorePredictor';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { MICRO_TYPES } from '../data/microtypes';
import { getMicroTypeStats } from '../data/questionsRepo';

const KEYS = {
  ATTEMPTS: 'cs_sat_attempts_v1',
  MASTERY: 'cs_sat_mastery_v1',
  MISTAKES: 'cs_sat_mistakes_v1',
  QUIZ_HISTORY: 'cs_sat_quizzes_v1',
  ROUTINE: 'cs_sat_routine_v1',
  STREAK: 'cs_sat_streak_v1',
  LAST_ACTIVE_DATE: 'cs_sat_last_active_date_v1',
  XP: 'cs_sat_xp_v1',
  VOCAB: 'cs_sat_vocab_v1',
  QUESTION_STATUS: 'cs_sat_question_status_v1'
};

const DEFAULT_STATE: SatUserState = {
  xp: 0,
  streak: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
  attempts: [],
  mastery: {},
  mistakes: [],
  quizzes: [],
  routine: {
    examDate: '2026-11-07',
    targetScore: 1520,
    currentPredictedScore: 1000,
    daysRemaining: 30,
    dailyTasks: [
      {
        id: 't-1',
        title: 'Master Linear Equations (Infinite Solutions)',
        description: 'Complete 5 questions in alg-linear-one-solutions-count',
        microTypeId: 'alg-linear-one-solutions-count',
        targetCount: 5,
        completedCount: 0,
        isCompleted: false,
        xpReward: 50,
        category: 'drill'
      },
      {
        id: 't-2',
        title: 'Learn 10 High-Frequency SAT Vocab Words',
        description: 'Review flashcards in the Vocab Vault',
        targetCount: 10,
        completedCount: 0,
        isCompleted: false,
        xpReward: 30,
        category: 'vocab'
      },
      {
        id: 't-3',
        title: 'Retry 2 Wrong Questions from Mistake Bank',
        description: 'Review and clear your error log',
        targetCount: 2,
        completedCount: 0,
        isCompleted: false,
        xpReward: 40,
        category: 'mistake_review'
      }
    ],
    weeklyPacingGoalHours: 6
  },
  vocabMastery: {}
};

/**
 * Update and maintain the user's SAT practice daily streak
 */
export function updateSatStreak(state: SatUserState): number {
  const todayStr = new Date().toISOString().split('T')[0];
  const lastActive = state.lastActiveDate;

  if (lastActive === todayStr && state.streak > 0) {
    return state.streak;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let newStreak = state.streak || 0;
  if (lastActive === yesterdayStr) {
    newStreak += 1;
  } else if (!lastActive || lastActive < yesterdayStr || newStreak === 0) {
    newStreak = 1;
  }

  state.streak = newStreak;
  state.lastActiveDate = todayStr;

  if (typeof window !== 'undefined') {
    localStorage.setItem(KEYS.STREAK, String(newStreak));
    localStorage.setItem(KEYS.LAST_ACTIVE_DATE, todayStr);
    window.dispatchEvent(new CustomEvent('cs_sat_streak_updated', { detail: { streak: newStreak } }));
    window.dispatchEvent(new CustomEvent('sat_state_updated'));
  }

  return newStreak;
}

/**
 * Wipe all cached SAT user state from localStorage and sessionStorage
 */
export function clearSatUserState(): void {
  if (typeof window === 'undefined') return;
  try {
    Object.values(KEYS).forEach(key => localStorage.removeItem(key));
    localStorage.removeItem('cs_sat_user_name');
    localStorage.removeItem('cs_sat_formula_mastery');
    localStorage.removeItem('cs_sat_formula_answers_v2');
    localStorage.removeItem('cs_sat_formula_answers');
    localStorage.removeItem('cs_sat_nini_toast_ts');
    sessionStorage.removeItem('cs_sat_test_in_progress');

    // Clean up any remaining cs_sat_ keys except sidebar preference
    const toRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('cs_sat_') && k !== 'cs_sat_sidebar_collapsed') {
        toRemove.push(k);
      }
    }
    toRemove.forEach(k => localStorage.removeItem(k));
  } catch (e) {
    console.debug('[satStorage] clearSatUserState error:', e);
  }
}

/**
 * Completely resets SAT progress across both local storage and cloud database (Supabase).
 * Deletes question attempts, mastery logs, mistake bank, test results, vocab progress, and routines.
 */
export async function resetSatProgress(): Promise<void> {
  // 1. Wipe local cache immediately
  clearSatUserState();

  // 2. Wipe cloud database if authenticated
  if (isSupabaseConfigured) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Run cloud deletes in parallel across all SAT tables
        await Promise.allSettled([
          supabase.from('sat_user_progress').delete().eq('user_id', user.id),
          supabase.from('sat_wrong_answers').delete().eq('user_id', user.id),
          supabase.from('sat_quiz_attempts').delete().eq('user_id', user.id),
          supabase.from('sat_vocab_progress').delete().eq('user_id', user.id),
          supabase.from('sat_user_routines').delete().eq('user_id', user.id),
        ]);

        // Defensive zero-out for sat_user_progress in case RLS blocked delete on this table
        try {
          await supabase.from('sat_user_progress').update({
            attempted: 0,
            correct: 0,
            mastery_percentage: 0,
            status: 'novice',
            last_practiced_at: new Date().toISOString()
          }).eq('user_id', user.id);
        } catch {
          // ignore
        }

        // Defensive reset for sat_user_routines: ensure routine row has empty daily_tasks and no stale attempts/XP
        try {
          await supabase.from('sat_user_routines').upsert({
            user_id: user.id,
            exam_date: '2026-11-07',
            target_score: 1520,
            weekly_hours: 6,
            daily_tasks: [],
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' });
        } catch {
          // ignore
        }
      }
    } catch (err) {
      console.error('[satStorage] Error resetting SAT progress in cloud:', err);
    }
  }

  // 3. Dispatch events to notify active listeners
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cs_sat_streak_updated', { detail: { streak: 0 } }));
    window.dispatchEvent(new CustomEvent('sat_state_updated'));
    window.dispatchEvent(new Event('storage'));
  }
}

/**
 * Load SAT user state from localStorage with fallback defaults
 */
export function loadSatUserState(): SatUserState {
  if (typeof window === 'undefined') return DEFAULT_STATE;

  try {
    const rawAttempts = localStorage.getItem(KEYS.ATTEMPTS);
    const rawMastery = localStorage.getItem(KEYS.MASTERY);
    const rawMistakes = localStorage.getItem(KEYS.MISTAKES);
    const rawQuizzes = localStorage.getItem(KEYS.QUIZ_HISTORY);
    const rawRoutine = localStorage.getItem(KEYS.ROUTINE);
    const rawXp = localStorage.getItem(KEYS.XP);
    const rawStreak = localStorage.getItem(KEYS.STREAK);
    const rawLastActive = localStorage.getItem(KEYS.LAST_ACTIVE_DATE);
    const rawVocab = localStorage.getItem(KEYS.VOCAB);

    const attempts: QuestionAttemptLog[] = rawAttempts ? JSON.parse(rawAttempts) : [];
    const mastery = rawMastery ? JSON.parse(rawMastery) : {};
    const mistakes = rawMistakes ? JSON.parse(rawMistakes) : [];
    const quizzes = rawQuizzes ? JSON.parse(rawQuizzes) : [];
    const routine = rawRoutine ? JSON.parse(rawRoutine) : DEFAULT_STATE.routine;
    const xp = rawXp !== null ? Number(rawXp) : 0;
    let streak = rawStreak !== null ? Number(rawStreak) : 0;
    const vocabMastery = rawVocab ? JSON.parse(rawVocab) : {};

    const todayStr = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let lastActiveDate = rawLastActive || (attempts.length > 0 ? todayStr : '');

    // Check if streak broke (missed yesterday and today)
    if (lastActiveDate && lastActiveDate < yesterdayStr && streak > 0) {
      streak = 0;
      localStorage.setItem(KEYS.STREAK, '0');
    }

    // Auto-heal: If user has practice attempts and streak was 0, calculate initial streak
    if (streak === 0 && attempts.length > 0) {
      streak = 1;
      lastActiveDate = todayStr;
      localStorage.setItem(KEYS.STREAK, '1');
      localStorage.setItem(KEYS.LAST_ACTIVE_DATE, todayStr);
    }

    return {
      xp,
      streak,
      lastActiveDate,
      attempts,
      mastery,
      mistakes,
      quizzes,
      routine,
      vocabMastery
    };
  } catch (e) {
    console.warn('[satStorage] Error reading localStorage:', e);
    return DEFAULT_STATE;
  }
}

/**
 * Record a question attempt, updating mastery, predicted score, mistakes, and XP
 */
export function recordQuestionAttempt(
  questionId: string,
  section: SatTestSection,
  domain: string,
  skill: string,
  microTypeId: string,
  difficulty: 'Easy' | 'Medium' | 'Hard',
  userAnswer: string,
  correctAnswer: string,
  isCorrect: boolean
): { xpEarned: number; newPredictedScore: SatScorePrediction } {
  const state = loadSatUserState();

  // 1. Record attempt for score prediction
  state.attempts.push({
    section,
    difficulty,
    isCorrect,
    questionId,
    microType: microTypeId
  });
  localStorage.setItem(KEYS.ATTEMPTS, JSON.stringify(state.attempts));

  // 2. Update Micro-Type Mastery
  const currentMastery = state.mastery[microTypeId] || {
    microTypeId,
    attempted: 0,
    correct: 0,
    masteryPercentage: 0,
    status: 'novice'
  };

  currentMastery.attempted++;
  if (isCorrect) currentMastery.correct++;
  const statsMap = getMicroTypeStats();
  const totalInType = statsMap[microTypeId]?.total || Math.max(1, currentMastery.attempted);
  currentMastery.masteryPercentage = Math.min(100, Math.round((currentMastery.correct / totalInType) * 100));
  currentMastery.lastPracticed = new Date().toISOString();

  // Status considers both coverage mastery and accuracy
  if (currentMastery.masteryPercentage >= 80 || (currentMastery.correct >= 5 && currentMastery.correct / currentMastery.attempted >= 0.85)) {
    currentMastery.status = 'mastered';
  } else if (currentMastery.masteryPercentage >= 40 || (currentMastery.correct >= 2 && currentMastery.correct / currentMastery.attempted >= 0.65)) {
    currentMastery.status = 'proficient';
  } else if (currentMastery.attempted >= 1) {
    currentMastery.status = 'practicing';
  }
  state.mastery[microTypeId] = currentMastery;
  localStorage.setItem(KEYS.MASTERY, JSON.stringify(state.mastery));

  // 3. Handle Mistake Bank with Spaced Repetition (SRS)
  const todayStr = new Date().toISOString().split('T')[0];

  if (!isCorrect) {
    const existingMistakeIndex = state.mistakes.findIndex(m => m.questionId === questionId);
    if (existingMistakeIndex >= 0) {
      const m = state.mistakes[existingMistakeIndex];
      m.timesRetried++;
      m.userAnswer = userAnswer;
      m.resolved = false;
      m.srsStage = 0; // Reset to Stage 0 on mistake
      m.nextReviewDate = todayStr;
      m.lastReviewedAt = new Date().toISOString();
    } else {
      state.mistakes.unshift({
        id: 'm-' + Date.now(),
        questionId,
        userAnswer,
        correctAnswer,
        section,
        domain,
        skill,
        microType: microTypeId,
        recordedAt: new Date().toISOString(),
        errorReason: 'concept_gap',
        resolved: false,
        timesRetried: 0,
        srsStage: 0,
        nextReviewDate: todayStr,
        lastReviewedAt: new Date().toISOString()
      });
    }
  } else {
    // If was previously mistaken and now answered correctly -> mark ALL matching mistake records resolved
    state.mistakes.forEach(m => {
      if (m.questionId === questionId && !m.resolved) {
        m.timesRetried++;
        m.lastReviewedAt = new Date().toISOString();
        m.resolved = true;
        m.srsStage = 4;
        m.nextReviewDate = undefined;
      }
    });
  }
  localStorage.setItem(KEYS.MISTAKES, JSON.stringify(state.mistakes));

  // 3b. Update touched question status history
  try {
    const rawStatus = localStorage.getItem(KEYS.QUESTION_STATUS);
    const statusMap = rawStatus ? JSON.parse(rawStatus) : {};
    const existing = statusMap[questionId];
    statusMap[questionId] = {
      status: isCorrect ? (existing?.status === 'mistake' ? 'resolved' : 'solved') : 'mistake',
      attemptsCount: (existing?.attemptsCount || 0) + 1,
      lastAttemptedAt: new Date().toISOString()
    };
    localStorage.setItem(KEYS.QUESTION_STATUS, JSON.stringify(statusMap));
  } catch {
    // ignore
  }

  // 4. Update XP & Practice Streak
  const xpEarned = isCorrect ? (difficulty === 'Hard' ? 25 : difficulty === 'Medium' ? 15 : 10) : 5;
  state.xp += xpEarned;
  localStorage.setItem(KEYS.XP, String(state.xp));
  updateSatStreak(state);

  // Broadcast state change immediately so all cards and counts re-render synchronously
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('sat_state_updated'));
  }

  // 5. Sync to Supabase in background if authenticated
  syncToSupabase(state);

  const newPredictedScore = calculatePredictedScore(state.attempts);
  return { xpEarned, newPredictedScore };
}

/**
 * Convenient wrapper to record an attempt with structured parameters
 */
export function recordSatAttempt(params: {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  timeSpentSeconds?: number;
  section: SatTestSection;
  microType: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}): { xpEarned: number; newPredictedScore: SatScorePrediction } {
  return recordQuestionAttempt(
    params.questionId,
    params.section,
    '',
    '',
    params.microType,
    params.difficulty,
    params.selectedAnswer,
    '',
    params.isCorrect
  );
}

export interface QuestionStatusInfo {
  touched: boolean;
  status?: 'solved' | 'mistake' | 'resolved';
  attemptsCount?: number;
  lastAttemptedAt?: string;
}

/**
 * Get touched / mastery status for a single question
 */
export function getQuestionStatus(questionId: string): QuestionStatusInfo {
  if (typeof window === 'undefined') return { touched: false };

  try {
    const raw = localStorage.getItem(KEYS.QUESTION_STATUS);
    if (raw) {
      const map = JSON.parse(raw);
      if (map[questionId]) {
        return {
          touched: true,
          status: map[questionId].status,
          attemptsCount: map[questionId].attemptsCount || 1,
          lastAttemptedAt: map[questionId].lastAttemptedAt
        };
      }
    }

    // Fallback: check mistakes in userState
    const state = loadSatUserState();
    const mistake = state.mistakes.find(m => m.questionId === questionId);
    if (mistake) {
      return {
        touched: true,
        status: mistake.resolved ? 'resolved' : 'mistake',
        attemptsCount: (mistake.timesRetried || 0) + 1,
        lastAttemptedAt: mistake.recordedAt
      };
    }

    // Check past quizzes
    for (const q of state.quizzes) {
      const match = q.questionStates?.find(qs => qs.question.id === questionId);
      if (match) {
        return {
          touched: true,
          status: match.isCorrect ? 'solved' : 'mistake',
          attemptsCount: 1
        };
      }
    }
  } catch {
    // ignore
  }

  return { touched: false };
}

/**
 * Compute the next review date based on SuperMemo/Leitner intervals:
 * Stage 1: +1 day
 * Stage 2: +3 days
 * Stage 3: +7 days
 * Stage 4: Mastered (retained)
 */
export function computeSrsNextDate(stage: number): string {
  const d = new Date();
  const days = stage === 1 ? 1 : stage === 2 ? 3 : stage === 3 ? 7 : 0;
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

/**
 * Get all mistake records that are due for review today or overdue
 */
export function getDueMistakes(): MistakeRecord[] {
  const state = loadSatUserState();
  const today = new Date().toISOString().split('T')[0];
  return state.mistakes.filter(m => !m.resolved && (!m.nextReviewDate || m.nextReviewDate <= today));
}

/**
 * Get Spaced Repetition stats breakdown for the user's mistake bank
 */
export function getSrsMistakeStats(): { dueToday: number; upcoming: number; mastered: number; total: number } {
  const state = loadSatUserState();
  const today = new Date().toISOString().split('T')[0];
  let dueToday = 0;
  let upcoming = 0;
  let mastered = 0;

  for (const m of state.mistakes) {
    if (m.resolved || (m.srsStage !== undefined && m.srsStage >= 4)) {
      mastered++;
    } else if (!m.nextReviewDate || m.nextReviewDate <= today) {
      dueToday++;
    } else {
      upcoming++;
    }
  }

  return { dueToday, upcoming, mastered, total: state.mistakes.length };
}

/**
 * Save completed quiz session
 */
export function recordQuizSession(result: QuizSessionResult) {
  const state = loadSatUserState();
  state.quizzes.unshift(result);
  state.xp += result.xpEarned;
  localStorage.setItem(KEYS.QUIZ_HISTORY, JSON.stringify(state.quizzes));
  localStorage.setItem(KEYS.XP, String(state.xp));
  updateSatStreak(state);

  // Also sync question statuses from quiz
  try {
    const rawStatus = localStorage.getItem(KEYS.QUESTION_STATUS);
    const statusMap = rawStatus ? JSON.parse(rawStatus) : {};
    let mistakesUpdated = false;
    for (const qs of result.questionStates) {
      if (qs.userAnswer) {
        const existing = statusMap[qs.question.id];
        statusMap[qs.question.id] = {
          status: qs.isCorrect ? (existing?.status === 'mistake' ? 'resolved' : 'solved') : 'mistake',
          attemptsCount: (existing?.attemptsCount || 0) + 1,
          lastAttemptedAt: new Date().toISOString()
        };

        if (qs.isCorrect) {
          const m = state.mistakes.find(item => item.questionId === qs.question.id && !item.resolved);
          if (m) {
            m.resolved = true;
            m.srsStage = 4;
            m.timesRetried++;
            m.lastReviewedAt = new Date().toISOString();
            m.nextReviewDate = undefined;
            mistakesUpdated = true;
          }
        }
      }
    }
    localStorage.setItem(KEYS.QUESTION_STATUS, JSON.stringify(statusMap));
    if (mistakesUpdated) {
      localStorage.setItem(KEYS.MISTAKES, JSON.stringify(state.mistakes));
    }
  } catch {
    // ignore
  }

  syncToSupabase(state);
  syncQuizAttemptToCloud(result);
}

/**
 * Save user routine plan
 */
export function saveRoutinePlan(plan: RoutinePlan) {
  localStorage.setItem(KEYS.ROUTINE, JSON.stringify(plan));
  syncRoutineToCloud(plan);
}

/**
 * Update vocab mastery status
 */
export function updateVocabMastery(wordId: string, status: 'learning' | 'familiar' | 'mastered') {
  const state = loadSatUserState();
  state.vocabMastery[wordId] = status;
  localStorage.setItem(KEYS.VOCAB, JSON.stringify(state.vocabMastery));
  updateSatStreak(state);
  syncVocabToCloud(wordId, status);
}

/**
 * Background sync to Supabase if client is configured and user logged in
 */
export async function syncToSupabase(state: SatUserState) {
  if (!isSupabaseConfigured) return;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const currentUserName = user.user_metadata?.full_name || 
      (typeof window !== 'undefined' ? (localStorage.getItem('cs_sat_user_name') || localStorage.getItem('cholosikhi_user_name')) : '') || 
      user.email?.split('@')[0] || 
      'Digital SAT Scholar';

    // 1. Ensure basic profile row exists for identity without clobbering python progress
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id, name')
      .eq('id', user.id)
      .maybeSingle();

    if (!existingProfile) {
      await supabase.from('profiles').insert({
        id: user.id,
        name: currentUserName,
        avatar: 'hero',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    // 2. Sync routine and full attempts payload into sat_user_routines
    let rawStatusMap: Record<string, unknown> = {};
    try {
      const raw = localStorage.getItem(KEYS.QUESTION_STATUS);
      if (raw) rawStatusMap = JSON.parse(raw);
    } catch {
      // ignore
    }

    const cleanTasks = (state.routine?.dailyTasks || []).filter(
      (t: { id?: string }) => t && t.id !== '__sat_attempts_store__'
    );

    const dailyTasksPayload = [
      ...cleanTasks,
      {
        id: '__sat_attempts_store__',
        xp: state.xp,
        streak: state.streak,
        attempts: state.attempts,
        questionStatus: rawStatusMap,
        syncedAt: new Date().toISOString()
      }
    ];

    await supabase.from('sat_user_routines').upsert({
      user_id: user.id,
      exam_date: state.routine?.examDate || '2026-11-07',
      target_score: state.routine?.targetScore || 1520,
      weekly_hours: state.routine?.weeklyPacingGoalHours || 6,
      daily_tasks: dailyTasksPayload,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });

    // 3. Sync Micro-Type Mastery to sat_user_progress
    const masteryEntries = Object.values(state.mastery);
    if (masteryEntries.length > 0) {
      const records = masteryEntries.map(m => {
        const mtInfo = MICRO_TYPES.find(t => t.id === m.microTypeId);
        return {
          user_id: user.id,
          micro_type_id: m.microTypeId,
          section: mtInfo?.section || 'math',
          domain: mtInfo?.domain || 'Algebra',
          skill: mtInfo?.skill || '',
          attempted: m.attempted,
          correct: m.correct,
          mastery_percentage: m.masteryPercentage,
          status: m.status,
          last_practiced_at: m.lastPracticed || new Date().toISOString()
        };
      });
      await supabase.from('sat_user_progress').upsert(records, {
        onConflict: 'user_id,micro_type_id'
      });
    }

    // 4. Sync Mistake Bank to sat_wrong_answers
    if (state.mistakes && state.mistakes.length > 0) {
      const mistakeRecords = state.mistakes.slice(0, 60).map(m => ({
        user_id: user.id,
        question_id: m.questionId,
        section: m.section,
        domain: m.domain,
        skill: m.skill,
        micro_type_id: m.microType,
        user_answer: m.userAnswer || '',
        correct_answer: m.correctAnswer,
        error_reason: m.errorReason || 'concept_gap',
        resolved: Boolean(m.resolved),
        times_retried: m.timesRetried || 0,
        updated_at: new Date().toISOString()
      }));
      await supabase.from('sat_wrong_answers').upsert(mistakeRecords, {
        onConflict: 'user_id,question_id'
      });
    }
  } catch (err) {
    console.debug('[satStorage] syncToSupabase error:', err);
  }
}

/**
 * Sync individual quiz attempt to Supabase
 */
async function syncQuizAttemptToCloud(result: QuizSessionResult) {
  if (!isSupabaseConfigured) return;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('sat_quiz_attempts').insert({
      user_id: user.id,
      quiz_type: result.quizType || 'practice_test',
      section: result.section,
      total_questions: result.totalQuestions,
      correct_count: result.correctCount,
      incorrect_count: result.incorrectCount,
      accuracy: result.accuracy,
      time_spent_seconds: result.timeSpentSeconds,
      scaled_score: result.scaledScore ?? result.predictedScoreImpact ?? null,
      xp_earned: result.xpEarned,
      completed_at: result.completedAt
    });
  } catch (e) {
    console.debug('[satStorage] cloud quiz sync skipped:', e);
  }
}

/**
 * Sync routine to Supabase
 */
async function syncRoutineToCloud(plan: RoutinePlan) {
  if (!isSupabaseConfigured) return;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const state = loadSatUserState();
    await syncToSupabase({ ...state, routine: plan });
  } catch (e) {
    console.debug('[satStorage] cloud routine sync skipped:', e);
  }
}

/**
 * Sync vocab mastery to Supabase
 */
async function syncVocabToCloud(wordId: string, status: string) {
  if (!isSupabaseConfigured) return;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('sat_vocab_progress').upsert({
      user_id: user.id,
      word_id: wordId,
      mastery_status: status,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,word_id' });
  } catch (e) {
    console.debug('[satStorage] cloud vocab sync skipped:', e);
  }
}

/**
 * Fetch and merge cloud state for authenticated user on login / mount across all devices
 */
export async function loadSatUserStateFromCloud(): Promise<SatUserState | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const local = loadSatUserState();

    // 1. Fetch Profile for Name only (do not clobber SAT XP with Python total_xp)
    const { data: profile } = await supabase
      .from('profiles')
      .select('name, avatar_url')
      .eq('id', user.id)
      .maybeSingle();

    if (profile) {
      if (profile.name && typeof window !== 'undefined') {
        localStorage.setItem('cs_sat_user_name', profile.name);
        localStorage.setItem('cholosikhi_user_name', profile.name);
      }
    }

    // 2. Fetch routine and attempts payload
    const { data: routineData } = await supabase
      .from('sat_user_routines')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (routineData) {
      let tasks: RoutineTask[] = [];
      interface RoutineStorePayload {
        id?: string;
        xp?: number;
        streak?: number;
        attempts?: QuestionAttemptLog[];
        questionStatus?: Record<string, unknown>;
      }
      let cloudAttempts: QuestionAttemptLog[] | null = null;
      let cloudQuestionStatus: Record<string, unknown> | null = null;
      let cloudXp = 0;
      let cloudStreak = 0;

      if (Array.isArray(routineData.daily_tasks)) {
        const storeTask = (routineData.daily_tasks as RoutineStorePayload[]).find((t) => t && t.id === '__sat_attempts_store__');
        if (storeTask) {
          cloudAttempts = storeTask.attempts || [];
          cloudQuestionStatus = storeTask.questionStatus || {};
          if (typeof storeTask.xp === 'number') {
            cloudXp = storeTask.xp;
          }
          if (typeof storeTask.streak === 'number') {
            cloudStreak = storeTask.streak;
          }
          tasks = (routineData.daily_tasks as (RoutineStorePayload & RoutineTask)[]).filter((t) => t && t.id !== '__sat_attempts_store__');
        } else {
          tasks = routineData.daily_tasks as RoutineTask[];
        }
      } else if (routineData.daily_tasks && typeof routineData.daily_tasks === 'object') {
        const payload = routineData.daily_tasks as {
          tasks?: RoutineTask[];
          xp?: number;
          streak?: number;
          attempts?: QuestionAttemptLog[];
          questionStatus?: Record<string, unknown>;
        };
        tasks = payload.tasks || [];
        cloudAttempts = payload.attempts || [];
        cloudQuestionStatus = payload.questionStatus || {};
        if (typeof payload.xp === 'number') {
          cloudXp = payload.xp;
        }
        if (typeof payload.streak === 'number') {
          cloudStreak = payload.streak;
        }
      }

      // Cloud data strictly authoritative for authenticated users
      local.xp = typeof cloudXp === 'number' ? cloudXp : local.xp;
      localStorage.setItem(KEYS.XP, String(local.xp));

      const totalAttemptsCount = (cloudAttempts !== null ? cloudAttempts.length : local.attempts.length);
      if (cloudStreak > 0) {
        local.streak = cloudStreak;
      } else if (totalAttemptsCount === 0) {
        local.streak = 0;
      } else if (local.streak > 0) {
        // preserve current valid local streak
      } else {
        local.streak = 1;
      }
      localStorage.setItem(KEYS.STREAK, String(local.streak));

      local.routine = {
        examDate: routineData.exam_date,
        targetScore: routineData.target_score,
        currentPredictedScore: local.routine?.currentPredictedScore || 1000,
        daysRemaining: Math.max(1, Math.ceil((new Date(routineData.exam_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))),
        dailyTasks: tasks.length > 0 ? tasks : (DEFAULT_STATE.routine?.dailyTasks || []),
        weeklyPacingGoalHours: routineData.weekly_hours || 6
      };
      localStorage.setItem(KEYS.ROUTINE, JSON.stringify(local.routine));

      local.attempts = cloudAttempts !== null ? cloudAttempts : (local.attempts || []);
      localStorage.setItem(KEYS.ATTEMPTS, JSON.stringify(local.attempts));

      if (cloudQuestionStatus && typeof cloudQuestionStatus === 'object') {
        localStorage.setItem(KEYS.QUESTION_STATUS, JSON.stringify(cloudQuestionStatus));
      } else {
        localStorage.setItem(KEYS.QUESTION_STATUS, '{}');
      }
    } else {
      if (local.attempts.length > 0) {
        if (local.streak === 0) local.streak = 1;
        syncToSupabase(local);
      } else {
        local.xp = 0;
        local.streak = 0;
        local.attempts = [];
        localStorage.setItem(KEYS.XP, '0');
        localStorage.setItem(KEYS.STREAK, '0');
        localStorage.setItem(KEYS.ATTEMPTS, '[]');
        localStorage.setItem(KEYS.QUESTION_STATUS, '{}');
      }
    }

    // 3. Fetch Micro-Type Mastery from sat_user_progress
    const { data: progressData } = await supabase
      .from('sat_user_progress')
      .select('*')
      .eq('user_id', user.id);

    local.mastery = {};
    const validProgressData = (progressData || []).filter(p => p.attempted > 0);
    if (validProgressData.length > 0) {
      for (const p of validProgressData) {
        local.mastery[p.micro_type_id] = {
          microTypeId: p.micro_type_id,
          attempted: p.attempted,
          correct: p.correct,
          masteryPercentage: p.mastery_percentage,
          status: p.status,
          lastPracticed: p.last_practiced_at
        };
      }
    }
    localStorage.setItem(KEYS.MASTERY, JSON.stringify(local.mastery));

    // If attempts was empty and we have valid progress records, reconstruct attempts
    if (local.attempts.length === 0 && validProgressData.length > 0) {
      const reconstructedAttempts: QuestionAttemptLog[] = [];
      for (const p of validProgressData) {
        for (let i = 0; i < p.correct; i++) {
          reconstructedAttempts.push({
            section: p.section,
            difficulty: 'Medium',
            isCorrect: true,
            microType: p.micro_type_id
          });
        }
        const incorrect = Math.max(0, p.attempted - p.correct);
        for (let i = 0; i < incorrect; i++) {
          reconstructedAttempts.push({
            section: p.section,
            difficulty: 'Medium',
            isCorrect: false,
            microType: p.micro_type_id
          });
        }
      }
      if (reconstructedAttempts.length > 0) {
        local.attempts = reconstructedAttempts;
        localStorage.setItem(KEYS.ATTEMPTS, JSON.stringify(local.attempts));
      }
    }

    // Recalculate predicted score based on real attempts
    if (local.attempts.length > 0) {
      const pred = calculatePredictedScore(local.attempts);
      if (local.routine) {
        local.routine.currentPredictedScore = pred.compositeScore;
        localStorage.setItem(KEYS.ROUTINE, JSON.stringify(local.routine));
      }
    }

    // 4. Fetch mistake bank from sat_wrong_answers
    const { data: mistakesData } = await supabase
      .from('sat_wrong_answers')
      .select('*')
      .eq('user_id', user.id);

    // Build map of locally known mistake resolutions to avoid cloud race clobbering
    const locallyResolvedIds = new Set(
      local.mistakes.filter(m => m.resolved).map(m => m.questionId)
    );

    const fetchedMistakes = (mistakesData || []).map(m => {
      const isResolved = Boolean(m.resolved) || locallyResolvedIds.has(m.question_id);
      return {
        id: m.id,
        questionId: m.question_id,
        userAnswer: m.user_answer,
        correctAnswer: m.correct_answer,
        section: m.section as SatTestSection,
        domain: m.domain,
        skill: m.skill,
        microType: m.micro_type_id,
        recordedAt: m.created_at,
        errorReason: m.error_reason,
        resolved: isResolved,
        timesRetried: m.times_retried,
        srsStage: m.srs_stage ?? (isResolved ? 4 : 0),
        nextReviewDate: isResolved ? undefined : m.next_review_date,
        lastReviewedAt: m.last_reviewed_at
      };
    });

    // Deduplicate by questionId
    const mistakeMap = new Map<string, MistakeRecord>();
    for (const m of fetchedMistakes) {
      const existing = mistakeMap.get(m.questionId);
      if (!existing || (m.resolved && !existing.resolved)) {
        mistakeMap.set(m.questionId, m);
      }
    }
    for (const m of local.mistakes) {
      if (!mistakeMap.has(m.questionId)) {
        mistakeMap.set(m.questionId, m);
      } else if (m.resolved) {
        const item = mistakeMap.get(m.questionId)!;
        item.resolved = true;
        item.srsStage = 4;
      }
    }

    local.mistakes = Array.from(mistakeMap.values());
    localStorage.setItem(KEYS.MISTAKES, JSON.stringify(local.mistakes));

    // 5. Fetch vocab progress from sat_vocab_progress
    const { data: vocabData } = await supabase
      .from('sat_vocab_progress')
      .select('*')
      .eq('user_id', user.id);

    local.vocabMastery = {};
    if (vocabData && vocabData.length > 0) {
      for (const v of vocabData) {
        local.vocabMastery[v.word_id] = v.mastery_status;
      }
    }
    localStorage.setItem(KEYS.VOCAB, JSON.stringify(local.vocabMastery));

    // 6. Fetch past quizzes from sat_quiz_attempts
    const { data: quizData } = await supabase
      .from('sat_quiz_attempts')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(25);

    local.quizzes = (quizData || []).map(q => ({
      id: q.id || 'q-' + Date.now(),
      title: (q.quiz_type || 'practice_test').replace(/_/g, ' ').toUpperCase(),
      quizType: q.quiz_type,
      section: q.section,
      totalQuestions: q.total_questions,
      correctCount: q.correct_count,
      incorrectCount: q.incorrect_count,
      unansweredCount: 0,
      accuracy: q.accuracy,
      timeSpentSeconds: q.time_spent_seconds,
      scaledScore: q.scaled_score,
      predictedScoreImpact: 0,
      xpEarned: q.xp_earned,
      completedAt: q.completed_at,
      questionStates: []
    }));
    localStorage.setItem(KEYS.QUIZ_HISTORY, JSON.stringify(local.quizzes));

    // Notify all active tabs and components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('sat_state_updated'));
      window.dispatchEvent(new Event('storage'));
    }

    return local;
  } catch (err) {
    console.debug('[satStorage] Could not load from cloud:', err);
    return null;
  }
}

