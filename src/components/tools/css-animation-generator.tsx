'use client';

import React, { useMemo, useState } from 'react';
import { Timer, RotateCcw } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import {
  ANIMATION_DIRECTIONS,
  ANIMATION_EASINGS,
  ANIMATION_TYPES,
  DEFAULT_ANIMATION_OPTIONS,
  buildAnimationCss,
  buildAnimationShorthand,
  type AnimationDirection,
  type AnimationOptions,
  type AnimationType,
} from '@/lib/tools/css-generators';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';
import { CopyButton } from '@/components/shared/copy-button';
import { DownloadButton } from '@/components/shared/download-button';
import { cn } from '@/lib/utils';

const CSSAnimationGenerator: React.FC<ToolComponentProps> = () => {
  const [type, setType] = useState<AnimationType>('fade-in');
  const [duration, setDuration] = useState(DEFAULT_ANIMATION_OPTIONS.duration);
  const [delay, setDelay] = useState(DEFAULT_ANIMATION_OPTIONS.delay);
  const [easing, setEasing] = useState(DEFAULT_ANIMATION_OPTIONS.easing);
  const [iteration, setIteration] = useState(DEFAULT_ANIMATION_OPTIONS.iteration);
  const [infinite, setInfinite] = useState(false);
  const [direction, setDirection] = useState<AnimationDirection>(
    DEFAULT_ANIMATION_OPTIONS.direction
  );
  const [runKey, setRunKey] = useState(0);

  const options: AnimationOptions = {
    duration,
    delay,
    easing,
    iteration: infinite ? 0 : iteration,
    direction,
  };

  const css = useMemo(() => buildAnimationCss(type, options), [type, options]);
  const shorthand = useMemo(() => buildAnimationShorthand(type, options), [type, options]);

  const selectClasses =
    'border-border bg-background text-foreground focus-visible:ring-primary rounded-lg border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none';

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Timer className="h-6 w-6" aria-hidden="true" />}
        title="CSS animation generator"
        description="Pick an animation, tune duration, easing, delay, iteration, and direction, then copy the keyframes and animation rule."
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
          Animation type
        </p>
        <div className="flex flex-wrap gap-2">
          {ANIMATION_TYPES.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setType(option.value)}
              aria-pressed={type === option.value}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
                type === option.value
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background text-muted-foreground hover:text-foreground'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label
              htmlFor="anim-duration"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Duration
            </label>
            <div className="mt-2 flex items-center gap-2">
              <input
                id="anim-duration"
                type="range"
                min={100}
                max={5000}
                step={100}
                value={duration}
                onChange={(event) => setDuration(Number(event.target.value))}
                className="flex-1"
              />
              <input
                type="number"
                min={0}
                value={duration}
                onChange={(event) => setDuration(Number(event.target.value))}
                className="border-border bg-background text-foreground focus-visible:ring-primary w-20 rounded-lg border px-2 py-1.5 text-right font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
              />
              <span className="text-muted-foreground text-xs">ms</span>
            </div>
          </div>
          <div>
            <label
              htmlFor="anim-delay"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Delay
            </label>
            <div className="mt-2 flex items-center gap-2">
              <input
                id="anim-delay"
                type="range"
                min={0}
                max={3000}
                step={100}
                value={delay}
                onChange={(event) => setDelay(Number(event.target.value))}
                className="flex-1"
              />
              <input
                type="number"
                min={0}
                value={delay}
                onChange={(event) => setDelay(Number(event.target.value))}
                className="border-border bg-background text-foreground focus-visible:ring-primary w-20 rounded-lg border px-2 py-1.5 text-right font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
              />
              <span className="text-muted-foreground text-xs">ms</span>
            </div>
          </div>
          <div>
            <label
              htmlFor="anim-easing"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Easing
            </label>
            <select
              id="anim-easing"
              value={easing}
              onChange={(event) => setEasing(event.target.value)}
              className={cn(selectClasses, 'mt-2 w-full')}
            >
              {ANIMATION_EASINGS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="anim-iteration"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Iterations
            </label>
            <div className="mt-2 flex items-center gap-3">
              <select
                id="anim-iteration"
                value={iteration}
                onChange={(event) => setIteration(Number(event.target.value))}
                disabled={infinite}
                className={cn(selectClasses, 'disabled:opacity-50')}
              >
                {[1, 2, 3, 5, 10].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
              <label className="flex cursor-pointer items-center gap-2 text-xs font-medium">
                <input
                  type="checkbox"
                  checked={infinite}
                  onChange={(event) => setInfinite(event.target.checked)}
                  className="accent-primary h-4 w-4"
                />
                Infinite
              </label>
            </div>
          </div>
          <div>
            <label
              htmlFor="anim-direction"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Direction
            </label>
            <select
              id="anim-direction"
              value={direction}
              onChange={(event) => setDirection(event.target.value as AnimationDirection)}
              className={cn(selectClasses, 'mt-2 w-full')}
            >
              {ANIMATION_DIRECTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Preview
          </p>
          <button
            type="button"
            onClick={() => setRunKey((key) => key + 1)}
            className="border-border hover:bg-muted rounded-lg border px-3 py-1.5 text-sm font-medium"
          >
            <span className="inline-flex items-center gap-1.5">
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Replay
            </span>
          </button>
        </div>
        <div className="border-border flex h-56 items-center justify-center overflow-hidden rounded-lg border bg-gradient-to-br from-indigo-500/10 to-fuchsia-500/10">
          <div
            key={runKey}
            className="flex h-32 w-32 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-600 shadow-lg"
            style={{ animation: shorthand }}
            aria-label="Animation preview"
          >
            <span className="px-3 text-center text-sm font-semibold text-white">{type}</span>
          </div>
        </div>
      </div>

      <TransformPanel
        inputId="animation-output"
        inputValue=""
        onInputChange={() => {}}
        outputValue={css}
        outputLabel="CSS"
        fileName="animation.css"
        toolbar={
          <>
            <CopyButton value={css} iconOnly size="sm" />
            <DownloadButton
              content={css}
              fileName="animation.css"
              contentType="text/css;charset=utf-8"
              label="Download"
              size="sm"
            />
          </>
        }
      />
    </div>
  );
};

CSSAnimationGenerator.displayName = 'CSSAnimationGenerator';

export { CSSAnimationGenerator };
