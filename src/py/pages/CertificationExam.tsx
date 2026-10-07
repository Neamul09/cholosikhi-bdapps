import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Clock, RotateCcw, 
  Award, CheckCircle2, Lock
} from 'lucide-react';
import { clsx } from 'clsx';
import { NINI_MASCOT } from '@/lib/mascot';
import { certificationExamQuestions, type ExamQuestion } from '@/content/python/examQuestions';
import { useSettingsStore } from '@/store/settingsStore';
import { useUserStore } from '@/store/userStore';
import { useProgressStore } from '@/store/progressStore';
import { 
  TOTAL_PYTHON_LESSONS, 
  getCompletedLessonsCount, 
  areAllPythonLessonsCompleted 
} from '@/content/python/lessons';
import { play } from '@/lib/audio';
import { trackEvent } from '@/lib/analytics';

export default function CertificationExam() {
  const navigate = useNavigate();
  const { language } = useSettingsStore();
  const isBn = language === 'bn';
  const { name: userName } = useUserStore();
  const { lessonProgress } = useProgressStore();

  const completedLessons = getCompletedLessonsCount(lessonProgress);
  const allLessonsDone = areAllPythonLessonsCompleted(lessonProgress);
  const lessonsProgressPct = Math.round((completedLessons / TOTAL_PYTHON_LESSONS) * 100);

  const [examState, setExamState] = useState<'intro' | 'active' | 'result'>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [timerActive, setTimerActive] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartExam = () => {
    trackEvent('exam_start');
    play('tap');
    setSelectedAnswers({});
    setCurrentIndex(0);
    setTimeLeft(25 * 60);
    setExamState('active');
    setTimerActive(true);
  };

  const handleSelectOption = (optionIndex: number) => {
    play('tap');
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex
    }));
  };

  // Score calculation
  const { score, percentage, passed, isGolden } = useMemo(() => {
    let correctCount = 0;
    certificationExamQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });
    const pct = Math.round((correctCount / certificationExamQuestions.length) * 100);
    return {
      score: correctCount,
      percentage: pct,
      passed: correctCount >= 16, // 80% passing mark
      isGolden: correctCount >= 18 // 90% golden mark
    };
  }, [selectedAnswers]);

  const handleSubmitExam = () => {
    trackEvent('exam_complete', { score, percentage, passed, isGolden });
    setTimerActive(false);
    setExamState('result');

    if (score >= 16) {
      play('achievement');
      const certId = 'CS-PY-' + Math.random().toString(36).substring(2, 7).toUpperCase() + '-' + new Date().getFullYear();
      const certData = {
        certId,
        recipientName: userName || (isBn ? 'চলোশিখি শিক্ষার্থী' : 'CholoSikhi Learner'),
        courseName: 'Python Programming Fundamentals',
        courseNameBn: 'পাইথন প্রোগ্রামিং ফাউন্ডেশন',
        score,
        total: certificationExamQuestions.length,
        percentage,
        passed: true,
        isGolden,
        issueDate: new Date().toLocaleDateString(isBn ? 'bn-BD' : 'en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        timestamp: Date.now()
      };
      localStorage.setItem('cholosikhi_certificate', JSON.stringify(certData));
    } else {
      play('incorrect');
      // Save last attempt for the locked certificate dashboard
      const attemptData = {
        score,
        total: certificationExamQuestions.length,
        percentage,
        timestamp: Date.now()
      };
      localStorage.setItem('cholosikhi_exam_last_attempt', JSON.stringify(attemptData));
    }
  };

  const currentQ: ExamQuestion = certificationExamQuestions[currentIndex];
  const answeredCount = Object.keys(selectedAnswers).length;
  const totalQuestions = certificationExamQuestions.length;
  const progressPct = ((currentIndex + 1) / totalQuestions) * 100;

  if (!allLessonsDone) {
    return (
      <div className="min-h-screen bg-app-bg text-app-fg py-12 px-4 flex flex-col items-center justify-center font-sans selection:bg-duo-green/30">
        <div className="max-w-md w-full bg-panel border-2 border-border-subtle rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Lock size={14} />
            {isBn ? 'পরীক্ষা লক করা রয়েছে' : 'Exam Locked'}
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 relative flex items-center justify-center">
              <img 
                src={NINI_MASCOT.wrong} 
                alt="Mascot Nini" 
                className="w-full h-full object-contain drop-shadow-md" 
              />
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-duo-red flex items-center justify-center text-white border-2 border-app-bg shadow-md">
                <Lock size={14} strokeWidth={3} />
              </div>
            </div>

            <div className="bg-app-bg border-2 border-border-subtle rounded-2xl p-4 text-left relative w-full">
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-app-bg border-t-2 border-l-2 border-border-subtle transform rotate-45" />
              <p className="text-sm font-bold text-app-fg leading-relaxed">
                {isBn
                  ? `হেই! সার্টিফিকেশন পরীক্ষায় বসার আগে তোমাকে পাইথনের সবকটি (৩২টি) পাঠ শেষ করতে হবে। তুমি ইতিমধ্যে ${completedLessons}টি পাঠ শেষ করেছ! চলো বাকিগুলো শেষ করে ফেলি!`
                  : `Hey! You need to complete all 32 Python lessons before you can attempt the Certification Exam. You have completed ${completedLessons}/${TOTAL_PYTHON_LESSONS} lessons so far!`}
              </p>
            </div>
          </div>

          <div className="bg-app-bg border border-border-subtle rounded-2xl p-4 space-y-2 text-left">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-app-fg-muted">{isBn ? 'কারিকুলাম অগ্রগতি' : 'Curriculum Progress'}</span>
              <span className="text-app-fg font-black">
                {completedLessons} / {TOTAL_PYTHON_LESSONS} ({lessonsProgressPct}%)
              </span>
            </div>
            <div className="w-full bg-border-subtle/50 h-3 rounded-full overflow-hidden">
              <div
                className="bg-duo-green h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${lessonsProgressPct}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => navigate('/py')}
            className="btn-duo btn-duo-green w-full py-4 text-base font-black flex items-center justify-center gap-2"
          >
            <Award size={20} />
            {isBn ? 'কারিকুলামে ফিরে যান' : 'Back to Lessons'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-bg text-app-fg flex flex-col font-sans selection:bg-duo-green/30">
      
      {/* ─── State 1: Intro / Instructions Screen ─── */}
      {examState === 'intro' && (
        <div className="flex-1 flex items-center justify-center p-4 md:p-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl w-full border-[3px] border-border-subtle rounded-3xl p-6 md:p-8 bg-panel shadow-sm space-y-6"
          >
            {/* Mascot Nini Header */}
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 flex items-center justify-center">
                <img 
                  src={NINI_MASCOT.right} 
                  alt="Mascot Nini" 
                  className="w-full h-full object-contain drop-shadow-md animate-bounce-subtle" 
                />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-duo-blue">
                  {isBn ? 'ফাইনাল অ্যাসেসমেন্ট' : 'Final Assessment'}
                </span>
                <h1 className="text-2xl font-black text-app-fg">
                  {isBn ? 'পাইথন সার্টিফিকেশন পরীক্ষা' : 'Python Certification Exam'}
                </h1>
              </div>
            </div>

            {/* Instruction Speech Box */}
            <div className="border-2 border-border-subtle rounded-2xl p-4 bg-app-bg text-sm font-medium text-app-fg/90 leading-relaxed">
              <p className="font-bold text-duo-green mb-1">
                {isBn ? 'নিনি বলছে:' : 'Nini says:'}
              </p>
              <p>
                {isBn
                  ? 'তুমি ইউনিট ১ থেকে ১০ পর্যন্ত সম্পূর্ণ কারিকুলাম সফলভাবে শেষ করেছ! এবার তোমার দক্ষতা প্রমাণের পালা। এই পরীক্ষায় ২০টি প্রশ্ন থাকবে। কমপক্ষে ৮০% (১৬/২০) পেলে তুমি তোমার ভেরিফায়েড ডিজিটাল সার্টিফিকেট আনলক করতে পারবে।'
                  : 'You have conquered Units 1 through 10! Now is the time to prove your mastery. There are 20 questions. Score 80%+ (16/20) to unlock your official verified certificate.'}
              </p>
            </div>

            {/* Exam Parameters Grid */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="border-2 border-border-subtle rounded-2xl p-3 bg-app-bg">
                <span className="text-xs text-app-fg-muted font-bold block">{isBn ? 'প্রশ্ন' : 'Questions'}</span>
                <span className="text-xl font-black text-app-fg">২০ টি</span>
              </div>
              <div className="border-2 border-border-subtle rounded-2xl p-3 bg-app-bg">
                <span className="text-xs text-app-fg-muted font-bold block">{isBn ? 'সময়' : 'Time'}</span>
                <span className="text-xl font-black text-app-fg">২৫ মিনিট</span>
              </div>
              <div className="border-2 border-border-subtle rounded-2xl p-3 bg-app-bg">
                <span className="text-xs text-app-fg-muted font-bold block">{isBn ? 'পাস মার্ক' : 'Pass Mark'}</span>
                <span className="text-xl font-black text-duo-green">৮০%</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => navigate('/py/certificate')}
                className="btn-duo btn-duo-secondary flex-1 py-3.5 text-base"
              >
                {isBn ? 'পরে দেব' : 'Later'}
              </button>
              <button
                onClick={handleStartExam}
                className="btn-duo btn-duo-green flex-1 py-3.5 text-base"
              >
                {isBn ? 'পরীক্ষা শুরু করো' : 'Start Exam'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ─── State 2: Active Exam Screen (Matching SessionView) ─── */}
      {examState === 'active' && currentQ && (
        <div className="flex-1 flex flex-col justify-between">
          
          {/* Top Bar (Identical to Session.tsx) */}
          <header className="h-16 px-4 max-w-4xl mx-auto w-full flex items-center gap-4">
            <button
              onClick={() => {
                if (window.confirm(isBn ? 'তুমি কি সত্যিই পরীক্ষা থেকে বের হতে চাও?' : 'Are you sure you want to exit the exam?')) {
                  navigate('/py/certificate');
                }
              }}
              aria-label="Exit exam"
              className="p-2 text-gray-400 hover:text-gray-200 transition"
            >
              <X size={24} strokeWidth={3} />
            </button>

            {/* Progress Bar */}
            <div className="flex-1">
              <div className="h-4 bg-[#e5e5e5] dark:bg-[#202f36] rounded-full overflow-hidden w-full relative">
                <motion.div 
                  className="h-full bg-duo-green absolute left-0 top-0 rounded-full border-r border-[#69e000]" 
                  animate={{ width: `${progressPct}%` }} 
                  transition={{ duration: 0.4, type: 'spring' }} 
                >
                  <div className="absolute top-1 left-3 right-3 h-1 bg-white/30 rounded-full" />
                </motion.div>
              </div>
            </div>

            {/* Timer Badge */}
            <div className={clsx(
              "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-black border",
              timeLeft < 300 
                ? "bg-duo-red/10 text-duo-red border-duo-red/30 animate-pulse" 
                : "bg-panel text-duo-green border-border-subtle"
            )}>
              <Clock size={16} />
              <span>{formatTime(timeLeft)}</span>
            </div>
          </header>

          {/* Main Question Area */}
          <main className="flex-1 overflow-y-auto px-4 py-4 pb-32 max-w-2xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQ.id}
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -40, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="space-y-6"
              >
                {/* Speech Bubble Header */}
                <div className="flex gap-4 items-end">
                  <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 relative flex items-end">
                    <img 
                      src={NINI_MASCOT.right} 
                      alt="Mascot Nini" 
                      className="w-full h-full object-contain drop-shadow-md" 
                    />
                  </div>
                  <div className="border-[3px] border-border-subtle rounded-3xl p-5 bg-panel flex-1 shadow-sm relative">
                    {/* Chat Bubble Tail */}
                    <div className="absolute -left-2.5 bottom-5 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-[10px] border-r-panel" />
                    <div className="flex items-center justify-between text-xs font-black uppercase text-duo-blue mb-1">
                      <span>{isBn ? `প্রশ্ন ${currentIndex + 1} / ২০` : `Question ${currentIndex + 1} of 20`}</span>
                      <span>{isBn ? currentQ.unitTitle.bn : currentQ.unitTitle.en}</span>
                    </div>
                    <h2 className="text-lg md:text-xl font-black text-app-fg leading-relaxed">
                      {isBn ? currentQ.question.bn : currentQ.question.en}
                    </h2>
                  </div>
                </div>

                {/* Code Block if any */}
                {currentQ.code && (
                  <div className="code-block border-2 border-border-subtle rounded-2xl p-4 bg-[#0a1122] overflow-x-auto">
                    <pre className="text-base text-[#00d4ff] font-mono leading-relaxed">{currentQ.code}</pre>
                  </div>
                )}

                {/* Options (Matching MCQExercise in components/exercises/index.tsx) */}
                <div className="grid grid-cols-1 gap-3 pt-2">
                  {currentQ.options.map((option, optIdx) => {
                    const isSelected = selectedAnswers[currentIndex] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        className={clsx(
                          'w-full text-left px-5 py-4 font-bold flex items-center justify-between transition-all rounded-2xl border-2 active:translate-y-[2px]',
                          isSelected 
                            ? 'bg-blue-500/10 border-blue-500 ring-2 ring-blue-400/40 text-app-fg' 
                            : 'bg-panel border-border-subtle hover:border-blue-400 hover:bg-blue-500/5 text-app-fg'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className={clsx(
                            'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black border-2 shrink-0 transition-colors',
                            isSelected 
                              ? 'border-blue-500 bg-blue-500 text-white' 
                              : 'border-border-subtle text-app-fg-muted'
                          )}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="text-base md:text-lg">{option}</span>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center">
                            <CheckCircle2 size={16} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Bottom Fixed Footer Bar */}
          <footer className="bg-panel border-t-2 border-border-subtle p-4 px-6 fixed bottom-0 left-0 right-0 z-40">
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
              <button
                onClick={() => {
                  play('tap');
                  setCurrentIndex((prev) => Math.max(0, prev - 1));
                }}
                disabled={currentIndex === 0}
                className="btn-duo btn-duo-secondary py-3 px-5 text-sm"
              >
                {isBn ? 'আগের প্রশ্ন' : 'Previous'}
              </button>

              {/* Progress Count */}
              <span className="text-xs font-bold text-app-fg-muted">
                {isBn ? `উত্তর সম্পন্ন: ${answeredCount}/${totalQuestions}` : `Answered: ${answeredCount}/${totalQuestions}`}
              </span>

              {currentIndex < totalQuestions - 1 ? (
                <button
                  onClick={() => {
                    play('tap');
                    setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1));
                  }}
                  className="btn-duo btn-duo-green py-3 px-7 text-sm"
                >
                  {isBn ? 'পরের প্রশ্ন' : 'Next'}
                </button>
              ) : (
                <button
                  onClick={handleSubmitExam}
                  className="btn-duo btn-duo-green py-3 px-8 text-sm"
                >
                  {isBn ? 'পরীক্ষা জমা দিন' : 'Submit Exam'}
                </button>
              )}
            </div>
          </footer>
        </div>
      )}

      {/* ─── State 3: Result Screen (Matching SessionView Done State) ─── */}
      {examState === 'result' && (
        <div className="flex-1 flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-lg w-full border-[3px] border-border-subtle rounded-3xl p-6 md:p-10 bg-panel text-center shadow-lg space-y-6"
          >
            {passed ? (
              <>
                <div className="w-28 h-28 mx-auto flex items-center justify-center animate-bounce-subtle">
                  <img 
                    src={NINI_MASCOT.right} 
                    alt="Mascot Nini" 
                    className="w-full h-full object-contain drop-shadow-2xl" 
                  />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-duo-green">
                    {isGolden ? (isBn ? 'গোল্ডেন ডিস্টিংকশন' : 'Golden Distinction (90%+)') : (isBn ? 'সফলভাবে উত্তীর্ণ' : 'Exam Passed')}
                  </span>
                  <h1 className="text-3xl font-black text-app-fg">
                    {isBn ? 'সাবাশ! তুমি পাস করেছ!' : 'Congratulations! You Passed!'}
                  </h1>
                  <p className="text-sm text-app-fg-muted">
                    {isBn
                      ? `নিনি বলছে: অসাধারণ! তুমি ২০টির মধ্যে ${score}টি প্রশ্নের সঠিক উত্তর পেয়েছ (${percentage}%)। তোমার অফিসিয়াল সার্টিফিকেট আনলক হয়ে গেছে!`
                      : `Mascot Nini cheers: Brilliant! You scored ${score}/20 (${percentage}%). Your official certificate is now unlocked!`}
                  </p>
                </div>

                {/* Score Stats */}
                <div className="flex gap-4 justify-center py-2">
                  <div className="w-32 py-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex flex-col items-center">
                    <span className="text-amber-500 font-black text-xs uppercase">{isBn ? 'স্কোর' : 'Score'}</span>
                    <span className="text-amber-400 font-bold text-2xl mt-1">{score}/20</span>
                  </div>
                  <div className="w-32 py-4 rounded-2xl bg-duo-blue/10 border-2 border-duo-blue/30 flex flex-col items-center">
                    <span className="text-duo-blue font-black text-xs uppercase">{isBn ? 'ফলাফল' : 'Result'}</span>
                    <span className="text-duo-blue font-bold text-2xl mt-1">{percentage}%</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/py/certificate')}
                  className="btn-duo btn-duo-green w-full py-4 text-lg flex items-center justify-center gap-2"
                >
                  <Award size={20} />
                  {isBn ? 'তোমার সার্টিফিকেট দেখো' : 'View Your Certificate'}
                </button>
              </>
            ) : (
              <>
                <div className="w-24 h-24 mx-auto flex items-center justify-center">
                  <img 
                    src={NINI_MASCOT.wrong} 
                    alt="Mascot Nini" 
                    className="w-full h-full object-contain drop-shadow-xl" 
                  />
                </div>

                <div className="space-y-2">
                  <h1 className="text-2xl font-black text-app-fg">
                    {isBn ? 'আরেকটু প্রস্তুতি প্রয়োজন' : 'Keep Trying!'}
                  </h1>
                  <p className="text-sm text-app-fg-muted">
                    {isBn
                      ? `তুমি ২০টির মধ্যে ${score}টি প্রশ্নের সঠিক উত্তর দিয়েছ (${percentage}%)। সার্টিফিকেট আনলক করতে কমপক্ষে ৮০% (১৬/২০) নম্বর প্রয়োজন।`
                      : `You scored ${score}/20 (${percentage}%). To unlock your certificate, a minimum score of 80% (16/20) is required.`}
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => navigate('/py')}
                    className="btn-duo btn-duo-secondary flex-1 py-3.5 text-sm"
                  >
                    {isBn ? 'লেসনে ফিরে যাও' : 'Back to Lessons'}
                  </button>
                  <button
                    onClick={handleStartExam}
                    className="btn-duo btn-duo-green flex-1 py-3.5 text-sm flex items-center justify-center gap-2"
                  >
                    <RotateCcw size={16} />
                    {isBn ? 'আবার চেষ্টা করো' : 'Retake Exam'}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}

    </div>
  );
}
