'use client';

import React, { forwardRef } from 'react';
import { Search, X, Loader2, Command } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  showShortcut?: boolean;
  isLoading?: boolean;
  onClear?: () => void;
  clearable?: boolean;
  inputClassName?: string;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className,
      inputClassName,
      size = 'md',
      showShortcut = false,
      isLoading = false,
      onClear,
      clearable = true,
      value,
      placeholder,
      type = 'search',
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'h-9 px-3',
      md: 'h-11 px-4',
      lg: 'h-12 px-5',
    };

    const iconSizes = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    };

    const hasValue = typeof value === 'string' && value.length > 0;

    return (
      <div
        className={cn(
          'border-border bg-background focus-within:border-primary/50 focus-within:ring-primary/20 relative flex items-center gap-3 rounded-xl border transition-all focus-within:ring-2',
          sizeClasses[size],
          className
        )}
      >
        {isLoading ? (
          <Loader2
            className={cn('text-muted-foreground animate-spin', iconSizes[size])}
            aria-hidden="true"
          />
        ) : (
          <Search
            className={cn('text-muted-foreground flex-shrink-0', iconSizes[size])}
            aria-hidden="true"
          />
        )}
        <input
          ref={ref}
          type={type}
          value={value}
          placeholder={placeholder}
          className={cn(
            'placeholder:text-muted-foreground/60 w-full bg-transparent outline-none',
            inputClassName
          )}
          {...props}
        />
        {clearable && hasValue && (
          <button
            type="button"
            onClick={onClear}
            className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-md p-1 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
        {showShortcut && !hasValue && (
          <kbd className="text-muted-foreground bg-muted hidden items-center gap-1 rounded-md px-2 py-1 text-xs font-medium sm:inline-flex">
            <Command className="h-3 w-3" aria-hidden="true" />K
          </kbd>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

export { SearchInput };
