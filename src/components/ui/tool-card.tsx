import React, { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Star, Globe, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ToolIcon } from '@/components/shared/tool-icon';
import type { Tool } from '@/types';

interface ToolCardProps extends HTMLAttributes<HTMLDivElement> {
  tool: Tool;
  variant?: 'default' | 'compact' | 'featured';
  showCategory?: boolean;
  showRating?: boolean;
}

const ToolCard = forwardRef<HTMLDivElement, ToolCardProps>(
  (
    { className, tool, variant = 'default', showCategory = true, showRating = true, ...props },
    ref
  ) => {
    const pricingColors = {
      free: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      freemium: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      paid: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      'open-source': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    };

    const pricingLabels = {
      free: 'Free',
      freemium: 'Freemium',
      paid: 'Paid',
      'open-source': 'Open Source',
    };

    if (variant === 'compact') {
      return (
        <div
          ref={ref}
          className={cn(
            'bg-card border-border hover:border-primary/50 flex items-center gap-4 rounded-xl border p-4 transition-all duration-200 hover:shadow-md',
            className
          )}
          {...props}
        >
          <ToolIcon name={tool.title} icon={tool.icon} size="sm" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-foreground truncate font-semibold">{tool.title}</h3>
            </div>
            <p className="text-muted-foreground mt-1 truncate text-sm">{tool.shortDescription}</p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap',
                  pricingColors[tool.pricing]
                )}
              >
                {pricingLabels[tool.pricing]}
              </span>
              {showCategory && tool.category && (
                <span className="text-muted-foreground bg-muted inline-flex items-center rounded-full px-2 py-0.5 text-xs whitespace-nowrap">
                  {tool.category.replace(/-/g, ' ')}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {tool.website && (
              <a
                href={tool.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary hover:bg-muted rounded-md p-1 transition-colors"
                aria-label={`${tool.title} website`}
              >
                <Globe className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
            {tool.repository && (
              <a
                href={tool.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary hover:bg-muted rounded-md p-1 transition-colors"
                aria-label={`${tool.title} repository`}
              >
                <Github className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      );
    }
    if (variant === 'featured') {
      return (
        <Card
          ref={ref}
          padding="none"
          className={cn('hover-lift hover:border-primary/30 flex h-full flex-col', className)}
          {...props}
        >
          <CardContent className="flex flex-1 flex-col p-4">
            <div className="mb-2.5 flex items-start justify-between gap-3">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <ToolIcon name={tool.title} icon={tool.icon} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-foreground text-xl font-bold text-balance">{tool.title}</h3>
                  </div>
                  {showCategory && tool.category && (
                    <span className="text-muted-foreground text-sm">
                      {tool.category.replace(/-/g, ' ')}
                    </span>
                  )}
                </div>
              </div>
              <span
                className={cn(
                  'flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap',
                  pricingColors[tool.pricing]
                )}
              >
                {pricingLabels[tool.pricing]}
              </span>
            </div>
            <p className="text-muted-foreground mb-2.5 flex-1">{tool.description}</p>
            {showRating && tool.rating !== undefined && (
              <p className="text-muted-foreground mb-2 flex items-center gap-1.5 text-sm">
                <Star className="h-4 w-4 fill-current text-yellow-500" aria-hidden="true" />
                <span className="text-foreground font-medium">{tool.rating.toFixed(1)}</span>
                {tool.reviewsCount !== undefined && (
                  <span>({tool.reviewsCount.toLocaleString()} reviews)</span>
                )}
              </p>
            )}
            <div className="mb-2.5 flex flex-wrap gap-1.5">
              {tool.tags.slice(0, 5).map((tag) => (
                <span
                  key={tag}
                  className="text-muted-foreground bg-muted inline-flex items-center rounded-full px-2 py-0.5 text-xs whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
              {tool.tags.length > 5 && (
                <span className="text-muted-foreground bg-muted inline-flex items-center rounded-full px-2 py-0.5 text-xs whitespace-nowrap">
                  +{tool.tags.length - 5} more
                </span>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2 px-4 pt-0 pb-4">
            {tool.website && (
              <Button variant="outline" size="sm" asChild>
                <a href={tool.website} target="_blank" rel="noopener noreferrer">
                  <Globe className="mr-2 h-4 w-4" aria-hidden="true" />
                  Website
                </a>
              </Button>
            )}
            {tool.repository && (
              <Button variant="ghost" size="sm" asChild>
                <a href={tool.repository} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" aria-hidden="true" />
                  Repo
                </a>
              </Button>
            )}
          </CardFooter>
        </Card>
      );
    }

    return (
      <Card
        ref={ref}
        padding="none"
        className={cn('hover-lift hover:border-primary/30 flex h-full flex-col', className)}
        {...props}
      >
        <CardContent className="flex flex-1 flex-col p-4">
          <div className="mb-2.5 flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <ToolIcon name={tool.title} icon={tool.icon} size="sm" />
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <h3 className="text-foreground truncate font-semibold">{tool.title}</h3>
                </div>
              </div>
            </div>
            <span
              className={cn(
                'flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap',
                pricingColors[tool.pricing]
              )}
            >
              {pricingLabels[tool.pricing]}
            </span>
          </div>
          <p className="text-muted-foreground mb-3 line-clamp-2 flex-1 text-sm">
            {tool.shortDescription}
          </p>
          {showRating && tool.rating !== undefined && (
            <p className="text-muted-foreground mb-2.5 flex items-center gap-1.5 text-xs">
              <Star className="h-3.5 w-3.5 fill-current text-yellow-500" aria-hidden="true" />
              <span className="text-foreground font-medium">{tool.rating.toFixed(1)}</span>
            </p>
          )}
          <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
            {tool.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-muted-foreground bg-muted inline-flex items-center rounded-full px-2 py-0.5 text-xs whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
        {tool.website && (
          <CardFooter className="px-4 pt-0 pb-4">
            <Button variant="ghost" size="sm" asChild className="w-full">
              <a href={tool.website} target="_blank" rel="noopener noreferrer">
                <Globe className="mr-1.5 h-4 w-4" aria-hidden="true" />
                Visit website
              </a>
            </Button>
          </CardFooter>
        )}
      </Card>
    );
  }
);

ToolCard.displayName = 'ToolCard';

export { ToolCard };
