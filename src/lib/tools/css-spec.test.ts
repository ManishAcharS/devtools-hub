import { describe, expect, it } from 'vitest';
import { calculateSpecificity, compareSpecificity } from '@/lib/tools/css-spec';

describe('calculateSpecificity', () => {
  it('counts an id as (1, 0, 0) with score 100', () => {
    const result = calculateSpecificity('#header');
    expect(result).toMatchObject({ a: 1, b: 0, c: 0, score: 100 });
    expect(result.parts).toEqual([{ raw: '#header', a: 1, b: 0, c: 0 }]);
  });

  it('counts type selectors as elements', () => {
    expect(calculateSpecificity('ul li a')).toMatchObject({ a: 0, b: 0, c: 3, score: 3 });
  });

  it('mixes classes and elements', () => {
    expect(calculateSpecificity('.menu ul li a')).toMatchObject({ a: 0, b: 1, c: 3, score: 13 });
  });

  it('counts pseudo-classes in column b', () => {
    expect(calculateSpecificity('a:hover')).toMatchObject({ a: 0, b: 1, c: 1, score: 11 });
  });

  it('counts attribute selectors as classes', () => {
    expect(calculateSpecificity('input[type="text"]')).toMatchObject({ a: 0, b: 1, c: 1 });
  });

  it('counts pseudo-elements as elements', () => {
    expect(calculateSpecificity('div::before')).toMatchObject({ a: 0, b: 0, c: 2, score: 2 });
  });

  it('treats legacy single-colon pseudo-elements as elements', () => {
    expect(calculateSpecificity('p:first-letter')).toMatchObject({ a: 0, b: 0, c: 2 });
  });

  it('takes the max of :is() and :not() arguments', () => {
    expect(calculateSpecificity(':is(header, #main)')).toMatchObject({ a: 1, b: 0, c: 0 });
    expect(calculateSpecificity('ul :not(.item)')).toMatchObject({ a: 0, b: 1, c: 1 });
  });

  it('gives :where() zero specificity', () => {
    expect(calculateSpecificity(':where(.foo, #bar)')).toMatchObject({
      a: 0,
      b: 0,
      c: 0,
      score: 0,
    });
  });

  it('handles :has() arguments', () => {
    expect(calculateSpecificity('section:has(> img)')).toMatchObject({ a: 0, b: 0, c: 2 });
  });

  it('does not count nth-child arguments as elements', () => {
    expect(calculateSpecificity('li:nth-child(2n+1)')).toMatchObject({ a: 0, b: 1, c: 1 });
  });

  it('ignores the universal selector', () => {
    expect(calculateSpecificity('*')).toMatchObject({ a: 0, b: 0, c: 0, score: 0 });
    expect(calculateSpecificity('* .box')).toMatchObject({ a: 0, b: 1, c: 0 });
  });

  it('ignores combinators and comments', () => {
    expect(calculateSpecificity('header /* comment */ > nav a + span')).toMatchObject({
      a: 0,
      b: 0,
      c: 4,
    });
  });

  it('returns zeros for empty input', () => {
    expect(calculateSpecificity('')).toMatchObject({ a: 0, b: 0, c: 0, score: 0, parts: [] });
    expect(calculateSpecificity('   ')).toMatchObject({ a: 0, b: 0, c: 0, score: 0 });
  });

  it('uses the most specific branch of a selector list', () => {
    expect(calculateSpecificity('h1, .title, #hero')).toMatchObject({ a: 1, b: 0, c: 0 });
  });

  it('breaks down the result into parts', () => {
    const result = calculateSpecificity('#app .panel div');
    expect(result.parts.map((part) => part.raw)).toEqual(['#app', '.panel', 'div']);
    expect(result.parts[0]).toEqual({ raw: '#app', a: 1, b: 0, c: 0 });
    expect(result.parts[1]).toEqual({ raw: '.panel', a: 0, b: 1, c: 0 });
    expect(result.parts[2]).toEqual({ raw: 'div', a: 0, b: 0, c: 1 });
  });
});

describe('compareSpecificity', () => {
  it('returns 1 when A is more specific', () => {
    expect(compareSpecificity(calculateSpecificity('#main'), calculateSpecificity('.main'))).toBe(
      1
    );
  });

  it('returns -1 when B is more specific', () => {
    expect(compareSpecificity(calculateSpecificity('a'), calculateSpecificity('a:hover'))).toBe(-1);
  });

  it('returns 0 for equal specificity', () => {
    expect(compareSpecificity(calculateSpecificity('.a .b'), calculateSpecificity('.x .y'))).toBe(
      0
    );
  });
});
