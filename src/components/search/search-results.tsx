'use client';

import React from 'react';
import type { SearchItemType, SearchResultItem } from '@/search';
import { SearchItemRow } from '@/components/search/search-item';
import { cn } from '@/lib/utils';

const GROUP_ORDER: SearchItemType[] = ['tool', 'category', 'blog', 'resource'];

interface SearchResultsProps {
  results: SearchResultItem[];
  query: string;
  activeIndex?: number;
  onSelect?: (href: string) => void;
  onSeeAll?: (type: SearchItemType) => void;
  className?: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  query,
  activeIndex = -1,
  onSelect,
  onSeeAll,
  className,
}) => {
  const grouped = GROUP_ORDER.map((type) => ({
    type,
    items: results.filter((result) => result.item.type === type),
  })).filter((group) => group.items.length > 0);

  if (grouped.length === 0) return null;

  let globalIndex = 0;

  return (
    <div className={cn('py-2', className)}>
      <p className="text-muted-foreground px-4 pt-1 pb-2 text-xs">
        {results.length} result{results.length === 1 ? '' : 's'} for &quot;{query}&quot;
      </p>
      {grouped.map((group) => (
        <div key={group.type} className="mb-1">
          <div className="text-muted-foreground flex items-center justify-between px-4 pt-2 pb-1">
            <span className="text-xs font-medium tracking-wide uppercase">{group.type}s</span>
            {onSeeAll && (
              <button
                type="button"
                onClick={() => onSeeAll(group.type)}
                className="text-primary hover:text-primary/80 text-xs font-medium transition-colors"
              >
                See all
              </button>
            )}
          </div>
          {group.items.map((result) => {
            const index = globalIndex++;
            return (
              <SearchItemRow
                key={result.item.id}
                result={result}
                active={index === activeIndex}
                onSelect={onSelect}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export { SearchResults };
