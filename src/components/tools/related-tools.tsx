import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ToolDefinition } from '@/types';
import { ToolCard } from '@/components/ui/tool-card';
import { SectionHeading } from '@/components/shared/section-heading';

interface RelatedToolsProps {
  tools: ToolDefinition[];
  className?: string;
}

const RelatedTools: React.FC<RelatedToolsProps> = ({ tools, className }) => {
  if (tools.length === 0) return null;

  return (
    <section className={`mt-12 ${className ?? ''}`} aria-labelledby="related-tools-heading">
      <SectionHeading
        title="Related Tools"
        description="Tools that solve similar problems or share a stack."
        actionLabel="View all tools"
        actionHref="/tools"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            href={`/tools/${tool.slug}`}
            className="group focus-visible:ring-ring rounded-xl focus-visible:ring-2 focus-visible:outline-none"
          >
            <ToolCard tool={tool} variant="compact" />
          </Link>
        ))}
      </div>
      <p className="mt-4">
        <Link
          href="/tools"
          className="text-primary hover:text-primary/80 inline-flex items-center gap-1.5 text-sm font-medium"
        >
          Browse the full directory
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </p>
    </section>
  );
};

RelatedTools.displayName = 'RelatedTools';

export { RelatedTools };
