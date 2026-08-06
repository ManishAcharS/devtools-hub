'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NavigationItem } from '@/types';

interface MegaMenuProps {
  item: NavigationItem;
  isOpen: boolean;
  onClose: () => void;
}

const MegaMenu: React.FC<MegaMenuProps> = ({ item, isOpen, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelLeft, setPanelLeft] = useState(8);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const positionPanel = () => {
      const li = menuRef.current?.closest('li');
      const panel = panelRef.current;
      if (!li || !panel) return;
      const liRect = li.getBoundingClientRect();
      const width = panel.offsetWidth;
      const maxLeft = window.innerWidth - width - 8;
      setPanelLeft(Math.min(Math.max(liRect.left, 8), Math.max(maxLeft, 8)));
    };

    positionPanel();
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', positionPanel);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', positionPanel);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !item.megaMenu) return null;

  const { columns, featuredTools, featuredCategories } = item.megaMenu;
  const hasAside = !!(featuredTools?.length || featuredCategories?.length);
  const units = Math.min(columns.length, 3) + (hasAside ? 1 : 0);
  const widthRem = units === 1 ? 22 : units === 2 ? 28 : units * 16;

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label={`${item.label} menu`}
      className="fixed top-[54px] z-50"
      style={{ width: `min(calc(100vw - 2rem), ${widthRem}rem)`, left: panelLeft }}
    >
      <div
        ref={panelRef}
        className="animate-menu-enter border-border/60 bg-popover overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-2xl backdrop-saturate-150"
      >
        <div className="grid max-h-[70vh] grid-cols-1 gap-0 overflow-y-auto lg:grid-cols-4">
          <div className={cn('p-6', hasAside ? 'lg:col-span-3' : 'lg:col-span-4')}>
            <div
              className="grid grid-cols-1 gap-6"
              style={
                columns.length > 1
                  ? {
                      gridTemplateColumns: `repeat(${Math.min(columns.length, 3)}, minmax(0, 1fr))`,
                    }
                  : undefined
              }
            >
              {columns.map((column) => (
                <div key={column.title}>
                  <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
                    {column.title}
                  </p>
                  <ul className="space-y-1">
                    {column.items.map((menuItem) => (
                      <li key={menuItem.label}>
                        <Link
                          href={menuItem.href}
                          onClick={onClose}
                          className="hover-glow group hover:bg-muted flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors"
                        >
                          <span className="min-w-0 flex-1">
                            <span className="text-foreground group-hover:text-primary flex items-center gap-1.5 font-medium transition-colors">
                              {menuItem.label}
                              {menuItem.badge && (
                                <span className="bg-primary/10 text-primary inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase">
                                  <Sparkles className="h-2.5 w-2.5" aria-hidden="true" />
                                  {menuItem.badge}
                                </span>
                              )}
                            </span>
                            {menuItem.description && (
                              <span className="text-muted-foreground mt-0.5 block text-xs">
                                {menuItem.description}
                              </span>
                            )}
                          </span>
                          <ChevronRight
                            className="text-muted-foreground/50 group-hover:text-primary mt-0.5 h-3.5 w-3.5 transition-colors"
                            aria-hidden="true"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {(featuredTools || featuredCategories) && (
            <aside className="border-border bg-muted/30 border-l p-6 lg:col-span-1">
              {featuredTools && featuredTools.length > 0 && (
                <>
                  <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
                    Featured Tools
                  </p>
                  <ul className="mb-6 space-y-2">
                    {featuredTools.map((slug) => (
                      <li key={slug}>
                        <Link
                          href={`/tools/${slug}`}
                          onClick={onClose}
                          className="hover-glow text-foreground hover:bg-muted hover:text-primary block rounded-lg px-2.5 py-2 text-sm font-medium capitalize transition-colors"
                        >
                          {slug.replace(/-/g, ' ')}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {featuredCategories && featuredCategories.length > 0 && (
                <>
                  <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
                    Top Categories
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {featuredCategories.map((slug) => (
                      <Link
                        key={slug}
                        href={`/categories/${slug}`}
                        onClick={onClose}
                        className="hover-glow bg-primary/10 text-primary hover:bg-primary/20 rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors"
                      >
                        {slug.replace(/-/g, ' ')}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

MegaMenu.displayName = 'MegaMenu';

export { MegaMenu };
