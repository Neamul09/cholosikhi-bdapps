import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User as UserIcon, Zap, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

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

  useEffect(() => {
    // Check for errors in URL hash (e.g. from expired email links)
    const hash = window.location.hash;
    if (hash && hash.includes('error=')) {
      const params = new URLSearchParams(hash.replace('#', ''));
      const errorMsg = params.get('error_description');
      if (errorMsg) {
        setError(errorMsg.replace(/\+/g, ' '));
      }
    }
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { data: signInData, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        // Block unverified users (but allow old users with no confirmation date)
        // Accounts created before verification was enabled have null email_confirmed_at
        // We only block if they clearly have NOT confirmed (email_confirmation_sent_at set but not confirmed)
        const user = signInData?.user;
        if (user && !user.email_confirmed_at && user.confirmation_sent_at) {
          await supabase.auth.signOut();
          throw new Error(
            language === 'bn' 
              ? 'অনুগ্রহ করে আপনার ইমেইল ভেরিফাই করুন। আপনার ইমেইল ইনবক্সে একটি লিঙ্ক পাঠানো হয়েছে।'
              : 'Please verify your email first. Check your inbox for the verification link.'
          );
        }
        
        navigate('/');
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            }
          }
        });
        if (error) throw error;
        
        if (data.user && !data.session) {
          setShowSuccess(true);
        } else {
          navigate('/'); 
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-app-bg px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-panel rounded-[2.5rem] p-8 border-2 border-[var(--border-subtle)] shadow-2xl relative z-10"
      >
        {showSuccess ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto mb-6">
              <Mail size={40} />
            </div>
            <h2 className="text-2xl font-black mb-4">
              {language === 'bn' ? 'আপনার ইমেইল চেক করুন!' : 'Check your email!'}
            </h2>
            <p className="text-[var(--app-fg-muted)] font-bold mb-8">
              {language === 'bn' 
                ? 'আমরা আপনার ইমেইলে একটি ভেরিফিকেশন লিঙ্ক পাঠিয়েছি। শেখা শুরু করতে লিঙ্কে ক্লিক করুন।' 
                : 'We have sent a verification link. Click it to start your coding journey!'}
            </p>
            <button 
              onClick={() => setShowSuccess(false)}
              className="px-8 py-4 rounded-2xl bg-blue-500 text-white font-black hover:bg-blue-600 transition-colors"
            >
              {language === 'bn' ? 'লগইন পেজে যান' : 'Go to Login'}
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4">
            <Zap size={32} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-center">
            {isLogin 
              ? (language === 'bn' ? 'আপনাকে স্বাগতম!' : 'Welcome Back!') 
              : (language === 'bn' ? 'অ্যাকাউন্ট তৈরি করুন' : 'Create Account')}
          </h1>
          <p className="text-[var(--app-fg-muted)] font-bold text-center mt-2">
            {isLogin 
              ? (language === 'bn' ? 'শেখা চালিয়ে যেতে লগইন করুন' : 'Log in to continue learning')
              : (language === 'bn' ? 'কোডিং এর জগতে প্রবেশ করুন' : 'Step into the world of coding')}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-pink-500/10 border-l-4 border-pink-500 text-pink-500 font-bold rounded-r-xl text-sm flex items-center gap-3">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <AnimatePresence mode="popLayout">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[var(--app-fg-muted)]">
                    <UserIcon size={20} />
                  </div>
                  <input
                    type="text"
                    required={!isLogin}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={language === 'bn' ? 'আপনার নাম' : 'Your name'}
                    className="w-full bg-[var(--app-bg)] border-2 border-[var(--border-subtle)] focus:border-blue-500 rounded-2xl py-3 pl-12 pr-4 font-bold outline-none transition-all"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[var(--app-fg-muted)]">
              <Mail size={20} />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={language === 'bn' ? 'ইমেইল অ্যাড্রেস' : 'Email address'}
              className="w-full bg-[var(--app-bg)] border-2 border-[var(--border-subtle)] focus:border-blue-500 rounded-2xl py-3 pl-12 pr-4 font-bold outline-none transition-all"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[var(--app-fg-muted)]">
              <Lock size={20} />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
              className="w-full bg-[var(--app-bg)] border-2 border-[var(--border-subtle)] focus:border-blue-500 rounded-2xl py-3 pl-12 pr-4 font-bold outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-duo btn-duo-blue py-3.5 mt-2 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 size={24} className="animate-spin" />
            ) : (
              <>
                {isLogin 
                  ? (language === 'bn' ? 'লগইন' : 'LOGIN') 
                  : (language === 'bn' ? 'সাইন আপ' : 'SIGN UP')}
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-[var(--app-fg-muted)] font-bold">
          {isLogin 
            ? (language === 'bn' ? 'অ্যাকাউন্ট নেই? ' : 'Don\'t have an account? ')
            : (language === 'bn' ? 'আগের অ্যাকাউন্ট আছে? ' : 'Already have an account? ')}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
          >
            {isLogin 
              ? (language === 'bn' ? 'সাইন আপ' : 'Sign up')
              : (language === 'bn' ? 'লগইন' : 'Log in')}
          </button>
        </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
