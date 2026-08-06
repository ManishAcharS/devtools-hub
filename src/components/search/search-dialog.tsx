'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import {
  searchEngine,
  getPopularSearches,
  tokenize,
  type SearchItemType,
  type SearchResultItem,
  type SearchSuggestion,
} from '@/search';
import { SearchInput } from '@/components/search/search-input';
import { SearchResults } from '@/components/search/search-results';
import { SearchSuggestions, RecentSearches } from '@/components/search/search-suggestions';
import { SearchEmptyState } from '@/components/search/search-empty-state';
import { useSearchHistory } from '@/hooks/use-search-history';
import { useDebouncedValue } from '@/hooks/use-storage';
import { useLockBody } from '@/hooks/use-interaction';

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

const popularSearches = getPopularSearches(6);

export const SearchDialog: React.FC<SearchDialogProps> = ({ open, onClose }) => {
  if (!open) return null;
  return <SearchDialogInner onClose={onClose} />;
};

const SearchDialogInner: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const { history, addToHistory, clearHistory } = useSearchHistory();

  const debouncedQuery = useDebouncedValue(query, 150);
  const isSearching = query.trim().length > 0 && debouncedQuery !== query;

  const results = useMemo<SearchResultItem[]>(() => {
    if (!debouncedQuery.trim()) return [];
    return searchEngine.search(debouncedQuery, { limit: 10 });
  }, [debouncedQuery]);

  const suggestions = useMemo<SearchSuggestion[]>(() => {
    if (!query.trim()) return [];
    return searchEngine.suggest(query, 5);
  }, [query]);

  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null;
    requestAnimationFrame(() => inputRef.current?.focus());
    return () => trigger?.focus?.();
  }, []);

  useLockBody(true);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const navigateToQuery = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) return;
      addToHistory(trimmed);
      onClose();
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    },
    [addToHistory, onClose, router]
  );

  const navigateToItem = useCallback(
    (href: string) => {
      addToHistory(debouncedQuery);
      onClose();
      router.push(href);
    },
    [addToHistory, debouncedQuery, onClose, router]
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      handleClose();
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, results.length + suggestions.length - 1));
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, -1));
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      if (activeIndex >= 0) {
        if (activeIndex < results.length) {
          const result = results[activeIndex];
          if (result) navigateToItem(result.item.href);
        } else {
          const suggestion = suggestions[activeIndex - results.length];
          if (suggestion) navigateToQuery(suggestion.value);
        }
      } else if (query.trim()) {
        navigateToQuery(query);
      }
    }
  };

  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    navigateToQuery(suggestion.value);
  };

  const totalOptions = results.length + suggestions.length;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div
        className="animate-menu-enter absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />
      <div className="animate-menu-enter border-border bg-background relative w-full max-w-xl overflow-hidden rounded-2xl border shadow-2xl">
        <div className="border-border/60 border-b p-3">
          <SearchInput
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search tools, categories, articles, resources..."
            size="md"
            isLoading={isSearching}
            onClear={() => setQuery('')}
            autoFocus
            role="combobox"
            aria-expanded="true"
            aria-controls="search-dialog-listbox"
            aria-activedescendant={activeIndex >= 0 ? `search-option-${activeIndex}` : undefined}
            aria-autocomplete="list"
            inputClassName="text-base"
          />
        </div>

        <div
          id="search-dialog-listbox"
          role="listbox"
          aria-label="Search results"
          className="max-h-[46vh] overflow-y-auto overscroll-contain"
        >
          {!tokenize(debouncedQuery).length ? (
            <>
              <RecentSearches
                recent={history}
                onSelect={navigateToQuery}
                onClearAll={clearHistory}
                activeIndex={activeIndex >= 0 && results.length === 0 ? activeIndex : -1}
              />
              <div className="py-3">
                <p className="text-muted-foreground flex items-center gap-1.5 px-4 pb-2 text-xs font-medium tracking-wide uppercase">
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  Popular searches
                </p>
                <div className="flex flex-wrap gap-2 px-4">
                  {popularSearches.map((popular) => (
                    <button
                      key={popular}
                      type="button"
                      onClick={() => navigateToQuery(popular)}
                      className="hover-glow text-muted-foreground hover:text-foreground hover:bg-muted border-border rounded-full border px-3 py-1.5 text-sm transition-colors"
                    >
                      {popular}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : results.length === 0 && !isSearching ? (
            <div className="p-4">
              <SearchEmptyState
                query={debouncedQuery}
                suggestions={popularSearches}
                onSuggestion={navigateToQuery}
              />
            </div>
          ) : (
            <>
              <SearchResults
                results={results}
                query={debouncedQuery}
                activeIndex={activeIndex < results.length ? activeIndex : -1}
                onSelect={(href) => navigateToItem(href)}
                onSeeAll={(type: SearchItemType) => {
                  addToHistory(debouncedQuery);
                  handleClose();
                  router.push(`/search?q=${encodeURIComponent(debouncedQuery)}&type=${type}`);
                }}
              />
              {suggestions.length > 0 && (
                <div className="border-border/60 border-t">
                  <p className="text-muted-foreground px-4 pt-2.5 pb-1 text-xs font-medium tracking-wide uppercase">
                    Suggestions
                  </p>
                  <SearchSuggestions
                    suggestions={suggestions}
                    activeIndex={
                      activeIndex >= results.length && activeIndex < totalOptions
                        ? activeIndex - results.length
                        : -1
                    }
                    onSelect={handleSuggestionSelect}
                  />
                </div>
              )}
            </>
          )}
        </div>

        <div className="border-border/60 text-muted-foreground flex items-center justify-between border-t px-4 py-2 text-xs">
          <span>
            <kbd className="bg-muted border-border rounded border px-1.5 py-0.5 font-medium">
              ↑↓
            </kbd>{' '}
            navigate ·{' '}
            <kbd className="bg-muted border-border rounded border px-1.5 py-0.5 font-medium">↵</kbd>{' '}
            select
          </span>
          <span>
            <kbd className="bg-muted border-border rounded border px-1.5 py-0.5 font-medium">
              esc
            </kbd>{' '}
            close
          </span>
        </div>
      </div>
    </div>
  );
};
