'use client';

import React from 'react';
import { Wrench, FolderOpen, FileText, GraduationCap } from 'lucide-react';
import type { SearchItemType } from '@/search';
import { cn } from '@/lib/utils';

export type SearchFilterValue = 'all' | SearchItemType;

interface SearchFiltersProps {
  value: SearchFilterValue;
  onChange: (value: SearchFilterValue) => void;
  counts?: Partial<Record<SearchItemType, number>>;
  className?: string;
}

const FILTERS: Array<{ value: SearchFilterValue; label: string; icon?: React.ReactNode }> = [
  { value: 'all', label: 'All' },
  { value: 'tool', label: 'Tools', icon: <Wrench className="h-3.5 w-3.5" aria-hidden="true" /> },
  {
    value: 'category',
    label: 'Categories',
    icon: <FolderOpen className="h-3.5 w-3.5" aria-hidden="true" />,
  },
  {
    value: 'blog',
    label: 'Articles',
    icon: <FileText className="h-3.5 w-3.5" aria-hidden="true" />,
  },
  {
    value: 'resource',
    label: 'Resources',
    icon: <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />,
  },
];

const SearchFilters: React.FC<SearchFiltersProps> = ({ value, onChange, counts, className }) => {
  return (
    <div
      role="group"
      aria-label="Filter search results"
      className={cn('flex flex-wrap items-center gap-2', className)}
    >
      {FILTERS.map((filter) => {
        const active = value === filter.value;
        const count =
          filter.value === 'all'
            ? undefined
            : (counts?.[filter.value as SearchItemType] ?? undefined);
        return (
          <button
            key={filter.value}
            type="button"
            onClick={() => onChange(filter.value)}
            aria-pressed={active}
            className={cn(
              'hover-glow focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
              active
                ? 'border-primary/40 bg-primary/10 text-primary'
                : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            {filter.icon}
            {filter.label}
            {count !== undefined && (
              <span
                className={cn('text-xs', active ? 'text-primary/70' : 'text-muted-foreground/70')}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export { SearchFilters };
