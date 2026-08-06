'use client';

import React from 'react';
import Link from 'next/link';
import { Search, CornerDownLeft, Clock, X } from 'lucide-react';
import type { SearchSuggestion } from '@/search';
import { cn } from '@/lib/utils';

interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  activeIndex?: number;
  onSelect?: (suggestion: SearchSuggestion) => void;
}

interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  activeIndex?: number;
  onSelect?: (suggestion: SearchSuggestion) => void;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  activeIndex = -1,
  onSelect,
}) => {
  if (suggestions.length === 0) return null;
  return (
    <div className="py-2">
      {suggestions.map((suggestion, index) => (
        <SuggestionRow
          key={`${suggestion.type}-${suggestion.value}`}
          suggestion={suggestion}
          active={index === activeIndex}
          onSelect={() => onSelect?.(suggestion)}
        />
      ))}
    </div>
  );
};

const SuggestionRow: React.FC<{
  suggestion: SearchSuggestion;
  active: boolean;
  onSelect: () => void;
}> = ({ suggestion, active, onSelect }) => (
  <Link
    href={suggestion.href}
    onClick={onSelect}
    className={cn(
      'flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors',
      active ? 'bg-primary/10' : 'hover:bg-muted/50'
    )}
  >
    <Search className="text-muted-foreground h-4 w-4 flex-shrink-0" aria-hidden="true" />
    <span className="text-foreground flex-1 truncate text-sm">{suggestion.value}</span>
    <CornerDownLeft
      className="text-muted-foreground/60 h-3.5 w-3.5 flex-shrink-0"
      aria-hidden="true"
    />
  </Link>
);

interface RecentSearchesProps {
  recent: string[];
  onSelect: (query: string) => void;
  onClearAll: () => void;
  activeIndex?: number;
}

const RecentSearches: React.FC<RecentSearchesProps> = ({
  recent,
  onSelect,
  onClearAll,
  activeIndex = -1,
}) => {
  if (recent.length === 0) return null;
  return (
    <div className="py-2">
      <div className="text-muted-foreground flex items-center justify-between px-4 pt-1 pb-1.5">
        <span className="text-xs font-medium tracking-wide uppercase">Recent searches</span>
        <button
          type="button"
          onClick={onClearAll}
          className="text-muted-foreground hover:text-foreground flex items-center gap-1 rounded px-1 py-0.5 text-xs transition-colors"
        >
          <X className="h-3 w-3" aria-hidden="true" />
          Clear
        </button>
      </div>
      {recent.slice(0, 5).map((query, index) => (
        <button
          key={query}
          type="button"
          onClick={() => onSelect(query)}
          className={cn(
            'flex w-full items-center gap-3 px-4 py-2 text-left transition-colors',
            index === activeIndex ? 'bg-primary/10' : 'hover:bg-muted/50'
          )}
        >
          <Clock className="text-muted-foreground h-4 w-4 flex-shrink-0" aria-hidden="true" />
          <span className="text-foreground flex-1 truncate text-sm">{query}</span>
          <CornerDownLeft
            className="text-muted-foreground/60 h-3.5 w-3.5 flex-shrink-0"
            aria-hidden="true"
          />
        </button>
      ))}
    </div>
  );
};

export { SearchSuggestions, SuggestionRow, RecentSearches };
export type { SearchSuggestionsProps };
