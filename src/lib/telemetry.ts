import { supabase, isSupabaseConfigured } from './supabase';

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

export interface TelemetryEvent {
  id: string;
  name: string;
  context: TelemetryContext;
  data?: Record<string, unknown>;
  timestamp: number;
}

export interface DatabaseMetrics {
  uniqueVisitorsTotal: number;
  uniqueVisitorsToday: number;
  registeredUsersTotal: number;
  lessonsCompletedTotal: number;
  testsCompletedTotal: number;
  reelVisitorsTotal: number;
  directVisitorsTotal: number;
  sources: Record<string, number>;
  devices: Record<string, number>;
  isLiveDatabase: boolean;
  lastUpdated: number;
}

const STORAGE_KEYS = {
  VISITOR_ID: 'cs_vid',
  SESSION_ID: 'cs_sid',
  ATTRIBUTION: 'cs_attr',
  EVENTS_BUFFER: 'cs_events_buf',
  UNIQUE_REGISTRY: 'cs_unique_users_registry',
};

// Generates an anonymous random UUID (fallback to timestamp-based if crypto unavailable)
function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'cs_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

/**
 * Detects whether traffic originated from social reels or specific platforms
 */
export function detectTrafficSource(): { source: string; medium: string; isReelTraffic: boolean; campaign?: string } {
  if (typeof window === 'undefined') {
    return { source: 'direct', medium: 'none', isReelTraffic: false };
  }

  const urlParams = new URLSearchParams(window.location.search);
  const refParam = urlParams.get('ref') || urlParams.get('source');
  const utmSource = urlParams.get('utm_source');
  const utmMedium = urlParams.get('utm_medium');
  const utmCampaign = urlParams.get('utm_campaign');

  const referrer = (document.referrer || '').toLowerCase();
  const userAgent = (navigator.userAgent || '').toLowerCase();

  // 1. Explicit campaign query parameters
  if (refParam?.toLowerCase().includes('reel') || utmCampaign?.toLowerCase().includes('reel') || utmMedium?.toLowerCase().includes('reel')) {
    return {
      source: utmSource || refParam || 'social_reel',
      medium: utmMedium || 'reel',
      campaign: utmCampaign || 'reel_launch',
      isReelTraffic: true,
    };
  }

  // 2. In-App Social Browsers (Instagram In-App Browser, Facebook Mobile)
  if (userAgent.includes('instagram')) {
    return { source: 'instagram', medium: 'inapp_reel', isReelTraffic: true, campaign: utmCampaign || 'instagram_organic' };
  }
  if (userAgent.includes('fban') || userAgent.includes('fbav')) {
    return { source: 'facebook', medium: 'inapp_reel', isReelTraffic: true, campaign: utmCampaign || 'facebook_organic' };
  }
  if (userAgent.includes('bytedance') || userAgent.includes('musical_ly') || userAgent.includes('tiktok')) {
    return { source: 'tiktok', medium: 'inapp_reel', isReelTraffic: true, campaign: utmCampaign || 'tiktok_organic' };
  }

  // 3. Document Referrer inspection
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
  if (referrer.includes('t.co') || referrer.includes('twitter.com') || referrer.includes('x.com')) {
    return { source: 'x_twitter', medium: 'social', isReelTraffic: false, campaign: utmCampaign || undefined };
  }
  if (referrer.includes('google.com') || referrer.includes('bing.com')) {
    return { source: 'search_engine', medium: 'organic', isReelTraffic: false, campaign: utmCampaign || undefined };
  }

  if (utmSource) {
    return {
      source: utmSource,
      medium: utmMedium || 'referral',
      isReelTraffic: Boolean(utmSource.includes('reel') || utmMedium?.includes('reel')),
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
 * Retrieves or establishes the active visitor & session context
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

  // Persistent anonymous visitor ID
  let visitorId = localStorage.getItem(STORAGE_KEYS.VISITOR_ID);
  if (!visitorId) {
    visitorId = generateId();
    localStorage.setItem(STORAGE_KEYS.VISITOR_ID, visitorId);
  }

  // Register in local unique users registry with first seen date
  try {
    const regRaw = localStorage.getItem(STORAGE_KEYS.UNIQUE_REGISTRY);
    const registry: Record<string, number> = regRaw ? JSON.parse(regRaw) : {};
    if (!registry[visitorId]) {
      registry[visitorId] = Date.now();
      localStorage.setItem(STORAGE_KEYS.UNIQUE_REGISTRY, JSON.stringify(registry));
    }
  } catch {
    // Ignore storage issues
  }

  // Session ID
  let sessionId = sessionStorage.getItem(STORAGE_KEYS.SESSION_ID);
  if (!sessionId) {
    sessionId = generateId();
    sessionStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId);
  }

  // Attribution state (preserved throughout the session)
  const attributionRaw = sessionStorage.getItem(STORAGE_KEYS.ATTRIBUTION);
  let traffic: { source: string; medium: string; isReelTraffic: boolean; campaign?: string };
  if (attributionRaw) {
    try {
      traffic = JSON.parse(attributionRaw);
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
 * Tracks an event silently into local buffer, Supabase (if configured), and Vercel Analytics
 */
export function trackEvent(name: string, data?: Record<string, unknown>): void {
  try {
    const context = getOrCreateContext();
    const event: TelemetryEvent = {
      id: generateId(),
      name,
      context,
      data,
      timestamp: Date.now(),
    };

    // 1. Buffer in localStorage ring-buffer (keeps last 200 events for admin inspection)
    const existing = localStorage.getItem(STORAGE_KEYS.EVENTS_BUFFER);
    const events: TelemetryEvent[] = existing ? JSON.parse(existing) : [];
    events.unshift(event);
    if (events.length > 200) events.pop();
    localStorage.setItem(STORAGE_KEYS.EVENTS_BUFFER, JSON.stringify(events));

    // 2. Vercel Analytics integration
    if (typeof window !== 'undefined') {
      const win = window as unknown as { va?: (type: string, name: string, payload?: object) => void };
      if (typeof win.va === 'function') {
        win.va('event', name, {
          source: context.source,
          isReel: context.isReelTraffic,
          device: context.deviceType,
          ...data,
        });
      }
    }

    // 3. Supabase remote persistence (if configured)
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
            properties: data || {},
            created_at: new Date().toISOString(),
          });
        } catch {
          // Fail silently
        }
      });
    }

    if (import.meta.env.DEV) {
      console.log(`📡 [Telemetry] ${name}:`, { context, data });
    }
  } catch {
    // Fail silently — never impact user experience
  }
}

