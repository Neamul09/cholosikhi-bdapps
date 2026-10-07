import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { clsx } from 'clsx';
import { useToastStore, type Toast, type ToastKind } from '@/store/toastStore';

const ICONS: Record<ToastKind, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: AlertCircle,
  warn: AlertTriangle,
  info: Info,
};

const STYLES: Record<ToastKind, string> = {
  success: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
  error: 'bg-rose-500/15 border-rose-500/40 text-rose-300',
  warn: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
  info: 'bg-blue-500/15 border-blue-500/40 text-blue-300',
};

function ToastItem({ toast: t }: { toast: Toast }) {
  const dismiss = useToastStore((s) => s.dismiss);
  const Icon = ICONS[t.kind];

  // Allow Esc to dismiss the most recent toast
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss(t.id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [t.id, dismiss]);

  return (
    <motion.div
      layout
      role={t.kind === 'error' ? 'alert' : 'status'}
      aria-live={t.kind === 'error' ? 'assertive' : 'polite'}
      initial={{ opacity: 0, y: -16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      className={clsx(
        'pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-2xl border backdrop-blur-md shadow-2xl max-w-sm',
        STYLES[t.kind],
      )}
    >
      <Icon size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
      <p className="text-sm font-bold leading-snug flex-1">{t.message}</p>
      <button
        onClick={() => dismiss(t.id)}
        aria-label="Dismiss notification"
        className="opacity-60 hover:opacity-100 transition-opacity"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </motion.div>
  );
}

export default function Toaster() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div
      aria-label="Notifications"
      className="fixed top-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none w-full max-w-sm"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </AnimatePresence>
    </div>
  );
}