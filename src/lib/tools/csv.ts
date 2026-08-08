import type { ToolTransformResult } from './types';

export const CSV_DELIMITERS = [',', ';', '\t', '|'] as const;

export type CsvDelimiter = (typeof CSV_DELIMITERS)[number];

export interface CsvRow {
  cells: string[];
  line: number;
}

export interface CsvParseResult {
  rows: CsvRow[];
  delimiter: CsvDelimiter;
  error: string | null;
  warnings: string[];
}

function countOutsideQuotes(line: string, delimiter: string): number {
  let count = 0;
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') i += 1;
      else inQuotes = !inQuotes;
    } else if (ch === delimiter && !inQuotes) {
      count += 1;
    }
  }
  return count;
}

export function detectDelimiter(line: string): CsvDelimiter {
  let best: CsvDelimiter = ',';
  let bestCount = -1;
  for (const delimiter of CSV_DELIMITERS) {
    const count = countOutsideQuotes(line, delimiter);
    if (count > bestCount) {
      best = delimiter;
      bestCount = count;
    }
  }
  return best;
}

export function parseCsv(text: string, delimiter?: CsvDelimiter | 'auto'): CsvParseResult {
  const warnings: string[] = [];
  if (text.length === 0) {
    return {
      rows: [],
      delimiter: delimiter === 'auto' || !delimiter ? ',' : delimiter,
      error: null,
      warnings,
    };
  }

  const effectiveDelimiter =
    delimiter === 'auto' || !delimiter ? detectDelimiter(firstLine(text)) : delimiter;

  const rows: CsvRow[] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  let quoteStartLine = 1;
  let lineNumber = 1;
  let sawStrayQuote = false;

  const pushField = (): void => {
    row.push(field);
    field = '';
  };

  const pushRow = (): void => {
    pushField();
    rows.push({ cells: row, line: lineNumber });
    row = [];
  };

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else if (ch === '\r' || ch === '\n') {
        field += ch;
        if (ch === '\r' && text[i + 1] === '\n') i += 1;
        lineNumber += 1;
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      if (field.length === 0) {
        inQuotes = true;
        quoteStartLine = lineNumber;
      } else {
        sawStrayQuote = true;
        field += ch;
      }
    } else if (ch === effectiveDelimiter) {
      pushField();
    } else if (ch === '\r' || ch === '\n') {
      pushRow();
      if (ch === '\r' && text[i + 1] === '\n') i += 1;
      lineNumber += 1;
    } else {
      field += ch;
    }
  }

  if (inQuotes) {
    return {
      rows: [],
      delimiter: effectiveDelimiter,
      error: `Unterminated quoted field starting at line ${quoteStartLine}. Every field opened with a quote must close with one.`,
      warnings,
    };
  }

  if (field.length > 0 || row.length > 0) {
    pushRow();
  }

  if (sawStrayQuote) {
    warnings.push(
      'A quote was found inside an unquoted field and was treated as a literal character. Use a strict CSV editor if this is unexpected.'
    );
  }

  return { rows, delimiter: effectiveDelimiter, error: null, warnings };
}

function firstLine(text: string): string {
  const end = text.search(/[\r\n]/);
  return end === -1 ? text : text.slice(0, end);
}

export function csvToJson(
  text: string,
  options: { headers: boolean; delimiter?: CsvDelimiter | 'auto' }
): ToolTransformResult {
  const parsed = parseCsv(text, options.delimiter);
  if (parsed.error) {
    return { value: '', error: parsed.error, warnings: parsed.warnings };
  }
  if (parsed.rows.length === 0) {
    return { value: '', error: 'No rows found in the CSV data.', warnings: parsed.warnings };
  }

  let value: string;
  if (options.headers) {
    const headers = parsed.rows[0].cells;
    const records = parsed.rows.slice(1).map((row) => {
      const record: Record<string, string> = {};
      headers.forEach((header, index) => {
        record[header] = row.cells[index] ?? '';
      });
      return record;
    });
    value = JSON.stringify(records, null, 2);
  } else {
    value = JSON.stringify(
      parsed.rows.map((row) => row.cells),
      null,
      2
    );
  }

  return {
    value,
    error: null,
    warnings: parsed.warnings,
    stats: [
      {
        label: 'Rows',
        value: (options.headers ? parsed.rows.length - 1 : parsed.rows.length).toLocaleString(),
      },
      { label: 'Columns', value: parsed.rows[0].cells.length.toLocaleString() },
      { label: 'Delimiter', value: displayDelimiter(parsed.delimiter) },
    ],
  };
}

