import React, { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { CopyButton } from '@/components/shared/copy-button';

interface ExampleBoxProps {
  title?: string;
  description?: string;
  code?: string;
  language?: string;
  children?: ReactNode;
  variant?: 'default' | 'bordered' | 'terminal' | 'highlighted';
  icon?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

const ExampleBox: React.FC<ExampleBoxProps> = ({
  title,
  description,
  code,
  language = 'text',
  children,
  variant = 'default',
  icon,
  footer,
  className,
}) => {
  const variants = {
    default: 'border-border bg-card',
    bordered: 'border-2 border-border bg-card',
    terminal: 'border-border bg-slate-950 text-slate-100',
    highlighted: 'border-primary/30 bg-primary/5 border',
  };

  const titleVariants = {
    default: 'border-b border-border',
    bordered: 'border-b border-border',
    terminal: 'border-b border-slate-800',
    highlighted: 'border-b border-primary/20',
  };

  const codeVariants = {
    default: 'bg-muted/50 text-foreground',
    bordered: 'bg-muted/50 text-foreground',
    terminal: 'bg-slate-900 text-slate-100',
    highlighted: 'bg-background/50 text-foreground',
  };

  return (
    <figure className={cn('overflow-hidden rounded-xl border', variants[variant], className)}>
      {(title || code) && (
        <figcaption
          className={cn('flex items-center justify-between px-4 py-3', titleVariants[variant])}
        >
          <div className="flex min-w-0 items-center gap-2">
            {icon}
            {title && (
              <span
                className={cn(
                  'truncate text-sm font-medium',
                  variant === 'terminal' ? 'text-slate-200' : 'text-foreground'
                )}
              >
                {title}
              </span>
            )}
          </div>
          {code && (
            <CopyButton value={code} variant="minimal" size="sm" iconOnly label="Copy example" />
          )}
        </figcaption>
      )}
      {description && (
        <div
          className={cn(
            'px-4 py-3 text-sm',
            variant === 'terminal' ? 'text-slate-400' : 'text-muted-foreground'
          )}
        >
          {description}
        </div>
      )}
      <div className={cn('px-4 py-4', codeVariants[variant])}>
        {code ? (
          <pre
            className={cn(
              'overflow-x-auto font-mono text-sm leading-relaxed whitespace-pre',
              variant === 'terminal' ? 'text-emerald-400' : 'text-foreground'
            )}
          >
            <code data-language={language}>{code}</code>
          </pre>
        ) : (
          children
        )}
      </div>
      {footer && (
        <div
          className={cn(
            'flex flex-wrap items-center gap-2 border-t px-4 py-3',
            variant === 'terminal'
              ? 'border-slate-800 text-slate-400'
              : 'border-border bg-muted/30 text-muted-foreground'
          )}
        >
          {footer}
        </div>
      )}
    </figure>
  );
};

ExampleBox.displayName = 'ExampleBox';

export { ExampleBox };
