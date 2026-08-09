'use client';

import React, { useMemo, useState } from 'react';
import { Users, Wand2, FileJson, Table2, Database } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { cn } from '@/lib/utils';
import {
  createRng,
  generateMockRows,
  MOCK_FIELDS,
  toCsv,
  toSqlInsert,
  type MockDataFormat,
  type MockField,
} from '@/lib/tools/mock-data';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';
import { DownloadButton } from '@/components/shared/download-button';

const FORMAT_OPTIONS: { value: MockDataFormat; label: string; icon: typeof Table2 }[] = [
  { value: 'json', label: 'JSON', icon: FileJson },
  { value: 'csv', label: 'CSV', icon: Table2 },
  { value: 'sql', label: 'SQL INSERT', icon: Database },
];

const MockDataGenerator: React.FC<ToolComponentProps> = () => {
  const [selected, setSelected] = useState<Set<MockField>>(
    () => new Set(MOCK_FIELDS.filter((field) => field !== 'id'))
  );
  const [count, setCount] = useState('10');
  const [format, setFormat] = useState<MockDataFormat>('json');
  const [tableName, setTableName] = useState('users');
  const [rows, setRows] = useState<Record<string, string>[] | null>(null);

  const parsedCount = useMemo(() => {
    const value = Number.parseInt(count, 10);
    if (Number.isNaN(value)) return 0;
    return Math.min(500, Math.max(1, value));
  }, [count]);

  const output = useMemo(() => {
    if (!rows || rows.length === 0) return '';
    if (format === 'csv') return toCsv(rows);
    if (format === 'sql') return toSqlInsert(rows, tableName.trim() || 'users');
    return `${JSON.stringify(rows, null, 2)}\n`;
  }, [rows, format, tableName]);

  const toggleField = (field: MockField) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(field)) next.delete(field);
      else next.add(field);
      return next;
    });
  };

  const handleGenerate = () => {
    const fields = MOCK_FIELDS.filter((field) => selected.has(field));
    if (fields.length === 0) return;
    const rng = createRng((Math.random() * 0xffffffff) >>> 0);
    setRows(generateMockRows(fields, parsedCount, rng));
  };

  const outputLabel = format === 'json' ? 'JSON' : format === 'csv' ? 'CSV' : 'SQL INSERT';

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Users className="h-6 w-6" aria-hidden="true" />}
        title="Mock data generator"
        description="Generate realistic fake people — names, emails, phone numbers, addresses, companies — as JSON, CSV, or SQL INSERT statements for testing and seeding."
      />
      <div className="border-border bg-card rounded-xl border p-5">
        <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          Fields
        </p>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
          {MOCK_FIELDS.map((field) => (
            <label key={field} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selected.has(field)}
                onChange={() => toggleField(field)}
                className="accent-primary h-4 w-4"
              />
              {field}
            </label>
          ))}
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="mock-count"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Row count (1-500)
            </label>
            <input
              id="mock-count"
              type="number"
              min={1}
              max={500}
              value={count}
              onChange={(event) => setCount(event.target.value)}
              className="border-border bg-background text-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="mock-table"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Table name (SQL)
            </label>
            <input
              id="mock-table"
              type="text"
              value={tableName}
              onChange={(event) => setTableName(event.target.value)}
              placeholder="users"
              spellCheck={false}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {FORMAT_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFormat(option.value)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors',
                  format === option.value
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-muted-foreground hover:text-foreground'
                )}
                aria-pressed={format === option.value}
              >
                <option.icon className="h-3.5 w-3.5" aria-hidden="true" />
                {option.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={selected.size === 0}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Wand2 className="h-4 w-4" aria-hidden="true" />
            Generate
          </button>
        </div>
        {selected.size === 0 && (
          <p className="mt-3 text-sm text-amber-600 dark:text-amber-400">
            Select at least one field to generate data.
          </p>
        )}
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label
            htmlFor="mock-output"
            className="text-muted-foreground text-xs font-semibold tracking-wider uppercase"
          >
            {outputLabel} output
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <CopyButton value={output} iconOnly size="sm" disabled={!output} />
            <DownloadButton
              content={output}
              fileName={`mock-data.${format === 'json' ? 'json' : format === 'csv' ? 'csv' : 'sql'}`}
              label="Download"
              size="sm"
              disabled={!output}
            />
          </div>
        </div>
        <div className="mt-2">
          {output ? (
            <pre
              id="mock-output"
              className="bg-muted text-foreground max-h-96 overflow-auto rounded-lg px-4 py-3 font-mono text-sm break-all whitespace-pre-wrap"
            >
              {output}
            </pre>
          ) : (
            <div className="bg-muted text-muted-foreground flex h-20 items-center justify-center rounded-lg px-4 text-sm italic">
              Click Generate to create {parsedCount} rows of mock data…
            </div>
          )}
        </div>
        {output && (
          <p className="text-muted-foreground mt-3 text-xs">
            {rows?.length.toLocaleString() ?? 0} rows · {output.length.toLocaleString()} characters
          </p>
        )}
      </div>
    </div>
  );
};

MockDataGenerator.displayName = 'MockDataGenerator';

export { MockDataGenerator };
