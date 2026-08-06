'use client';

import React from 'react';
import Link from 'next/link';
import { Wrench, FolderOpen, FileText, GraduationCap } from 'lucide-react';
import type { SearchItemType, SearchResultItem } from '@/search';
import { SearchHighlight } from '@/components/search/search-highlight';
import { cn } from '@/lib/utils';

export const SEARCH_TYPE_ICONS: Record<SearchItemType, React.ReactNode> = {
  tool: <Wrench className="h-4 w-4" aria-hidden="true" />,
  category: <FolderOpen className="h-4 w-4" aria-hidden="true" />,
  blog: <FileText className="h-4 w-4" aria-hidden="true" />,
  resource: <GraduationCap className="h-4 w-4" aria-hidden="true" />,
};

export const SEARCH_TYPE_LABELS: Record<SearchItemType, string> = {
  tool: 'Tool',
  category: 'Category',
  blog: 'Article',
  resource: 'Resource',
};

interface SearchItemProps {
  result: SearchResultItem;
  active?: boolean;
  onSelect?: (href: string) => void;
}

const SearchItemRow: React.FC<SearchItemProps> = ({ result, active = false, onSelect }) => {
  const { item, matchedTokens } = result;

  return (
    <Link
      href={item.href}
      onClick={() => onSelect?.(item.href)}
      className={cn(
        'flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors',
        active ? 'bg-primary/10' : 'hover:bg-muted/50'
      )}
    >
      <span
        className={cn(
          'mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg',
          active ? 'bg-primary/15 text-primary' : 'bg-primary/10 text-primary'
        )}
      >
        {SEARCH_TYPE_ICONS[item.type]}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <SearchHighlight
            text={item.title}
            tokens={matchedTokens}
            className="text-foreground truncate text-sm font-medium"
          />
          <span className="text-muted-foreground bg-muted rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase">
            {SEARCH_TYPE_LABELS[item.type]}
          </span>
        </span>
        {item.description && (
          <SearchHighlight
            text={item.description}
            tokens={matchedTokens}
            className="text-muted-foreground mt-0.5 line-clamp-1 block text-xs"
          />
        )}
      </span>
      {item.rating !== undefined && (
        <span className="text-muted-foreground mt-1 flex-shrink-0 text-xs">
          {item.rating.toFixed(1)}
        </span>
      )}
    </Link>
  );
};

export { SearchItemRow };
