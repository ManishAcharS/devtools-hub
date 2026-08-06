import React from 'react';
import { Globe, Github, Star } from 'lucide-react';
import type { ToolDefinition } from '@/types';
import { ToolIcon } from '@/components/shared/tool-icon';
import { CopyButton } from '@/components/shared/copy-button';
import { DownloadButton } from '@/components/shared/download-button';
import { ShareButton } from '@/components/shared/share-button';
import { Button } from '@/components/ui/button';

interface ToolHeaderProps {
  definition: ToolDefinition;
  actions?: React.ReactNode;
  className?: string;
}

const pricingLabels: Record<ToolDefinition['pricing'], string> = {
  free: 'Free',
  freemium: 'Freemium',
  paid: 'Paid',
  'open-source': 'Open Source',
};

const pricingStyles: Record<ToolDefinition['pricing'], string> = {
  free: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  freemium: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  paid: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  'open-source': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
};

const ToolHeader: React.FC<ToolHeaderProps> = ({ definition, actions, className }) => {
  return (
    <header className={className}>
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="flex min-w-0 items-start gap-5">
          <div className="hidden sm:block">
            <ToolIcon name={definition.title} icon={definition.icon} size="lg" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase">
                {definition.category.replace(/-/g, ' ')}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${pricingStyles[definition.pricing]}`}
              >
                {pricingLabels[definition.pricing]}
              </span>
              {definition.featured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400">
                  <Star className="h-3 w-3 fill-current" aria-hidden="true" />
                  Featured
                </span>
              )}
            </div>
            <h1 className="text-foreground mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              {definition.title}
            </h1>
            <p className="text-muted-foreground mt-3 max-w-2xl text-pretty">
              {definition.description}
            </p>
            {definition.rating !== undefined && (
              <p className="text-muted-foreground mt-3 flex items-center gap-1.5 text-sm">
                <Star className="h-4 w-4 fill-current text-yellow-500" aria-hidden="true" />
                <span className="text-foreground font-medium">{definition.rating.toFixed(1)}</span>
                {definition.reviewsCount !== undefined && (
                  <span>({definition.reviewsCount.toLocaleString()} reviews)</span>
                )}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {definition.website && (
            <Button variant="outline" size="sm" asChild>
              <a href={definition.website} target="_blank" rel="noopener noreferrer">
                <Globe className="h-4 w-4" aria-hidden="true" />
                Website
              </a>
            </Button>
          )}
          {definition.repository && (
            <Button variant="outline" size="sm" asChild>
              <a href={definition.repository} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" aria-hidden="true" />
                Repo
              </a>
            </Button>
          )}
          {actions}
          {definition.copyValue && (
            <CopyButton value={definition.copyValue} label="Copy" size="sm" />
          )}
          {definition.download && (
            <DownloadButton
              url={definition.download.url}
              fileName={definition.download.fileName}
              content={definition.download.content}
              contentType={definition.download.contentType}
              label="Download"
              size="sm"
            />
          )}
          <ShareButton
            url={`/tools/${definition.slug}`}
            title={definition.title}
            iconOnly
            aria-label="Share this tool"
          />
        </div>
      </div>
    </header>
  );
};

ToolHeader.displayName = 'ToolHeader';

export { ToolHeader };
