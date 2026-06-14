import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Zap, Target, Trophy, Sparkles, BookOpen } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import { clsx } from 'clsx';

const STEPS = [
  {
    icon: Zap,
    color: 'text-blue-400',
    title: { en: 'Welcome to py.cholosikhi!', bn: 'py.cholosikhi-তে স্বাগতম!' },
    desc: { en: 'The most fun way to master Python and C++. Let\'s take a quick tour.', bn: 'পাইথন এবং সি++ শেখার সবচেয়ে মজার উপায়। চলুন একটি ছোট ট্যুর দেওয়া যাক।' }
  },
  {
    icon: BookOpen,
    color: 'text-cyan-400',
    title: { en: 'Learn by Doing', bn: 'কাজ করে শিখুন' },
    desc: { en: 'Interactive lessons with bite-sized theories and practical exercises.', bn: 'theory এবং প্র্যাকটিক্যাল এক্সারসাইজের মাধ্যমে ইন্টারেক্টিভ পাঠ।' }
  },
  {
    icon: Target,
    color: 'text-pink-400',
    title: { en: 'Daily Quests', bn: 'প্রতিদিনের মিশন' },
    desc: { en: 'Complete daily missions to earn gems and stay consistent.', bn: 'রত্ন অর্জন করতে এবং ধারাবাহিক থাকতে প্রতিদিনের মিশন সম্পন্ন করুন।' }
  },
  {
    icon: Trophy,
    color: 'text-amber-400',
    title: { en: 'Leaderboards', bn: 'লিডারবোর্ড' },
    desc: { en: 'Compete with friends and others in weekly leagues to reach the top!', bn: 'শীর্ষে পৌঁছাতে বন্ধুদের এবং অন্যদের সাথে সাপ্তাহিক লিগে প্রতিযোগিতা করুন!' }
  },
  {
    icon: Sparkles,
    color: 'text-violet-400',
    title: { en: 'Ready to Start?', bn: 'আপনি কি তৈরি?' },
    desc: { en: 'Your journey to becoming a pro coder starts now. Good luck!', bn: 'একজন প্রো কোডার হওয়ার পথে আপনার যাত্রা এখন শুরু হচ্ছে। শুভকামনা!' }
  }
];

export default function Tutorial({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [step, setStep] = useState(0);
  const { language, setHasSeenTutorial } = useSettingsStore();

  const handleFinish = () => {
    setHasSeenTutorial(true);
    onClose();
  };

  const nextStep = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else handleFinish();
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  if (!isOpen) return null;

  const currentStep = STEPS[step];
  const Icon = currentStep.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-panel border-2 border-border-subtle rounded-[3rem] p-8 shadow-2xl overflow-hidden"
        >
          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-8">
            {STEPS.map((_, i) => (
              <div 
                key={i} 
                className={clsx(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === step ? "w-8 bg-blue-500" : "w-2 bg-app-bg/20"
                )} 
              />
            ))}
          </div>

          <div className="flex flex-col items-center text-center space-y-6">
            <motion.div
              key={step}
              initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              className={clsx("w-24 h-24 rounded-3xl bg-app-bg border-2 border-border-subtle flex items-center justify-center shadow-xl", currentStep.color)}
            >
              <Icon size={48} strokeWidth={2.5} />
            </motion.div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black">{currentStep.title[language as keyof typeof currentStep.title]}</h2>
              <p className="text-app-fg/60 font-bold leading-relaxed">
                {currentStep.desc[language as keyof typeof currentStep.desc]}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-12 pt-6 border-t border-app/5">
            <button 
              onClick={prevStep}
              disabled={step === 0}
              className={clsx(
                "p-3 rounded-2xl border-2 border-border-subtle text-app-fg/40 transition-all active:scale-90",
                step === 0 ? "opacity-0 pointer-events-none" : "hover:text-app-fg"
              )}
            >
              <ChevronLeft size={24} strokeWidth={3} />
            </button>

            <button 
              onClick={nextStep}
              className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all active:scale-95"
            >
              {step === STEPS.length - 1 ? (language === 'bn' ? 'শুরু করুন' : 'GET STARTED') : (language === 'bn' ? 'পরবর্তী' : 'NEXT')}
              <ChevronRight size={20} strokeWidth={3} />
            </button>
          </div>

          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-app-fg/20 hover:text-app-fg transition-colors"
          >
            <X size={20} />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
