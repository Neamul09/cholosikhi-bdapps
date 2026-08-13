import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
  initialized: boolean;
  isEmailVerified: boolean;
  setSession: (session: Session | null) => void;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  loading: true,
  initialized: false,
  isEmailVerified: false,

  setSession: (session) => set({
    session,
    user: session?.user ?? null,
    isEmailVerified: !!session?.user?.email_confirmed_at
  }),

  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    set({
      session,
      user: session?.user ?? null,
      loading: false,
      initialized: true,
      isEmailVerified: !!session?.user?.email_confirmed_at
    });

    supabase.auth.onAuthStateChange((event, session) => {
      const eventName = event as string;

      if (eventName === 'SIGNED_OUT' || session === null) {
        set({ session: null, user: null, isEmailVerified: false });
        return;
      }

      const previousUser = get().user;
      const wasUnconfirmed =
        !!previousUser && !previousUser.email_confirmed_at;
      const isNowConfirmed = !!session?.user?.email_confirmed_at;

      if (
        (eventName === 'USER_UPDATED' || eventName === 'EMAIL_CONFIRM') &&
        wasUnconfirmed &&
        isNowConfirmed
      ) {
        set({ session: null, user: null, isEmailVerified: false });
        supabase.auth.signOut().catch(() => {});
        return;
      }

      set({
        session,
        user: session?.user ?? null,
        isEmailVerified: !!session?.user?.email_confirmed_at
      });
    });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, isEmailVerified: false });
  }
}));
