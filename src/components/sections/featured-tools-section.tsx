import React from 'react';
import { TrendingUp } from 'lucide-react';
import { ToolCard } from '@/components/ui/tool-card';
import { SectionHeading } from '@/components/shared/section-heading';
import { getFeaturedTools } from '@/data';
import type { Tool } from '@/types';

interface FeaturedToolsSectionProps {
  tools?: Tool[];
  title?: string;
  description?: string;
}

const FeaturedToolsSection: React.FC<FeaturedToolsSectionProps> = ({
  tools = getFeaturedTools(4),
  title = 'Featured Tools',
  description = 'Hand-picked tools our community loves right now.',
}) => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        title={title}
        description={description}
        icon={<TrendingUp className="h-6 w-6" aria-hidden="true" />}
        actionLabel="View all"
        actionHref="/tools"
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
};

FeaturedToolsSection.displayName = 'FeaturedToolsSection';

export { FeaturedToolsSection };
