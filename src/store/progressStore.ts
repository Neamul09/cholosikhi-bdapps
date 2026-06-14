import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { useQuestStore } from './questStore';

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  score: number;
  completedAt?: number;
  timeSpentMinutes?: number;
}

export interface TestResult {
  testId: string;
  score: number;
  stars: number;
  completedAt: number;
}

export interface ProgressState {
  lessonProgress: Record<string, LessonProgress>;
  testResults: Record<string, TestResult>;
  currentCourse: string;
  currentSection: string;
  currentLesson: string;

  setLessonComplete: (lessonId: string, score: number, timeMinutes: number, courseId: string) => Promise<void>;
  setTestResult: (testId: string, score: number, stars: number) => void;
  isLessonCompleted: (lessonId: string) => boolean;
  getLessonScore: (lessonId: string) => number;
  setCurrentLesson: (courseId: string, sectionId: string, lessonId: string) => void;
  getSectionProgress: (lessonIds: string[]) => number;
  
  // Supabase Actions
  loadFromSupabase: () => Promise<void>;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      lessonProgress: {},
      testResults: {},
      currentCourse: 'python',
      currentSection: 'chatterbox-bot',
      currentLesson: 'hello-python',

      setLessonComplete: async (lessonId, score, timeMinutes, courseId) => {
        const isAlreadyCompleted = !!get().lessonProgress[lessonId]?.completed;

        set((state) => ({
          lessonProgress: {
            ...state.lessonProgress,
            [lessonId]: {
              lessonId,
              completed: true,
              score,
              completedAt: Date.now(),
              timeSpentMinutes: timeMinutes,
            },
          },
        }));

        if (!isAlreadyCompleted) {
          useQuestStore.getState().updateQuestProgress('lessons', 1);
          if (score === 100) {
            useQuestStore.getState().updateQuestProgress('perfect', 1);
          }
        }

        // Sync to Supabase
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const payload = {
            user_id: session.user.id,
            lesson_id: lessonId,
            course_id: courseId,
            score,
            completed: true,
            time_spent_minutes: timeMinutes,
            completed_at: new Date().toISOString()
          };

          const { data: existing } = await supabase
            .from('lesson_progress')
            .select('id')
            .eq('user_id', session.user.id)
            .eq('lesson_id', lessonId)
            .maybeSingle();

          if (existing) {
            await supabase.from('lesson_progress').update(payload).eq('id', existing.id);
          } else {
            await supabase.from('lesson_progress').insert(payload);
          }
        }
      },

      setTestResult: async (testId, score, stars) => {
        set((state) => ({
          testResults: {
            ...state.testResults,
            [testId]: { testId, score, stars, completedAt: Date.now() },
          },
        }));

        // Sync to Supabase
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await supabase.from('test_results').upsert({
            user_id: session.user.id,
            test_id: testId,
            score,
            stars,
            completed_at: new Date().toISOString()
          }, { onConflict: 'user_id, test_id' });
        }
      },

      isLessonCompleted: (lessonId) =>
        !!get().lessonProgress[lessonId]?.completed,

      getLessonScore: (lessonId) =>
        get().lessonProgress[lessonId]?.score ?? 0,

      setCurrentLesson: (courseId, sectionId, lessonId) =>
        set({ currentCourse: courseId, currentSection: sectionId, currentLesson: lessonId }),

      getSectionProgress: (lessonIds) => {
        const state = get();
        if (lessonIds.length === 0) return 0;
        const completed = lessonIds.filter((id) => state.lessonProgress[id]?.completed).length;
        return Math.round((completed / lessonIds.length) * 100);
      },

      loadFromSupabase: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        // Load lesson progress
        const { data: progress } = await supabase
          .from('lesson_progress')
          .select('*')
          .eq('user_id', session.user.id);

        if (progress) {
          const progressMap: Record<string, LessonProgress> = {};
          progress.forEach(p => {
            progressMap[p.lesson_id] = {
              lessonId: p.lesson_id,
              completed: p.completed,
              score: p.score,
              completedAt: new Date(p.completed_at).getTime(),
              timeSpentMinutes: p.time_spent_minutes
            };
          });
          set({ lessonProgress: progressMap });
        }

        // Load test results
        const { data: tests } = await supabase
          .from('test_results')
          .select('*')
          .eq('user_id', session.user.id);

        if (tests) {
          const testMap: Record<string, TestResult> = {};
          tests.forEach(t => {
            testMap[t.test_id] = {
              testId: t.test_id,
              score: t.score,
              stars: t.stars,
              completedAt: new Date(t.completed_at).getTime()
            };
          });
          set({ testResults: testMap });
        }
      }
    }),
    { name: 'py-cholosikhi-progress' }
  )
);
