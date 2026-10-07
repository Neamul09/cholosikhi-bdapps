export type SatTestSection = 'math' | 'reading_writing';

export type SatDifficulty = 'Easy' | 'Medium' | 'Hard';

export type SatQuestionType = 'mcq' | 'spr';

export interface AnswerOption {
  id: string; // 'A' | 'B' | 'C' | 'D'
  content: string; // HTML or text
  key?: string;
}

export interface SatQuestion {
  id: string;
  externalId?: string;
  test: SatTestSection;
  domain: string;
  domainCode: string;
  skill: string;
  skillCode?: string;
  microType: string;
  difficulty: SatDifficulty;
  scoreBand?: number;
  type: SatQuestionType;
  stimulus?: string; // Passage / context
  stem: string;      // Main question text / equation
  options?: AnswerOption[];
  correctAnswers: string[];
  rationale?: string;
  isHardest?: boolean;
  vocabRelation?: {
    matchType: 'direct_option' | 'inflection_option' | 'passage_direct' | 'passage_inflection' | 'synonym_option' | 'passage_general' | 'wic_archetype';
    matchedTerm?: string;
    synonym?: string;
  };
}

export interface BestResource {
  title: string;
  type: 'video' | 'article' | 'cheat_sheet' | 'desmos_guide';
  url: string;
  provider: string; // e.g. 'Khan Academy', 'Scalar Learning', 'PrepPros', 'Erica Meltzer'
  durationOrLength?: string;
}

export interface MicroTypeInfo {
  id: string;
  title: string;
  section: SatTestSection;
  domain: string;
  domainCode: string;
  skill: string;
  description: string;
  theorySummary: string;
  formulasOrRules: string[];
  commonTraps: string[];
  desmosTip?: string;
  bestResources: BestResource[];
  hardestQuestionId?: string;
}

export interface MicroTypeMastery {
  microTypeId: string;
  attempted: number;
  correct: number;
  masteryPercentage: number; // 0 - 100
  lastPracticed?: string;
  status: 'novice' | 'practicing' | 'proficient' | 'mastered';
}

export interface MistakeRecord {
  id: string;
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  section: SatTestSection;
  domain: string;
  skill: string;
  microType: string;
  recordedAt: string;
  notes?: string;
  errorReason: 'careless_calc' | 'time_pressure' | 'misread_question' | 'concept_gap' | 'vocab_unknown' | 'other';
  resolved: boolean;
  timesRetried: number;
  srsStage?: number;
  nextReviewDate?: string;
  lastReviewedAt?: string;
}

export interface QuizFilterOptions {
  section?: SatTestSection | 'all';
  domain?: string;
  skill?: string;
  skills?: string[];
  microType?: string;
  difficulty?: SatDifficulty | 'all';
  onlyHardest?: boolean;
  onlyUnattempted?: boolean;
  onlyMistakes?: boolean;
  limit?: number;
  timeLimitMinutes?: number; // 0 for untimed
}

export interface QuizQuestionState {
  question: SatQuestion;
  userAnswer?: string;
  isCorrect?: boolean;
  timeSpentSeconds: number;
  isMarkedForReview: boolean;
  eliminatedOptions: string[]; // ['A', 'C']
  scratchNotes?: string;
}

export interface QuizSessionResult {
  id: string;
  title: string;
  quizType: 'custom_drill' | 'hardest_drill' | 'practice_test' | 'mistake_review';
  section: SatTestSection | 'full';
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  accuracy: number; // 0 - 100
  timeSpentSeconds: number;
  xpEarned: number;
  scaledScore?: number;
  predictedScoreImpact: number;
  completedAt: string;
  questionStates: QuizQuestionState[];
}

export interface RoutineTask {
  id: string;
  title: string;
  description: string;
  microTypeId?: string;
  targetCount: number;
  completedCount: number;
  isCompleted: boolean;
  xpReward: number;
  category: 'drill' | 'vocab' | 'mistake_review' | 'practice_test' | 'theory';
}

export interface RoutinePlan {
  examDate: string; // YYYY-MM-DD
  targetScore: number; // e.g. 1520
  currentPredictedScore: number;
  daysRemaining: number;
  dailyTasks: RoutineTask[];
  weeklyPacingGoalHours: number;
}

export interface SatScorePrediction {
  compositeScore: number; // 400 - 1600
  mathScore: number;      // 200 - 800
  rwScore: number;        // 200 - 800
  compositeRange: [number, number];
  mathRange: [number, number];
  rwRange: [number, number];
  confidence: 'Low' | 'Medium' | 'High';
  totalQuestionsEvaluated: number;
  percentile: number;
  totalScore?: number;
}

export interface SatVocabItem {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  definition: string;
  bengaliMeaning: string;
  contextSentence: string;
  difficulty?: 'Medium' | 'Hard';
  synonyms?: string[];
  frequencyRating?: 1 | 2 | 3 | 4 | 5;
  masteryStatus?: 'learning' | 'familiar' | 'mastered';
  lesson?: string;
  pairedQuestionId?: string;
}

export interface SatLeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  avatarUrl?: string;
  xp: number;
  solvedCount: number;
  accuracy: number;
  predictedScore: number;
  league: 'wood' | 'bronze' | 'silver' | 'gold' | 'sapphire' | 'ruby' | 'diamond';
  rank: number;
  isCurrentUser?: boolean;
}

export interface QuestionAttemptLog {
  section: SatTestSection;
  difficulty: SatDifficulty;
  isCorrect: boolean;
  scoreBand?: number;
  questionId?: string;
  microType?: string;
}

export interface SatUserState {
  xp: number;
  streak: number;
  lastActiveDate: string;
  attempts: QuestionAttemptLog[];
  mastery: Record<string, MicroTypeMastery>;
  mistakes: MistakeRecord[];
  quizzes: QuizSessionResult[];
  routine: RoutinePlan | null;
  vocabMastery: Record<string, 'learning' | 'familiar' | 'mastered'>;
}
