import React, { useState, useEffect } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

export const toastEventName = "SHOW_TOAST";

export const toast = {
  error: (message) => window.dispatchEvent(new CustomEvent(toastEventName, { detail: { type: "error", message } })),
  success: (message) => window.dispatchEvent(new CustomEvent(toastEventName, { detail: { type: "success", message } })),
  info: (message) => window.dispatchEvent(new CustomEvent(toastEventName, { detail: { type: "info", message } })),
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (e) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, ...e.detail }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    };

    window.addEventListener(toastEventName, handleToast);
    return () => window.removeEventListener(toastEventName, handleToast);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} className="flex items-center gap-3 px-4 py-3 bg-[#101413] border border-white/10 shadow-lg rounded-xl text-sm text-white animate-fade-in min-w-[250px]">
          {t.type === "error" && <AlertCircle className="text-status-error w-5 h-5 shrink-0" />}
          {t.type === "success" && <CheckCircle2 className="text-status-success w-5 h-5 shrink-0" />}
          {t.type === "info" && <Info className="text-accent w-5 h-5 shrink-0" />}
          <span className="flex-1">{t.message}</span>
          <button onClick={() => setToasts((prev) => prev.filter(toast => toast.id !== t.id))} className="text-text-muted hover:text-white focus:outline-none shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
