import { describe, expect, it } from 'vitest';
import {
  buildAnimationCss,
  buildAnimationRule,
  buildAnimationShorthand,
  buildKeyframes,
  type AnimationOptions,
} from '@/lib/tools/css-generators';

const BASE_OPTIONS: AnimationOptions = {
  duration: 800,
  delay: 0,
  easing: 'ease-in-out',
  iteration: 1,
  direction: 'normal',
};

describe('buildKeyframes', () => {
  it('builds fade-in keyframes with opacity stops', () => {
    const css = buildKeyframes('fade-in');
    expect(css).toContain('@keyframes fade-in');
    expect(css).toContain('from {');
    expect(css).toContain('opacity: 0;');
    expect(css).toContain('to {');
    expect(css).toContain('opacity: 1;');
  });

  it('builds slide-up keyframes with transforms', () => {
    const css = buildKeyframes('slide-up');
    expect(css).toContain('translateY(100%)');
    expect(css).toContain('translateY(0)');
  });

  it('builds percentage-based stops for bounce', () => {
    const css = buildKeyframes('bounce');
    expect(css).toContain('0%, 100%');
    expect(css).toContain('50%');
    expect(css).toContain('translateY(-30%)');
  });

  it('builds spin keyframes with rotation', () => {
    const css = buildKeyframes('spin');
    expect(css).toContain('rotate(0deg)');
    expect(css).toContain('rotate(360deg)');
  });
});

describe('buildAnimationRule', () => {
  it('emits the full animation rule', () => {
    const css = buildAnimationRule('fade-in', BASE_OPTIONS);
    expect(css).toContain('.animate-fade-in {');
    expect(css).toContain('animation-name: fade-in;');
    expect(css).toContain('animation-duration: 800ms;');
    expect(css).toContain('animation-delay: 0ms;');
    expect(css).toContain('animation-timing-function: ease-in-out;');
    expect(css).toContain('animation-iteration-count: 1;');
    expect(css).toContain('animation-direction: normal;');
    expect(css).toContain('animation-fill-mode: both;');
  });

  it('uses infinite for zero or negative iterations', () => {
    expect(buildAnimationRule('spin', { ...BASE_OPTIONS, iteration: 0 })).toContain(
      'animation-iteration-count: infinite;'
    );
    expect(buildAnimationRule('spin', { ...BASE_OPTIONS, iteration: -1 })).toContain(
      'animation-iteration-count: infinite;'
    );
  });

  it('keeps numeric iterations as numbers', () => {
    expect(buildAnimationRule('spin', { ...BASE_OPTIONS, iteration: 3 })).toContain(
      'animation-iteration-count: 3;'
    );
  });
});

describe('buildAnimationCss', () => {
  it('combines keyframes and the rule', () => {
    const css = buildAnimationCss('bounce', BASE_OPTIONS);
    expect(css).toContain('@keyframes bounce');
    expect(css).toContain('.animate-bounce {');
  });
});

describe('buildAnimationShorthand', () => {
  it('builds a shorthand usable in the animation property', () => {
    expect(buildAnimationShorthand('fade-in', BASE_OPTIONS)).toBe(
      'fade-in 800ms ease-in-out 0ms 1 normal both'
    );
  });

  it('renders infinite iterations', () => {
    expect(buildAnimationShorthand('spin', { ...BASE_OPTIONS, iteration: 0 })).toContain(
      'infinite'
    );
  });
});
