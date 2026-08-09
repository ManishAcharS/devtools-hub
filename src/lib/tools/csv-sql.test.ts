import { describe, expect, it } from 'vitest';
import { csvToSql } from '@/lib/tools/csv-sql';

const SAMPLE = 'id,name,score\n1,Ada,9.5\n2,"O\'Brien",8\n3,"Smith, John",7.25';

describe('csvToSql', () => {
  it('generates an INSERT with quoted identifiers', () => {
    const result = csvToSql(SAMPLE, 'players', { batchSize: 1, nullForEmpty: true });
    expect(result.error).toBeNull();
    expect(result.value).toContain('INSERT INTO players ("id", "name", "score")');
  });

  it('doubles single quotes inside string values', () => {
    const result = csvToSql(SAMPLE, 'players', { batchSize: 1, nullForEmpty: true });
    expect(result.value).toContain("'O''Brien'");
  });

  it('keeps numeric values unquoted', () => {
    const result = csvToSql(SAMPLE, 'players', { batchSize: 1, nullForEmpty: true });
    expect(result.value).toContain("(1, 'Ada', 9.5)");
    expect(result.value).toContain("(2, 'O''Brien', 8)");
  });

  it('treats empty cells as NULL when requested', () => {
    const result = csvToSql('a,b\n1,\n,2', 't', { batchSize: 1, nullForEmpty: true });
    expect(result.value).toContain('(1, NULL)');
    expect(result.value).toContain('(NULL, 2)');
  });

  it('treats empty cells as empty strings when not requested', () => {
    const result = csvToSql('a,b\n1,\n,2', 't', { batchSize: 1, nullForEmpty: false });
    expect(result.value).toContain("(1, '')");
    expect(result.value).toContain("('', 2)");
  });

  it('batches rows into multi-row VALUES groups', () => {
    const result = csvToSql('a\n1\n2\n3\n4\n5', 't', { batchSize: 2, nullForEmpty: true });
    expect(result.value).toContain('VALUES\n  (1),\n  (2);');
    expect(result.value).toContain('VALUES\n  (5);');
    expect(result.stats?.[1]?.value).toBe('3');
  });

  it('produces one statement per row in per-row mode', () => {
    const result = csvToSql('a\n1\n2\n3', 't', { batchSize: 1, nullForEmpty: true });
    expect(result.value.match(/INSERT INTO/g)).toHaveLength(3);
  });

  it('handles quoted values containing commas and newlines', () => {
    const result = csvToSql('name\n"Smith, John"\n"Line1\nLine2"', 't', {
      batchSize: 1,
      nullForEmpty: true,
    });
    expect(result.value).toContain("'Smith, John'");
    expect(result.value).toContain("'Line1\nLine2'");
  });

  it('errors without a table name or data', () => {
    expect(csvToSql(SAMPLE, '', { batchSize: 1, nullForEmpty: true }).error).toContain('table');
    expect(csvToSql('', 't', { batchSize: 1, nullForEmpty: true }).error).toContain('CSV');
    expect(csvToSql('only,header\n', 't', { batchSize: 1, nullForEmpty: true }).error).toContain(
      'header'
    );
  });

  it('reports unterminated quote errors', () => {
    const result = csvToSql('a\n"unclosed', 't', { batchSize: 1, nullForEmpty: true });
    expect(result.error).toContain('Unterminated');
  });
});
