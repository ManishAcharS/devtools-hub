import React from 'react';
import { CalendarDays, Flag, Info } from 'lucide-react';
import type { ToolDefinition } from '@/types';
import { siteConfig } from '@/config/site';

interface ToolFooterProps {
  definition: ToolDefinition;
  className?: string;
}

const ToolFooter: React.FC<ToolFooterProps> = ({ definition, className }) => {
  return (
    <footer className={`border-border mt-12 border-t pt-6 ${className ?? ''}`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-muted-foreground flex items-center gap-2 text-sm">
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
          Last updated{' '}
          {new Date(definition.updatedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <a
            href={`${siteConfig.links.github}/issues/new`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary inline-flex items-center gap-1.5 transition-colors"
          >
            <Flag className="h-4 w-4" aria-hidden="true" />
            Report an issue
          </a>
          <a
            href={`mailto:${siteConfig.author.email}?subject=Update%20request%3A%20${encodeURIComponent(definition.title)}`}
            className="text-muted-foreground hover:text-primary inline-flex items-center gap-1.5 transition-colors"
          >
            <Info className="h-4 w-4" aria-hidden="true" />
            Suggest an update
          </a>
        </div>
      </div>
    </footer>
  );
};

ToolFooter.displayName = 'ToolFooter';

export { ToolFooter };
