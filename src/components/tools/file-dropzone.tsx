'use client';

import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
export { formatFileSize } from '@/lib/tools/files';
import { formatFileSize } from '@/lib/tools/files';

interface FileDropzoneProps {
  onFiles: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  disabled?: boolean;
  hint?: string;
  label?: string;
  className?: string;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFiles,
  accept,
  multiple = false,
  disabled = false,
  hint = 'or drag & drop files here',
  label,
  className,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragDepth = useRef(0);

  const openPicker = (): void => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openPicker();
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    dragDepth.current = 0;
    setIsDragging(false);
    if (disabled) return;
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) onFiles(files);
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    if (disabled) return;
    dragDepth.current += 1;
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    dragDepth.current -= 1;
    if (dragDepth.current <= 0) {
      dragDepth.current = 0;
      setIsDragging(false);
    }
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={label ?? 'Upload files'}
      aria-disabled={disabled}
      onClick={openPicker}
      onKeyDown={handleKeyDown}
      onDrop={handleDrop}
      onDragOver={(event) => event.preventDefault()}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      className={cn(
        'border-border text-muted-foreground focus-visible:ring-ring flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors focus-visible:ring-2 focus-visible:outline-none',
        isDragging && 'border-primary bg-primary/5 text-primary',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          if (files.length > 0) onFiles(files);
          event.target.value = '';
        }}
      />
      <Upload className="mb-1 h-8 w-8" aria-hidden="true" />
      <span className="text-foreground font-medium">
        {isDragging ? 'Drop files to add them' : (label ?? 'Click to upload')}
      </span>
      <span className="text-sm">{hint}</span>
    </div>
  );
};

FileDropzone.displayName = 'FileDropzone';

export { FileDropzone };

interface SelectedFileProps {
  file: File;
  onRemove?: () => void;
  details?: string;
}

const SelectedFile: React.FC<SelectedFileProps> = ({ file, onRemove, details }) => (
  <div className="border-border bg-muted/50 flex items-center gap-3 rounded-xl border px-4 py-3">
    <div className="min-w-0 flex-1">
      <p className="text-foreground truncate text-sm font-medium">{file.name}</p>
      <p className="text-muted-foreground text-xs">
        {formatFileSize(file.size)}
        {details ? ` · ${details}` : ''}
      </p>
    </div>
    {onRemove && (
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${file.name}`}
        className="text-muted-foreground hover:text-foreground rounded-md p-1 transition-colors"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    )}
  </div>
);

SelectedFile.displayName = 'SelectedFile';

export { SelectedFile };
