import { describe, expect, it } from 'vitest';
import { solveQuadratic } from '@/lib/tools/quadratic';

describe('solveQuadratic', () => {
  it('finds two real roots', () => {
    const solution = solveQuadratic(1, -5, 6);
    expect(solution.kind).toBe('two-real');
    if (solution.kind !== 'two-real') return;
    expect(solution.discriminant).toBe(1);
    expect(solution.roots).toEqual([2, 3]);
  });

  it('finds a repeated root', () => {
    const solution = solveQuadratic(1, -4, 4);
    expect(solution.kind).toBe('repeated');
    if (solution.kind !== 'repeated') return;
    expect(solution.discriminant).toBe(0);
    expect(solution.roots).toEqual([2]);
  });

  it('returns complex roots for a negative discriminant', () => {
    const solution = solveQuadratic(1, 0, 4);
    expect(solution.kind).toBe('complex');
    if (solution.kind !== 'complex') return;
    expect(solution.discriminant).toBe(-16);
    expect(solution.roots[0]?.real).toBe(0);
    expect(solution.roots[0]?.imaginary).toBe(2);
    expect(solution.roots[1]?.imaginary).toBe(-2);
  });

  it('handles a zero coefficient as a linear equation', () => {
    const solution = solveQuadratic(0, 2, 6);
    expect(solution.kind).toBe('linear');
    if (solution.kind !== 'linear') return;
    expect(solution.roots).toEqual([-3]);
  });

  it('handles degenerate equations', () => {
    const none = solveQuadratic(0, 0, 5);
    expect(none.kind).toBe('degenerate');
    expect(none.roots).toEqual([]);
    const all = solveQuadratic(0, 0, 0);
    expect(all.kind).toBe('degenerate');
  });

  it('includes explanatory steps', () => {
    const solution = solveQuadratic(1, -5, 6);
    expect(solution.steps.length).toBeGreaterThan(0);
    expect(solution.steps.join('\n')).toContain('D = b');
  });

  it('avoids floating point noise', () => {
    const solution = solveQuadratic(0.1, 0.2, 0.1);
    expect(solution.kind).toBe('repeated');
    if (solution.kind !== 'repeated') return;
    expect(solution.roots[0]).toBe(-1);
  });
});
