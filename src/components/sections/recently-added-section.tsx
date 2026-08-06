import React from 'react';
import { Clock3 } from 'lucide-react';
import { ToolCard } from '@/components/ui/tool-card';
import { SectionHeading } from '@/components/shared/section-heading';
import { getRecentlyAddedTools } from '@/data';
import type { Tool } from '@/types';

interface RecentlyAddedSectionProps {
  tools?: Tool[];
  title?: string;
  description?: string;
}

const RecentlyAddedSection: React.FC<RecentlyAddedSectionProps> = ({
  tools = getRecentlyAddedTools(3),
  title = 'Recently Added',
  description = 'Fresh additions to the directory, straight from the community.',
}) => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        title={title}
        description={description}
        icon={<Clock3 className="h-6 w-6" aria-hidden="true" />}
        actionLabel="View all"
        actionHref="/tools"
      />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} variant="featured" />
        ))}
      </div>
    </section>
  );
};

RecentlyAddedSection.displayName = 'RecentlyAddedSection';

export { RecentlyAddedSection };
