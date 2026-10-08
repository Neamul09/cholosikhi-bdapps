-- ==============================================================================
-- CholoSikhi SAT Suite Database Migration Schema (02_sat_schema.sql)
-- Connects seamlessly with BDApps standalone user authentication (user_id as TEXT)
-- ==============================================================================

-- 1. SAT User Progress (Micro-Type Mastery Tracking)
create table if not exists public.sat_user_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id text not null,
  micro_type_id text not null,
  section text not null, -- 'math' or 'reading_writing'
  domain text not null,
  skill text not null,
  attempted integer default 0,
  correct integer default 0,
  mastery_percentage integer default 0,
  status text default 'novice', -- 'novice', 'practicing', 'proficient', 'mastered'
  last_practiced_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_user_sat_micro_type unique (user_id, micro_type_id)
);

create index if not exists idx_sat_user_progress_user on public.sat_user_progress (user_id);
create index if not exists idx_sat_user_progress_micro on public.sat_user_progress (micro_type_id);

-- 2. SAT Quiz & Practice Test Sessions
create table if not exists public.sat_quiz_attempts (
  id uuid default uuid_generate_v4() primary key,
  user_id text not null,
  quiz_type text not null, -- 'custom_drill', 'hardest_drill', 'practice_test', 'mistake_review'
  section text not null,   -- 'math', 'reading_writing', 'full'
  total_questions integer not null,
  correct_count integer not null,
  incorrect_count integer not null,
  accuracy integer not null,
  time_spent_seconds integer default 0,
  scaled_score integer, -- estimated section or composite score
  xp_earned integer default 0,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_sat_quiz_attempts_user on public.sat_quiz_attempts (user_id);

-- 3. SAT Mistake Bank (Wrong Answer Review System)
create table if not exists public.sat_wrong_answers (
  id uuid default uuid_generate_v4() primary key,
  user_id text not null,
  question_id text not null,
  section text not null,
  domain text not null,
  skill text not null,
  micro_type_id text not null,
  user_answer text,
  correct_answer text not null,
  error_reason text default 'concept_gap', -- 'careless_calc', 'time_pressure', 'misread_question', 'concept_gap', 'vocab_unknown'
  resolved boolean default false,
  times_retried integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_user_sat_mistake unique (user_id, question_id)
);

create index if not exists idx_sat_wrong_answers_user on public.sat_wrong_answers (user_id, resolved);

-- 4. SAT Personalized Routine Plan
create table if not exists public.sat_user_routines (
  id uuid default uuid_generate_v4() primary key,
  user_id text not null,
  exam_date text not null,
  target_score integer not null default 1520,
  weekly_hours integer not null default 6,
  daily_tasks jsonb default '[]'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_user_sat_routine unique (user_id)
);

-- 5. SAT Vocabulary Mastery
create table if not exists public.sat_vocab_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id text not null,
  word_id text not null,
  mastery_status text default 'learning', -- 'learning', 'familiar', 'mastered'
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_user_sat_vocab unique (user_id, word_id)
);

create index if not exists idx_sat_vocab_progress_user on public.sat_vocab_progress (user_id);

-- ==============================================================================
-- Row Level Security (RLS)
-- ==============================================================================
alter table public.sat_user_progress enable row level security;
alter table public.sat_quiz_attempts enable row level security;
alter table public.sat_wrong_answers enable row level security;
alter table public.sat_user_routines enable row level security;
alter table public.sat_vocab_progress enable row level security;

-- Policies for public BDApps users
drop policy if exists "Allow public all sat_user_progress" on public.sat_user_progress;
create policy "Allow public all sat_user_progress" on public.sat_user_progress for all using (true) with check (true);

drop policy if exists "Allow public all sat_quiz_attempts" on public.sat_quiz_attempts;
create policy "Allow public all sat_quiz_attempts" on public.sat_quiz_attempts for all using (true) with check (true);

drop policy if exists "Allow public all sat_wrong_answers" on public.sat_wrong_answers;
create policy "Allow public all sat_wrong_answers" on public.sat_wrong_answers for all using (true) with check (true);

drop policy if exists "Allow public all sat_user_routines" on public.sat_user_routines;
create policy "Allow public all sat_user_routines" on public.sat_user_routines for all using (true) with check (true);

drop policy if exists "Allow public all sat_vocab_progress" on public.sat_vocab_progress;
create policy "Allow public all sat_vocab_progress" on public.sat_vocab_progress for all using (true) with check (true);

