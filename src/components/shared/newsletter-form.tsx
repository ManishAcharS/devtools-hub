'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/toast';

interface NewsletterFormProps {
  compact?: boolean;
  className?: string;
}

const NewsletterForm: React.FC<NewsletterFormProps> = ({ compact = false, className }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus('error');
      toast.error('Invalid email', 'Please enter a valid email address.');
      return;
    }
    setStatus('submitting');
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setStatus('success');
      toast.success('Subscribed!', "You'll hear from us soon.");
    } catch {
      setStatus('error');
      toast.error('Something went wrong', 'Please try again later.');
    }
  };

  if (status === 'success') {
    return (
      <div
        className={cn(
          'flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400',
          compact ? 'max-w-xs' : 'max-w-md',
          className
        )}
        role="status"
      >
        <CheckCircle2 className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
        <div>
          <p className="font-medium">You&apos;re subscribed!</p>
          {!compact && <p className="mt-0.5 text-xs">Watch your inbox for the next issue.</p>}
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(compact ? 'max-w-xs' : 'max-w-md', className)}
      noValidate
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Mail
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
            aria-hidden="true"
          />
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setStatus('idle');
            }}
            placeholder="you@example.com"
            className={cn(
              'border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:ring-primary/30 focus:border-primary/50 w-full rounded-lg border transition-all focus:ring-2 focus:outline-none',
              compact ? 'h-9 pr-3 pl-9 text-xs' : 'h-11 pr-4 pl-10 text-sm'
            )}
          />
        </div>
        <button
          type="submit"
          disabled={status === 'submitting'}
          className={cn(
            'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70',
            compact ? 'h-9 px-3 text-xs' : 'h-11 px-5 text-sm'
          )}
        >
          {status === 'submitting' && (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          )}
          {status === 'submitting' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </div>
      {status === 'error' && (
        <p
          className="mt-2 flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400"
          role="alert"
        >
          <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
          Please enter a valid email address.
        </p>
      )}
    </form>
  );
};

NewsletterForm.displayName = 'NewsletterForm';

export { NewsletterForm };
