/**
 * CholoSikhi Advanced Stealth Telemetry & User Analytics Engine
 *
 * 100% cookie-free, privacy-first, zero-footprint tracking.
 * Captures social reel traffic (Instagram, Facebook, TikTok, direct),
 * in-app browsers, learning progression funnels, and device profiles.
 *
 * Automatically reports to:
 * 1. Vercel Web Analytics (window.va)
 * 2. PostHog (if configured via VITE_POSTHOG_KEY)
 * 3. Local In-App Telemetry Store (for Superuser Admin Dashboard)
 * 4. Supabase telemetry table (if configured)
 */

import { supabase, isSupabaseConfigured } from './supabase';

export type EventName =
  | 'page_view'
  | 'reel_visitor_arrival'
  | 'signup'
  | 'login'
  | 'lesson_start'
  | 'lesson_complete'
  | 'exercise_answered'
  | 'quest_claim'
  | 'level_up'
  | 'streak_increment'
  | 'code_run'
  | 'shop_purchase'
  | 'exam_start'
  | 'exam_complete'
  | 'certificate_view'
  | 'certificate_download'
  | 'certificate_share'
  | 'feedback_submitted';

export interface EventProperties {
  [key: string]: string | number | boolean | null | undefined;
}

export interface TelemetryContext {
  visitorId: string;
  sessionId: string;
  source: string;
  medium: string;
  campaign?: string;
  isReelTraffic: boolean;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  platform: string;
  screen: string;
  referrer: string;
  landingUrl: string;
  timestamp: number;
}

export interface StoredTelemetryEvent {
  id: string;
  name: EventName;
  properties?: EventProperties;
  context: TelemetryContext;
  timestamp: number;
}

export interface AnalyticsSummary {
  totalEvents: number;
  totalVisits: number;
  uniqueVisitors: number;
  reelVisits: number;
  lastVisitTime: number;
  sources: Record<string, number>;
  devices: Record<string, number>;
  platforms: Record<string, number>;
  funnel: {
    landed: number;
    lessonStarted: number;
    lessonCompleted: number;
    codeRan: number;
    examTaken: number;
    certificateEarned: number;
  };
}

const STORAGE_KEYS = {
  VISITOR_ID: 'cholosikhi_vid',
  SESSION_ID: 'cholosikhi_sid',
  ATTRIBUTION: 'cholosikhi_attr',
  EVENTS_BUFFER: 'cholosikhi_telemetry_events',
  SUMMARY: 'cholosikhi_telemetry_summary',
};

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
const POSTHOG_HOST = (import.meta.env.VITE_POSTHOG_HOST as string | undefined) || 'https://app.posthog.com';

let isInitialized = false;

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'cs_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

/**
 * Detects traffic sources, social reels, and UTM campaigns
 */
