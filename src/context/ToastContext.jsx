import React, { createContext, useContext, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove setelah 3 detik
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Container Toast */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 w-full max-w-[320px] px-4 sm:px-0">
        {toasts.map((t) => (
          <div 
            key={t.id}
            className={`flex items-center justify-between p-4 rounded-2xl shadow-2xl border animate-in fade-in slide-in-from-bottom-5 duration-300 ${
              t.type === 'success' ? 'bg-white border-green-100' : 'bg-white border-red-100'
            }`}
          >
            <div className="flex items-center gap-3">
              {t.type === 'success' ? (
                <CheckCircle className="text-green-500 w-5 h-5" />
              ) : (
                <XCircle className="text-red-500 w-5 h-5" />
              )}
              <p className="text-sm font-bold text-slate-700">{t.message}</p>
            </div>
            <button onClick={() => removeToast(t.id)} className="text-slate-300 hover:text-slate-500">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);