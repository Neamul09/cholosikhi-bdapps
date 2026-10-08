import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, LogOut, AlertTriangle, Volume2, Target, Check, UserX } from 'lucide-react';
import { clsx } from 'clsx';
import { useUserStore } from '@/store/userStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useAuthStore } from '@/store/authStore';
import { play } from '@/lib/audio';
import Confirm from '@/pages/profile/Confirm';
import { clearSatUserState, loadSatUserState, saveRoutinePlan } from '../../lib/satStorage';
import { supabase } from '../../../lib/supabase';
import UnsubscribeModal from '../../../components/UnsubscribeModal';

export default function SatSettingsTab() {
  const { name, setName } = useUserStore();
  const { language, setLanguage } = useSettingsStore();
  const { user, signOut, isSubscribed, subscriptionStatus } = useAuthStore();
  const navigate = useNavigate();

  const [showUnsubModal, setShowUnsubModal] = useState(false);

  const [userState, setUserState] = useState(() => loadSatUserState());
  const [targetScore, setTargetScore] = useState(userState.routine?.targetScore || 1520);
  const [examDate, setExamDate] = useState(userState.routine?.examDate || '2026-11-07');
  const [dailyQuestionGoal, setDailyQuestionGoal] = useState(20);

  const [resetOpen, setResetOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  const handleNameChange = async (newName: string) => {
    setName(newName);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cs_sat_user_name', newName);
      localStorage.setItem('cholosikhi_user_name', newName);
      window.dispatchEvent(new CustomEvent('cs_user_name_changed', { detail: { name: newName } }));
    }

    if (user?.id) {
      try {
        await supabase.from('profiles').update({ name: newName, updated_at: new Date().toISOString() }).eq('id', user.id);
      } catch (e) {
        console.warn('Profiles update error:', e);
      }
    }
  };

  const handleTargetScoreSelect = (score: number) => {
    play('tap');
    setTargetScore(score);
    if (userState.routine) {
      const updated = { ...userState.routine, targetScore: score };
      saveRoutinePlan(updated);
      setUserState(loadSatUserState());
    }
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const handleExamDateChange = (date: string) => {
    setExamDate(date);
    if (userState.routine) {
      const updated = { ...userState.routine, examDate: date };
      saveRoutinePlan(updated);
      setUserState(loadSatUserState());
    }
  };

  const confirmReset = useCallback(() => {
    clearSatUserState();
    setUserState(loadSatUserState());
    setResetOpen(false);
    window.location.reload();
  }, []);

  const confirmSignOut = useCallback(async () => {
    setSignOutOpen(false);
    await signOut();
    navigate('/auth?redirect=/sat');
  }, [signOut, navigate]);

  const tr = {
    en: {
      settings: 'SAT Settings',
      profile: 'Scholar Profile',
      nameLabel: 'Display Name',
      namePh: 'Your full name',
      satPrefs: 'SAT Exam Calibration',
      targetScore: 'Target SAT Score',
      targetScoreSub: 'Calibrate your study routine to your target score band.',
      examDate: 'Official SAT Exam Date',
      examDateSub: 'Countdown timer and pacing will align with this date.',
      dailyGoal: 'Daily Practice Goal',
      dailyGoalSub: 'Target questions per day to maintain active streak.',
      prefs: 'Preferences',
      theme: 'Theme',
      themeSub: 'Official Dark Mode for optimal contrast during timed testing.',
      language: 'Language',
      languageSub: 'Change platform UI language.',
      sound: 'Sound feedback',
      soundSub: 'Audio cues for correct answers and timer alerts.',
      danger: 'Danger Zone',
      dangerBody: 'This resets all SAT question attempts, mastery progress, mistake logs, and study routines. There is no undo.',
      reset: 'Reset SAT Progress',
      signOut: 'Sign Out',
      signOutTitle: 'Sign out of Digital SAT?',
      signOutBody: 'Your progress is securely saved to your account. You can log back in anytime.',
      resetTitle: 'Reset all SAT progress?',
      resetBody: 'All question attempts, score predictions, and mistake logs will be permanently erased.',
      resetConfirm: 'Reset Everything',
      resetCancel: 'Cancel',
      signOutConfirm: 'Sign Out',
      signOutCancel: 'Stay',
    },
    bn: {
      settings: 'SAT সেটিংস',
      profile: 'স্কলার প্রোফাইল',
      nameLabel: 'প্রদর্শিত নাম',
      namePh: 'আপনার পূর্ণ নাম লিখুন',
      satPrefs: 'SAT পরীক্ষার ক্যালিব্রেশন',
      targetScore: 'টার্গেট SAT স্কোর',
      targetScoreSub: 'আপনার লক্ষ্য স্কোর অনুযায়ী রুটিন ক্যালিব্রেট করুন।',
      examDate: 'অফিসিয়াল SAT পরীক্ষার তারিখ',
      examDateSub: 'কাউন্টডাউন এবং গতি এই তারিখের সাথে সমন্বিত হবে।',
      dailyGoal: 'দৈনিক অনুশীলনের লক্ষ্য',
      dailyGoalSub: 'স্ট্রিক ধরে রাখতে প্রতিদিন নির্দিষ্ট সংখ্যক প্রশ্ন সমাধান করুন।',
      prefs: 'পছন্দসমূহ',
      theme: 'থিম',
      themeSub: 'অফিসিয়াল ডার্ক মোড সক্রিয়।',
      language: 'ভাষা',
      languageSub: 'প্ল্যাটফর্মের ভাষা পরিবর্তন করুন।',
      sound: 'সাউন্ড ইফেক্ট',
      soundSub: 'সঠিক উত্তর এবং টাইমার অ্যালার্টের জন্য অডিও কিউ।',
      danger: 'বিপজ্জনক জোন',
      dangerBody: 'এটি সমস্ত SAT প্রশ্নের প্রচেষ্টা, মাস্টারি এবং ভুল ব্যাংকের ডেটা মুছে দেবে। এটি ফেরানো যাবে না।',
      reset: 'সব SAT অগ্রগতি মুছুন',
      signOut: 'লগ আউট',
      signOutTitle: 'লগ আউট করবেন?',
      signOutBody: 'আপনার অগ্রগতি অ্যাকাউন্টে সংরক্ষিত থাকবে। যেকোনো সময় পুনরায় লগইন করতে পারবেন।',
      resetTitle: 'সব SAT ডেটা মুছে দেবেন?',
      resetBody: 'সব প্রশ্নের প্রচেষ্টা ও স্কোর প্রেডিকশন মুছে যাবে।',
      resetConfirm: 'সব মুছুন',
      resetCancel: 'বাতিল',
      signOutConfirm: 'লগ আউট',
      signOutCancel: 'থাকুন',
    },
  };
  const tx = tr[language];

  return (
    <div className="space-y-8 pb-24 animate-fadeIn">
      <Confirm
        open={resetOpen}
        title={tx.resetTitle}
        body={tx.resetBody}
        confirmLabel={tx.resetConfirm}
        cancelLabel={tx.resetCancel}
        onConfirm={confirmReset}
        onCancel={() => setResetOpen(false)}
      />
      <Confirm
        open={signOutOpen}
        title={tx.signOutTitle}
        body={tx.signOutBody}
        confirmLabel={tx.signOutConfirm}
        cancelLabel={tx.signOutCancel}
        onConfirm={confirmSignOut}
        onCancel={() => setSignOutOpen(false)}
      />

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border-2 border-blue-500/20">
            <SettingsIcon size={26} />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-app-fg">{tx.settings}</h2>
            <p className="text-xs text-app-fg/50 font-bold">Preferences & Exam Calibration</p>
          </div>
        </div>
        {savedToast && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black animate-fadeIn">
            <Check size={14} />
            <span>Saved</span>
          </div>
        )}
      </div>

      {/* ─── Scholar Profile ─── */}
      <section className="glass p-6 sm:p-7 rounded-3xl border border-border-subtle space-y-4">
        <h3 className="text-lg font-black text-app-fg">{tx.profile}</h3>
        <div>
          <label htmlFor="settings-name" className="block text-xs text-app-fg/50 mb-2 font-black uppercase tracking-wider">
            {tx.nameLabel}
          </label>
          <input
            id="settings-name"
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full bg-app-bg border-2 border-border-subtle rounded-2xl px-4 py-3 outline-none focus:border-blue-500 transition-all font-black text-app-fg placeholder:text-app-fg/30 text-base"
            placeholder={tx.namePh}
          />
        </div>

        {user?.mobile && (
          <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400 flex justify-between items-center">
            <span>Mobile: {user.mobile}</span>
            <span className={clsx(
              "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
              isSubscribed && subscriptionStatus === 'REGISTERED'
                ? "bg-emerald-500/20 text-emerald-400"
                : (subscriptionStatus || '').includes('PENDING')
                ? "bg-amber-500/20 text-amber-400"
                : "bg-rose-500/20 text-rose-400"
            )}>
              {subscriptionStatus || 'REGISTERED'}
            </span>
          </div>
        )}
      </section>

      {/* ─── SAT Target Calibration ─── */}
      <section className="glass p-6 sm:p-7 rounded-3xl border border-border-subtle space-y-6">
        <div className="flex items-center gap-2">
          <Target className="text-blue-400" size={20} />
          <h3 className="text-lg font-black text-app-fg">{tx.satPrefs}</h3>
        </div>

        {/* Target Score */}
        <div className="space-y-3">
          <div>
            <div className="font-black text-sm text-app-fg">{tx.targetScore}</div>
            <div className="text-xs text-app-fg/50 font-medium">{tx.targetScoreSub}</div>
          </div>
          <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-label={tx.targetScore}>
            {[1300, 1400, 1500, 1550, 1600].map((score) => (
              <button
                key={score}
                role="radio"
                aria-checked={targetScore === score}
                onClick={() => handleTargetScoreSelect(score)}
                className={clsx(
                  'px-4 py-2.5 rounded-xl text-sm font-black border transition-all flex-1 min-w-[70px]',
                  targetScore === score
                    ? 'border-blue-500 bg-blue-500/20 text-blue-400 shadow-md shadow-blue-500/10'
                    : 'border-border-subtle bg-app-bg hover:border-border-subtle/80 text-app-fg/60 hover:text-app-fg',
                )}
              >
                {score}
              </button>
            ))}
          </div>
        </div>

        {/* Target Exam Date */}
        <div className="pt-4 border-t border-border-subtle space-y-3">
          <div>
            <div className="font-black text-sm text-app-fg">{tx.examDate}</div>
            <div className="text-xs text-app-fg/50 font-medium">{tx.examDateSub}</div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={examDate}
              onChange={(e) => handleExamDateChange(e.target.value)}
              className="bg-app-bg border-2 border-border-subtle rounded-xl px-4 py-2.5 font-black text-sm text-app-fg outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Daily Question Goal */}
        <div className="pt-4 border-t border-border-subtle space-y-3">
          <div>
            <div className="font-black text-sm text-app-fg">{tx.dailyGoal}</div>
            <div className="text-xs text-app-fg/50 font-medium">{tx.dailyGoalSub}</div>
          </div>
          <div className="flex gap-2.5" role="radiogroup" aria-label={tx.dailyGoal}>
            {[10, 20, 30, 50].map((qCount) => (
              <button
                key={qCount}
                role="radio"
                aria-checked={dailyQuestionGoal === qCount}
                onClick={() => {
                  play('tap');
                  setDailyQuestionGoal(qCount);
                }}
                className={clsx(
                  'flex-1 py-2.5 rounded-xl text-xs font-black border transition-all',
                  dailyQuestionGoal === qCount
                    ? 'border-amber-500 bg-amber-500/20 text-amber-400'
                    : 'border-border-subtle bg-app-bg text-app-fg/60 hover:text-app-fg',
                )}
              >
                {qCount} Qs/day
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── App Preferences ─── */}
      <section className="glass p-6 sm:p-7 rounded-3xl border border-border-subtle space-y-6">
        <h3 className="text-lg font-black text-app-fg">{tx.prefs}</h3>

        {/* Theme: Official Dark Mode */}
        <div className="flex items-center justify-between py-2 gap-4">
          <div className="flex-1">
            <div className="font-black text-sm text-app-fg">{tx.theme}</div>
            <div className="text-xs text-app-fg/50 font-medium">{tx.themeSub}</div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-black uppercase tracking-wider shrink-0">
            {language === 'bn' ? 'অফিসিয়াল ডার্ক' : 'Dark Mode'}
          </span>
        </div>

        {/* Language */}
        <div className="flex items-center justify-between py-2 border-t border-border-subtle pt-6 gap-4">
          <div className="flex-1">
            <div className="font-black text-sm text-app-fg">{tx.language}</div>
            <div className="text-xs text-app-fg/50 font-medium">{tx.languageSub}</div>
          </div>
          <div className="flex bg-app-bg p-1 rounded-2xl border-2 border-border-subtle shrink-0">
            <button
              onClick={() => {
                if (language !== 'bn') {
                  setLanguage('bn');
                  play('tap');
                }
              }}
              className={clsx(
                'px-4 py-1.5 rounded-xl text-xs font-black transition-all',
                language === 'bn' ? 'bg-blue-500 text-white shadow-md' : 'text-app-fg/50 hover:text-app-fg',
              )}
            >
              বাংলা
            </button>
            <button
              onClick={() => {
                if (language !== 'en') {
                  setLanguage('en');
                  play('tap');
                }
              }}
              className={clsx(
                'px-4 py-1.5 rounded-xl text-xs font-black transition-all',
                language === 'en' ? 'bg-blue-500 text-white shadow-md' : 'text-app-fg/50 hover:text-app-fg',
              )}
            >
              English
            </button>
          </div>
        </div>

        {/* Sound Effects */}
        <div className="flex items-center justify-between py-2 border-t border-border-subtle pt-6 gap-4">
          <div className="flex-1">
            <div className="font-black text-sm text-app-fg">{tx.sound}</div>
            <div className="text-xs text-app-fg/50 font-medium">{tx.soundSub}</div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-panel border border-border-subtle text-emerald-400 text-xs font-black uppercase tracking-wider shrink-0">
            <Volume2 size={13} />
            <span>Active</span>
          </span>
        </div>
      </section>

      {/* ─── Danger Zone ─── */}
      <section className="p-6 sm:p-7 border-2 border-rose-500/20 rounded-3xl bg-rose-500/5 space-y-4">
        <h3 className="text-base font-black text-rose-400 flex items-center gap-2">
          <AlertTriangle size={18} /> {tx.danger}
        </h3>
        <p className="text-xs text-app-fg/60 font-medium">{tx.dangerBody}</p>
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button
            onClick={() => setResetOpen(true)}
            className="px-5 py-2.5 rounded-xl font-black text-xs bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
          >
            {tx.reset}
          </button>

          <button
            type="button"
            onClick={() => setShowUnsubModal(true)}
            className="px-5 py-2.5 rounded-xl font-black text-xs bg-amber-500/20 border border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-white transition-colors flex items-center justify-center gap-1.5"
          >
            <UserX size={14} />
            <span>Unsubscribe bdapps Service</span>
          </button>
        </div>
      </section>

      {/* ─── Sign Out ─── */}
      <section className="p-6 rounded-3xl bg-panel border border-border-subtle">
        <button
          onClick={() => setSignOutOpen(true)}
          className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl font-black text-sm bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-500/10"
        >
          <LogOut size={18} />
          <span>{tx.signOut}</span>
        </button>
      </section>

      {/* bdapps Unsubscribe Confirmation Modal */}
      <UnsubscribeModal
        isOpen={showUnsubModal}
        onClose={() => setShowUnsubModal(false)}
      />
    </div>
  );
}