function serializeCell(cell: unknown, delimiter: string): string {
  const text =
    typeof cell === 'string'
      ? cell
      : cell === null || cell === undefined
        ? ''
        : JSON.stringify(cell);
  if (
    text.includes(delimiter) ||
    text.includes('"') ||
    text.includes('\n') ||
    text.includes('\r') ||
    /^\s|\s$/.test(text)
  ) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function jsonToCsv(
  jsonText: string,
  options: { delimiter: CsvDelimiter | 'auto'; headers: boolean }
): ToolTransformResult {
  let data: unknown;
  try {
    data = JSON.parse(jsonText);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown JSON error';
    return {
      value: '',
      error: `Invalid JSON: ${message}`,
    };
  }

  if (!Array.isArray(data)) {
    return {
      value: '',
      error: 'JSON must be an array of objects or an array of arrays to convert to CSV.',
    };
  }

  const delimiter = options.delimiter === 'auto' ? ',' : options.delimiter;

  if (data.length === 0) {
    return { value: '', error: 'The JSON array is empty — there are no rows to convert.' };
  }

  if (Array.isArray(data[0])) {
    if (!data.every((row) => Array.isArray(row))) {
      return {
        value: '',
        error: 'The array mixes rows of different shapes. Every row must be an array or an object.',
      };
    }
    const rows = (data as unknown[][]).map((row) =>
      row.map((cell) => serializeCell(cell, delimiter)).join(delimiter)
    );
    return {
      value: rows.join('\n') + '\n',
      error: null,
      stats: [
        { label: 'Rows', value: rows.length.toLocaleString() },
        { label: 'Columns', value: String((data[0] as unknown[]).length) },
      ],
    };
  }

  if (typeof data[0] !== 'object' || data[0] === null) {
    return {
      value: '',
      error: 'JSON rows must be objects or arrays. Scalars cannot be converted to CSV rows.',
    };
  }

  const records = data as Record<string, unknown>[];
  const headers: string[] = [];
  const seen = new Set<string>();
  records.forEach((record) => {
    Object.keys(record).forEach((key) => {
      if (!seen.has(key)) {
        seen.add(key);
        headers.push(key);
      }
    });
  });

  const lines: string[] = [];
  if (options.headers) {
    lines.push(headers.map((header) => serializeCell(header, delimiter)).join(delimiter));
  }
  records.forEach((record) => {
    lines.push(headers.map((header) => serializeCell(record[header], delimiter)).join(delimiter));
  });

  return {
    value: lines.join('\n') + '\n',
    error: null,
    stats: [
      { label: 'Rows', value: records.length.toLocaleString() },
      { label: 'Columns', value: headers.length.toLocaleString() },
    ],
  };
}

export function displayDelimiter(delimiter: string): string {
  switch (delimiter) {
    case '\t':
      return 'Tab';
    case '|':
      return 'Pipe';
    default:
      return delimiter === ',' ? 'Comma' : delimiter;
  }
}

export function formatCsv(
  text: string,
  options: {
    delimiter: CsvDelimiter | 'auto';
    lineEnding: 'lf' | 'crlf';
    trim: boolean;
  }
): ToolTransformResult {
  const parsed = parseCsv(text, options.delimiter);
  if (parsed.error) {
    return { value: '', error: parsed.error, warnings: parsed.warnings };
  }

  const delimiter = options.delimiter === 'auto' ? parsed.delimiter : options.delimiter;
  const ending = options.lineEnding === 'crlf' ? '\r\n' : '\n';

  const lines = parsed.rows.map((row) =>
    row.cells
      .map((cell) => (options.trim ? cell.trim() : cell))
      .map((cell) => serializeCell(cell, delimiter))
      .join(delimiter)
  );
  const value = lines.join(ending) + ending;

  return {
    value,
    error: null,
    warnings: parsed.warnings,
    stats: [
      { label: 'Rows', value: parsed.rows.length.toLocaleString() },
      {
        label: 'Columns',
        value: (parsed.rows[0]?.cells.length ?? 0).toLocaleString(),
      },
      { label: 'Delimiter', value: displayDelimiter(delimiter) },
    ],
  };
}
