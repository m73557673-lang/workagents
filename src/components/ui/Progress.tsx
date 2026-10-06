import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  color?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export function Progress({ value, max = 100, className, color = 'bg-brand-600', showLabel, size = 'md' }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const height = size === 'sm' ? 'h-1.5' : 'h-2';

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('w-full bg-slate-100 rounded-full overflow-hidden', height)}>
        <div
          className={cn('h-full rounded-full transition-all duration-500', color)}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && <p className="text-xs text-slate-500 mt-1">{Math.round(pct)}%</p>}
    </div>
  );
}
