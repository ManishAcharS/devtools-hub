import React from 'react';
import { Code2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ToolDefinition } from '@/types';
import { SectionHeading } from '@/components/shared/section-heading';
import { ExampleBox } from '@/components/shared/example-box';

interface ExamplesSectionProps {
  definition: ToolDefinition;
  className?: string;
}

const ExamplesSection: React.FC<ExamplesSectionProps> = ({ definition, className }) => {
  if (definition.examples.length === 0) return null;

  return (
    <section className={`mt-12 ${className ?? ''}`} aria-labelledby="examples-heading">
      <SectionHeading
        icon={<Code2 className="h-5 w-5" aria-hidden="true" />}
        title="Examples"
        description="Practical usage snippets to get you started."
      />
      <div
        className={cn(
          'grid gap-5',
          definition.examples.length > 1 ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
        )}
      >
        {definition.examples.map((example) => (
          <ExampleBox
            key={example.title}
            title={example.title}
            description={example.description}
            code={example.code}
            language={example.language ?? 'text'}
            variant={example.variant ?? 'default'}
          />
        ))}
      </div>
    </section>
  );
};

ExamplesSection.displayName = 'ExamplesSection';

export { ExamplesSection };