/**
 * Builds the outbound link to py.cholosikhi.com, ensuring campaign
 * and reel attribution tags are preserved across the domain handoff.
 */
export function buildPythonAppUrl(subPath = '', extraParams?: Record<string, string>): string {
  const context = getOrCreateContext();
  const base = `https://py.cholosikhi.com${subPath}`;
  const params = new URLSearchParams();

  if (context.isReelTraffic) {
    params.set('ref', 'reel');
    params.set('src', context.source);
  } else if (context.source !== 'direct') {
    params.set('src', context.source);
  }

  if (context.campaign) {
    params.set('utm_campaign', context.campaign);
  }

  if (extraParams) {
    Object.entries(extraParams).forEach(([k, v]) => params.set(k, v));
  }

  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

/**
 * Initializes landing page telemetry on page load
 */
export function initTelemetry(): void {
  if (typeof window === 'undefined') return;

  const context = getOrCreateContext();
  trackEvent('page_view', {
    path: window.location.pathname,
    title: document.title,
    isReelVisitor: context.isReelTraffic,
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
 * Computes live metrics across unique users, social reel attribution,
 * and Supabase cloud tables.
 */
export async function fetchLiveDatabaseMetrics(): Promise<DatabaseMetrics> {
  const metrics: DatabaseMetrics = {
    uniqueVisitorsTotal: 0,
    uniqueVisitorsToday: 0,
    registeredUsersTotal: 0,
    lessonsCompletedTotal: 0,
    testsCompletedTotal: 0,
    reelVisitorsTotal: 0,
    directVisitorsTotal: 0,
    sources: {},
    devices: {},
    isLiveDatabase: false,
    lastUpdated: Date.now(),
  };

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayTimestamp = todayStart.getTime();

  // 1. Read local storage unique users registry and event ring-buffer
  try {
    const regRaw = localStorage.getItem(STORAGE_KEYS.UNIQUE_REGISTRY);
    const registry: Record<string, number> = regRaw ? JSON.parse(regRaw) : {};
    const visitorIds = Object.keys(registry);
    metrics.uniqueVisitorsTotal = Math.max(1, visitorIds.length);
    metrics.uniqueVisitorsToday = visitorIds.filter((id) => registry[id] >= todayTimestamp).length || 1;

    const eventsRaw = localStorage.getItem(STORAGE_KEYS.EVENTS_BUFFER);
    const events: TelemetryEvent[] = eventsRaw ? JSON.parse(eventsRaw) : [];
    events.forEach((ev) => {
      const src = ev.context.source || 'direct';
      metrics.sources[src] = (metrics.sources[src] || 0) + 1;
      if (ev.context.isReelTraffic) metrics.reelVisitorsTotal++;
      else metrics.directVisitorsTotal++;

      const dev = ev.context.deviceType || 'desktop';
      metrics.devices[dev] = (metrics.devices[dev] || 0) + 1;
    });
  } catch {
    // Ignore local parse errors
  }

  // 2. Fetch live data from Supabase if configured
  if (isSupabaseConfigured) {
    try {
      const [profilesRes, lessonsRes, testsRes, eventsRes] = await Promise.allSettled([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('lesson_progress').select('*', { count: 'exact', head: true }).eq('completed', true),
        supabase.from('test_results').select('*', { count: 'exact', head: true }),
        supabase
          .from('analytics_events')
          .select('visitor_id, source, is_reel, device_type, created_at')
          .order('created_at', { ascending: false })
          .limit(2000),
      ]);

      if (profilesRes.status === 'fulfilled' && profilesRes.value.count !== null && profilesRes.value.count !== undefined) {
        metrics.registeredUsersTotal = profilesRes.value.count;
      }

      if (lessonsRes.status === 'fulfilled' && lessonsRes.value.count !== null && lessonsRes.value.count !== undefined) {
        metrics.lessonsCompletedTotal = lessonsRes.value.count;
      }

      if (testsRes.status === 'fulfilled' && testsRes.value.count !== null && testsRes.value.count !== undefined) {
        metrics.testsCompletedTotal = testsRes.value.count;
      }

      if (eventsRes.status === 'fulfilled' && eventsRes.value.data && eventsRes.value.data.length > 0) {
        const uniqueSet = new Set<string>();
        const todaySet = new Set<string>();
        const dbSources: Record<string, number> = {};
        const dbDevices: Record<string, number> = {};
        let dbReels = 0;
        let dbDirect = 0;

        eventsRes.value.data.forEach((row) => {
          if (row.visitor_id) {
            uniqueSet.add(row.visitor_id);
            const rowTime = new Date(row.created_at).getTime();
            if (rowTime >= todayTimestamp) {
              todaySet.add(row.visitor_id);
            }
          }
          const src = row.source || 'direct';
          dbSources[src] = (dbSources[src] || 0) + 1;
          if (row.is_reel) dbReels++;
          else dbDirect++;

          const dev = row.device_type || 'desktop';
          dbDevices[dev] = (dbDevices[dev] || 0) + 1;
        });

        metrics.uniqueVisitorsTotal = Math.max(metrics.uniqueVisitorsTotal, uniqueSet.size);
        metrics.uniqueVisitorsToday = Math.max(metrics.uniqueVisitorsToday, todaySet.size);
        metrics.sources = { ...metrics.sources, ...dbSources };
        metrics.devices = { ...metrics.devices, ...dbDevices };
        metrics.reelVisitorsTotal = Math.max(metrics.reelVisitorsTotal, dbReels);
        metrics.directVisitorsTotal = Math.max(metrics.directVisitorsTotal, dbDirect);
      }

      metrics.isLiveDatabase = true;
    } catch {
      // Gracefully fall back to local buffer
    }
  }

  return metrics;
}

export function getBufferedEvents(): TelemetryEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EVENTS_BUFFER);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearTelemetryBuffer(): void {
  localStorage.removeItem(STORAGE_KEYS.EVENTS_BUFFER);
}

export function exportTelemetryData(): void {
  try {
    const events = getBufferedEvents();
    const blob = new Blob([JSON.stringify(events, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cholosikhi-telemetry-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  } catch {
    // Ignore export errors
  }
}
