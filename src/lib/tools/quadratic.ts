export interface ComplexRoot {
  real: number;
  imaginary: number;
}

export type QuadraticSolution =
  | { kind: 'two-real'; discriminant: number; roots: [number, number]; steps: string[] }
  | { kind: 'repeated'; discriminant: number; roots: [number]; steps: string[] }
  | { kind: 'complex'; discriminant: number; roots: [ComplexRoot, ComplexRoot]; steps: string[] }
  | { kind: 'linear'; discriminant: null; roots: [number]; steps: string[] }
  | { kind: 'degenerate'; discriminant: null; roots: []; note: string; steps: string[] };

const EPSILON = 1e-10;

function clean(value: number): number {
  const rounded = Math.round(value * 1e12) / 1e12;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 }).format(value);
}

export function solveQuadratic(a: number, b: number, c: number): QuadraticSolution {
  const steps: string[] = [];
  if (Math.abs(a) <= EPSILON) {
    if (Math.abs(b) <= EPSILON) {
      if (Math.abs(c) <= EPSILON) {
        return {
          kind: 'degenerate',
          discriminant: null,
          roots: [],
          note: 'Every value of x satisfies 0 = 0.',
          steps,
        };
      }
      return {
        kind: 'degenerate',
        discriminant: null,
        roots: [],
        note: 'No value of x satisfies 0 = ' + formatNumber(c) + '.',
        steps,
      };
    }
    const root = clean(-c / b);
    steps.push('a = 0, so this is a linear equation.');
    steps.push(`${formatNumber(b)}x + ${formatNumber(c)} = 0`);
    steps.push(`x = -c / b = ${formatNumber(root)}`);
    return { kind: 'linear', discriminant: null, roots: [root], steps };
  }

  const discriminant = clean(b * b - 4 * a * c);
  const denominator = 2 * a;
  steps.push(`a = ${formatNumber(a)}, b = ${formatNumber(b)}, c = ${formatNumber(c)}`);
  steps.push(`D = b\u00b2 - 4ac = ${formatNumber(discriminant)}`);

  if (Math.abs(discriminant) <= EPSILON) {
    const root = clean(-b / denominator);
    steps.push('D = 0, so there is one repeated real root.');
    steps.push(`x = -b / 2a = ${formatNumber(root)}`);
    return { kind: 'repeated', discriminant, roots: [root], steps };
  }

  if (discriminant > 0) {
    const sqrt = Math.sqrt(discriminant);
    const rootOne = clean((-b - sqrt) / denominator);
    const rootTwo = clean((-b + sqrt) / denominator);
    steps.push(`\u221aD = ${formatNumber(sqrt)}`);
    steps.push('D > 0, so there are two distinct real roots.');
    steps.push(`x\u2081 = (-b - \u221aD) / 2a = ${formatNumber(rootOne)}`);
    steps.push(`x\u2082 = (-b + \u221aD) / 2a = ${formatNumber(rootTwo)}`);
    return { kind: 'two-real', discriminant, roots: [rootOne, rootTwo], steps };
  }

  const sqrt = Math.sqrt(Math.abs(discriminant));
  const real = clean(-b / denominator);
  const imaginary = clean(sqrt / Math.abs(denominator));
  steps.push(`\u221a|D| = ${formatNumber(sqrt)}`);
  steps.push('D < 0, so the roots are complex conjugates.');
  steps.push('x = -b / 2a \u00b1 (i / 2a) \u00b7 \u221a|D|');
  steps.push(`x = ${formatNumber(real)} \u00b1 ${formatNumber(imaginary)}i`);
  return {
    kind: 'complex',
    discriminant,
    roots: [
      { real, imaginary },
      { real, imaginary: -imaginary },
    ],
    steps,
  };
}
