'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Download, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DownloadButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'onClick'
> {
  url?: string;
  fileName?: string;
  content?: string;
  contentType?: string;
  label?: string;
  downloadingLabel?: string;
  downloadedLabel?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  iconOnly?: boolean;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  url,
  fileName = 'download.txt',
  content,
  contentType = 'text/plain',
  label = 'Download',
  downloadingLabel = 'Downloading...',
  downloadedLabel = 'Downloaded!',
  variant = 'default',
  size = 'md',
  iconOnly = false,
  className,
  ...props
}) => {
  const [state, setState] = useState<'idle' | 'downloading' | 'downloaded'>('idle');
  const [showSuccess, setShowSuccess] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleDownload = useCallback(async () => {
    if (state === 'downloading') return;

    setState('downloading');

    try {
      let blobUrl: string;

      if (content !== undefined) {
        const blob = new Blob([content], { type: contentType });
        blobUrl = URL.createObjectURL(blob);
      } else if (url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to download: ${response.statusText}`);
        const blob = await response.blob();
        blobUrl = URL.createObjectURL(blob);
      } else {
        throw new Error('Either content or url must be provided');
      }

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

      setState('downloaded');
      setShowSuccess(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setState('idle');
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Download failed:', error);
      setState('idle');
    }
  }, [url, content, contentType, fileName, state]);

  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-border bg-background hover:bg-muted text-foreground',
    ghost: 'hover:bg-muted text-muted-foreground hover:text-foreground',
    success: 'bg-success text-white hover:bg-success/90',
  };

  const sizeClasses = {
    sm: 'h-8 px-3 text-xs gap-1.5',
    md: 'h-9 px-4 text-sm gap-2',
    lg: 'h-11 px-6 text-base gap-2.5',
  };

  const iconSize = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const currentLabel =
    state === 'downloading' ? downloadingLabel : state === 'downloaded' ? downloadedLabel : label;

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={state === 'downloading'}
      className={cn(
        'focus-visible:ring-ring inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70',
        variantClasses[variant],
        sizeClasses[size],
        state === 'downloaded' && 'bg-green-600 text-white hover:bg-green-600',
        className
      )}
      aria-label={label}
      title={label}
      {...props}
    >
      {state === 'downloading' ? (
        <Loader2 className={cn(iconSize[size], 'animate-spin')} aria-hidden="true" />
      ) : state === 'downloaded' && showSuccess ? (
        <CheckCircle2 className={cn(iconSize[size])} aria-hidden="true" />
      ) : (
        <Download className={cn(iconSize[size])} aria-hidden="true" />
      )}
      {!iconOnly && <span>{currentLabel}</span>}
    </button>
  );
};

DownloadButton.displayName = 'DownloadButton';

export { DownloadButton };
