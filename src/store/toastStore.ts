import { create } from 'zustand';

export type ToastKind = 'error' | 'warn' | 'info' | 'success';

export interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
  /** Auto-dismiss after this many ms. Defaults per-kind below. */
  durationMs: number;
}

interface ToastState {
  toasts: Toast[];
  push: (kind: ToastKind, message: string, durationMs?: number) => number;
  dismiss: (id: number) => void;
}

let nextId = 1;

const DEFAULTS: Record<ToastKind, number> = {
  error: 5000,
  warn: 4000,
  info: 3000,
  success: 2500,
};

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  push: (kind, message, durationMs) => {
    const id = nextId++;
    const toast: Toast = {
      id,
      kind,
      message,
      durationMs: durationMs ?? DEFAULTS[kind],
    };
    set({ toasts: [...get().toasts, toast] });
    if (toast.durationMs > 0) {
      setTimeout(() => get().dismiss(id), toast.durationMs);
    }
    return id;
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));

/** Sugar so call sites can do `toast.error('msg')` instead of push('error', ...). */
export const toast = {
  error: (msg: string, durationMs?: number) =>
    useToastStore.getState().push('error', msg, durationMs),
  warn: (msg: string, durationMs?: number) =>
    useToastStore.getState().push('warn', msg, durationMs),
  info: (msg: string, durationMs?: number) =>
    useToastStore.getState().push('info', msg, durationMs),
  success: (msg: string, durationMs?: number) =>
    useToastStore.getState().push('success', msg, durationMs),
};