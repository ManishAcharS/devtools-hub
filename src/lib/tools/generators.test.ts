import { describe, expect, it } from 'vitest';
import {
  generateLorem,
  generateRandomNumbers,
  generateUuids,
  randomInt,
  randomUuid,
  slugify,
} from '@/lib/tools/generators';

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe('randomUuid', () => {
  it('produces v4 UUIDs', () => {
    for (let i = 0; i < 50; i += 1) {
      expect(randomUuid()).toMatch(UUID_V4);
    }
  });

  it('produces unique values', () => {
    const values = new Set(Array.from({ length: 100 }, () => randomUuid()));
    expect(values.size).toBe(100);
  });
});

describe('generateUuids', () => {
  it('generates the requested count', () => {
    const result = generateUuids(5, { removeHyphens: false, uppercase: false });
    expect(result.uuids).toHaveLength(5);
    expect(result.error).toBeNull();
  });

  it('applies options', () => {
    const result = generateUuids(1, { removeHyphens: true, uppercase: true });
    expect(result.uuids[0]).toMatch(/^[0-9A-F]{32}$/);
  });

  it('removes duplicates', () => {
    const result = generateUuids(50, { removeHyphens: false, uppercase: false });
    expect(new Set(result.uuids).size).toBe(50);
  });
});

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    const result = slugify('Hello World!', { separator: '-', lowercase: true, maxLength: 50 });
    expect(result.value).toBe('hello-world');
  });

  it('removes diacritics', () => {
    const result = slugify('Café Möller', { separator: '-', lowercase: true, maxLength: 50 });
    expect(result.value).toBe('cafe-moller');
  });

  it('collapses multiple separators', () => {
    const result = slugify('a   b -- c', { separator: '-', lowercase: true, maxLength: 50 });
    expect(result.value).toBe('a-b-c');
  });

  it('respects maxLength', () => {
    const result = slugify('a very long title that should be cut off', {
      separator: '-',
      lowercase: true,
      maxLength: 10,
    });
    expect(result.value.length).toBeLessThanOrEqual(10);
  });

  it('errors on empty input', () => {
    const result = slugify('   ', { separator: '-', lowercase: true, maxLength: 50 });
    expect(result.error).not.toBeNull();
  });
});

describe('generateLorem', () => {
  it('generates the requested paragraphs', () => {
    const result = generateLorem({
      paragraphs: 3,
      sentencesPerParagraph: 2,
      startWithClassic: true,
    });
    expect(result.value.split('\n\n')).toHaveLength(3);
  });

  it('starts with the classic opening when requested', () => {
    const result = generateLorem({
      paragraphs: 1,
      sentencesPerParagraph: 1,
      startWithClassic: true,
    });
    expect(result.value).toContain('Lorem ipsum dolor sit amet');
  });

  it('clamps extreme counts', () => {
    const result = generateLorem({
      paragraphs: 100,
      sentencesPerParagraph: 100,
      startWithClassic: false,
    });
    expect(result.value.split('\n\n')).toHaveLength(20);
  });
});

describe('randomInt', () => {
  it('stays within bounds', () => {
    for (let i = 0; i < 200; i += 1) {
      const value = randomInt(5, 10);
      expect(value).toBeGreaterThanOrEqual(5);
      expect(value).toBeLessThanOrEqual(10);
    }
  });
});

describe('generateRandomNumbers', () => {
  it('generates the requested count', () => {
    const result = generateRandomNumbers({ min: 1, max: 10, count: 5, unique: false });
    expect(result.numbers).toHaveLength(5);
    expect(result.error).toBeNull();
  });

  it('errors when min exceeds max', () => {
    const result = generateRandomNumbers({ min: 10, max: 1, count: 1, unique: false });
    expect(result.numbers).toHaveLength(0);
    expect(result.error).toMatch(/minimum/i);
  });

  it('errors when unique count exceeds range', () => {
    const result = generateRandomNumbers({ min: 1, max: 2, count: 5, unique: true });
    expect(result.error).toMatch(/unique/i);
  });
});
