'use client';

import React, { useMemo, useState } from 'react';
import { Braces } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { cn } from '@/lib/utils';
import { jsonToGo, jsonToJava, jsonToPython } from '@/lib/tools/codegen';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

type Language = 'python' | 'java' | 'go';

const LANGUAGES: { value: Language; label: string; file: string }[] = [
  { value: 'python', label: 'Python', file: 'models.py' },
  { value: 'java', label: 'Pojo.java', file: 'Pojo.java' },
  { value: 'go', label: 'Go', file: 'models.go' },
];

const JsonToStructs: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState<Language>('python');

  const result = useMemo(() => {
    if (!input.trim()) return { value: '', error: null };
    try {
      const value =
        language === 'python'
          ? jsonToPython(input)
          : language === 'java'
            ? jsonToJava(input)
            : jsonToGo(input);
      return { value, error: null };
    } catch (error) {
      return { value: '', error: error instanceof Error ? error.message : 'Invalid JSON.' };
    }
  }, [input, language]);

  const toolbar = (
    <div className="bg-muted inline-flex rounded-lg p-1">
      {LANGUAGES.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setLanguage(option.value)}
          className={cn(
            'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            language === option.value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
          aria-pressed={language === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );

  const file = LANGUAGES.find((option) => option.value === language)?.file ?? 'models.txt';

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Braces className="h-6 w-6" aria-hidden="true" />}
        title="JSON to structs"
        description="Generate Python dataclasses, Java POJOs, or Go structs from a sample JSON document."
      />
      <TransformPanel
        inputId="json-to-structs-input"
        inputValue={input}
        onInputChange={setInput}
        inputLabel="Sample JSON"
        inputPlaceholder={
          'Paste a JSON document to convert…\nExample: {"name": "Ada", "skills": ["TS"]}'
        }
        toolbar={toolbar}
        outputValue={result.value}
        outputLabel={`${LANGUAGES.find((option) => option.value === language)?.label ?? 'Output'} structs`}
        outputPlaceholder="Generated structs will appear here…"
        fileName={file}
        error={result.error}
      />
    </div>
  );
};

JsonToStructs.displayName = 'JsonToStructs';

export { JsonToStructs };
