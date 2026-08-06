import React from 'react';
import { Code2 } from 'lucide-react';
import type { ToolComponent, ToolDefinition } from '@/types';
import { Prose } from '@/components/shared/prose';
import { SectionHeading } from '@/components/shared/section-heading';
import { ExamplesSection } from '@/components/tools/examples-section';

interface ToolContentProps {
  definition: ToolDefinition;
  component?: ToolComponent;
  className?: string;
}

const ToolContent: React.FC<ToolContentProps> = ({ definition, component, className }) => {
  if (component) {
    const Component = component;
    return (
      <div className={className}>
        <Component definition={definition} />
      </div>
    );
  }

  return (
    <div className={className}>
      <Prose>
        <h2>About {definition.title}</h2>
        <p>{definition.description}</p>
      </Prose>

      {definition.examples.length > 0 && <ExamplesSection definition={definition} />}

      {definition.examples.length === 0 && (
        <div className="mt-12">
          <SectionHeading
            icon={<Code2 className="h-5 w-5" aria-hidden="true" />}
            title="Getting started"
            description="Examples are being added for this tool."
          />
        </div>
      )}
    </div>
  );
};

ToolContent.displayName = 'ToolContent';

export { ToolContent };
