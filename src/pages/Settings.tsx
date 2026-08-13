import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, LogOut, AlertTriangle, Volume2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useUserStore } from '@/store/userStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useAuthStore } from '@/store/authStore';
import { play } from '@/lib/audio';

interface ConfirmProps {
  open: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function Confirm({ open, title, body, confirmLabel, cancelLabel, onConfirm, onCancel }: ConfirmProps) {
  // Esc cancels, Enter confirms — standard dialog a11y
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Enter') onConfirm();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel, onConfirm]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onCancel}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-panel border-2 border-border-subtle rounded-3xl p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 flex items-center justify-center text-rose-400 shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 id="confirm-title" className="text-lg font-black mb-1">{title}</h3>
                <p className="text-sm text-app-fg/60 font-medium">{body}</p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-xl font-bold text-app-fg/70 hover:bg-app-bg transition-colors"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-xl font-bold bg-rose-500 text-white hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/20"
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function SettingsView() {
  const { name, setName, resetAccount } = useUserStore();
  const { dailyGoalXp, setDailyGoal, language, setLanguage, theme, toggleTheme, currentCourse, setCourse, setHasSeenTutorial } = useSettingsStore();
  const { signOut } = useAuthStore();
  const navigate = useNavigate();

  const [resetOpen, setResetOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);

  const confirmReset = useCallback(() => {
    resetAccount();
    setResetOpen(false);
  }, [resetAccount]);

  const confirmSignOut = useCallback(async () => {
    setSignOutOpen(false);
    await signOut();
    navigate('/auth');
  }, [signOut, navigate]);

  const tr = {
    en: {
      settings: 'Settings',
      profile: 'Profile',
      nameLabel: 'Your name',
      namePh: 'What should we call you?',
      prefs: 'Preferences',
      theme: 'Theme',
      themeSub: 'Light or dark — pick what feels right.',
      language: 'Language',
      languageSub: 'Change the app language.',
      sound: 'Sound effects',
      soundSub: 'New sound pack is on the way. For now, this is off.',
      soundSoon: 'Soon',
      course: 'Active course',
      courseSub: 'Pick what you want to learn.',
      dailyGoal: 'Daily XP goal',
      dailyGoalSub: 'Build the habit — even 30 XP a day adds up.',
      tutorial: 'Tutorial',
      tutorialSub: 'Re-watch the quick walkthrough.',
      tutorialCta: 'Restart tutorial',
      danger: 'Danger zone',
      dangerBody: 'This deletes your XP, streak and lesson progress. There is no undo.',
      reset: 'Reset all progress',
      signOut: 'Sign out',
      signOutTitle: 'Sign out?',
      signOutBody: "You'll have to log back in to keep your streak alive.",
      resetTitle: 'Reset everything?',
      resetBody: 'All XP, streak, and lesson progress will be gone. No undo.',
      resetConfirm: 'Reset',
      resetCancel: 'Cancel',
      signOutConfirm: 'Sign out',
      signOutCancel: 'Stay',
    },
    bn: {
      settings: 'সেটিংস',
      profile: 'প্রোফাইল',
      nameLabel: 'আপনার নাম',
      namePh: 'আপনাকে কী নামে ডাকব?',
      prefs: 'পছন্দসমূহ',
      theme: 'থিম',
      themeSub: 'লাইট না ডার্ক — যেটায় চোখের আরাম।',
      language: 'ভাষা',
      languageSub: 'অ্যাপের ভাষা বদলে নিন।',
      sound: 'সাউন্ড ইফেক্ট',
      soundSub: 'নতুন সাউন্ড প্যাক আসছে। ততদিন বন্ধ থাকবে।',
      soundSoon: 'শীঘ্রই',
      course: 'কোর্স বেছে নিন',
      courseSub: 'কোনটা শিখতে চান সেটা বেছে নিন।',
      dailyGoal: 'দৈনিক XP লক্ষ্য',
      dailyGoalSub: 'অভ্যাস গড়ে তুলুন — দিনে মাত্র ৩০ XP-ও অনেক।',
      tutorial: 'টিউটোরিয়াল',
      tutorialSub: 'অ্যাপের প্রধান ফিচারগুলো আবার দেখুন।',
      tutorialCta: 'টিউটোরিয়াল আবার দেখুন',
      danger: 'বিপজ্জনক জোন',
      dangerBody: 'এটা চালালে XP, স্ট্রিক আর পাঠের অগ্রগতি সব মুছে যাবে। ফেরানো যাবে না।',
      reset: 'সব অগ্রগতি মুছুন',
      signOut: 'লগ আউট',
      signOutTitle: 'লগ আউট করবেন?',
      signOutBody: 'স্ট্রিক ধরে রাখতে আবার লগইন করতে হবে।',
      resetTitle: 'সব মুছে দেবেন?',
      resetBody: 'XP, স্ট্রিক আর পাঠের অগ্রগতি সব শেষ। ফেরানোর উপায় নেই।',
      resetConfirm: 'মুছুন',
      resetCancel: 'থাক',
      signOutConfirm: 'লগ আউট',
      signOutCancel: 'থাকি',
    },
  };
  const tx = tr[language];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8 pb-24">
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

      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-duo-blue/10 flex items-center justify-center text-duo-blue border-2 border-duo-blue/20">
          <Settings size={28} />
        </div>
        <h1 className="text-3xl font-black">{tx.settings}</h1>
      </div>

      {/* Profile Settings */}
      <section className="card-duo p-6">
        <h2 className="text-xl font-bold mb-4">{tx.profile}</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="settings-name" className="block text-sm text-app-fg/50 mb-2 font-bold">{tx.nameLabel}</label>
            <input
              id="settings-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-app-bg border-2 border-border-subtle rounded-2xl px-4 py-3 outline-none focus:border-duo-blue transition-all font-bold placeholder:text-app-fg/30"
              placeholder={tx.namePh}
            />
          </div>
        </div>
      </section>

      {/* App Preferences */}
      <section className="card-duo p-6 space-y-8">
        <h2 className="text-xl font-bold mb-2">{tx.prefs}</h2>

        {/* Theme */}
        <div className="flex items-center justify-between py-2 gap-4">
           <div className="flex-1">
             <div className="font-bold text-lg">{tx.theme}</div>
             <div className="text-sm text-app-fg/50 font-medium">{tx.themeSub}</div>
           </div>
           <div className="flex bg-app-bg p-1 rounded-2xl border-2 border-border-subtle shrink-0" role="radiogroup" aria-label={tx.theme}>
             <button
              role="radio"
              aria-checked={theme === 'light'}
              onClick={() => { if (theme !== 'light') { toggleTheme(); play('toggle'); } }}
              className={clsx("px-5 py-2 rounded-xl text-sm font-black transition-all", theme === 'light' ? "bg-duo-blue text-white shadow-lg" : "text-app-fg/40 hover:text-app-fg/70")}
            >
              {language === 'bn' ? 'লাইট' : 'Light'}
            </button>
            <button
              role="radio"
              aria-checked={theme === 'dark'}
              onClick={() => { if (theme !== 'dark') { toggleTheme(); play('toggle'); } }}
              className={clsx("px-5 py-2 rounded-xl text-sm font-black transition-all", theme === 'dark' ? "bg-duo-blue text-white shadow-lg" : "text-app-fg/40 hover:text-app-fg/70")}
            >
              {language === 'bn' ? 'ডার্ক' : 'Dark'}
            </button>
           </div>
        </div>

        {/* Language */}
        <div className="flex items-center justify-between py-2 border-t-2 border-border-subtle pt-6 gap-4">
           <div className="flex-1">
             <div className="font-bold text-lg">{tx.language}</div>
             <div className="text-sm text-app-fg/50 font-medium">{tx.languageSub}</div>
           </div>
           <div className="flex bg-app-bg p-1 rounded-2xl border-2 border-border-subtle shrink-0" role="radiogroup" aria-label={tx.language}>
             <button
               role="radio"
               aria-checked={language === 'bn'}
               onClick={() => { if (language !== 'bn') { setLanguage('bn'); play('tap'); } }}
               className={clsx("px-5 py-2 rounded-xl text-sm font-black transition-all", language === 'bn' ? "bg-duo-blue text-white shadow-lg" : "text-app-fg/40 hover:text-app-fg/70")}
             >
               {language === 'bn' ? 'বাংলা' : 'বাংলা'}
             </button>
             <button
               role="radio"
               aria-checked={language === 'en'}
               onClick={() => { if (language !== 'en') { setLanguage('en'); play('tap'); } }}
               className={clsx("px-5 py-2 rounded-xl text-sm font-black transition-all", language === 'en' ? "bg-duo-blue text-white shadow-lg" : "text-app-fg/40 hover:text-app-fg/70")}
             >
               English
             </button>
           </div>
        </div>

        {/* Sound Effects — static "soon" pill, not a fake toggle */}
        <div className="flex items-center justify-between py-2 border-t-2 border-border-subtle pt-6 gap-4">
           <div className="flex-1">
             <div className="font-bold text-lg">{tx.sound}</div>
             <div className="text-sm text-app-fg/50 font-medium">{tx.soundSub}</div>
           </div>
           <span
             role="status"
             className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-panel border border-border-subtle text-app-fg/50 text-xs font-black uppercase tracking-wider shrink-0"
             title="New sound pack is on the way"
           >
             <Volume2 size={12} aria-hidden="true" />
             {tx.soundSoon}
           </span>
        </div>

        {/* Course Selection */}
        <div className="flex items-center justify-between py-2 border-t border-white/5 gap-4">
           <div className="flex-1">
             <div className="font-bold">{tx.course}</div>
             <div className="text-sm text-app-fg/50 font-medium">{tx.courseSub}</div>
           </div>
           <div className="flex items-center gap-3 shrink-0">
             <button
               onClick={() => { if (currentCourse !== 'python') { setCourse('python'); play('tap'); } }}
               aria-pressed={currentCourse === 'python'}
               className={clsx(
                 'flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-bold transition-all border-2',
                 currentCourse === 'python'
                   ? 'bg-duo-green/15 border-duo-green/40 text-duo-green'
                   : 'bg-white/5 border-white/10 text-app-fg/40 hover:text-app-fg'
               )}
             >
               <img src="/icons/python-original.svg" alt="" className="w-4 h-4" />
               Python
             </button>
             <span
               className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 opacity-50 cursor-not-allowed"
               title={language === 'bn' ? 'C++ শীঘ্রই আসছে' : 'C++ coming soon'}
             >
               <img src="/icons/cplusplus-original.svg" alt="" className="w-4 h-4 grayscale" />
               <span className="text-xs font-bold text-gray-400">C++</span>
               <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest bg-amber-400/10 px-1.5 py-0.5 rounded-md">
                 {language === 'bn' ? 'শীঘ্রই' : 'Soon'}
               </span>
             </span>
           </div>
        </div>

        {/* Daily XP Goal */}
        <div className="py-2 border-t border-white/5">
          <div className="mb-3">
            <div className="font-bold">{tx.dailyGoal}</div>
            <div className="text-sm text-app-fg/50 font-medium">{tx.dailyGoalSub}</div>
          </div>
          <div className="flex gap-2" role="radiogroup" aria-label={tx.dailyGoal}>
            {[30, 50, 100].map((xp) => (
              <button
                key={xp}
                role="radio"
                aria-checked={dailyGoalXp === xp}
                onClick={() => { setDailyGoal(xp); play('tap'); }}
                className={clsx(
                  'flex-1 py-2 rounded-xl text-sm font-bold border transition-all',
                  dailyGoalXp === xp
                    ? 'border-amber-500 bg-amber-500/20 text-amber-400'
                    : 'border-white/10 glass hover:border-white/20'
                )}
              >
                {xp} XP
              </button>
            ))}
          </div>
        </div>

        {/* Tutorial */}
        <div className="py-2 border-t border-white/5">
          <div className="mb-3">
            <div className="font-bold">{tx.tutorial}</div>
            <div className="text-sm text-app-fg/50 font-medium">{tx.tutorialSub}</div>
          </div>
          <button
            onClick={() => { setHasSeenTutorial(false); navigate('/'); }}
            className="w-full py-3 rounded-xl text-sm font-bold border border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all inline-flex items-center justify-center gap-2"
          >
            <Sparkles size={14} />
            {tx.tutorialCta}
          </button>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="p-6 border-2 border-rose-500/20 rounded-3xl bg-rose-500/5">
        <h2 className="text-xl font-bold text-rose-500 mb-4 flex items-center gap-2">
          <AlertTriangle size={20} /> {tx.danger}
        </h2>
        <p className="text-sm text-app-fg/60 mb-4 font-medium">
          {tx.dangerBody}
        </p>
        <button
          onClick={() => setResetOpen(true)}
          className="px-6 py-3 rounded-xl font-bold bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
        >
          {tx.reset}
        </button>
      </section>

      {/* Account Section */}
      <section className="p-6 border-2 border-app/10 rounded-3xl bg-panel">
        <button
          onClick={() => setSignOutOpen(true)}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-black bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all shadow-lg shadow-blue-500/10"
        >
          <LogOut size={24} />
          {tx.signOut}
        </button>
      </section>
    </div>
  );
}
