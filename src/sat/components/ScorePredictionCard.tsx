import { useEffect, useRef } from 'react';
import { Target, TrendingUp, ShieldCheck, Sparkles } from 'lucide-react';
import type { SatScorePrediction } from '../types';
import { animateCounter } from '../lib/animations';

interface ScorePredictionCardProps {
  prediction: SatScorePrediction;
  targetScore?: number;
}

export default function ScorePredictionCard({
  prediction,
  targetScore = 1520
}: ScorePredictionCardProps) {
  const scoreRef = useRef<HTMLSpanElement>(null);
  const mathRef = useRef<HTMLSpanElement>(null);
  const rwRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    animateCounter(scoreRef.current, 1000, prediction.compositeScore, 1400);
    animateCounter(mathRef.current, 500, prediction.mathScore, 1200);
    animateCounter(rwRef.current, 500, prediction.rwScore, 1200);
  }, [prediction.compositeScore, prediction.mathScore, prediction.rwScore]);

  return (
    <div className="glass p-6 sm:p-8 rounded-[2.5rem] border border-blue-500/20 relative overflow-hidden flex flex-col justify-between">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-wider">
          <Sparkles size={14} />
          <span>AI Score Predictor</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-app-fg/50">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>Confidence: <strong className="text-app-fg">{prediction.confidence}</strong></span>
        </div>
      </div>

      {/* Main Score Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-app-fg/40">
            Estimated Scaled Score
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span
              ref={scoreRef}
              className="text-6xl sm:text-7xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400"
            >
              {prediction.compositeScore}
            </span>
            <span className="text-xl sm:text-2xl font-bold text-app-fg/30">/ 1600</span>
          </div>

          <p className="text-xs font-bold text-app-fg/60 mt-2 flex items-center gap-1.5">
            <TrendingUp size={14} className="text-emerald-400" />
            <span>Range: <strong>{prediction.compositeRange[0]} – {prediction.compositeRange[1]}</strong> ({prediction.percentile}th Percentile)</span>
          </p>
        </div>

        {/* Section Score Bars */}
        <div className="space-y-4 bg-app-bg/50 p-4 rounded-2xl border border-border-subtle/50">
          {/* Math Section */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-black">
              <span className="text-blue-400">Math</span>
              <span className="text-app-fg">
                <span ref={mathRef}>{prediction.mathScore}</span> / 800
              </span>
            </div>
            <div className="h-2.5 w-full bg-panel rounded-full overflow-hidden border border-border-subtle/40">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-1000"
                style={{ width: `${((prediction.mathScore - 200) / 600) * 100}%` }}
              />
            </div>
          </div>

          {/* Reading & Writing Section */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-black">
              <span className="text-violet-400">Reading & Writing</span>
              <span className="text-app-fg">
                <span ref={rwRef}>{prediction.rwScore}</span> / 800
              </span>
            </div>
            <div className="h-2.5 w-full bg-panel rounded-full overflow-hidden border border-border-subtle/40">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-pink-400 rounded-full transition-all duration-1000"
                style={{ width: `${((prediction.rwScore - 200) / 600) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Target Comparison Footer */}
      <div className="mt-6 pt-4 border-t border-border-subtle/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-app-fg/60 font-bold">
          <Target size={15} className="text-blue-400" />
          <span>Target Score: <strong className="text-app-fg">{targetScore}</strong></span>
        </div>
        <div className="font-bold text-app-fg/50">
          {prediction.compositeScore >= targetScore ? (
            <span className="text-emerald-400 font-black">Target Met! Keep practicing 🎯</span>
          ) : (
            <span><strong>{targetScore - prediction.compositeScore} points</strong> to target</span>
          )}
        </div>
      </div>
    </div>
  );
}
