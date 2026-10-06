import type { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: { label: string; onClick: () => void; icon?: ReactNode } | ReactNode;
  children?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {action && (
        <div className="flex-shrink-0">
          {('label' in action) ? (
            <Button onClick={action.onClick} icon={action.icon}>{action.label}</Button>
          ) : action}
        </div>
      )}
    </div>
  );
}
