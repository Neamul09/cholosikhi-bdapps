import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, User as UserIcon, Zap, Loader2, ArrowRight, AlertCircle,
  CheckCircle2, Sparkles, BookOpen, Trophy, Eye, EyeOff
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
    trust: 'Free forever · No card needed · 100+ lessons in Bangla',
    socialProof: 'Learners coding in Bangla right now',
    // Error mapping (key → friendly message)
    errOver: 'Sign-ups are paused for a sec — try again in a moment.',
    errOverEmail: 'Too many sign-up emails sent. Wait a minute, then try again.',
    errExisting: 'That email is already registered. Try logging in instead.',
    errMaybeExisting: 'If that email is new, check your inbox. If you already have an account, switch to login below.',
    switchToLoginCta: 'Switch to login →',
    errInvalidCreds: "Email or password doesn't match. Give it another go.",
    errWeakPw: 'Password should be at least 8 characters.',
    errInvalidEmail: 'That email looks off. Double-check it?',
    errRateLimit: 'Too many tries — wait a moment, then try again.',
    errVerifyNeeded: 'Verify your email first — check the inbox for the link.',
    errNetwork: 'No connection. Check your Wi-Fi and retry.',
    errBackend: "Can't reach our servers right now. Try again in a moment.",
    errServer: 'Something on our end broke. Try again shortly.',
    errMisconfig: "Server isn't set up yet. Tell the admin if this keeps showing.",
    errGeneric: 'Something went sideways. Try again?',
    // Submit-state hints
    slowSubmit: 'Still working… hang tight.',
    // Field-level hints
    pwHint: '8+ characters, mix of letters and numbers works best.',
    // Confirm password
    confirmPwLabel: 'Confirm password',
    confirmPwPh: 'Type it again',
    errPwMismatch: "Passwords don't match.",
    // Password strength
    pwWeak: 'Weak',
    pwFair: 'Fair',
    pwGood: 'Good',
    pwStrong: 'Strong',
    pwStrengthHint: 'Mix in a number or symbol to make it stronger.',
    // Email field hint
    errEmailShape: 'That email looks off — double-check it?',
    // Show / hide password
    showPw: 'Show password',
    hidePw: 'Hide password',
    // Sign-in footer note (verification is off, but flag the auto-login behavior)
    autoLoginNote: 'You\'ll be logged in right away — no email check needed.',
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
    trust: 'চিরকাল ফ্রি · কার্ড লাগে না · ১০০+ বাংলা লেসন',
    socialProof: 'এই মুহূর্তে বাংলায় কোড করছেন',
    errOver: 'সাইন আপ এখন একটু বন্ধ — একটু পর আবার চেষ্টা করুন।',
    errOverEmail: 'অনেক সাইন আপ ইমেইল পাঠানো হয়ে গেছে। এক মিনিট অপেক্ষা করে আবার চেষ্টা করুন।',
    errExisting: 'এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট আছে। লগইন করে দেখুন।',
    errMaybeExisting: 'ইমেইল নতুন হলে ইনবক্স দেখুন। আগে থেকে অ্যাকাউন্ট থাকলে নিচে লগইন-এ যান।',
    switchToLoginCta: 'লগইনে যান →',
    errInvalidCreds: 'ইমেইল বা পাসওয়ার্ড মেলেনি। আবার চেষ্টা করুন।',
    errWeakPw: 'পাসওয়ার্ডে কমপক্ষে ৮ অক্ষর দিন।',
    errInvalidEmail: 'ইমেইলটা একটু অদ্ভুত লাগছে — আরেকবার দেখবেন?',
    errRateLimit: 'অনেক চেষ্টা হয়ে গেছে — একটু পর আবার ট্রাই করুন।',
    errVerifyNeeded: 'আগে ইমেইল ভেরিফাই করুন — ইনবক্সে লিঙ্ক পাঠিয়েছি।',
    errNetwork: 'ইন্টারনেট নেই মনে হচ্ছে। Wi-Fi চেক করে আবার চেষ্টা করুন।',
    errBackend: 'আমাদের সার্ভারে এখন যাওয়া যাচ্ছে না। একটু পর আবার ট্রাই করুন।',
    errServer: 'আমাদের দিকে কিছু একটা ভেঙেছে। একটু পর আবার চেষ্টা করুন।',
    errMisconfig: 'সার্ভার এখনো রেডি না। বারবার আসলে অ্যাডমিনকে জানান।',
    errGeneric: 'কিছু একটা হলো। আবার চেষ্টা করবেন?',
    slowSubmit: 'একটু সময় লাগছে… অপেক্ষা করুন।',
    pwHint: '৮+ অক্ষর, অক্ষর আর সংখ্যা মিলিয়ে দিলেই সবচেয়ে ভালো।',
    confirmPwLabel: 'পাসওয়ার্ড আবার লিখুন',
    confirmPwPh: 'আগেরটার মতোই লিখুন',
    errPwMismatch: 'পাসওয়ার্ড দুটো মিলছে না।',
    pwWeak: 'দুর্বল',
    pwFair: 'মোটামুটি',
    pwGood: 'ভালো',
    pwStrong: 'শক্তিশালী',
    pwStrengthHint: 'একটা সংখ্যা বা সিম্বল মেশালে আরো ভালো হবে।',
    errEmailShape: 'ইমেইলটা একটু অদ্ভুত লাগছে — আরেকবার দেখবেন?',
    showPw: 'পাসওয়ার্ড দেখান',
    hidePw: 'পাসওয়ার্ড লুকান',
    autoLoginNote: 'এক্ষুনি লগইন হয়ে যাবে — ইমেইল চেক লাগবে না।',
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
  const code = (err.code || '').toLowerCase();
  const status = err.status || 0;
  const msg = (err.message || '').toLowerCase();

  // Network failures — split user-offline from backend-unreachable so we
  // don't tell someone to check their Wi-Fi when our Supabase project is paused.
  if (/failed to fetch|networkerror|load failed|fetch failed|err_name_not_resolved|net::err_/i.test(msg)) {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      return tr.errNetwork; // genuinely offline
    }
    return tr.errBackend; // online, but our backend is unreachable
  }

  // Existing-email check — runs FIRST so a 422 status that carries
  // "user_already_exists" never gets bucketed as a generic 429 / 500.
  // Supabase's auth API has returned this code on status 422, 429, and 400
  // depending on project config and SDK version, so we don't filter by status.
  if (
    code === 'user_already_exists' ||
    code === 'email_exists' ||
    /already registered|already been registered|user already registered|email.*already.*use|account.*already/i.test(msg)
  ) {
    return tr.errExisting;
  }

  // Sign-up specific codes
  if (!isLogin) {
    // Email-send rate limit is a specific, slower bucket — different copy.
    if (
      code === 'over_email_send_rate_limit' ||
      code === 'email_rate_limit_exceeded' ||
      /email.*rate.*limit|email.*send.*rate|too many.*emails|too many signup emails/i.test(msg)
    ) {
      return tr.errOverEmail;
    }
    if (
      code === 'weak_password' ||
      /password.*should be at least|password.*characters|password.*too short|password.*not strong enough/i.test(msg)
    ) {
      return tr.errWeakPw;
    }
    if (
      code === 'email_address_invalid' ||
      code === 'email_invalid' ||
      /invalid email|email.*invalid|email format/i.test(msg)
    ) {
      return tr.errInvalidEmail;
    }
  }

  // Sign-in specific
  if (isLogin) {
    if (
      code === 'invalid_credentials' ||
      /invalid login credentials|invalid grant|invalid email or password/i.test(msg)
    ) {
      return tr.errInvalidCreds;
    }
    if (code === 'email_not_confirmed' || /email not confirmed/i.test(msg)) {
      return tr.errVerifyNeeded;
    }
  }

  // Rate limits — checked AFTER user_already_exists so existing-email errors
  // don't get misclassified as "signups paused".
  if (status === 429 || code === 'over_request_rate_limit' || code === 'rate_limited') {
    return isLogin ? tr.errRateLimit : tr.errOver;
  }

  if (status >= 500) return tr.errServer;

  return tr.errGeneric;
}

