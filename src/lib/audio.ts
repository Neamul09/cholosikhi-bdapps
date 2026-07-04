/**
 * Audio engine — Duolingo-style UI sound effects.
 *
 * Sounds are pre-encoded MP3 (primary) + OGG (fallback) files placed in
 * `/public/sounds/`. Source: Kenney "Interface Sounds" (CC0).
 * See `public/sounds/CREDITS.md` for the full file-to-effect mapping and
 * licensing details.
 *
 * The engine keeps a small pool of <audio> elements per effect so rapid
 * retries (e.g. rapid XP ticks) overlap cleanly without restarting playback
 * or skipping when an instance is still busy.
 *
 * This module is **store-agnostic** — it owns its own `enabled` flag and
 * exposes `setSoundEnabled(v)` so callers (Zustand stores, React state,
 * or any other source of truth) can push their preference in. Default is
 * `true` so users hear UI feedback immediately.
 *
 * Browser autoplay policy is respected: `unlockAudio()` must be called
 * from the first user gesture (e.g. a `pointerdown`/`keydown` listener)
 * before `play()` will actually emit audio.
 */

export type SoundName =
  | 'tap'
  | 'correct'
  | 'incorrect'
  | 'levelUp'
  | 'lessonComplete'
  | 'achievement'
  | 'xpTick'
  | 'streak'
  | 'toggle';

/** Module-level enabled flag. Default off; callers push via `setSoundEnabled`. */
let enabled = false;
/** Subscribers that want to mirror the value (e.g. UI store listeners). */
type EnabledListener = (v: boolean) => void;
const enabledListeners = new Set<EnabledListener>();

/** Read the current enabled flag (no side effects). */
export const getSoundEnabled = (): boolean => enabled;

/**
 * Push a new enabled value into the audio engine. Fires all registered
 * listeners so callers can mirror state if they want. Safe to call
 * repeatedly; idempotent on equal values.
 */
export const setSoundEnabled = (value: boolean): void => {
  const next = !!value;
  if (next === enabled) return;
  enabled = next;
  enabledListeners.forEach((fn) => {
    try { fn(next); } catch { /* noop */ }
  });
};

/** Subscribe to enabled changes; returns an unsubscribe fn. */
export const subscribeSoundEnabled = (fn: EnabledListener): (() => void) => {
  enabledListeners.add(fn);
  return () => { enabledListeners.delete(fn); };
};

/** URL resolver — public assets resolve from the site root. */
const urlFor = (name: SoundName, ext: 'mp3' | 'ogg') =>
  `/sounds/${name}.${ext}`;

/** Detects once which format the current browser prefers. */
let preferredFormat: 'mp3' | 'ogg' | null = null;
const getPreferredFormat = (): 'mp3' | 'ogg' => {
  if (preferredFormat) return preferredFormat;
  if (typeof window === 'undefined') return 'mp3';
  const a = document.createElement('audio');
  // OGG is ~30% smaller and supported by all evergreen browsers except Safari.
  // MP3 is the universal fallback. Pick the first that returns "probably".
  if (a.canPlayType('audio/ogg; codecs="vorbis"')) preferredFormat = 'ogg';
  else preferredFormat = 'mp3';
  return preferredFormat;
};

/** Per-effect <audio> pool — each item is a fully-loaded Audio element. */
const pool = new Map<SoundName, HTMLAudioElement[]>();
const POOL_SIZE = 3; // small — UI sfx don't overlap much

const buildAudio = (name: SoundName): HTMLAudioElement => {
  const fmt = getPreferredFormat();
  const a = new Audio(urlFor(name, fmt));
  a.preload = 'auto';
  a.volume = 0.9;
  // Mirror `src` to the other format so the browser has a fallback if the
  // primary fails to decode (rare, but covers codec bugs on edge cases).
  const other = fmt === 'mp3' ? 'ogg' : 'mp3';
  const inner = document.createElement('source');
  inner.src = urlFor(name, other);
  inner.type = other === 'mp3' ? 'audio/mpeg' : 'audio/ogg';
  a.appendChild(inner);
  return a;
};

const getPool = (name: SoundName): HTMLAudioElement[] => {
  let arr = pool.get(name);
  if (arr) return arr;
  arr = [];
  for (let i = 0; i < POOL_SIZE; i++) arr.push(buildAudio(name));
  pool.set(name, arr);
  return arr;
};

/**
 * Browsers block programmatic audio until a user gesture. Call this from a
 * `pointerdown`/`keydown`/`click` listener to "unlock" audio so future
 * `play()` calls actually emit sound. Safe to call repeatedly.
 */
export const unlockAudio = (): void => {
  if (typeof window === 'undefined') return;
  // Build + load every effect once at unlock time — this guarantees playback
  // is instant when the user later taps a button, with no fetch delay.
  try {
    (Object.keys({
      tap: 0, correct: 0, incorrect: 0, levelUp: 0, lessonComplete: 0,
      achievement: 0, xpTick: 0, streak: 0, toggle: 0,
    }) as SoundName[]).forEach((n) => {
      getPool(n).forEach((a) => {
        // Setting currentTime forces the element into a decoded state on
        // mobile browsers (iOS Safari quirk).
        a.currentTime = 0;
        // Touch preloading on mobile — load() is idempotent.
        if (a.readyState < 2) a.load();
      });
    });
  } catch {
    /* noop — never throw from audio */
  }
};

/**
 * Play a named sound. No-op if sound is disabled. Pool behaviour: picks
 * the first non-playing element. If all are busy, the oldest one is
 * force-restarted so rapid-fire clicks never silently fail.
 */
export const play = (name: SoundName): void => {
  if (!enabled) return;
  if (typeof window === 'undefined') return;

  const arr = getPool(name);
  let chosen: HTMLAudioElement | null = null;
  for (const a of arr) {
    if (a.paused && a.readyState >= 2) {
      chosen = a;
      break;
    }
  }
  // Fallback: reset the first one and use it.
  if (!chosen) {
    chosen = arr[0];
    try {
      chosen.pause();
      chosen.currentTime = 0;
    } catch {
      /* noop */
    }
  }
  // The try/catch covers autoplay rejection (e.g. unlockAudio not yet called)
  // and NotAllowedError on Safari when no gesture preceded the call.
  try {
    // Reset to start in case it's a paused-but-not-finished element.
    if (chosen.currentTime > 0) chosen.currentTime = 0;
    const p = chosen.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  } catch {
    /* never throw from audio */
  }
};