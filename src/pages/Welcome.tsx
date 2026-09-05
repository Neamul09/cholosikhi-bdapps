import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowRight, Globe, Sparkles, Home, Moon, Sun,
  CheckCircle2, Trophy, Smartphone, ShieldCheck, Zap, Lock
} from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';

const CSLogo = ({ className = "h-10 w-auto" }) => (
  <img
    src="https://i.ibb.co.com/gZ5tDFn2/wordmark.png"
    alt="CholoSikhi"
    className={`drop-shadow-lg ${className}`}
  />
);

export default function Welcome() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language, setLanguage, theme, setTheme } = useSettingsStore();

  const isPaywallRequired = searchParams.get('paywall') === '1';

  return (
    <div className="min-h-screen bg-app-bg overflow-x-hidden font-['Hind_Siliguri',_sans-serif]">
      {/* Paywall Alert Banner if redirected from protected route */}
      {isPaywallRequired && (
        <div className="bg-amber-500/20 border-b border-amber-500/40 text-amber-400 px-4 py-3 text-center font-bold text-xs sm:text-sm flex items-center justify-center gap-2 z-50">
          <Lock size={18} className="shrink-0" />
          <span>
            {language === 'bn'
              ? 'প্রিমিয়াম কন্টেন্ট লকিং: CholoSikhi-এর সব লেসন ও প্র্যাকটিস ব্যবহার করতে সক্রিয় bdapps সাবস্ক্রিপশন প্রয়োজন (৳২.৭৮/দিন)।'
              : 'Premium Access Locked: Active bdapps Subscription required (৳2.78/day). Please subscribe or log in below.'}
          </span>
        </div>
      )}

      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <CSLogo className="h-12 w-auto" />
        </div>

        <div className="flex items-center gap-2 sm:gap-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              className="p-2 rounded-xl bg-panel border border-border-subtle text-app-fg-muted hover:text-blue-400 transition-colors"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              aria-label="Switch language"
              className="flex items-center gap-2 text-app-fg-muted hover:text-blue-400 transition-colors px-3 py-1.5 rounded-xl bg-panel border border-border-subtle"
            >
              <Globe size={16} />
              <span className="font-black text-xs">{language === 'bn' ? 'EN' : 'বাং'}</span>
            </button>
          </div>

          <button
            onClick={() => navigate('/auth')}
            className="px-6 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-black text-sm shadow-lg shadow-blue-500/20 transition-all active:scale-95 hidden sm:block"
          >
            {language === 'bn' ? 'লগইন / সাবস্ক্রাইব' : 'LOGIN / SUBSCRIBE'}
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-4 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative">
        {/* Decorative elements */}
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-cyan-400/10 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black text-xs uppercase tracking-widest">
            <Sparkles size={14} />
            {language === 'bn' ? 'রবি ও সার্কেল গ্রাহকদের জন্য — বাংলায় কোডিং' : 'For Robi & Cirkle Users — Bangla Coding'}
          </div>

          <h1 className="text-5xl sm:text-6xl font-black leading-tight tracking-tight text-app-fg">
            {language === 'bn' ? (
              <>CholoSikhi — পাইথন শেখা <span className="text-blue-500">মজার ও সহজ</span></>
            ) : (
              <>CholoSikhi — Learn Python <span className="text-blue-500">The Smart Way</span></>
            )}
          </h1>

          <p className="text-lg text-app-fg-muted font-bold leading-relaxed max-w-lg">
            {language === 'bn'
              ? 'গেম খেলার মতো ছোট ছোট ধাপে পাইথন শিখুন। সরাসরি ব্রাউজারে কোড লিখুন, চ্যালেঞ্জ জিতুন আর স্ট্রিক ধরে রাখুন। রবি ও সার্কেল গ্রাহকদের জন্য প্রতিদিন মাত্র ২.৭৮ টাকা।'
              : 'Interactive Python coding lessons in Bangla. Practice directly in your browser with simple BDApps Mobile Subscription for Robi & Cirkle users.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              onClick={() => navigate('/auth')}
              className="px-8 py-4 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-black text-lg shadow-[0_6px_0_rgb(29,78,216)] active:shadow-none active:translate-y-1.5 transition-all flex items-center justify-center gap-3 group"
            >
              <Smartphone size={20} />
              {language === 'bn' ? 'সাবস্ক্রাইব করুন (রবি/সার্কেল)' : 'Subscribe with Robi / Cirkle'}
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/auth')}
              className="px-8 py-4 rounded-2xl bg-panel border-2 border-border-subtle text-app-fg font-black text-lg shadow-[0_4px_0_var(--border-subtle)] active:shadow-none active:translate-y-1 transition-all"
            >
              {language === 'bn' ? 'লগইন করুন' : 'Already Subscribed? Log In'}
            </button>
          </div>

          {/* Trust strip */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-sm font-bold text-app-fg-muted">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck size={16} className="text-emerald-400" />{language === 'bn' ? 'bdapps গেটওয়ে অনুমোদিত' : 'bdapps Verified'}</span>
            <span className="inline-flex items-center gap-1.5"><Smartphone size={16} className="text-blue-400" />{language === 'bn' ? 'রবি ও সার্কেল ইউজার' : 'Robi & Cirkle Users'}</span>
            <span className="inline-flex items-center gap-1.5"><Trophy size={16} className="text-amber-400" />{language === 'bn' ? '১০০+ ইন্টারঅ্যাক্টিভ লেসন' : '100+ Lessons & Quizzes'}</span>
          </div>
        </motion.div>

        {/* bdapps Pricing & Plan Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="glass p-8 rounded-[2.5rem] border-2 border-blue-500/30 shadow-2xl bg-panel/80 backdrop-blur-xl space-y-6">
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
              <div>
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 font-black text-xs uppercase tracking-wider">
                  {language === 'bn' ? 'অফিসিয়াল bdapps প্ল্যান' : 'Official bdapps Plan'}
                </span>
                <h3 className="text-2xl font-black text-app-fg mt-2">CholoSikhi Premium Access</h3>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-blue-500">৳২.৭৮<span className="text-xs text-app-fg-muted font-bold">/দিন</span></div>
                <div className="text-[10px] text-app-fg-muted font-bold">ভ্যাট, সম্পূরক শুল্ক ও সারচার্জ সহ</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm font-bold text-app-fg">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                <span>{language === 'bn' ? 'সকল পাইথন ও ডিএসএ কোর্স আনলক' : 'Unlock all Python & DSA Lessons'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-app-fg">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                <span>{language === 'bn' ? 'সরাসরি ব্রাউজারে কোড লেখার প্লেগ্রাউন্ড' : 'Interactive In-browser Code Playground'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-app-fg">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                <span>{language === 'bn' ? 'প্রতিদিনের লিডারবোর্ড ও ব্যাজ অর্জন' : 'Daily Streaks, Badges & Leaderboards'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-app-fg">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                <span>{language === 'bn' ? 'যেকোনো সময় ১-ক্লিকে আনসাবস্ক্রাইব করার সুযোগ' : 'Cancel/Unsubscribe anytime with 1-click'}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-app-fg-muted flex items-start gap-3">
              <Zap size={18} className="text-blue-400 shrink-0 mt-0.5" />
              <span>
                {language === 'bn'
                  ? 'রবি (Robi) এবং সার্কেল (Cirkle) সিম গ্রাহকদের জন্য প্রযোজ্য। কোনো ক্রেডিট কার্ড লাগে না, সরাসরি আপনার মোবাইল ব্যালেন্স থেকে অটো সাবস্ক্রিপশন।'
                  : 'Exclusively for Robi & Cirkle mobile customers. Charged directly from your mobile account balance.'}
              </span>
            </div>

            <button
              onClick={() => navigate('/auth')}
              className="w-full py-4 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-black text-lg shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98]"
            >
              {language === 'bn' ? 'মোবাইল নম্বর দিয়ে সাবস্ক্রাইব করুন' : 'Subscribe via Mobile Number'}
            </button>
          </div>
        </motion.div>
      </main>

      {/* Stats Section */}
      <section className="bg-panel/50 border-y border-border-subtle py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-around items-center gap-8 text-center">
          <div>
            <div className="text-4xl font-black text-app-fg">100+</div>
            <div className="text-app-fg-muted font-bold uppercase tracking-widest text-xs mt-1">
              {language === 'bn' ? 'কোডিং পাঠ' : 'Coding lessons'}
            </div>
          </div>
          <div>
            <div className="text-4xl font-black text-app-fg">Robi & Cirkle</div>
            <div className="text-app-fg-muted font-bold uppercase tracking-widest text-xs mt-1">
              {language === 'bn' ? 'সমর্থিত টেলিকম নেটওয়ার্ক' : 'Supported Telecom Network'}
            </div>
          </div>
          <div>
            <div className="text-4xl font-black text-app-fg">bdapps</div>
            <div className="text-app-fg-muted font-bold uppercase tracking-widest text-xs mt-1">
              {language === 'bn' ? 'অফিসিয়াল গেটওয়ে' : 'Official Gateway'}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-8 text-center">
        <p className="text-xs font-bold text-app-fg-muted">
          CholoSikhi  ·  Powered by bdapps  ·  Robi & Cirkle Network
        </p>
      </footer>
    </div>
  );
}
