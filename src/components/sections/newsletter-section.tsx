import React from 'react';
import { Mail } from 'lucide-react';
import { NewsletterForm } from '@/components/shared/newsletter-form';

interface NewsletterSectionProps {
  title?: string;
  description?: string;
  className?: string;
}

const NewsletterSection: React.FC<NewsletterSectionProps> = ({
  title = 'Stay in the loop',
  description = 'Get the best developer tools and articles delivered to your inbox. No spam — unsubscribe anytime.',
  className = '',
}) => {
  return (
    <section className={`border-border border-t ${className}`}>
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <span className="bg-primary/10 text-primary mx-auto flex h-12 w-12 items-center justify-center rounded-2xl">
          <Mail className="h-6 w-6" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        <p className="text-muted-foreground mx-auto mt-3 max-w-lg text-pretty">{description}</p>
        <div className="mx-auto mt-8 flex justify-center">
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
};

NewsletterSection.displayName = 'NewsletterSection';

export { NewsletterSection };
