import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ open, onClose, title, subtitle, children, footer, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);

  if (!open) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className={cn('relative bg-white rounded-xl shadow-elevated w-full max-h-[90vh] flex flex-col animate-fade-in', sizes[size])}>
        {(title || subtitle) && (
          <div className="flex items-start justify-between px-6 py-4 border-b border-slate-100">
            <div>
              {title && <h2 className="text-base font-semibold text-slate-900">{title}</h2>}
              {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg p-1 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="overflow-y-auto scrollbar-thin flex-1">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}
