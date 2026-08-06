import React, { type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  description,
  icon,
  actionLabel,
  actionHref,
  className,
}) => {
  return (
    <div className={cn('mb-8 flex items-end justify-between gap-4', className)}>
      <div>
        <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {icon && <span className="text-primary">{icon}</span>}
          {title}
        </h2>
        {description && <p className="text-muted-foreground mt-2 text-pretty">{description}</p>}
      </div>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="text-primary hover:text-primary/80 group focus-visible:ring-ring hidden shrink-0 items-center gap-1.5 rounded-md px-1 py-0.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none sm:inline-flex"
        >
          {actionLabel}
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      )}
    </div>
  );
};

SectionHeading.displayName = 'SectionHeading';

export { SectionHeading };
