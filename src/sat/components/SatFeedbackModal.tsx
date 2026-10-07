import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Send,
  MessageSquare,
  Star,
  Bug,
  Lightbulb,
  Heart,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { clsx } from 'clsx';
import { play } from '../../lib/audio';

interface SatFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FeedbackCategory = 'question_bug' | 'desmos_math' | 'suggestion' | 'praise';

export default function SatFeedbackModal({ isOpen, onClose }: SatFeedbackModalProps) {
  const [category, setCategory] = useState<FeedbackCategory>('suggestion');
  const [rating, setRating] = useState<number>(5);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const categories: { id: FeedbackCategory; label: string; icon: typeof Bug; color: string }[] = [
    { id: 'question_bug', label: 'Question Issue / Typo', icon: Bug, color: 'text-rose-400' },
    { id: 'desmos_math', label: 'Desmos / Formula Bug', icon: AlertCircle, color: 'text-cyan-400' },
    { id: 'suggestion', label: 'Feature Suggestion', icon: Lightbulb, color: 'text-amber-400' },
    { id: 'praise', label: 'Praise & Love', icon: Heart, color: 'text-pink-400' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setErrorMsg('Please enter your feedback message.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const payload = {
      name: name || 'SAT Student',
      email: email || 'student@cholosikhi.com',
      product: 'Digital SAT Suite',
      category,
      rating: `${rating} / 5 stars`,
      message: message.trim(),
      path: window.location.pathname,
      submittedAt: new Date().toISOString(),
      _subject: `[CholoSikhi SAT Feedback] ${category.toUpperCase()} from ${name || 'Student'}`,
      _template: 'table',
      _captcha: 'false',
    };

    try {
      const res = await fetch('https://formsubmit.co/ajax/neamulmorshed@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        play('achievement');
        setIsSuccess(true);
      } else {
        throw new Error('Server returned error');
      }
    } catch {
      // Direct mailto fallback
      const mailtoUrl = `mailto:neamulmorshed@gmail.com?subject=${encodeURIComponent(
        `CholoSikhi SAT Feedback [${category}]`
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-panel-solid border-2 border-border-subtle rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-app-fg space-y-6"
        >
          {/* Close Button */}
          <button
            onClick={() => { play('tap'); handleResetAndClose(); }}
            className="absolute top-5 right-5 p-2 rounded-xl bg-panel border border-border-subtle hover:bg-white/10 text-app-fg/60 hover:text-app-fg transition-all"
          >
            <X size={18} />
          </button>

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Header with Nini */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                  <MessageSquare size={22} />
                </div>
                <div>
                  <h3 className="font-black text-lg text-app-fg">SAT Suite Feedback</h3>
                  <p className="text-xs text-app-fg/50 font-bold">Help us improve the Digital SAT preparation experience</p>
                </div>
              </div>

              {/* Category Pills */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-app-fg/50 block">
                  Feedback Topic
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((c) => {
                    const Icon = c.icon;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => { play('tap'); setCategory(c.id); }}
                        className={clsx(
                          "p-2.5 rounded-xl border text-left text-xs font-black transition-all flex items-center gap-2",
                          category === c.id
                            ? "bg-blue-500/15 border-blue-500 text-blue-400 shadow-sm"
                            : "bg-panel border-border-subtle text-app-fg/70 hover:border-app-fg/30"
                        )}
                      >
                        <Icon size={14} className={c.color} />
                        <span className="truncate">{c.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Star Rating */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-app-fg/50 block">
                  SAT Platform Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => { play('tap'); setRating(star); }}
                      className="p-1 text-amber-400 hover:scale-125 transition-transform"
                    >
                      <Star size={22} fill={star <= rating ? "currentColor" : "none"} />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-app-fg/50 ml-2">{rating} of 5</span>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-app-fg/50 block">
                  Your Thoughts or Report
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what question, feature, or tool we should refine..."
                  className="w-full px-4 py-3 rounded-2xl bg-app-bg border border-border-subtle focus:border-blue-500 text-xs font-bold text-app-fg outline-none transition-all resize-none"
                />
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name (Optional)"
                  className="px-3.5 py-2.5 rounded-xl bg-app-bg border border-border-subtle focus:border-blue-500 text-xs font-bold text-app-fg outline-none transition-all"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email (Optional)"
                  className="px-3.5 py-2.5 rounded-xl bg-app-bg border border-border-subtle focus:border-blue-500 text-xs font-bold text-app-fg outline-none transition-all"
                />
              </div>

              {errorMsg && (
                <p className="text-xs font-bold text-rose-400">{errorMsg}</p>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-duo btn-duo-green w-full py-3.5 text-xs flex items-center justify-center gap-2"
              >
                <Send size={14} />
                <span>{isSubmitting ? 'Sending Feedback...' : 'Submit Feedback'}</span>
              </button>
            </form>
          ) : (
            /* Success Screen */
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-xl text-app-fg">Thank You!</h3>
                <p className="text-xs text-app-fg/60 font-bold max-w-xs mx-auto">
                  Your feedback helps us make CholoSikhi SAT the most effective preparation tool for learners.
                </p>
              </div>
              <button
                onClick={() => { play('tap'); handleResetAndClose(); }}
                className="btn-duo btn-duo-blue px-8 py-2.5 text-xs"
              >
                Close
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
