export type AnimationType =
  | 'fade-in'
  | 'fade-out'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'bounce'
  | 'pulse'
  | 'spin'
  | 'flip'
  | 'shake';

export type AnimationDirection = 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';

export interface AnimationOptions {
  duration: number;
  delay: number;
  easing: string;
  iteration: number;
  direction: AnimationDirection;
}

export const ANIMATION_TYPES: { value: AnimationType; label: string }[] = [
  { value: 'fade-in', label: 'Fade in' },
  { value: 'fade-out', label: 'Fade out' },
  { value: 'slide-up', label: 'Slide up' },
  { value: 'slide-down', label: 'Slide down' },
  { value: 'slide-left', label: 'Slide left' },
  { value: 'slide-right', label: 'Slide right' },
  { value: 'bounce', label: 'Bounce' },
  { value: 'pulse', label: 'Pulse' },
  { value: 'spin', label: 'Spin' },
  { value: 'flip', label: 'Flip' },
  { value: 'shake', label: 'Shake' },
];

export const ANIMATION_EASINGS = [
  'linear',
  'ease',
  'ease-in',
  'ease-out',
  'ease-in-out',
  'cubic-bezier(0.68, -0.55, 0.27, 1.55)',
];

export const ANIMATION_DIRECTIONS: AnimationDirection[] = [
  'normal',
  'reverse',
  'alternate',
  'alternate-reverse',
];

export const DEFAULT_ANIMATION_OPTIONS: AnimationOptions = {
  duration: 800,
  delay: 0,
  easing: 'ease-in-out',
  iteration: 1,
  direction: 'normal',
};

const KEYFRAME_STOPS: Record<AnimationType, Record<string, string>> = {
  'fade-in': { from: 'opacity: 0;', to: 'opacity: 1;' },
  'fade-out': { from: 'opacity: 1;', to: 'opacity: 0;' },
  'slide-up': {
    from: 'opacity: 0; transform: translateY(100%);',
    to: 'opacity: 1; transform: translateY(0);',
  },
  'slide-down': {
    from: 'opacity: 0; transform: translateY(-100%);',
    to: 'opacity: 1; transform: translateY(0);',
  },
  'slide-left': {
    from: 'opacity: 0; transform: translateX(100%);',
    to: 'opacity: 1; transform: translateX(0);',
  },
  'slide-right': {
    from: 'opacity: 0; transform: translateX(-100%);',
    to: 'opacity: 1; transform: translateX(0);',
  },
  bounce: {
    '0%, 100%': 'transform: translateY(0);',
    '50%': 'transform: translateY(-30%);',
  },
  pulse: {
    '0%, 100%': 'opacity: 1;',
    '50%': 'opacity: 0.4;',
  },
  spin: { from: 'transform: rotate(0deg);', to: 'transform: rotate(360deg);' },
  flip: {
    from: 'transform: perspective(400px) rotateY(0deg);',
    to: 'transform: perspective(400px) rotateY(180deg);',
  },
  shake: {
    '0%, 100%': 'transform: translateX(0);',
    '20%': 'transform: translateX(-10%);',
    '40%': 'transform: translateX(10%);',
    '60%': 'transform: translateX(-10%);',
    '80%': 'transform: translateX(10%);',
  },
};

export function buildKeyframes(type: AnimationType): string {
  const stops = KEYFRAME_STOPS[type];
  const body = Object.entries(stops)
    .map(([stop, declarations]) => {
      const lines = declarations
        .split(';')
        .map((declaration) => declaration.trim())
        .filter(Boolean)
        .map((declaration) => `    ${declaration};`);
      return `  ${stop} {\n${lines.join('\n')}\n  }`;
    })
    .join('\n');
  return `@keyframes ${type} {\n${body}\n}`;
}

export function buildAnimationRule(type: AnimationType, options: AnimationOptions): string {
  const { duration, delay, easing, iteration, direction } = options;
  const count = iteration <= 0 ? 'infinite' : String(iteration);
  return [
    `.animate-${type} {`,
    `  animation-name: ${type};`,
    `  animation-duration: ${duration}ms;`,
    `  animation-delay: ${delay}ms;`,
    `  animation-timing-function: ${easing};`,
    `  animation-iteration-count: ${count};`,
    `  animation-direction: ${direction};`,
    `  animation-fill-mode: both;`,
    `}`,
  ].join('\n');
}

export function buildAnimationCss(type: AnimationType, options: AnimationOptions): string {
  return `${buildKeyframes(type)}\n\n${buildAnimationRule(type, options)}`;
}

export function buildAnimationShorthand(type: AnimationType, options: AnimationOptions): string {
  const count = options.iteration <= 0 ? 'infinite' : String(options.iteration);
  return `${type} ${options.duration}ms ${options.easing} ${options.delay}ms ${count} ${options.direction} both`;
}
