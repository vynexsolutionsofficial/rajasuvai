import React, { createContext, useContext, useState, useCallback } from 'react';

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
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

const ICONS: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠'
};

const ToastContainer: React.FC<{ toasts: Toast[]; onDismiss: (id: number) => void }> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;
  return (
    <div style={{
      position: 'fixed', top: '80px', right: '20px', zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: '10px',
      maxWidth: '360px', width: '100%', pointerEvents: 'none'
    }}>
      {toasts.map(toast => (
        <div key={toast.id} className={`toast toast-${toast.type}`} style={{ pointerEvents: 'all' }}>
          <span className="toast-icon">{ICONS[toast.type]}</span>
          <span className="toast-message">{toast.message}</span>
          <button className="toast-close" onClick={() => onDismiss(toast.id)}>✕</button>
        </div>
      ))}
    </div>
  );
};
