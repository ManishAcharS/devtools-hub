'use client';

import React, { useMemo, useState } from 'react';
import { Square, Copy, Download, Minus, Plus, Link2, Link2Off } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import {
  borderRadiusToCss,
  DEFAULT_BORDER_RADIUS,
  type BorderRadiusOptions,
} from '@/lib/tools/css';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';
import { CopyButton } from '@/components/shared/copy-button';
import { DownloadButton } from '@/components/shared/download-button';

const BorderRadiusGenerator: React.FC<ToolComponentProps> = () => {
  const [options, setOptions] = useState<BorderRadiusOptions>(DEFAULT_BORDER_RADIUS);
  const [linked, setLinked] = useState(true);

  const css = useMemo(() => borderRadiusToCss(options), [options]);

  const update = (field: keyof BorderRadiusOptions, value: number) => {
    setOptions((prev) => {
      if (linked) {
        return { topLeft: value, topRight: value, bottomRight: value, bottomLeft: value };
      }
      return { ...prev, [field]: value };
    });
  };

  const presets = [
    { label: 'None', values: { topLeft: 0, topRight: 0, bottomRight: 0, bottomLeft: 0 } },
    { label: 'Small', values: { topLeft: 4, topRight: 4, bottomRight: 4, bottomLeft: 4 } },
    { label: 'Medium', values: { topLeft: 8, topRight: 8, bottomRight: 8, bottomLeft: 8 } },
    { label: 'Large', values: { topLeft: 16, topRight: 16, bottomRight: 16, bottomLeft: 16 } },
    {
      label: 'Full',
      values: { topLeft: 9999, topRight: 9999, bottomRight: 9999, bottomLeft: 9999 },
    },
    { label: 'Top only', values: { topLeft: 12, topRight: 12, bottomRight: 0, bottomLeft: 0 } },
    { label: 'Bottom only', values: { topLeft: 0, topRight: 0, bottomRight: 12, bottomLeft: 12 } },
    { label: 'Left only', values: { topLeft: 12, topRight: 0, bottomRight: 0, bottomLeft: 12 } },
    { label: 'Right only', values: { topLeft: 0, topRight: 12, bottomRight: 12, bottomLeft: 0 } },
  ];

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Square className="h-6 w-6" aria-hidden="true" />}
        title="Border radius generator"
        description="Generate border-radius CSS with individual corner control, presets, and linked/unlinked modes."
      />
      <div className="border-border bg-card rounded-xl border p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Presets
          </p>
          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium">
            <input
              type="checkbox"
              checked={linked}
              onChange={(e) => setLinked(e.target.checked)}
              className="accent-primary h-4 w-4"
            />
            <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
            <Link2Off className="h-3.5 w-3.5" aria-hidden="true" />
            Link corners
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setOptions(preset.values)}
              className="border-border bg-background hover:bg-muted inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="relative">
          <div
            className="from-primary/20 to-primary/40 border-primary mx-auto h-48 w-64 rounded-lg border-4 bg-gradient-to-br"
            style={{ borderRadius: css }}
            aria-label="Border radius preview"
          />
          {[
            { key: 'topLeft', label: 'TL', top: -8, left: -8 },
            { key: 'topRight', label: 'TR', top: -8, right: -8 },
            { key: 'bottomRight', label: 'BR', bottom: -8, right: -8 },
            { key: 'bottomLeft', label: 'BL', bottom: -8, left: -8 },
          ].map(({ key, label, ...pos }) => (
            <div key={key} className="text-muted-foreground absolute text-xs" style={pos}>
              {label}
            </div>
          ))}
        </div>
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <p className="text-muted-foreground mb-4 text-xs font-semibold tracking-wider uppercase">
          Individual corners
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              ['topLeft', 'Top Left'],
              ['topRight', 'Top Right'],
              ['bottomRight', 'Bottom Right'],
              ['bottomLeft', 'Bottom Left'],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <label className="text-muted-foreground mb-1 block text-xs font-semibold tracking-wider uppercase">
                {label}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={9999}
                  value={options[key as keyof BorderRadiusOptions]}
                  onChange={(e) => update(key as keyof BorderRadiusOptions, Number(e.target.value))}
                  disabled={linked}
                  className="flex-1"
                />
                <input
                  type="number"
                  min={0}
                  max={9999}
                  value={options[key as keyof BorderRadiusOptions]}
                  onChange={(e) => update(key as keyof BorderRadiusOptions, Number(e.target.value))}
                  disabled={linked}
                  className="border-border bg-background text-foreground focus-visible:ring-primary w-24 rounded-lg border px-2 py-1.5 text-right font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
                />
                <span className="text-muted-foreground text-xs">px</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TransformPanel
        inputId="radius-output"
        inputValue=""
        onInputChange={() => {}}
        outputValue={css}
        outputLabel="CSS"
        fileName="border-radius.css"
        toolbar={
          <>
            <CopyButton value={css} iconOnly size="sm" />
            <DownloadButton
              content={css}
              fileName="border-radius.css"
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

BorderRadiusGenerator.displayName = 'BorderRadiusGenerator';

export { BorderRadiusGenerator };
