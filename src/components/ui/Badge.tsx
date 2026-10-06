import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  className?: string;
  dot?: boolean;
  dotColor?: string;
}

export function Badge({ children, variant = 'default', className, dot, dotColor }: BadgeProps) {
  const variants = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    error: 'bg-red-50 text-red-700',
    info: 'bg-blue-50 text-blue-700',
    neutral: 'bg-slate-100 text-slate-500',
  };

  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium', variants[variant], className)}>
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', dotColor)} />}
      {children}
    </span>
  );
}
