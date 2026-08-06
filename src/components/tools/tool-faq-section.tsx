import React from 'react';
import { HelpCircle } from 'lucide-react';
import type { ToolDefinition } from '@/types';
import { FAQ } from '@/components/shared/faq';
import { SectionHeading } from '@/components/shared/section-heading';

interface ToolFaqSectionProps {
  definition: ToolDefinition;
  className?: string;
}

const ToolFaqSection: React.FC<ToolFaqSectionProps> = ({ definition, className }) => {
  if (definition.faqs.length === 0) return null;

  return (
    <section className={`mt-12 ${className ?? ''}`} aria-labelledby="faq-heading">
      <SectionHeading
        icon={<HelpCircle className="h-5 w-5" aria-hidden="true" />}
        title="Frequently Asked Questions"
        description={`Quick answers about ${definition.title}.`}
      />
      <FAQ items={definition.faqs} variant="separated" allowMultiple />
    </section>
  );
};

ToolFaqSection.displayName = 'ToolFaqSection';

export { ToolFaqSection };
