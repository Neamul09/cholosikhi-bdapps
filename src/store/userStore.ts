import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useQuestStore } from './questStore';
import { clearAllPersistedState } from './persistKeys';
import { toast } from './toastStore';

export type Language = 'en' | 'bn' | 'both';
export type Theme = 'dark' | 'light';
export type League = 'wood' | 'bronze' | 'iron' | 'gold' | 'diamond' | 'legendary';

export interface Achievement {
  id: string;
  unlockedAt?: number;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  total_xp: number;
  league: string;
  streak: number;
  /** UI-friendly alias for `total_xp`; populated at the map boundary. */
  xp?: number;
  isMe?: boolean;
  /** Optional uploaded avatar URL (Supabase Storage). When present, render <img> instead of the lucide icon. */
  avatarUrl?: string | null;
  /** Populated by `loadFriendsLeaderboard` and `searchUsers`; not set in the global weekly leaderboard. */
  isFollowing?: boolean;
}

export interface UserState {
  name: string;
  avatar: string;
  /** Optional uploaded avatar URL (Supabase Storage). Shown in place of the lucide icon when present. */
  avatarUrl: string;
  xp: number;
  totalXp: number;
  level: number;
  hearts: number;
  maxHearts: number;
  lastHeartRefill: number;
  streak: number;
  lastActiveDate: string;
  streakShield: number;
  gems: number;
  totalGemsEarned: number;
  xpBoostUntil: number; // timestamp
  league: League;
  weeklyXp: number;
  weekStart: string;
  achievements: Achievement[];
  lessonsCompleted: number;
  testsCompleted: number;
  testsPassedPerfect: number;
  totalTimeMinutes: number;
  xpHistory: Record<string, number>; // date -> daily_xp
  followersCount: number;
  followingCount: number;
  showLevelUp: number | null;
  showStreak: number | null;
  hasSeenTutorial: boolean;
  lastStreakCelebration: string | null;
  setShowLevelUp: (val: number | null) => void;
  setShowStreak: (val: number | null) => void;
  setHasSeenTutorial: (val: boolean) => void;

  addXp: (amount: number) => void;
  addGems: (amount: number) => void;
  loseHeart: () => boolean;
  checkAndUpdateStreak: () => void;
  unlockAchievement: (id: string) => Promise<void>;
  hasAchievement: (id: string) => boolean;
  setName: (name: string) => void;
  setAvatar: (avatar: string) => void;
  setAvatarUrl: (url: string) => void;
  /** Uploads the file to Supabase Storage `avatars/{userId}/...` and persists the public URL. */
  uploadAvatar: (file: File) => Promise<string | null>;
  completeLesson: () => void;
  completeTest: (perfect: boolean) => void;

  // Supabase Actions
  refillHearts: () => Promise<void>;
  buyStreakShield: () => Promise<void>;
  buyXPBoost: () => Promise<void>;
  spendGems: (amount: number) => Promise<boolean>;
  syncToSupabase: () => Promise<void>;
  loadFromSupabase: () => Promise<void>;

   // Social Actions
  toggleFollow: (targetUserId: string) => Promise<void>;
  isFollowing: (targetUserId: string) => Promise<boolean>;
  searchUsers: (query: string) => Promise<LeaderboardUser[]>;
  loadLeaderboard: () => Promise<LeaderboardUser[]>;
  loadFriendsLeaderboard: () => Promise<LeaderboardUser[]>;

  // Activity Actions
  interactWithVisualizer: () => void;
  resetAccount: () => Promise<void>;
}

const XP_PER_LEVEL = (level: number) => 100 * Math.pow(level, 2);

