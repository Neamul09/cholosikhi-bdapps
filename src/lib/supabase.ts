import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * Whether the Supabase client is properly configured.
 * When false, all auth/db calls resolve to a structured "not configured"
 * error instead of throwing `TypeError: Failed to fetch` against the
 * placeholder URL. Stores can therefore call `supabase.from(...)` without
 * explicit guards — the call resolves cleanly.
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
    'Create a `.env.local` in the project root (see .env.example) and restart `npm run dev`. ' +
    'Auth/profile sync is disabled until configured.',
  );
}

// Minimal error shape — matches what Supabase returns so callers can keep
// destructuring `{ data, error }` without changes.
const NOT_CONFIGURED_ERROR = {
  name: 'NotConfiguredError',
  message: 'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
} as { name: string; message: string };

// --- No-op proxy used when Supabase env vars are missing ---------------------
//
// `createClient('https://invalid.supabase.invalid', 'invalid')` would either
// throw on the network or return a real-looking client that breaks every call.
// Instead we hand back a Proxy that mimics the subset of the SupabaseClient
// surface the app uses and resolves every promise with a `{ data: null, error }`
// shaped result, so callers like `const { data } = await supabase.from(...)`
// keep their type-safety and `error`-check pattern without changing a line.

// `await`-able terminator — every chain ends with one of these methods.
type ThenableResult<T> = Promise<{ data: T; error: null } | { data: null; error: typeof NOT_CONFIGURED_ERROR }>;
const thenable = <T = null>(data: T = null as T): ThenableResult<T> =>
  Promise.resolve({ data, error: null }) as ThenableResult<T>;
const notConfiguredResult = <T = null>(): ThenableResult<T> =>
  Promise.resolve({ data: null, error: NOT_CONFIGURED_ERROR }) as ThenableResult<T>;

// Anything we don't explicitly handle returns a fresh proxy whose methods
// resolve to a "not configured" result. This catches `.eq`, `.order`, `.limit`,
// `.select`, `.insert`, `.update`, `.upsert`, `.delete`, `.match`, `.in`, etc.
const makeQueryProxy = (): unknown =>
  new Proxy({} as object, {
    get(_t, prop) {
      // `then` makes the proxy itself awaitable, which is what callers expect.
      if (prop === 'then') return (resolve: (v: unknown) => void) => resolve(notConfiguredResult());
      if (prop === Symbol.toPrimitive) return () => 'not-configured';
      // Treat `single`, `maybeSingle`, and any bare promise resolution as
      // "not configured". Otherwise return a fresh proxy so chains like
      // `.from('x').select('y').eq('z', 1)` keep working.
      if (prop === Symbol.iterator) return undefined;
      return makeQueryProxy();
    },
  });

// Auth object — every getter/method is a no-op. `getSession` resolves to a
// logged-out session; `onAuthStateChange` registers a listener that never fires
// and returns the unsubscribe handle Supabase callers expect.
const makeAuthStub = () => ({
  getSession: async () => ({ data: { session: null }, error: null }),
  getUser: async () => ({ data: { user: null }, error: null }),
  signOut: async () => ({ error: null }),
  signInWithPassword: async () => notConfiguredResult<null>(),
  signUp: async () => notConfiguredResult<null>(),
  resetPasswordForEmail: async () => notConfiguredResult<null>(),
  onAuthStateChange: (_cb: (event: string, session: unknown) => void) => {
    // In the stub, the listener never fires (no auth state to observe).
    // The return shape mirrors Supabase's `Subscription` so callers can
    // safely call `subscription.unsubscribe()`.
    void _cb;
    return { data: { subscription: { unsubscribe: () => {} } } };
  },
});

const makeStubClient = (): unknown =>
  new Proxy({} as object, {
    get(_t, prop) {
      if (prop === 'auth') return makeAuthStub();
      if (prop === 'storage') return makeQueryProxy();
      if (prop === 'from') return () => makeQueryProxy();
      if (prop === 'rpc') return () => makeQueryProxy();
      if (prop === 'then') return (resolve: (v: unknown) => void) => resolve(thenable(null));
      if (prop === Symbol.toPrimitive) return () => 'not-configured';
      return makeQueryProxy();
    },
  });

export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'cholosikhi-auth',
      },
    })
  : (makeStubClient() as SupabaseClient);
