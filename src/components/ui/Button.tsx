import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  children?: ReactNode;
}

export function Button({ variant = 'primary', size = 'md', icon, children, className, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap';
  const variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-sm',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300',
    ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm',
    outline: 'border border-brand-600 text-brand-600 hover:bg-brand-50',
  };
  const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-sm px-5 py-2.5',
  };

  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {icon}
      {children}
    </button>
  );
}
