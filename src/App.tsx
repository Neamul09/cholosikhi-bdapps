import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Code2,
  BrainCircuit,
  ArrowRight,
  Globe,
  ChevronRight,
  Sparkles,
  Target,
  CheckCircle2,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { clsx } from 'clsx';
import { play, unlockAudio } from './lib/audio';
import LegalModal from './components/LegalModal';
import { Analytics } from '@vercel/analytics/react';
import { initTelemetry, trackEvent } from './lib/telemetry';
import AdminDashboard from './pages/AdminDashboard';
import SatApp from './sat/SatApp';
import PyApp from './py/PyApp';
import Auth from './py/pages/Auth';

const FacebookIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const LinkedinIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

const CSLogo = ({ className = "h-10 w-auto" }: { className?: string }) => (
  <img
    src="/wordmark.png"
    alt="CholoSikhi"
    className={clsx("drop-shadow-lg", className)}
    width={160}
    height={40}
  />
);

function MainLandingPage() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'en' | 'bn'>('bn');
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  const content = {
    en: {
      tagline: 'CholoSikhi · Empowering modern scholars & coders across Bangladesh',
      navEcosystem: 'Ecosystem',
      navFeatures: 'Features',
      navCommunity: 'Community',
      navLaunch: 'Launch SAT Suite',
      navAuth: 'Sign In / Register',
      verticals: 'Our Platforms',
      ecosystemTitle: 'CHOLOSIKHI ECOSYSTEM',
      platformEnter: 'Explore Platform',
      platformComing: 'Coming Soon',
      bdappsBanner: 'Powered by bdapps Direct Carrier Billing · ৳2.78/day (Robi & Airtel subscribers)',
      footerDesc: 'Building high-impact gamified learning products for the next generation. From acing the Digital SAT to mastering Python, C++, and AI.',
      copyright: '© 2026 CholoSikhi Ecosystem. All rights reserved.',
      madeIn: 'Made with ❤️ in Bangladesh for the world'
    },
    bn: {
      tagline: 'চলোশিখি · আধুনিক শিক্ষার্থী ও প্রযুক্তিপ্রেমীদের ডিজিটাল প্ল্যাটফর্ম',
      navEcosystem: 'ইকোসিস্টেম',
      navFeatures: 'ফিচার',
      navCommunity: 'কমিউনিটি',
      navLaunch: 'SAT শুরু করো',
      navAuth: 'লগইন / রেজিস্টার',
      verticals: 'আমাদের বিভাগ',
      ecosystemTitle: 'চলোশিখি ইকোসিস্টেম',
      platformEnter: 'শুরু করো',
      platformComing: 'শীঘ্রই আসছে',
      bdappsBanner: 'bdapps ডিরেক্ট ক্যারিয়ার বিলিং সমর্থিত · মাত্র ৳২.৭৮/দিন (রবি ও এয়ারটেল গ্রাহকদের জন্য)',
      footerDesc: 'পরবর্তী প্রজন্মের জন্য শীর্ষমানের প্রযুক্তি শিক্ষা ও টেস্ট প্রেপ প্ল্যাটফর্ম। ডিজিটাল SAT প্রস্তুতি থেকে শুরু করে পাইথন, সি++ ও এআই।',
      copyright: '© ২০২৬ CholoSikhi ইকোসিস্টেম। সর্বস্বত্ব সংরক্ষিত।',
      madeIn: 'বিশ্বের জন্য বাংলাদেশে ❤️ দিয়ে তৈরি'
    }
  };

  const t = content[language];

  const ecosystems = [
    {
      title: language === 'en' ? 'Digital SAT Suite' : 'ডিজিটাল SAT স্যুট',
      description: language === 'en'
        ? 'Micro-type breakdown of every College Board question, real-time score prediction, built-in Desmos graphing, and Mistake Bank.'
        : 'কলেজবোর্ড প্রশ্নব্যাংকের মাইক্রো-টাইপ বিশ্লেষণ, রিয়েল-টাইম স্কোর প্রেডিকশন এবং ডেসমস (Desmos) গ্রাফিং ক্যালকুলেটর।',
      icon: <Target className="text-cyan-400" size={32} />,
      link: '/sat',
      tag: 'NEW & LIVE',
      features: language === 'en'
        ? ['Micro-Type Matrix', 'Desmos Graphing', 'Bluebook Style Exam', 'Mistake Bank (SRS)']
        : ['মাইক্রো-টাইপ বিশ্লেষণ', 'ডেসমস ক্যালকুলেটর', 'ব্লুবুক স্টাইল টেস্ট', 'মিসটেক ব্যাংক']
    },
    {
      title: language === 'en' ? 'Python & C++ Academy' : 'পাইথন ও সি++ একাডেমি',
      description: language === 'en'
        ? 'Master Python and C++ with game-like lessons, visual playgrounds, in-browser execution, and Nini AI Tutor.'
        : 'গেমের মতো লেসন, ব্রাউজারে কোড রান, লিডারবোর্ড এবং নিনি এআই টিউটরের সাথে প্রোগ্রামিং শেখা।',
      icon: <Code2 className="text-blue-400" size={32} />,
      link: '/py',
      tag: 'LIVE',
      features: language === 'en'
        ? ['In-Browser WebAssembly Engine', 'Nini AI Tutor', 'Gamified Streaks & Leagues', 'Verified Certificates']
        : ['ব্রাউজারে কোড এক্সিকিউশন', 'নিনি এআই টিউটর', 'গ্যামিফাইড স্ট্রিক ও লিগ', 'ভেরিফায়েড সার্টিফিকেট']
    },
    {
      title: language === 'en' ? 'Nini AI 24/7 Co-Pilot' : 'নিনি এআই ২৪/৭ কো-পাইলট',
      description: language === 'en'
        ? 'Real-time contextual pedagogical mentoring, error diagnosis, syntax hints, and conversational test prep support in English & Bengali.'
        : 'রিয়েল-টাইম এআই মেন্টরিং, কোড এরর ডায়াগনসিস, সিনট্যাক্স হিন্টস এবং বাংলা ও ইংরেজিতে সার্বক্ষণিক টেস্ট প্রেপ গাইডেন্স।',
      icon: <BrainCircuit className="text-purple-400" size={32} />,
      link: '/py/ai-tutor',
      tag: 'LIVE',
      features: language === 'en'
        ? ['Bengali & English Support', 'Smart Error Diagnosis', 'Socratic Guidance', 'Direct Code Execution']
        : ['বাংলা ও ইংরেজি সমর্থন', 'স্মার্ট এরর ডায়াগনসিস', 'সক্রেটিক গাইডেন্স', 'সরাসরি কোড টেস্ট']
    },
    {
      title: language === 'en' ? 'AI Horizon' : 'এআই হরাইজন',
      description: language === 'en'
        ? 'Hands-on projects with PyTorch, Computer Vision, and generative AI agents from scratch.'
        : 'PyTorch, কম্পিউটার ভিশন এবং জেনারেটিভ এআই সিস্টেম নিয়ে হাতেকলমে কাজ করো।',
      icon: <BrainCircuit className="text-violet-400" size={32} />,
      link: '#',
      tag: language === 'en' ? 'PLANNED' : 'পরিকল্পিত',
      features: language === 'en'
        ? ['ML Foundations', 'Computer Vision', 'LLM Agents']
        : ['এমএল বেসিক', 'কম্পিউটার ভিশন', 'এআই এজেন্ট']
    }
  ];

  const handleContact = () => {
    const subject = encodeURIComponent("Inquiry about CholoSikhi");
    const body = encodeURIComponent("Hello CholoSikhi Team,\n\nI am interested in learning more about your products.\n\nRegards,");
    window.location.href = `mailto:contact@cholosikhi.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-app-bg text-app-fg overflow-x-hidden selection:bg-blue-500/30 font-['Hind_Siliguri',_sans-serif]">
      {/* Background Ambient Glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[140px] rounded-full animate-pulse opacity-50" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-violet-600/10 blur-[140px] rounded-full animate-pulse opacity-50" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03)_0%,transparent_70%)]" />
      </div>

      {/* Top bdapps Micro-billing ticker */}
      <div className="w-full bg-blue-950/60 border-b border-blue-500/20 py-2 px-4 text-center text-xs font-bold text-blue-300 flex items-center justify-center gap-2">
        <Smartphone size={14} className="text-cyan-400" />
        <span>{t.bdappsBanner}</span>
        <span className="hidden sm:inline px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-400 text-[10px] font-black uppercase">
          bdapps DCB
        </span>
      </div>

      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center relative z-50">
        <div className="flex items-center gap-3">
          <CSLogo className="h-11 w-auto" />
        </div>

        <div className="hidden lg:flex items-center gap-8 text-xs font-black uppercase tracking-widest text-app-fg/60">
          <Link to="/sat" onClick={() => play('tap')} className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5">
            <span>SAT Suite</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-cyan-400/20 text-cyan-400">LIVE</span>
          </Link>
          <Link to="/py" onClick={() => play('tap')} className="hover:text-blue-400 transition-colors">Python & C++ (/py)</Link>
          <a href="#ecosystem" onClick={() => play('tap')} className="hover:text-blue-400 transition-colors">{t.navEcosystem}</a>
          <a href="#community" onClick={() => play('tap')} className="hover:text-blue-400 transition-colors">{t.navCommunity}</a>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { setLanguage(language === 'bn' ? 'en' : 'bn'); play('toggle'); }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-panel border border-border-subtle hover:bg-white/10 transition-all text-app-fg"
              aria-label="Toggle language"
            >
              <Globe size={14} />
              <span className="font-black text-[10px]">{language === 'en' ? 'BN' : 'EN'}</span>
            </button>
          </div>

          <Link
            to="/auth"
            onClick={() => play('tap')}
            className="btn-duo btn-duo-secondary px-4 py-2 text-xs"
          >
            <span>{t.navAuth}</span>
          </Link>

          <Link
            to="/sat"
            onClick={() => play('tap')}
            className="btn-duo btn-duo-green px-6 py-2.5 text-xs flex items-center gap-2"
          >
            <Target size={15} />
            <span>{t.navLaunch}</span>
          </Link>
        </div>

        {/* Mobile Navbar Controls */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => { setLanguage(language === 'bn' ? 'en' : 'bn'); play('toggle'); }}
            className="p-2 rounded-xl bg-panel border border-border-subtle text-app-fg text-xs font-black"
            aria-label="Toggle language"
          >
            {language === 'en' ? 'BN' : 'EN'}
          </button>
          <Link
            to="/auth"
            onClick={() => play('tap')}
            className="btn-duo btn-duo-green px-3.5 py-2 text-xs"
          >
            লগইন
          </Link>
        </div>
      </nav>

      {/* ─── Hero Section with Card Style Product Selector ───────── */}
      <header className="max-w-7xl mx-auto px-6 pt-10 pb-20 relative">
        {/* Top Tagline & Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center space-y-4 max-w-4xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-blue-400 font-black text-[10px] uppercase tracking-[0.2em]">
            <Sparkles size={12} />
            <span>{t.tagline}</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] text-app-fg">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-500">
              {language === 'en' ? 'Choose your track.' : 'তোমার ট্র্যাক বেছে নাও।'}
            </span>
          </h1>

          <p className="text-base md:text-xl text-app-fg/70 font-semibold max-w-2xl mx-auto leading-relaxed">
            {language === 'en'
              ? 'Jump directly into our specialized learning platforms or activate your bdapps All-Access Pass for unlimited access to both suites.'
              : 'সরাসরি আমাদের বিশেষায়িত প্ল্যাটফর্মে যুক্ত হও অথবা bdapps অল-অ্যাক্সেস পাস সক্রিয় করে দুটি প্ল্যাটফর্মের সম্পূর্ণ সুবিধা উপভোগ করো।'}
          </p>
        </motion.div>

        {/* ─── bdapps All-Access Pass Spotlight Ribbon (Above 2 Products) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-12 rounded-[2.5rem] p-6 sm:p-8 md:p-10 bg-panel/90 border-2 border-emerald-500/40 hover:border-emerald-400 shadow-2xl relative overflow-hidden backdrop-blur-xl transition-all duration-300 group"
        >
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2.5rem]">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl animate-card-aurora" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-teal-600/15 blur-3xl animate-card-aurora-slow" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-400/15 border border-emerald-400/40 text-emerald-400 font-black text-[11px] uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {language === 'en' ? 'DIRECT CARRIER BILLING (DCB)' : 'রবি ও এয়ারটেল ডিরেক্ট ক্যারিয়ার বিলিং'}
                </span>
                <span className="px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 font-bold text-xs">
                  {language === 'en' ? 'Powered by bdapps' : 'bdapps সমর্থিত'}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-app-fg/70 font-bold text-xs">
                  {language === 'en' ? 'No Credit Card Needed' : 'কোনো ক্রেডিট কার্ড ছাড়াই'}
                </span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-app-fg tracking-tight">
                  {language === 'en' ? 'bdapps All-Access Pass' : 'bdapps অল-অ্যাক্সেস পাস'}
                  <span className="text-emerald-400 ml-2">৳2.78 {language === 'en' ? '/ day' : '/ দিন'}</span>
                </h2>
                <p className="text-sm sm:text-base text-app-fg/75 font-medium mt-2 leading-relaxed">
                  {language === 'en'
                    ? 'A single micro-subscription via Robi & Airtel mobile balance unlocks unlimited access to both our Digital SAT Suite and Python & C++ Academy with 24/7 Nini AI.'
                    : 'রবি ও এয়ারটেল মোবাইল ব্যালেন্স থেকে মাত্র ৳২.৭৮/দিন (+ভ্যাট/এসডি/এসসি) চার্জে ডিজিটাল SAT স্যুট এবং পাইথন ও সি++ একাডেমি—দুটি প্ল্যাটফর্মেরই পূর্ণ অ্যাক্সেস ও ২৪/৭ নিনি এআই মেন্টরিং।'}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                {[
                  { icon: <Smartphone size={14} className="text-emerald-400" />, text: language === 'en' ? 'Robi & Airtel Airtime' : 'রবি ও এয়ারটেল ব্যালেন্স' },
                  { icon: <ShieldCheck size={14} className="text-emerald-400" />, text: language === 'en' ? 'Instant OTP Login' : 'ইনস্ট্যান্ট OTP লগইন' },
                  { icon: <Target size={14} className="text-cyan-400" />, text: language === 'en' ? 'Dual-Track Access' : 'SAT + কোডিং অ্যাক্সেস' },
                  { icon: <BrainCircuit size={14} className="text-purple-400" />, text: language === 'en' ? '24/7 Nini AI Tutor' : '২৪/৭ নিনি এআই টিউটর' }
                ].map((pill, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-app-fg/85">
                    {pill.icon}
                    <span className="truncate">{pill.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-auto shrink-0 flex flex-col items-center lg:items-end gap-3 text-center lg:text-right">
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">
                  ৳২.৭৮ <span className="text-xs text-app-fg/60 font-bold uppercase">{language === 'en' ? '/ day (+tax)' : '/ দিন (+ভ্যাট)'}</span>
                </div>
                <p className="text-[11px] font-bold text-app-fg/50">
                  {language === 'en' ? 'Robi & Airtel DCB · Cancel anytime' : 'রবি ও এয়ারটেল গ্রাহকদের জন্য · যেকোনো সময় বাতিলযোগ্য'}
                </p>
              </div>

              <button
                onClick={() => {
                  play('correct');
                  trackEvent('cta_click', { cta: 'hero_bdapps_pass_banner' });
                  navigate('/auth');
                }}
                className="w-full sm:w-auto btn-duo btn-duo-green py-4 px-8 text-sm flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] transition-all"
              >
                <ShieldCheck size={18} />
                <span>{language === 'en' ? 'Get All-Access Pass' : 'অল-অ্যাক্সেস পাস নাও / লগইন'}</span>
                <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* ─── 2 Flagship Product Cards Grid ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: Digital SAT Suite (Flagship) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group relative rounded-[2.5rem] p-8 md:p-9 bg-panel border-2 border-cyan-500/40 hover:border-cyan-400 shadow-2xl hover:shadow-[0_0_40px_rgba(6,182,212,0.2)] transition-all duration-500 flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2.5rem]">
              <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-cyan-500/20 blur-3xl animate-card-aurora" />
              <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-blue-600/15 blur-3xl animate-card-aurora-slow" />
            </div>

            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 font-black text-[11px] uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  LIVE • DIGITAL SAT
                </span>
                <img
                  src="/mascot/nini-right.png"
                  alt="Nini Scholar"
                  className="w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              <div>
                <h3 className="text-2xl md:text-3xl font-black text-app-fg tracking-tight">
                  {language === 'en' ? 'Digital SAT Suite' : 'ডিজিটাল SAT স্যুট'}
                </h3>
                <p className="text-xs font-black uppercase tracking-wider text-cyan-400 mt-1">
                  {language === 'en' ? 'CollegeBoard Bluebook Benchmark' : 'কলেজবোর্ড ব্লুবুক মানদণ্ড'}
                </p>
                <p className="text-sm text-app-fg/70 font-medium mt-3 leading-relaxed">
                  {language === 'en'
                    ? '4,000+ question bank classified by micro-type. Built-in official Desmos calculator, strict IRT score prediction, and Spaced Repetition Mistake Bank.'
                    : '৪,০০০+ প্রশ্নের মাইক্রো-টাইপ বিশ্লেষণ, অফিশিয়াল Desmos গ্রাফিং ক্যালকুলেটর, স্পেসড রিপিটেশন মিসটেক ব্যাংক ও নির্ভুল স্কোর প্রেডিকশন।'}
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                {[
                  language === 'en' ? '4,000+ Micro-Type Questions' : '৪,০০০+ প্রশ্নের মাইক্রো-টাইপ বিশ্লেষণ',
                  language === 'en' ? 'Official Desmos Graphing Calculator' : 'বিল্ট-ইন অফিসিয়াল Desmos ক্যালকুলেটর',
                  language === 'en' ? '500+ Essential Vocab 3D Flip Vault' : '৫০০+ ভোকাবুলারি 3D ফ্লিপ কার্ড',
                  language === 'en' ? 'Mistake Bank & Strict IRT Predictor' : 'মিসটেক ব্যাংক ও নির্ভুল স্কোর প্রেডিকশন'
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs font-bold text-app-fg/80">
                    <CheckCircle2 size={15} className="text-cyan-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 pt-8">
              <button
                onClick={() => {
                  play('correct');
                  trackEvent('cta_click', { cta: 'hero_card_sat' });
                  navigate('/sat');
                }}
                className="w-full btn-duo btn-duo-green py-4 px-6 text-sm flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
              >
                <span>{language === 'en' ? 'Launch SAT Suite (/sat)' : 'SAT স্যুট শুরু করো (/sat)'}</span>
                <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          </motion.div>

          {/* Card 2: Python & C++ Academy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="group relative rounded-[2.5rem] p-8 md:p-9 bg-panel border border-border-subtle hover:border-blue-500/60 shadow-xl hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] transition-all duration-500 flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2.5rem]">
              <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl animate-card-aurora" />
              <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-violet-600/15 blur-3xl animate-card-aurora-slow" />
            </div>

            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-black text-[11px] uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  LIVE • 100+ LESSONS
                </span>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform duration-300">
                  <Code2 size={24} />
                </div>
              </div>

              <div>
                <h3 className="text-2xl md:text-3xl font-black text-app-fg tracking-tight">
                  {language === 'en' ? 'Python & C++ Academy' : 'পাইথন ও সি++ একাডেমি'}
                </h3>
                <p className="text-xs font-black uppercase tracking-wider text-blue-400 mt-1">
                  {language === 'en' ? 'Interactive In-Browser Code Engine' : 'ব্রাউজারে সরাসরি কোডিং ও এআই টিউটরিং'}
                </p>
                <p className="text-sm text-app-fg/70 font-medium mt-3 leading-relaxed">
                  {language === 'en'
                    ? 'Master coding from zero to competitive programming. Duolingo-style bite-sized lessons, in-browser Pyodide execution, streaks, and Nini AI Tutor.'
                    : 'গেমের মতো লেসন, ব্রাউজারে ইনস্টলেশন ছাড়া কোড রান, ধারাবাহিক স্ট্রিক, লিডারবোর্ড ও নিনি এআই টিউটরের সাহায্য।'}
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                {[
                  language === 'en' ? 'Pyodide Sandboxed In-Browser Execution' : 'কোনো ইনস্টলেশন ছাড়াই ব্রাউজারে কোডিং',
                  language === 'en' ? 'Nini AI Tutor & Smart Code Review' : 'নিনি এআই টিউটর ও স্মার্ট কোড রিভিউ',
                  language === 'en' ? 'Bilingual Bangla & English Curriculum' : 'বাংলা ও ইংরেজিতে সহজবোধ্য লেসন',
                  language === 'en' ? 'Weekly Leagues & Official Certificates' : 'সাপ্তাহিক লিগ ও ভেরিফায়েড সার্টিফিকেট'
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs font-bold text-app-fg/80">
                    <CheckCircle2 size={15} className="text-blue-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 pt-8">
              <button
                onClick={() => {
                  play('correct');
                  trackEvent('cta_click', { cta: 'hero_card_py' });
                  navigate('/py');
                }}
                className="w-full btn-duo btn-duo-blue py-4 px-6 text-sm flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all"
              >
                <span>{language === 'en' ? 'Start Coding (/py)' : 'কোডিং শুরু করো (/py)'}</span>
                <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* ─── Ecosystem Section ────────────────────────────────────── */}
      <section id="ecosystem" className="max-w-7xl mx-auto px-6 py-20 relative">
        <div className="text-center mb-20 space-y-3">
          <div className="text-blue-500 font-black text-xs uppercase tracking-[0.3em]">{t.verticals}</div>
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-app-fg">{t.ecosystemTitle}</h2>
          <div className="h-1.5 w-28 bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {ecosystems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => {
                if (item.link === '/sat') {
                  play('correct');
                  trackEvent('cta_click', { cta: 'ecosystem_card_sat' });
                  navigate('/sat');
                } else if (item.link !== '#') {
                  play('correct');
                  trackEvent('cta_click', { cta: 'ecosystem_card_py' });
                  navigate('/py');
                } else {
                  play('incorrect');
                }
              }}
              className={clsx(
                "glass p-10 md:p-14 rounded-[3.5rem] group hover:border-blue-500/40 transition-all relative overflow-hidden flex flex-col justify-between",
                item.link !== '#' ? "cursor-pointer" : "cursor-default"
              )}
            >
              <div className="space-y-6 relative z-10 text-app-fg">
                <div className="flex justify-between items-center">
                  <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center border-white/10 group-hover:border-blue-500/30 transition-all shadow-xl">
                    {item.icon}
                  </div>
                  <span className={clsx(
                    "text-[10px] font-black px-3.5 py-1.5 rounded-full border tracking-[0.15em]",
                    item.tag.includes('LIVE') ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-white/5 border-white/10 text-app-fg/40"
                  )}>
                    {item.tag}
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-3xl font-black tracking-tight group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-base text-app-fg/60 font-bold leading-relaxed max-w-md">
                    {item.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {item.features.map(f => (
                    <span key={f} className="text-[10px] font-black text-app-fg/40 uppercase tracking-wider border border-border-subtle px-3 py-1 rounded-lg group-hover:text-blue-400 transition-colors">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-8 flex items-center gap-2 text-blue-400 font-black text-xs uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
                <span>{item.tag.includes('LIVE') ? t.platformEnter : t.platformComing}</span>
                <ChevronRight size={16} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Footer ────────────────────────────────────────────────── */}
      <footer className="border-t border-border-subtle bg-panel/50 pt-20 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 text-app-fg">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <CSLogo className="h-10 w-auto" />
              <p className="text-app-fg/50 font-bold max-w-md text-base leading-relaxed">
                {t.footerDesc}
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-xl w-fit">
                <ShieldCheck size={16} />
                <span>bdapps Certified · Robi Axiata Partner</span>
              </div>
              <div className="flex gap-3">
                <a href="https://facebook.com/cholosikhi" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-blue-500/20 transition-all text-app-fg">
                  <FacebookIcon size={18} />
                </a>
                <a href="https://linkedin.com/company/cholosikhi" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-blue-500/20 transition-all text-app-fg">
                  <LinkedinIcon size={18} />
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-black uppercase tracking-[0.2em] text-[10px] text-app-fg/30">Platforms</h4>
              <ul className="space-y-3 font-bold text-app-fg/60 text-xs">
                <li><Link to="/sat" onClick={() => play('tap')} className="text-cyan-400 hover:underline">Digital SAT Suite</Link></li>
                <li><Link to="/py" onClick={() => play('tap')} className="hover:text-blue-400">Python Academy (/py)</Link></li>
                <li><Link to="/py/ai-tutor" onClick={() => play('tap')} className="hover:text-purple-400">Nini AI Tutor</Link></li>
                <li><a href="#ecosystem" onClick={() => play('tap')}>Robotics Lab</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-black uppercase tracking-[0.2em] text-[10px] text-app-fg/30">Legal & Support</h4>
              <ul className="space-y-3 font-bold text-app-fg/60 text-xs">
                <li><button onClick={() => { play('tap'); setLegalModal('privacy'); }} className="hover:text-white">Privacy Policy</button></li>
                <li><button onClick={() => { play('tap'); setLegalModal('terms'); }} className="hover:text-white">Terms of Service</button></li>
                <li><button onClick={() => { play('tap'); handleContact(); }} className="hover:text-white">Contact Team</button></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border-subtle flex flex-col sm:flex-row justify-between items-center gap-4 text-app-fg/30 font-black text-[10px] uppercase tracking-widest">
            <p>{t.copyright}</p>
            <p>{t.madeIn}</p>
          </div>
        </div>
      </footer>

      <LegalModal
        isOpen={legalModal !== null}
        type={legalModal}
        onClose={() => setLegalModal(null)}
        language={language}
      />
      <Analytics />
    </div>
  );
}

function RedirectToPy({ prefix }: { prefix?: string }) {
  const location = useLocation();
  const targetPath = prefix !== undefined ? `/py${prefix}` : `/py${location.pathname}`;
  return <Navigate to={`${targetPath}${location.search}${location.hash}`} replace />;
}

export default function App() {
  // Global audio unlock
  useEffect(() => {
    const unlock = () => {
      unlockAudio();
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('pointerdown', unlock, { once: true, passive: true });
    window.addEventListener('keydown', unlock, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  useEffect(() => {
    initTelemetry();
  }, []);

  return (
    <Routes>
      <Route path="/admin/*" element={<AdminDashboard />} />
      <Route path="/sat/*" element={<SatApp />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/py/auth" element={<Auth />} />
      <Route path="/py/*" element={<PyApp />} />

      {/* Direct/External link fallbacks for PyApp routes */}
      <Route path="/session/*" element={<RedirectToPy />} />
      <Route path="/certificate/*" element={<RedirectToPy />} />
      <Route path="/certificate" element={<RedirectToPy />} />
      <Route path="/playground" element={<RedirectToPy prefix="/playground" />} />
      <Route path="/leaderboard" element={<RedirectToPy prefix="/leaderboard" />} />
      <Route path="/achievements" element={<RedirectToPy prefix="/achievements" />} />
      <Route path="/discover" element={<RedirectToPy prefix="/discover" />} />
      <Route path="/welcome" element={<RedirectToPy prefix="/welcome" />} />
      <Route path="/learn/*" element={<RedirectToPy prefix="" />} />
      <Route path="/learn" element={<RedirectToPy prefix="" />} />

      <Route path="/" element={<MainLandingPage />} />
      <Route path="*" element={<MainLandingPage />} />
    </Routes>
  );
}
