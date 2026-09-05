import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone, KeyRound, User as UserIcon, Loader2, ArrowRight, AlertCircle,
  CheckCircle2, ShieldCheck, ArrowLeft, Lock, AlertTriangle
} from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

type Step = 'MOBILE' | 'SUB_CONFIRM' | 'OTP' | 'REGISTER_PROFILE' | 'LOGIN_PASSWORD';

export default function Auth() {
  const navigate = useNavigate();
  const { language } = useSettingsStore();
  const {
    checkMobileSubscription,
    sendOtp,
    verifyOtp,
    registerAccount,
    loginWithPassword,
    pendingMobile,
  } = useAuthStore();

  const [step, setStep] = useState<Step>('MOBILE');
  const [mobileInput, setMobileInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [subStatus, setSubStatus] = useState<string>('');
  const [isSubActive, setIsSubActive] = useState<boolean>(false);

  const resetError = () => setErrorMsg(null);

  // Step 1: Submit Mobile Number -> Check Subscription Status
  const handleMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetError();

    const cleanMobile = mobileInput.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setErrorMsg(
        language === 'bn'
          ? 'সঠিক রবি বা সার্কেল নম্বর লিখুন (যেমন: 018XXXXXXXX)'
          : 'Please enter a valid Robi/Cirkle mobile number (e.g. 018XXXXXXXX)'
      );
      return;
    }

    setLoading(true);
    try {
      const res = await checkMobileSubscription(mobileInput);
      const status = res.subscriptionStatus || 'UNREGISTERED';
      const active = res.isSubscribed || status === 'REGISTERED';
      const registered = res.isRegistered || status !== 'UNREGISTERED';

      setSubStatus(status);
      setIsSubActive(active);

      if (registered) {
        // Registered or Payment Pending -> Prompt for Password
        setStep('LOGIN_PASSWORD');
      } else {
        // Unregistered -> Ask user if they want to subscribe via OTP
        setStep('SUB_CONFIRM');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to check subscription status.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Confirm Subscription & Send OTP
  const handleConfirmSubscription = async () => {
    resetError();
    setLoading(true);
    try {
      const res = await sendOtp(mobileInput);
      if (res.success) {
        setStep('OTP');
      } else if (res.alreadyRegistered) {
        setStep('LOGIN_PASSWORD');
      } else {
        setErrorMsg(res.error || 'Failed to send OTP to your mobile number.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error requesting OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Verify OTP
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetError();

    if (!otpInput || otpInput.trim().length < 4) {
      setErrorMsg(language === 'bn' ? 'সঠিক ৬-সংখ্যার OTP দিন' : 'Enter a valid OTP code');
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOtp(otpInput);
      if (res.success) {
        setStep('REGISTER_PROFILE');
      } else {
        setErrorMsg(res.error || 'Invalid OTP code. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error verifying OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Complete Profile & Set Password (After OTP verification or first-time setup)
  const handleRegisterProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    resetError();

    if (!passwordInput || passwordInput.length < 4) {
      setErrorMsg(language === 'bn' ? 'কমপক্ষে ৪ অক্ষরের পাসওয়ার্ড দিন' : 'Password must be at least 4 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await registerAccount(passwordInput, nameInput);
      if (res.success) {
        navigate('/', { replace: true });
      } else {
        setErrorMsg(res.error || 'Failed to create profile');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error creating profile');
    } finally {
      setLoading(false);
    }
  };

  // Step 5: Password Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetError();

    if (!passwordInput) {
      setErrorMsg(language === 'bn' ? 'পাসওয়ার্ড লিখুন' : 'Please enter your password');
      return;
    }

    setLoading(true);
    try {
      const res = await loginWithPassword(mobileInput, passwordInput);
      if (res.success) {
        navigate('/', { replace: true });
      } else if (res.requiresPasswordSetup) {
        // User registered on BDApps but has no password set in database yet
        setStep('REGISTER_PROFILE');
      } else if (res.status === 'UNREGISTERED') {
        setErrorMsg(res.error || 'Subscription not active');
        setStep('SUB_CONFIRM');
      } else {
        setErrorMsg(res.error || 'Incorrect password. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Login error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app-bg flex flex-col justify-center items-center px-4 py-12 font-['Hind_Siliguri',_sans-serif] relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-cyan-400/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass rounded-[2.5rem] p-8 border-2 border-blue-500/20 shadow-2xl relative z-10 bg-panel/90 backdrop-blur-xl"
      >
        {/* Back Button */}
        {step !== 'MOBILE' && (
          <button
            onClick={() => {
              resetError();
              setStep('MOBILE');
            }}
            className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-app-fg-muted hover:text-blue-400 transition-colors"
          >
            <ArrowLeft size={16} />
            {language === 'bn' ? 'নম্বর পরিবর্তন করুন' : 'Change Mobile Number'}
          </button>
        )}

        {/* Header Branding */}
        <div className="text-center mb-6">
          <img
            src="/wordmark.png"
            alt="CholoSikhi"
            className="h-10 w-auto mx-auto mb-3 drop-shadow-md"
          />
          <h2 className="text-xl font-black text-app-fg tracking-tight">
            bdapps Gateway
          </h2>
          <p className="text-xs font-bold text-app-fg-muted mt-1">
            {language === 'bn' ? 'রবি ও সার্কেল গ্রাহকদের জন্য' : 'Exclusive for Robi & Cirkle Subscribers'}
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold flex items-start gap-3"
          >
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <div>{errorMsg}</div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1: Enter Mobile Number */}
          {step === 'MOBILE' && (
            <motion.form
              key="mobile-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleMobileSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-black uppercase text-app-fg-muted mb-2 tracking-wider">
                  {language === 'bn' ? 'রবি / সার্কেল মোবাইল নম্বর' : 'Robi / Cirkle Mobile Number'}
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-app-fg-muted" size={20} />
                  <input
                    type="tel"
                    required
                    placeholder="018XXXXXXXX"
                    value={mobileInput}
                    onChange={(e) => setMobileInput(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-app-bg border border-border-subtle text-app-fg font-black text-lg focus:outline-none focus:border-blue-500 transition-all placeholder:text-app-fg-muted/50"
                  />
                </div>
                <p className="text-[11px] text-app-fg-muted font-semibold mt-2">
                  {language === 'bn'
                    ? 'আপনার নম্বরের সাবস্ক্রিপশন স্ট্যাটাস স্বয়ংক্রিয়ভাবে পরীক্ষা করা হবে।'
                    : 'We will check your bdapps subscription status.'}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-black text-base shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <span>{language === 'bn' ? 'এগিয়ে যান' : 'Continue'}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </motion.form>
          )}

          {/* STEP 2: Confirm Subscription Modal (Unregistered User) */}
          {step === 'SUB_CONFIRM' && (
            <motion.div
              key="sub-confirm-step"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-5"
            >
              {/* Status Badge */}
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-400 font-black text-sm">
                    <ShieldCheck size={18} />
                    <span>{language === 'bn' ? 'স্ট্যাটাস: আনসাবস্ক্রাইবড' : 'Status: Not Subscribed'}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase">
                    UNREGISTERED
                  </span>
                </div>

                <p className="text-xs font-bold text-app-fg leading-relaxed">
                  {language === 'bn'
                    ? `আপনি ${mobileInput} নম্বর দিয়ে সাবস্ক্রাইব করতে চাচ্ছেন।`
                    : `Subscribe now with number: ${mobileInput}`}
                </p>

                <div className="text-xs font-bold text-blue-400 bg-blue-500/20 p-2.5 rounded-xl border border-blue-500/30">
                  {language === 'bn'
                    ? 'চার্জ: ৳২.৭৮ / দিন (ভ্যাট, সম্পূরক শুল্ক ও সারচার্জ সহ)'
                    : 'Charge: ৳2.78 / day (incl. VAT & all taxes)'}
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleConfirmSubscription}
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-black text-base shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <span>{language === 'bn' ? 'হ্যাঁ, সাবস্ক্রাইব করে OTP পাঠান' : 'Yes, Subscribe & Send OTP'}</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('MOBILE')}
                  className="w-full py-3 rounded-2xl bg-panel border border-border-subtle text-app-fg-muted font-bold text-sm hover:text-app-fg transition-colors"
                >
                  {language === 'bn' ? 'ফিরে যান' : 'Go Back'}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: OTP Verification */}
          {step === 'OTP' && (
            <motion.form
              key="otp-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleOtpSubmit}
              className="space-y-4"
            >
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400 text-center">
                {language === 'bn'
                  ? `${pendingMobile || mobileInput} নম্বরে পাঠানো OTP টি লিখুন`
                  : `Enter the OTP sent to ${pendingMobile || mobileInput}`}
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-app-fg-muted mb-2 tracking-wider">
                  {language === 'bn' ? '৬-সংখ্যার OTP' : '6-Digit OTP Code'}
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="123456"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  className="w-full text-center tracking-[0.5em] px-4 py-4 rounded-2xl bg-app-bg border border-border-subtle text-app-fg font-black text-2xl focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-black text-base shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <span>{language === 'bn' ? 'OTP যাচাই করুন' : 'Verify OTP'}</span>
                    <CheckCircle2 size={18} />
                  </>
                )}
              </button>
            </motion.form>
          )}

          {/* STEP 4: Set Password & Profile */}
          {step === 'REGISTER_PROFILE' && (
            <motion.form
              key="register-profile-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleRegisterProfile}
              className="space-y-4"
            >
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>
                  {language === 'bn'
                    ? `সফলভাবে সাবস্ক্রিপশন সংরক্ষিত! (${pendingMobile || mobileInput})`
                    : `Subscription verified! (${pendingMobile || mobileInput})`}
                </span>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-app-fg-muted mb-2 tracking-wider">
                  {language === 'bn' ? 'আপনার নাম' : 'Your Full Name'}
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-app-fg-muted" size={18} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahat Ahmed"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-app-bg border border-border-subtle text-app-fg font-bold text-sm focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-app-fg-muted mb-2 tracking-wider">
                  {language === 'bn' ? 'লগইন পাসওয়ার্ড তৈরি করুন' : 'Create Account Password'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-app-fg-muted" size={18} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-app-bg border border-border-subtle text-app-fg font-bold text-sm focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
                <p className="text-[11px] text-app-fg-muted font-medium mt-1">
                  {language === 'bn' ? 'পরবর্তী প্রতিবার লগইন করতে এই পাসওয়ার্ডটি লাগবে।' : 'Required for every future login.'}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-black text-base shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <span>{language === 'bn' ? 'অ্যাকেউন্ট তৈরি ও প্রবেশ' : 'Complete Setup & Log In'}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </motion.form>
          )}

          {/* STEP 5: Password Login (Subscribed or Pending Payment) */}
          {step === 'LOGIN_PASSWORD' && (
            <motion.form
              key="login-password-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handlePasswordLogin}
              className="space-y-4"
            >
              {/* Clear Status Card */}
              {isSubActive ? (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-black text-sm">
                      <CheckCircle2 size={18} />
                      <span>{language === 'bn' ? 'স্ট্যাটাস: সাবস্ক্রাইবড (সক্রিয়)' : 'Status: Subscribed (Active)'}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase">
                      REGISTERED
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-app-fg-muted pt-1">
                    Number: {mobileInput}
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-black text-sm">
                      <AlertTriangle size={18} />
                      <span>{language === 'bn' ? 'স্ট্যাটাস: পেমেন্ট মুলতবি' : 'Status: Payment Pending'}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase">
                      {subStatus || 'PENDING'}
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-app-fg-muted">
                    {language === 'bn'
                      ? `নম্বর: ${mobileInput} (চার্জ: ৳২.৭৮/দিন)`
                      : `Number: ${mobileInput} (Charge: ৳2.78/day)`}
                  </p>
                  <p className="text-[11px] font-medium text-amber-300">
                    {language === 'bn'
                      ? 'লগইন করা যাবে, তবে প্রিমিয়াম কোর্স ব্যবহারের জন্য সিম ব্যালেন্স রিচার্জ প্রয়োজন।'
                      : 'You can log in, but premium lessons require balance recharge.'}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-black uppercase text-app-fg-muted mb-2 tracking-wider">
                  {language === 'bn' ? 'পাসওয়ার্ড দিন' : 'Enter Password'}
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-app-fg-muted" size={18} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-app-bg border border-border-subtle text-app-fg font-bold text-sm focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-black text-base shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <span>{language === 'bn' ? 'লগইন করুন' : 'Log In'}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
