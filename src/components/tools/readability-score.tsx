'use client';

import React, { useMemo, useState } from 'react';
import { BookOpen } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { analyzeReadability } from '@/lib/tools/readability';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

interface ReadabilityBand {
  min: number;
  label: string;
}

const READABILITY_BANDS: ReadabilityBand[] = [
  { min: 90, label: 'Very easy' },
  { min: 80, label: 'Easy' },
  { min: 70, label: 'Fairly easy' },
  { min: 60, label: 'Standard' },
  { min: 50, label: 'Fairly difficult' },
  { min: 30, label: 'Difficult' },
  { min: 0, label: 'Very difficult' },
];

function bandFor(score: number): ReadabilityBand {
  return (
    READABILITY_BANDS.find((band) => score >= band.min) ??
    READABILITY_BANDS[READABILITY_BANDS.length - 1]
  );
}

const ReadabilityScore: React.FC<ToolComponentProps> = () => {
  const [text, setText] = useState('');

  const metrics = useMemo(() => analyzeReadability(text), [text]);
  const hasText = text.trim().length > 0;

  const output = useMemo(() => {
    if (!hasText) return '';
    return [
      `Words: ${metrics.wordCount}`,
      `Sentences: ${metrics.sentenceCount}`,
      `Syllables: ${metrics.syllableCount}`,
      `Average words per sentence: ${metrics.avgWordsPerSentence.toFixed(1)}`,
      `Average syllables per word: ${metrics.avgSyllablesPerWord.toFixed(1)}`,
      '',
      `Flesch Reading Ease: ${metrics.fleschReadingEase.toFixed(1)}`,
      `Flesch-Kincaid Grade Level: ${Math.max(0, metrics.fleschKincaidGrade).toFixed(1)}`,
    ].join('\n');
  }, [text, metrics, hasText]);

  const band = bandFor(metrics.fleschReadingEase);

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<BookOpen className="h-6 w-6" aria-hidden="true" />}
        title="Readability score"
        description="Measure how easy your text is to read with the Flesch Reading Ease and Flesch-Kincaid Grade Level formulas, plus word, sentence, and syllable counts."
      />

      <TransformPanel
        inputId="readability-input"
        inputValue={text}
        onInputChange={setText}
        inputLabel="Text"
        inputPlaceholder="Paste text to score…"
        outputValue={output}
        outputLabel="Readability metrics"
        outputPlaceholder="Metrics will appear here…"
        fileName="readability.txt"
        stats={
          hasText
            ? [
                { label: 'Words', value: String(metrics.wordCount) },
                { label: 'Sentences', value: String(metrics.sentenceCount) },
                { label: 'Syllables', value: String(metrics.syllableCount) },
                { label: 'Avg words/sentence', value: metrics.avgWordsPerSentence.toFixed(1) },
              ]
            : undefined
        }
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Flesch Reading Ease
          </p>
          {hasText && (
            <p className="text-sm">
              {metrics.fleschReadingEase.toFixed(1)}{' '}
              <span className="text-muted-foreground">/ 100</span>
            </p>
          )}
        </div>
        <div className="mt-4">
          {hasText ? (
            <div className="space-y-3">
              <div
                className="relative h-3 rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #ef4444 0%, #f59e0b 45%, #22c55e 100%)',
                }}
                role="img"
                aria-label={`Score ${metrics.fleschReadingEase.toFixed(1)} out of 100`}
              >
                <div
                  className="bg-foreground absolute -top-1.5 h-6 w-1.5 rounded-full shadow"
                  style={{ left: `${Math.min(100, Math.max(0, metrics.fleschReadingEase))}%` }}
                />
              </div>
              <p className="text-sm">
                <span className="font-semibold">{band.label}</span>
                <span className="text-muted-foreground">
                  {' '}
                  ({Math.max(0, Math.min(100, metrics.fleschReadingEase)).toFixed(0)}-band score)
                </span>
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm italic">
              Paste some text above to see the reading ease gauge.
            </p>
          )}
        </div>
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          Score bands
        </p>
        <div className="mt-3 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <p>
            <span className="font-medium">90–100</span>{' '}
            <span className="text-muted-foreground">Very easy</span>
          </p>
          <p>
            <span className="font-medium">80–89</span>{' '}
            <span className="text-muted-foreground">Easy</span>
          </p>
          <p>
            <span className="font-medium">70–79</span>{' '}
            <span className="text-muted-foreground">Fairly easy</span>
          </p>
          <p>
            <span className="font-medium">60–69</span>{' '}
            <span className="text-muted-foreground">Standard</span>
          </p>
          <p>
            <span className="font-medium">50–59</span>{' '}
            <span className="text-muted-foreground">Fairly difficult</span>
          </p>
          <p>
            <span className="font-medium">30–49</span>{' '}
            <span className="text-muted-foreground">Difficult</span>
          </p>
          <p>
            <span className="font-medium">0–29</span>{' '}
            <span className="text-muted-foreground">Very difficult</span>
          </p>
        </div>
      </div>
    </div>
  );
};

ReadabilityScore.displayName = 'ReadabilityScore';

export { ReadabilityScore };
