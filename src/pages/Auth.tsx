import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, User as UserIcon, Zap, Loader2, ArrowRight, AlertCircle,
  CheckCircle2, Sparkles, BookOpen, Trophy
} from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

// Bengali voice: short, conversational, second person — never "আমরা আপনাকে অনুরোধ করছি"
// kind of corporate phrasing. Imagine a friend explaining what's happening.
const t = {
  en: {
    welcomeBack: 'Welcome back',
    welcomeBackSub: "Pick up where you left off — your streak's waiting.",
    createAccount: 'Create your account',
    createAccountSub: "Three minutes in and you'll write your first line.",
    nameLabel: 'What should we call you?',
    namePh: 'Your name',
    emailLabel: 'Email address',
    emailPh: 'you@example.com',
    passwordLabel: 'Password',
    passwordPh: 'At least 8 characters',
    login: 'Log in',
    signup: 'Sign up',
    switching: "Switching…",
    noAccount: "New to CholoSikhi?",
    haveAccount: 'Already learning with us?',
    signupLink: 'Sign up free',
    loginLink: 'Log in',
    successTitle: 'Check your inbox!',
    successBody: "We sent a verification link to {email}. Click it and you're in — takes ten seconds.",
    successCta: 'Open Gmail / Outlook',
    trust: 'Free forever · No card needed · 100+ lessons in Bangla',
    socialProof: 'Learners coding in Bangla right now',
    // Error mapping (key → friendly message)
    errOver: 'Sign-ups are paused for a sec — try again in a moment.',
    errExisting: 'That email is already registered. Try logging in instead.',
    errInvalidCreds: "Email or password doesn't match. Give it another go.",
    errWeakPw: 'Password should be at least 8 characters.',
    errInvalidEmail: 'That email looks off. Double-check it?',
    errRateLimit: 'Too many tries — wait a moment, then try again.',
    errVerifyNeeded: 'Verify your email first — check the inbox for the link.',
    errNetwork: 'No connection. Check your Wi-Fi and retry.',
    errServer: 'Something on our end broke. Try again shortly.',
    errMisconfig: "Server isn't set up yet. Tell the admin if this keeps showing.",
    errGeneric: 'Something went sideways. Try again?',
    // Field-level hints
    pwHint: '8+ characters, mix of letters and numbers works best.',
  },
  bn: {
    welcomeBack: 'আবার স্বাগতম',
    welcomeBackSub: 'যেখানে থামছিলেন, সেখান থেকে শুরু করুন — স্ট্রিকটা অপেক্ষা করছে।',
    createAccount: 'নতুন অ্যাকাউন্ট',
    createAccountSub: 'তিন মিনিটে প্রথম লাইন কোড লিখে ফেলবেন — গ্যারান্টি দিচ্ছি।',
    nameLabel: 'আপনাকে কী নামে ডাকব?',
    namePh: 'আপনার নাম',
    emailLabel: 'ইমেইল',
    emailPh: 'you@example.com',
    passwordLabel: 'পাসওয়ার্ড',
    passwordPh: 'কমপক্ষে ৮ অক্ষর',
    login: 'লগইন',
    signup: 'সাইন আপ',
    switching: 'যাচ্ছে…',
    noAccount: 'CholoSikhi-তে নতুন?',
    haveAccount: 'আগে থেকেই শিখছেন?',
    signupLink: 'ফ্রি সাইন আপ',
    loginLink: 'লগইন',
    successTitle: 'ইনবক্স দেখুন!',
    successBody: '{email}-এ একটা ভেরিফাই লিঙ্ক পাঠিয়েছি — ক্লিক করলেই ঢুকে যাবেন। দশ সেকেন্ডের কাজ।',
    successCta: 'Gmail / Outlook খুলুন',
    trust: 'চিরকাল ফ্রি · কার্ড লাগে না · ১০০+ বাংলা লেসন',
    socialProof: 'এই মুহূর্তে বাংলায় কোড করছেন',
    errOver: 'সাইন আপ এখন একটু বন্ধ — একটু পর আবার চেষ্টা করুন।',
    errExisting: 'এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট আছে। লগইন করে দেখুন।',
    errInvalidCreds: 'ইমেইল বা পাসওয়ার্ড মেলেনি। আবার চেষ্টা করুন।',
    errWeakPw: 'পাসওয়ার্ডে কমপক্ষে ৮ অক্ষর দিন।',
    errInvalidEmail: 'ইমেইলটা একটু অদ্ভুত লাগছে — আরেকবার দেখবেন?',
    errRateLimit: 'অনেক চেষ্টা হয়ে গেছে — একটু পর আবার ট্রাই করুন।',
    errVerifyNeeded: 'আগে ইমেইল ভেরিফাই করুন — ইনবক্সে লিঙ্ক পাঠিয়েছি।',
    errNetwork: 'ইন্টারনেট নেই মনে হচ্ছে। Wi-Fi চেক করে আবার চেষ্টা করুন।',
    errServer: 'আমাদের দিকে কিছু একটা ভেঙেছে। একটু পর আবার ট্রাই করুন।',
    errMisconfig: 'সার্ভার এখনো রেডি না। বারবার আসলে অ্যাডমিনকে জানান।',
    errGeneric: 'কিছু একটা হলো। আবার চেষ্টা করবেন?',
    pwHint: '৮+ অক্ষর, অক্ষর আর সংখ্যা মিলিয়ে দিলেই সবচেয়ে ভালো।',
  },
};

