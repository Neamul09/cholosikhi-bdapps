import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, CheckCircle, Play } from 'lucide-react';
import { cppLessons } from '@/content/cpp/lessons';
import { cppSections } from '@/content/cpp/metadata';
import { useProgressStore } from '@/store/progressStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useUserStore } from '@/store/userStore';

export default function LessonView() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { language } = useSettingsStore();
  const { setCurrentLesson } = useProgressStore();
  useUserStore();

  const lesson = cppLessons.find((l) => l.id === lessonId);
  const section = cppSections.find((s) => s.id === lesson?.sectionId);

  const [step, setStep] = useState(0); // 0 = theory 0, 1 = theory 1... max = theory.length

  useEffect(() => {
    if (lesson && section) {
      setCurrentLesson(section.courseId, section.id, lesson.id);
    }
  }, [lesson, section, setCurrentLesson]);

  if (!lesson) return <div className="p-8 text-center">Lesson not found</div>;

  const translate = (ls: import('@/content/schema').LocalizedString | undefined | null) => {
    if (!ls) return '';
    if (typeof ls === 'string') return ls;
    return language === 'bn' ? ls.bn : ls.en;
  };

  const isTheory = step < lesson.theory.length;
  const theoryPart = lesson.theory[step];

  const handleNext = () => {
    if (isTheory) {
      setStep((s) => s + 1);
    } else {
      // Done with theory — go to practice
      navigate(`/practice/${lesson.id}`);
    }
  };

  const pct = Math.round((step / lesson.theory.length) * 100);

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-[#0d1117] relative">

      {/* Header cross-bar */}
      <div className="flex items-center gap-4 px-4 py-3 bg-white/5 border-b border-white/10 shrink-0">
        <button onClick={() => navigate(`/learn/${lesson.sectionId}`)} className="p-2 hover:bg-white/10 rounded-full transition">
          <X size={20} className="text-gray-400" />
        </button>
        <div className="flex-1">
          <div className="h-3 bg-white/10 rounded-full overflow-hidden w-full">
            <motion.div className="h-full gradient-brand rounded-full" animate={{ width: `${pct}%` }} transition={{ duration: 0.3 }} />
          </div>
        </div>
        <div className="font-bold text-amber-400 text-sm flex items-center gap-1">
          <span className="text-lg">⚡</span>{lesson.xpReward}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-8 pb-32">
        <AnimatePresence mode="wait">
          {isTheory && theoryPart && (
            <motion.div
              key={step}
              initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-black mb-6">{translate(theoryPart.heading)}</h2>
              
              <div className="text-lg leading-relaxed text-gray-300">
                {translate(theoryPart.body).split('\n').map((line: string, i: number) => (
                  <p key={i} className="mb-4">{line}</p>
                ))}
              </div>

              {theoryPart.code && (
                <div className="mt-8">
                  <div className="bg-brand-900/40 border border-brand-500/30 rounded-t-xl px-4 py-2 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="ml-2 text-xs font-mono text-brand-300 uppercase select-none">{theoryPart.code.language}</span>
                    <button 
                      onClick={() => theoryPart.code && navigate('/playground', { state: { code: theoryPart.code.code, lang: theoryPart.code.language } })}
                      className="ml-auto flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-black text-white transition-all uppercase tracking-wider"
                    >
                      <Play size={10} fill="currentColor" />
                      {translate({ en: 'Try it', bn: 'চেষ্টা করুন' })}
                    </button>
                  </div>
                  <div className="code-block rounded-none p-5 text-base border-x border-b border-t-0 border-white/10 overflow-x-auto">
                    <pre className="mono text-gray-200">{theoryPart.code.code}</pre>
                  </div>
                  
                  {theoryPart.code.output && (
                    <div className="bg-black/60 border border-white/5 rounded-b-xl p-4 mt-1 font-mono text-sm text-green-400">
                      <div className="text-gray-500 text-xs mb-1">OUTPUT (Console):</div>
                      {theoryPart.code.output}
                    </div>
                  )}

                  <div className="mt-4 p-4 glass rounded-xl flex items-start gap-4">
                    <Info size={24} className="text-brand-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-300">
                      {translate(theoryPart.code.explanation)}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {!isTheory && (
            <motion.div
              key="done"
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="text-center py-20 flex flex-col items-center gap-6"
            >
              <div className="w-32 h-32 rounded-full gradient-brand flex items-center justify-center shadow-2xl shadow-brand-500/40">
                <CheckCircle size={64} className="text-white" />
              </div>
              <h2 className="text-4xl font-black">{translate({ en: 'Theory Complete!', bn: 'তত্ত্ব সম্পন্ন!' })}</h2>
              <p className="text-gray-400 text-lg">
                {translate({ en: 'Now let\'s test your knowledge.', bn: 'এবার আপনার নলেজ যাচাই করা যাক।' })}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer / Continue button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/90 to-transparent flex justify-center z-20">
        <div className="max-w-2xl w-full">
          <button
            onClick={handleNext}
            className="w-full py-4 rounded-xl font-bold text-lg text-white gradient-brand hover-lift press-effect shadow-xl"
          >
            {isTheory ? translate({ en: 'Continue', bn: 'চালিয়ে যান' }) : translate({ en: 'Start Practice', bn: 'অনুশীলন শুরু করুন' })}
          </button>
        </div>
      </div>
    </div>
  );
}
