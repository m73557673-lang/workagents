import { cn } from '@/lib/utils';
import { avatarColors } from '@/lib/utils';

interface AvatarProps {
  name: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
}

export function Avatar({ name, color = 'blue', size = 'md', icon }: AvatarProps) {
  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  };

  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className={cn('rounded-lg flex items-center justify-center font-semibold flex-shrink-0', avatarColors[color] || avatarColors.blue, sizes[size])}>
      {icon || initials}
    </div>
  );
}
