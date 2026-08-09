'use client';

import React, { useMemo, useState } from 'react';
import { FileCog } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { cn } from '@/lib/utils';
import { iniToJson, jsonToIni, jsonToToml, tomlToJson } from '@/lib/tools/config-formats';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

type Format = 'toml' | 'ini';
type Direction = 'to-json' | 'from-json';

const FORMATS: { value: Format; label: string }[] = [
  { value: 'toml', label: 'TOML' },
  { value: 'ini', label: 'INI' },
];

const JsonFileConverter: React.FC<ToolComponentProps> = () => {
  const [format, setFormat] = useState<Format>('toml');
  const [direction, setDirection] = useState<Direction>('to-json');
  const [input, setInput] = useState('');

  const result = useMemo(() => {
    if (!input.trim()) return { value: '', error: null };
    try {
      if (format === 'toml') {
        return {
          value: direction === 'to-json' ? tomlToJson(input) : jsonToToml(input),
          error: null,
        };
      }
      return { value: direction === 'to-json' ? iniToJson(input) : jsonToIni(input), error: null };
    } catch (error) {
      return { value: '', error: error instanceof Error ? error.message : 'Parse error.' };
    }
  }, [format, direction, input]);

  const fromLabel = format === 'toml' ? 'TOML' : 'INI';
  const toLabel = 'JSON';

  const toolbar = (
    <div className="flex flex-wrap items-center gap-3">
      <div className="bg-muted inline-flex rounded-lg p-1">
        {FORMATS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setFormat(option.value)}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              format === option.value
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
            aria-pressed={format === option.value}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="bg-muted inline-flex rounded-lg p-1">
        {(
          [
            { value: 'to-json', label: 'to JSON' },
            { value: 'from-json', label: 'from JSON' },
          ] as const
        ).map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setDirection(option.value)}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              direction === option.value
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
            aria-pressed={direction === option.value}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<FileCog className="h-6 w-6" aria-hidden="true" />}
        title="Config file converter"
        description="Convert between TOML, INI, and JSON config file formats — sections, nested tables, arrays, numbers, and booleans are supported."
      />
      <TransformPanel
        inputId="config-file-input"
        inputValue={input}
        onInputChange={setInput}
        inputLabel={direction === 'to-json' ? fromLabel : 'JSON'}
        inputPlaceholder={
          direction === 'to-json'
            ? format === 'toml'
              ? 'Paste TOML here…\nExample: [server]\nhost = "localhost"\nport = 8080'
              : 'Paste INI here…\nExample: [server]\nhost = localhost\nport = 8080'
            : 'Paste JSON here…\nExample: {"server": {"host": "localhost", "port": 8080}}'
        }
        toolbar={toolbar}
        outputValue={result.value}
        outputLabel={direction === 'from-json' ? fromLabel : toLabel}
        outputPlaceholder="Converted output will appear here…"
        fileName={
          direction === 'from-json' ? `config.${format === 'toml' ? 'toml' : 'ini'}` : 'config.json'
        }
        error={result.error}
      />
    </div>
  );
};

JsonFileConverter.displayName = 'JsonFileConverter';

export { JsonFileConverter };
