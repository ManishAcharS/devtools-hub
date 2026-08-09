'use client';

import React, { useMemo, useState } from 'react';
import { SpellCheck } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { cn } from '@/lib/utils';
import { amountInWords, numberToWords } from '@/lib/tools/words';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

const NumberToWords: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('1234567.89');
  const [moneyMode, setMoneyMode] = useState(false);

  const result = useMemo(
    () => (moneyMode ? amountInWords(input) : numberToWords(input)),
    [input, moneyMode]
  );

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<SpellCheck className="h-6 w-6" aria-hidden="true" />}
        title="Number to words converter"
        description="Spell any number in English — from single digits up to the vigintillions (10^63) — with optional dollars-and-cents wording."
      />
      <TransformPanel
        inputId="words-input"
        inputValue={input}
        onInputChange={setInput}
        inputLabel="Number"
        inputPlaceholder="1234567.89"
        inputRows={2}
        toolbar={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setMoneyMode(false)}
              aria-pressed={!moneyMode}
              className={cn(
                'rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors',
                !moneyMode
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-muted-foreground hover:text-foreground'
              )}
            >
              Number
            </button>
            <button
              type="button"
              onClick={() => setMoneyMode(true)}
              aria-pressed={moneyMode}
              className={cn(
                'rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors',
                moneyMode
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-muted-foreground hover:text-foreground'
              )}
            >
              Dollars &amp; cents
            </button>
          </div>
        }
        outputValue={result.error ? '' : result.words}
        outputLabel={moneyMode ? 'Amount in words' : 'Words'}
        outputPlaceholder="The number in words will appear here…"
        fileName="number-in-words.txt"
        error={result.error}
      />
    </div>
  );
};

NumberToWords.displayName = 'NumberToWords';

export { NumberToWords };
