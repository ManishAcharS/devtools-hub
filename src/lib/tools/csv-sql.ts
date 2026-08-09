import type { ToolTransformResult } from './types';
import { parseCsv } from './csv';

export interface CsvToSqlOptions {
  batchSize: number;
  nullForEmpty: boolean;
}

const NUMBER_PATTERN = /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/;

function quoteIdentifier(identifier: string): string {
  return `"${identifier.replace(/"/g, '""')}"`;
}

function formatValue(value: string, nullForEmpty: boolean): string {
  if (value.trim().length === 0) {
    return nullForEmpty ? 'NULL' : "''";
  }
  if (NUMBER_PATTERN.test(value.trim())) {
    return value.trim();
  }
  return `'${value.replace(/'/g, "''")}'`;
}

export function csvToSql(
  csv: string,
  tableName: string,
  options: CsvToSqlOptions
): ToolTransformResult {
  if (tableName.trim().length === 0) {
    return { value: '', error: 'Enter a target table name first.' };
  }

  const parsed = parseCsv(csv);
  if (parsed.error) {
    return { value: '', error: parsed.error, warnings: parsed.warnings };
  }
  if (parsed.rows.length === 0) {
    return {
      value: '',
      error: 'Paste some CSV data to generate INSERT statements.',
      warnings: parsed.warnings,
    };
  }
  if (parsed.rows.length === 1) {
    return {
      value: '',
      error: 'CSV needs a header row plus at least one data row.',
      warnings: parsed.warnings,
    };
  }

  const headers = parsed.rows[0].cells;
  const dataRows = parsed.rows.slice(1);
  const columnList = headers.map(quoteIdentifier).join(', ');
  const batchSize = Math.max(1, Math.floor(options.batchSize));
  const table = tableName.trim();

  const statements: string[] = [];
  for (let start = 0; start < dataRows.length; start += batchSize) {
    const batch = dataRows.slice(start, start + batchSize);
    const valueGroups = batch.map((row) => {
      const values = headers.map((header, index) => {
        const cell = row.cells[index] ?? '';
        return formatValue(cell, options.nullForEmpty);
      });
      return `(${values.join(', ')})`;
    });
    statements.push(
      `INSERT INTO ${table} (${columnList})\nVALUES\n  ${valueGroups.join(',\n  ')};`
    );
  }

  return {
    value: `${statements.join('\n\n')}\n`,
    error: null,
    warnings: parsed.warnings,
    stats: [
      { label: 'Rows', value: dataRows.length.toLocaleString() },
      { label: 'Statements', value: statements.length.toLocaleString() },
    ],
  };
}
