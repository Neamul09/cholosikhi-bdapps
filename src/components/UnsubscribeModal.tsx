import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, UserX, X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { play } from '@/lib/audio';

interface UnsubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'en' | 'bn';
  onSuccess?: () => void;
}

export default function UnsubscribeModal({
  isOpen,
  onClose,
  language = 'bn',
  onSuccess,
}: UnsubscribeModalProps) {
  const { session, user, unsubscribe } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unsubSuccess, setUnsubSuccess] = useState(false);

  const activeMobile = user?.mobile || session?.mobile || '';

  const handleConfirm = async () => {
    play('tap');
    setLoading(true);
    setError(null);
    try {
      const res = await unsubscribe();
      if (res.success) {
        play('correct');
        setUnsubSuccess(true);
        setTimeout(() => {
          setUnsubSuccess(false);
          onClose();
          if (onSuccess) {
            onSuccess();
          } else {
            window.location.href = '/';
          }
        }, 1800);
      } else {
        play('incorrect');
        setError(res.error || (language === 'bn' ? 'আনসাবস্ক্রাইব ব্যর্থ হয়েছে। আবার চেষ্টা করুন।' : 'Unsubscription failed. Please try again.'));
      }
    } catch (err: any) {
      play('incorrect');
      setError(err?.message || (language === 'bn' ? 'সংযোগ সমস্যা হয়েছে।' : 'Connection error occurred.'));
    } finally {
      setLoading(false);
    }
  };

  const isBn = language === 'bn';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="w-full max-w-md bg-panel border-2 border-rose-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={() => { play('tap'); onClose(); }}
              disabled={loading}
              className="absolute top-4 right-4 p-2 rounded-xl text-app-fg/40 hover:text-app-fg hover:bg-white/5 transition-colors disabled:opacity-30"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {unsubSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/15 border-2 border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg animate-bounce">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-2xl font-black text-app-fg">
                  {isBn ? 'সাবস্ক্রিপশন বাতিল হয়েছে' : 'Unsubscribed Successfully'}
                </h3>
                <p className="text-xs sm:text-sm text-app-fg/70 font-semibold">
                  {isBn
                    ? 'আপনার bdapps দৈনিক চার্জিং বন্ধ করা হয়েছে। যেকোনো সময় আবার যুক্ত হতে পারেন।'
                    : 'Your daily subscription charging has been terminated. You can resubscribe anytime.'}
                </p>
              </div>
            ) : (
              <>
                {/* Header Icon */}
                <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border-2 border-rose-500/30 text-rose-500 flex items-center justify-center mx-auto shadow-lg">
                  <AlertTriangle size={32} />
                </div>

                <div className="space-y-2 text-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 font-black text-[10px] uppercase tracking-wider">
                    <ShieldAlert size={12} />
                    <span>{isBn ? 'সাবস্ক্রিপশন বাতিল সতর্কতা' : 'Cancellation Warning'}</span>
                  </span>

                  <h3 className="text-2xl font-black text-app-fg tracking-tight">
                    {isBn ? 'bdapps সাবস্ক্রিপশন বাতিল করবেন?' : 'Cancel bdapps Subscription?'}
                  </h3>

                  <p className="text-xs sm:text-sm font-semibold text-app-fg/70 leading-relaxed pt-1">
                    {isBn
                      ? 'সতর্কতা: আনসাবস্ক্রাইব করলে আপনার দৈনিক ২.৭৮ টাকা চার্জিং বন্ধ হবে এবং চলোশিখির ডিজিটাল SAT ও পাইথন প্রিমিয়াম মডিউলের অ্যাক্সেস লক হয়ে যাবে।'
                      : 'Warning: Canceling will stop your daily charging (৳2.78/day) and revoke your access to CholoSikhi premium SAT and Python modules until you subscribe again.'}
                  </p>

                  {activeMobile && (
                    <div className="p-2.5 rounded-xl bg-app-bg border border-border-subtle text-xs font-bold text-app-fg/80 mt-2">
                      <span>{isBn ? 'সংযুক্ত মোবাইল নম্বর:' : 'Linked Mobile:'} </span>
                      <span className="text-cyan-400 font-mono font-black">{activeMobile}</span>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold text-center">
                    {error}
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { play('tap'); onClose(); }}
                    disabled={loading}
                    className="flex-1 btn-duo btn-duo-secondary py-3 text-xs font-black"
                  >
                    <span>{isBn ? 'বাতিল করবেন না / ফিরে যান' : 'Keep Subscription'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={loading}
                    className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-black text-xs transition-all shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{isBn ? 'প্রক্রিয়াধীন...' : 'Processing...'}</span>
                      </>
                    ) : (
                      <>
                        <UserX size={15} />
                        <span>{isBn ? 'হ্যাঁ, আনসাবস্ক্রাইব করুন' : 'Yes, Unsubscribe'}</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