interface SupabaseErrorShape {
  code?: string;
  status?: number;
  message?: string;
}

function mapAuthError(err: SupabaseErrorShape | null | undefined, isLogin: boolean, lang: 'en' | 'bn'): string {
  const tr = t[lang];
  if (!err) return tr.errGeneric;
  const code = err.code || '';
  const status = err.status || 0;
  const msg = (err.message || '').toLowerCase();

  // Network failures first — same in both flows
  if (/failed to fetch|networkerror|load failed|fetch failed/i.test(msg)) {
    return tr.errNetwork;
  }

  // Sign-up specific codes
  if (!isLogin) {
    if (code === 'user_already_exists' || /already registered|already been registered/i.test(msg)) return tr.errExisting;
    if (code === 'over_email_send_rate_limit' || status === 429) return tr.errOver;
    if (code === 'weak_password' || /password.*should be at least|password.*characters/i.test(msg)) return tr.errWeakPw;
    if (code === 'email_address_invalid' || /invalid email/i.test(msg)) return tr.errInvalidEmail;
  }

  // Sign-in specific
  if (isLogin) {
    if (code === 'invalid_credentials' || /invalid login credentials|invalid grant/i.test(msg)) return tr.errInvalidCreds;
    if (code === 'email_not_confirmed' || /email not confirmed/i.test(msg)) return tr.errVerifyNeeded;
    if (status === 429) return tr.errRateLimit;
  }

  if (status >= 500) return tr.errServer;

  return tr.errGeneric;
}

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const { language } = useSettingsStore();
  const navigate = useNavigate();

  const errorRef = useRef<HTMLDivElement>(null);
  const tr = t[language];

  useEffect(() => {
    // Pick up errors bounced back via email-confirmation link (e.g. expired links)
    const hash = window.location.hash;
    if (hash && hash.includes('error=')) {
      const params = new URLSearchParams(hash.replace('#', ''));
      const errorMsg = params.get('error_description');
      if (errorMsg) setError(errorMsg.replace(/\+/g, ' '));
    }
  }, []);

  // Move keyboard focus to the error banner when an error appears — a11y win.
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.focus();
    }
  }, [error]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');

    if (!isSupabaseConfigured) {
      setError(tr.errMisconfig);
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { error: signInErr } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInErr) {
          setError(mapAuthError(signInErr, true, language));
          return;
        }
        navigate('/');
      } else {
        const { error: signUpErr } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (signUpErr) {
          setError(mapAuthError(signUpErr, false, language));
          return;
        }
        setShowSuccess(true);
      }
    } catch (err) {
      // Safety net for anything not shaped like a Supabase error.
      setError(mapAuthError(
        err instanceof Error ? { message: err.message } : null,
        isLogin,
        language,
      ));
      console.error('[auth] unhandled:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-app-bg px-4 relative overflow-hidden py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-panel rounded-[2.5rem] p-8 border-2 border-[var(--border-subtle)] shadow-2xl relative z-10"
      >
        {showSuccess ? (
          <div className="text-center py-4">
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto mb-6 shadow-lg shadow-emerald-500/20">
              <Mail size={40} strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-black mb-3">{tr.successTitle}</h2>
            <p className="text-[var(--app-fg-muted)] font-bold mb-8 leading-relaxed">
              {tr.successBody.split('{email}').map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <strong className="text-app-fg break-all">{email}</strong>
                  )}
                </span>
              ))}
            </p>
            <a
              href={email.includes('@gmail') ? 'https://mail.google.com' : email.includes('@yahoo') ? 'https://mail.yahoo.com' : 'mailto:' + email}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-500 text-white font-black hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-blue-500/20"
            >
              {tr.successCta}
              <ArrowRight size={18} />
            </a>
            <button
              onClick={() => { setShowSuccess(false); setIsLogin(true); }}
              className="block mx-auto mt-4 text-sm font-bold text-[var(--app-fg-muted)] hover:text-app-fg transition-colors"
            >
              {tr.loginLink} →
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4">
                <Zap size={32} className="text-white" strokeWidth={2.5} />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-center">
                {isLogin ? tr.welcomeBack : tr.createAccount}
              </h1>
              <p className="text-[var(--app-fg-muted)] font-bold text-center mt-2 max-w-xs">
                {isLogin ? tr.welcomeBackSub : tr.createAccountSub}
              </p>
            </div>

            {/* Trust strip — addresses the "too generic" complaint */}
            <div className="flex items-center justify-center gap-4 mb-6 px-2 text-[10px] font-black uppercase tracking-widest text-[var(--app-fg-muted)]">
              <span className="inline-flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-400" />{language === 'bn' ? 'ফ্রি' : 'FREE'}</span>
              <span className="opacity-30">·</span>
              <span className="inline-flex items-center gap-1"><BookOpen size={12} className="text-blue-400" />{language === 'bn' ? 'বাংলা' : 'BN'}</span>
              <span className="opacity-30">·</span>
              <span className="inline-flex items-center gap-1"><Trophy size={12} className="text-amber-400" />{language === 'bn' ? 'গেমিফাইড' : 'GAMIFIED'}</span>
            </div>

            {error && (
              <div
                ref={errorRef}
                tabIndex={-1}
                role="alert"
                className="mb-6 p-4 bg-pink-500/10 border-l-4 border-pink-500 text-pink-500 font-bold rounded-r-xl text-sm flex items-start gap-3 focus:outline-none focus:ring-2 focus:ring-pink-500/40"
              >
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4" noValidate>
              <AnimatePresence mode="popLayout">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <label htmlFor="auth-name" className="sr-only">{tr.nameLabel}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[var(--app-fg-muted)]">
                        <UserIcon size={20} aria-hidden="true" />
                      </div>
                      <input
                        id="auth-name"
                        type="text"
                        autoComplete="name"
                        required={!isLogin}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={tr.namePh}
                        className="w-full bg-[var(--app-bg)] border-2 border-[var(--border-subtle)] focus:border-blue-500 rounded-2xl py-3 pl-12 pr-4 font-bold outline-none transition-all placeholder:text-[var(--app-fg-muted)]/50"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label htmlFor="auth-email" className="sr-only">{tr.emailLabel}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[var(--app-fg-muted)]">
                    <Mail size={20} aria-hidden="true" />
                  </div>
                  <input
                    id="auth-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={tr.emailPh}
                    className="w-full bg-[var(--app-bg)] border-2 border-[var(--border-subtle)] focus:border-blue-500 rounded-2xl py-3 pl-12 pr-4 font-bold outline-none transition-all placeholder:text-[var(--app-fg-muted)]/50"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="auth-password" className="sr-only">{tr.passwordLabel}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[var(--app-fg-muted)]">
                    <Lock size={20} aria-hidden="true" />
                  </div>
                  <input
                    id="auth-password"
                    type="password"
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={tr.passwordPh}
                    aria-describedby="pw-hint"
                    className="w-full bg-[var(--app-bg)] border-2 border-[var(--border-subtle)] focus:border-blue-500 rounded-2xl py-3 pl-12 pr-4 font-bold outline-none transition-all placeholder:text-[var(--app-fg-muted)]/50"
                  />
                </div>
                {!isLogin && (
                  <p
                    id="pw-hint"
                    className="mt-2 ml-2 text-xs text-[var(--app-fg-muted)] font-bold"
                  >
                    {tr.pwHint}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-duo btn-duo-blue py-3.5 mt-2 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>{tr.switching}</span>
                  </>
                ) : (
                  <>
                    {isLogin ? tr.login : tr.signup}
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-[var(--app-fg-muted)] font-bold">
              {isLogin ? tr.noAccount : tr.haveAccount}{' '}
              <button
                type="button"
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="text-blue-500 hover:text-blue-600 transition-colors cursor-pointer font-black"
              >
                {isLogin ? tr.signupLink : tr.loginLink}
              </button>
            </p>

            {/* Bottom trust line — separates from generic auth pages */}
            <p className="mt-6 pt-6 border-t border-[var(--border-subtle)] text-center text-[10px] font-bold text-[var(--app-fg-muted)] uppercase tracking-widest">
              <Sparkles size={10} className="inline mr-1 text-amber-400" />
              {tr.trust}
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
