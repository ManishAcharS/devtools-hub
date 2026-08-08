'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { assertImageFile, dataUrlToBlob, fileToDataUrl } from '@/lib/tools/images';
import { downloadBlob } from '@/lib/tools/pdf';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';
import { FileDropzone, SelectedFile } from '@/components/tools/file-dropzone';

const Base64ImageConverter: React.FC<ToolComponentProps> = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [rawBase64, setRawBase64] = useState<string | null>(null);
  const [pasteInput, setPasteInput] = useState('');
  const [decodedPreview, setDecodedPreview] = useState<string | null>(null);
  const [decodedInfo, setDecodedInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (decodedPreview && decodedPreview.startsWith('blob:')) URL.revokeObjectURL(decodedPreview);
    };
  }, [decodedPreview]);

  const handleFiles = useCallback((files: File[]) => {
    const next = files[0];
    if (!next) return;
    const validation = assertImageFile(next);
    if (validation) {
      setError(validation);
      return;
    }
    setError(null);
    setFile(next);
    setBusy(true);
    void fileToDataUrl(next)
      .then((url) => {
        setDataUrl(url);
        setRawBase64(url.slice(url.indexOf(',') + 1));
      })
      .catch((cause: unknown) =>
        setError(cause instanceof Error ? cause.message : 'Could not read the file.')
      )
      .finally(() => setBusy(false));
  }, []);

  const decodePaste = (): void => {
    setError(null);
    setDecodedPreview((current) => {
      if (current && current.startsWith('blob:')) URL.revokeObjectURL(current);
      return null;
    });
    setDecodedInfo(null);
    const input = pasteInput.trim();
    if (!input) {
      setError('Paste a data URL or base64 string first.');
      return;
    }
    const blob = dataUrlToBlob(input);
    if (!blob) {
      setError(
        'Could not decode the input. Paste a valid data URL (data:image/png;base64,…) or raw base64 string.'
      );
      return;
    }
    setDecodedInfo(`${blob.type || 'unknown type'} · ${formatBytes(blob.size)}`);
    setDecodedPreview(URL.createObjectURL(blob));
  };

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<ImageIcon className="h-6 w-6" aria-hidden="true" />}
        title="Base64 image converter"
        description="Encode any image as a base64 data URL, or decode a pasted data URL back into a downloadable image — all offline."
      />

      <div className="space-y-4">
        {!file ? (
          <FileDropzone
            onFiles={handleFiles}
            accept="image/*"
            label="Choose an image to encode"
            hint="turns it into a base64 data URL"
          />
        ) : (
          <SelectedFile
            file={file}
            onRemove={() => {
              setFile(null);
              setDataUrl(null);
              setRawBase64(null);
              setError(null);
            }}
          />
        )}

        {busy && <p className="text-muted-foreground text-sm">Reading file…</p>}

        {rawBase64 && dataUrl && (
          <div className="space-y-3">
            <p className="text-muted-foreground text-xs">
              Data URL · {formatBytes(Math.round(rawBase64.length * 0.75))} encoded ·{' '}
              {Math.round(rawBase64.length / 1024).toLocaleString()} KB of text
            </p>
            <div className="flex flex-wrap gap-2">
              <CopyButton value={dataUrl} label="Copy data URL" size="sm" />
              <CopyButton value={rawBase64} label="Copy raw base64" size="sm" variant="outline" />
              <button
                type="button"
                onClick={() =>
                  downloadBlob(
                    new Blob([rawBase64], { type: 'text/plain' }),
                    `${(file?.name ?? 'image').replace(/\.[^.]+$/, '')}.b64.txt`
                  )
                }
                className="border-border text-foreground hover:bg-muted rounded-xl border px-4 py-2 text-sm font-medium transition-colors"
              >
                Download base64
              </button>
            </div>
            <textarea
              readOnly
              value={dataUrl}
              rows={5}
              aria-label="Generated data URL"
              className="border-border bg-muted/50 text-foreground focus-visible:ring-primary w-full rounded-xl border px-4 py-3 font-mono text-xs focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>
        )}

        <div className="border-border bg-muted/30 space-y-3 rounded-xl border p-4">
          <h2 className="text-foreground text-base font-semibold">Decode</h2>
          <textarea
            value={pasteInput}
            onChange={(event) => setPasteInput(event.target.value)}
            rows={5}
            placeholder="Paste a data URL (data:image/png;base64,…) or raw base64 here"
            spellCheck={false}
            className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary w-full rounded-xl border px-4 py-3 font-mono text-xs focus-visible:ring-2 focus-visible:outline-none"
          />
          <button
            type="button"
            onClick={decodePaste}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-5 py-2.5 text-sm font-medium transition-colors"
          >
            Decode image
          </button>
          {error && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
          {decodedPreview && decodedInfo && (
            <div className="space-y-3">
              <img
                src={decodedPreview}
                alt="Decoded image preview"
                className="bg-muted max-h-64 w-full rounded-xl object-contain"
              />
              <p className="text-muted-foreground text-xs">{decodedInfo}</p>
              <button
                type="button"
                onClick={() => {
                  const blob = dataUrlToBlob(pasteInput.trim());
                  if (blob) {
                    const extension = blob.type.split('/')[1]?.replace('jpeg', 'jpg') ?? 'png';
                    downloadBlob(blob, `decoded-${Date.now()}.${extension}`);
                  }
                }}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-4 py-2 text-sm font-medium transition-colors"
              >
                Download decoded image
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Base64ImageConverter.displayName = 'Base64ImageConverter';

export { Base64ImageConverter };
