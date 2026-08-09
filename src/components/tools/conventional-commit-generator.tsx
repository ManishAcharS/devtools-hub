'use client';

import React, { useMemo, useState } from 'react';
import { GitCommitHorizontal } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

const COMMIT_TYPES: { value: string; label: string }[] = [
  { value: 'feat', label: 'feat — new feature' },
  { value: 'fix', label: 'fix — bug fix' },
  { value: 'docs', label: 'docs — documentation' },
  { value: 'style', label: 'style — formatting, no code change' },
  { value: 'refactor', label: 'refactor — code change, no behavior change' },
  { value: 'perf', label: 'perf — performance improvement' },
  { value: 'test', label: 'test — adding or fixing tests' },
  { value: 'build', label: 'build — build system or dependencies' },
  { value: 'ci', label: 'ci — continuous integration config' },
  { value: 'chore', label: 'chore — maintenance, no production code' },
  { value: 'revert', label: 'revert — revert a previous commit' },
];

function buildCommitMessage(
  type: string,
  scope: string,
  description: string,
  body: string,
  breaking: boolean,
  breakingDescription: string,
  footer: string
): string {
  const header = `${type}${scope ? `(${scope})` : ''}${breaking ? '!' : ''}: ${description}`;
  const parts = [header];
  if (body.trim()) parts.push('', body.trim());
  if (breaking && breakingDescription.trim()) {
    parts.push('', `BREAKING CHANGE: ${breakingDescription.trim()}`);
  }
  if (footer.trim()) {
    parts.push('', footer.trim());
  }
  return parts.join('\n');
}

const ConventionalCommitGenerator: React.FC<ToolComponentProps> = () => {
  const [type, setType] = useState('feat');
  const [scope, setScope] = useState('');
  const [description, setDescription] = useState('');
  const [body, setBody] = useState('');
  const [breaking, setBreaking] = useState(false);
  const [breakingDescription, setBreakingDescription] = useState('');
  const [footer, setFooter] = useState('');

  const message = useMemo(
    () => buildCommitMessage(type, scope, description, body, breaking, breakingDescription, footer),
    [type, scope, description, body, breaking, breakingDescription, footer]
  );

  const inputClasses =
    'border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none';

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<GitCommitHorizontal className="h-6 w-6" aria-hidden="true" />}
        title="Conventional commit generator"
        description="Build commitlint-valid conventional commit messages with type, scope, breaking changes, and footers — perfect for semantic versioning and automatic changelogs."
      />
      <div className="border-border bg-card rounded-xl border p-5">
        <label
          htmlFor="commit-type"
          className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
        >
          Type
        </label>
        <select
          id="commit-type"
          value={type}
          onChange={(event) => setType(event.target.value)}
          className={inputClasses}
        >
          {COMMIT_TYPES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="border-border bg-card rounded-xl border p-5">
        <label
          htmlFor="commit-scope"
          className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
        >
          Scope (optional)
        </label>
        <input
          id="commit-scope"
          type="text"
          value={scope}
          onChange={(event) => setScope(event.target.value)}
          placeholder="auth, api, ui…"
          spellCheck={false}
          className={inputClasses}
        />
      </div>
      <div className="border-border bg-card rounded-xl border p-5">
        <label
          htmlFor="commit-description"
          className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
        >
          Description (required)
        </label>
        <input
          id="commit-description"
          type="text"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="add password reset flow"
          spellCheck={false}
          className={inputClasses}
        />
      </div>
      <div className="border-border bg-card rounded-xl border p-5">
        <label
          htmlFor="commit-body"
          className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
        >
          Body (optional)
        </label>
        <textarea
          id="commit-body"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Explain the why, not the what…"
          rows={4}
          className={inputClasses}
        />
      </div>
      <div className="border-border bg-card rounded-xl border p-5">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={breaking}
            onChange={(event) => setBreaking(event.target.checked)}
            className="accent-primary h-4 w-4"
          />
          Breaking change
        </label>
        {breaking && (
          <input
            type="text"
            value={breakingDescription}
            onChange={(event) => setBreakingDescription(event.target.value)}
            placeholder="BREAKING CHANGE: describe the breaking change"
            spellCheck={false}
            className={`${inputClasses} mt-3`}
          />
        )}
      </div>
      <div className="border-border bg-card rounded-xl border p-5">
        <label
          htmlFor="commit-footer"
          className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
        >
          Footer (optional)
        </label>
        <input
          id="commit-footer"
          type="text"
          value={footer}
          onChange={(event) => setFooter(event.target.value)}
          placeholder="Refs: #123"
          spellCheck={false}
          className={inputClasses}
        />
      </div>

      <TransformPanel
        inputId="commit-output"
        inputValue=""
        onInputChange={() => {}}
        outputValue={message}
        outputLabel="Commit message"
        outputPlaceholder="Type a description to build the message…"
        fileName="commit-message.txt"
        stats={[
          { label: 'Lines', value: message.split('\n').length.toLocaleString() },
          { label: 'Length', value: message.length.toLocaleString() },
        ]}
      />
    </div>
  );
};

ConventionalCommitGenerator.displayName = 'ConventionalCommitGenerator';

export { ConventionalCommitGenerator };
