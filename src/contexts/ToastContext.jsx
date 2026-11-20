// src/contexts/ToastContext.jsx
import { createContext, useCallback, useContext, useRef, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' }
  const timerRef = useRef(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(null), 3200);
  }, []);

  const success = useCallback((msg) => showToast(msg, 'success'), [showToast]);
  const error = useCallback((msg) => showToast(msg, 'error'), [showToast]);

  const isError = toast?.type === 'error';

  return (
    <ToastContext.Provider value={{ showToast, success, error }}>
      {children}

      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-none fixed bottom-6 right-6 z-50 flex items-center gap-2.5 max-w-[90vw] rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 ${
          isError ? 'bg-[#B5473C]' : 'bg-[#14573f]'
        } ${toast ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
      >
        <span className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center text-xs shrink-0">
          {isError ? '!' : '✓'}
        </span>
        <span>{toast?.message}</span>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast deve ser usado dentro de ToastProvider');
  return ctx;
}