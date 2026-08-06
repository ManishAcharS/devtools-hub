/**
 * Physically based spring simulation, ported from the liquid cursor in
 * `Default Project`. Semi-implicit Euler integration with a clamped time
 * step: frame-rate independent, velocity-aware, no easing functions.
 */

export interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
}

export const SPRING = {
  /** Fast, barely overshooting. Used for the cursor dot. */
  snappy: { stiffness: 320, damping: 28, mass: 1 } satisfies SpringConfig,
  /** Smooth glass-like settling with a whisper of overshoot. */
  glass: { stiffness: 220, damping: 22, mass: 1 } satisfies SpringConfig,
  /** Loose, floating feel for trailing / ambient elements. */
  float: { stiffness: 90, damping: 16, mass: 1 } satisfies SpringConfig,
  /** High viscosity liquid motion. */
  liquid: { stiffness: 140, damping: 20, mass: 1.2 } satisfies SpringConfig,
  /** Deliberately springy, for press-release ripples. */
  bounce: { stiffness: 380, damping: 12, mass: 1 } satisfies SpringConfig,
} satisfies Record<string, SpringConfig>;

export class Spring {
  value: number;
  velocity = 0;
  target: number;
  private config: SpringConfig;

  constructor(initial: number, target: number, config: SpringConfig) {
    this.value = initial;
    this.target = target;
    this.config = config;
  }

  setTarget(target: number): void {
    this.target = target;
  }

  /** Hard-set the current value, zeroing velocity. */
  snap(value: number): void {
    this.value = value;
    this.target = value;
    this.velocity = 0;
  }

  /** Advance the simulation by `dt` seconds. Returns the current value. */
  update(dt: number): number {
    const { stiffness, damping, mass } = this.config;
    const invMass = 1 / mass;
    const acc = (-stiffness * (this.value - this.target) - damping * this.velocity) * invMass;
    this.velocity += acc * dt;
    this.value += this.velocity * dt;
    return this.value;
  }
}

/** A 2D spring pair, used wherever motion has both X and Y components. */
export class VectorSpring {
  x: Spring;
  y: Spring;

  constructor(ix: number, iy: number, tx: number, ty: number, config: SpringConfig) {
    this.x = new Spring(ix, tx, config);
    this.y = new Spring(iy, ty, config);
  }

  setTarget(x: number, y: number): void {
    this.x.setTarget(x);
    this.y.setTarget(y);
  }

  snap(x: number, y: number): void {
    this.x.snap(x);
    this.y.snap(y);
  }

  update(dt: number): void {
    this.x.update(dt);
    this.y.update(dt);
  }
}

export function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}

export function length2(x: number, y: number): number {
  return Math.sqrt(x * x + y * y);
}
