import { motion } from 'framer-motion';
import { Lock, Check, Trophy } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { useSettingsStore } from '@/store/settingsStore';
import { clsx } from 'clsx';
import IconAvatar from '@/components/common/IconAvatar';

const ACHIEVEMENTS = [
  { id: 'first_steps', icon: 'Footprints', name: 'প্রথম স্টেপ', desc: 'আপনার প্রথম পাঠ সম্পন্ন করুন' },
  { id: 'streak_3', icon: 'Flame', name: 'স্ট্রিক শুরু', desc: '৩ দিনের স্ট্রিক অর্জন করুন' },
  { id: 'streak_7', icon: 'Calendar', name: 'সাপ্তাহিক যোদ্ধা', desc: '৭ দিনের স্ট্রিক অর্জন করুন' },
  { id: 'perfect_100', icon: 'Target', name: 'নিখুঁত স্কোর', desc: 'অনুশীলনে ১০০% পান' },
  { id: 'night_owl', icon: 'Moon', name: 'রাতের পেঁচা', desc: 'মধ্যরাতের পর পড়ুন' },
  { id: 'early_bird', icon: 'Sun', name: 'ভোরের পাখি', desc: 'সকাল ৭টার আগে পড়ুন' },
  { id: 'bilingual', icon: 'Languages', name: 'বহুভাষী', desc: 'একটি পাঠে একাধিক ভাষায় মনোযোগ দিন' },
  { id: 'dsa_tree', icon: 'Network', name: 'ট্রি ওয়াকার', desc: 'BST সেকশন শেষ করুন' },
  { id: 'dsa_graph', icon: 'Share2', name: 'গ্রাফ এক্সপ্লোরার', desc: 'গ্রাফ সেকশন শেষ করুন' },
  { id: 'dsa_sort', icon: 'BarChart3', name: 'সর্টিং ঋষি', desc: 'সর্টিং সেকশন শেষ করুন' },
  { id: 'level_10', icon: 'Star', name: 'উদীয়মান স্টার', desc: 'লেভেল ১০-এ পৌঁছান' },
  { id: 'level_50', icon: 'Crown', name: 'কোড লিজেন্ড', desc: 'লেভেল ৫০-এ পৌঁছান' },
];

export default function AchievementsView() {
  const { achievements } = useUserStore();
  const { language } = useSettingsStore();
  const unlockedIds = new Set(achievements.map((a) => a.id));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center shadow-lg">
          <Trophy size={32} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-3xl font-black">{language === 'bn' ? 'আচিভমেন্ট' : 'ACHIEVEMENTS'}</h1>
          <p className="text-gray-400">
            {unlockedIds.size} / {ACHIEVEMENTS.length} {language === 'bn' ? 'আনলক হয়েছে' : 'UNLOCKED'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ACHIEVEMENTS.map((ach, i) => {
          const isUnlocked = unlockedIds.has(ach.id);

          return (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={isUnlocked ? { y: -4 } : {}}
              className={clsx(
                'glass rounded-2xl p-5 flex flex-col gap-3 transition-all relative overflow-hidden',
                isUnlocked ? 'border-amber-500/30' : 'opacity-60 grayscale'
              )}
            >
              {isUnlocked && (
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />
              )}
              
              <div className="flex justify-between items-start z-10">
                <div className={clsx(
                  'w-14 h-14 rounded-2xl flex items-center justify-center text-amber-400',
                  isUnlocked ? 'bg-amber-500/20' : 'bg-gray-800 text-gray-500'
                )}>
                  {isUnlocked ? <IconAvatar name={ach.icon} size={32} /> : <Lock size={24} />}
                </div>
                {isUnlocked && (
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Check size={14} strokeWidth={3} />
                  </div>
                )}
              </div>

              <div className="z-10 mt-2">
                <h3 className="font-bold text-lg">{ach.name}</h3>
                <p className="text-sm text-gray-400">{ach.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
