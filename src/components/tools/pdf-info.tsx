'use client';

import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { getPdfInfo } from '@/lib/tools/pdf';
import { SectionHeading } from '@/components/shared/section-heading';
import { FileDropzone, formatFileSize } from '@/components/tools/file-dropzone';

const PdfInfo: React.FC<ToolComponentProps> = () => {
  const [info, setInfo] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (selected: File[]): Promise<void> => {
    const pdfFile = selected[0];
    if (pdfFile === undefined) return;
    setInfo(null);
    setError(null);
    setLoading(true);
    try {
      const result = await getPdfInfo(pdfFile);
      setInfo({
        'File name': result.fileName,
        'File size': formatFileSize(result.fileSize),
        Pages: String(result.numPages),
        'PDF version': result.pdfVersion,
        Title: result.title ?? '—',
        Author: result.author ?? '—',
        Subject: result.subject ?? '—',
        Keywords: result.keywords ?? '—',
        Creator: result.creator ?? '—',
        Producer: result.producer ?? '—',
        Created: result.creationDate ?? '—',
        Modified: result.modificationDate ?? '—',
        Linearized: result.isLinearized ? 'Yes' : 'No',
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not read this PDF.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<FileText className="h-6 w-6" aria-hidden="true" />}
        title="PDF info"
        description="Inspect a PDF's page count, PDF version, document metadata, and more — nothing is uploaded, everything stays in your browser."
      />

      <FileDropzone
        accept=".pdf,application/pdf"
        onFiles={analyze}
        multiple={false}
        label="Drop a PDF here or click to browse"
        hint="Information is read locally on your device."
      />

      {loading && (
        <p className="text-muted-foreground text-sm" role="status">
          Reading PDF…
        </p>
      )}

      {error !== null && (
        <div className="rounded-xl border border-red-600/20 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {info !== null && (
        <div className="border-border bg-card rounded-xl border">
          {Object.entries(info).map(([label, value], index) => (
            <div
              key={label}
              className={`flex items-start justify-between gap-6 px-5 py-3 ${
                index % 2 === 0 ? 'bg-background' : ''
              }`}
            >
              <span className="text-muted-foreground shrink-0 text-sm">{label}</span>
              <span className="text-foreground text-right text-sm break-all">{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

PdfInfo.displayName = 'PdfInfo';

export { PdfInfo };
