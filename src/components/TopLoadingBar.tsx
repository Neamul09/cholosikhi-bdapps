import { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * TopLoadingBar
 * Sleek, high-performance top progress bar that animates DURING page transitions ("while visiting"),
 * starting the instant a user clicks a link or initiates a route change, trickling forward while
 * the target page/assets load, and completing cleanly when the destination renders.
 */
export default function TopLoadingBar() {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const trickleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const prevLocRef = useRef(location.pathname + location.search);

  const startProgress = useCallback(() => {
    if (fadeTimerRef.current) {
      clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }

    setIsVisible(true);
    setProgress((prev) => (prev > 0 && prev < 85 ? prev : 22));

    if (trickleTimerRef.current) clearInterval(trickleTimerRef.current);
    trickleTimerRef.current = setInterval(() => {
      setProgress((current) => {
        if (current >= 88) return current;
        // Non-linear realistic progress trickle
        const diff = 90 - current;
        const step = Math.max(1, Math.floor(diff * 0.18));
        return current + step;
      });
    }, 100);
  }, []);

  const completeProgress = useCallback(() => {
    if (trickleTimerRef.current) {
      clearInterval(trickleTimerRef.current);
      trickleTimerRef.current = null;
    }

    setProgress(100);

    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    fadeTimerRef.current = setTimeout(() => {
      setIsVisible(false);
      setProgress(0);
    }, 320);
  }, []);

  // 1. Complete progress when the target location actually renders
  useEffect(() => {
    const currentLoc = location.pathname + location.search;
    if (prevLocRef.current !== currentLoc) {
      prevLocRef.current = currentLoc;
      completeProgress();
    }
  }, [location.pathname, location.search, completeProgress]);

  // 2. Intercept clicks on links immediately (capture phase) to start progress bar the exact millisecond user clicks
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      // Ignore right clicks or clicks with modifier keys
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        anchor.target === '_blank'
      ) {
        return;
      }

      const currentPath = window.location.pathname + window.location.search;
      const targetPath = anchor.pathname + anchor.search;

      if (targetPath && targetPath !== currentPath) {
        startProgress();
      }
    };

    const handlePopState = () => {
      startProgress();
    };

    // Hook window.history.pushState to catch programmatic navigate() calls
    const originalPushState = window.history.pushState;
    window.history.pushState = function (...args) {
      const targetUrl = args[2];
      if (targetUrl && String(targetUrl) !== window.location.pathname + window.location.search) {
        startProgress();
      }
      return originalPushState.apply(this, args);
    };

    document.addEventListener('click', handleClick, { capture: true });
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('click', handleClick, { capture: true });
      window.removeEventListener('popstate', handlePopState);
      window.history.pushState = originalPushState;
    };
  }, [startProgress]);

  // 3. Support custom events for suspense or manual triggers
  useEffect(() => {
    const handleStart = () => startProgress();
    const handleDone = () => completeProgress();

    window.addEventListener('cs_route_loading_start', handleStart);
    window.addEventListener('cs_route_loading_done', handleDone);
    return () => {
      window.removeEventListener('cs_route_loading_start', handleStart);
      window.removeEventListener('cs_route_loading_done', handleDone);
    };
  }, [startProgress, completeProgress]);

  // Clean up any remaining timers on unmount
  useEffect(() => {
    return () => {
      if (trickleTimerRef.current) clearInterval(trickleTimerRef.current);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    };
  }, []);

  if (!isVisible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none h-[3px] bg-transparent overflow-hidden"
    >
      <div
        className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-violet-500 shadow-[0_0_14px_rgba(6,182,212,0.9)] transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
          opacity: isVisible ? 1 : 0,
          transitionProperty: 'width, opacity',
        }}
      >
        {/* Animated glowing leading-edge pulse */}
        <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-r from-transparent to-white/70 shadow-[0_0_20px_#38bdf8] animate-pulse" />
      </div>
    </div>
  );
}
