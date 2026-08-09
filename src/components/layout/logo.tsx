import Link from 'next/link';
import { Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  href?: string;
  variant?: 'default' | 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  href = '/',
  variant = 'default',
  size = 'md',
  showText = true,
  className,
}) => {
  const sizeClasses = {
    sm: { container: 'h-8', icon: 'h-5 w-5', text: 'text-lg' },
    md: { container: 'h-9', icon: 'h-6 w-6', text: 'text-xl' },
    lg: { container: 'h-11', icon: 'h-7 w-7', text: 'text-2xl' },
  };

  const s = sizeClasses[size];

  const textColor =
    variant === 'light'
      ? 'text-white'
      : variant === 'dark'
        ? 'text-slate-950 dark:text-white'
        : 'text-foreground';

  const content = (
    <>
      <span className="from-primary to-accent flex items-center justify-center rounded-lg bg-gradient-to-br p-1.5 text-white">
        <Wrench className={s.icon} aria-hidden="true" />
      </span>
      {showText && (
        <span className={cn('font-bold tracking-tight', s.text, textColor)}>
          Toolbox<span className="text-muted-foreground"> for </span>
          <span className="text-primary">Devs</span>
        </span>
      )}
    </>
  );

  return (
    <Link
      href={href}
      className={cn('flex shrink-0 items-center gap-2', s.container, className)}
      aria-label="Toolbox for Devs - Home"
    >
      {content}
    </Link>
  );
};

Logo.displayName = 'Logo';

export { Logo };
