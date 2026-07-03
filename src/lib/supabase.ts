import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * Whether the Supabase client is properly configured.
 * Use this to gate network calls (auth, db, storage) so the app fails fast
 * with a clear error instead of throwing `TypeError: Failed to fetch` against
 * the placeholder URL.
 */
export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  supabaseUrl !== 'https://placeholder-project.supabase.co' &&
  supabaseAnonKey !== 'placeholder-anon-key',
);

if (!isSupabaseConfigured && import.meta.env.DEV) {
  // Loud, actionable message in dev — never silently fall through to a fake host.
  console.warn(
    '[supabase] Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. ' +
    'Create a `.env.local` in the project root (see .env.example) and restart `npm run dev`.',
  );
}

// A no-op stub is created when env vars are missing so module-level imports
// never throw. Real auth/db calls should be guarded with `isSupabaseConfigured`.
export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'cholosikhi-auth',
      },
    })
  : (createClient('https://invalid.supabase.invalid', 'invalid', {
      auth: { persistSession: false, autoRefreshToken: false },
    }) as SupabaseClient);
