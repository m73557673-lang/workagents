import { cn } from '@/lib/utils';
import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  icon?: ReactNode;
}

export function Input({ label, hint, icon, className, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>}
        <input
          className={cn(
            'w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 placeholder:text-slate-400',
            'focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all',
            icon && 'pl-10',
            className
          )}
          {...props}
        />
      </div>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
}

export function Textarea({ label, hint, className, ...props }: TextareaProps) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}
      <textarea
        className={cn(
          'w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 placeholder:text-slate-400',
          'focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none',
          className
        )}
        {...props}
      />
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, hint, options, className, ...props }: SelectProps) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}
      <select
        className={cn(
          'w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-900',
          'focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all cursor-pointer',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