/**
 * After a successful signUp, decide which "you did it" panel to show.
 *
 * Supabase deliberately hides the "email already taken" error when
 * email confirmation is required — to prevent account enumeration. Instead
 * it returns a fake success: `data.user` is populated but `user.identities`
 * is an EMPTY array (a real new user always has at least one identity), and
 * `data.session` is null because confirmation is still pending.
 *
 * We can't tell those two states apart with 100% certainty from the client,
 * but the empty-identities signal is good enough for a soft warning that
 * guides the user to the login tab if they already have an account.
 */
function looksLikeExistingEmailSignup(user: { identities?: unknown[] } | null | undefined): boolean {
  if (!user) return false;
  return Array.isArray(user.identities) && user.identities.length === 0;
}

// Lightweight email shape check. We let Supabase be the source of truth
// for whether the address is real; we just want to catch the obvious typos
// (missing @, spaces, no TLD) before we burn an API call.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function isEmailShaped(s: string): boolean {
  return EMAIL_RE.test(s.trim());
}

/**
 * Password strength — 0..4 scale. We deliberately keep this simple and
 * explainable so people aren't confused why a 12-char dictionary word rates
 * higher than a short random one. Buckets:
 *   0 — empty / under 8 chars (invalid; we won't accept it anyway)
 *   1 — meets length only          → "Weak"
 *   2 — + a number OR symbol       → "Fair"
 *   3 — + the other of those       → "Good"
 *   4 — + uppercase + lowercase    → "Strong"
 */
