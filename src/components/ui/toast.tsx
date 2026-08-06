'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastInput {
  type?: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  toast: (input: ToastInput) => void;
  success: (title: string, description?: string, duration?: number) => void;
  error: (title: string, description?: string, duration?: number) => void;
  warning: (title: string, description?: string, duration?: number) => void;
  info: (title: string, description?: string, duration?: number) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION = 4000;
const MAX_TOASTS = 5;

type Listener = (toasts: ToastItem[]) => void;

let toastStore: ToastItem[] = [];
const listeners = new Set<Listener>();

function emitToast(item: ToastInput) {
  const id = Math.random().toString(36).substring(2, 11);
  const toastItem: ToastItem = { ...item, type: item.type ?? 'info', id };
  toastStore = [...toastStore, toastItem].slice(-MAX_TOASTS);
  listeners.forEach((listener) => listener(toastStore));
  if (item.duration !== 0) {
    setTimeout(() => {
      toastStore = toastStore.filter((t) => t.id !== id);
      listeners.forEach((listener) => listener(toastStore));
    }, item.duration ?? DEFAULT_DURATION);
  }
}

function dismissToast(id: string) {
  toastStore = toastStore.filter((t) => t.id !== id);
  listeners.forEach((listener) => listener(toastStore));
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export const toast: Pick<
  ToastContextValue,
  'toast' | 'success' | 'error' | 'warning' | 'info' | 'dismiss' | 'dismissAll'
> = {
  toast: emitToast,
  success: (title, description, duration) =>
    emitToast({ type: 'success', title, description, duration }),
  error: (title, description, duration) =>
    emitToast({ type: 'error', title, description, duration }),
  warning: (title, description, duration) =>
    emitToast({ type: 'warning', title, description, duration }),
  info: (title, description, duration) => emitToast({ type: 'info', title, description, duration }),
  dismiss: dismissToast,
  dismissAll: () => {
    toastStore = [];
    listeners.forEach((listener) => listener(toastStore));
  },
};

interface ToastProviderProps {
  children: ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

function ToastProvider({ children, position = 'bottom-right' }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const listener: Listener = (next) => setToasts(next);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const dismiss = useCallback((id: string) => {
    dismissToast(id);
  }, []);

  const dismissAll = useCallback(() => {
    toastStore = [];
    listeners.forEach((listener) => listener(toastStore));
  }, []);

  const value = useMemo<ToastContextValue>(
    () => ({
      toast: emitToast,
      success: (title, description, duration) =>
        emitToast({ type: 'success', title, description, duration }),
      error: (title, description, duration) =>
        emitToast({ type: 'error', title, description, duration }),
      warning: (title, description, duration) =>
        emitToast({ type: 'warning', title, description, duration }),
      info: (title, description, duration) =>
        emitToast({ type: 'info', title, description, duration }),
      dismiss,
      dismissAll,
    }),
    [dismiss, dismissAll]
  );

  const positionClasses = {
    'top-right': 'top-4 right-4 items-end',
    'top-left': 'top-4 left-4 items-start',
    'bottom-right': 'bottom-4 right-4 items-end',
    'bottom-left': 'bottom-4 left-4 items-start',
  };

  const iconMap = {
    success: <CheckCircle2 className="h-5 w-5 text-green-500" aria-hidden="true" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />,
    warning: <AlertTriangle className="h-5 w-5 text-yellow-500" aria-hidden="true" />,
    info: <Info className="h-5 w-5 text-blue-500" aria-hidden="true" />,
  };

  const accentMap = {
    success: 'border-l-green-500',
    error: 'border-l-red-500',
    warning: 'border-l-yellow-500',
    info: 'border-l-blue-500',
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className={cn(
          'pointer-events-none fixed z-[800] flex flex-col gap-3 p-4',
          positionClasses[position]
        )}
        role="region"
        aria-label="Notifications"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            aria-live="polite"
            className={cn(
              'border-border bg-popover text-popover-foreground animate-in slide-in-from-bottom-2 fade-in pointer-events-auto flex w-80 max-w-full items-start gap-3 rounded-xl border border-l-4 p-4 shadow-lg',
              accentMap[t.type]
            )}
          >
            <div className="mt-0.5 flex-shrink-0">{iconMap[t.type]}</div>
            <div className="min-w-0 flex-1">
              <p className="text-foreground text-sm font-medium">{t.title}</p>
              {t.description && (
                <p className="text-muted-foreground mt-1 text-sm">{t.description}</p>
              )}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="text-muted-foreground hover:text-foreground hover:bg-muted flex-shrink-0 rounded-md p-1 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export { ToastProvider };
