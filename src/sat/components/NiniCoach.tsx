import { useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import { animateMascotBounce, animatePop } from '../lib/animations';

interface NiniCoachProps {
  mood: 'happy' | 'thoughtful' | 'celebrate' | 'neutral';
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function NiniCoach({
  mood,
  message,
  size = 'md',
  className
}: NiniCoachProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);

  // Mascot image selection
  const isHappy = mood === 'happy' || mood === 'celebrate' || mood === 'neutral';
  const mascotSrc = isHappy ? '/mascot/nini-right.png' : '/mascot/nini-wrong.png';

  useEffect(() => {
    if (containerRef.current) {
      animateMascotBounce(containerRef.current);
    }
    if (bubbleRef.current) {
      animatePop(bubbleRef.current, 150);
    }
  }, [mood, message]);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-36 h-36 sm:w-44 sm:h-44'
  };

  return (
    <div className={clsx("flex flex-col sm:flex-row items-center sm:items-end gap-3", className)}>
      {/* Mascot Image */}
      <div ref={containerRef} className={clsx("relative shrink-0 select-none", sizeClasses[size])}>
        <img
          src={mascotSrc}
          alt="Nini the Mascot"
          className="w-full h-full object-contain drop-shadow-xl"
        />
        {mood === 'celebrate' && (
          <div className="absolute -top-2 -right-2 text-xl animate-spin">
            ✨
          </div>
        )}
      </div>

      {/* Speech Bubble */}
      {message && (
        <div
          ref={bubbleRef}
          className="relative max-w-sm rounded-2xl bg-panel border-2 border-border-subtle p-3.5 shadow-lg text-app-fg text-xs sm:text-sm font-bold leading-relaxed mb-2 text-center sm:text-left"
        >
          {/* Arrow pointing Left on Desktop */}
          <div className="hidden sm:block absolute -left-2 bottom-3 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-border-subtle border-b-8 border-b-transparent" />
          <div className="hidden sm:block absolute -left-1.5 bottom-3 w-0 h-0 border-t-7 border-t-transparent border-r-7 border-r-panel border-b-7 border-b-transparent" />

          {/* Arrow pointing Up on Mobile */}
          <div className="sm:hidden absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-b-8 border-b-border-subtle border-r-8 border-r-transparent" />
          <div className="sm:hidden absolute -top-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-7 border-l-transparent border-b-7 border-b-panel border-r-7 border-r-transparent" />

          <p>{message}</p>
        </div>
      )}
    </div>
  );
}
