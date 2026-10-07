import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowUp, Gem } from 'lucide-react';
import { fireConfetti } from '@/utils/confetti';
import { useSettingsStore } from '@/store/settingsStore';

interface LevelUpModalProps {
  level: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function LevelUpModal({ level, isOpen, onClose }: LevelUpModalProps) {
  const { language } = useSettingsStore();

  React.useEffect(() => {
    if (isOpen) {
      fireConfetti();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 100 }}
            className="relative bg-app-bg rounded-[3rem] p-8 max-w-sm w-full text-center border-4 border-amber-400 shadow-[0_0_50px_rgba(251,191,36,0.3)]"
          >
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-amber-400 rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
              <Trophy size={48} className="text-white" />
            </div>

            <div className="mt-12 space-y-4">
              <h2 className="text-4xl font-black text-amber-400 uppercase tracking-tighter">
                {language === 'bn' ? 'লেভেল আপ!' : 'LEVEL UP!'}
              </h2>
              
              <div className="flex items-center justify-center gap-4 py-6">
                <div className="text-gray-400 line-through text-2xl font-bold">{level - 1}</div>
                <ArrowUp className="text-amber-400 animate-bounce" size={32} />
                <div className="text-6xl font-black text-white drop-shadow-lg">{level}</div>
              </div>

              <p className="text-gray-400 font-bold">
                {language === 'bn' 
                  ? 'আপনি নতুন উচ্চতায় পৌঁছেছেন! দুর্দান্ত কাজ।' 
                  : 'You have reached a new height! Keep it up.'}
              </p>

              <div className="bg-amber-400/10 rounded-2xl p-4 flex items-center justify-center gap-3 border border-amber-400/20">
                <Gem className="text-amber-400" />
                <span className="font-black text-amber-400 text-xl">+50 BONUS</span>
              </div>

              <button
                onClick={onClose}
                className="w-full py-4 bg-amber-400 hover:bg-amber-500 text-white rounded-2xl font-black text-xl shadow-[0_5px_0_#d97706] active:translate-y-1 active:shadow-none transition-all"
              >
                {language === 'bn' ? 'চালিয়ে যান' : 'CONTINUE'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