// Build a YYYY-MM-DD string from local date components (NOT toISOString),
// so week boundaries stay consistent regardless of the user's timezone.
// toISOString() returns UTC, which can shift the date by ±1 day for users
// east/west of UTC, causing the leaderboard to roll over at the wrong moment.
const localDateString = (d: Date = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const today = () => localDateString();

const getWeekStart = () => {
  const d = new Date();
  const day = d.getDay();
  // Roll back to Monday (day 1). If today is Sunday (day 0), go back 6 days.
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return localDateString(d);
};

const LEAGUE_THRESHOLDS: Record<League, number> = {
  wood: 0, bronze: 100, iron: 500, gold: 1500, diamond: 5000, legendary: 15000,
};

function computeLeague(weeklyXp: number): League {
  // Leagues are determined by THIS WEEK'S XP (Duolingo-style), so every
  // Monday everyone starts at zero and climbs back through the tiers.
  const leagues: League[] = ['legendary', 'diamond', 'gold', 'iron', 'bronze', 'wood'];
  for (const league of leagues) {
    if (weeklyXp >= LEAGUE_THRESHOLDS[league]) return league;
  }
  return 'wood';
}

function computeLevel(totalXp: number): number {
  let level = 1;
  let xpNeeded = 0;
  while (level < 50) {
    xpNeeded += XP_PER_LEVEL(level);
    if (totalXp < xpNeeded) break;
    level++;
  }
  return level;
}

export function getLevelProgress(totalXp: number) {
  let level = 1;
  let cumulativeXp = 0;
  
  while (level < 50) {
    const nextLevelXp = XP_PER_LEVEL(level);
    if (totalXp < cumulativeXp + nextLevelXp) {
      return {
        level,
        xpInLevel: totalXp - cumulativeXp,
        nextLevelXp,
        remaining: cumulativeXp + nextLevelXp - totalXp
      };
    }
    cumulativeXp += nextLevelXp;
    level++;
  }
  
  return { level: 50, xpInLevel: 0, nextLevelXp: 0, remaining: 0 };
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      name: '',
      avatar: 'user',
      avatarUrl: '',
      xp: 0,
      totalXp: 0,
      level: 1,
      hearts: 5,
      maxHearts: 5,
      lastHeartRefill: Date.now(),
      streak: 0,
      lastActiveDate: '',
      streakShield: 0,
      gems: 50,
      totalGemsEarned: 50,
      xpBoostUntil: 0,
      league: 'wood',
      weeklyXp: 0,
      weekStart: getWeekStart(),
      achievements: [],
      lessonsCompleted: 0,
      testsCompleted: 0,
      testsPassedPerfect: 0,
      totalTimeMinutes: 0,
      xpHistory: {},
      followersCount: 0,
      followingCount: 0,
      showLevelUp: null,
      showStreak: null,
      hasSeenTutorial: localStorage.getItem('hasSeenTutorial') === 'true',
      lastStreakCelebration: null,
      setShowLevelUp: (val) => set({ showLevelUp: val }),
      setShowStreak: (val) => set({ showStreak: val }),
      setHasSeenTutorial: (val) => {
        set({ hasSeenTutorial: val });
        localStorage.setItem('hasSeenTutorial', val ? 'true' : 'false');
        get().syncToSupabase();
      },

      addXp: (amount) => {
        const isBoosted = Date.now() < get().xpBoostUntil;
        const actualAmount = isBoosted ? amount * 2 : amount;

        set((state) => {
          const newTotalXp = state.totalXp + actualAmount;
          const newLevel = computeLevel(newTotalXp);
          const sameWeek = state.weekStart === getWeekStart();
          const newWeeklyXp = sameWeek ? state.weeklyXp + actualAmount : actualAmount;
          const newLeague = computeLeague(newWeeklyXp);

          return {
            totalXp: newTotalXp,
            xp: newTotalXp,
            level: newLevel,
            // Recompute league live so promotion happens as soon as the
            // weekly-XP threshold is crossed, not only on the weekly reset.
            league: newLeague,
            weeklyXp: newWeeklyXp,
            weekStart: getWeekStart(),
            xpHistory: {
              ...state.xpHistory,
              [today()]: (state.xpHistory[today()] || 0) + actualAmount
            },
            showLevelUp: newLevel > state.level ? newLevel : state.showLevelUp
          };
        });
        useQuestStore.getState().updateQuestProgress('xp', actualAmount);
        get().syncToSupabase();
      },

      addGems: (amount) => {
        set((state) => ({
          gems: state.gems + amount,
          totalGemsEarned: state.totalGemsEarned + amount,
        }));
        get().syncToSupabase();
      },

      loseHeart: () => {
        const state = get();
        if (state.hearts <= 0) return false;
        set({ hearts: state.hearts - 1 });
        get().syncToSupabase();
        return true;
      },

      checkAndUpdateStreak: () => {
        const state = get();
        const lastActive = state.lastActiveDate;
        const todayStr = today();

        if (lastActive === todayStr) return;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = localDateString(yesterday);

        let newStreak = state.streak;
        if (lastActive === yesterdayStr) {
          // Streak maintained from yesterday, keep current number until first lesson today
        } else if (lastActive && lastActive < yesterdayStr) {
          if (state.streakShield > 0) {
            set(s => ({ streakShield: s.streakShield - 1 }));
          } else {
            newStreak = 0; // Missed yesterday, reset to 0
          }
        } else if (!lastActive) {
          newStreak = 0;
        }

        set({
          streak: newStreak,
          lastActiveDate: todayStr,
        });

        get().syncToSupabase();
      },

      unlockAchievement: async (id) => {
        const state = get();
        if (state.hasAchievement(id)) return;

        const newAchievement = { id, unlockedAt: Date.now() };
        set({ achievements: [...state.achievements, newAchievement] });

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('achievements').upsert({
            user_id: user.id,
            achievement_id: id,
            unlocked_at: new Date().toISOString()
          });
        }
      },

      hasAchievement: (id) => get().achievements.some((a) => a.id === id),

      setName: (name) => {
        set({ name });
        get().syncToSupabase();
      },

      setAvatar: (avatar) => {
        set({ avatar });
        get().syncToSupabase();
      },

      setAvatarUrl: (url) => {
        set({ avatarUrl: url });
        get().syncToSupabase();
      },

      uploadAvatar: async (file) => {
        if (!isSupabaseConfigured) {
          if (import.meta.env.DEV) console.warn('[userStore] uploadAvatar: Supabase not configured.');
          toast.warn('Avatar upload is unavailable in this build.');
          return null;
        }
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          toast.error('Sign in to upload an avatar.');
          return null;
        }

        // Sanity-check the file before hitting the network.
        const MAX_BYTES = 2 * 1024 * 1024; // 2 MB
        if (file.size > MAX_BYTES) {
          toast.error('Image is too large. Max 2 MB.');
          return null;
        }
        if (!file.type.startsWith('image/')) {
          toast.error('That file is not an image.');
          return null;
        }

        // Build a path under the user's own folder so RLS "owner can write to own folder" works.
        const ext = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'png';
        const path = `${session.user.id}/${Date.now()}.${ext}`;

        const { error: uploadErr } = await supabase.storage
          .from('avatars')
          .upload(path, file, { upsert: true, contentType: file.type });

        if (uploadErr) {
          if (import.meta.env.DEV) console.error('[userStore] uploadAvatar: storage upload failed:', uploadErr);
          toast.error('Upload failed. Please try again.');
          return null;
        }

        const { data: pub } = supabase.storage.from('avatars').getPublicUrl(path);
        const publicUrl = pub.publicUrl;

        // Persist the URL on the profile row so it survives reloads.
        const { error: updateErr } = await supabase
          .from('profiles')
          .update({ avatar_url: publicUrl })
          .eq('id', session.user.id);

        if (updateErr) {
          if (import.meta.env.DEV) console.error('[userStore] uploadAvatar: profile update failed:', updateErr);
          toast.error('Could not save your avatar.');
          return null;
        }

        set({ avatarUrl: publicUrl });
        toast.success('Avatar updated!');
        return publicUrl;
      },

      loadLeaderboard: async () => {
        const state = get();
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, avatar, avatar_url, weekly_xp, total_xp, league, streak')
          .eq('league', state.league)
          .order('weekly_xp', { ascending: false, nullsFirst: false })
          .order('total_xp', { ascending: false })
          .limit(30);

        if (error) {
          if (import.meta.env.DEV) console.error('Error loading leaderboard:', error);
          toast.error('Could not load the leaderboard.');
          return [];
        }

        const { data: { session } } = await supabase.auth.getSession();
        return (data || []).map((p): LeaderboardUser => ({
          id: p.id,
          name: p.name || (p.id.substring(0, 4) === 'bot_' ? 'CholoSikhi Bot' : 'Sikhi Student'),
          avatar: p.avatar || 'code',
          avatarUrl: p.avatar_url ?? null,
          total_xp: p.total_xp ?? 0,
          xp: (p.weekly_xp != null ? p.weekly_xp : p.total_xp) ?? 0,
          league: p.league ?? 'wood',
          streak: p.streak ?? 0,
          isMe: p.id === session?.user?.id,
        }));
      },

      loadFriendsLeaderboard: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return [];

        // 1. Get followed user IDs
        const { data: following } = await supabase
          .from('follows')
          .select('following_id')
          .eq('follower_id', session.user.id);

        const followingIds = following?.map(f => f.following_id) || [];
        const followedSet = new Set(followingIds);
        followingIds.push(session.user.id); // Include myself

        // 2. Get profiles
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('id, name, avatar, avatar_url, weekly_xp')
          .in('id', followingIds)
          .order('weekly_xp', { ascending: false });

        if (error) {
          if (import.meta.env.DEV) console.error('Error loading friends leaderboard:', error);
          toast.warn('Could not load your friends.');
          return [];
        }

        return profiles.map((p): LeaderboardUser => ({
          id: p.id,
          name: p.name || 'Anonymous',
          avatar: p.avatar || 'user',
          avatarUrl: p.avatar_url ?? null,
          total_xp: p.weekly_xp ?? 0,
          xp: p.weekly_xp ?? 0,
          league: 'wood',
          streak: 0,
          isMe: p.id === session.user.id,
          isFollowing: followedSet.has(p.id),
        }));
      },

      completeLesson: () => {
        const state = get();
        const todayStr = today();
        let newStreak = state.streak;

        if (state.lastStreakCelebration !== todayStr) {
          newStreak += 1;
          set({
            streak: newStreak,
            showStreak: newStreak,
            lastStreakCelebration: todayStr,
            lastActiveDate: todayStr
          });
        }

        set((s) => ({ lessonsCompleted: s.lessonsCompleted + 1 }));
        useQuestStore.getState().updateQuestProgress('lessons', 1);
        get().syncToSupabase();
      },

      completeTest: (perfect) => {
        const state = get();
        const todayStr = today();
        let newStreak = state.streak;

        if (state.lastStreakCelebration !== todayStr) {
          newStreak += 1;
          set({
            streak: newStreak,
            showStreak: newStreak,
            lastStreakCelebration: todayStr,
            lastActiveDate: todayStr
          });
        }

        set((s) => ({
          testsCompleted: s.testsCompleted + 1,
          testsPassedPerfect: perfect ? s.testsPassedPerfect + 1 : s.testsPassedPerfect,
        }));

        get().syncToSupabase();
      },

      syncToSupabase: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        const state = get();
        const profileData = {
          name: state.name,
          avatar: state.avatar,
          avatar_url: state.avatarUrl,
          xp: state.xp,
          total_xp: state.totalXp,
          level: state.level,
          hearts: state.hearts,
          max_hearts: state.maxHearts,
          last_heart_refill: state.lastHeartRefill,
          streak: state.streak,
          last_active_date: state.lastActiveDate,
          streak_shield: state.streakShield,
          gems: state.gems,
          total_gems_earned: state.totalGemsEarned,
          league: state.league,
          weekly_xp: state.weeklyXp,
          week_start: state.weekStart,
          lessons_completed: state.lessonsCompleted,
          tests_completed: state.testsCompleted,
          tests_passed_perfect: state.testsPassedPerfect,
          total_time_minutes: state.totalTimeMinutes,
          xp_history: state.xpHistory,
          xp_boost_until: state.xpBoostUntil,
          has_seen_tutorial: state.hasSeenTutorial,
          last_streak_celebration: state.lastStreakCelebration,
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase.from('profiles').update(profileData).eq('id', session.user.id);

        if (error) {
          if (import.meta.env.DEV) console.error('Supabase Sync Error:', error);
          // Toast only on user-visible writes (initial sync); silent retries are fine.
        }
      },

      refillHearts: async () => {
        const cost = 400;
        if (await get().spendGems(cost)) {
          set({ hearts: get().maxHearts });
        }
      },

      buyStreakShield: async () => {
        const cost = 1000;
        if (await get().spendGems(cost)) {
          set((state) => ({ streakShield: state.streakShield + 1 }));
        }
      },

      buyXPBoost: async () => {
        const cost = 600;
        if (await get().spendGems(cost)) {
          const boostTime = 30 * 60 * 1000; // 30 mins
          set((state) => ({ 
            xpBoostUntil: Math.max(state.xpBoostUntil, Date.now()) + boostTime 
          }));
        }
      },

      spendGems: async (amount) => {
        const state = get();
        if (state.gems < amount) return false;
        set((s) => ({ gems: s.gems - amount }));
        await get().syncToSupabase();
        return true;
      },

      loadFromSupabase: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        const { data: initialProfile, error: loadError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        let profile = initialProfile;

        if (loadError && loadError.code !== 'PGRST116') {
          if (import.meta.env.DEV) console.error('Supabase Load Error:', loadError);
          toast.error('Could not load your profile.');
        }

        if (!profile) {
          // First time login - create profile with generous defaults
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .upsert({
              id: session.user.id,
              name: session.user.user_metadata?.full_name || '',
              avatar: 'code',
              xp: 100,
              total_xp: 100,
              level: 1,
              hearts: 20,
              max_hearts: 20,
              gems: 100,
              total_gems_earned: 100,
              has_seen_tutorial: false,
              last_streak_celebration: null,
              last_heart_refill: Date.now(),
              current_course: 'python',
            })
            .select()
            .single();

          if (createError) {
            if (import.meta.env.DEV) console.error('Supabase Create Profile Error:', createError);
            toast.error('Could not create your profile. Try signing in again.');
          }

          if (!createError) profile = newProfile;
        }

        if (profile) {
          // Auto-refill hearts: 5 every 4 hours, max 20
          const REFILL_INTERVAL_MS = 4 * 60 * 60 * 1000; // 4 hours
          const HEARTS_PER_REFILL = 5;
          const maxH = profile.max_hearts || 20;
          let currentHearts = profile.hearts || 20;
          let lastRefill = profile.last_heart_refill || Date.now();
          const now = Date.now();
          if (currentHearts < maxH) {
            const elapsed = now - lastRefill;
            const refillCount = Math.floor(elapsed / REFILL_INTERVAL_MS);
            if (refillCount > 0) {
              currentHearts = Math.min(maxH, currentHearts + refillCount * HEARTS_PER_REFILL);
              lastRefill = lastRefill + refillCount * REFILL_INTERVAL_MS;
            }
          }

          set({
            name: profile.name || session.user.user_metadata?.full_name || '',
            avatar: profile.avatar || 'code',
            avatarUrl: profile.avatar_url || '',
            xp: profile.xp || 0,
            totalXp: profile.total_xp || 0,
            level: profile.level || 1,
            hearts: currentHearts,
            maxHearts: maxH,
            lastHeartRefill: lastRefill,
            streak: profile.streak || 0,
            lastActiveDate: profile.last_active_date || today(),
            streakShield: typeof profile.streak_shield === 'boolean' 
              ? (profile.streak_shield ? 1 : 0) 
              : (Number(profile.streak_shield) || 0),
            gems: profile.gems || 100,
            totalGemsEarned: profile.total_gems_earned || 100,
            league: profile.league || 'wood',
            weeklyXp: profile.weekly_xp || 0,
            weekStart: profile.week_start || getWeekStart(),
            lessonsCompleted: profile.lessons_completed || 0,
            testsCompleted: profile.tests_completed || 0,
            testsPassedPerfect: profile.tests_passed_perfect || 0,
            totalTimeMinutes: profile.total_time_minutes || 0,
            xpHistory: profile.xp_history || {},
            xpBoostUntil: profile.xp_boost_until || 0,
            hasSeenTutorial: profile.has_seen_tutorial || localStorage.getItem('hasSeenTutorial') === 'true',
            lastStreakCelebration: profile.last_streak_celebration || null
          });

          // Check if a new week has started. If so, reset weekly XP and
          // demote league back to wood — every player starts fresh on Monday,
          // and climbs back through the tiers as they earn XP this week.
          const currentWeekStart = get().weekStart;
          const actualWeekStart = getWeekStart();
          if (currentWeekStart !== actualWeekStart) {
            set({
              league: 'wood',
              weekStart: actualWeekStart,
              weeklyXp: 0
            });
            get().syncToSupabase();
          }

          if (import.meta.env.DEV) console.log('✅ py.cholosikhi: Database connected and profile loaded successfully.');

          // Load follower/following counts
          const { count: followers } = await supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', session.user.id);
          const { count: following } = await supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', session.user.id);

          set({
            followersCount: followers || 0,
            followingCount: following || 0
          });
        }

        // Load achievements
        const { data: achievements } = await supabase
          .from('achievements')
          .select('achievement_id, unlocked_at')
          .eq('user_id', session.user.id);

        if (achievements) {
          set({
            achievements: achievements.map(a => ({
              id: a.achievement_id,
              unlockedAt: new Date(a.unlocked_at).getTime()
            }))
          });
        }
      },

      isFollowing: async (targetUserId) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return false;
        const { data } = await supabase.from('follows')
          .select('*')
          .eq('follower_id', session.user.id)
          .eq('following_id', targetUserId)
          .single();
        return !!data;
      },

      toggleFollow: async (targetUserId) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        const following = await get().isFollowing(targetUserId);

        if (following) {
          await supabase.from('follows')
            .delete()
            .eq('follower_id', session.user.id)
            .eq('following_id', targetUserId);

          set(state => ({ followingCount: Math.max(0, state.followingCount - 1) }));
        } else {
          await supabase.from('follows')
            .insert({
              follower_id: session.user.id,
              following_id: targetUserId
            });

          set(state => ({ followingCount: state.followingCount + 1 }));
        }
      },

      searchUsers: async (query) => {
        if (!query || query.length < 2) return [];
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, avatar, avatar_url, total_xp, league, streak')
          .ilike('name', `%${query}%`)
          .limit(10);

        if (error) return [];

        const { data: { session } } = await supabase.auth.getSession();
        const me = session?.user?.id;
        const ids = data.map(p => p.id);
        const followedSet = new Set<string>();
        if (me && ids.length) {
          const { data: followRows } = await supabase
            .from('follows')
            .select('following_id')
            .eq('follower_id', me)
            .in('following_id', ids);
          (followRows || []).forEach(r => followedSet.add(r.following_id));
        }

        return data.map((p): LeaderboardUser => ({
          id: p.id,
          name: p.name || 'Sikhi Student',
          avatar: p.avatar || 'user',
          avatarUrl: p.avatar_url ?? null,
          total_xp: p.total_xp ?? 0,
          xp: p.total_xp ?? 0,
          league: p.league ?? 'wood',
          streak: p.streak ?? 0,
          isMe: p.id === me,
          isFollowing: followedSet.has(p.id),
        }));
      },

      interactWithVisualizer: () => {
        // One-time XP reward per session/day for using visualizer
        get().addXp(10);
        // This could also trigger a specific quest
      },

      resetAccount: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        // Clear profiles table (optional: just reset stats)
        await supabase.from('profiles').update({
          xp: 0,
          total_xp: 0,
          level: 1,
          hearts: 5,
          streak: 0,
          lessons_completed: 0,
          tests_completed: 0,
          xp_history: {},
        }).eq('id', session.user.id);

        // Delete other related data
        await supabase.from('lesson_progress').delete().eq('user_id', session.user.id);
        await supabase.from('test_results').delete().eq('user_id', session.user.id);
        await supabase.from('achievements').delete().eq('user_id', session.user.id);

        // Wipe every persisted store via the central registry (see persistKeys.ts)
        // so any future store added there is reset here too.
        clearAllPersistedState();

        // Also clear the Supabase auth session key explicitly.
        try {
          localStorage.removeItem('cholosikhi-auth');
        } catch {
          // localStorage may be unavailable; the site reload below will discard
          // everything in-memory anyway.
        }

        window.location.reload();
      }
    }),
    { name: 'py-cholosikhi-user' }
  )
);
