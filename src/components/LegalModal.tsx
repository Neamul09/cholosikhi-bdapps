import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, FileText } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
  language: 'en' | 'bn';
}

export default function LegalModal({ isOpen, type, onClose, language }: LegalModalProps) {
  if (!isOpen || !type) return null;

  const isBn = language === 'bn';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-panel border-2 border-border-subtle rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-6 text-app-fg shadow-2xl relative"
        >
          <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                {type === 'privacy' ? <Shield size={20} /> : <FileText size={20} />}
              </div>
              <h3 className="text-2xl font-black">
                {type === 'privacy'
                  ? (isBn ? 'গোপনীয়তা নীতি (Privacy Policy)' : 'Privacy Policy')
                  : (isBn ? 'ব্যবহারের শর্তাবলী (Terms of Service)' : 'Terms of Service')}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/10 text-app-fg/60 transition"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4 text-sm font-medium text-app-fg/80 leading-relaxed">
            {type === 'privacy' ? (
              <>
                <p>
                  {isBn
                    ? 'চলোশিখি (CholoSikhi) শিক্ষার্থীদের তথ্যের নিরাপত্তাকে সর্বোচ্চ গুরুত্ব দেয়। আমরা শুধুমাত্র তোমার শেখার অগ্রগতি, স্ট্রিক এবং অ্যাকাউন্ট পরিচালনা করার জন্য প্রয়োজনীয় তথ্য সংরক্ষণ করি।'
                    : 'CholoSikhi values your privacy. We collect minimal data necessary to maintain your learning progress, XP streaks, and account authentication.'}
                </p>
                <h4 className="font-bold text-base text-app-fg pt-2">
                  {isBn ? '১. ডাটা নিরাপত্তা' : '1. Data Security'}
                </h4>
                <p>
                  {isBn
                    ? 'আমাদের ডাটাবেজ এনক্রিপশন এবং সিকিউর রো লেভেল পলিসির মাধ্যমে সুরক্ষিত। আমরা কখনোই তৃতীয় পক্ষের কাছে কোনো ব্যক্তিগত তথ্য বিক্রি করি না।'
                    : 'All user credentials and records are secured with cryptographic standards and Row Level Security. We never sell your personal data to third parties.'}
                </p>
                <h4 className="font-bold text-base text-app-fg pt-2">
                  {isBn ? '২. যোগাযোগ' : '2. Contact'}
                </h4>
                <p>
                  {isBn
                    ? 'গোপনীয়তা সংক্রান্ত যেকোনো প্রশ্নের জন্য আমাদের ইমেইল করতে পারো: contact@cholosikhi.com'
                    : 'For any privacy-related requests or account deletions, contact us at contact@cholosikhi.com.'}
                </p>
              </>
            ) : (
              <>
                <p>
                  {isBn
                    ? 'চলোশিখি প্ল্যাটফর্মে স্বাগতম। এই প্ল্যাটফর্ম ব্যবহার করে তুমি আমাদের সাধারণ শিক্ষামূলক শর্তাবলী মেনে নিচ্ছো।'
                    : 'Welcome to CholoSikhi. By using our platform, you agree to these standard educational terms.'}
                </p>
                <h4 className="font-bold text-base text-app-fg pt-2">
                  {isBn ? '১. শিক্ষার্থী আচরণবিধি' : '1. Code of Conduct'}
                </h4>
                <p>
                  {isBn
                    ? 'প্ল্যাটফর্মে অন্য শিক্ষার্থীদের সাথে সৌহার্দ্যপূর্ণ আচরণ বজায় রাখতে হবে। ক্ষতিকর স্ক্রিপ্ট চালানো বা লিডারবোর্ডে অসদুপায় অবলম্বন করা সম্পূর্ণ নিষিদ্ধ।'
                    : 'Students must treat peers with respect. Botting, leaderboard manipulation, or malicious activity is strictly prohibited.'}
                </p>
                <h4 className="font-bold text-base text-app-fg pt-2">
                  {isBn ? '২. কনটেন্ট স্বত্ব' : '2. Intellectual Property'}
                </h4>
                <p>
                  {isBn
                    ? 'চলোশিখির সমস্ত লেসন ও ইন্টারঅ্যাক্টিভ কোড ব্যক্তিগত অনুশীলনের জন্য উন্মুক্ত, বাণিজ্যিক বিক্রির জন্য নয়।'
                    : 'Curriculum exercises are licensed for personal educational use and cannot be republished commercially.'}
                </p>
              </>
            )}
          </div>

          <div className="pt-4 border-t border-border-subtle flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-black text-sm transition"
            >
              {isBn ? 'ঠিক আছে' : 'Got it'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
