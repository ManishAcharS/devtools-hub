import React, { forwardRef, type HTMLAttributes } from 'react';
import {
  ChevronRight,
  Database,
  Layout,
  Server,
  ShieldCheck,
  Activity,
  Lock,
  GitBranch,
  Zap,
  Palette,
  Users,
  Cloud,
  Plug,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import type { Category } from '@/types';

interface CategoryCardProps extends HTMLAttributes<HTMLDivElement> {
  category: Category;
  showToolCount?: boolean;
}

const iconBySlug: Record<string, LucideIcon> = {
  'api-development': Plug,
  databases: Database,
  frontend: Layout,
  backend: Server,
  testing: ShieldCheck,
  monitoring: Activity,
  security: Lock,
  'ci-cd': GitBranch,
  productivity: Zap,
  design: Palette,
  collaboration: Users,
  infrastructure: Cloud,
};

const CategoryCard = forwardRef<HTMLDivElement, CategoryCardProps>(
  ({ className, category, showToolCount = true, ...props }, ref) => {
    const Icon = iconBySlug[category.slug] ?? Plug;

    return (
      <Card
        ref={ref}
        className={cn('hover-lift group hover:border-primary/30 flex h-full flex-col', className)}
        {...props}
      >
        <CardContent className="flex flex-1 flex-col p-6">
          <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg transition-transform group-hover:scale-105">
            <Icon className="text-primary h-6 w-6" aria-hidden="true" />
          </div>
          <h3 className="text-foreground mb-2 text-lg font-semibold">{category.name}</h3>
          <p className="text-muted-foreground mb-4 line-clamp-2 flex-1 text-sm">
            {category.description}
          </p>
          <div className="border-border/50 flex items-center justify-between border-t pt-2">
            {showToolCount && (
              <span className="text-muted-foreground text-sm">{category.toolCount} tools</span>
            )}
            <span className="text-primary flex items-center gap-1 text-sm font-medium opacity-0 transition-opacity group-hover:opacity-100">
              View
              <ChevronRight className="h-3 w-3" aria-hidden="true" />
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }
);

CategoryCard.displayName = 'CategoryCard';

export { CategoryCard };
