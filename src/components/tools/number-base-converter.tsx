'use client';

import React, { useMemo, useState } from 'react';
import { Binary } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { convertBase, validateBaseInput } from '@/lib/tools/numbers';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

const BASE_OPTIONS = [2, 8, 10, 16, 32, 36];

const NumberBaseConverter: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');
  const [fromBase, setFromBase] = useState(10);
  const [toBase, setToBase] = useState(16);

  const result = useMemo(() => convertBase(input, fromBase, toBase), [input, fromBase, toBase]);

  const decimalValue = useMemo(() => {
    const validation = validateBaseInput(input, fromBase);
    if (validation.error || input.trim().length === 0) return null;
    const parts = input.trim().split('.');
    const integer = parts[0] ?? '';
    const fraction = parts[1];
    let value = BigInt(0);
    for (const character of integer.toUpperCase()) {
      value = value * BigInt(fromBase) + BigInt(parseInt(character, fromBase));
    }
    if (fraction && fraction.length > 0) {
      let numerator = BigInt(0);
      for (const character of fraction.toUpperCase()) {
        numerator = numerator * BigInt(fromBase) + BigInt(parseInt(character, fromBase));
      }
      const denominator = BigInt(fromBase) ** BigInt(fraction.length);
      const scaled = (numerator * BigInt(1000000)) / denominator;
      return `${value.toString()}.${scaled.toString().padStart(6, '0')}`;
    }
    return value.toString();
  }, [input, fromBase]);

  const toolbar = (
    <>
      <label className="text-muted-foreground flex items-center gap-2 text-sm">
        <span>From</span>
        <select
          value={fromBase}
          onChange={(event) => setFromBase(Number(event.target.value))}
          className="border-border bg-background text-foreground rounded-md border px-2 py-1 text-sm"
        >
          {Array.from({ length: 35 }, (_, index) => index + 2).map((base) => (
            <option key={base} value={base}>
              base {base}
            </option>
          ))}
        </select>
      </label>
      <label className="text-muted-foreground flex items-center gap-2 text-sm">
        <span>To</span>
        <select
          value={toBase}
          onChange={(event) => setToBase(Number(event.target.value))}
          className="border-border bg-background text-foreground rounded-md border px-2 py-1 text-sm"
        >
          {Array.from({ length: 35 }, (_, index) => index + 2).map((base) => (
            <option key={base} value={base}>
              base {base}
            </option>
          ))}
        </select>
      </label>
      <div className="bg-muted inline-flex rounded-lg p-1">
        {BASE_OPTIONS.map((base) => (
          <button
            key={base}
            type="button"
            onClick={() => setToBase(base)}
            className="rounded-md px-2 py-1.5 font-mono text-xs font-medium transition-colors"
            aria-pressed={toBase === base}
          >
            {base}
          </button>
        ))}
      </div>
    </>
  );

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Binary className="h-6 w-6" aria-hidden="true" />}
        title="Number base converter"
        description="Convert numbers between binary, octal, decimal, hex, and any base from 2 to 36 — including fractional parts."
      />
      <TransformPanel
        inputId="base-input"
        inputValue={input}
        onInputChange={setInput}
        inputLabel={`Number (base ${fromBase})`}
        inputPlaceholder="e.g. ff, 1010.1, or 255"
        toolbar={toolbar}
        outputValue={result.value}
        outputLabel={`Converted (base ${toBase})`}
        outputPlaceholder="Converted value will appear here…"
        fileName="converted.txt"
        error={result.error}
        stats={
          decimalValue !== null
            ? [
                { label: 'Decimal value', value: decimalValue },
                { label: 'Digits', value: result.value.length.toString() },
              ]
            : undefined
        }
      />
    </div>
  );
};

NumberBaseConverter.displayName = 'NumberBaseConverter';

export { NumberBaseConverter };
