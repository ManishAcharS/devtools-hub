'use client';

import React, { useMemo, useState } from 'react';
import { BookOpen, Search } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import {
  getHttpStatus,
  httpStatusCategoryLabel,
  searchHttpStatuses,
  type HttpStatusInfo,
} from '@/lib/tools/http-statuses';
import { cn } from '@/lib/utils';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';

const CATEGORIES = [
  { value: 0, label: 'All' },
  { value: 1, label: '1xx' },
  { value: 2, label: '2xx' },
  { value: 3, label: '3xx' },
  { value: 4, label: '4xx' },
  { value: 5, label: '5xx' },
];

const badgeClasses: Record<number, string> = {
  1: 'bg-sky-600/10 text-sky-700 dark:text-sky-400',
  2: 'bg-emerald-600/10 text-emerald-700 dark:text-emerald-400',
  3: 'bg-amber-600/10 text-amber-700 dark:text-amber-400',
  4: 'bg-orange-600/10 text-orange-700 dark:text-orange-400',
  5: 'bg-red-600/10 text-red-700 dark:text-red-400',
};

const HttpStatusExplorer: React.FC<ToolComponentProps> = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(0);
  const [selectedCode, setSelectedCode] = useState(200);

  const results = useMemo(() => {
    const searched = searchHttpStatuses(query);
    return category === 0 ? searched : searched.filter((status) => status.category === category);
  }, [query, category]);

  const selected = useMemo(() => getHttpStatus(selectedCode), [selectedCode]);

  const renderDetail = (status: HttpStatusInfo): React.ReactNode => (
    <div className="border-border bg-card rounded-xl border p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'rounded-lg px-3 py-1.5 font-mono text-lg font-bold',
              badgeClasses[status.category]
            )}
          >
            {status.code}
          </span>
          <h2 className="text-foreground text-lg font-semibold">{status.title}</h2>
        </div>
        <CopyButton value={String(status.code)} label="Copy code" size="sm" />
      </div>
      <p className="text-muted-foreground mt-1 text-xs font-semibold tracking-wider uppercase">
        {httpStatusCategoryLabel(status.category)}
      </p>
      <p className="text-foreground mt-4 text-sm leading-6">{status.description}</p>
      <div className="border-border mt-4 rounded-lg border p-4">
        <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          When to use it
        </p>
        <p className="text-foreground mt-1 text-sm leading-6">{status.whenToUse}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {status.keywords.map((keyword) => (
          <button
            key={keyword}
            type="button"
            onClick={() => setQuery(keyword)}
            className="bg-muted text-muted-foreground hover:text-foreground rounded-full px-3 py-1 text-xs font-medium transition-colors"
          >
            {keyword}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<BookOpen className="h-6 w-6" aria-hidden="true" />}
        title="HTTP status code explorer"
        description="Browse every HTTP status code by class, search by number or keyword, and get the exact meaning plus when to use it."
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="relative">
          <Search
            className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
            aria-hidden="true"
          />
          <label htmlFor="status-search" className="sr-only">
            Search status codes
          </label>
          <input
            id="status-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by code, title, or keyword — e.g. 404, redirect, cache…"
            className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary w-full rounded-lg border py-2.5 pr-4 pl-10 text-sm focus-visible:ring-2 focus-visible:outline-none"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {CATEGORIES.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setCategory(item.value)}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                category === item.value
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background text-muted-foreground hover:text-foreground'
              )}
              aria-pressed={category === item.value}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          {results.length.toLocaleString()} codes
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((status) => (
            <button
              key={status.code}
              type="button"
              onClick={() => setSelectedCode(status.code)}
              className={cn(
                'flex items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors',
                selectedCode === status.code
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-background hover:bg-muted'
              )}
              aria-pressed={selectedCode === status.code}
            >
              <span
                className={cn(
                  'rounded-md px-2 py-0.5 font-mono text-xs font-bold',
                  badgeClasses[status.category]
                )}
              >
                {status.code}
              </span>
              <span className="text-foreground min-w-0 flex-1 truncate text-sm font-medium">
                {status.title}
              </span>
            </button>
          ))}
          {results.length === 0 && (
            <p className="text-muted-foreground col-span-full py-6 text-center text-sm italic">
              No status codes match &ldquo;{query}&rdquo;.
            </p>
          )}
        </div>
      </div>

      {selected && renderDetail(selected)}
    </div>
  );
};

HttpStatusExplorer.displayName = 'HttpStatusExplorer';

export { HttpStatusExplorer };
