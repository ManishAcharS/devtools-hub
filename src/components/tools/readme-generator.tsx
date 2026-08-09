'use client';

import React, { useMemo, useState } from 'react';
import { FileText, BadgeCheck } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { README_TEMPLATE } from '@/lib/tools/file-templates';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';
import { DownloadButton } from '@/components/shared/download-button';

const ReadmeGenerator: React.FC<ToolComponentProps> = () => {
  const [form, setForm] = useState({
    title: 'My Project',
    description: 'A brief description of what this project does.',
    badges:
      '[![npm](https://img.shields.io/npm/v/my-package)]()\n[![license](https://img.shields.io/github/license/user/repo)]()',
    install: 'npm install my-package',
    usage: '# Basic usage\nimport { something } from "my-package";\n\nsomething();',
    license: 'MIT',
  });

  const output = useMemo(() => README_TEMPLATE(form), [form]);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<FileText className="h-6 w-6" aria-hidden="true" />}
        title="README generator"
        description="Create a professional README.md with title, badges, description, installation, usage, and license sections."
      />
      <div className="space-y-4">
        <div className="border-border bg-card rounded-xl border p-5">
          <label
            htmlFor="readme-title"
            className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
          >
            Project title
          </label>
          <input
            id="readme-title"
            type="text"
            value={form.title}
            onChange={(event) => updateField('title', event.target.value)}
            placeholder="My Awesome Project"
            className="border-border bg-background text-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
          />
        </div>
        <div className="border-border bg-card rounded-xl border p-5">
          <label
            htmlFor="readme-desc"
            className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
          >
            Description
          </label>
          <textarea
            id="readme-desc"
            value={form.description}
            onChange={(event) => updateField('description', event.target.value)}
            placeholder="What does your project do?"
            rows={3}
            className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full resize-y rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
          />
        </div>
        <div className="border-border bg-card rounded-xl border p-5">
          <label
            htmlFor="readme-badges"
            className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
          >
            Badges (Markdown, one per line)
          </label>
          <textarea
            id="readme-badges"
            value={form.badges}
            onChange={(event) => updateField('badges', event.target.value)}
            placeholder="[![npm](https://img.shields.io/npm/v/pkg)]()"
            rows={3}
            spellCheck={false}
            className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full resize-y rounded-lg border px-4 py-3 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
          />
        </div>
        <div className="border-border bg-card rounded-xl border p-5">
          <label
            htmlFor="readme-install"
            className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
          >
            Installation command
          </label>
          <textarea
            id="readme-install"
            value={form.install}
            onChange={(event) => updateField('install', event.target.value)}
            placeholder="npm install my-package"
            rows={2}
            spellCheck={false}
            className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full resize-y rounded-lg border px-4 py-3 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
          />
        </div>
        <div className="border-border bg-card rounded-xl border p-5">
          <label
            htmlFor="readme-usage"
            className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
          >
            Usage example (Markdown)
          </label>
          <textarea
            id="readme-usage"
            value={form.usage}
            onChange={(event) => updateField('usage', event.target.value)}
            placeholder="# Example\nimport { fn } from 'pkg';\nfn();"
            rows={6}
            spellCheck={false}
            className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full resize-y rounded-lg border px-4 py-3 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
          />
        </div>
        <div className="border-border bg-card rounded-xl border p-5">
          <label
            htmlFor="readme-license"
            className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
          >
            License
          </label>
          <select
            id="readme-license"
            value={form.license}
            onChange={(event) => updateField('license', event.target.value)}
            className="border-border bg-background text-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
          >
            <option value="MIT">MIT</option>
            <option value="Apache-2.0">Apache 2.0</option>
            <option value="GPL-3.0">GPL 3.0</option>
            <option value="BSD-3-Clause">BSD 3-Clause</option>
            <option value="ISC">ISC</option>
            <option value="Custom">Custom / Other</option>
          </select>
        </div>
      </div>

      <TransformPanel
        inputId="readme-output"
        inputValue=""
        onInputChange={() => {}}
        outputValue={output}
        outputLabel="Generated README"
        fileName="README.md"
        stats={[{ label: 'Lines', value: output.split('\n').length.toLocaleString() }]}
        toolbar={
          <DownloadButton
            content={output}
            fileName="README.md"
            contentType="text/markdown;charset=utf-8"
            label="Download"
            size="sm"
          />
        }
      />
    </div>
  );
};

ReadmeGenerator.displayName = 'ReadmeGenerator';

export { ReadmeGenerator };
