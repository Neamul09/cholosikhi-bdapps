import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NINI_MASCOT } from '@/lib/mascot';
import { useUserStore } from '@/store/userStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useProgressStore } from '@/store/progressStore';
import { 
  TOTAL_PYTHON_LESSONS, 
  getCompletedLessonsCount 
} from '@/content/python/lessons';

const COOLDOWN_MS = 30 * 60 * 1000; // 30 minutes minimum between notifications
const STORAGE_KEY = 'cholosikhi_nini_toast_ts';

interface NotificationContent {
  title: string;
  message: string;
  actionText?: string;
  actionRoute?: string;
  isWarning?: boolean;
}

export default function NiniNotification() {
  const navigate = useNavigate();
  const { language } = useSettingsStore();
  const isBn = language === 'bn';
  const { hearts, streak, name } = useUserStore();
  const { lessonProgress } = useProgressStore();
  const completedLessons = getCompletedLessonsCount(lessonProgress);

  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState<NotificationContent | null>(null);

  useEffect(() => {
    // Check if cooldown has passed
    const lastTimestamp = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
    const now = Date.now();

    if (now - lastTimestamp < COOLDOWN_MS) {
      return;
    }

    // Delay initial appearance by 18 seconds so it doesn't disturb page entry
    const timer = setTimeout(() => {
      // Pick personalized message
      let notif: NotificationContent;

      if (hearts <= 2) {
        notif = {
          title: isBn ? 'নিনি একটু চিন্তিত! 💔' : 'Nini is worried! 💔',
          message: isBn
            ? `সাবধান! তোমার কিন্তু মাত্র ${hearts}টি হার্ট বাকি আছে। কোড রান করার সময় একটু চোখ বুলিয়ে নিও, তুমি পারবে! ❤️`
            : `Careful! You only have ${hearts} heart(s) left. Take your time while typing code, you got this! ❤️`,
          actionText: isBn ? 'প্র্যাকটিসে মন দাও' : 'Focus on Practice',
          actionRoute: '/learn',
          isWarning: true
        };
      } else if (streak >= 3) {
        notif = {
          title: isBn ? `${streak} দিনের আগুন স্ট্রিক! 🔥` : `${streak} Day Streak on Fire! 🔥`,
          message: isBn
            ? `সাবাশ! তোমার ${streak} দিনের স্ট্রিক চালু আছে! আজকের নতুন পাঠ শিখে স্ট্রিকটা ধরে রাখো!`
            : `Awesome! You have kept your ${streak}-day streak alive! Complete a quick lesson to keep the fire going!`,
          actionText: isBn ? 'আজকের পাঠ শুরু করো' : 'Start Today’s Lesson',
          actionRoute: '/py'
        };
      } else if (completedLessons === 0) {
        notif = {
          title: isBn ? 'কোডিংয়ের সুন্দর জগতে স্বাগতম! 🚀' : 'Welcome to Coding! 🚀',
          message: isBn
            ? `হেই${name ? ' ' + name : ''}! পাইথনের প্রথম প্রোগ্রামটা কিন্তু খুব সহজ। চলো একসাথে প্রথম কোড রান করে ফেলি!`
            : `Hey${name ? ' ' + name : ''}! Writing your first Python program is super easy. Let's run your first code together!`,
          actionText: isBn ? 'প্রথম পাঠ শুরু করো' : 'Start Lesson 1',
          actionRoute: '/py'
        };
      } else if (completedLessons >= 25 && completedLessons < TOTAL_PYTHON_LESSONS) {
        notif = {
          title: isBn ? 'সনদপত্র প্রায় তোমার হাতে! 🎓' : 'Certificate Almost Ready! 🎓',
          message: isBn
            ? `তুমি ইতিমধ্যে ${completedLessons}টি পাঠ শেষ করেছ! আর মাত্র ${TOTAL_PYTHON_LESSONS - completedLessons}টি পাঠ শেষ করলেই অফিসিয়াল সনদপত্র আনলক হবে!`
            : `You've completed ${completedLessons}/${TOTAL_PYTHON_LESSONS} lessons! Just a few more to unlock your official Certificate!`,
          actionText: isBn ? 'সার্টিফিকেট টার্গেট' : 'View Certificate',
          actionRoute: '/py/certificate'
        };
      } else {
        const hour = new Date().getHours();
        if (hour >= 21 || hour < 5) {
          notif = {
            title: isBn ? 'নিনির রাতের পরামর্শ 🌙' : 'Nini’s Night Tip 🌙',
            message: isBn
              ? 'ঘুমানোর আগে ১০ মিনিটের একটু কোডিং প্র্যাকটিস তোমার আত্মবিশ্বাস দ্বিগুণ করে দেবে! তুমি চমৎকার এগোচ্ছ!'
              : 'A quick 10-minute code review before bed reinforces everything you learned today. Great progress!',
            actionText: isBn ? 'একটু প্র্যাকটিস' : 'Quick Practice',
            actionRoute: '/py'
          };
        } else if (hour < 12) {
          notif = {
            title: isBn ? 'শুভ সকাল! চলো শিখি ☀️' : 'Good Morning! Let’s Code ☀️',
            message: isBn
              ? 'সকালের সতেজ মাথায় পাইথন কোড শেখা সবচেয়ে সহজ। চলো আজকের প্রথম মিশনটা শেষ করে ফেলি!'
              : 'Mornings are the best time to pick up new programming concepts. Let’s tackle today’s challenge!',
            actionText: isBn ? 'আজকের পাঠ' : 'Today’s Lesson',
            actionRoute: '/py'
          };
        } else {
          notif = {
            title: isBn ? 'নিনি পাশে আছে! 💡' : 'Nini is cheering for you! 💡',
            message: isBn
              ? 'প্রতিদিন একটু একটু কোডিং করার অভ্যাসই তোমাকে দক্ষ ডেভেলপার করে তুলবে। লেগে থাকো!'
              : 'Coding a little bit every day builds lifelong problem-solving skills. Keep going!',
            actionText: isBn ? 'শিখতে চলো' : 'Keep Learning',
            actionRoute: '/py'
          };
        }
      }

      setContent(notif);
      setVisible(true);
      localStorage.setItem(STORAGE_KEY, Date.now().toString());

      // Auto-dismiss after 9 seconds if ignored
      const dismissTimer = setTimeout(() => {
        setVisible(false);
      }, 9000);

      return () => clearTimeout(dismissTimer);
    }, 18000);

    return () => clearTimeout(timer);
  }, [hearts, streak, completedLessons, isBn, name]);

  const handleDismiss = () => {
    setVisible(false);
  };

  const handleAction = () => {
    if (content?.actionRoute) {
      navigate(content.actionRoute);
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && content && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:max-w-md z-50 pointer-events-auto"
        >
          <div className="bg-panel border-2 border-border-subtle rounded-3xl p-4 sm:p-5 shadow-2xl relative overflow-hidden backdrop-blur-md bg-opacity-95 text-app-fg">
            
            {/* Top Close Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 p-1.5 rounded-full text-app-fg-muted hover:text-app-fg hover:bg-white/10 transition"
              aria-label="Close notification"
            >
              <X size={16} />
            </button>

            {/* Mascot and Message */}
            <div className="flex items-start gap-3.5 pr-6">
              <div className="w-14 h-14 shrink-0 relative flex items-center justify-center">
                <img
                  src={content.isWarning ? NINI_MASCOT.wrong : NINI_MASCOT.right}
                  alt="Nini"
                  className="w-full h-full object-contain drop-shadow"
                />
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-black text-app-fg flex items-center gap-1.5">
                  <span>{content.title}</span>
                </h4>
                <p className="text-xs text-app-fg-muted leading-relaxed font-medium">
                  {content.message}
                </p>
              </div>
            </div>

            {/* Bottom Action Pill */}
            {content.actionText && (
              <div className="mt-3 pt-2.5 border-t border-border-subtle flex items-center justify-between">
                <span className="text-[11px] font-bold text-app-fg-muted flex items-center gap-1">
                  <Sparkles size={12} className="text-duo-yellow" />
                  <span>নিনির উৎসাহবার্তা</span>
                </span>
                <button
                  onClick={handleAction}
                  className="px-3 py-1.5 rounded-xl bg-duo-green hover:bg-duo-green-hover text-white text-xs font-black transition flex items-center gap-1 shadow-sm"
                >
                  <span>{content.actionText}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
