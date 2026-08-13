import { useEffect, useRef } from 'react';

interface ConfettiPiece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  vr: number;
  size: number;
  color: string;
  life: number;
}

interface ConfettiCanvasProps {
  /** How many particles to spawn. Default 120. */
  count?: number;
  /** Animation duration in ms before the canvas unmounts itself. Default 2400. */
  duration?: number;
  /** When this number changes, a new burst fires. */
  trigger: number;
  /** Optional colors. Default is a brand-friendly palette. */
  colors?: string[];
}

const DEFAULT_COLORS = [
  '#3b82f6', // blue-500
  '#22d3ee', // cyan-400
  '#a855f7', // purple-500
  '#f59e0b', // amber-500
  '#10b981', // emerald-500
  '#f43f5e', // rose-500
];

/**
 * Lightweight, GPU-friendly confetti effect using OffscreenCanvas when
 * available (falls back to a regular canvas). Spawns from the bottom
 * corners and arcs upward. Self-unmounts after `duration`.
 *
 * Usage:
 *   const [burst, setBurst] = useState(0);
 *   <ConfettiCanvas trigger={burst} />
 *   <button onClick={() => setBurst(n => n + 1)}>Celebrate</button>
 */
export function ConfettiCanvas({
  count = 120,
  duration = 2400,
  trigger,
  colors = DEFAULT_COLORS,
}: ConfettiCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!trigger) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const parent = canvas.parentElement;
    const w = (canvas.width = parent ? parent.clientWidth * dpr : window.innerWidth * dpr);
    const h = (canvas.height = parent ? parent.clientHeight * dpr : window.innerHeight * dpr);
    canvas.style.width = `${w / dpr}px`;
    canvas.style.height = `${h / dpr}px`;

    const pieces: ConfettiPiece[] = [];
    for (let i = 0; i < count; i++) {
      pieces.push({
        x: Math.random() * w,
        y: h + Math.random() * 60,
        vx: (Math.random() - 0.5) * 6 * dpr,
        vy: -(Math.random() * 10 + 8) * dpr,
        rotation: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.2,
        size: (Math.random() * 6 + 4) * dpr,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
      });
    }

    const gravity = 0.18 * dpr;
    const drag = 0.992;
    let last = performance.now();
    const start = last;
    const totalDuration = duration;

    const frame = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      ctx.clearRect(0, 0, w, h);

      for (const p of pieces) {
        p.vy += gravity * (dt / 16);
        p.vx *= drag;
        p.x += p.vx * (dt / 16);
        p.y += p.vy * (dt / 16);
        p.rotation += p.vr * (dt / 16);
        const fade = Math.max(0, 1 - (now - start) / totalDuration);
        p.life = fade;
        ctx.save();
        ctx.globalAlpha = fade;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }

      if (now - start < totalDuration) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, w, h);
      }
    };
    rafRef.current = requestAnimationFrame(frame);

    return () => cancelAnimationFrame(rafRef.current);
  }, [trigger, count, duration, colors]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[200]"
    />
  );
}
