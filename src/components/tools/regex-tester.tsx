'use client';

import React, { useMemo, useState } from 'react';
import { Regex } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { REGEX_FLAGS, findMatches, type RegexMatch } from '@/lib/tools/regex-tools';
import { cn } from '@/lib/utils';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';

const MaxMatchesVisible = 200;

const RegexTester: React.FC<ToolComponentProps> = () => {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('');

  const result = useMemo(() => findMatches(pattern, flags, text), [pattern, flags, text]);

  const highlighted = useMemo(() => {
    if (result.matches.length === 0 || pattern.trim().length === 0) return null;
    const segments: { text: string; matched: boolean }[] = [];
    let cursor = 0;
    const limit = Math.min(result.matches.length, MaxMatchesVisible);
    for (let i = 0; i < limit; i += 1) {
      const match = result.matches[i];
      if (match.index < cursor) continue;
      if (match.index > cursor) {
        segments.push({ text: text.slice(cursor, match.index), matched: false });
      }
      segments.push({ text: match.value, matched: true });
      cursor = match.index + match.value.length;
    }
    if (cursor < text.length) {
      segments.push({ text: text.slice(cursor), matched: false });
    }
    return segments;
  }, [result.matches, pattern, text]);

  const toggleFlag = (flag: string): void => {
    setFlags((current) =>
      current.includes(flag) ? current.replace(flag, '') : `${current}${flag}`
    );
  };

  const maxGroups = useMemo(
    () => result.matches.reduce((max, match) => Math.max(max, match.groups.length), 0),
    [result.matches]
  );

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Regex className="h-6 w-6" aria-hidden="true" />}
        title="Regex tester"
        description="Test regular expressions live against any text, with every match and capture group highlighted."
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <label
          htmlFor="regex-pattern"
          className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
        >
          Pattern
        </label>
        <div className="mt-2 flex flex-wrap items-stretch gap-2">
          <div className="relative min-w-0 flex-1">
            <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 font-mono text-sm">
              /
            </span>
            <input
              id="regex-pattern"
              type="text"
              value={pattern}
              onChange={(event) => setPattern(event.target.value)}
              placeholder="\b\w+@\w+\.\w+\b"
              spellCheck={false}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary w-full rounded-lg border py-2.5 pr-3 pl-7 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
            <span className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 font-mono text-sm">
              /{result.flags}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setPattern('')}
            disabled={pattern.length === 0}
            className="border-border text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50"
          >
            Clear
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {REGEX_FLAGS.map((flag) => (
            <button
              key={flag.value}
              type="button"
              onClick={() => toggleFlag(flag.value)}
              title={flag.description}
              className={cn(
                'rounded-lg border px-3 py-1.5 font-mono text-sm font-medium transition-colors',
                flags.includes(flag.value)
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-muted-foreground bg-background hover:text-foreground'
              )}
              aria-pressed={flags.includes(flag.value)}
            >
              {flag.value}
            </button>
          ))}
        </div>
        <p className="text-muted-foreground mt-2 text-xs">
          {REGEX_FLAGS.find((f) => flags.includes(f.value))?.description ??
            'Select flags to change matching behavior.'}
        </p>

        <label
          htmlFor="regex-text"
          className="text-muted-foreground mt-5 block text-xs font-semibold tracking-wider uppercase"
        >
          Test string
        </label>
        <textarea
          id="regex-text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Paste text to search here…"
          spellCheck={false}
          rows={8}
          className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full resize-y rounded-lg border px-4 py-3 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
        />
        <p className="text-muted-foreground mt-3 text-xs">
          {text.length.toLocaleString()} characters
        </p>
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Matches
          </label>
          <div className="flex items-center gap-2">
            <CopyButton value={pattern} label="Copy pattern" size="sm" disabled={!pattern} />
          </div>
        </div>

        {result.error ? (
          <div className="mt-4 rounded-lg border border-red-600/30 bg-red-600/5 p-4">
            <p className="font-medium text-red-700 dark:text-red-400">Invalid regular expression</p>
            <p className="mt-1 font-mono text-sm text-red-600 dark:text-red-400">{result.error}</p>
          </div>
        ) : pattern.trim().length === 0 ? (
          <div className="bg-muted text-muted-foreground mt-4 flex h-20 items-center justify-center rounded-lg px-4 text-sm italic">
            Enter a pattern to see matches…
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
              <span>
                Matches:{' '}
                <span className="text-foreground font-medium">
                  {result.truncated
                    ? `${result.matches.length.toLocaleString()}+`
                    : result.matches.length.toLocaleString()}
                </span>
              </span>
              <span>
                Time:{' '}
                <span className="text-foreground font-medium">
                  {result.elapsedMs.toFixed(2)} ms
                </span>
              </span>
            </div>

            {highlighted && (
              <pre className="bg-muted text-foreground max-h-56 overflow-auto rounded-lg px-4 py-3 font-mono text-sm break-all whitespace-pre-wrap">
                {highlighted.map((segment, index) =>
                  segment.matched ? (
                    <mark
                      key={index}
                      className="rounded-sm bg-amber-300/60 text-inherit dark:bg-amber-500/40"
                    >
                      {segment.text}
                    </mark>
                  ) : (
                    <span key={index}>{segment.text}</span>
                  )
                )}
              </pre>
            )}

            {result.truncated && (
              <p className="text-sm text-amber-600 dark:text-amber-400">
                Only the first {MaxMatchesVisible.toLocaleString()} matches are shown.
              </p>
            )}

            {result.matches.length === 0 && (
              <p className="text-muted-foreground text-sm">No matches found.</p>
            )}

            {maxGroups > 0 && result.matches.length > 0 && (
              <div className="border-border overflow-x-auto rounded-lg border">
                <table className="w-full min-w-max border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border-border text-foreground border-b px-3 py-2">#</th>
                      <th className="border-border text-foreground border-b px-3 py-2">Match</th>
                      {Array.from({ length: maxGroups }).map((_, index) => (
                        <th
                          key={index}
                          className="border-border text-foreground border-b px-3 py-2"
                        >
                          Group {index + 1}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.matches.slice(0, MaxMatchesVisible).map((match: RegexMatch, index) => (
                      <tr key={index} className={cn(index % 2 === 1 && 'bg-muted/40')}>
                        <td className="text-muted-foreground border-border border-b px-3 py-2 whitespace-nowrap">
                          {match.index}
                        </td>
                        <td className="border-border text-foreground border-b px-3 py-2 font-mono whitespace-nowrap">
                          {match.value || '(empty)'}
                        </td>
                        {Array.from({ length: maxGroups }).map((_, groupIndex) => (
                          <td
                            key={groupIndex}
                            className="text-muted-foreground border-border border-b px-3 py-2 font-mono whitespace-nowrap"
                          >
                            {match.groups[groupIndex] || ''}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

RegexTester.displayName = 'RegexTester';

export { RegexTester };
