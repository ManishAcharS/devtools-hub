'use client';

import React, { useMemo, useState } from 'react';
import { Triangle } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';
import { CopyButton } from '@/components/shared/copy-button';
import { DownloadButton } from '@/components/shared/download-button';
import { cn } from '@/lib/utils';

type TriangleSide = 'top' | 'right' | 'bottom' | 'left';

type TriangleDirection =
  'up' | 'down' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

const TRIANGLE_DIRECTIONS: { value: TriangleDirection; label: string }[] = [
  { value: 'up', label: 'Up' },
  { value: 'down', label: 'Down' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'top-left', label: 'Top left' },
  { value: 'top-right', label: 'Top right' },
  { value: 'bottom-left', label: 'Bottom left' },
  { value: 'bottom-right', label: 'Bottom right' },
];

const BORDER_STYLES: Record<
  TriangleDirection,
  { solid: TriangleSide; transparent: TriangleSide[] }
> = {
  up: { solid: 'bottom', transparent: ['left', 'right'] },
  down: { solid: 'top', transparent: ['left', 'right'] },
  left: { solid: 'right', transparent: ['top', 'bottom'] },
  right: { solid: 'left', transparent: ['top', 'bottom'] },
  'top-left': { solid: 'top', transparent: ['right'] },
  'top-right': { solid: 'top', transparent: ['left'] },
  'bottom-left': { solid: 'bottom', transparent: ['right'] },
  'bottom-right': { solid: 'bottom', transparent: ['left'] },
};

function triangleBorders(
  direction: TriangleDirection,
  size: number,
  color: string
): Record<TriangleSide, string> {
  const { solid, transparent } = BORDER_STYLES[direction];
  const borders: Record<TriangleSide, string> = { top: '', right: '', bottom: '', left: '' };
  for (const side of Object.keys(borders) as TriangleSide[]) {
    if (side === solid) {
      borders[side] = `${size}px solid ${color}`;
    } else if (transparent.includes(side)) {
      borders[side] = `${size}px solid transparent`;
    }
  }
  return borders;
}

function triangleCss(direction: TriangleDirection, size: number, color: string): string {
  const borders = triangleBorders(direction, size, color);
  const lines = (Object.keys(borders) as TriangleSide[])
    .filter((side) => borders[side])
    .map((side) => `  border-${side}: ${borders[side]};`);
  return `.triangle {\n  width: 0;\n  height: 0;\n${lines.join('\n')}\n}`;
}

const CSS_TRIANGLE_GENERATOR_SIZE_MIN = 8;
const CSS_TRIANGLE_GENERATOR_SIZE_MAX = 160;

const CSSTriangleGenerator: React.FC<ToolComponentProps> = () => {
  const [direction, setDirection] = useState<TriangleDirection>('up');
  const [size, setSize] = useState(64);
  const [color, setColor] = useState('#6366f1');

  const css = useMemo(() => triangleCss(direction, size, color), [direction, size, color]);
  const borders = useMemo(() => triangleBorders(direction, size, color), [direction, size, color]);

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Triangle className="h-6 w-6" aria-hidden="true" />}
        title="CSS triangle generator"
        description="Create CSS-only triangles with the border trick — pick a direction, size, and color, then copy the generated CSS."
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
          Direction
        </p>
        <div className="flex flex-wrap gap-2">
          {TRIANGLE_DIRECTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setDirection(option.value)}
              aria-pressed={direction === option.value}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
                direction === option.value
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
        <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="triangle-size"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Size
            </label>
            <div className="mt-2 flex items-center gap-2">
              <input
                id="triangle-size"
                type="range"
                min={CSS_TRIANGLE_GENERATOR_SIZE_MIN}
                max={CSS_TRIANGLE_GENERATOR_SIZE_MAX}
                value={size}
                onChange={(event) => setSize(Number(event.target.value))}
                className="flex-1"
              />
              <input
                type="number"
                min={CSS_TRIANGLE_GENERATOR_SIZE_MIN}
                max={CSS_TRIANGLE_GENERATOR_SIZE_MAX}
                value={size}
                onChange={(event) => setSize(Number(event.target.value))}
                className="border-border bg-background text-foreground focus-visible:ring-primary w-20 rounded-lg border px-2 py-1.5 text-right font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
              />
              <span className="text-muted-foreground text-xs">px</span>
            </div>
          </div>
          <div>
            <label
              htmlFor="triangle-color"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Color
            </label>
            <div className="mt-2 flex items-center gap-2">
              <input
                id="triangle-color"
                type="color"
                value={color}
                onChange={(event) => setColor(event.target.value)}
                className="h-9 w-14 cursor-pointer rounded-lg border"
              />
              <input
                type="text"
                value={color}
                onChange={(event) => setColor(event.target.value)}
                className="border-border bg-background text-foreground focus-visible:ring-primary w-28 rounded-lg border px-3 py-2 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
                spellCheck={false}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
          Preview
        </p>
        <div className="border-border flex h-56 items-center justify-center rounded-lg border bg-gradient-to-br from-indigo-500/10 to-fuchsia-500/10">
          <div
            className="h-0 w-0"
            style={{
              borderTop: borders.top || undefined,
              borderRight: borders.right || undefined,
              borderBottom: borders.bottom || undefined,
              borderLeft: borders.left || undefined,
            }}
            aria-label="Triangle preview"
          />
        </div>
      </div>

      <TransformPanel
        inputId="triangle-output"
        inputValue=""
        onInputChange={() => {}}
        outputValue={css}
        outputLabel="CSS"
        fileName="triangle.css"
        toolbar={
          <>
            <CopyButton value={css} iconOnly size="sm" />
            <DownloadButton
              content={css}
              fileName="triangle.css"
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

CSSTriangleGenerator.displayName = 'CSSTriangleGenerator';

export { CSSTriangleGenerator };
