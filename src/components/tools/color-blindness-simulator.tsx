'use client';

import React, { useMemo, useState } from 'react';
import { Eye, EyeOff, Palette, Copy, Plus } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { CB_MATRICES, simulateColorBlindness, hexToRgb, rgbToHex } from '@/lib/tools/css';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';
import { cn } from '@/lib/utils';

const TYPES = [
  { id: 'protanopia', label: 'Protanopia (red-blind)', desc: 'Red cone deficiency' },
  { id: 'deuteranopia', label: 'Deuteranopia (green-blind)', desc: 'Green cone deficiency' },
  { id: 'tritanopia', label: 'Tritanopia (blue-blind)', desc: 'Blue cone deficiency' },
  { id: 'achromatopsia', label: 'Achromatopsia (monochrome)', desc: 'Total color blindness' },
] as const;

const ColorBlindnessSimulator: React.FC<ToolComponentProps> = () => {
  const [color, setColor] = useState('#3b82f6');
  const [palette, setPalette] = useState<string[]>([
    '#3b82f6',
    '#ef4444',
    '#22c55e',
    '#f59e0b',
    '#8b5cf6',
    '#ec4899',
    '#06b6d4',
    '#14b8a6',
  ]);

  const rgb = useMemo(() => hexToRgb(color), [color]);
  const normalRgb = rgb ? { r: rgb.r, g: rgb.g, b: rgb.b } : { r: 59, g: 130, b: 246 };

  const simulations = useMemo(() => {
    return TYPES.map((type) => {
      const matrix = CB_MATRICES[type.id];
      const sim = simulateColorBlindness(normalRgb.r, normalRgb.g, normalRgb.b, matrix);
      return { ...type, hex: rgbToHex(sim.r, sim.g, sim.b), rgb: sim };
    });
  }, [normalRgb]);

  const addToPalette = (hex: string) => {
    setPalette((prev) => (prev.includes(hex) ? prev : [...prev, hex].slice(-20)));
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Eye className="h-6 w-6" aria-hidden="true" />}
        title="Color blindness simulator"
        description="See how your colors appear to people with different types of color vision deficiency."
      />
      <div className="border-border bg-card rounded-xl border p-5">
        <div className="flex items-center gap-4">
          <div>
            <label className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase">
              Base color
            </label>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-12 w-16 cursor-pointer rounded-lg border"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => {
                  const v = e.target.value;
                  if (/^#[0-9a-fA-F]{6}$/.test(v)) setColor(v);
                }}
                className="border-border bg-background text-foreground focus-visible:ring-primary w-28 rounded-lg border px-3 py-2 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
              />
            </div>
          </div>
          <div className="ml-8 flex-1">
            <label className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase">
              Palette
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {palette.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="h-10 w-10 rounded-lg border transition-transform hover:scale-110"
                  style={{ backgroundColor: c }}
                  aria-label={`Use color ${c}`}
                />
              ))}
              <button
                type="button"
                onClick={() => addToPalette(color)}
                className="text-muted-foreground hover:border-primary hover:text-primary flex h-10 w-10 items-center justify-center rounded-lg border border-dashed transition-colors"
                aria-label="Add current color to palette"
              >
                <Plus className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div className="border-border bg-card rounded-xl border p-5 text-center">
          <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
            Original
          </p>
          <div
            className="border-border mx-auto h-24 w-24 rounded-lg border"
            style={{ backgroundColor: color }}
            aria-label="Original color"
          />
          <p className="mt-2 font-mono text-sm">{color}</p>
        </div>
        {simulations.map((sim) => (
          <div key={sim.id} className="border-border bg-card rounded-xl border p-5 text-center">
            <p className="text-muted-foreground mb-1 text-xs font-semibold tracking-wider uppercase">
              {sim.label}
            </p>
            <p className="text-muted-foreground mb-2 text-[10px]">{sim.desc}</p>
            <div
              className="border-border mx-auto h-24 w-24 rounded-lg border"
              style={{ backgroundColor: sim.hex }}
              aria-label={sim.label}
            />
            <p className="mt-2 font-mono text-sm">{sim.hex}</p>
            <CopyButton value={sim.hex} label="Copy" iconOnly size="sm" className="mx-auto mt-2" />
          </div>
        ))}
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <p className="text-muted-foreground mb-4 text-xs font-semibold tracking-wider uppercase">
          Comparison grid
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-border border-b">
                <th className="text-muted-foreground p-2 text-left font-medium">Color</th>
                {simulations.map((sim) => (
                  <th key={sim.id} className="text-muted-foreground p-2 text-center font-medium">
                    {sim.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[color, ...palette].map((c, rowIndex) => {
                const rowRgb = hexToRgb(c);
                const rowSims = rowRgb
                  ? TYPES.map((type) => {
                      const sim = simulateColorBlindness(
                        rowRgb.r,
                        rowRgb.g,
                        rowRgb.b,
                        CB_MATRICES[type.id]
                      );
                      return rgbToHex(sim.r, sim.g, sim.b);
                    })
                  : TYPES.map(() => '#000000');
                return (
                  <tr key={c} className="border-border/50 border-b">
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded border" style={{ backgroundColor: c }} />
                        <span className="font-mono">{c}</span>
                      </div>
                    </td>
                    {rowSims.map((simHex, simIndex) => (
                      <td key={simIndex} className="p-2 text-center">
                        <div
                          className="mx-auto h-6 w-6 rounded border"
                          style={{ backgroundColor: simHex }}
                        />
                        <CopyButton value={simHex} iconOnly size="sm" className="mx-auto mt-1" />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

ColorBlindnessSimulator.displayName = 'ColorBlindnessSimulator';

export { ColorBlindnessSimulator };
