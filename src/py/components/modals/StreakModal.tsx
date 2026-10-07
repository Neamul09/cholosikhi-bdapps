import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Sparkles } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import { clsx } from 'clsx';

interface StreakModalProps {
  streak: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function StreakModal({ streak, isOpen, onClose }: StreakModalProps) {
  const { language } = useSettingsStore();

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
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="relative bg-app-bg rounded-[3rem] p-8 max-w-sm w-full text-center border-4 border-orange-500 shadow-[0_0_50px_rgba(249,115,22,0.3)]"
          >
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white"
            >
              <Flame size={48} className="text-white" />
            </motion.div>

            <div className="mt-12 space-y-4">
              <h2 className="text-5xl font-black text-white uppercase tracking-tighter flex flex-col">
                <span className="text-orange-500 text-7xl">{streak}</span>
                {language === 'bn' ? 'দিনের স্ট্রিক!' : 'DAY STREAK!'}
              </h2>
              
              <div className="flex items-center justify-center gap-2 text-orange-400 font-bold py-2">
                <Sparkles size={20} />
                <span>{language === 'bn' ? 'অবিশ্বাস্য ধারাবাহিকতা!' : 'Incredible consistency!'}</span>
                <Sparkles size={20} />
              </div>

              <p className="text-gray-400 font-bold">
                {language === 'bn' 
                  ? 'আপনি প্রতিদিন শিখছেন। এই স্ট্রিকটি বজায় রাখুন!' 
                  : "You're learning every day. Keep this streak alive!"}
              </p>

              <div className="grid grid-cols-7 gap-1 py-4">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                  <div key={i} className={clsx(
                    "h-10 rounded-lg flex items-center justify-center font-black text-xs",
                    i === (new Date().getDay() + 6) % 7 ? "bg-orange-500 text-white" : "bg-white/5 text-gray-500"
                  )}>
                    {d}
                  </div>
                ))}
              </div>

              <button
                onClick={onClose}
                className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-xl shadow-[0_5px_0_#c2410c] active:translate-y-1 active:shadow-none transition-all"
              >
                {language === 'bn' ? 'অসাধারণ!' : 'AWESOME!'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

