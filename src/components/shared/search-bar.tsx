'use client';

import React, { forwardRef, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Search, X, CornerDownLeft, Command } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { searchEngine, type SearchSuggestion } from '@/search';

interface SearchBarProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size' | 'autoFocus'
> {
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  showShortcut?: boolean;
  suggestions?: string[];
  onSearch?: (query: string) => void;
  className?: string;
  autoFocus?: boolean;
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      placeholder = 'Search tools, categories, blog...',
      size = 'md',
      showShortcut = true,
      suggestions = [],
      onSearch,
      className,
      ...props
    },
    ref
  ) => {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const liveSuggestions = useMemo<SearchSuggestion[]>(() => {
      if (!query.trim()) return [];
      return searchEngine.suggest(query, 6);
    }, [query]);

    const visibleSuggestions: SearchSuggestion[] = query.trim()
      ? liveSuggestions
      : suggestions.map((value) => ({
          value,
          type: 'tool' as const,
          href: `/search?q=${encodeURIComponent(value)}`,
        }));

    const handleSearch = useCallback(
      (searchQuery: string) => {
        const trimmed = searchQuery.trim();
        if (!trimmed) return;
        onSearch?.(trimmed);
        router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      },
      [onSearch, router]
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (activeIndex >= 0 && visibleSuggestions[activeIndex]) {
          handleSearch(visibleSuggestions[activeIndex].value);
        } else {
          handleSearch(query);
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) =>
          visibleSuggestions.length > 0 ? (prev + 1) % visibleSuggestions.length : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) =>
          visibleSuggestions.length > 0
            ? (prev - 1 + visibleSuggestions.length) % visibleSuggestions.length
            : prev
        );
      } else if (e.key === 'Escape') {
        setIsDropdownOpen(false);
        inputRef.current?.blur();
      }
    };

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsDropdownOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const sizeClasses = {
      sm: 'h-9 text-sm px-3',
      md: 'h-11 text-base px-4',
      lg: 'h-12 text-lg px-5',
    };

    const iconSizes = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    };

    return (
      <div ref={dropdownRef} className={cn('relative z-50 w-full max-w-md', className)}>
        <div
          className={cn(
            'border-border bg-background focus-within:border-primary/50 focus-within:ring-primary/20 relative flex items-center gap-3 rounded-xl border transition-all focus-within:ring-2',
            sizeClasses[size]
          )}
        >
          <Search
            className={cn('text-muted-foreground h-5 w-5', iconSizes[size])}
            aria-hidden="true"
          />
          <input
            ref={(node) => {
              inputRef.current = node;
              if (typeof ref === 'function') ref(node);
              else if (ref) ref.current = node;
            }}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(-1);
              setIsDropdownOpen(true);
            }}
            onFocus={() => {
              setIsFocused(true);
              setIsDropdownOpen(true);
            }}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            aria-label="Search"
            role="combobox"
            aria-expanded={isDropdownOpen && isFocused}
            aria-controls="search-bar-listbox"
            aria-activedescendant={
              activeIndex >= 0 ? `search-bar-option-${activeIndex}` : undefined
            }
            aria-autocomplete="list"
            autoComplete="off"
            className="placeholder:text-muted-foreground/60 w-full bg-transparent outline-none"
            {...props}
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setActiveIndex(-1);
                setIsDropdownOpen(false);
              }}
              className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-md p-1 transition-colors"
              aria-label="Clear search"
            >
              <X className={cn('h-4 w-4', size === 'lg' ? 'h-5 w-5' : '')} aria-hidden="true" />
            </button>
          )}
          {showShortcut && !query && (
            <kbd className="text-muted-foreground bg-muted hidden items-center gap-1 rounded-md px-2 py-1 text-xs font-medium sm:inline-flex">
              <Command className="h-3 w-3" aria-hidden="true" />K
            </kbd>
          )}
        </div>

        {isDropdownOpen && isFocused && (
          <div className="border-border animate-menu-enter bg-background absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-xl border shadow-lg backdrop-blur-2xl backdrop-saturate-150">
            {visibleSuggestions.length > 0 ? (
              <div
                id="search-bar-listbox"
                role="listbox"
                aria-label="Search suggestions"
                className="py-2"
              >
                {visibleSuggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion.type}-${suggestion.value}`}
                    id={`search-bar-option-${index}`}
                    role="option"
                    aria-selected={index === activeIndex}
                    onClick={() => {
                      setQuery(suggestion.value);
                      handleSearch(suggestion.value);
                    }}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={cn(
                      'hover:bg-muted/50 flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors',
                      index === activeIndex && 'bg-muted/30'
                    )}
                  >
                    <Search className="text-muted-foreground h-4 w-4" aria-hidden="true" />
                    <span className="text-foreground flex-1 text-sm">{suggestion.value}</span>
                    <CornerDownLeft
                      className="text-muted-foreground/60 h-3.5 w-3.5"
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </div>
            ) : query ? (
              <div className="px-4 py-3">
                <p className="text-muted-foreground text-sm">
                  No suggestions for &quot;{query}&quot;. Press Enter to search.
                </p>
              </div>
            ) : (
              <div className="px-4 py-3">
                <p className="text-muted-foreground text-sm">
                  Type to search for tools, categories, articles, and resources.
                </p>
              </div>
            )}
            <div className="bg-muted/30 border-border/50 text-muted-foreground flex items-center justify-between border-t px-4 py-2 text-xs">
              <span>
                Press <kbd className="bg-muted rounded px-1 py-0.5">Enter</kbd> to search
              </span>
              <span>
                <kbd className="bg-muted rounded px-1 py-0.5">Esc</kbd> to close
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';

export { SearchBar };
