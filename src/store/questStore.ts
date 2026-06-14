import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

export interface Quest {
  id: string;
  name: { en: string; bn: string };
  goal: number;
  progress: number;
  reward: number;
  completed: boolean;
  claimed: boolean;
  type: 'xp' | 'lessons' | 'perfect';
}

interface QuestState {
  quests: Quest[];
  lastUpdated: string; // ISO date
  initializeQuests: () => void;
  updateQuestProgress: (type: Quest['type'], amount: number) => void;
  claimReward: (questId: string) => Promise<void>;
  syncQuests: () => Promise<void>;
  loadQuests: () => Promise<void>;
}

const DAILY_QUEST_POOL: Omit<Quest, 'progress' | 'completed' | 'claimed'>[] = [
  { id: 'daily_xp_low', name: { en: 'Earn 50 XP', bn: '৫০ এক্সপি অর্জন করুন' }, goal: 50, reward: 20, type: 'xp' },
  { id: 'daily_xp_mid', name: { en: 'Earn 100 XP', bn: '১০০ এক্সপি অর্জন করুন' }, goal: 100, reward: 50, type: 'xp' },
  { id: 'daily_xp_high', name: { en: 'Earn 250 XP', bn: '২৫০ এক্সপি অর্জন করুন' }, goal: 250, reward: 150, type: 'xp' },
  { id: 'daily_lessons_1', name: { en: 'Complete 1 Lesson', bn: '১টি পাঠ সম্পন্ন করুন' }, goal: 1, reward: 40, type: 'lessons' },
  { id: 'daily_lessons_2', name: { en: 'Complete 2 Lessons', bn: '২টি পাঠ সম্পন্ন করুন' }, goal: 2, reward: 100, type: 'lessons' },
  { id: 'daily_lessons_3', name: { en: 'Complete 5 Lessons', bn: '৫টি পাঠ সম্পন্ন করুন' }, goal: 5, reward: 250, type: 'lessons' },
  { id: 'daily_perfect', name: { en: 'Get 1 Perfect Lesson', bn: '১টি নিখুঁত পাঠ সম্পন্ন করুন' }, goal: 1, reward: 150, type: 'perfect' },
];

export const useQuestStore = create<QuestState>()(
  persist(
    (set, get) => ({
      quests: [],
      lastUpdated: '',

      initializeQuests: () => {
        const today = new Date().toISOString().split('T')[0];
        if (get().lastUpdated !== today) {
          // Pick 3 random quests
          const shuffled = [...DAILY_QUEST_POOL].sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(0, 3);
          const newQuests = selected.map(q => ({ ...q, progress: 0, completed: false, claimed: false }));
          
          set({ quests: newQuests, lastUpdated: today });
          get().syncQuests();
        }
      },

      updateQuestProgress: (type, amount) => {
        const { quests } = get();
        const updatedQuests = quests.map(q => {
          if (q.type === type && !q.completed) {
            const newProgress = Math.min(q.goal, q.progress + amount);
            return { ...q, progress: newProgress, completed: newProgress >= q.goal };
          }
          return q;
        });
        set({ quests: updatedQuests });
        get().syncQuests();
      },

      claimReward: async (questId) => {
        const { quests } = get();
        const quest = quests.find(q => q.id === questId);
        
        if (quest && quest.completed && !quest.claimed) {
          // Add gems to userStore
          const { useUserStore } = await import('./userStore');
          useUserStore.getState().addGems(quest.reward);

          const updatedQuests = quests.map(q => 
            q.id === questId ? { ...q, claimed: true } : q
          );
          set({ quests: updatedQuests });
          await get().syncQuests();
        }
      },

      syncQuests: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        await supabase.from('profiles').update({
          daily_quests: get().quests,
          quests_last_updated: get().lastUpdated
        }).eq('id', session.user.id);
      },

      loadQuests: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        const { data: profile } = await supabase
          .from('profiles')
          .select('daily_quests, quests_last_updated')
          .eq('id', session.user.id)
          .single();

        if (profile && profile.daily_quests) {
          set({ 
            quests: profile.daily_quests as Quest[],
            lastUpdated: profile.quests_last_updated || ''
          });
        }
      }
    }),
    { name: 'py-cholosikhi-quests' }
  )
);
