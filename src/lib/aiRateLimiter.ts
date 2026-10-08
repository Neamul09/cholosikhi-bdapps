/**
 * CholoSikhi AI Tutor Daily Rate Limiter
 * Enforces a daily quota (e.g. 20 queries/day) per user with midnight resets.
 */

export const DAILY_AI_QUERY_LIMIT = 20;

export interface AiUsageStatus {
  used: number;
  remaining: number;
  max: number;
  isLimitReached: boolean;
  resetsAt: string;
}

function getTodayKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getStorageKey(userId?: string): string {
  const cleanId = (userId || 'guest').replace(/[^a-zA-Z0-9_-]/g, '_');
  return `cs_ai_daily_usage_${cleanId}`;
}

/**
 * Returns the current daily AI usage status for the specified user
 */
export function getDailyAiUsage(userId?: string): AiUsageStatus {
  if (typeof window === 'undefined') {
    return {
      used: 0,
      remaining: DAILY_AI_QUERY_LIMIT,
      max: DAILY_AI_QUERY_LIMIT,
      isLimitReached: false,
      resetsAt: 'Midnight',
    };
  }

  const today = getTodayKey();
  const key = getStorageKey(userId);

  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return {
        used: 0,
        remaining: DAILY_AI_QUERY_LIMIT,
        max: DAILY_AI_QUERY_LIMIT,
        isLimitReached: false,
        resetsAt: 'Midnight',
      };
    }

    const data = JSON.parse(raw);
    if (data.date !== today) {
      // New day: reset usage
      const freshData = { date: today, used: 0 };
      localStorage.setItem(key, JSON.stringify(freshData));
      return {
        used: 0,
        remaining: DAILY_AI_QUERY_LIMIT,
        max: DAILY_AI_QUERY_LIMIT,
        isLimitReached: false,
        resetsAt: 'Midnight',
      };
    }

    const used = typeof data.used === 'number' ? data.used : 0;
    const remaining = Math.max(0, DAILY_AI_QUERY_LIMIT - used);
    return {
      used,
      remaining,
      max: DAILY_AI_QUERY_LIMIT,
      isLimitReached: remaining <= 0,
      resetsAt: 'Midnight',
    };
  } catch {
    return {
      used: 0,
      remaining: DAILY_AI_QUERY_LIMIT,
      max: DAILY_AI_QUERY_LIMIT,
      isLimitReached: false,
      resetsAt: 'Midnight',
    };
  }
}

/**
 * Increments AI usage count by 1 for the user and broadcasts change
 */
export function incrementDailyAiUsage(userId?: string): AiUsageStatus {
  if (typeof window === 'undefined') {
    return getDailyAiUsage(userId);
  }

  const today = getTodayKey();
  const key = getStorageKey(userId);
  let currentUsed = 0;

  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const data = JSON.parse(raw);
      if (data.date === today && typeof data.used === 'number') {
        currentUsed = data.used;
      }
    }
  } catch {
    currentUsed = 0;
  }

  const newUsed = currentUsed + 1;
  const freshRecord = { date: today, used: newUsed };

  try {
    localStorage.setItem(key, JSON.stringify(freshRecord));
    window.dispatchEvent(new CustomEvent('cs_ai_usage_updated', { detail: freshRecord }));
  } catch (err) {
    console.warn('Failed to save AI usage quota', err);
  }

  const remaining = Math.max(0, DAILY_AI_QUERY_LIMIT - newUsed);
  return {
    used: newUsed,
    remaining,
    max: DAILY_AI_QUERY_LIMIT,
    isLimitReached: remaining <= 0,
    resetsAt: 'Midnight',
  };
}

/**
 * Checks if the user is allowed to make another AI query today
 */
export function canMakeAiRequest(userId?: string): boolean {
  const status = getDailyAiUsage(userId);
  return !status.isLimitReached;
}
