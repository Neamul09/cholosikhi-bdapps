import { useState, useEffect } from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loadSatUserState } from '../lib/satStorage';
import { play } from '../../lib/audio';

const STORAGE_KEY = 'cs_sat_nini_toast_ts';
const COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes between toasts

interface NotificationState {
  title: string;
  message: string;
  actionText?: string;
  actionRoute?: string;
  mood?: 'happy' | 'thoughtful' | 'cheering';
}

export default function SatNiniNotification() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check cooldown
    const lastTimestamp = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
    const now = Date.now();

    if (now - lastTimestamp < COOLDOWN_MS) {
      return;
    }

    // Delay initial pop-in by 4 seconds so page loads smoothly first
    const timer = setTimeout(() => {
      const state = loadSatUserState();
      const unresolvedMistakes = state.mistakes.filter(m => !m.resolved).length;
      const totalSolved = state.attempts.length;

      let notif: NotificationState;

      if (unresolvedMistakes >= 2) {
        notif = {
          title: 'Nini Coach Advice 🦉',
          message: `You have ${unresolvedMistakes} questions logged in your Mistake Bank. Retrying your mistakes is proven to boost your scaled score fastest!`,
          actionText: 'Start Mistake Drill',
          actionRoute: '/sat/quiz?mode=mistakes_drill',
          mood: 'thoughtful'
        };
      } else if (state.streak >= 3) {
        notif = {
          title: `Amazing ${state.streak}-Day Streak! 🔥`,
          message: 'Consistency beats cramming on the Digital SAT. Complete today’s short drill to keep your streak intact!',
          actionText: 'Do Today’s Drill',
          actionRoute: '/sat/quiz?mode=drill&microType=alg-linear-one-solutions-count',
          mood: 'cheering'
        };
      } else if (totalSolved === 0) {
        notif = {
          title: 'Welcome to CholoSikhi SAT! 🎯',
          message: 'Start with a benchmark diagnostic test to uncover your micro-type mastery and predicted score.',
          actionText: 'Take Diagnostic',
          actionRoute: '/sat/quiz?mode=practice_test',
          mood: 'happy'
        };
      } else {
        notif = {
          title: 'Daily Micro-Drill Ready ✨',
          message: 'Have you tackled the Hardest Questions Vault today? Mastering 800-level traps guarantees a top score.',
          actionText: 'Enter Vault',
          actionRoute: '/sat/hardest',
          mood: 'happy'
        };
      }

      setNotification(notif);
      setVisible(true);
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible || !notification) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm sm:max-w-md w-full animate-bounce-in select-none">
      <div className="glass p-5 rounded-3xl border-2 border-blue-500/40 shadow-2xl bg-panel-solid relative overflow-hidden flex items-start gap-4">
        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none -z-10" />

        {/* Nini Avatar */}
        <div className="relative shrink-0 mt-1">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500/20 to-cyan-400/20 border border-blue-500/30 flex items-center justify-center p-1 shadow-inner">
            <img
              src={notification.mood === 'thoughtful' ? '/mascot/nini-wrong.png' : '/mascot/nini-right.png'}
              alt="Nini Coach"
              className="w-full h-full object-contain filter drop-shadow"
            />
          </div>
          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-panel-solid" />
        </div>

        {/* Notification Text & Actions */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-black text-xs uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <Sparkles size={13} />
              <span>{notification.title}</span>
            </h4>

            <button
              onClick={() => {
                play('tap');
                setVisible(false);
              }}
              className="text-app-fg/40 hover:text-app-fg p-1 rounded-lg transition-colors"
              title="Dismiss notification"
            >
              <X size={15} />
            </button>
          </div>

          <p className="text-xs font-bold text-app-fg/80 leading-relaxed">
            {notification.message}
          </p>

          {notification.actionRoute && (
            <button
              onClick={() => {
                play('tap');
                setVisible(false);
                navigate(notification.actionRoute!);
              }}
              className="btn-duo btn-duo-blue py-2 px-4 text-[11px] flex items-center gap-1.5 shadow-none mt-2"
            >
              <span>{notification.actionText || 'Let’s Go'}</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
