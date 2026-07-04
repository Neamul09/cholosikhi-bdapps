import { useNavigate } from 'react-router-dom';
import { Settings, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import { useUserStore } from '@/store/userStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useAuthStore } from '@/store/authStore';
import { play } from '@/lib/audio';

export default function SettingsView() {
  const { name, setName, resetAccount } = useUserStore();
  const { dailyGoalXp, setDailyGoal, language, setLanguage, theme, toggleTheme, setCourse, setHasSeenTutorial } = useSettingsStore();
  const { signOut } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8 pb-24">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-duo-blue/10 flex items-center justify-center text-duo-blue border-2 border-duo-blue/20">
          <Settings size={28} />
        </div>
        <h1 className="text-3xl font-black">{language === 'bn' ? 'সেটিংস' : 'Settings'}</h1>
      </div>

      {/* Profile Settings */}
      <section className="card-duo p-6">
        <h2 className="text-xl font-bold mb-4">{language === 'bn' ? 'প্রোফাইল' : 'Profile'}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-app-fg/50 mb-2 font-bold">{language === 'bn' ? 'আপনার নাম' : 'Your Name'}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-app-bg border-2 border-border-subtle rounded-2xl px-4 py-3 outline-none focus:border-duo-blue transition-all font-bold"
              placeholder={language === 'bn' ? "আপনার নাম লিখুন..." : "Enter your name..."}
            />
          </div>
        </div>
      </section>

      {/* App Preferences */}
      <section className="card-duo p-6 space-y-8">
        <h2 className="text-xl font-bold mb-2">{language === 'bn' ? 'পছন্দসমূহ' : 'App Preferences'}</h2>
        
        {/* Theme Selection */}
        <div className="flex items-center justify-between py-2">
           <div>
             <div className="font-bold text-lg">{language === 'bn' ? 'থিম' : 'Theme'}</div>
             <div className="text-sm text-app-fg/50 font-medium">{language === 'bn' ? 'লাইট বা ডার্ক মোড বেছে নিন' : 'Choose between Light and Dark'}</div>
           </div>
           <div className="flex bg-app-bg p-1 rounded-2xl border-2 border-border-subtle">
             <button
              onClick={() => { if (theme !== 'light') { toggleTheme(); play('toggle'); } }}
              className={clsx("px-5 py-2 rounded-xl text-sm font-black transition-all", theme === 'light' ? "bg-duo-blue text-white shadow-lg" : "text-app-fg/40")}
            >
              LIGHT
            </button>
            <button
              onClick={() => { if (theme !== 'dark') { toggleTheme(); play('toggle'); } }}
              className={clsx("px-5 py-2 rounded-xl text-sm font-black transition-all", theme === 'dark' ? "bg-duo-blue text-white shadow-lg" : "text-app-fg/40")}
            >
              DARK
            </button>
           </div>
        </div>

        {/* Language Selection */}
        <div className="flex items-center justify-between py-2 border-t-2 border-border-subtle pt-6">
           <div>
             <div className="font-bold text-lg">{language === 'bn' ? 'ভাষা' : 'Language'}</div>
             <div className="text-sm text-app-fg/50 font-medium">{language === 'bn' ? 'অ্যাপের ভাষা পরিবর্তন করুন' : 'Change app language'}</div>
           </div>
           <div className="flex bg-app-bg p-1 rounded-2xl border-2 border-border-subtle">
             <button
               onClick={() => { setLanguage('bn'); play('tap'); }}
               className={clsx("px-5 py-2 rounded-xl text-sm font-black transition-all", language === 'bn' ? "bg-duo-blue text-white shadow-lg" : "text-app-fg/40")}
             >
               বাংলা
             </button>
             <button
               onClick={() => { setLanguage('en'); play('tap'); }}
               className={clsx("px-5 py-2 rounded-xl text-sm font-black transition-all", language === 'en' ? "bg-duo-blue text-white shadow-lg" : "text-app-fg/40")}
             >
               ENGLISH
             </button>
           </div>
        </div>

        {/* Sound Effects — locked OFF until better sounds land */}
        <div className="flex items-center justify-between py-2 border-t-2 border-border-subtle pt-6">
           <div>
             <div className="font-bold text-lg">{language === 'bn' ? 'সাউন্ড ইফেক্ট' : 'Sound Effects'}</div>
             <div className="text-sm text-app-fg/50 font-medium">
               {language === 'bn'
                 ? 'নতুন সাউন্ড শীঘ্রই আসছে — আপাতত বন্ধ আছে'
                 : 'New sounds coming soon — temporarily disabled'}
             </div>
           </div>
           <div className="flex bg-app-bg p-1 rounded-2xl border-2 border-border-subtle opacity-60">
             <button
               onClick={() => { /* locked until better sounds land */ }}
               disabled
               aria-pressed={false}
               aria-label={language === 'bn' ? 'সাউন্ড চালু (শীঘ্রই)' : 'Sound on (coming soon)'}
               className="px-5 py-2 rounded-xl text-sm font-black transition-all text-app-fg/30 cursor-not-allowed"
             >
               {language === 'bn' ? 'চালু' : 'ON'}
             </button>
             <button
               aria-pressed={true}
               aria-label={language === 'bn' ? 'সাউন্ড বন্ধ' : 'Sound off'}
               className="px-5 py-2 rounded-xl text-sm font-black transition-all bg-duo-blue text-white shadow-lg"
             >
               {language === 'bn' ? 'বন্ধ' : 'OFF'}
             </button>
           </div>
        </div>

        {/* Course Selection — C++ hidden until beta is over */}
        <div className="flex items-center justify-between py-2 border-t border-white/5">
           <div>
             <div className="font-semibold">{language === 'bn' ? 'কোর্স নির্বাচন ' : 'Active Course'}</div>
             <div className="text-sm text-gray-400">{language === 'bn' ? 'আপনার শেখার ভাষা পছন্দ করুন' : 'Choose what you want to learn'}</div>
           </div>
           <div className="flex items-center gap-3">
             <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
               <button 
                 onClick={() => setCourse('python')}
                 className="px-4 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 bg-duo-green text-white shadow-lg"
               >
                 <img src="/icons/python-original.svg" alt="" className="w-4 h-4" />
                 Python
               </button>
             </div>
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 opacity-50 cursor-not-allowed">
               <img src="/icons/cplusplus-original.svg" alt="" className="w-4 h-4" />
               <span className="text-xs font-bold text-gray-400">C++</span>
               <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest bg-amber-400/10 px-1.5 py-0.5 rounded-md">Soon</span>
             </div>
           </div>
        </div>

        {/* Daily XP Goal */}
        <div className="py-2 border-t border-white/5">
          <div className="mb-3">
            <div className="font-semibold">{language === 'bn' ? 'ডেইলি এক্সপি গোল' : 'Daily XP Goal'}</div>
            <div className="text-sm text-gray-400">{language === 'bn' ? 'প্রতিদিন শেখার অভ্যাস গড়ুন' : 'Build a daily learning habit'}</div>
          </div>
          <div className="flex gap-2">
            {[30, 50, 100].map((xp) => (
              <button
                key={xp}
                onClick={() => setDailyGoal(xp)}
                className={clsx(
                  'flex-1 py-2 rounded-xl text-sm font-bold border',
                  dailyGoalXp === xp
                    ? 'border-amber-500 bg-amber-500/20 text-amber-400'
                    : 'border-white/10 glass'
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
            <div className="font-semibold">{language === 'bn' ? 'টিউটোরিয়াল' : 'Tutorial'}</div>
            <div className="text-sm text-gray-400">{language === 'bn' ? 'অ্যাপের প্রধান ফিচারগুলো আবার দেখুন' : 'Revisit the main features of the app'}</div>
          </div>
          <button
            onClick={() => setHasSeenTutorial(false)}
            className="w-full py-3 rounded-xl text-sm font-bold border border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all"
          >
            {language === 'bn' ? 'টিউটোরিয়াল পুনরায় শুরু করুন' : 'RESTART TUTORIAL'}
          </button>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="p-6 border-2 border-rose-500/20 rounded-3xl bg-rose-500/5">
        <h2 className="text-xl font-bold text-rose-500 mb-4 flex items-center gap-2">
          <LogOut size={20} /> {language === 'bn' ? 'বিপজ্জনক জোন' : 'Danger Zone'}
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          {language === 'bn' 
            ? 'এট করলে আপনার সমস্ত এক্সপি, স্ট্রিক এবং শেখা লেসনগুলো ডিলিট হয়ে যাবে। এটি আর ফিরিয়ে আনা সম্ভব নয়!' 
            : 'This will delete all your XP, streak, and completed lessons. This action cannot be undone!'}
        </p>
        <button
          onClick={() => {
            if (confirm(language === 'bn' ? 'আপনি কি সত্যিই সবকিছু মুছে ফেলতে চান?' : 'Are you sure you want to delete everything?')) {
              resetAccount();
            }
          }}
          className="px-6 py-3 rounded-xl font-bold bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
        >
          {language === 'bn' ? 'আপনার সকল অগ্রগতি রিসেট করুন' : 'Reset all progress'}
        </button>
      </section>

      {/* Account Section */}
      <section className="p-6 border-2 border-app/10 rounded-3xl bg-panel">
        <button
          onClick={async () => {
            await signOut();
            navigate('/auth');
          }}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-black bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all shadow-lg shadow-blue-500/10"
        >
          <LogOut size={24} />
          {language === 'bn' ? 'লগ আউট করুন' : 'SIGN OUT'}
        </button>
      </section>

    </div>
  );
}
