import React, { Fragment } from 'react';
import Link from 'next/link';
import { ChevronRight, Home, Slash } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  homeHref?: string;
  separator?: 'chevron' | 'slash' | 'dot';
  className?: string;
  ariaLabel?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  showHome = true,
  homeHref = '/',
  separator = 'chevron',
  className,
  ariaLabel = 'Breadcrumb',
}) => {
  const allItems: BreadcrumbItem[] = showHome
    ? [{ label: 'Home', href: homeHref }, ...items]
    : items;

  const Separator: React.FC = () => {
    switch (separator) {
      case 'slash':
        return <Slash className="text-muted-foreground/50 h-4 w-4" aria-hidden="true" />;
      case 'dot':
        return (
          <span className="bg-muted-foreground/40 h-1.5 w-1.5 rounded-full" aria-hidden="true" />
        );
      case 'chevron':
      default:
        return <ChevronRight className="text-muted-foreground/50 h-4 w-4" aria-hidden="true" />;
    }
  };

  return (
    <nav aria-label={ariaLabel} className={cn('flex items-center', className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          const itemContent = (
            <Fragment key={`${item.label}-${index}`}>
              {index > 0 && <Separator />}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={cn(
                    'text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex items-center gap-1 rounded px-1 py-0.5 transition-colors focus-visible:ring-2 focus-visible:outline-none',
                    index === 0 && 'gap-1.5'
                  )}
                >
                  {index === 0 && showHome && <Home className="h-3.5 w-3.5" aria-hidden="true" />}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={cn(
                    'px-1 py-0.5',
                    isLast ? 'text-foreground font-medium' : 'text-muted-foreground'
                  )}
                >
                  {item.label}
                </span>
              )}
            </Fragment>
          );
          return (
            <li key={`${item.label}-${index}`} className="inline-flex items-center">
              {itemContent}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

Breadcrumb.displayName = 'Breadcrumb';

export { Breadcrumb };
