'use client';

import React from 'react';
import Link from 'next/link';
import { SearchX, TrendingUp, ArrowRight, Wrench, FolderOpen } from 'lucide-react';

interface SearchEmptyStateProps {
  query: string;
  suggestions?: string[];
  onSuggestion?: (suggestion: string) => void;
}

const SearchEmptyState: React.FC<SearchEmptyStateProps> = ({
  query,
  suggestions = [],
  onSuggestion,
}) => {
  return (
    <div className="border-border bg-card rounded-xl border p-8 text-center">
      <span className="bg-primary/10 text-primary mx-auto flex h-12 w-12 items-center justify-center rounded-2xl">
        <SearchX className="h-6 w-6" aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-lg font-semibold">No results for &quot;{query}&quot;</h2>
      <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm">
        Try a different keyword, check the spelling, or browse the full directory below.
      </p>

      {suggestions.length > 0 && (
        <div className="mt-6">
          <p className="text-muted-foreground mb-3 flex items-center justify-center gap-1.5 text-xs font-medium tracking-wide uppercase">
            <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
            Try these popular searches
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => onSuggestion?.(suggestion)}
                className="hover-glow text-muted-foreground hover:text-foreground hover:bg-muted border-border rounded-full border px-3 py-1.5 text-sm transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/tools"
          className="border-border hover:bg-muted inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
        >
          <Wrench className="h-4 w-4" aria-hidden="true" />
          Browse tools
        </Link>
        <Link
          href="/categories"
          className="border-border hover:bg-muted inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
        >
          <FolderOpen className="h-4 w-4" aria-hidden="true" />
          Browse categories
        </Link>
        <Link
          href="/search"
          className="border-border hover:bg-muted inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
        >
          View all results
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
};

export { SearchEmptyState };
