import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

export interface SettingsState {
  soundEnabled: boolean;
  animationsEnabled: boolean;
  dailyGoalXp: number;
  language: 'en' | 'bn';
  currentCourse: 'python' | 'cpp';
  theme: 'light' | 'dark';
  hasSeenTutorial: boolean;
  setLanguage: (lang: 'en' | 'bn') => void;
  setCourse: (course: 'python' | 'cpp') => void;
  toggleSound: () => void;
  toggleTheme: () => void;
  setDailyGoal: (xp: number) => void;
  setHasSeenTutorial: (seen: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  
  // Supabase Actions
  syncSettings: () => Promise<void>;
  loadSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      soundEnabled: false,
      animationsEnabled: true,
      dailyGoalXp: 50,
      language: 'bn',
      currentCourse: 'python',
      theme: 'light',
      hasSeenTutorial: false,

      setCourse: (currentCourse) => {
        set({ currentCourse });
        get().syncSettings();
      },
      setHasSeenTutorial: (hasSeenTutorial) => {
        set({ hasSeenTutorial });
        get().syncSettings();
      },
      toggleSound: () => {
        set((s) => ({ soundEnabled: !s.soundEnabled }));
        get().syncSettings();
      },
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        get().syncSettings();
      },
      setDailyGoal: (dailyGoalXp) => {
        set({ dailyGoalXp });
        get().syncSettings();
      },
      setLanguage: (language) => {
        set({ language });
        get().syncSettings();
      },
      setTheme: (theme) => {
        set({ theme });
        get().syncSettings();
      },

      syncSettings: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        const state = get();
        await supabase.from('profiles').update({
          language: state.language,
          current_course: state.currentCourse,
          theme: state.theme,
          daily_goal_xp: state.dailyGoalXp,
          sound_enabled: state.soundEnabled,
          animations_enabled: state.animationsEnabled,
          has_seen_tutorial: state.hasSeenTutorial,
        }).eq('id', session.user.id);
      },

      loadSettings: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        const { data: profile } = await supabase
          .from('profiles')
          .select('language, current_course, theme, daily_goal_xp, sound_enabled, animations_enabled, has_seen_tutorial')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          set({
            language: (profile.language as 'en' | 'bn') || 'bn',
            currentCourse: (profile.current_course as 'python' | 'cpp') || 'python',
            theme: (profile.theme as 'light' | 'dark') || 'light',
            dailyGoalXp: profile.daily_goal_xp || 50,
            soundEnabled: profile.sound_enabled ?? false,
            animationsEnabled: profile.animations_enabled ?? true,
            hasSeenTutorial: profile.has_seen_tutorial ?? false,
          });
        }
      }
    }),
    { name: 'py-cholosikhi-settings' }
  )
);
