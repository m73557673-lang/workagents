import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  trend?: number;
  trendLabel?: string;
  className?: string;
}

export function StatCard({ label, value, icon: Icon, iconColor = 'text-brand-600 bg-brand-50', trend, trendLabel, className }: StatCardProps) {
  return (
    <div className={cn('bg-white rounded-xl border border-slate-200 shadow-card p-5', className)}>
      <div className="flex items-center justify-between">
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', iconColor)}>
          <Icon className="w-5 h-5" />
        </div>
        {trend !== undefined && (
          <div className={cn(
            'flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md',
            trend >= 0 ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
          )}>
            {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend > 0 ? '+' : ''}{trend}{typeof trend === 'number' && trend % 1 !== 0 ? '%' : '%'}
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-slate-900 tabular-nums">{value}</p>
        <p className="text-sm text-slate-500 mt-0.5">{label}</p>
        {trendLabel && <p className="text-xs text-slate-400 mt-1">{trendLabel}</p>}
      </div>
    </div>
  );
}
