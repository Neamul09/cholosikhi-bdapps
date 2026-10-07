-- ==============================================================================
-- CholoSikhi BDApps Standalone Database Migration Schema
-- (sql/03_bdapps_standalone_schema.sql)
--
-- Supports standalone mobile/OTP-based BDApps authentication and profile system.
-- All user IDs are stored as TEXT (e.g., 'usr_01887349141').
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard
-- ==============================================================================

-- 1. Enable UUID Extension (if needed)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Standalone BDApps Users Table
CREATE TABLE IF NOT EXISTS public.bdapps_users (
  id TEXT PRIMARY KEY,
  mobile TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT 'Learner',
  subscription_status TEXT DEFAULT 'REGISTERED',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bdapps_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public select bdapps_users" ON public.bdapps_users;
CREATE POLICY "Allow public select bdapps_users" ON public.bdapps_users FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert bdapps_users" ON public.bdapps_users;
CREATE POLICY "Allow public insert bdapps_users" ON public.bdapps_users FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update bdapps_users" ON public.bdapps_users;
CREATE POLICY "Allow public update bdapps_users" ON public.bdapps_users FOR UPDATE USING (true);

-- 3. Standalone Profiles Table (for XP, Level, Gems, Streaks, Leaderboard)
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  name TEXT DEFAULT 'Learner',
  mobile TEXT,
  avatar TEXT DEFAULT 'code',
  avatar_url TEXT,
  xp INTEGER DEFAULT 100,
  total_xp INTEGER DEFAULT 100,
  level INTEGER DEFAULT 1,
  hearts INTEGER DEFAULT 20,
  max_hearts INTEGER DEFAULT 20,
  last_heart_refill BIGINT,
  streak INTEGER DEFAULT 0,
  last_active_date TEXT,
  streak_shield INTEGER DEFAULT 0,
  gems INTEGER DEFAULT 100,
  total_gems_earned INTEGER DEFAULT 100,
  league TEXT DEFAULT 'wood',
  weekly_xp INTEGER DEFAULT 0,
  week_start TEXT,
  lessons_completed INTEGER DEFAULT 0,
  tests_completed INTEGER DEFAULT 0,
  tests_passed_perfect INTEGER DEFAULT 0,
  total_time_minutes INTEGER DEFAULT 0,
  xp_history JSONB DEFAULT '{}'::jsonb,
  xp_boost_until BIGINT DEFAULT 0,
  has_seen_tutorial BOOLEAN DEFAULT false,
  last_streak_celebration TEXT,
  language TEXT DEFAULT 'bn',
  current_course TEXT DEFAULT 'python',
  theme TEXT DEFAULT 'dark',
  daily_goal_xp INTEGER DEFAULT 50,
  sound_enabled BOOLEAN DEFAULT false,
  animations_enabled BOOLEAN DEFAULT true,
  daily_quests JSONB DEFAULT '[]'::jsonb,
  quests_last_updated TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public select profiles" ON public.profiles;
CREATE POLICY "Allow public select profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert profiles" ON public.profiles;
CREATE POLICY "Allow public insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update profiles" ON public.profiles;
CREATE POLICY "Allow public update profiles" ON public.profiles FOR UPDATE USING (true);

-- 4. Standalone Lesson Progress Table
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  time_spent_minutes INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_lesson UNIQUE (user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON public.lesson_progress (user_id);
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all lesson_progress" ON public.lesson_progress;
CREATE POLICY "Allow public all lesson_progress" ON public.lesson_progress FOR ALL USING (true) WITH CHECK (true);

-- 5. Standalone Test Results Table
CREATE TABLE IF NOT EXISTS public.test_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL,
  test_id TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  stars INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_test UNIQUE (user_id, test_id)
);

CREATE INDEX IF NOT EXISTS idx_test_results_user ON public.test_results (user_id);
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all test_results" ON public.test_results;
CREATE POLICY "Allow public all test_results" ON public.test_results FOR ALL USING (true) WITH CHECK (true);

-- 6. Standalone Achievements Table
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_achievement UNIQUE (user_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS idx_achievements_user ON public.achievements (user_id);
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all achievements" ON public.achievements;
CREATE POLICY "Allow public all achievements" ON public.achievements FOR ALL USING (true) WITH CHECK (true);

-- 7. Standalone Follows Table (Social leaderboard & friends)
CREATE TABLE IF NOT EXISTS public.follows (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  follower_id TEXT NOT NULL,
  following_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_follower_following UNIQUE (follower_id, following_id)
);

CREATE INDEX IF NOT EXISTS idx_follows_follower ON public.follows (follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON public.follows (following_id);
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all follows" ON public.follows;
CREATE POLICY "Allow public all follows" ON public.follows FOR ALL USING (true) WITH CHECK (true);

-- 8. Standalone SAT Suite Tables (with TEXT user_id)
CREATE TABLE IF NOT EXISTS public.sat_user_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL,
  micro_type_id TEXT NOT NULL,
  section TEXT NOT NULL,
  domain TEXT NOT NULL,
  skill TEXT NOT NULL,
  attempted INTEGER DEFAULT 0,
  correct INTEGER DEFAULT 0,
  mastery_percentage INTEGER DEFAULT 0,
  status TEXT DEFAULT 'novice',
  last_practiced_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_sat_micro_type UNIQUE (user_id, micro_type_id)
);

CREATE INDEX IF NOT EXISTS idx_sat_user_progress_user ON public.sat_user_progress (user_id);
ALTER TABLE public.sat_user_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all sat_user_progress" ON public.sat_user_progress;
CREATE POLICY "Allow public all sat_user_progress" ON public.sat_user_progress FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.sat_quiz_attempts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL,
  quiz_type TEXT NOT NULL,
  section TEXT NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_count INTEGER NOT NULL,
  incorrect_count INTEGER NOT NULL,
  accuracy INTEGER NOT NULL,
  time_spent_seconds INTEGER DEFAULT 0,
  scaled_score INTEGER,
  xp_earned INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sat_quiz_attempts_user ON public.sat_quiz_attempts (user_id);
ALTER TABLE public.sat_quiz_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all sat_quiz_attempts" ON public.sat_quiz_attempts;
CREATE POLICY "Allow public all sat_quiz_attempts" ON public.sat_quiz_attempts FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.sat_wrong_answers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  section TEXT NOT NULL,
  domain TEXT NOT NULL,
  skill TEXT NOT NULL,
  micro_type_id TEXT NOT NULL,
  user_answer TEXT,
  correct_answer TEXT NOT NULL,
  error_reason TEXT DEFAULT 'concept_gap',
  resolved BOOLEAN DEFAULT false,
  times_retried INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_sat_mistake UNIQUE (user_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_sat_wrong_answers_user ON public.sat_wrong_answers (user_id, resolved);
ALTER TABLE public.sat_wrong_answers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all sat_wrong_answers" ON public.sat_wrong_answers;
CREATE POLICY "Allow public all sat_wrong_answers" ON public.sat_wrong_answers FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.sat_user_routines (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL,
  exam_date TEXT NOT NULL,
  target_score INTEGER NOT NULL DEFAULT 1520,
  weekly_hours INTEGER NOT NULL DEFAULT 6,
  daily_tasks JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_sat_routine UNIQUE (user_id)
);

ALTER TABLE public.sat_user_routines ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all sat_user_routines" ON public.sat_user_routines;
CREATE POLICY "Allow public all sat_user_routines" ON public.sat_user_routines FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.sat_vocab_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL,
  word_id TEXT NOT NULL,
  mastery_status TEXT DEFAULT 'learning',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_sat_vocab UNIQUE (user_id, word_id)
);

CREATE INDEX IF NOT EXISTS idx_sat_vocab_progress_user ON public.sat_vocab_progress (user_id);
ALTER TABLE public.sat_vocab_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all sat_vocab_progress" ON public.sat_vocab_progress;
CREATE POLICY "Allow public all sat_vocab_progress" ON public.sat_vocab_progress FOR ALL USING (true) WITH CHECK (true);
