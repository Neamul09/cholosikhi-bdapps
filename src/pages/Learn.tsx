
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Play } from 'lucide-react';
import { clsx } from 'clsx';
import { cppLessons } from '@/content/cpp/lessons';
import { cppSections } from '@/content/cpp/metadata';
import { useProgressStore } from '@/store/progressStore';
import { useSettingsStore } from '@/store/settingsStore';

export default function LearnSection() {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  const { isLessonCompleted } = useProgressStore();
  const { language } = useSettingsStore();

  const section = cppSections.find((s) => s.id === sectionId);
  const lessons = cppLessons.filter((l) => l.sectionId === sectionId).sort((a, b) => a.order - b.order);

  if (!section) return <div className="p-8 text-center">Section not found</div>;

  const translate = (ls: import('@/content/schema').LocalizedString | undefined | null): string => {
    if (!ls) return '';
    if (typeof ls === 'string') return ls;
    return language === 'bn' ? ls.bn : ls.en;
  };

  const completedCount = lessons.filter(l => isLessonCompleted(l.id)).length;
  const progress = Math.round((completedCount / lessons.length) * 100);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/')} className="p-2 glass rounded-xl hover-lift">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{translate(section.title)}</h1>
          <p className="text-sm text-gray-400">{translate(section.description)}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="glass p-4 rounded-2xl flex items-center gap-4">
        <div className="flex-1">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">{language === 'bn' ? 'সেকশনের অগ্রগতি' : 'Section Progress'}</span>
            <span className="font-bold gradient-text">{progress}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full gradient-brand rounded-full"
              initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1 }}
            />
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center font-bold text-lg">
          {completedCount}/{lessons.length}
        </div>
      </div>

      {/* Lesson List */}
      <div className="space-y-4 relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-8 bottom-8 w-1 bg-white/5 rounded-full z-0" />

        {lessons.map((lesson, idx) => {
          const isCompleted = isLessonCompleted(lesson.id);
          const isLocked = idx > 0 && !isLessonCompleted(lessons[idx - 1].id);

          return (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
              className={clsx(
                'relative z-10 glass rounded-2xl p-5 flex items-center gap-5 transition-all',
                isLocked ? 'opacity-50 grayscale cursor-not-allowed' : 'hover-lift cursor-pointer hover:border-brand-500/30'
              )}
              onClick={() => !isLocked && navigate(`/lesson/${lesson.id}`)}
            >
              {/* Status Icon */}
              <div className={clsx(
                'w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 border-[#0d1117] relative z-10 text-white',
                isCompleted ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]' :
                isLocked ? 'bg-gray-700' : 'gradient-brand shadow-[0_0_20px_rgba(168,85,247,0.4)]'
              )}>
                {isCompleted ? <CheckCircle size={20} /> : isLocked ? <div className="w-2 h-2 bg-white/50 rounded-full" /> : <Play size={20} className="ml-1" />}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="text-xs text-brand-400 font-bold mb-1 uppercase tracking-wider">
                  {language === 'bn' ? `পাঠ ${idx + 1}` : `Lesson ${idx + 1}`}
                </div>
                <h3 className="font-bold text-lg mb-1">{translate(lesson.title)}</h3>
                <p className="text-sm text-gray-400 line-clamp-1">{translate(lesson.description)}</p>
              </div>

              {/* Tags */}
              <div className="flex flex-col items-end gap-2">
                <span className="text-xs font-mono bg-white/10 px-2 py-1 rounded-md text-amber-400">
                  +{lesson.xpReward} XP
                </span>
                <span className="text-xs text-gray-500">{lesson.estimatedMinutes}m</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
