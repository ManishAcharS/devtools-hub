'use client';

import React, { useMemo, useState } from 'react';
import { Table2, TriangleAlert } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { CSV_DELIMITERS, displayDelimiter, parseCsv, type CsvDelimiter } from '@/lib/tools/csv';
import { cn } from '@/lib/utils';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';
import { DownloadButton } from '@/components/shared/download-button';

const MAX_RENDERED_ROWS = 500;

const CsvViewer: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');
  const [delimiter, setDelimiter] = useState<CsvDelimiter | 'auto'>('auto');
  const [headerRow, setHeaderRow] = useState(true);

  const parsed = useMemo(
    () => (input.trim().length === 0 ? null : parseCsv(input, delimiter)),
    [input, delimiter]
  );

  const rows = parsed?.rows ?? [];
  const showRows = headerRow ? rows.slice(1) : rows;
  const visibleRows = showRows.slice(0, MAX_RENDERED_ROWS);

  const canonicalCsv = useMemo(() => {
    if (!parsed || parsed.rows.length === 0) return '';
    return (
      parsed.rows
        .map((row) =>
          row.cells.map((cell) => serializeCsvCell(cell, parsed.delimiter)).join(parsed.delimiter)
        )
        .join('\n') + '\n'
    );
  }, [parsed]);

  const delimiterOptions: { value: CsvDelimiter | 'auto'; label: string }[] = [
    { value: 'auto', label: 'Auto-detect' },
    ...CSV_DELIMITERS.map((value) => ({ value, label: displayDelimiter(value) })),
  ];

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Table2 className="h-6 w-6" aria-hidden="true" />}
        title="CSV viewer"
        description="Inspect any CSV file as a table with automatic delimiter detection, row and column counts."
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="text-muted-foreground flex items-center gap-2 text-sm">
            <span>Delimiter</span>
            <select
              value={delimiter}
              onChange={(event) => setDelimiter(event.target.value as CsvDelimiter | 'auto')}
              className="border-border bg-background text-foreground rounded-md border px-2 py-1 text-sm"
            >
              {delimiterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-muted-foreground flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={headerRow}
              onChange={(event) => setHeaderRow(event.target.checked)}
              className="accent-primary h-4 w-4"
            />
            First row is a header
          </label>
        </div>

        <label
          htmlFor="csv-viewer-input"
          className="text-muted-foreground mt-5 block text-xs font-semibold tracking-wider uppercase"
        >
          CSV data
        </label>
        <textarea
          id="csv-viewer-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Paste CSV data here…"
          spellCheck={false}
          rows={6}
          className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full resize-y rounded-lg border px-4 py-3 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
        />
        <p className="text-muted-foreground mt-3 text-xs">
          {input.length.toLocaleString()} characters
        </p>
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        {parsed?.error ? (
          <div className="flex items-start gap-3 rounded-lg border border-red-600/30 bg-red-600/5 p-4">
            <TriangleAlert
              className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400"
              aria-hidden="true"
            />
            <div>
              <p className="font-medium text-red-700 dark:text-red-400">
                Could not parse the CSV data
              </p>
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{parsed.error}</p>
            </div>
          </div>
        ) : rows.length === 0 ? (
          <div className="bg-muted text-muted-foreground flex h-20 items-center justify-center rounded-lg px-4 text-sm italic">
            The table will appear here as you type…
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-muted-foreground flex flex-wrap gap-x-6 gap-y-1 text-xs">
                <span>
                  Rows:{' '}
                  <span className="text-foreground font-medium">
                    {showRows.length.toLocaleString()}
                  </span>
                </span>
                <span>
                  Columns:{' '}
                  <span className="text-foreground font-medium">
                    {rows[0].cells.length.toLocaleString()}
                  </span>
                </span>
                <span>
                  Delimiter:{' '}
                  <span className="text-foreground font-medium">
                    {displayDelimiter(parsed?.delimiter ?? ',')}
                  </span>
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <CopyButton value={canonicalCsv} label="Copy CSV" size="sm" />
                <DownloadButton
                  content={canonicalCsv}
                  fileName="viewer.csv"
                  label="Download"
                  size="sm"
                />
              </div>
            </div>

            {(parsed?.warnings ?? []).map((warning) => (
              <p key={warning} className="mt-3 text-sm text-amber-600 dark:text-amber-400">
                {warning}
              </p>
            ))}

            <div className="border-border mt-4 overflow-x-auto rounded-lg border">
              <table className="w-full min-w-max border-collapse text-left text-sm">
                {headerRow && (
                  <thead>
                    <tr className="bg-muted">
                      {rows[0].cells.map((cell, index) => (
                        <th
                          key={index}
                          className="text-foreground border-border border-b px-3 py-2 font-semibold whitespace-nowrap"
                        >
                          {cell || `(empty)`}
                        </th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {visibleRows.map((row, rowIndex) => (
                    <tr key={rowIndex} className={cn(rowIndex % 2 === 1 && 'bg-muted/40')}>
                      {row.cells.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="text-muted-foreground border-border border-b px-3 py-2 whitespace-nowrap"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {showRows.length > MAX_RENDERED_ROWS && (
              <p className="text-muted-foreground mt-3 text-xs">
                Showing the first {MAX_RENDERED_ROWS.toLocaleString()} of{' '}
                {showRows.length.toLocaleString()} rows.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

function serializeCsvCell(cell: string, delimiter: string): string {
  if (
    cell.includes(delimiter) ||
    cell.includes('"') ||
    cell.includes('\n') ||
    cell.includes('\r') ||
    /^\s|\s$/.test(cell)
  ) {
    return `"${cell.replace(/"/g, '""')}"`;
  }
  return cell;
}

CsvViewer.displayName = 'CsvViewer';

export { CsvViewer };
