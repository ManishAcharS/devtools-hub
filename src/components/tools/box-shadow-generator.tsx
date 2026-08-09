'use client';

import React, { useMemo, useState } from 'react';
import { Square, Copy, Download, Minus, Plus } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { boxShadowToCss, DEFAULT_BOX_SHADOW, type BoxShadowOptions } from '@/lib/tools/css';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';
import { CopyButton } from '@/components/shared/copy-button';
import { DownloadButton } from '@/components/shared/download-button';

const BoxShadowGenerator: React.FC<ToolComponentProps> = () => {
  const [options, setOptions] = useState<BoxShadowOptions>(DEFAULT_BOX_SHADOW);

  const css = useMemo(() => boxShadowToCss(options), [options]);

  const update = (field: keyof BoxShadowOptions, value: number | string | boolean) => {
    setOptions((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Square className="h-6 w-6" aria-hidden="true" />}
        title="Box shadow generator"
        description="Design box shadows visually with offset, blur, spread, color, and inset options."
      />
      <div className="border-border bg-card rounded-xl border p-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase">
              Offset X
            </label>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="range"
                min={-50}
                max={50}
                value={options.offsetX}
                onChange={(e) => update('offsetX', Number(e.target.value))}
                className="flex-1"
              />
              <input
                type="number"
                value={options.offsetX}
                onChange={(e) => update('offsetX', Number(e.target.value))}
                className="border-border bg-background text-foreground focus-visible:ring-primary w-20 rounded-lg border px-2 py-1.5 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
              />
              <span className="text-muted-foreground text-xs">px</span>
            </div>
          </div>
          <div>
            <label className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase">
              Offset Y
            </label>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="range"
                min={-50}
                max={50}
                value={options.offsetY}
                onChange={(e) => update('offsetY', Number(e.target.value))}
                className="flex-1"
              />
              <input
                type="number"
                value={options.offsetY}
                onChange={(e) => update('offsetY', Number(e.target.value))}
                className="border-border bg-background text-foreground focus-visible:ring-primary w-20 rounded-lg border px-2 py-1.5 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
              />
              <span className="text-muted-foreground text-xs">px</span>
            </div>
          </div>
          <div>
            <label className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase">
              Blur radius
            </label>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={100}
                value={options.blur}
                onChange={(e) => update('blur', Number(e.target.value))}
                className="flex-1"
              />
              <input
                type="number"
                min={0}
                value={options.blur}
                onChange={(e) => update('blur', Number(e.target.value))}
                className="border-border bg-background text-foreground focus-visible:ring-primary w-20 rounded-lg border px-2 py-1.5 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
              />
              <span className="text-muted-foreground text-xs">px</span>
            </div>
          </div>
          <div>
            <label className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase">
              Spread
            </label>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="range"
                min={-20}
                max={20}
                value={options.spread}
                onChange={(e) => update('spread', Number(e.target.value))}
                className="flex-1"
              />
              <input
                type="number"
                value={options.spread}
                onChange={(e) => update('spread', Number(e.target.value))}
                className="border-border bg-background text-foreground focus-visible:ring-primary w-20 rounded-lg border px-2 py-1.5 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
              />
              <span className="text-muted-foreground text-xs">px</span>
            </div>
          </div>
          <div>
            <label className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase">
              Color
            </label>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="color"
                value={options.color}
                onChange={(e) => update('color', e.target.value)}
                className="h-10 w-14 cursor-pointer rounded-lg border"
              />
            </div>
          </div>
          <div>
            <label className="text-muted-foreground mt-5 block text-xs font-semibold tracking-wider uppercase">
              Options
            </label>
            <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs font-medium">
              <input
                type="checkbox"
                checked={options.inset}
                onChange={(e) => update('inset', e.target.checked)}
                className="accent-primary h-4 w-4"
              />
              Inset
            </label>
          </div>
        </div>
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
          Preview
        </p>
        <div
          className="border-border mx-auto h-48 w-48 rounded-lg border bg-white dark:bg-gray-800"
          style={{ boxShadow: css }}
          aria-label="Box shadow preview"
        />
      </div>

      <TransformPanel
        inputId="shadow-output"
        inputValue=""
        onInputChange={() => {}}
        outputValue={css}
        outputLabel="CSS"
        fileName="box-shadow.css"
        toolbar={
          <>
            <CopyButton value={css} iconOnly size="sm" />
            <DownloadButton
              content={css}
              fileName="box-shadow.css"
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

BoxShadowGenerator.displayName = 'BoxShadowGenerator';

export { BoxShadowGenerator };
