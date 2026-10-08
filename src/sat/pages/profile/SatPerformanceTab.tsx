import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Target,
  Award,
  BookOpen,
  AlertTriangle,
  Calendar,
  Sparkles,
  ArrowRight,
  Calculator,
  Compass,
  FileText,
  Layers,
  GraduationCap
} from 'lucide-react';
import { loadSatUserState } from '../../lib/satStorage';
import { calculatePredictedScore } from '../../lib/scorePredictor';
import { MICRO_TYPES } from '../../data/microtypes';
import ScoreHistoryGraph from '../../components/ScoreHistoryGraph';
import { play } from '../../../lib/audio';
import { useSettingsStore } from '@/store/settingsStore';

export default function SatPerformanceTab() {
  const { language } = useSettingsStore();
  const [userState] = useState(() => loadSatUserState());
  const prediction = calculatePredictedScore(userState.attempts);

  // Microtype mastery breakdown
  const totalMicroTypes = MICRO_TYPES.length;
  const masteredMicroTypes = Object.values(userState.mastery).filter(
    (m) => m.masteryPercentage >= 80
  ).length;

  const totalAttempts = userState.attempts.length;
  const correctAttempts = userState.attempts.filter((a) => a.isCorrect).length;
  const overallAccuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;
  const unresolvedMistakes = userState.mistakes.filter((m) => !m.resolved).length;

  // Domain breakdown computation
  const domainStats = useMemo(() => {
    const mathDomains = [
      { code: 'alg', name: 'Heart of Algebra', icon: Calculator, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
      { code: 'adv', name: 'Advanced Math', icon: Compass, color: 'text-blue-400', bg: 'bg-blue-500/10' },
      { code: 'psda', name: 'Problem Solving & Data Analysis', icon: Layers, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
      { code: 'geo', name: 'Geometry & Trigonometry', icon: Target, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    ];

    const rwDomains = [
      { code: 'cas', name: 'Craft and Structure', icon: FileText, color: 'text-violet-400', bg: 'bg-violet-500/10' },
      { code: 'iai', name: 'Information and Ideas', icon: BookOpen, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
      { code: 'sec', name: 'Standard English Conventions', icon: GraduationCap, color: 'text-pink-400', bg: 'bg-pink-500/10' },
      { code: 'eoi', name: 'Expression of Ideas', icon: Sparkles, color: 'text-teal-400', bg: 'bg-teal-500/10' },
    ];

    const computeDomainProgress = (domainList: typeof mathDomains) => {
      return domainList.map((d) => {
        const typesInDomain = MICRO_TYPES.filter(
          (m) => m.domainCode?.toLowerCase() === d.code || m.id.toLowerCase().startsWith(d.code)
        );
        const total = typesInDomain.length || 1;
        const mastered = typesInDomain.filter(
          (m) => (userState.mastery[m.id]?.masteryPercentage || 0) >= 80
        ).length;
        const pct = Math.round((mastered / total) * 100);
        return { ...d, total, mastered, pct };
      });
    };

    return {
      math: computeDomainProgress(mathDomains),
      rw: computeDomainProgress(rwDomains),
    };
  }, [userState.mastery]);

  // Exam routine countdown
  const examDateStr = userState.routine?.examDate || '2026-11-07';
  const examTargetScore = userState.routine?.targetScore || 1520;
  const daysRemaining = useMemo(() => {
    const exam = new Date(examDateStr).getTime();
    const now = new Date().getTime();
    const diff = Math.ceil((exam - now) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  }, [examDateStr]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ─── Hero: Official Predicted Score Banner ─── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 sm:p-8 rounded-[3rem] bg-gradient-to-br from-blue-950/40 via-panel to-panel border-2 border-blue-500/30 shadow-2xl space-y-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-blue-400">
                {language === 'bn' ? 'অফিসিয়াল অ্যানালিটিক্স' : 'Calibrated Score Engine'}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-app-fg mt-1">
              {language === 'bn' ? 'অফিসিয়াল স্কোর প্রেডিকশন' : 'Official Score Prediction'}
            </h2>
            <p className="text-xs font-bold text-app-fg/50 max-w-lg mt-0.5">
              {language === 'bn'
                ? 'ডিজিটাল SAT-এর ৩,৩১৫টি অথেনটিক আইটেম ও অ্যাডাপ্টিভ স্কেলিং অনুযায়ী ক্যালিব্রেটেড।'
                : 'Calibrated strictly to Digital SAT 2-stage adaptive routing and 3,315 question items.'}
            </p>
          </div>

          <div className="text-center sm:text-right shrink-0">
            <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400">
              {prediction.compositeScore}
              <span className="text-xl font-bold text-app-fg/40 ml-1">/ 1600</span>
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-app-fg/50 block mt-1">
              {language === 'bn'
                ? `সম্ভাব্য রেঞ্জ: ${prediction.compositeRange[0]} - ${prediction.compositeRange[1]}`
                : `Predicted Band: ${prediction.compositeRange[0]} - ${prediction.compositeRange[1]}`}
            </span>
          </div>
        </div>

        {/* Section score breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 relative z-10">
          {/* Math */}
          <div className="p-4 rounded-2xl bg-panel border border-border-subtle flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-app-fg/50">
                {language === 'bn' ? 'ম্যাথ সেকশন' : 'Math Section'}
              </span>
              <div className="text-2xl font-black text-cyan-400">
                {prediction.mathScore} <span className="text-xs font-normal text-app-fg/40">/ 800</span>
              </div>
            </div>
            <div className="text-right text-xs font-bold text-app-fg/60">
              <div>Target: 780+</div>
              <div className="text-[11px] text-cyan-400 font-black">Full Desmos Mastery</div>
            </div>
          </div>

          {/* Reading & Writing */}
          <div className="p-4 rounded-2xl bg-panel border border-border-subtle flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-app-fg/50">
                {language === 'bn' ? 'রিডিং ও রাইটিং' : 'Reading & Writing'}
              </span>
              <div className="text-2xl font-black text-violet-400">
                {prediction.rwScore} <span className="text-xs font-normal text-app-fg/40">/ 800</span>
              </div>
            </div>
            <div className="text-right text-xs font-bold text-app-fg/60">
              <div>Target: 740+</div>
              <div className="text-[11px] text-violet-400 font-black">Craft & Structure Focus</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── Score Trajectory Curve ─── */}
      <ScoreHistoryGraph
        quizzes={userState.quizzes || []}
        currentScore={prediction.compositeScore}
        mathScore={prediction.mathScore}
        rwScore={prediction.rwScore}
        targetScore={examTargetScore}
      />

      {/* ─── 4 Key Performance Metrics ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-panel border border-border-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-app-fg/50">
              {language === 'bn' ? 'টাইপ মাস্টারি' : 'Type Mastery'}
            </span>
            <Award size={16} className="text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400">
            {masteredMicroTypes}
            <span className="text-base font-bold text-app-fg/40">/{totalMicroTypes}</span>
          </div>
          <p className="text-[11px] font-bold text-app-fg/50">80%+ threshold</p>
        </div>

        <div className="p-5 rounded-3xl bg-panel border border-border-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-app-fg/50">
              {language === 'bn' ? 'নির্ভুলতা' : 'Accuracy'}
            </span>
            <Target size={16} className="text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">{overallAccuracy}%</div>
          <p className="text-[11px] font-bold text-app-fg/50">{correctAttempts} / {totalAttempts} items</p>
        </div>

        <div className="p-5 rounded-3xl bg-panel border border-border-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-app-fg/50">
              {language === 'bn' ? 'ভুল ব্যাংক' : 'Mistake Bank'}
            </span>
            <AlertTriangle size={16} className="text-rose-400" />
          </div>
          <div className="text-3xl font-black text-rose-400">{unresolvedMistakes}</div>
          <p className="text-[11px] font-bold text-app-fg/50">Traps requiring review</p>
        </div>

        <div className="p-5 rounded-3xl bg-panel border border-border-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-app-fg/50">
              {language === 'bn' ? 'পরীক্ষার কাউন্টডাউন' : 'Exam Countdown'}
            </span>
            <Calendar size={16} className="text-blue-400" />
          </div>
          <div className="text-3xl font-black text-blue-400">{daysRemaining}d</div>
          <p className="text-[11px] font-bold text-app-fg/50">{examDateStr}</p>
        </div>
      </div>

      {/* ─── Domain & Microtype Mastery Breakdown ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Math Domains */}
        <div className="glass p-6 sm:p-7 rounded-3xl border border-border-subtle space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Calculator size={18} />
              </div>
              <h3 className="font-black text-base text-app-fg">
                {language === 'bn' ? 'ম্যাথ ডোমেন অগ্রগতি' : 'Math Domain Mastery'}
              </h3>
            </div>
            <Link
              to="/sat/types"
              onClick={() => play('tap')}
              className="text-xs font-black text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>{language === 'bn' ? 'ড্রিল শুরু করুন' : 'Drill Types'}</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="space-y-4">
            {domainStats.math.map((d) => (
              <div key={d.code} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-app-fg flex items-center gap-1.5">
                    <d.icon size={13} className={d.color} />
                    <span>{d.name}</span>
                  </span>
                  <span className="text-app-fg/60">
                    {d.mastered} / {d.total} ({d.pct}%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-app-bg border border-border-subtle overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${d.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reading & Writing Domains */}
        <div className="glass p-6 sm:p-7 rounded-3xl border border-border-subtle space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                <BookOpen size={18} />
              </div>
              <h3 className="font-black text-base text-app-fg">
                {language === 'bn' ? 'রিডিং ও রাইটিং ডোমেন' : 'R&W Domain Mastery'}
              </h3>
            </div>
            <Link
              to="/sat/types"
              onClick={() => play('tap')}
              className="text-xs font-black text-violet-400 hover:underline flex items-center gap-1"
            >
              <span>{language === 'bn' ? 'ড্রিল শুরু করুন' : 'Drill Types'}</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="space-y-4">
            {domainStats.rw.map((d) => (
              <div key={d.code} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-app-fg flex items-center gap-1.5">
                    <d.icon size={13} className={d.color} />
                    <span>{d.name}</span>
                  </span>
                  <span className="text-app-fg/60">
                    {d.mastered} / {d.total} ({d.pct}%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-app-bg border border-border-subtle overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-400 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${d.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
