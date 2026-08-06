import React, { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ProseProps {
  children: ReactNode;
  className?: string;
}

const Prose: React.FC<ProseProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'prose-slate max-w-none text-pretty',
        '[&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight',
        '[&_h3]:text-foreground [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold',
        '[&_p]:text-muted-foreground [&_p]:my-4 [&_p]:leading-relaxed',
        '[&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6',
        '[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6',
        '[&_li]:text-muted-foreground [&_li]:leading-relaxed',
        '[&_a]:text-primary [&_a:hover]:text-primary/80 [&_a]:underline [&_a]:underline-offset-4',
        '[&_strong]:text-foreground',
        '[&_blockquote]:border-primary/30 [&_blockquote]:text-muted-foreground [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:italic',
        '[&_hr]:border-border [&_hr]:my-8',
        className
      )}
    >
      {children}
    </div>
  );
};

Prose.displayName = 'Prose';

export { Prose };
