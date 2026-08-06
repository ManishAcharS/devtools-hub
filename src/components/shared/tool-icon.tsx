import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ToolIconProps {
  name: string;
  icon?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: { container: 'h-10 w-10 rounded-lg', icon: 'h-5 w-5', letter: 'text-base' },
  md: { container: 'h-12 w-12 rounded-xl', icon: 'h-6 w-6', letter: 'text-xl' },
  lg: { container: 'h-14 w-14 rounded-xl', icon: 'h-7 w-7', letter: 'text-2xl' },
};

export function ToolIcon({ name, icon, size = 'md', className }: ToolIconProps) {
  const s = sizeClasses[size];

  return (
    <div
      className={cn(
        'bg-primary/10 flex flex-shrink-0 items-center justify-center overflow-hidden',
        s.container,
        className
      )}
      aria-hidden="true"
    >
      {icon ? (
        <Image src={icon} alt="" width={28} height={28} className={cn('object-contain', s.icon)} />
      ) : (
        <span className={cn('text-primary font-bold', s.letter)}>
          {name.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}

ToolIcon.displayName = 'ToolIcon';
