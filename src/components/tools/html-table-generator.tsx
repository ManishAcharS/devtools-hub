'use client';

import React, { useMemo, useState } from 'react';
import { Code2 } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

type Delimiter = 'auto' | ',' | ';' | '\t' | '|';

const DELIMITER_LABELS: Record<string, string> = {
  auto: 'Auto-detect',
  ',': 'Comma',
  ';': 'Semicolon',
  '\t': 'Tab',
  '|': 'Pipe',
};

function detectDelimiter(line: string, options: Exclude<Delimiter, 'auto'>[]): Delimiter {
  let best: Delimiter = ',';
  let bestCount = -1;
  for (const delimiter of options) {
    let count = 0;
    let inQuotes = false;
    for (let i = 0; i < line.length; i += 1) {
      const ch = line[i]!;
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === delimiter && !inQuotes) {
        count += 1;
      }
    }
    if (count > bestCount) {
      best = delimiter;
      bestCount = count;
    }
  }
  return best;
}

function splitCells(line: string, delimiter: Delimiter): string[] {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i]!;
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === delimiter && !inQuotes) {
      cells.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  cells.push(current);
  return cells.map((cell) => cell.trim());
}

function parseTableRows(
  text: string,
  delimiter: Delimiter
): { rows: string[][]; delimiter: Delimiter; error: string | null } {
  const lines = text.split(/\r?\n/);
  const nonEmpty = lines.map((line) => line.trim()).filter((line) => line.length > 0);
  if (nonEmpty.length === 0) return { rows: [], delimiter, error: null };

  const effective =
    delimiter === 'auto' ? detectDelimiter(nonEmpty[0]!, [',', ';', '\t', '|']) : delimiter;

  const rows: string[][] = [];
  let columnCount = 0;
  for (const line of nonEmpty) {
    const cells = splitCells(line, effective);
    columnCount = Math.max(columnCount, cells.length);
    rows.push(cells);
  }

  if (columnCount === 0) {
    return { rows: [], delimiter: effective, error: 'No columns detected — check the delimiter.' };
  }

  for (const row of rows) {
    while (row.length < columnCount) row.push('');
  }

  return { rows, delimiter: effective, error: null };
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildHtmlTable(rows: string[][], hasHeader: boolean, className: string): string {
  const header = hasHeader ? rows[0]! : [];
  const body = hasHeader ? rows.slice(1) : rows;

  const lines: string[] = [];
  const classAttr = className.trim() ? ` class="${className.trim()}"` : '';
  lines.push(`<table${classAttr}>`);

  if (hasHeader) {
    lines.push('  <thead>');
    lines.push('    <tr>');
    for (const cell of header) {
      lines.push(`      <th scope="col">${escapeHtml(cell)}</th>`);
    }
    lines.push('    </tr>');
    lines.push('  </thead>');
  }

  if (body.length > 0) {
    lines.push('  <tbody>');
    for (const row of body) {
      lines.push('    <tr>');
      for (const cell of row) {
        lines.push(`      <td>${escapeHtml(cell)}</td>`);
      }
      lines.push('    </tr>');
    }
    lines.push('  </tbody>');
  }

  lines.push('</table>');
  return `${lines.join('\n')}\n`;
}

const HtmlTableGenerator: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');
  const [delimiter, setDelimiter] = useState<Delimiter>('auto');
  const [hasHeader, setHasHeader] = useState(true);
  const [className, setClassName] = useState('');

  const parsed = useMemo(() => parseTableRows(input, delimiter), [input, delimiter]);

  const result = useMemo(() => {
    if (!input.trim()) return { value: '', error: null };
    if (parsed.error) return { value: '', error: parsed.error };
    if (parsed.rows.length === 0) return { value: '', error: null };
    return { value: buildHtmlTable(parsed.rows, hasHeader, className), error: null };
  }, [input, parsed, hasHeader, className]);

  const header = hasHeader ? (parsed.rows[0] ?? []) : [];
  const body = hasHeader ? parsed.rows.slice(1) : parsed.rows;

  const preview =
    parsed.rows.length > 0 ? (
      <div className="bg-muted mt-4 overflow-auto rounded-lg p-4">
        <table className="w-full border-collapse text-sm">
          {hasHeader && (
            <thead>
              <tr>
                {header.map((cell, index) => (
                  <th
                    key={`h-${index}`}
                    className="border-border border px-3 py-2 text-left font-semibold"
                  >
                    {cell || '\u00A0'}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          {body.length > 0 && (
            <tbody>
              {body.map((row, rowIndex) => (
                <tr key={`r-${rowIndex}`}>
                  {row.map((cell, cellIndex) => (
                    <td key={`c-${cellIndex}`} className="border-border border px-3 py-2">
                      {cell || '\u00A0'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    ) : null;

  const toolbar = (
    <div className="flex flex-wrap items-center gap-3">
      <label className="text-muted-foreground flex items-center gap-2 text-sm">
        <span>Delimiter</span>
        <select
          value={delimiter}
          onChange={(event) => setDelimiter(event.target.value as Delimiter)}
          className="border-border bg-background text-foreground rounded-md border px-2 py-1 text-sm"
        >
          {Object.entries(DELIMITER_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label className="text-muted-foreground flex items-center gap-2 text-sm">
        <span>Table class</span>
        <input
          type="text"
          value={className}
          onChange={(event) => setClassName(event.target.value)}
          placeholder="e.g. data-table"
          className="border-border bg-background text-foreground placeholder:text-muted-foreground w-40 rounded-md border px-2 py-1 text-sm"
        />
      </label>
      <label className="flex cursor-pointer items-center gap-2 text-xs font-medium">
        <input
          type="checkbox"
          checked={hasHeader}
          onChange={(event) => setHasHeader(event.target.checked)}
          className="accent-primary h-4 w-4"
        />
        First row is header
      </label>
    </div>
  );

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Code2 className="h-6 w-6" aria-hidden="true" />}
        title="HTML table generator"
        description="Paste CSV/TSV data or type rows manually and generate a semantic HTML table with thead, tbody, and optional CSS classes."
      />
      <TransformPanel
        inputId="html-table-input"
        inputValue={input}
        onInputChange={setInput}
        inputLabel="Data"
        inputPlaceholder={
          'Paste CSV/TSV data or type rows manually…\nName, Role\nAda, Admin\nLinus, Maintainer'
        }
        toolbar={toolbar}
        outputValue={result.value}
        outputLabel="HTML table"
        outputPlaceholder="The HTML table markup will appear here…"
        fileName="table.html"
        error={result.error}
        extra={preview}
      />
    </div>
  );
};

HtmlTableGenerator.displayName = 'HtmlTableGenerator';

export { HtmlTableGenerator };
