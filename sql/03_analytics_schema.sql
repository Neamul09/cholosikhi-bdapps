-- ==============================================================================
-- CholoSikhi Telemetry & Analytics Event Schema
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  source TEXT DEFAULT 'direct',
  is_reel BOOLEAN DEFAULT false,
  user_agent TEXT,
  ip_country TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow all users (anonymous and authenticated) to log analytics events
DROP POLICY IF EXISTS "Allow all users to insert analytics events" ON public.analytics_events;
CREATE POLICY "Allow all users to insert analytics events" ON public.analytics_events
  FOR INSERT WITH CHECK (true);

-- Allow viewing analytics events for admin reporting
DROP POLICY IF EXISTS "Allow authenticated users to view analytics events" ON public.analytics_events;
CREATE POLICY "Allow authenticated users to view analytics events" ON public.analytics_events
  FOR SELECT USING (true);

-- Indexes for queries and dashboard analytics
CREATE INDEX IF NOT EXISTS idx_analytics_visitor_id ON public.analytics_events(visitor_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_source ON public.analytics_events(source);
CREATE INDEX IF NOT EXISTS idx_analytics_is_reel ON public.analytics_events(is_reel);
CREATE INDEX IF NOT EXISTS idx_analytics_event_name ON public.analytics_events(event_name);
