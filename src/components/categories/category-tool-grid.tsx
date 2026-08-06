import React from 'react';
import Link from 'next/link';
import { ToolCard } from '@/components/ui/tool-card';
import type { Tool } from '@/types';

interface ToolGridSectionProps {
  id?: string;
  title: string;
  description?: string;
  tools: Tool[];
}

const ToolGridSection: React.FC<ToolGridSectionProps> = ({ id, title, description, tools }) => {
  if (tools.length === 0) return null;
  return (
    <section aria-labelledby={id ?? title.replace(/\s+/g, '-').toLowerCase()} className="mt-12">
      <h2 id={id} className="text-2xl font-bold tracking-tight">
        {title}
      </h2>
      {description && <p className="text-muted-foreground mt-2 mb-6 text-pretty">{description}</p>}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="focus-visible:ring-ring rounded-xl focus-visible:ring-2 focus-visible:outline-none"
          >
            <ToolCard tool={tool} />
          </Link>
        ))}
      </div>
    </section>
  );
};

ToolGridSection.displayName = 'ToolGridSection';

interface CategoryToolGridProps {
  tools: Tool[];
  title?: string;
  id?: string;
}

const CategoryToolGrid: React.FC<CategoryToolGridProps> = ({ tools, title, id = 'tools' }) => (
  <ToolGridSection id={id} title={title ?? `All tools (${tools.length})`} tools={tools} />
);

CategoryToolGrid.displayName = 'CategoryToolGrid';

export { ToolGridSection, CategoryToolGrid };
