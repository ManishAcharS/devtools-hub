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
  Braces,
  CodeXml,
  ListTree,
  Table,
  Type,
  Regex,
  Binary,
  KeyRound,
  DatabaseZap,
  FileText,
  SwatchBook,
  Globe,
  Image as ImageIcon,
  FileType2,
  CalendarClock,
  Calculator,
  Code,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import type { Category } from '@/types';

interface CategoryCardProps extends HTMLAttributes<HTMLDivElement> {
  category: Category;
  showToolCount?: boolean;
}

export const categoryIcons: Record<string, LucideIcon> = {
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
  json: Braces,
  xml: CodeXml,
  yaml: ListTree,
  csv: Table,
  text: Type,
  regex: Regex,
  encoding: Binary,
  'security-tools': KeyRound,
  sql: DatabaseZap,
  markdown: FileText,
  color: SwatchBook,
  network: Globe,
  images: ImageIcon,
  pdf: FileType2,
  'date-time': CalendarClock,
  numbers: Calculator,
  programming: Code,
  web: Globe,
};

export function getCategoryIcon(slug: string): LucideIcon {
  return categoryIcons[slug] ?? Plug;
}

export const categoryAccents: Record<string, { tile: string; text: string }> = {
  primary: { tile: 'bg-primary/10', text: 'text-primary' },
  blue: { tile: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400' },
  emerald: { tile: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400' },
  violet: { tile: 'bg-violet-500/10', text: 'text-violet-600 dark:text-violet-400' },
  amber: { tile: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400' },
  rose: { tile: 'bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400' },
  cyan: { tile: 'bg-cyan-500/10', text: 'text-cyan-600 dark:text-cyan-400' },
};

export function getCategoryAccentClasses(color?: string): { tile: string; text: string } {
  return categoryAccents[color ?? 'primary'] ?? categoryAccents.primary;
}

const CategoryCard = forwardRef<HTMLDivElement, CategoryCardProps>(
  ({ className, category, showToolCount = true, ...props }, ref) => {
    const Icon = categoryIcons[category.slug] ?? Plug;
    const accent = getCategoryAccentClasses(category.color);

    return (
      <Card
        ref={ref}
        className={cn('hover-lift group hover:border-primary/30 flex h-full flex-col', className)}
        {...props}
      >
        <CardContent className="flex flex-1 flex-col p-6">
          <div
            className={cn(
              'mb-4 flex h-12 w-12 items-center justify-center rounded-lg transition-transform group-hover:scale-105',
              accent.tile
            )}
          >
            <Icon className={cn('h-6 w-6', accent.text)} aria-hidden="true" />
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
