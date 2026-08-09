import { describe, expect, it } from 'vitest';
import { csvToJson, detectDelimiter, formatCsv, jsonToCsv, parseCsv } from '@/lib/tools/csv';

describe('detectDelimiter', () => {
  it('detects commas, semicolons, tabs, and pipes', () => {
    expect(detectDelimiter('a,b,c')).toBe(',');
    expect(detectDelimiter('a;b;c')).toBe(';');
    expect(detectDelimiter('a\tb\tc')).toBe('\t');
    expect(detectDelimiter('a|b|c')).toBe('|');
  });

  it('falls back to comma', () => {
    expect(detectDelimiter('a b c')).toBe(',');
  });
});

describe('parseCsv', () => {
  it('parses a simple table', () => {
    const result = parseCsv('name,age\nAda,36\nLin,30');
    expect(result.error).toBeNull();
    expect(result.rows).toEqual([
      { cells: ['name', 'age'], line: 1 },
      { cells: ['Ada', '36'], line: 2 },
      { cells: ['Lin', '30'], line: 3 },
    ]);
  });

  it('handles quoted fields with embedded commas and newlines', () => {
    const result = parseCsv('a,b\n"x, y","line1\nline2"');
    expect(result.error).toBeNull();
    expect(result.rows[0]?.cells).toEqual(['a', 'b']);
    expect(result.rows[1]?.cells).toEqual(['x, y', 'line1\nline2']);
  });

  it('reports unterminated quotes', () => {
    const result = parseCsv('a,b\n"oops');
    expect(result.error).toMatch(/unterminated/i);
    expect(result.rows).toEqual([]);
  });
});

describe('csvToJson', () => {
  it('converts rows to objects with headers', () => {
    const result = csvToJson('name,age\nAda,36', { headers: true });
    expect(result.error).toBeNull();
    expect(JSON.parse(result.value)).toEqual([{ name: 'Ada', age: '36' }]);
  });

  it('reports parse errors', () => {
    const result = csvToJson('"unterminated', { headers: true });
    expect(result.error).toBeTruthy();
  });
});

describe('jsonToCsv', () => {
  it('converts an array of objects', () => {
    const result = jsonToCsv('[{"name":"Ada","age":36}]', { delimiter: ',', headers: true });
    expect(result.error).toBeNull();
    expect(result.value).toContain('name,age');
    expect(result.value).toContain('Ada,36');
  });

  it('rejects invalid JSON', () => {
    const result = jsonToCsv('{oops', { delimiter: ',', headers: true });
    expect(result.error).toMatch(/invalid json/i);
  });
});

describe('formatCsv', () => {
  it('normalizes a table', () => {
    const result = formatCsv('a,b,c\n1,2,3', { delimiter: 'auto', lineEnding: 'lf', trim: false });
    expect(result.error).toBeNull();
    expect(result.value).toContain('a,b,c');
    expect(result.value).toContain('1,2,3');
  });
});
