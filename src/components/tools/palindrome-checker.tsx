'use client';

import React, { useMemo, useState } from 'react';
import { CheckCircle2, XCircle, Repeat } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { SectionHeading } from '@/components/shared/section-heading';

const PalindromeChecker: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');
  const [ignoreCase, setIgnoreCase] = useState(true);
  const [ignorePunctuation, setIgnorePunctuation] = useState(true);
  const [ignoreSpaces, setIgnoreSpaces] = useState(true);

  const analysis = useMemo(() => {
    let normalized = input;
    if (ignoreSpaces) normalized = normalized.replace(/\s+/g, '');
    if (ignorePunctuation) normalized = normalized.replace(/[^\p{L}\p{N}]/gu, '');
    if (ignoreCase) normalized = normalized.toLowerCase();

    const chars = [...normalized];
    const reversed = [...chars].reverse();
    const isPalindrome = chars.length > 0 && chars.every((char, index) => char === reversed[index]);
    return {
      isPalindrome,
      normalized,
      length: chars.length,
      mismatches: [...chars]
        .map((char, index) => (char === reversed[index] ? null : index))
        .filter((index): index is number => index !== null)
        .slice(0, 5),
    };
  }, [input, ignoreCase, ignorePunctuation, ignoreSpaces]);

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Repeat className="h-6 w-6" aria-hidden="true" />}
        title="Palindrome checker"
        description="Check whether a word, phrase, or number reads the same forward and backward."
      />
      <div className="border-border bg-card rounded-xl border p-5">
        <label
          htmlFor="palindrome-input"
          className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
        >
          Text
        </label>
        <textarea
          id="palindrome-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Try: A man, a plan, a canal: Panama"
          spellCheck={false}
          rows={4}
          className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full resize-y rounded-lg border px-4 py-3 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
        />
        <div className="mt-4 flex flex-wrap gap-6">
          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium">
            <input
              type="checkbox"
              checked={ignoreCase}
              onChange={(event) => setIgnoreCase(event.target.checked)}
              className="accent-primary h-4 w-4"
            />
            Ignore case
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium">
            <input
              type="checkbox"
              checked={ignorePunctuation}
              onChange={(event) => setIgnorePunctuation(event.target.checked)}
              className="accent-primary h-4 w-4"
            />
            Ignore punctuation
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium">
            <input
              type="checkbox"
              checked={ignoreSpaces}
              onChange={(event) => setIgnoreSpaces(event.target.checked)}
              className="accent-primary h-4 w-4"
            />
            Ignore spaces
          </label>
        </div>
      </div>

      {input.trim().length > 0 && (
        <div
          className={`rounded-xl border p-5 ${
            analysis.isPalindrome
              ? 'border-green-500/40 bg-green-500/5'
              : 'border-red-500/40 bg-red-500/5'
          }`}
        >
          <div className="flex items-center gap-3">
            {analysis.isPalindrome ? (
              <CheckCircle2
                className="h-6 w-6 text-green-600 dark:text-green-400"
                aria-hidden="true"
              />
            ) : (
              <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
            )}
            <p className="text-lg font-semibold">
              {analysis.isPalindrome
                ? 'Yes — this is a palindrome'
                : 'No — this is not a palindrome'}
            </p>
          </div>
          <p className="text-muted-foreground mt-2 text-sm">
            {analysis.length > 0 ? (
              <>
                Normalized form:{' '}
                <span className="text-foreground font-mono">{analysis.normalized}</span> (
                {analysis.length} characters)
              </>
            ) : (
              'Enter some text to analyze.'
            )}
          </p>
          {!analysis.isPalindrome && analysis.mismatches.length > 0 && (
            <p className="text-muted-foreground mt-1 text-sm">
              First mismatch at position{' '}
              <span className="text-foreground font-mono">{analysis.mismatches[0]}</span>.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

PalindromeChecker.displayName = 'PalindromeChecker';

export { PalindromeChecker };
