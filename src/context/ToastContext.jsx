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
    setToasts((prev) =>
      prev.map(t => t.id === id ? { ...t, exiting: true } : t)
    );

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Container Toast */}
      <div className="fixed top-20 right-5 z-[9999] flex flex-col gap-3 w-full max-w-[320px] px-4 sm:px-0">
        {toasts.map((t) => (
          <div 
            key={t.id}
            className={`relative flex items-center justify-between p-4 rounded-2xl shadow-xl border overflow-hidden ${
              t.type === 'success' 
                ? 'bg-gradient-to-r to-green-300 from-white border-green-100' 
                : t.type === 'error'
                ? 'bg-gradient-to-r to-red-300 from-white border-red-100'
                : 'bg-gradient-to-r to-yellow-300 from-white border-yellow-100'
            } duration-300 ${
              t.exiting 
                ? 'animate-out fade-out slide-out-to-right-5' 
                : 'animate-in fade-in slide-in-from-bottom-5'
            }`}
          >
            {/* Accent Bar */}
            <div className={`absolute left-0 top-0 h-full w-1 ${
              t.type === 'success' ? 'bg-green-500' :
              t.type === 'error' ? 'bg-red-500' :
              'bg-yellow-500'
            }`} />

            <div className="flex items-center gap-3 pl-2">
              {t.type === 'success' ? (
                <CheckCircle className="text-green-500 w-5 h-5" />
              ) : (
                <XCircle className="text-red-500 w-5 h-5" />
              )}
              <p className="text-sm font-bold text-slate-700">{t.message}</p>
            </div>
            <button onClick={() => removeToast(t.id)} className="text-slate-900 hover:text-slate-900">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);