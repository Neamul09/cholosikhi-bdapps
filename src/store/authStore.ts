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

export const useAuthStore = create<AuthState>((set) => ({
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
      // On SIGNED_IN, check if this came from an email confirmation link
      // If the event is EMAIL_CONFIRM or similar confirmation events, we block auto-login
      // We detect this by checking if it's a SIGNED_IN with a fresh confirmation
      const isEmailConfirmEvent = (event as string) === 'EMAIL_CONFIRM' || (event as string) === 'USER_UPDATED';
      if (isEmailConfirmEvent) {
        // Don't auto-login; send user to auth page to log in manually
        set({ session: null, user: null, isEmailVerified: false });
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
