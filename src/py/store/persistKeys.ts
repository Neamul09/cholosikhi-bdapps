/**
 * Central registry of every zustand `persist` storage key used in this app.
 *
 * Why a registry? `resetAccount()` needs to wipe every cached store on the
 * device. Hard-coding keys there means a future store (or a key rename) can
 * silently leak after a reset. Adding the key here makes the dependency explicit.
 *
 * Keep this file as the single source of truth — update it any time a persist
 * storage key changes.
 */
export const PERSIST_KEYS = [
  'py-cholosikhi-user',
  'py-cholosikhi-progress',
  'py-cholosikhi-quests',
  'py-cholosikhi-settings',
] as const;

export type PersistKey = (typeof PERSIST_KEYS)[number];

export function clearAllPersistedState(): void {
  for (const key of PERSIST_KEYS) {
    try {
      localStorage.removeItem(key);
    } catch {
      // localStorage may be unavailable (SSR, private mode, quota); fail silent.
    }
  }
}
