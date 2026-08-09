'use client';

import React, { useMemo, useState } from 'react';
import { FileCode2, Plus, Trash2, TriangleAlert, ShieldCheck } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { cn } from '@/lib/utils';
import { buildEnvFile, validateEnvFile, type EnvEntry } from '@/lib/tools/env-file';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';
import { DownloadButton } from '@/components/shared/download-button';

interface EnvTemplate {
  id: string;
  label: string;
  entries: EnvEntry[];
}

const ENV_TEMPLATES: EnvTemplate[] = [
  {
    id: 'nextjs',
    label: 'Next.js',
    entries: [
      { key: 'NEXT_PUBLIC_API_URL', value: 'http://localhost:3000/api' },
      { key: 'NEXT_PUBLIC_APP_NAME', value: 'My App' },
      { key: 'DATABASE_URL', value: 'postgres://user:pass@localhost:5432/appdb' },
      { key: 'AUTH_SECRET', value: 'change-me' },
      { key: 'AUTH_URL', value: 'http://localhost:3000' },
    ],
  },
  {
    id: 'nodejs',
    label: 'Node.js',
    entries: [
      { key: 'NODE_ENV', value: 'development' },
      { key: 'PORT', value: '3000' },
      { key: 'DATABASE_URL', value: 'postgres://user:pass@localhost:5432/appdb' },
      { key: 'JWT_SECRET', value: 'change-me' },
      { key: 'LOG_LEVEL', value: 'debug' },
    ],
  },
  {
    id: 'python',
    label: 'Python / Django',
    entries: [
      { key: 'DJANGO_SECRET_KEY', value: 'change-me' },
      { key: 'DJANGO_DEBUG', value: 'True' },
      { key: 'DJANGO_ALLOWED_HOSTS', value: 'localhost 127.0.0.1' },
      { key: 'DATABASE_URL', value: 'postgres://user:pass@localhost:5432/appdb' },
      { key: 'DJANGO_SUPERUSER_EMAIL', value: 'admin@example.com' },
    ],
  },
  {
    id: 'go',
    label: 'Go',
    entries: [
      { key: 'APP_ENV', value: 'development' },
      { key: 'APP_PORT', value: '8080' },
      { key: 'DB_HOST', value: 'localhost' },
      { key: 'DB_PORT', value: '5432' },
      { key: 'DB_NAME', value: 'appdb' },
      { key: 'DB_USER', value: 'app' },
      { key: 'DB_PASSWORD', value: 'change-me' },
    ],
  },
  {
    id: 'database',
    label: 'Database',
    entries: [
      { key: 'DB_HOST', value: 'localhost' },
      { key: 'DB_PORT', value: '5432' },
      { key: 'DB_NAME', value: 'appdb' },
      { key: 'DB_USER', value: 'app' },
      { key: 'DB_PASSWORD', value: 'change-me' },
      { key: 'DB_SSL_MODE', value: 'require' },
    ],
  },
];

const inputClasses =
  'border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary w-full rounded-lg border px-3 py-2 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none';

