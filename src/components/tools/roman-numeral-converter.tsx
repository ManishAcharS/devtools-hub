'use client';

import React, { useMemo, useState } from 'react';
import { Landmark } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { fromRoman, toRoman } from '@/lib/tools/numbers';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

const ROMAN_CHARS_PATTERN = /^[IVXLCDMivxlcdm]+$/;

const RomanNumeralConverter: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');

  const result = useMemo(() => {
    const trimmed = input.trim();
    if (trimmed.length === 0) {
      return { value: '', error: null as string | null, direction: 'numeral → number' as string };
    }
    if (ROMAN_CHARS_PATTERN.test(trimmed) && !/^-?\d+$/.test(trimmed)) {
      const converted = fromRoman(trimmed);
      return {
        value: converted.value,
        error: converted.error,
        direction: 'Roman numeral → number',
      };
    }
    if (/^-?\d+$/.test(trimmed)) {
      const converted = toRoman(Number(trimmed));
      return {
        value: converted.value,
        error: converted.error,
        direction: 'Number → Roman numeral',
      };
    }
    return { value: '', error: 'Enter a whole number (1–3999) or a Roman numeral.', direction: '' };
  }, [input]);

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Landmark className="h-6 w-6" aria-hidden="true" />}
        title="Roman numeral converter"
        description="Convert between Arabic numerals and classic Roman numerals (I–MMMCMXCIX) in both directions, with automatic detection."
      />
      <TransformPanel
        inputId="roman-input"
        inputValue={input}
        onInputChange={setInput}
        inputLabel="Number or Roman numeral"
        inputPlaceholder="e.g. 2026 or MMXXVI"
        outputValue={result.value}
        outputLabel={result.direction}
        outputPlaceholder="Converted value will appear here…"
        fileName="converted.txt"
        error={result.error}
        stats={
          result.value.length > 0
            ? [
                { label: 'Direction', value: result.direction },
                { label: 'Length', value: result.value.length.toString() },
              ]
            : undefined
        }
      />
    </div>
  );
};

RomanNumeralConverter.displayName = 'RomanNumeralConverter';

export { RomanNumeralConverter };
