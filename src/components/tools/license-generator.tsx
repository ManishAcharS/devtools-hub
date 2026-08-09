'use client';

import React, { useMemo, useState } from 'react';
import { FileCheck2, Download } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { renderLicense, LICENSE_OPTIONS } from '@/lib/tools/file-templates';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';
import { DownloadButton } from '@/components/shared/download-button';

const LicenseGenerator: React.FC<ToolComponentProps> = () => {
  const [licenseId, setLicenseId] = useState('mit');
  const [author, setAuthor] = useState('Your Name');
  const [year, setYear] = useState(new Date().getFullYear());

  const output = useMemo(() => renderLicense(licenseId, author, year), [licenseId, author, year]);

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<FileCheck2 className="h-6 w-6" aria-hidden="true" />}
        title="License generator"
        description="Generate standard open-source license texts with your name and year pre-filled."
      />
      <div className="border-border bg-card rounded-xl border p-5">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label
              htmlFor="license-type"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              License
            </label>
            <select
              id="license-type"
              value={licenseId}
              onChange={(event) => setLicenseId(event.target.value)}
              className="border-border bg-background text-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
            >
              {LICENSE_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="license-author"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Author
            </label>
            <input
              id="license-author"
              type="text"
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              placeholder="Your Name"
              className="border-border bg-background text-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="license-year"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Year
            </label>
            <input
              id="license-year"
              type="number"
              min="1970"
              max={new Date().getFullYear() + 10}
              value={year}
              onChange={(event) => setYear(Number(event.target.value))}
              className="border-border bg-background text-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>
        </div>
        <p className="text-muted-foreground mt-3 text-xs">
          {LICENSE_OPTIONS.find((o) => o.id === licenseId)?.description}
        </p>
      </div>

      <TransformPanel
        inputId="license-output"
        inputValue=""
        onInputChange={() => {}}
        outputValue={output}
        outputLabel="License text"
        fileName={`LICENSE${licenseId === 'mit' ? '' : `.${licenseId}`}`}
        toolbar={
          <DownloadButton
            content={output}
            fileName={`LICENSE${licenseId === 'mit' ? '' : `.${licenseId}`}`}
            contentType="text/plain;charset=utf-8"
            label="Download"
            size="sm"
          />
        }
      />
    </div>
  );
};

LicenseGenerator.displayName = 'LicenseGenerator';

export { LicenseGenerator };
