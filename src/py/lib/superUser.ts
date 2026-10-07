import { useAuthStore } from '@/store/authStore';

export const SUPER_USER_EMAIL = 'neamulmorshed@gmail.com';
export const SUPER_USER_MOBILES = ['01887349141', '8801887349141', '+8801887349141'];

/**
 * Validates if a given email is the privileged superuser email.
 */
export function isSuperUserEmail(email?: string | null): boolean {
  if (!email || typeof email !== 'string') return false;
  return email.trim().toLowerCase() === SUPER_USER_EMAIL;
}

export function isSuperUserMobile(mobile?: string | null): boolean {
  if (!mobile || typeof mobile !== 'string') return false;
  const clean = mobile.replace(/[^0-9]/g, '');
  return SUPER_USER_MOBILES.some(m => m.replace(/[^0-9]/g, '') === clean);
}

/**
 * Checks synchronously whether the active user session or client matches neamulmorshed@gmail.com or superuser mobile.
 * Checks active Zustand authStore, localStorage, URL query params, and Supabase auth tokens.
 */
export function isCurrentSuperUser(): boolean {
  // 1. Check URL query parameters (e.g. ?email=neamulmorshed@gmail.com)
  if (typeof window !== 'undefined' && window.location?.search) {
    try {
      const params = new URLSearchParams(window.location.search);
      const queryEmail = params.get('email');
      if (isSuperUserEmail(queryEmail)) {
        localStorage.setItem('cholosikhi_user_email', SUPER_USER_EMAIL);
        return true;
      }
    } catch {
      // Ignore URL parsing errors
    }
  }

  // 2. Check active Zustand auth store
  try {
    const authUser = useAuthStore.getState().user;
    if (isSuperUserEmail(authUser?.email) || isSuperUserMobile(authUser?.mobile)) {
      return true;
    }
  } catch {
    // Ignore store access errors in non-react environments
  }

  // 3. Check client localStorage entries
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const explicitEmail = 
        localStorage.getItem('cholosikhi_user_email') || 
        localStorage.getItem('user_email');
      if (isSuperUserEmail(explicitEmail)) {
        return true;
      }

      // Check Supabase cached session in localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
          const raw = localStorage.getItem(key);
          if (raw && raw.toLowerCase().includes(SUPER_USER_EMAIL)) {
            return true;
          }
        }
      }
    } catch {
      // Ignore localStorage access restrictions
    }
  }

  return false;
}

/**
 * React hook that returns true if the current user is neamulmorshed@gmail.com,
 * reactive to auth store changes.
 */
export function useIsSuperUser(): boolean {
  const user = useAuthStore((s) => s.user);
  return isSuperUserEmail(user?.email) || isSuperUserMobile(user?.mobile) || isCurrentSuperUser();
}
