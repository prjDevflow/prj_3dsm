import { createContext, useCallback, useContext, useRef, useState } from "react";
import { CheckCircle, X, AlertCircle, Info, AlertTriangle } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
}

interface ToastContextType {
  success: (msg: string, duration?: number) => void;
  error:   (msg: string, duration?: number) => void;
  warning: (msg: string, duration?: number) => void;
  info:    (msg: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};

const CONFIG: Record<ToastType, { Icon: typeof CheckCircle; bar: string; bg: string; border: string; text: string }> = {
  success: { Icon: CheckCircle,    bar: "bg-emerald-500", bg: "bg-emerald-50",  border: "border-emerald-200", text: "text-emerald-800" },
  error:   { Icon: AlertCircle,    bar: "bg-rose-500",    bg: "bg-rose-50",     border: "border-rose-200",    text: "text-rose-800"    },
  warning: { Icon: AlertTriangle,  bar: "bg-amber-500",   bg: "bg-amber-50",    border: "border-amber-200",   text: "text-amber-800"   },
  info:    { Icon: Info,           bar: "bg-blue-500",    bg: "bg-blue-50",     border: "border-blue-200",    text: "text-blue-800"    },
};

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const { Icon, bar, bg, border, text } = CONFIG[toast.type];
  return (
    <div
      className={`relative flex items-start gap-3 w-80 rounded-xl border ${bg} ${border} shadow-lg px-4 py-3 overflow-hidden
        animate-[slideInRight_0.25s_ease-out]`}
      style={{ animation: "slideInRight 0.25s ease-out" }}
    >
      {/* progress bar */}
      <div
        className={`absolute bottom-0 left-0 h-0.5 ${bar} rounded-full`}
        style={{ animation: `shrink ${toast.duration}ms linear forwards` }}
      />

      <Icon size={18} className={`${text} flex-shrink-0 mt-0.5`} />

      <p className={`text-sm font-medium flex-1 leading-snug ${text}`}>{toast.message}</p>

      <button onClick={onClose} className={`${text} opacity-60 hover:opacity-100 flex-shrink-0 transition-opacity`}>
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const add = useCallback((type: ToastType, message: string, duration = 3500) => {
    const id = `toast-${++counter.current}`;
    setToasts((prev) => [...prev.slice(-4), { id, type, message, duration }]);
    setTimeout(() => remove(id), duration);
  }, [remove]);

  const ctx: ToastContextType = {
    success: (msg, d) => add("success", msg, d),
    error:   (msg, d) => add("error",   msg, d),
    warning: (msg, d) => add("warning", msg, d),
    info:    (msg, d) => add("info",    msg, d),
  };

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onClose={() => remove(t.id)} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
