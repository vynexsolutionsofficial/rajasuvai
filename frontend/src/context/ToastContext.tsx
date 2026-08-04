import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Check, X, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/cn';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

let nextId = 1;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

const TOAST_STYLES: Record<ToastType, { wrap: string; icon: React.ReactNode }> = {
  success: { wrap: 'border-l-fresh-500', icon: <Check size={16} className="text-fresh-600" /> },
  error: { wrap: 'border-l-error-500', icon: <X size={16} className="text-error-600" /> },
  info: { wrap: 'border-l-brand-500', icon: <Info size={16} className="text-brand-600" /> },
  warning: { wrap: 'border-l-amber-500', icon: <AlertTriangle size={16} className="text-amber-600" /> },
};

const ToastContainer: React.FC<{ toasts: Toast[]; onDismiss: (id: number) => void }> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;
  return createPortal(
    <div className="pointer-events-none fixed top-20 right-4 z-[9999] flex w-full max-w-90 flex-col gap-2.5">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'pointer-events-auto flex items-center gap-2.5 rounded-xl border border-black/5 border-l-4 bg-white px-4 py-3 shadow-lg',
            TOAST_STYLES[toast.type].wrap
          )}
        >
          {TOAST_STYLES[toast.type].icon}
          <span className="flex-1 text-sm font-medium text-brand-950">{toast.message}</span>
          <button
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss"
            className="flex size-6 shrink-0 items-center justify-center rounded-full text-black/35 hover:bg-black/5"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>,
    document.body
  );
};
