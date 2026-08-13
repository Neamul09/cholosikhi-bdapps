import { useEffect } from 'react';
import type React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Check, Star, Lock, Trophy, MessageSquare, Calculator, Brain, 
  GitBranch, Binary, Repeat, RotateCcw, List, Zap, Code,
  Target, BookOpen, Gem
} from 'lucide-react';
import { clsx } from 'clsx';
import { useUserStore } from '@/store/userStore';
import { useProgressStore } from '@/store/progressStore';
import { useSettingsStore } from '@/store/settingsStore';
import { pythonSections } from '@/content/python/metadata';
import { cppSections } from '@/content/cpp/metadata';
import { useQuestStore } from '@/store/questStore';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>> = {
  MessageSquare, Calculator, Brain, GitBranch, Binary, Repeat, RotateCcw, List, Zap, Trophy, Star,
};

export default function Home() {
  const { checkAndUpdateStreak } = useUserStore();
  const { isLessonCompleted } = useProgressStore();
  const { language, currentCourse } = useSettingsStore();
  const { quests, claimReward } = useQuestStore();
  const navigate = useNavigate();

  useEffect(() => { checkAndUpdateStreak(); }, [checkAndUpdateStreak]);

  const sections = currentCourse === 'python' ? pythonSections : cppSections;

  return (
    <div className="relative min-h-screen bg-app-bg">
      {/* Background Blue Nebula */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-cyan-400/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16 pb-40 space-y-20 relative z-10">
        
        {/* Daily Quests Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
             <h2 className="text-xl font-black flex items-center gap-2">
               <Target className="text-blue-400" size={24} />
               {language === 'bn' ? 'আজকের মিশন' : "Today's quests"}
             </h2>
             <span className="text-xs font-bold text-app-fg/40 uppercase tracking-widest">
               {language === 'bn' ? '২৪ ঘণ্টা পর নতুন আসবে' : 'New quests in 24h'}
             </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quests.map((quest) => {
              const progressPct = (quest.progress / quest.goal) * 100;
              const QuestIcon = quest.type === 'xp' ? Zap : quest.type === 'lessons' ? BookOpen : Trophy;

              return (
                <motion.div 
                  key={quest.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={clsx(
                    "bg-panel border-2 rounded-[2rem] p-5 flex flex-col gap-4 relative overflow-hidden",
                    quest.completed ? "border-blue-500/30 bg-blue-500/5" : "border-border-subtle"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={clsx(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      quest.completed ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "bg-app-bg text-app-fg/60 border-2 border-border-subtle"
                    )}>
                      <QuestIcon size={20} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                       <div className="text-sm font-black leading-tight">{quest.name[language]}</div>
                       <div className="text-[10px] font-bold text-app-fg/40">{quest.progress} / {quest.goal}</div>
                    </div>
                    {quest.claimed ? (
                      <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center border border-green-500/30">
                        <Check size={16} strokeWidth={4} />
                      </div>
                    ) : quest.completed ? (
                      <button 
                        onClick={() => claimReward(quest.id)}
                        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-black rounded-lg shadow-lg shadow-blue-500/30 transition-all active:scale-90"
                      >
                        {language === 'bn' ? 'নিন' : 'Claim'}
                      </button>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <div className="h-1.5 bg-app-bg border border-border-subtle rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${progressPct}%` }}
                         className={clsx("h-full transition-all duration-500", quest.completed ? "bg-blue-500" : "bg-blue-400")}
                       />
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 font-black text-[10px] uppercase tracking-wider">
                      <Gem size={10} className="fill-amber-500" />
                      +{quest.reward} {language === 'bn' ? 'রত্ন' : 'gems'}
                      {quest.claimed && <span className="ml-1 text-green-500 opacity-80">({language === 'bn' ? 'নেওয়া হয়েছে' : 'Claimed'})</span>}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
        {sections.map((section, sIdx) => {
          const colors = [
            'bg-gradient-to-br from-cyan-400 to-blue-500',
            'bg-gradient-to-br from-blue-500 to-indigo-600',
            'bg-gradient-to-br from-indigo-500 to-violet-600',
            'bg-gradient-to-br from-violet-500 to-purple-600',
            'bg-gradient-to-br from-blue-600 to-cyan-500',
            'bg-gradient-to-br from-sky-400 to-blue-600',
          ];
          const shadowColors = [
            'border-cyan-600',
            'border-blue-700',
            'border-indigo-700',
            'border-violet-700',
            'border-blue-800',
            'border-sky-600',
          ];
          const accentColor = colors[sIdx % colors.length];
          const shadowColor = shadowColors[sIdx % shadowColors.length];
          
          const prevUnitLastId = sIdx > 0 ? sections[sIdx-1].lessonIds[sections[sIdx-1].lessonIds.length - 1] : null;
          const isLocked = sIdx > 0 && isLessonCompleted(prevUnitLastId!) === false;
          
          const completedCount = section.lessonIds.filter(id => isLessonCompleted(id)).length;
          const progressPct = (completedCount / section.lessonIds.length) * 100;

          return (
            <section key={section.id} className={clsx("space-y-12", isLocked && "opacity-50 grayscale")}>
              {/* Unit Header Card */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={clsx(
                  "w-full rounded-[2.5rem] p-8 text-white font-black border-2 border-b-[8px] relative overflow-hidden flex flex-col md:flex-row items-center gap-8 shadow-xl",
                  accentColor, shadowColor
                )}
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
                
                <div className="w-20 h-20 bg-white/20 rounded-[2rem] flex items-center justify-center border-2 border-white/30 shrink-0 shadow-inner">
                  {(() => {
                    const Icon = iconMap[section.icon as string] || Code;
                    return <Icon size={40} strokeWidth={3} className="text-white drop-shadow-lg" />;
                  })()}
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="text-[10px] uppercase tracking-[0.4em] mb-2 opacity-80 font-black">
                    {language === 'bn' ? 'ইউনিট ' : 'Unit '} {sIdx + 1}
                  </div>
                  <h2 className="text-2xl md:text-3xl leading-tight drop-shadow-md mb-2">
                    {typeof section.title === 'string' ? section.title : section.title[language]}
                  </h2>
                  <p className="text-white/80 font-bold text-sm max-w-xl">
                    {typeof section.description === 'string' ? section.description : section.description[language]}
                  </p>
                </div>

                <div className="shrink-0 flex flex-col items-center md:items-end gap-2">
                   <div className="text-3xl font-black">{Math.round(progressPct)}%</div>
                   <div className="w-32 h-3 bg-black/20 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPct}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-cyan-300 to-white/80" 
                      />
                   </div>
                </div>
              </motion.div>

              {/* Horizontal Lesson Track */}
              <div className="relative group overflow-visible">
                <div className="horizontal-path flex items-center gap-12 overflow-x-auto px-8 hide-scrollbar snap-x">
                  {section.lessonIds.map((lessonId, lIdx) => {
                    const completed = isLessonCompleted(lessonId);
                    const isExamNode = lessonId.includes('exam');
                    
                    const prevInUnitId = lIdx > 0 ? section.lessonIds[lIdx - 1] : null;
                    const lessonLocked = (lIdx === 0 && isLocked) || (lIdx > 0 && !isLessonCompleted(prevInUnitId!));
                    const active = !completed && !lessonLocked;

                    let StatusIcon = isExamNode ? Trophy : Star;
                    if (completed) StatusIcon = Check;
                    if (lessonLocked) StatusIcon = Lock;

                    return (
                      <div key={lessonId} className="flex flex-col items-center gap-6 shrink-0 snap-center first:pl-4 last:pr-4">
                        <motion.div
                          whileHover={!lessonLocked ? { scale: 1.1, y: -5 } : {}}
                          className="relative"
                        >
                          {/* Connector Line to next node (Horizontal) */}
                          {lIdx < section.lessonIds.length - 1 && (
                            <div className="absolute top-1/2 left-full w-12 h-3 bg-gray-100 dark:bg-white/5 -translate-y-1/2 z-0 rounded-full">
                               <motion.div 
                                  initial={{ width: 0 }}
                                  whileInView={{ width: '100%' }}
                                  className={clsx("h-full transition-all duration-700 rounded-full", completed ? 'bg-gradient-to-r from-cyan-400 to-blue-500' : "bg-transparent")}
                               />
                            </div>
                          )}

                          {active && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10, scale: 0.8 }}
                              animate={{ opacity: 1, y: -65, scale: 1 }}
                              className="absolute left-1/2 -translate-x-1/2 bg-panel text-app-fg font-black px-5 py-2.5 rounded-2xl text-[10px] whitespace-nowrap shadow-2xl z-20 border-2 border-border-subtle"
                            >
                              {isExamNode ? (language === 'bn' ? 'চ্যালেঞ্জ!' : 'Challenge!') : (language === 'bn' ? 'শুরু' : 'Start')}
                              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 border-[8px] border-transparent border-t-panel" />
                            </motion.div>
                          )}

                          <button
                            disabled={lessonLocked}
                            onClick={() => navigate(`/session/${lessonId}`)}
                            className={clsx(
                              'rounded-[2rem] flex items-center justify-center relative transition-all active:scale-90 shadow-xl z-10',
                              isExamNode ? 'w-24 h-24' : 'w-20 h-20',
                              completed && `${accentColor} text-white border-2 border-b-[6px] ${shadowColor}`,
                              active && `${accentColor} text-white border-2 border-b-[6px] ${shadowColor} animate-glow`,
                              lessonLocked && 'bg-app-fg/20 dark:bg-white/5 text-app-fg-muted dark:text-white/10 border-2 border-b-[6px] border-app-fg/30 dark:border-white/10 cursor-not-allowed'
                            )}
                          >
                            <StatusIcon size={isExamNode ? 44 : 28} strokeWidth={4} className={clsx(active && 'animate-bounce-subtle', lessonLocked ? 'opacity-100 text-app-fg/30' : 'opacity-100')} />
                          </button>
                          
                          {completed && !isExamNode && (
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-duo-gold text-white rounded-xl border-2 border-white flex items-center justify-center shadow-lg font-black text-[10px] z-20">
                              100
                            </div>
                          )}
                        </motion.div>

                        <div className="text-center max-w-[120px]">
                           <span className={clsx(
                             "text-[10px] font-black uppercase tracking-[0.2em] block leading-tight",
                             lessonLocked ? "text-app-fg/20" : "text-app-fg/40"
                           )}>
                             {isExamNode ? (language === 'bn' ? 'ইউনিট পরীক্ষা' : 'Unit exam') : (language === 'bn' ? `পাঠ ${lIdx + 1}` : `Lesson ${lIdx + 1}`)}
                           </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
