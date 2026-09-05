import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface ConfirmProps {
  open: boolean;
  title: string;
  body: string;
  confirmText?: string;
  cancelText?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function Confirm({
  open,
  title,
  body,
  confirmText,
  cancelText,
  confirmLabel,
  cancelLabel,
  danger = true,
  onConfirm,
  onCancel
}: ConfirmProps) {
  const confirmBtnLabel = confirmLabel || confirmText || 'Confirm';
  const cancelBtnLabel = cancelLabel || cancelText || 'Cancel';

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Enter') onConfirm();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel, onConfirm]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
          onClick={onCancel}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-panel border-2 border-border-subtle rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div className="space-y-1">
                <h3 id="confirm-title" className="text-xl font-black text-app-fg">{title}</h3>
                <p className="text-sm text-app-fg-muted font-bold leading-relaxed">{body}</p>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={onCancel}
                className="px-5 py-3 rounded-2xl font-bold bg-app-bg border border-border-subtle text-app-fg-muted hover:text-app-fg transition-colors"
              >
                {cancelBtnLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={`px-6 py-3 rounded-2xl font-black text-white transition-all shadow-lg active:scale-95 ${
                  danger
                    ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/30'
                    : 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/30'
                }`}
              >
                {confirmBtnLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}