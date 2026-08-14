import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Trophy } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import { allPythonLessons as pythonLessons } from '@/content/python/lessons';
import { cppLessons } from '@/content/cpp/lessons';
import type { Exercise } from '@/content/schema';
import { useProgressStore } from '@/store/progressStore';
import { useUserStore } from '@/store/userStore';
import { XPToast, CorrectOverlay, WrongOverlay } from '@/components/modals';
import { MCQExercise, FillBlankExercise, OutputPredictExercise, BugHuntExercise, CodeArrangeExercise } from '@/components/exercises';
import { fireSuccessConfetti } from '@/utils/confetti';
import { play } from '@/lib/audio';

export default function PracticeView() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { setLessonComplete } = useProgressStore();
  const { addXp, hearts, loseHeart } = useUserStore();
  const { language, currentCourse } = useSettingsStore();

  const allLessons = currentCourse === 'python' ? pythonLessons : cppLessons;
  const lesson = allLessons.find((l) => l.id === lessonId);
  
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<'playing' | 'correct' | 'wrong' | 'done'>('playing');
  const [xpEarned, setXpEarned] = useState(0);
  const [showXpToast, setShowXpToast] = useState(false);
  const [wrongExplanation, setWrongExplanation] = useState('');
  const [correctExplanation, setCorrectExplanation] = useState('');

  // Hooks must run unconditionally on every render — early returns come below.
  useEffect(() => {
    if (lesson && lesson.exercises.length === 0) {
      setLessonComplete(lesson.id, 100, 5, currentCourse);
      navigate(`/`);
    }
  }, [lesson, lesson?.exercises.length, setLessonComplete, navigate, currentCourse]);

  if (!lesson) return <div className="p-8 text-center text-app-fg font-bold">{language === 'bn' ? 'পাঠটি খুঁজে পাওয়া যায়নি' : 'Lesson not found'}</div>;
  if (lesson.exercises.length === 0) return null;

  const ex = lesson.exercises[step];

  const handleAnswer = (correct: boolean) => {
    const hasExplanation = (e: Exercise): e is Exercise & { explanation: Exercise extends { explanation: infer T } ? T : never } =>
      'explanation' in e;
    const expl = hasExplanation(ex) ? ex.explanation : undefined;
    const explText = expl ? (typeof expl === 'string' ? expl : expl[language]) : '';

    if (correct) {
      setStatus('correct');
      addXp(ex.xpReward);
      setXpEarned(ex.xpReward);
      setShowXpToast(true);
      setTimeout(() => setShowXpToast(false), 2000);
      setCorrectExplanation(explText);
      play('correct');
    } else {
      setStatus('wrong');
      loseHeart();
      setWrongExplanation(explText || (language === 'bn' ? 'ভুল উত্তর।' : 'Incorrect answer.'));
      play('incorrect');
    }
  };

  const handleContinue = () => {
    if (status === 'wrong' && hearts <= 0) {
      play('incorrect');
      navigate(`/`);
      return;
    }

    if (step < lesson.exercises.length - 1) {
      setStep(s => s + 1);
      setStatus('playing');
      play('tap');
    } else {
      setStatus('done');
      fireSuccessConfetti();
      setLessonComplete(lesson.id, 100, 5, currentCourse);
      play('lessonComplete');
    }
  };

  const pct = Math.round((step / lesson.exercises.length) * 100);

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-app-bg relative overflow-hidden">
      <XPToast amount={xpEarned} visible={showXpToast} />

      {/* Header cross-bar */}
      <div className="flex items-center gap-4 px-4 py-6 bg-app-bg shrink-0 z-40">
        <button
          type="button"
          onClick={() => navigate(`/`)}
          aria-label="Go back"
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
        <motion.div 
          key={hearts} 
          initial={{ scale: 1.2 }} 
          animate={{ scale: 1 }} 
          className="flex items-center gap-2 font-black text-duo-red text-xl"
        >
          <Heart size={24} className="fill-duo-red" strokeWidth={0} /> {hearts}
        </motion.div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-8 pb-40">
        <AnimatePresence mode="wait">
          {status !== 'done' && ex && (
            <motion.div
              key={step}
              initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold mb-8">
                {typeof ex.question === 'string' ? ex.question : ex.question[language]}
              </h2>

              {ex.type === 'mcq' && <MCQExercise exercise={ex} onAnswer={handleAnswer} />}
              {ex.type === 'fill_blank' && <FillBlankExercise exercise={ex} onAnswer={handleAnswer} />}
              {ex.type === 'output_predict' && <OutputPredictExercise exercise={ex} onAnswer={handleAnswer} />}
              {ex.type === 'bug_hunt' && <BugHuntExercise exercise={ex} onAnswer={handleAnswer} />}
              {ex.type === 'code_arrange' && <CodeArrangeExercise exercise={ex} onAnswer={handleAnswer} />}
            </motion.div>
          )}

          {status === 'done' && (
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
              <h2 className="text-3xl font-black text-duo-gold text-shadow-sm">{language === 'bn' ? 'পাঠ সম্পন্ন হয়েছে!' : 'Lesson Complete!'}</h2>
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

      {/* Overlays / Footer */}
      <AnimatePresence>
        {status === 'correct' && <CorrectOverlay explanation={correctExplanation} onContinue={handleContinue} />}
        {status === 'wrong' && <WrongOverlay explanation={wrongExplanation} onContinue={handleContinue} />}
      </AnimatePresence>

      {status === 'done' && (
        <div className="fixed bottom-0 left-0 right-0 p-4 md:p-8 border-t-2 border-border-subtle bg-app-bg flex justify-center z-40">
          <div className="max-w-3xl w-full">
            <button
              onClick={() => navigate(`/`)}
              className="btn-duo btn-duo-green w-full py-4 text-xl"
            >
              {language === 'bn' ? 'এগিয়ে যান' : 'CONTINUE'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

