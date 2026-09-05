import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, LogOut, AlertTriangle, Volume2, Sparkles, UserX, ShieldAlert } from 'lucide-react';
import { clsx } from 'clsx';
import { useUserStore } from '@/store/userStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useAuthStore } from '@/store/authStore';
import { play } from '@/lib/audio';
import Confirm from './Confirm';

export default function SettingsTab() {
  const { name, setName, resetAccount } = useUserStore();
  const {
    dailyGoalXp,
    setDailyGoal,
    language,
    setLanguage,
    theme,
    toggleTheme,
    currentCourse,
    setCourse,
    setHasSeenTutorial,
  } = useSettingsStore();
  const { signOut, unsubscribe, user, subscriptionStatus } = useAuthStore();
  const navigate = useNavigate();

  const [resetOpen, setResetOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [unsubOpen, setUnsubOpen] = useState(false);
  const [unsubLoading, setUnsubLoading] = useState(false);

  const confirmReset = useCallback(() => {
    resetAccount();
    setResetOpen(false);
  }, [resetAccount]);

  const confirmSignOut = useCallback(async () => {
    setSignOutOpen(false);
    await signOut();
    navigate('/welcome');
  }, [signOut, navigate]);

  const confirmUnsubscribe = useCallback(async () => {
    setUnsubLoading(true);
    try {
      await unsubscribe();
      setUnsubOpen(false);
      navigate('/welcome', { replace: true });
    } finally {
      setUnsubLoading(false);
    }
  }, [unsubscribe, navigate]);

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
      unsubscribe: 'Unsubscribe bdapps Service',
      unsubscribeTitle: 'Cancel bdapps Subscription?',
      unsubscribeBody: 'Warning: Canceling will stop your daily charging (৳2.78/day) and revoke access to CholoSikhi premium courses until you subscribe again.',
      unsubscribeConfirm: 'Yes, Unsubscribe Now',
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
      resetTitle: 'সব মুছে ফেলবেন?',
      resetBody: 'সকল XP, স্ট্রিক এবং শেখার অগ্রগতি মুছে যাবে। পুনরুদ্ধার করা সম্ভব নয়।',
      resetConfirm: 'রিসেট',
      resetCancel: 'বাতিল',
      signOutConfirm: 'লগ আউট',
      signOutCancel: 'থাকুন',
      unsubscribe: 'bdapps সাবস্ক্রিপশন বাতিল করুন',
      unsubscribeTitle: 'সাবস্ক্রিপশন কি বাতিল করতে চান?',
      unsubscribeBody: 'সতর্কতা: এটি আপনার দৈনিক ২.৭৮ টাকা চার্জিং বন্ধ করে দেবে এবং প্রিমিয়াম লেসনের অ্যাক্সেস সাময়িক বন্ধ করে দেবে।',
      unsubscribeConfirm: 'হ্যাঁ, আনসাবস্ক্রাইব করুন',
    },
  };

  const tx = language === 'bn' ? tr.bn : tr.en;

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Dialog Modals */}
      <Confirm
        open={resetOpen}
        title={tx.resetTitle}
        body={tx.resetBody}
        confirmText={tx.resetConfirm}
        cancelText={tx.resetCancel}
        danger
        onConfirm={confirmReset}
        onCancel={() => setResetOpen(false)}
      />
      <Confirm
        open={signOutOpen}
        title={tx.signOutTitle}
        body={tx.signOutBody}
        confirmText={tx.signOutConfirm}
        cancelText={tx.signOutCancel}
        onConfirm={confirmSignOut}
        onCancel={() => setSignOutOpen(false)}
      />
      <Confirm
        open={unsubOpen}
        title={tx.unsubscribeTitle}
        body={tx.unsubscribeBody}
        confirmText={unsubLoading ? 'Processing…' : tx.unsubscribeConfirm}
        cancelText={tx.signOutCancel}
        danger
        onConfirm={confirmUnsubscribe}
        onCancel={() => setUnsubOpen(false)}
      />

      {/* Account Profile Header */}
      <section className="p-6 border-2 border-border-subtle rounded-3xl bg-panel space-y-4">
        <h3 className="text-xl font-black flex items-center gap-2">
          <SettingsIcon size={20} className="text-blue-500" />
          {tx.profile}
        </h3>
        <div>
          <label className="block text-xs font-bold uppercase text-app-fg/50 mb-2">
            {tx.nameLabel}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={tx.namePh}
            className="w-full px-4 py-3 rounded-2xl bg-app-bg border border-border-subtle font-bold text-app-fg focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>
        {user?.mobile && (
          <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400 flex justify-between items-center">
            <span>Mobile: {user.mobile}</span>
            <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-[10px] font-black uppercase">
              {subscriptionStatus || 'REGISTERED'}
            </span>
          </div>
        )}
      </section>

      {/* Preferences Section */}
      <section className="p-6 border-2 border-border-subtle rounded-3xl bg-panel space-y-6">
        <h3 className="text-xl font-black">{tx.prefs}</h3>

        {/* Theme Toggle */}
        <div className="flex items-center justify-between py-2 border-t border-border-subtle pt-6">
          <div>
            <div className="font-bold text-lg">{tx.theme}</div>
            <div className="text-sm text-app-fg/50 font-medium">{tx.themeSub}</div>
          </div>
          <button
            onClick={toggleTheme}
            className="px-5 py-2 rounded-xl bg-app-bg border border-border-subtle font-black text-sm hover:border-blue-500 transition-all"
          >
            {theme === 'dark' ? 'Dark' : 'Light'}
          </button>
        </div>

        {/* Language Selection */}
        <div className="flex items-center justify-between py-2 border-t border-border-subtle">
          <div>
            <div className="font-bold text-lg">{tx.language}</div>
            <div className="text-sm text-app-fg/50 font-medium">{tx.languageSub}</div>
          </div>
          <div className="flex bg-app-bg p-1 rounded-2xl border border-border-subtle gap-1">
            <button
              onClick={() => {
                if (language !== 'bn') {
                  setLanguage('bn');
                  play('tap');
                }
              }}
              className={clsx(
                'px-4 py-2 rounded-xl text-sm font-black transition-all',
                language === 'bn'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-app-fg/40 hover:text-app-fg/70',
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
                'px-4 py-2 rounded-xl text-sm font-black transition-all',
                language === 'en'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-app-fg/40 hover:text-app-fg/70',
              )}
            >
              English
            </button>
          </div>
        </div>

        {/* Course Selection */}
        <div className="flex items-center justify-between py-2 border-t border-border-subtle gap-4">
          <div className="flex-1">
            <div className="font-bold text-lg">{tx.course}</div>
            <div className="text-sm text-app-fg/50 font-medium">{tx.courseSub}</div>
          </div>
          <button
            onClick={() => {
              if (currentCourse !== 'python') {
                setCourse('python');
                play('tap');
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-emerald-500/15 border-2 border-emerald-500/40 text-emerald-400"
          >
            Python
          </button>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="p-6 border-2 border-rose-500/20 rounded-3xl bg-rose-500/5 space-y-4">
        <h3 className="text-xl font-bold text-rose-500 flex items-center gap-2">
          <AlertTriangle size={20} /> {tx.danger}
        </h3>
        <p className="text-sm text-app-fg/60 font-medium">{tx.dangerBody}</p>
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => setResetOpen(true)}
            className="px-6 py-3 rounded-xl font-bold bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
          >
            {tx.reset}
          </button>

          <button
            onClick={() => setUnsubOpen(true)}
            className="px-6 py-3 rounded-xl font-black bg-amber-500/20 border border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <UserX size={18} />
            {tx.unsubscribe}
          </button>
        </div>
      </section>

      {/* Account Sign Out Section */}
      <section className="p-6 border-2 border-border-subtle rounded-3xl bg-panel">
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