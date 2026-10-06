import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import { Check } from 'lucide-react';

interface ToggleProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, disabled }: ToggleProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cn(
        'relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200',
        checked ? 'bg-brand-600' : 'bg-slate-200',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <span
        className={cn(
          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-sm',
          checked ? 'translate-x-4' : 'translate-x-0.5'
        )}
      />
    </button>
  );
}

interface CheckboxProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  label?: ReactNode;
  disabled?: boolean;
  locked?: boolean;
}

export function Checkbox({ checked, onChange, label, disabled, locked }: CheckboxProps) {
  return (
    <label className={cn('flex items-center gap-3 cursor-pointer select-none', disabled && 'cursor-not-allowed opacity-60')}>
      <button
        type="button"
        disabled={disabled || locked}
        onClick={() => onChange?.(!checked)}
        className={cn(
          'w-5 h-5 rounded border flex items-center justify-center transition-all duration-150 flex-shrink-0',
          checked ? 'bg-brand-600 border-brand-600' : 'border-slate-300 bg-white hover:border-brand-400',
          locked && 'bg-slate-100 border-slate-200 cursor-not-allowed'
        )}
      >
        {locked ? (
          <span className="text-slate-400 text-xs">🔒</span>
        ) : checked ? (
          <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
        ) : null}
      </button>
      {label && <span className="text-sm text-slate-700">{label}</span>}
    </label>
  );
}
