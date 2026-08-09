'use client';

import React, { useMemo, useState } from 'react';
import { Eye } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

const AltTextChecker: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');

  const analysis = useMemo(() => {
    const text = input.trim();
    const length = text.length;
    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
    const filler = ['image', 'photo', 'picture', 'screenshot', 'graphic', 'img', 'file', 'icon'];
    const lower = text.toLowerCase();
    const fillerHits = text ? filler.filter((word) => new RegExp(`\\b${word}\\b`).test(lower)) : [];
    const tooLong = length > 125;
    let score = 100;
    const tips: string[] = [];
    if (!text) {
      score = 0;
      tips.push(
        'Alt text is missing — decorative images can use empty alt="" but meaningful images need a description.'
      );
    } else {
      if (tooLong) {
        score -= 25;
        tips.push(
          `Alt text is ${length} characters — screen readers often truncate past ~125. Shorten it.`
        );
      } else {
        tips.push(`Length looks good at ${length} characters (under the ~125 guideline).`);
      }
      if (fillerHits.length > 0) {
        score -= 25;
        tips.push(
          `Avoid filler words like "${fillerHits.join('", "')}" — describe the image content instead.`
        );
      }
      if (words < 3) {
        score -= 10;
        tips.push('Aim for at least a few descriptive words rather than a single label.');
      }
      if (score === 100) {
        tips.push('Great — describe the image purpose, not just its content.');
      }
    }
    return { length, words, score: Math.max(0, score), fillerHits, tips, tooLong };
  }, [input]);

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Eye className="h-6 w-6" aria-hidden="true" />}
        title="Alt text checker"
        description="Evaluate image alt text against common accessibility guidelines — length, filler words, and usefulness."
      />
      <TransformPanel
        inputId="alt-text-input"
        inputValue={input}
        onInputChange={setInput}
        inputLabel="Alt text"
        inputPlaceholder="Paste an alt attribute value to analyze…"
        outputValue=""
        outputLabel="Analysis"
        outputPlaceholder="Analysis appears in the panel below…"
        fileName="alt-text.txt"
        extra={
          <div className="mt-4 space-y-3">
            {input.trim().length > 0 ? (
              <>
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs font-medium">
                    <span className="text-muted-foreground tracking-wider uppercase">
                      Quality score
                    </span>
                    <span className="text-foreground">
                      {analysis.score} / 100 {analysis.tooLong ? '(long)' : ''}
                    </span>
                  </div>
                  <div className="bg-muted h-2.5 overflow-hidden rounded-full">
                    <div
                      className={`h-full rounded-full ${
                        analysis.score >= 75
                          ? 'bg-green-500'
                          : analysis.score >= 40
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                      }`}
                      style={{ width: `${analysis.score}%` }}
                    />
                  </div>
                </div>
                <ul className="text-muted-foreground space-y-1.5 text-sm">
                  {analysis.tips.map((tip) => (
                    <li key={tip} className="flex gap-2">
                      <span aria-hidden="true" className="text-primary">
                        ›
                      </span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-muted-foreground text-sm italic">
                Paste alt text above to see its accessibility analysis.
              </p>
            )}
          </div>
        }
      />
    </div>
  );
};

AltTextChecker.displayName = 'AltTextChecker';

export { AltTextChecker };
