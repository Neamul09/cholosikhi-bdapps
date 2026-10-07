export function trackEvent(name: string, props?: Record<string, any>) {
  if (import.meta.env.DEV) console.log(`[analytics] ${name}`, props);
}
