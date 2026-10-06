import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface SkeletonProps {
  className?: string;
  children?: ReactNode;
}

export function Skeleton({ className, children }: SkeletonProps) {
  if (children) {
    return <div className={cn('animate-pulse', className)}>{children}</div>;
  }
  return <div className={cn('skeleton rounded-md', className)} />;
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}
