'use client';

import React, { useMemo, useState } from 'react';
import { Terminal, Copy, Download, AlertTriangle } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { generateHtaccess, type HtaccessOptions } from '@/lib/tools/seo-generators';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';
import { CopyButton } from '@/components/shared/copy-button';
import { DownloadButton } from '@/components/shared/download-button';

const HtaccessGenerator: React.FC<ToolComponentProps> = () => {
  const [form, setForm] = useState<HtaccessOptions>({
    forceHttps: true,
    wwwRedirect: 'none',
    customRules: '',
  });

  const output = useMemo(() => generateHtaccess(form), [form]);

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Terminal className="h-6 w-6" aria-hidden="true" />}
        title=".htaccess generator"
        description="Generate Apache .htaccess rules for HTTPS enforcement, www redirects, and custom rules."
      />
      <div className="border-border bg-card space-y-6 rounded-xl border p-5">
        <div>
          <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
            Redirects & security
          </p>
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={form.forceHttps}
              onChange={(e) => setForm((prev) => ({ ...prev, forceHttps: e.target.checked }))}
              className="accent-primary h-4 w-4"
            />
            Force HTTPS (redirect all HTTP to HTTPS)
          </label>
        </div>
        <div>
          <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
            WWW handling
          </p>
          <div className="space-y-2">
            {(['none', 'add', 'remove'] as const).map((option) => (
              <label key={option} className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="www"
                  checked={form.wwwRedirect === option}
                  onChange={() => setForm((prev) => ({ ...prev, wwwRedirect: option }))}
                  className="accent-primary h-4 w-4"
                />
                <span className="capitalize">
                  {option === 'none' ? 'No redirect' : option === 'add' ? 'Add www' : 'Remove www'}
                </span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label
            htmlFor="htaccess-custom"
            className="text-muted-foreground mb-2 block text-xs font-semibold tracking-wider uppercase"
          >
            Custom rules (optional)
          </label>
          <textarea
            id="htaccess-custom"
            value={form.customRules}
            onChange={(event) => setForm((prev) => ({ ...prev, customRules: event.target.value }))}
            placeholder="# Add custom RewriteRules here..."
            rows={6}
            spellCheck={false}
            className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary w-full resize-y rounded-lg border px-4 py-3 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
          />
        </div>
      </div>

      <TransformPanel
        inputId="htaccess-output"
        inputValue=""
        onInputChange={() => {}}
        outputValue={output}
        outputLabel=".htaccess"
        fileName=".htaccess"
        toolbar={
          output.trim() ? (
            <>
              <CopyButton value={output} iconOnly size="sm" />
              <DownloadButton
                content={output}
                fileName=".htaccess"
                contentType="text/plain;charset=utf-8"
                label="Download"
                size="sm"
              />
            </>
          ) : null
        }
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <p className="text-muted-foreground mb-3 flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
          <AlertTriangle className="h-4 w-4" aria-hidden="true" />
          Notes
        </p>
        <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
          <li>
            Requires Apache with <code>mod_rewrite</code> enabled.
          </li>
          <li>
            Place in your site&apos;s document root (usually <code>public_html</code> or{' '}
            <code>www</code>).
          </li>
          <li>Test thoroughly — incorrect rules can break your site.</li>
          <li>Custom rules are appended after generated redirects.</li>
        </ul>
      </div>
    </div>
  );
};

HtaccessGenerator.displayName = 'HtaccessGenerator';

export { HtaccessGenerator };