function passwordStrength(pw: string): 0 | 1 | 2 | 3 | 4 {
  if (!pw) return 0;
  if (pw.length < 8) return 1;
  let score = 1;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  return Math.min(4, score) as 0 | 1 | 2 | 3 | 4;
}

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Confirm-password field — only shown on signup. We split state instead
  // of a single combined ref so retyping one doesn't flash the other.
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  // Email verification is OFF (Supabase project config), so a successful
  // signup returns a real session — we navigate straight to '/' and never
  // show the old "check your inbox" panel.
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [error, setError] = useState('');
  // Touched states so we don't yell at the user on every keystroke.
  const [touched, setTouched] = useState<{ email?: boolean; confirm?: boolean }>({});
  const { language } = useSettingsStore();
  const navigate = useNavigate();

  const errorRef = useRef<HTMLDivElement>(null);
  // Debounce: prevent rapid double-submits from triggering Supabase rate
  // limits (or worse, creating duplicate accounts on a brief network blip).
  const lastSubmitAt = useRef<number>(0);
  const tr = t[language];

  // Per-field validation derivations (cheap; on every render).
  const emailLooksValid = isEmailShaped(email);
  const strength = passwordStrength(password);
  const pwIsLongEnough = password.length >= 8;
  const confirmMatches = confirmPassword.length > 0 && confirmPassword === password;
  // Field-level error strings — shown under each field rather than only in the banner.
  const emailFieldError = touched.email && email.length > 0 && !emailLooksValid ? tr.errEmailShape : '';
  const confirmFieldError =
    touched.confirm && confirmPassword.length > 0 && !confirmMatches ? tr.errPwMismatch : '';

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

    // Client-side debounce. Supabase's auth rate limit is generous but not
    // infinite — a double-click on a slow connection can produce two requests
    // in 50ms, which the server then rates and returns 429. Bouncing the
    // second click here gives a friendlier experience and a clear error.
    const now = Date.now();
    if (now - lastSubmitAt.current < 1500) {
      setError(tr.slowSubmit);
      return;
    }
    lastSubmitAt.current = now;

    // Mark all fields as touched so any latent field errors become visible.
    setTouched({ email: true, confirm: true });

    // Local validation — fail fast so we don't waste an API call on obvious
    // typos. The server still validates everything; this is purely UX.
    if (!emailLooksValid) {
      setError(tr.errEmailShape);
      return;
    }
    if (!isLogin) {
      if (!pwIsLongEnough) {
        setError(tr.errWeakPw);
        return;
      }
      if (!confirmMatches) {
        setError(tr.errPwMismatch);
        return;
      }
    }

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
        const { data, error: signUpErr } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (signUpErr) {
          setError(mapAuthError(signUpErr, false, language));
          return;
        }
        // With email confirmation OFF, Supabase returns a real session immediately
        // — OR a real error if the email is taken. We no longer need to handle
        // the "fake success / empty identities" anti-enumeration case, but we
        // keep the check as a defensive net in case the project setting gets
        // toggled back on later.
        if (looksLikeExistingEmailSignup(data?.user)) {
          setError(tr.errMaybeExisting);
          return;
        }
        // Email verification disabled → straight to home.
        navigate('/');
      }
    } catch (err) {
      // Safety net for anything not shaped like a Supabase error.
      setError(mapAuthError(
        err instanceof Error ? { message: err.message } : null,
        isLogin,
        language,
      ));
      if (import.meta.env.DEV) console.error('[auth] unhandled:', err);
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
            className="mb-6 p-4 bg-pink-500/10 border-l-4 border-pink-500 text-pink-500 font-bold rounded-r-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/40"
          >
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span className="flex-1">{error}</span>
            </div>
            {/* Inline CTA for the "this email may already be registered" case:
                gives the user a one-click escape to login instead of leaving
                them stuck staring at the form. */}
            {!isLogin && error === tr.errMaybeExisting && (
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setError('');
                  setConfirmPassword('');
                  setTouched({});
                }}
                className="mt-2 ml-7 text-xs font-black uppercase tracking-wider text-pink-500 hover:text-pink-400 underline underline-offset-2 transition-colors"
              >
                {tr.switchToLoginCta}
              </button>
            )}
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
                inputMode="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                placeholder={tr.emailPh}
                aria-invalid={!!emailFieldError}
                aria-describedby={emailFieldError ? 'auth-email-err' : undefined}
                className={`w-full bg-[var(--app-bg)] border-2 rounded-2xl py-3 pl-12 pr-4 font-bold outline-none transition-all placeholder:text-[var(--app-fg-muted)]/50 ${
                  emailFieldError
                    ? 'border-pink-500 focus:border-pink-500'
                    : 'border-[var(--border-subtle)] focus:border-blue-500'
                }`}
              />
            </div>
            {emailFieldError && (
              <p id="auth-email-err" className="mt-2 ml-2 text-xs text-pink-500 font-bold flex items-center gap-1">
                <AlertCircle size={12} /> {emailFieldError}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="auth-password" className="sr-only">{tr.passwordLabel}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[var(--app-fg-muted)]">
                <Lock size={20} aria-hidden="true" />
              </div>
              <input
                id="auth-password"
                type={showPw ? 'text' : 'password'}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={tr.passwordPh}
                aria-describedby={!isLogin ? 'pw-hint pw-strength-label' : undefined}
                className="w-full bg-[var(--app-bg)] border-2 border-[var(--border-subtle)] focus:border-blue-500 rounded-2xl py-3 pl-12 pr-12 font-bold outline-none transition-all placeholder:text-[var(--app-fg-muted)]/50"
              />
              {/* Show/hide password — keyboard accessible, screen-reader friendly. */}
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? tr.hidePw : tr.showPw}
                aria-pressed={showPw}
                className="absolute inset-y-0 right-3 flex items-center px-2 text-[var(--app-fg-muted)] hover:text-app-fg transition-colors cursor-pointer"
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {!isLogin && password.length > 0 && (
              <div
                id="pw-strength-label"
                aria-live="polite"
                className="mt-2 ml-2"
              >
                {/* Strength meter — 4 segments. Fill = current bucket. */}
                <div className="flex gap-1 mb-1" role="presentation">
                  {[1, 2, 3, 4].map((seg) => (
                    <div
                      key={seg}
                      className={`h-1.5 flex-1 rounded-full transition-all ${
                        strength >= seg
                          ? strength <= 1 ? 'bg-pink-500'
                            : strength === 2 ? 'bg-amber-500'
                            : strength === 3 ? 'bg-blue-500'
                            : 'bg-emerald-500'
                          : 'bg-[var(--border-subtle)]'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[var(--app-fg-muted)]">
                  {strength <= 1 ? tr.pwWeak
                    : strength === 2 ? tr.pwFair
                    : strength === 3 ? tr.pwGood
                    : tr.pwStrong}
                  {strength < 4 && pwIsLongEnough && (
                    <span className="ml-2 opacity-70 normal-case tracking-normal">· {tr.pwStrengthHint}</span>
                  )}
                </p>
              </div>
            )}
            {!isLogin && password.length === 0 && (
              <p
                id="pw-hint"
                className="mt-2 ml-2 text-xs text-[var(--app-fg-muted)] font-bold"
              >
                {tr.pwHint}
              </p>
            )}
          </div>

          <AnimatePresence mode="popLayout">
            {!isLogin && (
              <motion.div
                key="confirm-pw"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div>
                  <label htmlFor="auth-confirm-password" className="sr-only">{tr.confirmPwLabel}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[var(--app-fg-muted)]">
                      <Lock size={20} aria-hidden="true" />
                    </div>
                    <input
                      id="auth-confirm-password"
                      type={showConfirmPw ? 'text' : 'password'}
                      autoComplete="new-password"
                      required={!isLogin}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
                      placeholder={tr.confirmPwPh}
                      aria-invalid={!!confirmFieldError}
                      aria-describedby={confirmFieldError ? 'auth-confirm-pw-err' : undefined}
                      className={`w-full bg-[var(--app-bg)] border-2 rounded-2xl py-3 pl-12 pr-12 font-bold outline-none transition-all placeholder:text-[var(--app-fg-muted)]/50 ${
                        confirmFieldError
                          ? 'border-pink-500 focus:border-pink-500'
                          : confirmMatches
                            ? 'border-emerald-500 focus:border-emerald-500'
                            : 'border-[var(--border-subtle)] focus:border-blue-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPw((v) => !v)}
                      aria-label={showConfirmPw ? tr.hidePw : tr.showPw}
                      aria-pressed={showConfirmPw}
                      className="absolute inset-y-0 right-3 flex items-center px-2 text-[var(--app-fg-muted)] hover:text-app-fg transition-colors cursor-pointer"
                    >
                      {showConfirmPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {confirmFieldError && (
                    <p id="auth-confirm-pw-err" className="mt-2 ml-2 text-xs text-pink-500 font-bold flex items-center gap-1">
                      <AlertCircle size={12} /> {confirmFieldError}
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!isLogin && (
            <p className="text-[11px] text-[var(--app-fg-muted)] font-bold flex items-center gap-1.5 pt-1">
              <Zap size={12} className="text-emerald-400" /> {tr.autoLoginNote}
            </p>
          )}

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
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setConfirmPassword('');
              setTouched({});
              setShowPw(false);
              setShowConfirmPw(false);
            }}
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
      </motion.div>
    </div>
  );
}
