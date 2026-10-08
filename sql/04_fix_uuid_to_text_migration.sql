-- ==============================================================================
-- CholoSikhi BDApps + SAT Suite Full Migration: Convert UUIDs to TEXT & Enable Public RLS
-- (sql/04_fix_uuid_to_text_migration.sql)
--
-- FIXES: 400 Bad Request ("invalid input syntax for type uuid: usr_8801878932651")
-- Run this ONCE in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop all foreign key constraints referencing auth.users from public tables
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT tc.table_schema, tc.table_name, tc.constraint_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.constraint_column_usage ccu
          ON tc.constraint_name = ccu.constraint_name
          AND tc.table_schema = ccu.table_schema
        WHERE tc.table_schema = 'public'
          AND tc.constraint_type = 'FOREIGN KEY'
          AND ccu.table_name = 'users'
          AND ccu.table_schema = 'auth'
    ) LOOP
        EXECUTE 'ALTER TABLE ' || quote_ident(r.table_schema) || '.' || quote_ident(r.table_name) ||
                ' DROP CONSTRAINT IF EXISTS ' || quote_ident(r.constraint_name) || ' CASCADE;';
    END LOOP;
END $$;

-- 3. Ensure and Alter all tables to use TEXT for user_id / id

-- 3a. bdapps_users
CREATE TABLE IF NOT EXISTS public.bdapps_users (
  id TEXT PRIMARY KEY,
  mobile TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT 'Learner',
  subscription_status TEXT DEFAULT 'REGISTERED',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.bdapps_users ALTER COLUMN id TYPE TEXT USING id::text;

-- 3b. profiles
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
ALTER TABLE public.profiles ALTER COLUMN id TYPE TEXT USING id::text;

-- 3c. lesson_progress
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
ALTER TABLE public.lesson_progress ALTER COLUMN user_id TYPE TEXT USING user_id::text;

-- 3d. test_results
CREATE TABLE IF NOT EXISTS public.test_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL,
  test_id TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  stars INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_test UNIQUE (user_id, test_id)
);
ALTER TABLE public.test_results ALTER COLUMN user_id TYPE TEXT USING user_id::text;

-- 3e. achievements
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_achievement UNIQUE (user_id, achievement_id)
);
ALTER TABLE public.achievements ALTER COLUMN user_id TYPE TEXT USING user_id::text;

-- 3f. follows
CREATE TABLE IF NOT EXISTS public.follows (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  follower_id TEXT NOT NULL,
  following_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_follower_following UNIQUE (follower_id, following_id)
);
ALTER TABLE public.follows ALTER COLUMN follower_id TYPE TEXT USING follower_id::text;
ALTER TABLE public.follows ALTER COLUMN following_id TYPE TEXT USING following_id::text;

-- 3g. sat_user_progress
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
ALTER TABLE public.sat_user_progress ALTER COLUMN user_id TYPE TEXT USING user_id::text;

-- 3h. sat_quiz_attempts
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
ALTER TABLE public.sat_quiz_attempts ALTER COLUMN user_id TYPE TEXT USING user_id::text;

-- 3i. sat_wrong_answers
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
ALTER TABLE public.sat_wrong_answers ALTER COLUMN user_id TYPE TEXT USING user_id::text;

-- 3j. sat_user_routines
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
ALTER TABLE public.sat_user_routines ALTER COLUMN user_id TYPE TEXT USING user_id::text;

-- 3k. sat_vocab_progress
CREATE TABLE IF NOT EXISTS public.sat_vocab_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL,
  word_id TEXT NOT NULL,
  mastery_status TEXT DEFAULT 'learning',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_sat_vocab UNIQUE (user_id, word_id)
);
ALTER TABLE public.sat_vocab_progress ALTER COLUMN user_id TYPE TEXT USING user_id::text;

-- 3l. analytics_events
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_type TEXT NOT NULL,
  user_id TEXT,
  session_id TEXT,
  event_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.analytics_events ALTER COLUMN user_id TYPE TEXT USING user_id::text;

-- 4. Create Indexes for High Performance
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON public.lesson_progress (user_id);
CREATE INDEX IF NOT EXISTS idx_test_results_user ON public.test_results (user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_user ON public.achievements (user_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower ON public.follows (follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON public.follows (following_id);
CREATE INDEX IF NOT EXISTS idx_sat_user_progress_user ON public.sat_user_progress (user_id);
CREATE INDEX IF NOT EXISTS idx_sat_quiz_attempts_user ON public.sat_quiz_attempts (user_id);
CREATE INDEX IF NOT EXISTS idx_sat_wrong_answers_user ON public.sat_wrong_answers (user_id, resolved);
CREATE INDEX IF NOT EXISTS idx_sat_vocab_progress_user ON public.sat_vocab_progress (user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON public.analytics_events (user_id);

-- 5. Enable Row Level Security (RLS) & Grant Access for BDApps users
ALTER TABLE public.bdapps_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sat_user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sat_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sat_wrong_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sat_user_routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sat_vocab_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Reset and configure public policies
DROP POLICY IF EXISTS "Allow public all bdapps_users" ON public.bdapps_users;
CREATE POLICY "Allow public all bdapps_users" ON public.bdapps_users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public all profiles" ON public.profiles;
CREATE POLICY "Allow public all profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public all lesson_progress" ON public.lesson_progress;
CREATE POLICY "Allow public all lesson_progress" ON public.lesson_progress FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public all test_results" ON public.test_results;
CREATE POLICY "Allow public all test_results" ON public.test_results FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public all achievements" ON public.achievements;
CREATE POLICY "Allow public all achievements" ON public.achievements FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public all follows" ON public.follows;
CREATE POLICY "Allow public all follows" ON public.follows FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public all sat_user_progress" ON public.sat_user_progress;
CREATE POLICY "Allow public all sat_user_progress" ON public.sat_user_progress FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public all sat_quiz_attempts" ON public.sat_quiz_attempts;
CREATE POLICY "Allow public all sat_quiz_attempts" ON public.sat_quiz_attempts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public all sat_wrong_answers" ON public.sat_wrong_answers;
CREATE POLICY "Allow public all sat_wrong_answers" ON public.sat_wrong_answers FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public all sat_user_routines" ON public.sat_user_routines;
CREATE POLICY "Allow public all sat_user_routines" ON public.sat_user_routines FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public all sat_vocab_progress" ON public.sat_vocab_progress;
CREATE POLICY "Allow public all sat_vocab_progress" ON public.sat_vocab_progress FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public all analytics_events" ON public.analytics_events;
CREATE POLICY "Allow public all analytics_events" ON public.analytics_events FOR ALL USING (true) WITH CHECK (true);
