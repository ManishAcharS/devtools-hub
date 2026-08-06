'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, TrendingUp } from 'lucide-react';
import {
  searchEngine,
  getPopularSearches,
  tokenize,
  type SearchItemType,
  type SearchResultItem,
} from '@/search';
import { SearchInput } from '@/components/search/search-input';
import { SearchFilters, type SearchFilterValue } from '@/components/search/search-filters';
import { SearchItemRow } from '@/components/search/search-item';
import { SearchEmptyState } from '@/components/search/search-empty-state';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { useSearchHistory } from '@/hooks/use-search-history';
import { useDebouncedValue } from '@/hooks/use-storage';
import { cn } from '@/lib/utils';

interface SearchPageClientProps {
  initialQuery: string;
  initialType: SearchFilterValue;
}

const TYPE_SECTIONS: Array<{ type: SearchItemType; label: string }> = [
  { type: 'tool', label: 'Tools' },
  { type: 'category', label: 'Categories' },
  { type: 'blog', label: 'Articles' },
  { type: 'resource', label: 'Resources' },
];

const popularSearches = getPopularSearches(8);

export const SearchPageClient: React.FC<SearchPageClientProps> = ({
  initialQuery,
  initialType,
}) => {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState<SearchFilterValue>(initialType);
  const firstRender = useRef(true);
  const { history, addToHistory, clearHistory } = useSearchHistory();

  const debouncedQuery = useDebouncedValue(query, 200);
  const isSearching = query.trim().length > 0 && debouncedQuery !== query;

  const counts = useMemo(() => searchEngine.getItemCounts(), []);

  const results = useMemo<SearchResultItem[]>(() => {
    if (!debouncedQuery.trim()) return [];
    return searchEngine.search(debouncedQuery, {
      types: type === 'all' ? undefined : [type],
      limit: 60,
    });
  }, [debouncedQuery, type]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const params = new URLSearchParams();
    if (debouncedQuery.trim()) params.set('q', debouncedQuery.trim());
    if (type !== 'all') params.set('type', type);
    const search = params.toString();
    router.replace(search ? `/search?${search}` : '/search', { scroll: false });
  }, [debouncedQuery, type, router]);

  const handleSearch = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) return;
      setQuery(trimmed);
      addToHistory(trimmed);
    },
    [addToHistory]
  );

  const hasQuery = tokenize(debouncedQuery).length > 0;
  const resultCount = results.length;

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: 'Search', current: true }]} className="mb-6" />
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Search</h1>
        <p className="text-muted-foreground mt-3">
          Find tools, categories, articles, and resources.
        </p>
      </header>

      <SearchInput
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search the developer tool ecosystem..."
        size="lg"
        isLoading={isSearching}
        onClear={() => setQuery('')}
        className="w-full"
        aria-label="Search"
        role="searchbox"
        autoComplete="off"
      />

      <div className="mt-5">
        <SearchFilters value={type} onChange={setType} counts={counts} />
      </div>

      <div className="mt-8">
        {!hasQuery ? (
          <div className="border-border bg-card rounded-xl border p-8">
            <p className="text-muted-foreground mb-4 flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase">
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              Recent searches
            </p>
            {history.length > 0 ? (
              <>
                <div className="flex flex-wrap gap-2">
                  {history.map((entry) => (
                    <button
                      key={entry}
                      type="button"
                      onClick={() => handleSearch(entry)}
                      className="hover-glow text-muted-foreground hover:text-foreground hover:bg-muted border-border rounded-full border px-3 py-1.5 text-sm transition-colors"
                    >
                      {entry}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={clearHistory}
                  className="text-muted-foreground hover:text-foreground mt-4 text-sm transition-colors"
                >
                  Clear history
                </button>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">
                Your recent searches will appear here. They are stored locally on this device.
              </p>
            )}

            <p className="text-muted-foreground mt-8 mb-4 flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase">
              <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
              Popular searches
            </p>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((popular) => (
                <button
                  key={popular}
                  type="button"
                  onClick={() => handleSearch(popular)}
                  className="hover-glow text-muted-foreground hover:text-foreground hover:bg-muted border-border rounded-full border px-3 py-1.5 text-sm transition-colors"
                >
                  {popular}
                </button>
              ))}
            </div>
          </div>
        ) : isSearching ? (
          <div
            className="border-border bg-card divide-border divide-y rounded-xl border"
            aria-busy="true"
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4 p-4">
                <div className="bg-muted h-8 w-8 animate-pulse rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="bg-muted h-4 w-1/3 animate-pulse rounded" />
                  <div className="bg-muted h-3 w-2/3 animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : resultCount === 0 ? (
          <SearchEmptyState
            query={debouncedQuery}
            suggestions={popularSearches}
            onSuggestion={handleSearch}
          />
        ) : (
          <>
            <p className="text-muted-foreground mb-4 text-sm">
              {resultCount} result{resultCount === 1 ? '' : 's'} for{' '}
              <span className="text-foreground font-medium">&quot;{debouncedQuery}&quot;</span>
              {type !== 'all' && <span className="text-muted-foreground"> in {type}s</span>}
            </p>
            <div className="space-y-8">
              {TYPE_SECTIONS.map(({ type: sectionType, label }) => {
                const sectionResults = results.filter((result) => result.item.type === sectionType);
                if (sectionResults.length === 0) return null;
                return (
                  <section key={sectionType} aria-label={label}>
                    <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                      {label}
                      <span className="text-muted-foreground text-sm font-normal">
                        {sectionResults.length}
                      </span>
                    </h2>
                    <ul className="border-border bg-card divide-border divide-y rounded-xl border">
                      {sectionResults.map((result) => (
                        <li
                          key={result.item.id}
                          className={cn('rounded-xl first:rounded-b-none last:rounded-t-none')}
                        >
                          <SearchItemRow result={result} onSelect={(href) => router.push(href)} />
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
