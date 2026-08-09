import { describe, expect, it } from 'vitest';
import {
  createRng,
  generateMockRows,
  MOCK_FIELDS,
  toCsv,
  toSqlInsert,
} from '@/lib/tools/mock-data';

describe('createRng', () => {
  it('is deterministic for the same seed', () => {
    const a = createRng(42);
    const b = createRng(42);
    const first = Array.from({ length: 10 }, () => a());
    const second = Array.from({ length: 10 }, () => b());
    expect(first).toEqual(second);
  });

  it('produces values in the [0, 1) range', () => {
    const rng = createRng(7);
    for (let i = 0; i < 100; i += 1) {
      const value = rng();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it('differs for different seeds', () => {
    const a = createRng(1);
    const b = createRng(2);
    expect(a()).not.toBe(b());
  });
});

describe('generateMockRows', () => {
  it('generates the requested number of rows', () => {
    const rows = generateMockRows(MOCK_FIELDS, 5, createRng(1));
    expect(rows).toHaveLength(5);
  });

  it('only includes the requested fields', () => {
    const rows = generateMockRows(['name', 'email'], 3, createRng(1));
    expect(Object.keys(rows[0] ?? {})).toEqual(['name', 'email']);
  });

  it('is deterministic for a fixed seed', () => {
    const a = generateMockRows(MOCK_FIELDS, 4, createRng(123));
    const b = generateMockRows(MOCK_FIELDS, 4, createRng(123));
    expect(a).toEqual(b);
  });

  it('generates valid email addresses from names', () => {
    const rows = generateMockRows(['name', 'email'], 20, createRng(5));
    for (const row of rows) {
      expect(row.email).toMatch(/^[a-z0-9_.]+@[a-z0-9.-]+\.[a-z]{2,}$/);
      const last = row.name?.split(' ').pop()?.toLowerCase() ?? '';
      expect(row.email ?? '').toContain(last);
    }
  });

  it('generates valid UUIDs for the id field', () => {
    const rows = generateMockRows(['id'], 10, createRng(9));
    for (const row of rows) {
      expect(row.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
      );
    }
  });

  it('generates phone numbers in the US format', () => {
    const rows = generateMockRows(['phone'], 10, createRng(3));
    for (const row of rows) {
      expect(row.phone).toMatch(/^\+1 \(\d{3}\) \d{3}-\d{4}$/);
    }
  });
});

describe('toCsv', () => {
  it('writes a header row and one line per record', () => {
    const rows = generateMockRows(['name', 'city'], 2, createRng(4));
    const csv = toCsv(rows);
    const lines = csv.trim().split('\n');
    expect(lines[0]).toBe('name,city');
    expect(lines).toHaveLength(3);
  });

  it('quotes cells that contain commas or quotes', () => {
    const csv = toCsv([{ name: 'Smith, John', city: 'He said "hi"' }]);
    expect(csv).toContain('"Smith, John"');
    expect(csv).toContain('"He said ""hi"""');
  });

  it('returns an empty string for no rows', () => {
    expect(toCsv([])).toBe('');
  });
});

describe('toSqlInsert', () => {
  it('wraps string values in single quotes', () => {
    const sql = toSqlInsert([{ name: 'Ada' }], 'users');
    expect(sql).toContain("VALUES ('Ada')");
  });

  it('doubles single quotes inside values', () => {
    const sql = toSqlInsert([{ name: "O'Brien" }], 'users');
    expect(sql).toContain("('O''Brien')");
  });

  it('emits NULL for empty values', () => {
    const sql = toSqlInsert([{ name: '' }], 'users');
    expect(sql).toContain('VALUES (NULL)');
  });

  it('quotes the table and column identifiers', () => {
    const sql = toSqlInsert([{ 'my column': 'x' }], 'my table');
    expect(sql).toContain('INSERT INTO "my table" ("my column") VALUES');
  });

  it('generates one statement per row', () => {
    const sql = toSqlInsert([{ a: '1' }, { a: '2' }], 't');
    expect(sql.match(/INSERT INTO/g)).toHaveLength(2);
  });
});