export function detectTrafficSource(): { source: string; medium: string; isReelTraffic: boolean; campaign?: string } {
  if (typeof window === 'undefined') {
    return { source: 'direct', medium: 'none', isReelTraffic: false };
  }

  const urlParams = new URLSearchParams(window.location.search);
  const refParam = urlParams.get('ref') || urlParams.get('source');
  const srcParam = urlParams.get('src');
  const utmSource = urlParams.get('utm_source');
  const utmMedium = urlParams.get('utm_medium');
  const utmCampaign = urlParams.get('utm_campaign');

  const referrer = (document.referrer || '').toLowerCase();
  const userAgent = (navigator.userAgent || '').toLowerCase();

  // 1. Explicit cross-domain or campaign parameters (?ref=reel or ?src=instagram)
  if (refParam?.toLowerCase() === 'reel' || utmCampaign?.toLowerCase().includes('reel') || utmMedium?.toLowerCase().includes('reel')) {
    return {
      source: srcParam || utmSource || 'social_reel',
      medium: utmMedium || 'reel',
      campaign: utmCampaign || 'reel_launch',
      isReelTraffic: true,
    };
  }

  // 2. In-App Social Browsers (Instagram In-App Browser, Facebook Mobile, TikTok)
  if (userAgent.includes('instagram')) {
    return { source: 'instagram', medium: 'inapp_reel', isReelTraffic: true, campaign: utmCampaign || 'instagram_organic' };
  }
  if (userAgent.includes('fban') || userAgent.includes('fbav')) {
    return { source: 'facebook', medium: 'inapp_reel', isReelTraffic: true, campaign: utmCampaign || 'facebook_organic' };
  }
  if (userAgent.includes('bytedance') || userAgent.includes('musical_ly') || userAgent.includes('tiktok')) {
    return { source: 'tiktok', medium: 'inapp_reel', isReelTraffic: true, campaign: utmCampaign || 'tiktok_organic' };
  }

  // 3. Document Referrers
  if (referrer.includes('instagram.com') || referrer.includes('l.instagram.com')) {
    return { source: 'instagram', medium: 'social', isReelTraffic: true, campaign: utmCampaign || 'instagram_feed' };
  }
  if (referrer.includes('facebook.com') || referrer.includes('l.facebook.com') || referrer.includes('m.facebook.com')) {
    return { source: 'facebook', medium: 'social', isReelTraffic: true, campaign: utmCampaign || 'facebook_feed' };
  }
  if (referrer.includes('tiktok.com')) {
    return { source: 'tiktok', medium: 'social', isReelTraffic: true, campaign: utmCampaign || 'tiktok_video' };
  }
  if (referrer.includes('youtube.com') || referrer.includes('youtu.be')) {
    return { source: 'youtube', medium: 'social', isReelTraffic: true, campaign: utmCampaign || 'youtube_shorts' };
  }
  if (referrer.includes('cholosikhi.com')) {
    // Coming from main landing page
    return { source: srcParam || 'cholosikhi_main', medium: 'landing_handoff', isReelTraffic: refParam === 'reel', campaign: utmCampaign || undefined };
  }
  if (referrer.includes('google.com') || referrer.includes('bing.com')) {
    return { source: 'search_engine', medium: 'organic', isReelTraffic: false, campaign: utmCampaign || undefined };
  }

  if (utmSource || srcParam) {
    const s = srcParam || utmSource || 'referral';
    return {
      source: s,
      medium: utmMedium || 'referral',
      isReelTraffic: Boolean(s.includes('reel') || utmMedium?.includes('reel')),
      campaign: utmCampaign || undefined,
    };
  }

  return { source: 'direct', medium: 'none', isReelTraffic: false };
}

/**
 * Detects device hardware profile and environment
 */
export function getDeviceDetails(): { deviceType: 'mobile' | 'tablet' | 'desktop'; platform: string; screen: string } {
  if (typeof window === 'undefined') {
    return { deviceType: 'desktop', platform: 'unknown', screen: '0x0' };
  }

  const ua = navigator.userAgent || '';
  const width = window.innerWidth;

  let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua) || width < 640) {
    deviceType = 'mobile';
  } else if (/ipad|tablet|playbook|silk/i.test(ua) || (width >= 640 && width <= 1024)) {
    deviceType = 'tablet';
  }

  let platform = 'unknown';
  if (/iphone|ipad|ipod/i.test(ua)) platform = 'ios';
  else if (/android/i.test(ua)) platform = 'android';
  else if (/macintosh|mac os x/i.test(ua)) platform = 'mac';
  else if (/windows/i.test(ua)) platform = 'windows';
  else if (/linux/i.test(ua)) platform = 'linux';

  return {
    deviceType,
    platform,
    screen: `${window.screen?.width || width}x${window.screen?.height || window.innerHeight}`,
  };
}

/**
 * Gets or establishes active visitor telemetry context
 */
