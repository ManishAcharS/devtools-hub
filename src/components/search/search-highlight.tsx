'use client';

import React from 'react';
import { getHighlightSegments } from '@/search/highlight';
import { cn } from '@/lib/utils';

interface SearchHighlightProps {
  text: string;
  tokens: string[];
  className?: string;
  markClassName?: string;
}

const SearchHighlight: React.FC<SearchHighlightProps> = ({
  text,
  tokens,
  className,
  markClassName,
}) => {
  if (!tokens || tokens.length === 0) {
    return <span className={className}>{text}</span>;
  }

  const segments = getHighlightSegments(text, tokens);

  return (
    <span className={className}>
      {segments.map((segment, index) =>
        segment.match ? (
          <mark
            key={index}
            className={cn('bg-primary/20 text-foreground rounded-[3px] px-0.5', markClassName)}
          >
            {segment.text}
          </mark>
        ) : (
          <React.Fragment key={index}>{segment.text}</React.Fragment>
        )
      )}
    </span>
  );
};

export { SearchHighlight };
