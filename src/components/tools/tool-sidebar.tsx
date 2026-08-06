import React from 'react';
import Link from 'next/link';
import { FolderOpen, Tag, CalendarDays, Star, Layers } from 'lucide-react';
import type { ToolDefinition } from '@/types';
import { getCategoryBySlug, getToolsByCategory } from '@/registry';

interface ToolSidebarProps {
  definition: ToolDefinition;
  className?: string;
}

const ToolSidebar: React.FC<ToolSidebarProps> = ({ definition, className }) => {
  const category = getCategoryBySlug(definition.category);
  const categoryTools = getToolsByCategory(definition.category).filter(
    (candidate) => candidate.slug !== definition.slug
  );

  const facts = [
    {
      icon: FolderOpen,
      label: 'Category',
      value: category ? (
        <Link
          href={`/categories/${category.slug}`}
          className="text-primary hover:text-primary/80 font-medium"
        >
          {category.name}
        </Link>
      ) : (
        definition.category.replace(/-/g, ' ')
      ),
    },
    {
      icon: Layers,
      label: 'Pricing',
      value: definition.pricing.replace(/-/g, ' '),
    },
    ...(definition.rating !== undefined
      ? [
          {
            icon: Star,
            label: 'Rating',
            value: `${definition.rating.toFixed(1)}${definition.reviewsCount !== undefined ? ` (${definition.reviewsCount.toLocaleString()} reviews)` : ''}`,
          },
        ]
      : []),
    {
      icon: CalendarDays,
      label: 'Updated',
      value: new Date(definition.updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    },
  ];

  return (
    <div className={`space-y-5 ${className ?? ''}`}>
      <div className="border-border bg-card rounded-xl border p-5">
        <h3 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          Tool facts
        </h3>
        <dl className="mt-4 space-y-3">
          {facts.map((fact) => (
            <div key={fact.label} className="flex items-start justify-between gap-3">
              <dt className="text-muted-foreground flex items-center gap-2 text-sm">
                <fact.icon className="h-4 w-4" aria-hidden="true" />
                {fact.label}
              </dt>
              <dd className="text-foreground text-right text-sm font-medium">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {definition.tags.length > 0 && (
        <div className="border-border bg-card rounded-xl border p-5">
          <h3 className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
            <Tag className="h-3.5 w-3.5" aria-hidden="true" />
            Tags
          </h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {definition.tags.map((tag) => (
              <span
                key={tag}
                className="text-muted-foreground bg-muted rounded-full px-2.5 py-1 text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {categoryTools.length > 0 && (
        <div className="border-border bg-card rounded-xl border p-5">
          <h3 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            More in {category?.name ?? 'this category'}
          </h3>
          <ul className="mt-4 space-y-1">
            {categoryTools.slice(0, 5).map((tool) => (
              <li key={tool.id}>
                <Link
                  href={`/tools/${tool.slug}`}
                  className="text-muted-foreground hover:bg-muted hover:text-foreground block truncate rounded-lg px-3 py-2 text-sm transition-colors"
                >
                  {tool.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

ToolSidebar.displayName = 'ToolSidebar';

export { ToolSidebar };
