import React from 'react';
import Link from 'next/link';
import { ArrowRight, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { Button } from '@/components/ui/button';
import { categoryIcons, categoryAccents } from '@/components/ui/category-card';
import { CategoryStats } from '@/components/categories/category-stats';
import type { CategoryStats as CategoryStatsData } from '@/registry';
import type { BreadcrumbItem, CategoryAccent } from '@/types';

interface CategoryHeroProps {
  title: string;
  shortDescription: string;
  icon?: string;
  color?: CategoryAccent;
  stats: CategoryStatsData;
  breadcrumb: BreadcrumbItem[];
}

const CategoryHero: React.FC<CategoryHeroProps> = ({
  title,
  shortDescription,
  icon,
  color,
  stats,
  breadcrumb,
}) => {
  const Icon = (icon && categoryIcons[icon]) || FolderOpen;
  const accent = categoryAccents[color ?? 'primary'] ?? categoryAccents.primary;

  return (
    <header className="mb-10">
      <Breadcrumb items={breadcrumb} className="mb-6" />
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3">
            <span
              className={cn('flex h-12 w-12 items-center justify-center rounded-xl', accent.tile)}
            >
              <Icon className={cn('h-6 w-6', accent.text)} aria-hidden="true" />
            </span>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title} Tools</h1>
          </div>
          <p className="text-muted-foreground mt-3 text-pretty">{shortDescription}</p>
        </div>
        <div className="flex flex-col items-start gap-4">
          <CategoryStats stats={stats} />
          <div className="flex flex-wrap gap-2">
            <Button size="sm" asChild>
              <Link href="#tools">
                Browse tools
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href="/categories">All categories</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

CategoryHero.displayName = 'CategoryHero';

export { CategoryHero };
