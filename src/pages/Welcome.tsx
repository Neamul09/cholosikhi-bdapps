import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Globe, Sparkles, Code, Terminal, Home, Moon, Sun } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';

const CSLogo = ({ className = "w-10 h-10" }) => (
  <div className={`rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30 overflow-hidden font-black text-white ${className}`}>
    <span className="translate-y-[1px]">CS</span>
  </div>
);

export default function Welcome() {
  const navigate = useNavigate();
  const { language, setLanguage, theme, setTheme } = useSettingsStore();

  return (
    <div className="min-h-screen bg-app-bg overflow-x-hidden font-['Hind_Siliguri',_sans-serif]">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <CSLogo className="w-12 h-12 text-lg" />
          <span className="text-2xl font-black tracking-tight text-app-fg">
            <span className="text-blue-500">py.</span>cholosikhi
          </span>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-6">
          <a 
            href="https://cholosikhi.com"
            className="flex items-center gap-2 text-app-fg-muted font-black uppercase text-xs tracking-widest hover:text-blue-500 transition-colors hidden md:flex"
          >
            <Home size={16} />
            {language === 'bn' ? 'মূল পাতা' : 'MAIN HUB'}
          </a>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl bg-panel border border-border-subtle text-app-fg-muted hover:text-blue-400 transition-colors"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
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
            {language === 'bn' ? 'লগইন' : 'LOGIN'}
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-12 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative">
        {/* Decorative elements */}
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-cyan-400/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black text-xs uppercase tracking-widest">
            <Sparkles size={14} />
            {language === 'bn' ? 'সবার জন্য সহজ কোডিং' : 'Coding made simple for everyone'}
          </div>
          
          <h1 className="text-6xl sm:text-7xl font-black leading-tight tracking-tight text-app-fg">
            {language === 'bn' ? (
              <>পাইথন শিখুন <span className="text-blue-500">মজা</span> করে</>
            ) : (
              <>The <span className="text-blue-500">fun</span> way to learn Python</>
            )}
          </h1>
          
          <p className="text-xl text-app-fg-muted font-bold leading-relaxed max-w-lg">
            {language === 'bn' 
              ? 'গেম খেলার মতো করে পাইথন শিখুন। ছোট ছোট পাঠ, মজার চ্যালেঞ্জ এবং হাতে-কলমে প্র্যাকটিস।' 
              : 'Master Python through game-like lessons. Interactive challenges, visual playgrounds, and hands-on practice.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={() => navigate('/auth')}
              className="px-10 py-5 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-black text-xl shadow-[0_8px_0_rgb(29,78,216)] active:shadow-none active:translate-y-2 transition-all flex items-center justify-center gap-3 group"
            >
              {language === 'bn' ? 'শুরু করুন' : 'GET STARTED'}
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/auth')}
              className="px-10 py-5 rounded-2xl bg-panel border-2 border-border-subtle text-app-fg font-black text-xl shadow-[0_6px_0_var(--border-subtle)] active:shadow-none active:translate-y-1.5 transition-all"
            >
              {language === 'bn' ? 'আমার অ্যাকাউন্ট আছে' : 'I ALREADY HAVE AN ACCOUNT'}
            </button>
          </div>

          <div className="pt-6">
            <a 
              href="https://cholosikhi.com"
              className="inline-flex items-center gap-2 text-blue-400 font-black uppercase text-xs tracking-[0.2em] hover:gap-4 transition-all"
            >
              <ArrowRight className="rotate-180" size={16} />
              {language === 'bn' ? 'চলোশিখি মূল পাতায় ফিরে যান' : 'BACK TO CHOLOSIKHI MAIN HUB'}
            </a>
          </div>
        </motion.div>

        {/* Hero Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <div className="relative z-10 grid grid-cols-2 gap-4">
            <div className="space-y-4 pt-12">
              <div className="glass p-6 rounded-[2rem] border-2 border-blue-500/20 shadow-xl space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Code size={24} />
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-20 bg-blue-500/20 rounded-full" />
                  <div className="h-2 w-32 bg-blue-500/10 rounded-full" />
                </div>
              </div>
              <div className="glass p-6 rounded-[2rem] border-2 border-emerald-500/20 shadow-xl space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Sparkles size={24} />
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-24 bg-emerald-500/20 rounded-full" />
                  <div className="h-2 w-16 bg-emerald-500/10 rounded-full" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="glass p-6 rounded-[2rem] border-2 border-amber-500/20 shadow-xl space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <Terminal size={24} />
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-32 bg-amber-500/20 rounded-full" />
                  <div className="h-2 w-20 bg-amber-500/10 rounded-full" />
                </div>
              </div>
              <div className="glass p-8 rounded-[2.5rem] border-2 border-blue-500/30 shadow-2xl bg-blue-500/5 backdrop-blur-3xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white font-black">2</div>
                  <div className="font-black text-app-fg tracking-tight">Level Reached</div>
                </div>
                <div className="space-y-3">
                  <div className="h-3 w-full bg-app-fg/10 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-blue-500 rounded-full" />
                  </div>
                  <div className="flex justify-between text-xs font-black text-app-fg-muted">
                    <span>325 XP</span>
                    <span>500 XP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating abstract shapes */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/20 rounded-3xl blur-2xl"
          />
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-10 left-10 w-32 h-32 bg-cyan-400/20 rounded-full blur-2xl"
          />
        </motion.div>
      </main>

      {/* Social Proof Section */}
      <section className="bg-panel/50 border-y border-border-subtle py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-around items-center gap-12 text-center">
          <div>
            <div className="text-4xl font-black text-app-fg">100+</div>
            <div className="text-app-fg-muted font-bold uppercase tracking-widest text-xs mt-2">
              {language === 'bn' ? 'কোডিং লেসনস' : 'Coding Lessons'}
            </div>
          </div>
          <div>
            <div className="text-4xl font-black text-app-fg">5+</div>
            <div className="text-app-fg-muted font-bold uppercase tracking-widest text-xs mt-2">
              {language === 'bn' ? 'গল্পের মতো ইউনিট' : 'Story-driven Units'}
            </div>
          </div>
          <div>
            <div className="text-4xl font-black text-app-fg">∞</div>
            <div className="text-app-fg-muted font-bold uppercase tracking-widest text-xs mt-2">
              {language === 'bn' ? 'আনলিমিটেড প্র্যাকটিস' : 'Unlimited Practice'}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
