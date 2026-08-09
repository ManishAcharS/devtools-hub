'use client';

import React, { useMemo, useState } from 'react';
import { GitBranch, Search } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { cn } from '@/lib/utils';
import { GIT_CHEATSHEET, GIT_SECTIONS } from '@/lib/tools/git-commands';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';

const GitCheatsheet: React.FC<ToolComponentProps> = () => {
  const [query, setQuery] = useState('');
  const [section, setSection] = useState<string>('All');

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return GIT_CHEATSHEET.filter((entry) => {
      const matchesSection = section === 'All' || entry.section === section;
      if (!matchesSection) return false;
      if (needle.length === 0) return true;
      return (
        entry.command.toLowerCase().includes(needle) ||
        entry.description.toLowerCase().includes(needle)
      );
    });
  }, [query, section]);

  const grouped = useMemo(() => {
    const groups: { section: string; entries: typeof GIT_CHEATSHEET }[] = [];
    for (const entry of filtered) {
      const group = groups.find((candidate) => candidate.section === entry.section);
      if (group) {
        group.entries.push(entry);
      } else {
        groups.push({ section: entry.section, entries: [entry] });
      }
    }
    return groups;
  }, [filtered]);

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<GitBranch className="h-6 w-6" aria-hidden="true" />}
        title="Git cheat sheet"
        description="A searchable reference for everyday Git commands — setup, staging, committing, branching, remotes, undoing mistakes, stashes, tags, and aliases."
      />
      <div className="border-border bg-card rounded-xl border p-5">
        <div className="relative">
          <Search
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search commands or descriptions…"
            className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary w-full rounded-lg border py-3 pr-4 pl-10 text-sm focus-visible:ring-2 focus-visible:outline-none"
          />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {['All', ...GIT_SECTIONS].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSection(option)}
              className={cn(
                'rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors',
                section === option
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-muted-foreground hover:text-foreground'
              )}
              aria-pressed={section === option}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {grouped.length === 0 ? (
        <div className="border-border bg-card rounded-xl border p-8 text-center">
          <p className="text-muted-foreground text-sm italic">No commands match “{query}”.</p>
        </div>
      ) : (
        grouped.map((group) => (
          <div key={group.section} className="border-border bg-card rounded-xl border p-5">
            <h3 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              {group.section}
            </h3>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-max border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="text-muted-foreground border-border rounded-l-lg border-b px-3 py-2 font-semibold">
                      Command
                    </th>
                    <th className="text-muted-foreground border-border rounded-r-lg border-b px-3 py-2 font-semibold">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {group.entries.map((entry) => (
                    <tr key={entry.command} className="group hover:bg-muted/40">
                      <td className="border-border border-b px-3 py-2 align-top">
                        <div className="flex items-center gap-2">
                          <code className="font-mono text-xs whitespace-nowrap">
                            {entry.command}
                          </code>
                          <span className="opacity-0 transition-opacity group-hover:opacity-100">
                            <CopyButton value={entry.command} iconOnly size="sm" />
                          </span>
                        </div>
                      </td>
                      <td className="text-muted-foreground border-border border-b px-3 py-2">
                        {entry.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}

      <p className="text-muted-foreground text-xs">
        {filtered.length} command{filtered.length === 1 ? '' : 's'} found
      </p>
    </div>
  );
};

GitCheatsheet.displayName = 'GitCheatsheet';

export { GitCheatsheet };
