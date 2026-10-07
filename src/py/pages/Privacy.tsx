import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Lock, Eye, Database, Sparkles } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';

export default function Privacy() {
  const navigate = useNavigate();
  const { language } = useSettingsStore();
  const isBn = language === 'bn';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 pb-32">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label={isBn ? 'ফিরে যান' : 'Go back'}
          className="p-3 bg-panel border-2 border-border-subtle rounded-2xl hover:border-blue-500/40 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-black text-blue-400 uppercase tracking-widest mb-1">
            <Shield size={14} />
            {isBn ? 'গোপনীয়তা নীতি' : 'PRIVACY POLICY'}
          </div>
          <h1 className="text-3xl md:text-4xl font-black">
            {isBn ? 'চলোশিখি গোপনীয়তা নীতি' : 'CholoSikhi Privacy Policy'}
          </h1>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-panel border-2 border-border-subtle rounded-3xl p-6 md:p-10 space-y-8 font-medium leading-relaxed text-app-fg/80"
      >
        <div className="text-xs text-app-fg/40 uppercase tracking-widest font-black">
          {isBn ? 'সর্বশেষ আপডেট: মার্চ ২০২৬' : 'Last Updated: March 2026'}
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-app-fg flex items-center gap-2">
            <Sparkles size={18} className="text-blue-400" />
            {isBn ? '১. আমাদের প্রতিশ্রুতি' : '1. Our Commitment'}
          </h2>
          <p>
            {isBn
              ? 'চলোশিখি (CholoSikhi) শিক্ষার্থীদের তথ্যের নিরাপত্তাকে সর্বোচ্চ গুরুত্ব দেয়। তুমি যখন কোডিং শিখবে, তখন তোমার ব্যক্তিগত তথ্য সুরক্ষিত রাখাই আমাদের মূল লক্ষ্য।'
              : 'At CholoSikhi, protecting student privacy is our top priority. As you learn to code, keeping your personal data safe and transparent is our promise.'}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-app-fg flex items-center gap-2">
            <Database size={18} className="text-blue-400" />
            {isBn ? '২. আমরা কী তথ্য সংগ্রহ করি' : '2. Information We Collect'}
          </h2>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>
              <strong>{isBn ? 'অ্যাকাউন্ট তথ্য:' : 'Account Info:'}</strong>{' '}
              {isBn
                ? 'তোমার নাম, ইমেইল ঠিকানা এবং প্রোফাইল অবতার।'
                : 'Your name, email address, and optional avatar image.'}
            </li>
            <li>
              <strong>{isBn ? 'শেখার অগ্রগতি:' : 'Learning Progress:'}</strong>{' '}
              {isBn
                ? 'সম্পন্ন করা পাঠ, অর্জিত XP, স্ট্রিক, জেমস এবং লিডারবোর্ড র‍্যাঙ্ক।'
                : 'Lessons completed, XP earned, streaks, gems, and leaderboard standing.'}
            </li>
            <li>
              <strong>{isBn ? 'ব্রাউজার স্টোরেজ:' : 'Local Storage:'}</strong>{' '}
              {isBn
                ? 'থিম (ডার্ক/লাইট), পছন্দের ভাষা এবং অডিও সেটিংস মনে রাখার জন্য লোকাল স্টোরেজ ব্যবহার করা হয়।'
                : 'Preferences like dark/light mode, language, and audio settings are cached locally.'}
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-app-fg flex items-center gap-2">
            <Lock size={18} className="text-blue-400" />
            {isBn ? '৩. তথ্য কীভাবে সুরক্ষিত থাকে' : '3. How Data is Secured'}
          </h2>
          <p>
            {isBn
              ? 'আমাদের ডাটাবেজ Supabase-এর এন্টারপ্রাইজ-গ্রেড সিকিউরিটি এবং Row Level Security (RLS) দ্বারা সুরক্ষিত। পাসওয়ার্ড সর্বদা এনক্রিপ্ট অবস্থায় সংরক্ষিত থাকে। আমরা কোনো তৃতীয় পক্ষের কাছে তোমার ব্যক্তিগত তথ্য বিক্রি বা শেয়ার করি না।'
              : 'Our database is powered by Supabase with Row Level Security (RLS) and cryptographic encryption. We never sell or share your personal data with third-party advertisers.'}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-app-fg flex items-center gap-2">
            <Eye size={18} className="text-blue-400" />
            {isBn ? '৪. তোমার অধিকার' : '4. Your Rights'}
          </h2>
          <p>
            {isBn
              ? 'তুমি যেকোনো সময় তোমার প্রোফাইল সেটিংস থেকে অ্যাকাউন্ট ও অগ্রগতির তথ্য রিসেট করতে পারো অথবা contact@cholosikhi.com-এ যোগাযোগ করে সম্পূর্ণ তথ্য মুছে ফেলার অনুরোধ জানাতে পারো।'
              : 'You have full control to reset or request the deletion of your account and learning data at any time by emailing contact@cholosikhi.com.'}
          </p>
        </section>
      </motion.div>
    </div>
  );
}
