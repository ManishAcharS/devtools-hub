'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Hash } from 'lucide-react';
import { CopyButton } from '@/components/shared/copy-button';
import { formatNumber } from '@/lib/tools/validate';

interface HashPanelProps {
  algorithmName: string;
  compute: (text: string) => Promise<string>;
  placeholder?: string;
  extraControls?: React.ReactNode;
}

const HashPanel: React.FC<HashPanelProps> = ({
  algorithmName,
  compute,
  placeholder = 'Type or paste the text to hash…',
  extraControls,
}) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isHashing, setIsHashing] = useState(false);

  const byteLength = useMemo(() => new TextEncoder().encode(input).length, [input]);
  const inputLength = input.length;

  useEffect(() => {
    if (input.length === 0) {
      return;
    }
    let cancelled = false;
    void compute(input)
      .then((hex) => {
        if (!cancelled) setOutput(hex);
      })
      .catch((cause: unknown) => {
        if (!cancelled) {
          setError(cause instanceof Error ? cause.message : 'Could not compute the hash.');
          setOutput('');
        }
      })
      .finally(() => {
        if (!cancelled) setIsHashing(false);
      });
    return () => {
      cancelled = true;
    };
  }, [input, compute]);

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-foreground mb-2 block text-sm font-medium">Input</span>
        <textarea
          value={input}
          onChange={(event) => {
            const value = event.target.value;
            setInput(value);
            setError(null);
            if (value.length === 0) {
              setOutput('');
              setIsHashing(false);
            } else {
              setIsHashing(true);
            }
          }}
          placeholder={placeholder}
          rows={5}
          spellCheck={false}
          className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring w-full resize-y rounded-xl border px-4 py-3 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
          aria-describedby="hash-input-help"
        />
        <span id="hash-input-help" className="text-muted-foreground mt-1 block text-xs">
          {input.length === 0
            ? 'Start typing to see the hash update live.'
            : `${formatNumber(inputLength)} characters · ${formatNumber(byteLength)} bytes`}
        </span>
      </label>

      {extraControls}

      <div>
        <div className="text-foreground mb-2 flex items-center justify-between text-sm font-medium">
          <span className="flex items-center gap-2">
            <Hash className="h-4 w-4" aria-hidden="true" />
            {algorithmName}
          </span>
          {isHashing && <span className="text-muted-foreground text-xs">Hashing…</span>}
        </div>
        {output.length > 0 && (
          <div className="border-border bg-muted/50 rounded-xl border p-4">
            <code className="text-foreground block font-mono text-sm break-all">{output}</code>
            <div className="mt-3 flex items-center gap-2">
              <CopyButton value={output} label="Copy hash" size="sm" variant="outline" />
            </div>
          </div>
        )}
        {error && (
          <p role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

HashPanel.displayName = 'HashPanel';

export { HashPanel };
