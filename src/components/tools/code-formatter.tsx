'use client';

import React, { useMemo, useState } from 'react';
import { Braces, Minimize2, Maximize2 } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { formatCode, type CodeLanguage } from '@/lib/tools/code-formatter';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';
import { cn } from '@/lib/utils';

const LANGUAGES: { value: CodeLanguage; label: string; icon: React.ReactNode }[] = [
  {
    value: 'javascript',
    label: 'JavaScript',
    icon: <Braces className="h-4 w-4" aria-hidden="true" />,
  },
  { value: 'css', label: 'CSS', icon: <Braces className="h-4 w-4" aria-hidden="true" /> },
  { value: 'html', label: 'HTML', icon: <Braces className="h-4 w-4" aria-hidden="true" /> },
];

const CodeFormatter: React.FC<ToolComponentProps> = () => {
  const [language, setLanguage] = useState<CodeLanguage>('javascript');
  const [input, setInput] = useState('');
  const [minify, setMinify] = useState(false);
  const [indentSize, setIndentSize] = useState(2);
  const [indentChar, setIndentChar] = useState<' ' | '\t'>(' ');

  const result = useMemo(
    () => formatCode(input, { language, minify, indentSize, indentChar }),
    [input, language, minify, indentSize, indentChar]
  );

  const currentLang = LANGUAGES.find((l) => l.value === language)!;

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={currentLang.icon}
        title={`Code formatter — ${currentLang.label}`}
        description={`Format or minify ${currentLang.label} with js-beautify. Supports indentation, brace style, and more.`}
      />
      <TransformPanel
        inputId="code-format-input"
        inputValue={input}
        onInputChange={setInput}
        inputLabel={`${currentLang.label} input`}
        inputPlaceholder={`Paste ${currentLang.label} code…`}
        outputValue={result.value}
        outputLabel={minify ? 'Minified output' : 'Formatted output'}
        fileName={`formatted.${language === 'javascript' ? 'js' : language}`}
        error={result.error}
        stats={
          !result.error && input.trim()
            ? [
                { label: 'Input', value: input.trim().length.toLocaleString() },
                { label: 'Output', value: result.value.length.toLocaleString() },
                {
                  label: 'Change',
                  value: `${(((result.value.length - input.trim().length) / input.trim().length) * 100).toFixed(1)}%`,
                },
              ]
            : undefined
        }
        toolbar={
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.value}
                  type="button"
                  onClick={() => setLanguage(lang.value)}
                  aria-pressed={language === lang.value}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                    language === lang.value
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background text-muted-foreground hover:text-foreground'
                  )}
                >
                  {lang.icon} {lang.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <label className="text-muted-foreground flex cursor-pointer items-center gap-2 text-xs font-medium">
                <input
                  type="checkbox"
                  checked={minify}
                  onChange={(event) => setMinify(event.target.checked)}
                  className="accent-primary h-4 w-4"
                />
                {minify ? (
                  <Minimize2 className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Maximize2 className="h-4 w-4" aria-hidden="true" />
                )}
                {minify ? 'Minify' : 'Beautify'}
              </label>
            </div>
            {!minify && (
              <div className="flex items-center gap-2">
                <label htmlFor="indent-size" className="text-muted-foreground text-xs">
                  Indent
                </label>
                <select
                  id="indent-size"
                  value={indentSize}
                  onChange={(event) => setIndentSize(Number(event.target.value))}
                  className="border-border bg-background text-foreground focus-visible:ring-primary w-24 rounded-lg border px-2 py-1.5 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
                >
                  <option value={2}>2</option>
                  <option value={4}>4</option>
                  <option value={8}>8</option>
                </select>
                <label className="text-muted-foreground flex cursor-pointer items-center gap-2 text-xs font-medium">
                  <input
                    type="checkbox"
                    checked={indentChar === '\t'}
                    onChange={(event) => setIndentChar(event.target.checked ? '\t' : ' ')}
                    className="accent-primary h-4 w-4"
                  />
                  Tabs
                </label>
              </div>
            )}
          </div>
        }
      />
    </div>
  );
};

CodeFormatter.displayName = 'CodeFormatter';

export { CodeFormatter };
