import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface TabsProps {
  tabs: { id: string; label: string; icon?: ReactNode; count?: number }[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, active, onChange, className }: TabsProps) {
  return (
    <div className={cn('flex items-center gap-1 border-b border-slate-200 overflow-x-auto scrollbar-thin', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'flex items-center gap-2 px-3.5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap',
            active === tab.id
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          )}
        >
          {tab.icon}
          {tab.label}
          {tab.count !== undefined && (
            <span className={cn(
              'text-xs px-1.5 py-0.5 rounded-full font-medium',
              active === tab.id ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-500'
            )}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
