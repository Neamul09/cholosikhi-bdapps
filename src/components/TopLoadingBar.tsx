import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * TopLoadingBar
 * Sleek, high-performance top progress bar that animates on route changes
 * giving users instant visual feedback during page transitions.
 */
export default function TopLoadingBar() {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prevLocRef = useRef(location.pathname + location.search);

  useEffect(() => {
    const currentLoc = location.pathname + location.search;
    if (prevLocRef.current !== currentLoc) {
      prevLocRef.current = currentLoc;

      // Start transition animation
      setIsVisible(true);
      setProgress(25);

      if (timerRef.current) clearTimeout(timerRef.current);

      const t1 = setTimeout(() => {
        setProgress(65);
      }, 100);

      const t2 = setTimeout(() => {
        setProgress(90);
      }, 220);

      const t3 = setTimeout(() => {
        setProgress(100);
      }, 360);

      const t4 = setTimeout(() => {
        setIsVisible(false);
        setProgress(0);
      }, 650);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    }
  }, [location.pathname, location.search]);

  // Support custom dispatch events for async operations/suspense
  useEffect(() => {
    const handleStart = () => {
      setIsVisible(true);
      setProgress(35);
    };
    const handleDone = () => {
      setProgress(100);
      setTimeout(() => {
        setIsVisible(false);
        setProgress(0);
      }, 350);
    };

    window.addEventListener('cs_route_loading_start', handleStart);
    window.addEventListener('cs_route_loading_done', handleDone);
    return () => {
      window.removeEventListener('cs_route_loading_start', handleStart);
      window.removeEventListener('cs_route_loading_done', handleDone);
    };
  }, []);

  if (!isVisible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none h-[3px] bg-transparent overflow-hidden"
    >
      <div
        className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-violet-500 shadow-[0_0_12px_rgba(6,182,212,0.8)] transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          opacity: isVisible ? 1 : 0,
          transitionProperty: 'width, opacity',
        }}
      >
        {/* Glowing head pulse */}
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-r from-transparent to-white/60 shadow-[0_0_16px_#38bdf8] animate-pulse" />
      </div>
    </div>
  );
}
