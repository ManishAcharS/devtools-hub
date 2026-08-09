'use client';

import React, { useMemo, useState } from 'react';
import { Table2 } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

type Delimiter = 'auto' | ',' | ';' | '\t' | '|';
type Alignment = 'none' | 'left' | 'center' | 'right';

const DELIMITER_LABELS: Record<string, string> = {
  auto: 'Auto-detect',
  ',': 'Comma',
  ';': 'Semicolon',
  '\t': 'Tab',
  '|': 'Pipe',
};

const ALIGNMENT_LABELS: Record<string, string> = {
  none: 'No alignment',
  left: 'Left',
  center: 'Center',
  right: 'Right',
};

const ALIGNMENT_COLON: Record<Alignment, string> = {
  none: '',
  left: ':',
  center: ':',
  right: ':',
};

const ALIGNMENT_SUFFIX: Record<Alignment, string> = {
  none: '',
  left: '',
  center: ':',
  right: ':',
};

function detectDelimiter(line: string, options: Delimiter[]): Delimiter | null {
  let best: Delimiter | null = null;
  let bestCount = -1;
  for (const delimiter of options) {
    if (delimiter === 'auto') continue;
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

  const firstLine = nonEmpty[0]!;
  const effective =
    delimiter === 'auto' ? (detectDelimiter(firstLine, [',', ';', '\t', '|']) ?? ',') : delimiter;

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

function buildMarkdownTable(rows: string[][], hasHeader: boolean, alignment: Alignment): string {
  const firstRow = rows[0] ?? [];
  const body = hasHeader ? rows.slice(1) : rows;
  const header = hasHeader ? firstRow : firstRow.map(() => '');

  const separator = firstRow.map(() => {
    const dashes = `-${'-'.repeat(Math.max(3, 10))}`;
    return `${ALIGNMENT_COLON[alignment]}${dashes}${ALIGNMENT_SUFFIX[alignment]}`;
  });

  const escapeCell = (cell: string): string => cell.replace(/\|/g, '\\|').replace(/\n/g, ' ');

  const lines: string[] = [];
  if (hasHeader) {
    lines.push(`| ${header.map(escapeCell).join(' | ')} |`);
    lines.push(`| ${separator.join(' | ')} |`);
  }
  for (const row of body) {
    lines.push(`| ${row.map(escapeCell).join(' | ')} |`);
  }
  return `${lines.join('\n')}\n`;
}

const MarkdownTableGenerator: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');
  const [delimiter, setDelimiter] = useState<Delimiter>('auto');
  const [alignment, setAlignment] = useState<Alignment>('none');
  const [hasHeader, setHasHeader] = useState(true);

  const result = useMemo(() => {
    if (!input.trim()) return { value: '', error: null };
    const parsed = parseTableRows(input, delimiter);
    if (parsed.error) return { value: '', error: parsed.error };
    if (parsed.rows.length === 0) return { value: '', error: null };
    return {
      value: buildMarkdownTable(parsed.rows, hasHeader, alignment),
      error: null,
    };
  }, [input, delimiter, alignment, hasHeader]);

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
        <span>Alignment</span>
        <select
          value={alignment}
          onChange={(event) => setAlignment(event.target.value as Alignment)}
          className="border-border bg-background text-foreground rounded-md border px-2 py-1 text-sm"
        >
          {Object.entries(ALIGNMENT_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
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
        icon={<Table2 className="h-6 w-6" aria-hidden="true" />}
        title="Markdown table generator"
        description="Paste CSV/TSV data or type rows manually and generate a clean Markdown table with optional header and column alignment."
      />
      <TransformPanel
        inputId="md-table-input"
        inputValue={input}
        onInputChange={setInput}
        inputLabel="Data"
        inputPlaceholder={
          'Paste CSV/TSV data or type rows manually…\nName, Role\nAda, Admin\nLinus, Maintainer'
        }
        toolbar={toolbar}
        outputValue={result.value}
        outputLabel="Markdown table"
        outputPlaceholder="The Markdown table will appear here…"
        fileName="table.md"
        error={result.error}
      />
    </div>
  );
};

MarkdownTableGenerator.displayName = 'MarkdownTableGenerator';

export { MarkdownTableGenerator };
