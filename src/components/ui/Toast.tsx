import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export interface ToastData {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

let toastCounter = 0;
const listeners: ((toast: ToastData) => void)[] = [];

export function showToast(type: ToastData['type'], title: string, message?: string) {
  const toast: ToastData = { id: `toast-${++toastCounter}`, type, title, message };
  listeners.forEach((l) => l(toast));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    const listener = (toast: ToastData) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 4000);
    };
    listeners.push(listener);
    return () => { listeners.splice(listeners.indexOf(listener), 1); };
  }, []);

  const remove = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
    error: <XCircle className="w-5 h-5 text-red-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-600" />,
  };

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'bg-white rounded-lg shadow-elevated border border-slate-200 p-4 flex items-start gap-3 animate-slide-in-right',
          )}
        >
          {icons[toast.type]}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900">{toast.title}</p>
            {toast.message && <p className="text-sm text-slate-500 mt-0.5">{toast.message}</p>}
          </div>
          <button onClick={() => remove(toast.id)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
