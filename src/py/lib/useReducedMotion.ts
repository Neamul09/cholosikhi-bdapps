import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(callback: () => void): () => void {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return () => {};
  }
  const mq = window.matchMedia(QUERY);
  if (mq.addEventListener) {
    mq.addEventListener('change', callback);
    return () => mq.removeEventListener('change', callback);
  }
  // Older Safari
  mq.addListener(callback);
  return () => mq.removeListener(callback);
}

function getSnapshot(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * Subscribe to the OS-level "prefers-reduced-motion" preference.
 * Use this to gate Framer Motion / CSS transitions for users who
 * have requested minimal motion in their system settings.
 *
 *   const reduced = useReducedMotion();
 *   <motion.div animate={reduced ? undefined : { y: [0, -8, 0] }} />
 *
 * Returns `false` on the server and during SSR, then synchronously
 * reflects the live value via `useSyncExternalStore`.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
