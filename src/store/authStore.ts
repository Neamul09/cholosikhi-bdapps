import { create } from 'zustand';
import { bdappsService, formatMobileNumber, type BdappsCheckSubResponse } from '@/services/bdappsService';
import { supabase } from '@/lib/supabase';
import { useUserStore } from './userStore';

export interface UserSession {
  id: string;
  mobile: string;
  name: string;
  subscriptionStatus: string;
  isSubscribed: boolean;
}

interface AuthState {
  session: UserSession | null;
  user: { id: string; mobile: string; name: string } | null;
  subscriptionStatus: string | null;
  isSubscribed: boolean;
  loading: boolean;
  initialized: boolean;
  pendingMobile: string;
  referenceNo: string;

  // Actions
  setSession: (session: UserSession | null) => void;
  initialize: () => Promise<void>;
  checkMobileSubscription: (mobile: string) => Promise<BdappsCheckSubResponse>;
  sendOtp: (mobile: string) => Promise<{ success: boolean; alreadyRegistered?: boolean; referenceNo?: string; error?: string }>;
  verifyOtp: (otp: string, refNo?: string) => Promise<{ success: boolean; error?: string }>;
  registerAccount: (password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  loginWithPassword: (mobile: string, password: string) => Promise<{ success: boolean; status?: string; isSubscribed?: boolean; requiresPasswordSetup?: boolean; error?: string }>;
  signOut: () => Promise<void>;
  unsubscribe: () => Promise<{ success: boolean; error?: string }>;
}

const STORAGE_SESSION_KEY = 'cholosikhi_bdapps_session';
const STORAGE_USERS_KEY = 'cholosikhi_users_db';

interface StoredUser {
  id: string;
  mobile: string;
  password_hash: string;
  name: string;
  registeredAt: string;
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function getLocalUsers(): Record<string, StoredUser> {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalUser(user: StoredUser) {
  try {
    const users = getLocalUsers();
    users[user.mobile] = user;
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save local user', err);
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  subscriptionStatus: null,
  isSubscribed: false,
  loading: true,
  initialized: false,
  pendingMobile: '',
  referenceNo: '',

  setSession: (session) => {
    if (session) {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
      set({
        session,
        user: { id: session.id, mobile: session.mobile, name: session.name },
        subscriptionStatus: session.subscriptionStatus,
        isSubscribed: session.isSubscribed,
      });

      // Synchronize logged-in user's name with userStore
      if (session.name) {
        useUserStore.setState({ name: session.name });
      }
    } else {
      localStorage.removeItem(STORAGE_SESSION_KEY);
      set({
        session: null,
        user: null,
        subscriptionStatus: null,
        isSubscribed: false,
      });
    }
  },

  initialize: async () => {
    set({ loading: true });
    try {
      const rawSession = localStorage.getItem(STORAGE_SESSION_KEY);
      if (rawSession) {
        const savedSession: UserSession = JSON.parse(rawSession);
        // Fetch fresh profile from Supabase DB to ensure user's name is up to date
        try {
          const { data: dbUser } = await supabase
            .from('bdapps_users')
            .select('name')
            .eq('mobile', savedSession.mobile)
            .maybeSingle();
          if (dbUser?.name) {
            savedSession.name = dbUser.name;
          }
        } catch {
          // ignore DB read error
        }

        // Verify active subscription from BDApps server
        const subRes = await bdappsService.checkSubscription(savedSession.mobile);
        const currentStatus = subRes.subscriptionStatus || 'UNREGISTERED';
        const active = currentStatus === 'REGISTERED' || !!subRes.isSubscribed;
        const isRegistered = subRes.isRegistered || currentStatus !== 'UNREGISTERED';

        if (isRegistered) {
          const updatedSession: UserSession = {
            ...savedSession,
            subscriptionStatus: currentStatus,
            isSubscribed: active,
          };
          get().setSession(updatedSession);
        } else {
          // Unsubscribed remotely
          get().setSession(null);
          set({
            subscriptionStatus: 'UNREGISTERED',
            isSubscribed: false,
          });
        }
      }
    } catch (err) {
      console.error('Auth initialization error:', err);
    } finally {
      set({ loading: false, initialized: true });
    }
  },

  checkMobileSubscription: async (mobile: string) => {
    const formatted = formatMobileNumber(mobile);
    set({ pendingMobile: formatted });
    const res = await bdappsService.checkSubscription(formatted);
    const status = res.subscriptionStatus || 'UNREGISTERED';
    const isSub = status === 'REGISTERED' || !!res.isSubscribed;
    set({
      subscriptionStatus: status,
      isSubscribed: isSub,
    });
    return res;
  },

  sendOtp: async (mobile: string) => {
    const formatted = formatMobileNumber(mobile);
    set({ pendingMobile: formatted });
    const res = await bdappsService.sendOtp(formatted);
    if (res.alreadyRegistered) {
      return { success: false, alreadyRegistered: true, error: 'user already registered' };
    }
    if (res.success && res.referenceNo) {
      set({ referenceNo: res.referenceNo });
      return { success: true, referenceNo: res.referenceNo };
    }
    return { success: false, error: res.statusDetail || res.error || 'OTP request failed' };
  },

  verifyOtp: async (otp: string, refNo?: string) => {
    const reference = refNo || get().referenceNo;
    if (!reference) {
      return { success: false, error: 'Missing reference number for OTP verification' };
    }
    const res = await bdappsService.verifyOtp(otp, reference);
    if (res.statusCode === 'S1000' || res.subscriptionStatus === 'REGISTERED') {
      set({
        subscriptionStatus: 'REGISTERED',
        isSubscribed: true,
      });
      return { success: true };
    }
    return {
      success: false,
      error: res.statusDetail || 'Invalid OTP. Please try again.',
    };
  },

  registerAccount: async (password: string, name: string) => {
    const mobile = get().pendingMobile;
    if (!mobile) {
      return { success: false, error: 'Mobile number not found' };
    }
    if (!password || password.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters' };
    }

    const userId = `usr_${mobile.replace(/\D/g, '')}`;
    const password_hash = await hashPassword(password);
    const userName = name || 'Learner';

    const newUser: StoredUser = {
      id: userId,
      mobile,
      password_hash,
      name: userName,
      registeredAt: new Date().toISOString(),
    };

    // Save to Local Storage
    saveLocalUser(newUser);

    // Save to Supabase DB (bdapps_users table)
    try {
      await supabase.from('bdapps_users').upsert({
        id: userId,
        mobile,
        password_hash,
        name: userName,
        subscription_status: get().subscriptionStatus || 'REGISTERED',
        updated_at: new Date().toISOString(),
      });
    } catch (dbErr) {
      console.warn('Supabase DB save fallback:', dbErr);
    }

    const session: UserSession = {
      id: userId,
      mobile,
      name: userName,
      subscriptionStatus: get().subscriptionStatus || 'REGISTERED',
      isSubscribed: get().subscriptionStatus === 'REGISTERED' || get().isSubscribed,
    };

    get().setSession(session);
    return { success: true };
  },

  loginWithPassword: async (mobile: string, password: string) => {
    const formatted = formatMobileNumber(mobile);
    const inputHash = await hashPassword(password);

    // Check BDApps subscription status first
    const subRes = await bdappsService.checkSubscription(formatted);
    const status = subRes.subscriptionStatus || 'UNREGISTERED';
    const isSub = status === 'REGISTERED' || !!subRes.isSubscribed;

    // 1. Try fetching user profile from Supabase DB first
    let dbUser: any = null;
    try {
      const { data } = await supabase
        .from('bdapps_users')
        .select('*')
        .eq('mobile', formatted)
        .maybeSingle();
      dbUser = data;
    } catch (err) {
      console.warn('Supabase select error:', err);
    }

    // 2. Fallback to Local Storage if not found in Supabase
    if (!dbUser) {
      const localUsers = getLocalUsers();
      dbUser = localUsers[formatted];
    }

    // 3. If user profile with password_hash exists in DB or LocalStorage
    if (dbUser && (dbUser.password_hash || dbUser.password)) {
      const match = dbUser.password_hash === inputHash || dbUser.password === password;
      if (!match) {
        return { success: false, error: 'Incorrect password. Please try again.' };
      }

      const session: UserSession = {
        id: dbUser.id || `usr_${formatted.replace(/\D/g, '')}`,
        mobile: formatted,
        name: dbUser.name || 'Learner',
        subscriptionStatus: status,
        isSubscribed: isSub,
      };

      get().setSession(session);
      set({
        subscriptionStatus: status,
        isSubscribed: isSub,
      });
      return { success: true, status, isSubscribed: isSub };
    }

    // 4. If password hash is NOT found in the database (or user profile hasn't set password yet)
    if (subRes.isRegistered || status !== 'UNREGISTERED') {
      return {
        success: false,
        requiresPasswordSetup: true,
        error: 'No password set for this account yet. Please create a password to complete setup.',
      };
    }

    return {
      success: false,
      status: 'UNREGISTERED',
      error: 'No active subscription found for this mobile number.',
    };
  },

  signOut: async () => {
    get().setSession(null);
  },

  unsubscribe: async () => {
    const session = get().session;
    const mobile = session?.mobile || get().pendingMobile;

    if (!mobile) {
      get().setSession(null);
      return { success: true };
    }

    const res = await bdappsService.unsubscribe(mobile);
    get().setSession(null);
    set({
      subscriptionStatus: 'UNREGISTERED',
      isSubscribed: false,
    });

    if (res.success || res.subscriptionStatus === 'UNREGISTERED' || res.statusCode === 'S1000' || res.statusCode === 'E1356') {
      return { success: true };
    }
    return { success: false, error: res.statusDetail || 'Unsubscribe failed' };
  },
}));