export function getOrCreateContext(): TelemetryContext {
  if (typeof window === 'undefined') {
    return {
      visitorId: 'server',
      sessionId: 'server',
      source: 'direct',
      medium: 'none',
      isReelTraffic: false,
      deviceType: 'desktop',
      platform: 'unknown',
      screen: '0x0',
      referrer: '',
      landingUrl: '',
      timestamp: Date.now(),
    };
  }

  let visitorId = localStorage.getItem(STORAGE_KEYS.VISITOR_ID);
  if (!visitorId) {
    visitorId = generateId();
    localStorage.setItem(STORAGE_KEYS.VISITOR_ID, visitorId);
  }

  let sessionId = sessionStorage.getItem(STORAGE_KEYS.SESSION_ID);
  if (!sessionId) {
    sessionId = generateId();
    sessionStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId);
  }

  let traffic: { source: string; medium: string; isReelTraffic: boolean; campaign?: string };
  const storedAttr = sessionStorage.getItem(STORAGE_KEYS.ATTRIBUTION);
  if (storedAttr) {
    try {
      traffic = JSON.parse(storedAttr);
    } catch {
      traffic = detectTrafficSource();
    }
  } else {
    traffic = detectTrafficSource();
    sessionStorage.setItem(STORAGE_KEYS.ATTRIBUTION, JSON.stringify(traffic));
  }

  const device = getDeviceDetails();

  return {
    visitorId,
    sessionId,
    source: traffic.source,
    medium: traffic.medium,
    campaign: traffic.campaign,
    isReelTraffic: traffic.isReelTraffic,
    deviceType: device.deviceType,
    platform: device.platform,
    screen: device.screen,
    referrer: document.referrer || '',
    landingUrl: window.location.href,
    timestamp: Date.now(),
  };
}

/**
 * Reads aggregated summary from local storage or returns a fresh blank summary
 */
export function getAnalyticsSummary(): AnalyticsSummary {
  const defaultSummary: AnalyticsSummary = {
    totalEvents: 0,
    totalVisits: 0,
    uniqueVisitors: 0,
    reelVisits: 0,
    lastVisitTime: Date.now(),
    sources: {},
    devices: {},
    platforms: {},
    funnel: {
      landed: 0,
      lessonStarted: 0,
      lessonCompleted: 0,
      codeRan: 0,
      examTaken: 0,
      certificateEarned: 0,
    },
  };

  if (typeof window === 'undefined') return defaultSummary;

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUMMARY);
    if (!raw) return defaultSummary;
    return { ...defaultSummary, ...JSON.parse(raw) };
  } catch {
    return defaultSummary;
  }
}

/**
 * Reads recent event log from local buffer
 */
export function getRecentEvents(limit = 100): StoredTelemetryEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EVENTS_BUFFER);
    if (!raw) return [];
    const list: StoredTelemetryEvent[] = JSON.parse(raw);
    return list.slice(0, limit);
  } catch {
    return [];
  }
}

/**
 * Clears local telemetry storage (useful for admin testing)
 */
export function clearAnalyticsData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.EVENTS_BUFFER);
  localStorage.removeItem(STORAGE_KEYS.SUMMARY);
}

/**
 * Exports full telemetry records as a downloadable JSON file
 */
