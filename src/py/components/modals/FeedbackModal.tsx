import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Send, MessageSquare, Star, Bug, 
  Lightbulb, Heart, HelpCircle, CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { clsx } from 'clsx';
import { NINI_MASCOT } from '@/lib/mascot';
import { useUserStore } from '@/store/userStore';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';
import { play } from '@/lib/audio';
import { trackEvent } from '@/lib/analytics';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FeedbackCategory = 'bug' | 'suggestion' | 'praise' | 'other';

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const { language } = useSettingsStore();
  const isBn = language === 'bn';
  const { name: storeName } = useUserStore();
  const { user: authUser } = useAuthStore();

  const [category, setCategory] = useState<FeedbackCategory>('suggestion');
  const [rating, setRating] = useState<number>(5);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState(() => authUser?.email || authUser?.mobile || localStorage.getItem('cholosikhi_user_email') || '');
  const [name, setName] = useState(() => storeName || '');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const categories = [
    { id: 'bug', labelBn: 'বাগ / সমস্যা', labelEn: 'Bug Report', icon: Bug, color: 'text-duo-red' },
    { id: 'suggestion', labelBn: 'পরামর্শ / ফিচার', labelEn: 'Suggestion', icon: Lightbulb, color: 'text-duo-yellow' },
    { id: 'praise', labelBn: 'প্রশংসা', labelEn: 'Love / Praise', icon: Heart, color: 'text-duo-green' },
    { id: 'other', labelBn: 'অন্যান্য', labelEn: 'Other', icon: HelpCircle, color: 'text-duo-blue' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setErrorMsg(isBn ? 'দয়া করে তোমার মতামত লিখো।' : 'Please enter your feedback message.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const payload = {
      name: name || 'Anonymous Learner',
      email: email || 'not-provided@cholosikhi.com',
      category,
      rating: `${rating} / 5 stars`,
      message: message.trim(),
      platformPath: window.location.pathname,
      submittedAt: new Date().toISOString(),
      _subject: `CholoSikhi Feedback [${category.toUpperCase()}] from ${name || 'User'}`,
      _template: 'table',
      _captcha: 'false',
    };

    try {
      // 100% Free AJAX submission directly to neamulmorshed@gmail.com
      const res = await fetch('https://formsubmit.co/ajax/neamulmorshed@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        trackEvent('feedback_submitted', { category, rating });
        play('achievement');
        setIsSuccess(true);
      } else {
        throw new Error('Submission server returned error status');
      }
    } catch (err) {
      console.error('Feedback submit failed via AJAX, offering mailto fallback', err);
      // Fallback: direct mailto
      const mailtoUrl = `mailto:neamulmorshed@gmail.com?subject=${encodeURIComponent(
        `CholoSikhi Feedback [${category}]`
      )}&body=${encodeURIComponent(
        `Name: ${name}\nRating: ${rating}/5\nCategory: ${category}\n\nMessage:\n${message}`
      )}`;
      window.open(mailtoUrl, '_blank');
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setMessage('');
    setErrorMsg('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-panel border-2 border-border-subtle rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative text-app-fg"
        >
          {/* Close Button */}
          <button
            onClick={handleResetAndClose}
            className="absolute top-4 right-4 p-2 rounded-full text-app-fg-muted hover:text-app-fg hover:bg-white/10 transition"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          {isSuccess ? (
            /* Success State */
            <div className="text-center py-6 space-y-5">
              <div className="w-24 h-24 mx-auto flex items-center justify-center relative">
                <img
                  src={NINI_MASCOT.right}
                  alt="Mascot Nini"
                  className="w-full h-full object-contain drop-shadow-md animate-bounce-subtle"
                />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-duo-green/10 text-duo-green border border-duo-green/30">
                  <CheckCircle2 size={14} />
                  <span>{isBn ? 'মতামত গৃহীত হয়েছে!' : 'Feedback Delivered!'}</span>
                </div>
                <h3 className="text-xl font-black text-app-fg">
                  {isBn ? 'অনেক ধন্যবাদ তোমাকে!' : 'Thank you so much!'}
                </h3>
                <p className="text-xs text-app-fg-muted max-w-sm mx-auto leading-relaxed">
                  {isBn
                    ? 'তোমার মূল্যবান বার্তা সরাসরি চলোশিখি দলের কাছে (neamulmorshed@gmail.com) পৌঁছে গেছে। শিক্ষার্থীদের অভিজ্ঞতা আরও সুন্দর করতে আমরা এটি দ্রুত কাজে লাগাবো।'
                    : 'Your valuable feedback has been delivered directly to the founder (neamulmorshed@gmail.com). We will use your feedback to make CholoSikhi even better.'}
                </p>
              </div>

              <button
                onClick={handleResetAndClose}
                className="btn-duo btn-duo-green px-8 py-3 text-sm font-black inline-block"
              >
                {isBn ? 'ঠিক আছে' : 'Got it!'}
              </button>
            </div>
          ) : (
            /* Form State */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-blue-500/10 text-cyan-400 border border-blue-500/20 mb-1">
                  <MessageSquare size={13} />
                  <span>{isBn ? 'সরাসরি মতামত দিন' : 'Direct Feedback'}</span>
                </div>
                <h2 className="text-xl font-black text-app-fg">
                  {isBn ? 'চলোশিখিকে আরও সুন্দর করো' : 'Help Improve CholoSikhi'}
                </h2>
                <p className="text-xs text-app-fg-muted mt-1">
                  {isBn
                    ? 'তোমার মতামত সরাসরি প্ল্যাটফর্ম প্রতিষ্ঠাতার কাছে পাঠানো হবে।'
                    : 'Your review goes straight to the creator (neamulmorshed@gmail.com).'}
                </p>
              </div>

              {/* Feedback Category Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setCategory(cat.id as FeedbackCategory)}
                      className={clsx(
                        'p-2.5 rounded-2xl border text-xs font-bold transition flex flex-col items-center gap-1.5',
                        isSelected
                          ? 'border-duo-green bg-duo-green/10 text-app-fg shadow-sm'
                          : 'border-border-subtle bg-app-bg text-app-fg-muted hover:border-border'
                      )}
                    >
                      <Icon size={16} className={cat.color} />
                      <span className="text-[11px] text-center">{isBn ? cat.labelBn : cat.labelEn}</span>
                    </button>
                  );
                })}
              </div>

              {/* Rating Stars */}
              <div className="p-3 bg-app-bg border border-border-subtle rounded-2xl flex items-center justify-between">
                <span className="text-xs font-bold text-app-fg">
                  {isBn ? 'তোমার অভিজ্ঞতা কেমন ছিল?' : 'How is your experience?'}
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 text-app-fg-muted hover:text-duo-yellow transition"
                    >
                      <Star
                        size={18}
                        className={clsx(
                          star <= rating
                            ? 'text-duo-yellow fill-duo-yellow'
                            : 'text-border-subtle'
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div>
                <label className="text-xs font-bold text-app-fg block mb-1">
                  {isBn ? 'তোমার মতামত বা বিবরণ' : 'Your Message / Feedback'}
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    isBn
                      ? 'কোনো ফিচার পছন্দ হয়েছে বা কোনো অসুবিধা হচ্ছে? খুলে বলো...'
                      : 'What features did you like? Any bugs or suggestions? Tell us...'
                  }
                  required
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-app-bg border border-border-subtle text-app-fg text-xs focus:border-duo-green focus:outline-none resize-none"
                />
              </div>

              {/* Optional Contact Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-app-fg-muted block mb-1">
                    {isBn ? 'তোমার নাম (ঐচ্ছিক)' : 'Your Name (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Neamul"
                    className="w-full px-3 py-2 rounded-xl bg-app-bg border border-border-subtle text-app-fg text-xs focus:border-duo-green focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-app-fg-muted block mb-1">
                    {isBn ? 'তোমার ইমেইল (ঐচ্ছিক)' : 'Your Email (Optional)'}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-3 py-2 rounded-xl bg-app-bg border border-border-subtle text-app-fg text-xs focus:border-duo-green focus:outline-none"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-duo-red/10 border border-duo-red/30 flex items-center gap-2 text-xs text-duo-red font-bold">
                  <AlertCircle size={14} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="btn-duo btn-duo-green w-full py-3 text-sm font-black flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={15} />
                    <span>{isBn ? 'মতামত পাঠিয়ে দিন' : 'Send Feedback Free'}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
