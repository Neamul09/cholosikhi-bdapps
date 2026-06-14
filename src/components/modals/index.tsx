import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Star, Zap, Trophy, Gem, Info } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import { clsx } from 'clsx';

// ── XP Toast ──────────────────────────────────────────────────
export function XPToast({ amount, visible }: { amount: number; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 0, scale: 0.7 }}
          animate={{ opacity: 1, y: -70, scale: 1 }}
          exit={{ opacity: 0, y: -120, scale: 0.8 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="fixed top-20 right-6 z-50 flex items-center gap-2 pointer-events-none
                     bg-gradient-to-r from-cyan-500 to-blue-600 text-white
                     px-5 py-2.5 rounded-full font-black shadow-2xl shadow-blue-500/40
                     border-2 border-cyan-400/60"
        >
          <Zap size={16} className="text-yellow-300 fill-yellow-300" />
          +{amount} XP
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Level Up Modal ────────────────────────────────────────────
export function LevelUpModal({ level, onClose }: { level: number; onClose: () => void }) {
  const { language } = useSettingsStore();
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    >
      {/* Particle orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div key={i}
            className="absolute w-2 h-2 rounded-full bg-cyan-400/50"
            initial={{ x: '50%', y: '50%', opacity: 0 }}
            animate={{ x: `${15 + i * 10}%`, y: `${10 + (i % 3) * 25}%`, opacity: [0, 1, 0] }}
            transition={{ delay: i * 0.1, duration: 1.5, ease: 'easeOut' }}
          />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.3, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
        className="relative bg-gradient-to-br from-[#0d1b35] to-[#060e1f]
                   rounded-[3rem] p-10 text-center max-w-sm w-full mx-4
                   border-2 border-cyan-400/30 shadow-2xl shadow-blue-500/30"
      >
        {/* Top glow ring */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24
                        bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full
                        flex items-center justify-center border-4 border-[#060e1f]
                        shadow-lg shadow-blue-500/50">
          <Trophy size={40} className="text-white" strokeWidth={2} />
        </div>

        <div className="mt-10 text-4xl font-black gradient-text mb-2 uppercase tracking-tight">
          {language === 'bn' ? 'লেভেল আপ!' : 'LEVEL UP!'}
        </div>
        <div className="text-8xl font-black text-white mb-2 drop-shadow-sm">{level}</div>
        <p className="text-blue-300/70 font-bold mb-8 px-4">
          {language === 'bn' ? 'আপনি নতুন লেভেলে পৌঁছেছেন!' : 'You reached a new level!'}
        </p>
        <button onClick={onClose} className="btn-duo btn-duo-green w-full py-4 text-xl">
          {language === 'bn' ? 'চালিয়ে যান!' : 'CONTINUE!'}
        </button>
      </motion.div>
    </motion.div>
  );
}

// ── Correct Overlay ───────────────────────────────────────────
export function CorrectOverlay({ explanation, onContinue }: { explanation?: string; onContinue: () => void }) {
  const { language } = useSettingsStore();
  const [showExplanation, setShowExplanation] = useState(true);

  return (
    <motion.div
      initial={{ y: 200, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 200, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="fixed bottom-0 left-0 right-0 z-50
                 bg-gradient-to-r from-cyan-950/95 to-blue-950/95
                 border-t-2 border-cyan-400/25
                 backdrop-blur-xl p-6 md:p-8 flex justify-center
                 shadow-[0_-8px_40px_rgba(0,212,255,0.12)]"
    >
      <div className="max-w-3xl w-full flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-start gap-4 self-start md:self-auto w-full md:w-auto">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500
                          flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/30">
            <CheckCircle size={32} strokeWidth={3} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <div className="text-2xl font-black text-cyan-300">
                {language === 'bn' ? 'সঠিক উত্তর!' : 'EXCELLENT!'}
              </div>
              {explanation && (
                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="p-1.5 rounded-full bg-blue-500/20 text-blue-300 hover:bg-blue-500/40 hover:text-white transition-colors"
                >
                  <Info size={20} strokeWidth={2.5} />
                </button>
              )}
            </div>
            {showExplanation && explanation ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="font-bold text-cyan-100/90 text-sm md:text-base leading-snug mt-1 bg-blue-950/50 p-2.5 rounded-xl border border-blue-400/20"
              >
                {explanation}
              </motion.div>
            ) : (
              <div className="text-blue-400 font-bold text-base">
                {language === 'bn' ? 'দারুণ করছেন!' : 'Keep it up!'}
              </div>
            )}
          </div>
        </div>
        <button onClick={onContinue} className="btn-duo btn-duo-green w-full md:w-52 py-4 text-xl shrink-0">
          {language === 'bn' ? 'চালিয়ে যান' : 'CONTINUE'}
        </button>
      </div>
    </motion.div>
  );
}

// ── Wrong Overlay ─────────────────────────────────────────────
export function WrongOverlay({ explanation, onContinue }: { explanation: string; onContinue: () => void }) {
  const { language } = useSettingsStore();
  return (
    <motion.div
      initial={{ y: 200, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 200, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="fixed bottom-0 left-0 right-0 z-50
                 bg-gradient-to-r from-pink-950/95 to-rose-950/95
                 border-t-2 border-pink-400/25
                 backdrop-blur-xl p-6 md:p-8 flex justify-center
                 shadow-[0_-8px_40px_rgba(244,114,182,0.10)]"
    >
      <div className="max-w-3xl w-full flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-start gap-4 self-start w-full md:w-auto">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-rose-600
                          flex items-center justify-center shrink-0 shadow-lg shadow-pink-500/30">
            <XCircle size={32} strokeWidth={3} className="text-white" />
          </div>
          <div className="w-full">
            <div className="text-2xl font-black text-pink-300 mb-1">
              {language === 'bn' ? 'ভুল উত্তর' : 'INCORRECT'}
            </div>
            <div className="font-bold text-pink-300/70 text-sm md:text-base leading-snug">
              {explanation}
            </div>
          </div>
        </div>
        <button onClick={onContinue} className="btn-duo btn-duo-red w-full md:w-52 py-4 text-xl shrink-0">
          {language === 'bn' ? 'বুঝেছি' : 'GOT IT'}
        </button>
      </div>
    </motion.div>
  );
}

// ── Test Results Modal ────────────────────────────────────────
export function TestResultModal({
  score, xpEarned, gemsEarned, stars, onContinue
}: { score: number; xpEarned: number; gemsEarned: number; stars: number; onContinue: () => void }) {
  const { language } = useSettingsStore();
  const Icon = score >= 80 ? Trophy : score >= 60 ? CheckCircle : XCircle;
  const iconColor = score >= 80 ? 'text-amber-400' : score >= 60 ? 'text-emerald-400' : 'text-rose-400';
  
  const msg   = score >= 80
    ? (language === 'bn' ? 'চমৎকার!' : 'AMAZING!')
    : score >= 60
    ? (language === 'bn' ? 'পাস করেছেন!' : 'YOU PASSED!')
    : (language === 'bn' ? 'অনুশীলন চালিয়ে যান' : 'KEEP PRACTICING');

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="bg-gradient-to-br from-[#0d1b35] to-[#060e1f]
                   rounded-[3rem] p-8 text-center max-w-sm w-full mx-4
                   border-2 border-blue-500/20 shadow-2xl shadow-blue-500/20"
      >
        <div className={clsx("flex items-center justify-center mb-4", iconColor)}>
          <Icon size={80} strokeWidth={2.5} />
        </div>
        <div className="text-3xl font-black mb-1 text-white uppercase tracking-tight">{msg}</div>
        <div className="text-5xl font-black gradient-text mb-6">{score}%</div>

        <div className="flex justify-center gap-3 mb-8">
          {[1, 2, 3].map((s) => (
            <motion.div key={s}
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: s <= stars ? 1.2 : 0.7, rotate: 0 }}
              transition={{ delay: s * 0.15, type: 'spring' }}
            >
              <Star size={48} strokeWidth={3}
                className={s <= stars ? 'text-violet-400 fill-violet-400 drop-shadow-md' : 'text-white/10'} />
            </motion.div>
          ))}
        </div>

        <div className="flex gap-4 mb-8">
          <div className="flex-1 bg-blue-500/10 rounded-2xl py-4 border-2 border-blue-500/20">
            <div className="text-[10px] text-blue-400/60 font-black uppercase tracking-widest mb-1">
              {language === 'bn' ? 'অর্জিত এক্সপি' : 'XP EARNED'}
            </div>
            <div className="font-black text-2xl text-amber-400">+{xpEarned}</div>
          </div>
          <div className="flex-1 bg-blue-500/10 rounded-2xl py-4 border-2 border-blue-500/20">
            <div className="text-[10px] text-blue-400/60 font-black uppercase tracking-widest mb-1">
              {language === 'bn' ? 'রত্ন' : 'GEMS'}
            </div>
            <div className="font-black text-2xl text-blue-400 flex items-center justify-center gap-1">
               +{gemsEarned} <Gem size={18} className="fill-blue-400" />
            </div>
          </div>
        </div>

        <button onClick={onContinue} className="btn-duo btn-duo-green w-full py-4 text-xl">
          {language === 'bn' ? 'চালিয়ে যান' : 'CONTINUE'}
        </button>
      </motion.div>
    </motion.div>
  );
}

// ── Achievement Toast ─────────────────────────────────────────
export function AchievementToast({ name, icon, visible }: { name: string; icon: string; visible: boolean }) {
  const { language } = useSettingsStore();
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: 120, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed top-24 right-6 z-50
                     bg-gradient-to-br from-[#0d1b35] to-[#060e1f]
                     border-2 border-violet-400/40 rounded-[2rem]
                     px-6 py-4 flex items-center gap-4
                     shadow-2xl shadow-violet-500/20"
        >
          <div className="text-4xl filter drop-shadow-md">{icon}</div>
          <div>
            <div className="text-[10px] text-violet-400 font-black uppercase tracking-widest">
              {language === 'bn' ? 'নতুন অর্জন!' : 'NEW ACHIEVEMENT!'}
            </div>
            <div className="font-black text-white text-lg tracking-tight leading-tight">{name}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
