import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ShinyButtonProps {
  href?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Primary CTA button with a tilted shine that continuously sweeps across
 * the surface, plus a soft glow that deepens on hover.
 */
const ShinyButton: React.FC<ShinyButtonProps> = ({ href, className, children }) => {
  const classes = cn(
    'group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-8 text-base font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/40 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    className
  );

  const content = (
    <>
      {children}
      <span
        aria-hidden="true"
        className="animate-shine-slide pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
      />
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={classes}>
      {content}
    </button>
  );
};

ShinyButton.displayName = 'ShinyButton';

export { ShinyButton };
