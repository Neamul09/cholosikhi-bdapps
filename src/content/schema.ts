// TypeScript schema for all course content — Bangla-only
export type ExerciseType = 
  | 'mcq' 
  | 'fill_blank' 
  | 'output_predict' 
  | 'bug_hunt' 
  | 'code_arrange'
  | 'mini_challenge';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type LocalizedString = string | { en: string; bn: string };

export interface CodeExample {
  code: string;
  language: string;  // 'cpp', 'python', etc.
  output?: string;
  explanation: LocalizedString;
}

export interface MCQExercise {
  type: 'mcq';
  id: string;
  question: LocalizedString;
  code?: string;
  options: LocalizedString[];
  correctIndex: number;
  explanation: LocalizedString;
  xpReward: number;
}

export interface FillBlankExercise {
  type: 'fill_blank';
  id: string;
  question: LocalizedString;
  codeTemplate: string;  // use ___ for blanks
  blanks: string[];      // correct answers
  explanation: LocalizedString;
  xpReward: number;
}

export interface OutputPredictExercise {
  type: 'output_predict';
  id: string;
  question: LocalizedString;
  code: string;
  options: LocalizedString[];
  correctIndex: number;
  explanation: LocalizedString;
  xpReward: number;
}

export interface BugHuntExercise {
  type: 'bug_hunt';
  id: string;
  question: LocalizedString;
  code: string;
  buggyLine: number;
  explanation: LocalizedString;
  xpReward: number;
}

export interface CodeArrangeExercise {
  type: 'code_arrange';
  id: string;
  question: LocalizedString;
  blocks: string[];       // shuffled
  correctOrder: number[]; // indices into blocks[]
  explanation: LocalizedString;
  xpReward: number;
}

export interface MiniChallengeExercise {
  type: 'mini_challenge';
  id: string;
  question: LocalizedString;
  starterCode: string;
  testCases: Array<{ input: string; expected: string }>;
  xpReward: number;
}

export type Exercise = 
  | MCQExercise 
  | FillBlankExercise 
  | OutputPredictExercise 
  | BugHuntExercise 
  | CodeArrangeExercise 
  | MiniChallengeExercise;

export interface Lesson {
  id: string;
  sectionId: string;
  order: number;
  title: LocalizedString;
  description: LocalizedString;
  theory: Array<{
    heading: LocalizedString;
    body: LocalizedString;
    code?: CodeExample;
  }>;
  exercises: Exercise[];
  xpReward: number;
  estimatedMinutes: number;
  difficulty: DifficultyLevel;
  isProject?: boolean;
}

export interface Section {
  id: string;
  courseId: string;
  order: number;
  title: LocalizedString;
  description: LocalizedString;
  icon: string;
  color: string;
  lessonIds: string[];
  checkpointTest?: CheckpointTest;
  isDSA?: boolean;
  vizType?: 'sorting' | 'tree' | 'graph' | 'array' | 'stack_queue' | 'pointer';
}

export interface CheckpointTest {
  id: string;
  sectionId: string;
  title: string;
  questions: Exercise[];
  timeLimitSeconds: number;
  passingScore: number; // percentage
  xpReward: number;
  gemsReward: number;
}

export interface Course {
  id: string;
  name: string;
  nameBn: string;
  icon: string;
  color: string;
  description: string;
  totalLessons: number;
  difficulty: DifficultyLevel;
  sections: Section[];
  available: boolean;
}

export interface DSAVisualizerConfig {
  type: 'sorting' | 'tree' | 'graph' | 'array' | 'stack_queue' | 'pointer' | 'bigo';
  title: string;
  description: string;
  algorithms?: string[];
}
