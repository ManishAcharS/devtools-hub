'use client';

import React, { useMemo, useState } from 'react';
import { CalendarClock } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import {
  analyzeIso8601,
  formatUtcIso,
  formatLocalIso,
  formatRfc2822,
  formatHumanDate,
  toLocalInputValue,
} from '@/lib/tools/dates';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';
import { cn } from '@/lib/utils';

const KIND_LABELS: Record<string, string> = {
  utc: 'UTC (Z)',
  offset: 'With offset (+02:00)',
  local: 'Local (no offset)',
  'date-only': 'Date only (YYYY-MM-DD)',
  basic: 'Basic format (YYYYMMDDTHHMMSS)',
  invalid: 'Invalid',
};

const Iso8601Converter: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState(toLocalInputValue(new Date()).slice(0, 16));

  const analysis = useMemo(() => analyzeIso8601(input), [input]);

  const outputs = useMemo(() => {
    if (!analysis.date) return null;
    return {
      utc: formatUtcIso(analysis.date),
      local: formatLocalIso(analysis.date),
      rfc2822: formatRfc2822(analysis.date),
      human: formatHumanDate(analysis.date),
      epochSeconds: analysis.epochSeconds,
      epochMilliseconds: analysis.epochMilliseconds,
    };
  }, [analysis]);

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<CalendarClock className="h-6 w-6" aria-hidden="true" />}
        title="ISO 8601 converter"
        description="Parse any ISO 8601 string and see it as UTC, local, epoch, RFC 2822, and human-readable formats."
      />
      <div className="border-border bg-card rounded-xl border p-5">
        <label
          htmlFor="iso-input"
          className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
        >
          ISO 8601 string
        </label>
        <input
          id="iso-input"
          type="text"
          value={input}
          suppressHydrationWarning
          onChange={(event) => setInput(event.target.value)}
          placeholder="2026-08-08T10:30:00Z"
          spellCheck={false}
          className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
        />
        <p className="text-muted-foreground mt-2 text-xs">
          Parsed as:{' '}
          <span className={cn('font-medium', analysis.error ? 'text-red-600' : 'text-foreground')}>
            {KIND_LABELS[analysis.kind] ?? analysis.kind}
          </span>
        </p>
        {analysis.error && (
          <p className="mt-3 text-sm text-red-600 dark:text-red-400">{analysis.error}</p>
        )}
      </div>

      {outputs && (
        <div className="space-y-4">
          <div className="border-border bg-card rounded-xl border p-5">
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Formats
            </p>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <dt className="text-muted-foreground w-24 shrink-0">UTC</dt>
                <dd className="text-foreground font-mono">{outputs.utc}</dd>
                <CopyButton value={outputs.utc} iconOnly size="sm" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <dt className="text-muted-foreground w-24 shrink-0">Local</dt>
                <dd className="text-foreground font-mono">{outputs.local}</dd>
                <CopyButton value={outputs.local} iconOnly size="sm" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <dt className="text-muted-foreground w-24 shrink-0">RFC 2822</dt>
                <dd className="text-foreground font-mono">{outputs.rfc2822}</dd>
                <CopyButton value={outputs.rfc2822} iconOnly size="sm" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <dt className="text-muted-foreground w-24 shrink-0">Human</dt>
                <dd className="text-foreground">{outputs.human}</dd>
              </div>
            </dl>
          </div>

          <div className="border-border bg-card rounded-xl border p-5">
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Epoch timestamps
            </p>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <dt className="text-muted-foreground w-28 shrink-0">Seconds</dt>
                <dd className="text-foreground font-mono">{outputs.epochSeconds ?? ''}</dd>
                {outputs.epochSeconds && (
                  <CopyButton value={outputs.epochSeconds} iconOnly size="sm" />
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <dt className="text-muted-foreground w-28 shrink-0">Milliseconds</dt>
                <dd className="text-foreground font-mono">{outputs.epochMilliseconds ?? ''}</dd>
                {outputs.epochMilliseconds && (
                  <CopyButton value={outputs.epochMilliseconds} iconOnly size="sm" />
                )}
              </div>
            </dl>
          </div>
        </div>
      )}
    </div>
  );
};

Iso8601Converter.displayName = 'Iso8601Converter';

export { Iso8601Converter };
