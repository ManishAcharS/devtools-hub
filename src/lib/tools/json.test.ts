import { describe, expect, it } from 'vitest';
import { formatJson, jsonStats, parseJson, validateJson } from '@/lib/tools/json';

describe('parseJson', () => {
  it('parses valid documents', () => {
    const result = parseJson('{"a": [1, 2, 3]}');
    expect(result.ok).toBe(true);
    expect(result.value).toEqual({ a: [1, 2, 3] });
  });

  it('rejects empty input', () => {
    const result = parseJson('   ');
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/Enter a JSON document/i);
  });

  it('reports line and column for errors', () => {
    const result = parseJson('{\n  "a": 1,\n  "b": }\n}');
    expect(result.ok).toBe(false);
    expect(result.line).toBe(3);
    expect(result.column).toBeGreaterThan(0);
  });
});

describe('formatJson', () => {
  const input = '{"name":"ada","tags":["math","logic"]}';

  it('pretty-prints with the requested indentation', () => {
    const result = formatJson(input, { indentSize: 2 });
    expect(result.error).toBeNull();
    expect(result.value).toContain('{\n  "name": "ada"');
  });

  it('minifies when requested', () => {
    const result = formatJson('{\n  "a": 1\n}', { minify: true });
    expect(result.value).toBe('{"a":1}');
  });

  it('returns an error for invalid input', () => {
    const result = formatJson('{ nope }');
    expect(result.value).toBe('');
    expect(result.error).not.toBeNull();
    expect(result.stats?.some((stat) => stat.label === 'Line')).toBe(true);
  });

  it('reports input and output lengths', () => {
    const result = formatJson(input);
    expect(result.stats?.find((stat) => stat.label === 'Input length')?.value).toBe(
      String(input.length)
    );
  });
});

describe('validateJson', () => {
  it('validates well-formed documents', () => {
    const result = validateJson('{"ok": true}');
    expect(result.valid).toBe(true);
    expect(result.issues).toHaveLength(0);
    expect(result.stats?.length).toBeGreaterThan(0);
  });

  it('flags malformed documents with position info', () => {
    const result = validateJson('{"a": 1,}');
    expect(result.valid).toBe(false);
    expect(result.issues[0]?.message).toBeTruthy();
    expect(result.issues[0]?.line).toBeDefined();
  });

  it('accepts arrays', () => {
    expect(validateJson('[1, 2, 3]').valid).toBe(true);
  });
});

describe('jsonStats', () => {
  it('computes serialized length', () => {
    const stats = jsonStats({ a: 1 }, ' {"a": 1} ');
    const input = stats.find((stat) => stat.label === 'Input length');
    const serialized = stats.find((stat) => stat.label === 'Serialized length');
    expect(input?.value).toBe('8');
    expect(serialized?.value).toBe('7');
  });
});
