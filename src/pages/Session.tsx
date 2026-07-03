import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Info, Bot, Trophy } from 'lucide-react';
import { clsx } from 'clsx';
import { useSettingsStore } from '@/store/settingsStore';
import { allPythonLessons as pythonLessons } from '@/content/python/lessons';
import { cppLessons } from '@/content/cpp/lessons';
import { useProgressStore } from '@/store/progressStore';
import { useUserStore } from '@/store/userStore';
import { LevelUpModal, CorrectOverlay, WrongOverlay } from '@/components/modals';
import { MCQExercise, FillBlankExercise, OutputPredictExercise, BugHuntExercise, CodeArrangeExercise } from '@/components/exercises';

// A single item in the session queue
type SessionItem = 
  | { type: 'theory', content: any, id: string }
  | { type: 'exercise', content: any, id: string };

export default function SessionView() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { setLessonComplete } = useProgressStore();
  const { addXp, hearts, loseHeart, level } = useUserStore();
  const { language, currentCourse } = useSettingsStore();

  const lessons = currentCourse === 'python' ? pythonLessons : cppLessons;
  const lesson = lessons.find((l) => l.id === lessonId);
  
  const [queue, setQueue] = useState<SessionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalItems, setTotalItems] = useState(1);
  const [sessionState, setSessionState] = useState<'playing' | 'checking_correct' | 'checking_wrong' | 'done'>('playing');
  const [wrongExplanation, setWrongExplanation] = useState('');
  const [correctExplanation, setCorrectExplanation] = useState('');
  
  const [startLevel] = useState(level);
  const [showLevelUp, setShowLevelUp] = useState(false);

  // Initialize interleaved queue
  useEffect(() => {
    if (!lesson) return;
    
    // Interleave theory and exercises
    const newQueue: SessionItem[] = [];
    const maxLen = Math.max(lesson.theory.length, lesson.exercises.length);
    for (let i = 0; i < maxLen; i++) {
      if (lesson.theory[i]) newQueue.push({ type: 'theory', content: lesson.theory[i], id: `t_${i}` });
      if (lesson.exercises[i]) newQueue.push({ type: 'exercise', content: lesson.exercises[i], id: `e_${lesson.exercises[i].id}` });
    }
    setQueue(newQueue);
    setTotalItems(newQueue.length);
  }, [lesson]);

  if (!lesson) return <div className="p-8 text-center text-app-fg font-bold">{language === 'bn' ? 'পাঠটি খুঁজে পাওয়া যায়নি' : 'Lesson not found'}</div>;

  const currentItem = queue[currentIndex];

  const handleAnswer = (correct: boolean) => {
    const expl = currentItem.type === 'exercise' && currentItem.content.explanation;
    const explText = expl ? (typeof expl === 'string' ? expl : expl[language]) : '';

    if (correct) {
      setSessionState('checking_correct');
      addXp(currentItem.type === 'exercise' ? currentItem.content.xpReward : 0);
      setCorrectExplanation(explText);
    } else {
      setSessionState('checking_wrong');
      loseHeart();
      setWrongExplanation(explText || (language === 'bn' ? 'ভুল উত্তর, দয়া করে আবার চেষ্টা করুন।' : 'Wrong answer, please try again.'));
      
      // Push string copy of exercise to back of queue
      setQueue(prev => [...prev, { ...currentItem, id: currentItem.id + "_retry" }]);
    }
  };

  const handleContinue = () => {
    if (sessionState === 'checking_wrong' && hearts <= 0) {
      // Out of hearts
      navigate('/');
      return;
    }

    if (currentIndex < queue.length - 1) {
      setCurrentIndex(c => c + 1);
      setSessionState('playing');
    } else {
      // Finished all items
      setSessionState('done');
      setLessonComplete(lesson.id, 100, 5, currentCourse);
      if (level > startLevel) setShowLevelUp(true);
    }
  };

  const pct = Math.round((currentIndex / totalItems) * 100);

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-app-bg relative overflow-hidden">
      <AnimatePresence>
        {showLevelUp && <LevelUpModal level={level} onClose={() => { setShowLevelUp(false); navigate(`/`); }} />}
      </AnimatePresence>

      {/* Progress Header */}
      <div className="flex items-center gap-4 px-4 py-6 shrink-0 z-40">
        <button onClick={() => navigate(`/`)} className="p-2 text-gray-400 hover:text-gray-200 transition">
          <X size={24} strokeWidth={3} />
        </button>
        <div className="flex-1">
          <div className="h-4 bg-[#e5e5e5] dark:bg-[#202f36] rounded-full overflow-hidden w-full relative">
            <motion.div 
              className="h-full bg-duo-green absolute left-0 top-0 rounded-full border-r border-[#69e000]" 
              animate={{ width: `${pct}%` }} 
              transition={{ duration: 0.4, type: "spring" }} 
            >
              <div className="absolute top-1 left-3 right-3 h-1 bg-white/30 rounded-full" />
            </motion.div>
          </div>
        </div>
        <div className="flex items-center gap-2 font-black text-duo-red text-xl">
          <Heart size={24} className="fill-duo-red" strokeWidth={0} /> {hearts}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-48 scroll-smooth hide-scrollbar">
        <AnimatePresence mode="wait">
          {sessionState !== 'done' && currentItem && (
            <motion.div
              key={currentItem.id}
              initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="space-y-6 max-w-xl mx-auto"
            >
              {/* Theory Block */}
              {currentItem.type === 'theory' && (
                <div className="space-y-6">
                  <div className="flex gap-4 items-end">
                    <div className={clsx(
                      "w-16 h-16 rounded-full flex items-center justify-center shrink-0 border-4 relative",
                      sessionState === 'checking_wrong' ? "bg-duo-red border-duo-red-shadow" : "bg-duo-green border-duo-green-shadow"
                    )}>
                       <Bot size={32} className="text-white" strokeWidth={2.5} />
                       {/* Chat bubble tail */}
                       <div className={clsx(
                         "absolute -right-3 top-6 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-[12px]",
                         sessionState === 'checking_wrong' ? "border-l-duo-red" : "border-l-duo-green",
                         "rotate-180"
                       )} />
                    </div>
                    <div className="border-[3px] border-border-subtle rounded-3xl p-5 bg-panel flex-1 shadow-sm">
                      <h2 className="text-2xl font-black mb-2">{typeof currentItem.content.heading === 'string' ? currentItem.content.heading : currentItem.content.heading[language]}</h2>
                      <div className="text-lg font-medium text-app-fg/80">
                        {typeof currentItem.content.body === 'string' ? currentItem.content.body : currentItem.content.body[language]}
                      </div>
                    </div>
                  </div>

                  {currentItem.content.code && (
                     <div className="code-block mt-4 border-2 border-border-subtle rounded-2xl p-4">
                       <pre className="text-lg text-[#1cb0f6]">{currentItem.content.code.code}</pre>
                       <div className="mt-4 pt-4 border-t border-white/10 flex gap-2 items-start text-emerald-400 font-medium">
                         <Info size={20} className="shrink-0 mt-0.5" />
                          <span className="text-sm">
                            {typeof currentItem.content.code.explanation === 'string' 
                              ? currentItem.content.code.explanation 
                              : currentItem.content.code.explanation[language]}
                          </span>
                       </div>
                     </div>
                  )}
                </div>
              )}

              {/* Exercise Block */}
              {currentItem.type === 'exercise' && (
                <div>
                  <h2 className="text-2xl font-bold mb-8">
                    {typeof currentItem.content.question === 'string' ? currentItem.content.question : currentItem.content.question[language]}
                  </h2>
                  <div className={clsx("mt-4", sessionState === 'checking_wrong' && "animate-shake")}>
                    {currentItem.content.type === 'mcq' && <MCQExercise exercise={currentItem.content} onAnswer={handleAnswer} />}
                    {currentItem.content.type === 'fill_blank' && <FillBlankExercise exercise={currentItem.content} onAnswer={handleAnswer} />}
                    {currentItem.content.type === 'output_predict' && <OutputPredictExercise exercise={currentItem.content} onAnswer={handleAnswer} />}
                    {currentItem.content.type === 'bug_hunt' && <BugHuntExercise exercise={currentItem.content} onAnswer={handleAnswer} />}
                    {currentItem.content.type === 'code_arrange' && <CodeArrangeExercise exercise={currentItem.content} onAnswer={handleAnswer} />}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {sessionState === 'done' && !showLevelUp && (
            <motion.div
              key="done"
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="text-center py-20 flex flex-col items-center gap-6"
            >
              <div className="w-40 h-40">
                <div className="w-full h-full flex items-center justify-center animate-bounce text-duo-gold">
                   <Trophy size={100} strokeWidth={2} />
                </div>
              </div>
               <h2 className="text-3xl font-black text-duo-gold text-shadow-sm">{language === 'bn' ? 'পাঠ সম্পন্ন!' : 'Lesson Complete!'}</h2>
              <div className="flex gap-4 mt-4 w-full justify-center">
                <div className="w-32 py-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex flex-col items-center">
                  <span className="text-amber-500 font-black text-2xl uppercase">{language === 'bn' ? 'টোটাল এক্সপি' : 'TOTAL XP'}</span>
                  <span className="text-amber-400 font-bold text-xl mt-1">+{lesson.xpReward}</span>
                </div>
                <div className="w-32 py-4 rounded-2xl bg-duo-blue/10 border-2 border-duo-blue/30 flex flex-col items-center">
                  <span className="text-duo-blue font-black text-2xl uppercase">{language === 'bn' ? 'ফোকাস' : 'Focus'}</span>
                  <span className="text-duo-blue font-bold text-xl mt-1 text-center">100%</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Drawer Area */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <AnimatePresence>
          {sessionState === 'playing' && currentItem?.type === 'theory' && (
            <motion.div
              key="footer-theory"
               initial={{ y: 200 }} animate={{ y: 0 }} exit={{ y: 200 }}
               className="bg-app-bg border-t-2 border-border-subtle p-4 md:p-8 flex justify-center"
            >
              <div className="max-w-3xl w-full flex justify-end">
                <button onClick={handleContinue} className="btn-duo btn-duo-green w-full md:w-48 py-4 text-xl">
                  {language === 'bn' ? 'এগিয়ে যান' : 'Continue'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Overlays / Footer — sibling of the footer above, NOT nested */}
      <AnimatePresence>
        {sessionState === 'checking_correct' && (
          <CorrectOverlay key="overlay-correct" explanation={correctExplanation} onContinue={handleContinue} />
        )}
        {sessionState === 'checking_wrong' && (
          <WrongOverlay key="overlay-wrong" explanation={wrongExplanation} onContinue={handleContinue} />
        )}
      </AnimatePresence>

    </div>
  );
}
