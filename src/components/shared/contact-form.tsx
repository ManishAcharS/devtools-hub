'use client';

import React, { useState } from 'react';
import { Loader2, Send, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/toast';

interface ContactFormProps {
  className?: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClasses =
  'w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-500/30';

const ContactForm: React.FC<ContactFormProps> = ({ className }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting'>('idle');

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!name.trim()) {
      next.name = 'Please enter your name.';
    }
    if (!email.trim()) {
      next.email = 'Please enter your email address.';
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      next.email = 'Please enter a valid email address.';
    }
    if (!message.trim()) {
      next.message = 'Please write a message.';
    } else if (message.trim().length < 10) {
      next.message = 'Your message should be at least 10 characters.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('submitting');
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success(
        'Message sent',
        'Thanks for reaching out — we usually reply within 1–2 business days.'
      );
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch {
      toast.error('Something went wrong', 'Please try again in a moment.');
    } finally {
      setStatus('idle');
    }
  };

  const fieldId = (name: string) => `contact-${name}`;

  return (
    <form onSubmit={handleSubmit} noValidate className={cn('space-y-5', className)}>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor={fieldId('name')}
            className="text-foreground mb-1.5 block text-sm font-medium"
          >
            Name{' '}
            <span className="text-red-500" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id={fieldId('name')}
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? `${fieldId('name')}-error` : undefined}
            className={inputClasses}
            placeholder="Ada Lovelace"
            required
          />
          {errors.name && (
            <p
              id={`${fieldId('name')}-error`}
              className="mt-1.5 flex items-center gap-1 text-xs text-red-500"
              role="alert"
            >
              <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor={fieldId('email')}
            className="text-foreground mb-1.5 block text-sm font-medium"
          >
            Email{' '}
            <span className="text-red-500" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id={fieldId('email')}
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? `${fieldId('email')}-error` : undefined}
            className={inputClasses}
            placeholder="ada@example.com"
            required
          />
          {errors.email && (
            <p
              id={`${fieldId('email')}-error`}
              className="mt-1.5 flex items-center gap-1 text-xs text-red-500"
              role="alert"
            >
              <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor={fieldId('subject')}
          className="text-foreground mb-1.5 block text-sm font-medium"
        >
          Subject
        </label>
        <input
          id={fieldId('subject')}
          name="subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className={inputClasses}
          placeholder="Tool suggestion, feedback, partnership…"
        />
      </div>

      <div>
        <label
          htmlFor={fieldId('message')}
          className="text-foreground mb-1.5 block text-sm font-medium"
        >
          Message{' '}
          <span className="text-red-500" aria-hidden="true">
            *
          </span>
        </label>
        <textarea
          id={fieldId('message')}
          name="message"
          rows={6}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
          }}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? `${fieldId('message')}-error` : undefined}
          className={cn(inputClasses, 'resize-y')}
          placeholder="Tell us what's on your mind…"
          required
        />
        {errors.message && (
          <p
            id={`${fieldId('message')}-error`}
            className="mt-1.5 flex items-center gap-1 text-xs text-red-500"
            role="alert"
          >
            <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
            {errors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" aria-hidden="true" />
            Send message
          </>
        )}
      </button>
    </form>
  );
};

ContactForm.displayName = 'ContactForm';

export { ContactForm };
