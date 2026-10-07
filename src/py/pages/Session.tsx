import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Info, Trophy, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import { NINI_MASCOT } from '@/lib/mascot';
import { useSettingsStore } from '@/store/settingsStore';
import { allPythonLessons as pythonLessons } from '@/content/python/lessons';
import { cppLessons } from '@/content/cpp/lessons';
import type { Exercise, Lesson } from '@/content/schema';
import { useProgressStore } from '@/store/progressStore';
import { useUserStore } from '@/store/userStore';
import { LevelUpModal, CorrectOverlay, WrongOverlay } from '@/components/modals';
import { MCQExercise, FillBlankExercise, OutputPredictExercise, BugHuntExercise, CodeArrangeExercise } from '@/components/exercises';
import { play } from '@/lib/audio';
import { trackEvent } from '@/lib/analytics';

// A single item in the session queue
type TheoryBlock = Lesson['theory'][number];
type ExplainedExercise = Exclude<Exercise, { type: 'mini_challenge' }>;
type SessionItem =
  | { type: 'theory'; content: TheoryBlock; id: string }
  | { type: 'exercise'; content: ExplainedExercise; id: string };

export default function SessionView() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { setLessonComplete } = useProgressStore();
  const { addXp, hearts, loseHeart, level } = useUserStore();
  const { language, currentCourse } = useSettingsStore();

  const lessons = currentCourse === 'python' ? pythonLessons : cppLessons;
  const lesson = lessons.find((l) => l.id === lessonId);

  const [queue, setQueue] = useState<SessionItem[]>(() => {
    if (!lesson) return [];
    const items: SessionItem[] = [];
    const maxLen = Math.max(lesson.theory.length, lesson.exercises.length);
    for (let i = 0; i < maxLen; i++) {
      const theoryBlock = lesson.theory[i];
      if (theoryBlock) items.push({ type: 'theory', content: theoryBlock, id: `t_${i}` });
      const exercise = lesson.exercises[i];
      // `mini_challenge` exercises don't fit this view (no `explanation`); skip them.
      if (exercise && exercise.type !== 'mini_challenge') {
        items.push({ type: 'exercise', content: exercise, id: `e_${exercise.id}` });
      }
    }
    return items;
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionState, setSessionState] = useState<'playing' | 'checking_correct' | 'checking_wrong' | 'done'>('playing');
  const [wrongExplanation, setWrongExplanation] = useState('');
  const [correctExplanation, setCorrectExplanation] = useState('');
  const [showLevelUp, setShowLevelUp] = useState(false);

  const totalItems = queue.length;
  const [startLevel] = useState(level);

  // Stealth telemetry: track lesson start
  useEffect(() => {
    if (lesson?.id) {
      trackEvent('lesson_start', { lessonId: lesson.id, course: currentCourse });
    }
  }, [lesson?.id, currentCourse]);

  if (!lesson) return <div className="p-8 text-center text-app-fg font-bold">{language === 'bn' ? 'পাঠটি খুঁজে পাওয়া যায়নি' : 'Lesson not found'}</div>;

  const currentItem = queue[currentIndex];

  const handleAnswer = (correct: boolean) => {
    const exerciseContent = currentItem.type === 'exercise' ? currentItem.content : null;
    const expl = exerciseContent?.explanation;
    const explText = expl ? (typeof expl === 'string' ? expl : expl[language]) : '';

    trackEvent('exercise_answered', { lessonId: lesson.id, isCorrect: correct });

    if (correct) {
      setSessionState('checking_correct');
      addXp(currentItem.type === 'exercise' ? currentItem.content.xpReward : 0);
      setCorrectExplanation(explText);
      play('correct');
    } else {
      setSessionState('checking_wrong');
      loseHeart();
      setWrongExplanation(explText || (language === 'bn' ? 'ভুল উত্তর, আবার চেষ্টা করো!' : 'Wrong answer, please try again.'));

      // Push string copy of exercise to back of queue
      setQueue(prev => [...prev, { ...currentItem, id: currentItem.id + "_retry" }]);
      play('incorrect');
    }
  };

  const handleContinue = () => {
    if (sessionState === 'checking_wrong' && hearts <= 0) {
      // Out of hearts
      play('incorrect');
      navigate('/py');
      return;
    }

    if (currentIndex < queue.length - 1) {
      setCurrentIndex(c => c + 1);
      setSessionState('playing');
      play('tap');
    } else {
      // Finished all items
      setSessionState('done');
      trackEvent('lesson_complete', { lessonId: lesson.id, course: currentCourse });
      setLessonComplete(lesson.id, 100, 5, currentCourse);
      if (level > startLevel) {
        setShowLevelUp(true);
        play('levelUp');
      } else {
        play('lessonComplete');
      }
    }
  };

  const pct = Math.round((currentIndex / totalItems) * 100);

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-app-bg relative overflow-hidden">
      <AnimatePresence>
        {showLevelUp && <LevelUpModal level={level} onClose={() => { setShowLevelUp(false); navigate('/py'); }} />}
      </AnimatePresence>

      {/* Progress Header */}
      <div className="flex items-center gap-4 px-4 py-6 shrink-0 z-40">
        <button
          type="button"
          onClick={() => navigate('/py')}
          aria-label="Exit session"
          className="p-2 text-gray-400 hover:text-gray-200 transition"
        >
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
                    <div className="relative shrink-0 flex items-end">
                      <img 
                        src={sessionState === 'checking_wrong' ? NINI_MASCOT.wrong : NINI_MASCOT.right}
                        alt="Mascot Nini"
                        className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-md"
                      />
                    </div>
                    <div className="border-[3px] border-border-subtle rounded-3xl p-5 bg-panel flex-1 shadow-sm relative">
                      {/* Chat bubble tail */}
                      <div className="absolute -left-2.5 bottom-6 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-[10px] border-r-panel" />
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
              className="text-center py-16 flex flex-col items-center gap-6"
            >
              <div className="w-36 h-36">
                <div className="w-full h-full flex items-center justify-center animate-bounce text-duo-gold">
                   <Trophy size={96} strokeWidth={2} />
                </div>
              </div>
              <h2 className="text-3xl font-black text-duo-gold text-shadow-sm">{language === 'bn' ? 'পাঠ সম্পন্ন!' : 'Lesson Complete!'}</h2>
              <div className="flex gap-4 mt-2 w-full justify-center">
                <div className="w-32 py-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex flex-col items-center">
                  <span className="text-amber-500 font-black text-xs uppercase tracking-wider">{language === 'bn' ? 'টোটাল এক্সপি' : 'TOTAL XP'}</span>
                  <span className="text-amber-400 font-black text-2xl mt-1">+{lesson.xpReward}</span>
                </div>
                <div className="w-32 py-4 rounded-2xl bg-duo-blue/10 border-2 border-duo-blue/30 flex flex-col items-center">
                  <span className="text-duo-blue font-black text-xs uppercase tracking-wider">{language === 'bn' ? 'ফোকাস' : 'Focus'}</span>
                  <span className="text-duo-blue font-black text-2xl mt-1 text-center">100%</span>
                </div>
              </div>

              <button
                onClick={() => { play('tap'); navigate('/py'); }}
                className="btn-duo btn-duo-green px-10 py-4 text-xl font-black mt-4 shadow-xl flex items-center gap-3 active:scale-95 transition-all"
              >
                <span>{language === 'bn' ? 'চালিয়ে যাও' : 'CONTINUE'}</span>
                <ArrowRight size={22} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Drawer Area */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <AnimatePresence>
          {((sessionState === 'playing' && currentItem?.type === 'theory') || (sessionState === 'done' && !showLevelUp)) && (
            <motion.div
              key="footer-action"
               initial={{ y: 200 }} animate={{ y: 0 }} exit={{ y: 200 }}
               className="bg-app-bg border-t-2 border-border-subtle p-4 md:p-6 flex justify-center shadow-2xl"
            >
              <div className="max-w-3xl w-full flex justify-end">
                <button 
                  onClick={sessionState === 'done' ? () => { play('tap'); navigate('/py'); } : handleContinue} 
                  className="btn-duo btn-duo-green w-full md:w-52 py-4 text-xl font-black flex items-center justify-center gap-2"
                >
                  <span>{language === 'bn' ? 'চালিয়ে যাও' : 'Continue'}</span>
                  <ArrowRight size={20} />
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
