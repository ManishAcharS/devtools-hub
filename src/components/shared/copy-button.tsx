'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Copy, Check, ClipboardX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CopyButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'onClick'
> {
  value: string;
  label?: string;
  copiedLabel?: string;
  successDuration?: number;
  variant?: 'default' | 'ghost' | 'outline' | 'minimal';
  size?: 'sm' | 'md';
  iconOnly?: boolean;
}

const CopyButton: React.FC<CopyButtonProps> = ({
  value,
  label = 'Copy',
  copiedLabel = 'Copied!',
  successDuration = 2000,
  variant = 'outline',
  size = 'md',
  iconOnly = false,
  className,
  ...props
}) => {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setFailed(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), successDuration);
    } catch {
      setFailed(true);
      setCopied(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setFailed(false), successDuration);
    }
  }, [value, successDuration]);

  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    ghost: 'hover:bg-muted text-muted-foreground hover:text-foreground',
    outline: 'border border-border bg-background hover:bg-muted text-foreground',
    minimal: 'text-muted-foreground hover:text-foreground',
  };

  const sizeClasses = {
    sm: 'h-8 px-3 text-xs gap-1.5',
    md: 'h-9 px-4 text-sm gap-2',
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        'focus-visible:ring-ring inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        copied && 'text-green-600 dark:text-green-400',
        failed && 'text-red-600 dark:text-red-400',
        className
      )}
      aria-label={copied ? copiedLabel : label}
      title={label}
      {...props}
    >
      {copied ? (
        <Check className="h-4 w-4" aria-hidden="true" />
      ) : failed ? (
        <ClipboardX className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Copy className="h-4 w-4" aria-hidden="true" />
      )}
      {!iconOnly && <span>{copied ? copiedLabel : failed ? 'Failed' : label}</span>}
    </button>
  );
};

CopyButton.displayName = 'CopyButton';

export { CopyButton };
