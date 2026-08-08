'use client';

import React, { useState } from 'react';
import { FileSearch } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import {
  HASH_ALGORITHMS,
  hashFile,
  type HashAlgorithm,
  type HashResult,
} from '@/lib/tools/hashing';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';
import { FileDropzone, SelectedFile, formatFileSize } from '@/components/tools/file-dropzone';
import { downloadBlob } from '@/lib/tools/pdf';

const FileHashGenerator: React.FC<ToolComponentProps> = () => {
  const [file, setFile] = useState<File | null>(null);
  const [selected, setSelected] = useState<HashAlgorithm[]>(['MD5', 'SHA-256']);
  const [results, setResults] = useState<HashResult[]>([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isHashing, setIsHashing] = useState(false);

  const toggleAlgorithm = (algorithm: HashAlgorithm): void => {
    setSelected((current) =>
      current.includes(algorithm)
        ? current.filter((item) => item !== algorithm)
        : [...current, algorithm]
    );
  };

  const handleFiles = (files: File[]): void => {
    const next = files[0];
    if (!next) return;
    setFile(next);
    setResults([]);
    setError(null);
  };

  const runHash = async (): Promise<void> => {
    if (!file) return;
    setError(null);
    setResults([]);
    setProgress(0);
    setIsHashing(true);
    try {
      const output = await hashFile(file, selected, (state) => setProgress(state.percent));
      setResults(output);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not hash the file.');
    } finally {
      setIsHashing(false);
    }
  };

  const exportText = results.map((result) => `${result.algorithm}: ${result.hex}`).join('\n');

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<FileSearch className="h-6 w-6" aria-hidden="true" />}
        title="File hash generator"
        description="Compute MD5, SHA-1, SHA-256, and SHA-512 checksums for any file, entirely in your browser. Large files are streamed in chunks with live progress."
      />

      {!file ? (
        <FileDropzone
          onFiles={handleFiles}
          label="Choose a file to hash"
          hint="any file type · processed locally, never uploaded"
        />
      ) : (
        <div className="space-y-4">
          <SelectedFile
            file={file}
            onRemove={() => {
              setFile(null);
              setResults([]);
              setError(null);
            }}
          />

          <fieldset>
            <legend className="text-foreground mb-2 text-sm font-medium">Algorithms</legend>
            <div className="flex flex-wrap gap-2">
              {HASH_ALGORITHMS.map((algorithm) => (
                <label
                  key={algorithm}
                  className="border-border bg-background text-foreground has-[:checked]:border-primary flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(algorithm)}
                    onChange={() => toggleAlgorithm(algorithm)}
                    className="accent-primary h-4 w-4"
                  />
                  {algorithm}
                </label>
              ))}
            </div>
          </fieldset>

          <button
            type="button"
            onClick={runHash}
            disabled={isHashing || selected.length === 0}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-5 py-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isHashing ? `Hashing… ${Math.round(progress * 100)}%` : 'Hash file'}
          </button>

          {isHashing && (
            <div
              role="progressbar"
              aria-label="Hashing progress"
              aria-valuenow={Math.round(progress * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
              className="bg-muted h-2 overflow-hidden rounded-full"
            >
              <div
                className="bg-primary h-full rounded-full transition-all"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
          )}

          {error && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          {results.length > 0 && (
            <div className="space-y-3">
              {results.map((result) => (
                <div
                  key={result.algorithm}
                  className="border-border bg-muted/50 rounded-xl border p-4"
                >
                  <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
                    {result.algorithm}
                  </p>
                  <code className="text-foreground block font-mono text-sm break-all">
                    {result.hex}
                  </code>
                  <div className="mt-3">
                    <CopyButton
                      value={result.hex}
                      label={`Copy ${result.algorithm}`}
                      size="sm"
                      variant="outline"
                    />
                  </div>
                </div>
              ))}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    downloadBlob(
                      new Blob([exportText], { type: 'text/plain' }),
                      `${file.name}.checksums.txt`
                    )
                  }
                  className="border-border text-foreground hover:bg-muted rounded-xl border px-4 py-2 text-sm font-medium transition-colors"
                >
                  Download checksums
                </button>
              </div>
              <p className="text-muted-foreground text-xs">
                {file.name} · {formatFileSize(file.size)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

FileHashGenerator.displayName = 'FileHashGenerator';

export { FileHashGenerator };