export function exportAnalyticsData(): void {
  if (typeof window === 'undefined') return;
  const summary = getAnalyticsSummary();
  const events = getRecentEvents(500);
  const data = {
    exportDate: new Date().toISOString(),
    summary,
    events,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cholosikhi-analytics-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Updates aggregated summary metrics in local storage
 */
function updateSummaryMetrics(name: EventName, context: TelemetryContext): void {
  try {
    const summary = getAnalyticsSummary();
    summary.totalEvents += 1;
    summary.lastVisitTime = Date.now();

    // Source tally
    const srcKey = context.source || 'direct';
    summary.sources[srcKey] = (summary.sources[srcKey] || 0) + 1;

    // Device & Platform tally
    const devKey = context.deviceType || 'desktop';
    summary.devices[devKey] = (summary.devices[devKey] || 0) + 1;

    const platKey = context.platform || 'unknown';
    summary.platforms[platKey] = (summary.platforms[platKey] || 0) + 1;

    // Funnel progression
    if (name === 'page_view' || name === 'reel_visitor_arrival') {
      summary.funnel.landed += 1;
      if (context.isReelTraffic) {
        summary.reelVisits += 1;
      }
    } else if (name === 'lesson_start') {
      summary.funnel.lessonStarted += 1;
    } else if (name === 'lesson_complete') {
      summary.funnel.lessonCompleted += 1;
    } else if (name === 'code_run') {
      summary.funnel.codeRan += 1;
    } else if (name === 'exam_start') {
      summary.funnel.examTaken += 1;
    } else if (name === 'exam_complete' || name === 'certificate_view') {
      summary.funnel.certificateEarned += 1;
    }

    localStorage.setItem(STORAGE_KEYS.SUMMARY, JSON.stringify(summary));
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Initializes the analytics engine on application boot
 */
export function initAnalytics() {
  if (isInitialized || typeof window === 'undefined') return;

  const context = getOrCreateContext();

  // Update session & visitor counters on first load of session
  const sessionFlagKey = 'cs_session_started_' + context.sessionId;
  if (!sessionStorage.getItem(sessionFlagKey)) {
    sessionStorage.setItem(sessionFlagKey, '1');
    const summary = getAnalyticsSummary();
    summary.totalVisits += 1;
    localStorage.setItem(STORAGE_KEYS.SUMMARY, JSON.stringify(summary));
  }

  // Optional PostHog init
  if (POSTHOG_KEY) {
    try {
      const script = document.createElement('script');
      script.async = true;
      script.src = `${POSTHOG_HOST}/static/array.js`;
      script.onload = () => {
        const w = window as unknown as { posthog?: { init: (k: string, opt: object) => void } };
        w.posthog?.init(POSTHOG_KEY, {
          api_host: POSTHOG_HOST,
          autocapture: false,
          capture_pageview: true,
        });
      };
      document.head.appendChild(script);
    } catch {
      // Ignore load errors
    }
  }

  isInitialized = true;

  // Track initial page view & reel traffic arrival
  trackEvent('page_view', {
    path: window.location.pathname,
    title: document.title,
    isReel: context.isReelTraffic,
  });

  if (context.isReelTraffic) {
    trackEvent('reel_visitor_arrival', {
      source: context.source,
      medium: context.medium,
      device: context.deviceType,
      platform: context.platform,
    });
  }
}

/**
 * Core event tracking method
 */
export function trackEvent(name: EventName, properties?: EventProperties) {
  try {
    const context = getOrCreateContext();
    const event: StoredTelemetryEvent = {
      id: generateId(),
      name,
      properties,
      context,
      timestamp: Date.now(),
    };

    // 1. Buffer event in localStorage (keeps latest 500 events)
    if (typeof window !== 'undefined') {
      const existing = localStorage.getItem(STORAGE_KEYS.EVENTS_BUFFER);
      const events: StoredTelemetryEvent[] = existing ? JSON.parse(existing) : [];
      events.unshift(event);
      if (events.length > 500) events.pop();
      localStorage.setItem(STORAGE_KEYS.EVENTS_BUFFER, JSON.stringify(events));

      // 2. Update aggregated metrics
      updateSummaryMetrics(name, context);

      // 3. Vercel Web Analytics integration (window.va)
      const win = window as unknown as { va?: (type: string, name: string, payload?: object) => void };
      if (typeof win.va === 'function') {
        win.va('event', name, {
          source: context.source,
          isReel: context.isReelTraffic,
          device: context.deviceType,
          ...properties,
        });
      }

      // 4. PostHog integration
      const w = window as unknown as { posthog?: { capture: (n: string, p?: object) => void } };
      if (w.posthog?.capture) {
        w.posthog.capture(name, {
          ...context,
          ...properties,
        });
      }

      // 5. Supabase remote logging (if configured)
      if (isSupabaseConfigured) {
        Promise.resolve().then(async () => {
          try {
            await supabase.from('analytics_events').insert({
              event_name: name,
              visitor_id: context.visitorId,
              session_id: context.sessionId,
              source: context.source,
              is_reel: context.isReelTraffic,
              device_type: context.deviceType,
              platform: context.platform,
              properties: properties || {},
              created_at: new Date().toISOString(),
            });
          } catch {
            // Ignore Supabase table missing/network errors
          }
        });
      }
    }

    if (import.meta.env.DEV) {
      console.log(`📡 [Telemetry] ${name}:`, { context, properties });
    }
  } catch {
    // Fail silently — telemetry must never disrupt user experience
  }
}

/**
 * Identifies logged-in user for authenticated event tracking
 */
export function identifyUser(userId: string, traits?: EventProperties) {
  try {
    const w = window as unknown as { posthog?: { identify: (id: string, t?: object) => void } };
    if (w.posthog?.identify) {
      w.posthog.identify(userId, traits);
    }
  } catch {
    // Failsafe
  }
}
