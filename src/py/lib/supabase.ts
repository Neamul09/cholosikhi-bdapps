/**
 * Unified Supabase client re-export.
 * Re-exports the singleton Supabase client from root src/lib/supabase
 * to ensure a single GoTrueClient instance and shared session state across the app.
 */
export { supabase, isSupabaseConfigured } from '../../lib/supabase';
