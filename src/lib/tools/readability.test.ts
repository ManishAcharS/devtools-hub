import { describe, expect, it } from 'vitest';
import {
  analyzeReadability,
  countSentences,
  countSyllables,
  countWords,
  fleschKincaidGrade,
  fleschReadingEase,
} from '@/lib/tools/readability';

describe('countSyllables', () => {
  it('counts vowel groups', () => {
    expect(countSyllables('hello')).toBe(2);
    expect(countSyllables('beautiful')).toBe(3);
    expect(countSyllables('cat')).toBe(1);
  });

  it('handles silent-e words', () => {
    expect(countSyllables('made')).toBe(1);
    expect(countSyllables('ease')).toBe(1);
    expect(countSyllables('close')).toBe(1);
  });

  it('keeps the e in consonant-le endings', () => {
    expect(countSyllables('table')).toBe(2);
    expect(countSyllables('people')).toBe(2);
  });

  it('treats y as a vowel', () => {
    expect(countSyllables('lazy')).toBe(2);
    expect(countSyllables('system')).toBe(2);
  });

  it('returns 0 for empty or non-letter input', () => {
    expect(countSyllables('')).toBe(0);
    expect(countSyllables('123')).toBe(0);
  });

  it('returns at least 1 for any word', () => {
    expect(countSyllables('a')).toBe(1);
    expect(countSyllables('the')).toBe(1);
  });
});

describe('countSentences', () => {
  it('counts sentences by terminal punctuation', () => {
    expect(countSentences('Hello world. How are you?')).toBe(2);
    expect(countSentences('Wow! Amazing!! Really?')).toBe(3);
  });

  it('treats unpunctuated text as one sentence', () => {
    expect(countSentences('No punctuation here')).toBe(1);
  });

  it('returns 0 for empty text', () => {
    expect(countSentences('')).toBe(0);
    expect(countSentences('   ')).toBe(0);
  });
});

describe('countWords', () => {
  it('splits on whitespace', () => {
    expect(countWords('  hello   world ')).toBe(2);
    expect(countWords('one two three four')).toBe(4);
  });

  it('returns 0 for empty text', () => {
    expect(countWords('')).toBe(0);
  });
});

describe('fleschReadingEase', () => {
  it('returns 0 gracefully on empty input', () => {
    expect(fleschReadingEase(0, 0, 0)).toBe(0);
  });

  it('scores short easy sentences high', () => {
    const score = fleschReadingEase(9, 1, 11);
    expect(score).toBeCloseTo(94.3, 0);
  });
});

describe('fleschKincaidGrade', () => {
  it('returns 0 gracefully on empty input', () => {
    expect(fleschKincaidGrade(0, 0, 0)).toBe(0);
  });

  it('scores a simple sentence around grade 2-3', () => {
    const grade = fleschKincaidGrade(9, 1, 11);
    expect(grade).toBeCloseTo(2.34, 1);
  });
});

describe('analyzeReadability', () => {
  it('returns zeros for empty text', () => {
    expect(analyzeReadability('')).toEqual({
      wordCount: 0,
      sentenceCount: 0,
      syllableCount: 0,
      avgWordsPerSentence: 0,
      avgSyllablesPerWord: 0,
      fleschReadingEase: 0,
      fleschKincaidGrade: 0,
    });
  });

  it('computes counts and averages for a simple sentence', () => {
    const metrics = analyzeReadability('The quick brown fox jumps over the lazy dog.');
    expect(metrics.wordCount).toBe(9);
    expect(metrics.sentenceCount).toBe(1);
    expect(metrics.syllableCount).toBe(11);
    expect(metrics.avgWordsPerSentence).toBeCloseTo(9, 5);
    expect(metrics.avgSyllablesPerWord).toBeCloseTo(11 / 9, 5);
  });

  it('matches the standalone formulas', () => {
    const metrics = analyzeReadability('The quick brown fox jumps over the lazy dog.');
    expect(metrics.fleschReadingEase).toBeCloseTo(fleschReadingEase(9, 1, 11), 5);
    expect(metrics.fleschKincaidGrade).toBeCloseTo(fleschKincaidGrade(9, 1, 11), 5);
  });
});
