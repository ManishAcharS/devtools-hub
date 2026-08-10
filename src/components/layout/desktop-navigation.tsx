'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mainNavigation } from '@/config/site';
import { MegaMenu } from '@/components/layout/mega-menu';
import type { NavigationItem } from '@/types';

interface DesktopNavigationProps {
  className?: string;
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({ className }) => {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const navRef = useRef<HTMLElement>(null);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpenMenu(null);
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (item: NavigationItem): boolean => {
    if (item.href === '/') return pathname === '/';
    if (item.children || item.megaMenu) {
      return pathname.startsWith(item.href);
    }
    return pathname === item.href || pathname.startsWith(item.href + '/');
  };

  return (
    <nav ref={navRef} aria-label="Primary navigation" className={cn('hidden lg:block', className)}>
      <ul className="flex items-center gap-1">
        {mainNavigation.map((item) => {
          const active = isActive(item);
          const hasMegaMenu = !!item.megaMenu;
          const isOpen = openMenu === item.label;

          return (
            <li key={item.label} className="relative">
              <div
                onMouseEnter={() => hasMegaMenu && setOpenMenu(item.label)}
                onMouseLeave={() => hasMegaMenu && setOpenMenu(null)}
              >
                <Link
                  href={item.href}
                  aria-expanded={isOpen}
                  aria-haspopup={hasMegaMenu ? 'menu' : undefined}
                  onMouseEnter={() => !hasMegaMenu && undefined}
                  className={cn(
                    'hover-glow inline-flex items-center gap-1 rounded-lg px-2.5 py-2 text-sm font-medium whitespace-nowrap transition-colors',
                    active
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  {item.label}
                  {hasMegaMenu && (
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform duration-200',
                        isOpen && 'rotate-180'
                      )}
                      aria-hidden="true"
                    />
                  )}
                </Link>
                {hasMegaMenu && (
                  <MegaMenu item={item} isOpen={isOpen} onClose={() => setOpenMenu(null)} />
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

DesktopNavigation.displayName = 'DesktopNavigation';

export { DesktopNavigation };