const EnvFileGenerator: React.FC<ToolComponentProps> = () => {
  const [mode, setMode] = useState<'generate' | 'validate'>('generate');
  const [templateId, setTemplateId] = useState('nextjs');
  const [entries, setEntries] = useState<EnvEntry[]>(() => [...(ENV_TEMPLATES[0]?.entries ?? [])]);
  const [content, setContent] = useState('');

  const output = useMemo(() => buildEnvFile(entries), [entries]);

  const validation = useMemo(
    () => (content.trim().length === 0 ? null : validateEnvFile(content)),
    [content]
  );

  const applyTemplate = (id: string) => {
    setTemplateId(id);
    const template = ENV_TEMPLATES.find((option) => option.id === id);
    setEntries(template ? template.entries.map((entry) => ({ ...entry })) : []);
  };

  const updateEntry = (index: number, field: keyof EnvEntry, value: string) => {
    setEntries((prev) =>
      prev.map((entry, i) => (i === index ? { ...entry, [field]: value } : entry))
    );
  };

  const addEntry = () => {
    setEntries((prev) => [...prev, { key: '', value: '' }]);
  };

  const removeEntry = (index: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<FileCode2 className="h-6 w-6" aria-hidden="true" />}
        title=".env file generator / validator"
        description="Generate .env files from templates for Next.js, Node.js, Python, Go, and databases — or paste an existing file to check it for issues."
      />
      <div className="flex flex-wrap items-center gap-2">
        {(['generate', 'validate'] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setMode(option)}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
              mode === option
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border hover:bg-muted'
            )}
            aria-pressed={mode === option}
          >
            {option === 'generate' ? 'Generate' : 'Validate'}
          </button>
        ))}
      </div>

      {mode === 'generate' ? (
        <>
          <div className="border-border bg-card rounded-xl border p-5">
            <label
              htmlFor="env-template"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Template
            </label>
            <select
              id="env-template"
              value={templateId}
              onChange={(event) => applyTemplate(event.target.value)}
              className="border-border bg-background text-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
            >
              {ENV_TEMPLATES.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.label}
                </option>
              ))}
            </select>
          </div>

          <div className="border-border bg-card rounded-xl border p-5">
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Variables
            </p>
            <div className="mt-3 space-y-2">
              {entries.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={entry.key}
                    onChange={(event) => updateEntry(index, 'key', event.target.value)}
                    placeholder="KEY_NAME"
                    spellCheck={false}
                    className={cn(inputClasses, 'sm:w-72')}
                  />
                  <span className="text-muted-foreground shrink-0 font-mono text-sm">=</span>
                  <input
                    type="text"
                    value={entry.value}
                    onChange={(event) => updateEntry(index, 'value', event.target.value)}
                    placeholder="value"
                    spellCheck={false}
                    className={inputClasses}
                  />
                  <button
                    type="button"
                    onClick={() => removeEntry(index)}
                    disabled={entries.length === 1}
                    aria-label="Remove variable"
                    className="text-muted-foreground shrink-0 rounded-md p-2 transition-colors hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addEntry}
              className="border-border hover:bg-muted mt-4 inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add variable
            </button>
          </div>

          <div className="border-border bg-card rounded-xl border p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label
                htmlFor="env-output"
                className="text-muted-foreground text-xs font-semibold tracking-wider uppercase"
              >
                Generated .env
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <CopyButton value={output} iconOnly size="sm" />
                <DownloadButton
                  content={output}
                  fileName=".env"
                  contentType="text/plain;charset=utf-8"
                  label="Download"
                  size="sm"
                />
              </div>
            </div>
            <pre
              id="env-output"
              className="bg-muted text-foreground mt-2 max-h-80 overflow-auto rounded-lg px-4 py-3 font-mono text-sm whitespace-pre-wrap"
            >
              {output}
            </pre>
            <p className="text-muted-foreground mt-3 text-xs">
              {entries.filter((entry) => entry.key.trim().length > 0).length} variables ·{' '}
              {output.length.toLocaleString()} characters
            </p>
          </div>
        </>
      ) : (
        <div className="border-border bg-card rounded-xl border p-5">
          <label
            htmlFor="env-validate"
            className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
          >
            Paste a .env file
          </label>
          <textarea
            id="env-validate"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder={'NODE_ENV=production\nAPI_KEY=abc 123\nDUPLICATE=1\nDUPLICATE=2'}
            spellCheck={false}
            rows={8}
            className={cn(
              'border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full resize-y rounded-lg border px-4 py-3 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none'
            )}
          />
          {validation && (
            <div className="mt-4 space-y-3">
              {validation.errors.length === 0 && validation.warnings.length === 0 ? (
                <div className="flex items-start gap-3 rounded-lg border border-green-600/30 bg-green-600/5 p-4">
                  <ShieldCheck
                    className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400"
                    aria-hidden="true"
                  />
                  <p className="text-sm font-medium text-green-700 dark:text-green-400">
                    No issues found — this file looks valid.
                  </p>
                </div>
              ) : (
                <>
                  {validation.errors.map((issue, index) => (
                    <div
                      key={`e-${index}`}
                      className="flex items-start gap-3 rounded-lg border border-red-600/30 bg-red-600/5 p-4"
                    >
                      <TriangleAlert
                        className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400"
                        aria-hidden="true"
                      />
                      <div className="text-sm">
                        <p className="font-medium text-red-700 dark:text-red-400">
                          Line {issue.line}
                        </p>
                        <p className="mt-1 text-red-600 dark:text-red-400">{issue.message}</p>
                      </div>
                    </div>
                  ))}
                  {validation.warnings.map((issue, index) => (
                    <div
                      key={`w-${index}`}
                      className="flex items-start gap-3 rounded-lg border border-amber-600/30 bg-amber-600/5 p-4"
                    >
                      <TriangleAlert
                        className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400"
                        aria-hidden="true"
                      />
                      <div className="text-sm">
                        <p className="font-medium text-amber-700 dark:text-amber-400">
                          Line {issue.line}
                        </p>
                        <p className="mt-1 text-amber-600 dark:text-amber-400">{issue.message}</p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

EnvFileGenerator.displayName = 'EnvFileGenerator';

export { EnvFileGenerator };
