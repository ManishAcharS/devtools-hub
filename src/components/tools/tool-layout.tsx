import React, { type ReactNode } from 'react';
import type { ToolDefinition } from '@/types';
import { cn } from '@/lib/utils';
import { getToolBreadcrumbItems } from '@/registry/metadata';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { ToolHeader } from '@/components/tools/tool-header';
import { ToolSidebar } from '@/components/tools/tool-sidebar';
import { ToolContent } from '@/components/tools/tool-content';
import { ToolFooter } from '@/components/tools/tool-footer';
import { ToolFaqSection } from '@/components/tools/tool-faq-section';
import { RelatedTools } from '@/components/tools/related-tools';

interface ToolLayoutProps {
  definition: ToolDefinition;
  relatedTools?: ToolDefinition[];
  content?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

const ToolLayout: React.FC<ToolLayoutProps> = ({
  definition,
  relatedTools,
  content,
  actions,
  className,
}) => {
  const breadcrumb = getToolBreadcrumbItems(definition);

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {breadcrumb.length > 0 && (
          <div className="mb-6">
            <Breadcrumb items={breadcrumb} />
          </div>
        )}

        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="shrink-0 lg:w-72">
            <ToolSidebar definition={definition} className="lg:sticky lg:top-24" />
          </aside>

          <div className={cn('min-w-0 flex-1', className)}>
            <ToolHeader definition={definition} actions={actions} className="mb-8" />

            <main>
              {content ?? <ToolContent definition={definition} />}
              <ToolFaqSection definition={definition} />
              <RelatedTools tools={relatedTools ?? []} />
            </main>

            <ToolFooter definition={definition} />
          </div>
        </div>
      </div>
    </div>
  );
};

ToolLayout.displayName = 'ToolLayout';

export { ToolLayout };
