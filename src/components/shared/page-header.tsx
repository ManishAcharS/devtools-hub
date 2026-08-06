import React, { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import type { BreadcrumbItem } from '@/types';

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumb?: BreadcrumbItem[];
  icon?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumb,
  icon,
  actions,
  className,
}) => {
  return (
    <header className={cn('mb-10', className)}>
      {breadcrumb && breadcrumb.length > 0 && <Breadcrumb items={breadcrumb} className="mb-6" />}
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3">
            {icon && (
              <span className="bg-primary/10 text-primary flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl">
                {icon}
              </span>
            )}
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          </div>
          {description && <p className="text-muted-foreground mt-3 text-pretty">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
};

PageHeader.displayName = 'PageHeader';

export { PageHeader };
