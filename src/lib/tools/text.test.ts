import { describe, expect, it } from 'vitest';
import { convertCase, diffLines, diffWords, textStats, TEXT_CASE_STYLES } from '@/lib/tools/text';

describe('convertCase', () => {
  const cases: [string, string][] = [
    ['camel', 'user profile id'],
    ['pascal', 'user profile id'],
    ['snake', 'userProfileId'],
    ['kebab', 'userProfileId'],
    ['constant', 'user profile id'],
    ['title', 'user profile id'],
    ['sentence', 'USER PROFILE ID'],
    ['lower', 'USER PROFILE ID'],
    ['upper', 'user profile id'],
    ['camel', 'API-response_Data'],
  ];

  it.each(cases)('converts to %s without errors', (style, input) => {
    const output = convertCase(input, style as (typeof TEXT_CASE_STYLES)[number]['value']);
    expect(output.length).toBeGreaterThan(0);
    expect(output).not.toContain('undefined');
  });

  it('produces expected camelCase output', () => {
    expect(convertCase('user profile id', 'camel')).toBe('userProfileId');
  });

  it('produces expected snake_case output', () => {
    expect(convertCase('userProfileId', 'snake')).toBe('user_profile_id');
  });

  it('handles empty input', () => {
    expect(convertCase('', 'camel')).toBe('');
  });

  it('preserves existing case boundaries', () => {
    expect(convertCase('API Response', 'kebab')).toBe('api-response');
  });
});

describe('textStats', () => {
  it('counts characters, words, lines, and sentences', () => {
    const stats = textStats('Hello world.\nThis is a test!');
    expect(stats.words).toBe(6);
    expect(stats.lines).toBe(2);
    expect(stats.sentences).toBe(2);
  });

  it('counts characters with and without spaces', () => {
    const stats = textStats('a b c');
    expect(stats.characters).toBe(5);
    expect(stats.charactersNoSpaces).toBe(3);
  });

  it('computes byte length for non-ASCII text', () => {
    const stats = textStats('é');
    expect(stats.bytes).toBe(2);
  });

  it('reports zero reading time for empty text', () => {
    expect(textStats('').readingTimeSeconds).toBe(0);
  });
});

describe('diffLines', () => {
  it('marks unchanged lines as equal', () => {
    const parts = diffLines('a\nb', 'a\nb');
    expect(parts.every((part) => part.operation === 'equal')).toBe(true);
    expect(parts.map((part) => part.value).join('')).toBe('a\nb');
  });

  it('detects added and removed lines', () => {
    const parts = diffLines('a\nb', 'a\nc');
    expect(parts.some((part) => part.operation === 'removed')).toBe(true);
    expect(parts.some((part) => part.operation === 'added')).toBe(true);
  });

  it('handles empty inputs', () => {
    const parts = diffLines('', 'a');
    expect(parts).toHaveLength(2);
    expect(parts[0]?.operation).toBe('removed');
    expect(parts[1]?.operation).toBe('added');
    expect(diffLines('', '')[0]?.operation).toBe('equal');
  });
});

describe('diffWords', () => {
  it('detects a single word change', () => {
    const parts = diffWords('the quick fox', 'the slow fox');
    expect(parts.some((part) => part.operation === 'removed' && part.value.includes('quick'))).toBe(
      true
    );
    expect(parts.some((part) => part.operation === 'added' && part.value.includes('slow'))).toBe(
      true
    );
  });

  it('keeps whitespace as separate tokens', () => {
    const parts = diffWords('a b', 'a b');
    expect(parts.map((part) => part.value).join('')).toBe('a b');
  });
});
