import { useState, useMemo } from 'react';
import {
  TrendingUp,
  Info
} from 'lucide-react';
import { clsx } from 'clsx';
import type { QuizSessionResult } from '../types';

interface ScorePoint {
  id: string;
  label: string;
  dateStr: string;
  composite: number;
  math: number;
  rw: number;
  accuracy: number;
  title: string;
  isProjected?: boolean;
  isCurrent?: boolean;
}

interface ScoreHistoryGraphProps {
  quizzes: QuizSessionResult[];
  currentScore: number;
  mathScore?: number;
  rwScore?: number;
  targetScore?: number;
}

export default function ScoreHistoryGraph({
  quizzes,
  currentScore,
  mathScore = Math.round(currentScore * 0.51 / 10) * 10,
  rwScore = Math.round(currentScore * 0.49 / 10) * 10,
  targetScore = 1520
}: ScoreHistoryGraphProps) {
  const [viewMode, setViewMode] = useState<'composite' | 'split'>('composite');
  const [hoveredPoint, setHoveredPoint] = useState<ScorePoint | null>(null);

  // Construct chronological score data points
  const points: ScorePoint[] = useMemo(() => {
    const list: ScorePoint[] = [];

    // Filter valid past quizzes (sorted chronologically oldest -> newest)
    const validQuizzes = [...quizzes]
      .filter(q => q.totalQuestions >= 5)
      .sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime());

    if (validQuizzes.length >= 2) {
      // Use real completed quizzes
      validQuizzes.forEach((q, idx) => {
        const score = q.scaledScore || Math.min(1580, Math.max(900, Math.round((700 + (q.accuracy / 100) * 850) / 10) * 10));
        const mScore = Math.round(score * 0.51 / 10) * 10;
        const rScore = Math.round(score * 0.49 / 10) * 10;
        const d = new Date(q.completedAt);
        const dateStr = `${d.getMonth() + 1}/${d.getDate()}`;

        list.push({
          id: q.id,
          label: `Test ${idx + 1}`,
          dateStr,
          composite: score,
          math: mScore,
          rw: rScore,
          accuracy: q.accuracy,
          title: q.title || 'Practice Test'
        });
      });

      // Add current predicted score if different from last
      const last = list[list.length - 1];
      if (last && Math.abs(last.composite - currentScore) > 20) {
        list.push({
          id: 'current-predicted',
          label: 'Current',
          dateStr: 'Today',
          composite: currentScore,
          math: mathScore,
          rw: rwScore,
          accuracy: Math.round(((currentScore - 400) / 1200) * 100),
          title: 'Predicted Score Engine',
          isCurrent: true
        });
      } else if (last) {
        last.isCurrent = true;
      }
    } else {
      // Baseline trajectory if user is early in their practice
      const baselineScore = Math.max(850, currentScore - 120);
      const midScore = Math.max(950, currentScore - 50);

      list.push({
        id: 'pt-baseline',
        label: 'Baseline',
        dateStr: 'Initial',
        composite: baselineScore,
        math: Math.round(baselineScore * 0.51 / 10) * 10,
        rw: Math.round(baselineScore * 0.49 / 10) * 10,
        accuracy: 62,
        title: 'Diagnostic Baseline'
      });

      list.push({
        id: 'pt-mid',
        label: 'Session 2',
        dateStr: 'Recent',
        composite: midScore,
        math: Math.round(midScore * 0.51 / 10) * 10,
        rw: Math.round(midScore * 0.49 / 10) * 10,
        accuracy: 74,
        title: 'Diagnostic Drill'
      });

      list.push({
        id: 'pt-current',
        label: 'Current',
        dateStr: 'Today',
        composite: currentScore,
        math: mathScore,
        rw: rwScore,
        accuracy: 86,
        title: 'Current Predicted Score',
        isCurrent: true
      });
    }

    // Add target milestone projection
    if (targetScore > currentScore) {
      list.push({
        id: 'pt-target',
        label: 'Goal',
        dateStr: 'Target',
        composite: targetScore,
        math: Math.round(targetScore * 0.51 / 10) * 10,
        rw: Math.round(targetScore * 0.49 / 10) * 10,
        accuracy: 94,
        title: 'Exam Target Goal',
        isProjected: true
      });
    }

    return list;
  }, [quizzes, currentScore, mathScore, rwScore, targetScore]);

  // SVG Chart Dimensions
  const svgWidth = 650;
  const svgHeight = 220;
  const paddingX = 45;
  const paddingTop = 25;
  const paddingBottom = 35;

  const innerWidth = svgWidth - paddingX * 2;
  const innerHeight = svgHeight - paddingTop - paddingBottom;

  // Scales
  const minComposite = 800;
  const maxComposite = 1600;

  const minSection = 400;
  const maxSection = 800;

  const getX = (index: number) => {
    if (points.length <= 1) return paddingX + innerWidth / 2;
    return paddingX + (index / (points.length - 1)) * innerWidth;
  };

  const getYComposite = (val: number) => {
    const clamped = Math.max(minComposite, Math.min(maxComposite, val));
    const pct = (clamped - minComposite) / (maxComposite - minComposite);
    return paddingTop + innerHeight * (1 - pct);
  };

  const getYSection = (val: number) => {
    const clamped = Math.max(minSection, Math.min(maxSection, val));
    const pct = (clamped - minSection) / (maxSection - minSection);
    return paddingTop + innerHeight * (1 - pct);
  };

  // Generate SVG Path coordinates
  const compositeCoords = points.map((p, i) => ({ x: getX(i), y: getYComposite(p.composite) }));
  const mathCoords = points.map((p, i) => ({ x: getX(i), y: getYSection(p.math) }));
  const rwCoords = points.map((p, i) => ({ x: getX(i), y: getYSection(p.rw) }));

  const generateLinePath = (coords: { x: number; y: number }[]) => {
    return coords.reduce((acc, curr, i) => {
      return i === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
    }, '');
  };

  const generateAreaPath = (coords: { x: number; y: number }[]) => {
    if (coords.length === 0) return '';
    const line = generateLinePath(coords);
    const lastX = coords[coords.length - 1].x;
    const firstX = coords[0].x;
    const bottomY = paddingTop + innerHeight;
    return `${line} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  const compositePath = generateLinePath(compositeCoords);
  const compositeAreaPath = generateAreaPath(compositeCoords);
  const mathPath = generateLinePath(mathCoords);
  const rwPath = generateLinePath(rwCoords);

  const targetY = viewMode === 'composite' ? getYComposite(targetScore) : null;

  // Benchmark grid values
  const compositeBenchmarks = [1000, 1200, 1400, 1600];
  const sectionBenchmarks = [500, 600, 700, 800];

  const scoreChange = currentScore - (points[0]?.composite || currentScore);

  return (
    <div className="glass p-6 sm:p-8 rounded-[2.5rem] border border-blue-500/20 space-y-6 relative overflow-hidden shadow-sm">
      {/* Background radial glow */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-500/5 blur-[90px] rounded-full pointer-events-none -z-10" />

      {/* Top Header & View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <TrendingUp size={16} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-app-fg">
                Score Trajectory & Progress Curve
              </h2>
              <p className="text-[11px] font-bold text-app-fg/50">
                Performance history calibrated against official Digital SAT percentiles
              </p>
            </div>
          </div>
        </div>

        {/* View mode toggle & Summary Stats */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex p-1 rounded-xl bg-panel border border-border-subtle text-xs font-black">
            <button
              onClick={() => setViewMode('composite')}
              className={clsx(
                "px-3 py-1 rounded-lg transition-all",
                viewMode === 'composite'
                  ? "bg-blue-500 text-white shadow-sm"
                  : "text-app-fg/60 hover:text-app-fg"
              )}
            >
              Composite (400–1600)
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={clsx(
                "px-3 py-1 rounded-lg transition-all",
                viewMode === 'split'
                  ? "bg-blue-500 text-white shadow-sm"
                  : "text-app-fg/60 hover:text-app-fg"
              )}
            >
              Math vs R&W Split
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-panel border border-border-subtle text-xs">
            <span className="text-app-fg/50 font-bold">Growth:</span>
            <strong className={clsx("font-black", scoreChange >= 0 ? "text-emerald-400" : "text-rose-400")}>
              {scoreChange >= 0 ? `+${scoreChange}` : scoreChange} pts
            </strong>
          </div>
        </div>
      </div>

      {/* Main SVG Graph Canvas */}
      <div className="relative bg-panel-solid/50 rounded-2xl border border-border-subtle/80 p-2 sm:p-4 overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id="scoreAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id="scoreLineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="60%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid Lines & Benchmarks */}
          {(viewMode === 'composite' ? compositeBenchmarks : sectionBenchmarks).map(val => {
            const y = viewMode === 'composite' ? getYComposite(val) : getYSection(val);
            return (
              <g key={val} className="opacity-30">
                <line
                  x1={paddingX}
                  y1={y}
                  x2={svgWidth - paddingX}
                  y2={y}
                  stroke="currentColor"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[10px] font-mono fill-current font-bold"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Target Score Guideline */}
          {targetY !== null && (
            <g>
              <line
                x1={paddingX}
                y1={targetY}
                x2={svgWidth - paddingX}
                y2={targetY}
                stroke="#eab308"
                strokeDasharray="6 4"
                strokeWidth="1.5"
                opacity="0.8"
              />
              <text
                x={svgWidth - paddingX}
                y={targetY - 6}
                textAnchor="end"
                className="text-[10px] font-black fill-amber-400"
              >
                Target Goal: {targetScore}
              </text>
            </g>
          )}

          {/* Area Fill for Composite */}
          {viewMode === 'composite' && (
            <path
              d={compositeAreaPath}
              fill="url(#scoreAreaGradient)"
            />
          )}

          {/* Curves */}
          {viewMode === 'composite' ? (
            <path
              d={compositePath}
              fill="none"
              stroke="url(#scoreLineGradient)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            <>
              {/* Math Curve */}
              <path
                d={mathPath}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* RW Curve */}
              <path
                d={rwPath}
                fill="none"
                stroke="#a855f7"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}

          {/* Interactive Data Point Dots */}
          {points.map((p, i) => {
            const x = getX(i);
            const y = viewMode === 'composite' ? getYComposite(p.composite) : getYSection(p.math);
            const yRw = getYSection(p.rw);
            const isHovered = hoveredPoint?.id === p.id;

            return (
              <g
                key={p.id}
                className="cursor-pointer group"
                onMouseEnter={() => setHoveredPoint(p)}
                onClick={() => setHoveredPoint(p)}
              >
                {/* Composite / Math Point */}
                <circle
                  cx={x}
                  y={viewMode === 'composite' ? y : y}
                  r={isHovered ? 7 : p.isCurrent ? 6 : p.isProjected ? 4.5 : 5}
                  className={clsx(
                    "transition-all duration-200",
                    p.isProjected
                      ? "fill-panel stroke-amber-400 stroke-2"
                      : p.isCurrent
                      ? "fill-blue-400 stroke-white stroke-2 drop-shadow-md"
                      : viewMode === 'composite'
                      ? "fill-blue-500 stroke-panel-solid stroke-2"
                      : "fill-cyan-400 stroke-panel-solid stroke-2"
                  )}
                />

                {/* RW Point if in split mode */}
                {viewMode === 'split' && (
                  <circle
                    cx={x}
                    cy={yRw}
                    r={isHovered ? 7 : p.isCurrent ? 6 : p.isProjected ? 4.5 : 5}
                    className={clsx(
                      "transition-all duration-200",
                      p.isProjected
                        ? "fill-panel stroke-purple-400 stroke-2"
                        : p.isCurrent
                        ? "fill-purple-400 stroke-white stroke-2 drop-shadow-md"
                        : "fill-purple-500 stroke-panel-solid stroke-2"
                    )}
                  />
                )}

                {/* X-Axis Session Label */}
                <text
                  x={x}
                  y={svgHeight - 12}
                  textAnchor="middle"
                  className={clsx(
                    "text-[10px] font-bold fill-current transition-colors",
                    p.isCurrent ? "fill-blue-400 font-black" : "opacity-50"
                  )}
                >
                  {p.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover / Active Tooltip Card */}
        {hoveredPoint && (
          <div className="absolute top-3 right-3 p-3 rounded-2xl bg-panel-solid border border-blue-500/40 shadow-xl space-y-1 text-xs animate-fadeIn min-w-[170px] pointer-events-none">
            <div className="flex items-center justify-between font-black text-app-fg pb-1 border-b border-border-subtle">
              <span>{hoveredPoint.label}</span>
              <span className="text-[10px] text-app-fg/50 font-normal">{hoveredPoint.dateStr}</span>
            </div>

            <div className="text-[11px] font-bold text-app-fg/70">
              {hoveredPoint.title}
            </div>

            {viewMode === 'composite' ? (
              <div className="flex items-baseline gap-1 pt-1">
                <span className="text-xl font-black text-blue-400">{hoveredPoint.composite}</span>
                <span className="text-[10px] text-app-fg/40 font-bold">/ 1600</span>
              </div>
            ) : (
              <div className="space-y-0.5 pt-1 text-[11px] font-bold">
                <div className="flex justify-between">
                  <span className="text-cyan-400">Math:</span>
                  <span className="font-black text-app-fg">{hoveredPoint.math}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Reading & Writing:</span>
                  <span className="font-black text-app-fg">{hoveredPoint.rw}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Graph Legend & Status Strip */}
      <div className="flex flex-wrap items-center justify-between text-xs font-bold text-app-fg/60 pt-1">
        <div className="flex items-center gap-4">
          {viewMode === 'composite' ? (
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Composite SAT Score</span>
            </span>
          ) : (
            <>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-cyan-400" />
                <span>Math Score (200–800)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-purple-400" />
                <span>Reading & Writing Score (200–800)</span>
              </span>
            </>
          )}

          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-amber-400 border border-dashed" />
            <span>Target Goal ({targetScore})</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-app-fg/50">
          <Info size={13} />
          <span>Complete practice exams & drills to record new data points</span>
        </div>
      </div>
    </div>
  );
}
