'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, X, ExternalLink, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mainNavigation } from '@/config/site';
import { useLockBody } from '@/hooks/use-interaction';
import type { NavigationItem } from '@/types';

interface MobileNavigationProps {
  open: boolean;
  onClose: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ open, onClose }) => {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [prevOpen, setPrevOpen] = useState(open);

  if (prevOpen !== open) {
    setPrevOpen(open);
    if (open) {
      setExpandedItems(new Set());
    }
  }

  useLockBody(open);

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  const isActive = (item: NavigationItem): boolean => {
    if (item.href === '/') return pathname === '/';
    return pathname === item.href || pathname.startsWith(item.href + '/');
  };

  const renderItem = (item: NavigationItem) => {
    const hasChildren = !!item.children || !!item.megaMenu;
    const expanded = expandedItems.has(item.label);
    const active = isActive(item);

    return (
      <li key={item.label}>
        {hasChildren ? (
          <>
            <button
              onClick={() => toggleExpanded(item.label)}
              aria-expanded={expanded}
              className={cn(
                'hover-glow flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                active ? 'text-primary bg-primary/10' : 'text-foreground hover:bg-muted'
              )}
            >
              {item.label}
              <ChevronDown
                className={cn(
                  'text-muted-foreground h-4 w-4 transition-transform duration-200',
                  expanded && 'rotate-180'
                )}
                aria-hidden="true"
              />
            </button>
            {expanded && (
              <ul className="space-y-0.5 pb-2 pl-4">
                {item.megaMenu?.columns.flatMap((column) =>
                  column.items.map((child) => (
                    <li key={child.label}>
                      <Link
                        href={child.href}
                        onClick={onClose}
                        className="hover-glow text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm transition-colors"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))
                )}
                {item.children?.map((child) => (
                  <li key={child.label}>
                    <Link
                      href={child.href}
                      onClick={onClose}
                      className="hover-glow text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm transition-colors"
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <Link
            href={item.href}
            onClick={onClose}
            className={cn(
              'hover-glow flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors',
              active ? 'text-primary bg-primary/10' : 'text-foreground hover:bg-muted'
            )}
          >
            {item.label}
          </Link>
        )}
      </li>
    );
  };

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-200 lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={cn(
          'border-border bg-background fixed inset-y-0 right-0 z-50 w-80 max-w-[85vw] border-l shadow-2xl backdrop-blur-2xl backdrop-saturate-150 transition-transform duration-300 lg:hidden',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-label="Mobile navigation"
      >
        <div className="border-border flex items-center justify-between border-b p-4">
          <span className="text-foreground flex items-center gap-2 font-bold">
            <span className="from-primary to-accent flex items-center justify-center rounded-lg bg-gradient-to-br p-1.5 text-white">
              <Wrench className="h-4 w-4" aria-hidden="true" />
            </span>
            Toolbox<span className="text-muted-foreground"> for </span>
            <span className="text-primary">Devs</span>
          </span>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg p-2 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <nav className="h-[calc(100%-73px)] overflow-y-auto py-3">
          <ul className="space-y-0.5">{mainNavigation.map(renderItem)}</ul>
          <div className="border-border mt-4 border-t px-4 pt-4">
            <Link
              href="/search"
              onClick={onClose}
              className="hover-glow text-foreground hover:bg-muted flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors"
            >
              Search
            </Link>
            <a
              href="https://github.com/ManishAcharS/toolboxfordevs"
              target="_blank"
              rel="noopener noreferrer"
              className="hover-glow text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors"
            >
              GitHub
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </nav>
      </aside>
    </>
  );
};

MobileNavigation.displayName = 'MobileNavigation';

export { MobileNavigation };
