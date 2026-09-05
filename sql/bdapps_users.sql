-- Run this SQL in your Supabase SQL Editor (https://supabase.com/dashboard/project/ofzuvhjindrlkgjpmffu/sql)

CREATE TABLE IF NOT EXISTS public.bdapps_users (
  id TEXT PRIMARY KEY,
  mobile TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT 'Learner',
  subscription_status TEXT DEFAULT 'REGISTERED',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.bdapps_users ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public select"
  ON public.bdapps_users FOR SELECT
  USING (true);

-- Allow public insert access
CREATE POLICY "Allow public insert"
  ON public.bdapps_users FOR INSERT
  WITH CHECK (true);

-- Allow public update access
CREATE POLICY "Allow public update"
  ON public.bdapps_users FOR UPDATE
  USING (true);
