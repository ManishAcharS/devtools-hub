'use client';

import React, { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { downloadBlob } from '@/lib/tools/files';
import { extractPdfText } from '@/lib/tools/pdf';
import { SectionHeading } from '@/components/shared/section-heading';
import { FileDropzone, formatFileSize } from '@/components/tools/file-dropzone';

const PdfTextExtractor: React.FC<ToolComponentProps> = () => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState<string | null>(null);
  const [pages, setPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extract = async (selected: File[]): Promise<void> => {
    const pdfFile = selected[0];
    if (pdfFile === undefined) return;
    setFile(pdfFile);
    setText(null);
    setError(null);
    setLoading(true);
    try {
      const pageTexts = await extractPdfText(pdfFile);
      setText(
        pageTexts
          .map((page) => `--- Page ${page.pageNumber} ---\n${page.text}`)
          .join('\n\n')
          .trim()
      );
      setPages(pageTexts.length);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not extract text from this PDF.');
    } finally {
      setLoading(false);
    }
  };

  const download = (): void => {
    if (text === null) return;
    const baseName = (file?.name ?? 'document').replace(/\.pdf$/i, '');
    downloadBlob(new Blob([text], { type: 'text/plain;charset=utf-8' }), `${baseName}.txt`);
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<FileText className="h-6 w-6" aria-hidden="true" />}
        title="PDF text extractor"
        description="Extract all selectable text from a PDF, page by page. Scanned documents without a text layer will yield no content."
      />

      <FileDropzone
        accept=".pdf,application/pdf"
        onFiles={extract}
        multiple={false}
        label="Drop a PDF here or click to browse"
        hint="Text is extracted locally on your device."
      />

      {loading && (
        <p className="text-muted-foreground text-sm" role="status">
          Extracting text…
        </p>
      )}

      {error !== null && (
        <div className="rounded-xl border border-red-600/20 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {text !== null && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-muted-foreground text-sm">
              {pages} {pages === 1 ? 'page' : 'pages'} · {text.length.toLocaleString()} characters
            </p>
            <button
              type="button"
              onClick={download}
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download .txt
            </button>
          </div>
          <div className="border-border overflow-hidden rounded-xl border">
            <div className="bg-muted text-muted-foreground border-border flex items-center justify-between border-b px-4 py-2 text-xs font-semibold tracking-wider uppercase">
              <span>Extracted text</span>
              <span>{file !== null ? formatFileSize(file.size) : ''}</span>
            </div>
            <pre className="bg-background text-foreground m-0 max-h-[32rem] overflow-auto p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
              {text}
            </pre>
          </div>
        </>
      )}
    </div>
  );
};

PdfTextExtractor.displayName = 'PdfTextExtractor';

export { PdfTextExtractor };
