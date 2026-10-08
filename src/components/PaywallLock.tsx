import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ShieldAlert, Award, User, RefreshCw, Smartphone, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { play } from '@/lib/audio';

interface PaywallLockProps {
  suite?: 'sat' | 'py';
  language?: 'en' | 'bn';
}

export default function PaywallLock({ suite = 'sat', language = 'bn' }: PaywallLockProps) {
  const { session, user, subscriptionStatus, initialize } = useAuthStore();
  const [checking, setChecking] = useState(false);
  const [refreshedMessage, setRefreshedMessage] = useState<string | null>(null);

  const isBn = language === 'bn';
  const rawStatus = (subscriptionStatus || session?.subscriptionStatus || 'UNREGISTERED').toUpperCase();
  const isPendingCharge = rawStatus.includes('PENDING') || rawStatus.includes('CHARGE');
  const activeMobile = user?.mobile || session?.mobile || '';

  const handleRefreshStatus = async () => {
    play('tap');
    setChecking(true);
    setRefreshedMessage(null);
    try {
      await initialize();
      setRefreshedMessage(
        isBn ? 'স্ট্যাটাস আপডেট করা হয়েছে।' : 'Subscription status refreshed.'
      );
    } catch {
      setRefreshedMessage(
        isBn ? 'সার্ভার যোগাযোগে বিলম্ব হচ্ছে। কিছুক্ষণ পর চেষ্টা করুন।' : 'Gateway check delayed. Please retry shortly.'
      );
    } finally {
      setChecking(false);
      setTimeout(() => setRefreshedMessage(null), 3500);
    }
  };

  const leaderboardPath = suite === 'sat' ? '/sat/leaderboard' : '/py/leaderboard';
  const profilePath = suite === 'sat' ? '/sat/profile' : '/py/profile';

  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-12 px-4 animate-fadeIn">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass rounded-[3rem] p-6 sm:p-10 border-2 border-amber-500/40 shadow-2xl relative overflow-hidden text-center space-y-6"
      >
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/10 blur-3xl pointer-events-none rounded-full" />

        {/* Lock Graphic */}
        <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-amber-500/15 border-2 border-amber-500/40 text-amber-400 flex items-center justify-center shadow-xl shadow-amber-500/20">
          <Lock size={40} className="drop-shadow-md" />
          <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-rose-500 border-2 border-app-bg flex items-center justify-center text-white">
            <ShieldAlert size={12} />
          </span>
        </div>

        {/* Status Tag */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 font-black text-xs uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            {isPendingCharge
              ? isBn ? 'চার্জ পেন্ডিং (INITIAL CHARGE PENDING)' : 'INITIAL CHARGE PENDING'
              : isBn ? 'সাবস্ক্রিপশন প্রয়োজন (UNPAID)' : 'SUBSCRIPTION REQUIRED'}
          </span>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-app-fg/70">
            ৳২.৭৮ / দিন (রবি ও সার্কেল)
          </span>
        </div>

        {/* Title & Description */}
        <div className="space-y-3 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-app-fg tracking-tight">
            {isPendingCharge
              ? (isBn ? 'পেমেন্ট সম্পন্ন করে সম্পূর্ণ অ্যাক্সেস নিন' : 'Payment Required to Unlock Platform')
              : (isBn ? 'এই মডিউলটি সাবস্ক্রাইবারদের জন্য সংরক্ষিত' : 'This Module is Locked for Paid Members')}
          </h2>

          <p className="text-sm sm:text-base text-app-fg/75 font-semibold leading-relaxed">
            {isPendingCharge ? (
              isBn
                ? 'আপনার রেজিস্ট্রেশন সম্পন্ন হয়েছে, তবে রবি/সার্কেল সিমে পর্যাপ্ত ব্যালেন্স না থাকায় দৈনিক চার্জ (৳২.৭৮) পেন্ডিং রয়েছে। ব্যালেন্স রিচার্জ করুন এবং নিচের বাটনে ক্লিক করে স্ট্যাটাস চেক করুন।'
                : 'Your registration is initiated, but daily charging (৳2.78/day) is pending due to insufficient airtime/balance on your SIM. Please recharge your mobile balance and click "Check Payment Status".'
            ) : (
              isBn
                ? 'চলোশিখির সম্পূর্ণ প্রশ্নব্যাংক, ডিজিটাল SAT প্র্যাকটিস, পাইথন একাডেমি ও ২৪/৭ নিনি এআই টিউটর ব্যবহার করতে bdapps অল-অ্যাক্সেস পাস সক্রিয় করুন।'
                : 'Activate your bdapps All-Access Pass to unlock all practice modules, question vaults, interactive coding lessons, and 24/7 Nini AI.'
            )}
          </p>

          {activeMobile && (
            <div className="p-3 rounded-2xl bg-app-bg/80 border border-border-subtle inline-flex items-center gap-2 text-xs font-bold text-app-fg/80">
              <Smartphone size={14} className="text-cyan-400" />
              <span>{isBn ? 'সংযুক্ত মোবাইল:' : 'Account Mobile:'}</span>
              <span className="text-cyan-400 font-mono font-black">{activeMobile}</span>
            </div>
          )}
        </div>

        {/* Informative Accessible Section Alert */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 max-w-lg mx-auto text-xs font-bold text-app-fg/70 flex items-center justify-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>
            {isBn
              ? 'চার্জিং পেন্ডিং থাকা অবস্থায় শুধুমাত্র প্রোফাইল এবং লিডারবোর্ড উন্মুক্ত থাকবে।'
              : 'Profile and Leaderboard remain accessible while subscription charging is pending.'}
          </span>
        </div>

        {refreshedMessage && (
          <div className="p-3 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-bold max-w-md mx-auto">
            {refreshedMessage}
          </div>
        )}

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleRefreshStatus}
            disabled={checking}
            className="w-full sm:w-auto btn-duo btn-duo-green py-3.5 px-6 text-xs sm:text-sm flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} className={checking ? "animate-spin" : ""} />
            <span>{checking ? (isBn ? 'যাচাই করা হচ্ছে...' : 'Checking...') : (isBn ? 'পেমেন্ট স্ট্যাটাস রিফ্রেশ করুন' : 'Check Payment Status')}</span>
          </button>

          <Link
            to="/auth"
            onClick={() => play('tap')}
            className="w-full sm:w-auto btn-duo btn-duo-blue py-3.5 px-6 text-xs sm:text-sm flex items-center justify-center gap-2"
          >
            <span>{isBn ? 'সাবস্ক্রিপশন / লগইন পেজ' : 'Manage Subscription / Login'}</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Allowed Access Links (Profile & Leaderboard) */}
        <div className="pt-4 border-t border-border-subtle flex flex-wrap justify-center gap-4 text-xs font-bold text-app-fg/60">
          <Link
            to={leaderboardPath}
            onClick={() => play('tap')}
            className="hover:text-amber-400 transition-colors flex items-center gap-1.5 p-2 rounded-xl hover:bg-white/5"
          >
            <Award size={15} className="text-amber-400" />
            <span>{isBn ? 'লিডারবোর্ড দেখুন' : 'View Leaderboard'}</span>
          </Link>

          <Link
            to={profilePath}
            onClick={() => play('tap')}
            className="hover:text-blue-400 transition-colors flex items-center gap-1.5 p-2 rounded-xl hover:bg-white/5"
          >
            <User size={15} className="text-blue-400" />
            <span>{isBn ? 'আমার প্রোফাইল' : 'View Profile'}</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
