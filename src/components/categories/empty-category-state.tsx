import React from 'react';
import Link from 'next/link';
import { FolderOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { categoryIcons, categoryAccents } from '@/components/ui/category-card';
import { cn } from '@/lib/utils';
import type { CategoryAccent } from '@/types';

interface EmptyCategoryStateProps {
  title?: string;
  description?: string;
  icon?: string;
  color?: CategoryAccent;
}

const EmptyCategoryState: React.FC<EmptyCategoryStateProps> = ({
  title,
  description,
  icon,
  color,
}) => {
  const Icon = (icon && categoryIcons[icon]) || FolderOpen;
  const accent = categoryAccents[color ?? 'primary'] ?? categoryAccents.primary;

  return (
    <section
      aria-label="No tools yet"
      className="border-border bg-card flex flex-col items-center rounded-xl border p-10 text-center"
    >
      <span
        className={cn('mb-4 flex h-14 w-14 items-center justify-center rounded-xl', accent.tile)}
      >
        <Icon className={cn('h-7 w-7', accent.text)} aria-hidden="true" />
      </span>
      <h2 className="text-xl font-bold tracking-tight">
        {title ?? 'No tools in this category yet'}
      </h2>
      <p className="text-muted-foreground mt-2 max-w-md text-sm text-pretty">
        {description ??
          'Tools in this category are being added. Check back soon or explore the full directory.'}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/tools">
            Browse all tools
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/categories">Explore categories</Link>
        </Button>
      </div>
    </section>
  );
};

EmptyCategoryState.displayName = 'EmptyCategoryState';

export { EmptyCategoryState };
