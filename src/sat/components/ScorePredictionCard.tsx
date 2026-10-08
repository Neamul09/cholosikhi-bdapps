import { useState, useEffect, useRef } from 'react';
import { Target, TrendingUp, ShieldCheck, Sparkles, Bot, Loader2, X } from 'lucide-react';
import { clsx } from 'clsx';
import type { SatScorePrediction } from '../types';
import { animateCounter } from '../lib/animations';
import { generateScoreBoosterPlan } from '../services/satAiService';
import MathRenderer from './MathRenderer';
import { play } from '../../lib/audio';

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

  const [showAiPlan, setShowAiPlan] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [planContent, setPlanContent] = useState<string | null>(null);
  const [planLang, setPlanLang] = useState<'bn' | 'en'>('bn');

  useEffect(() => {
    animateCounter(scoreRef.current, 1000, prediction.compositeScore, 1400);
    animateCounter(mathRef.current, 500, prediction.mathScore, 1200);
    animateCounter(rwRef.current, 500, prediction.rwScore, 1200);
  }, [prediction.compositeScore, prediction.mathScore, prediction.rwScore]);

  const handleOpenPlan = async (lang = planLang) => {
    play('tap');
    setShowAiPlan(true);
    if (planContent && lang === planLang) return;

    setAiLoading(true);
    try {
      const plan = await generateScoreBoosterPlan(
        prediction.compositeScore,
        targetScore,
        prediction.mathScore,
        prediction.rwScore,
        lang === 'en'
      );
      setPlanContent(plan);
    } catch (e) {
      console.error(e);
      setPlanContent('Could not generate score booster plan. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleToggleLang = (newLang: 'bn' | 'en') => {
    setPlanLang(newLang);
    handleOpenPlan(newLang);
  };

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

      {/* Target Comparison & AI Plan CTA Footer */}
      <div className="mt-6 pt-4 border-t border-border-subtle/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-app-fg/60 font-bold">
          <Target size={15} className="text-blue-400" />
          <span>Target Score: <strong className="text-app-fg">{targetScore}</strong></span>
          <span className="text-app-fg/30">•</span>
          {prediction.compositeScore >= targetScore ? (
            <span className="text-emerald-400 font-black">Target Met! 🎯</span>
          ) : (
            <span><strong>{targetScore - prediction.compositeScore} pts</strong> away</span>
          )}
        </div>

        <button
          onClick={() => handleOpenPlan()}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white font-black text-xs transition-all shadow-sm flex items-center gap-1.5"
        >
          <Bot size={13} />
          <span>AI Score Booster Strategy</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 font-bold">Free AI</span>
        </button>
      </div>

      {/* AI Score Strategy Modal */}
      {showAiPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="glass max-w-2xl w-full max-h-[85vh] rounded-3xl border border-blue-500/30 overflow-hidden flex flex-col shadow-2xl bg-panel">
            {/* Header */}
            <div className="p-6 border-b border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-app-fg flex items-center gap-2">
                    <span>Nini AI Score Acceleration Blueprint</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold">Free AI</span>
                  </h3>
                  <p className="text-xs text-app-fg/60 font-medium">
                    Tactical recommendations to reach {targetScore}+ on Digital SAT
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Language Switcher */}
                <div className="flex items-center bg-app-bg rounded-xl p-0.5 border border-border-subtle text-xs font-bold">
                  <button
                    onClick={() => handleToggleLang('bn')}
                    className={clsx(
                      "px-2.5 py-1 rounded-lg transition-all",
                      planLang === 'bn' ? "bg-blue-600 text-white shadow-sm" : "text-app-fg/60 hover:text-app-fg"
                    )}
                  >
                    বাংলা
                  </button>
                  <button
                    onClick={() => handleToggleLang('en')}
                    className={clsx(
                      "px-2.5 py-1 rounded-lg transition-all",
                      planLang === 'en' ? "bg-blue-600 text-white shadow-sm" : "text-app-fg/60 hover:text-app-fg"
                    )}
                  >
                    English
                  </button>
                </div>

                <button
                  onClick={() => { play('tap'); setShowAiPlan(false); }}
                  className="p-2 rounded-xl bg-app-bg hover:bg-white/10 text-app-fg/60 hover:text-app-fg transition-all"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-4 font-hind text-sm leading-relaxed text-app-fg">
              {aiLoading ? (
                <div className="p-12 flex flex-col items-center justify-center gap-3 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 animate-pulse">
                    <Loader2 size={26} className="animate-spin" />
                  </div>
                  <p className="text-sm font-bold text-app-fg/80">
                    Nini is calculating high-yield Math & Reading/Writing score trajectories...
                  </p>
                </div>
              ) : planContent ? (
                <div className="sat-question-content space-y-3 p-4 rounded-2xl bg-app-bg/60 border border-border-subtle/70">
                  <MathRenderer content={planContent} />
                </div>
              ) : null}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border-subtle bg-app-bg/40 flex justify-end">
              <button
                onClick={() => { play('tap'); setShowAiPlan(false); }}
                className="btn-duo btn-duo-blue px-6 py-2.5 text-xs font-bold shadow-none"
              >
                Close Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
