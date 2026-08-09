'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Github, Star, Search, Command } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/layout/logo';
import { DesktopNavigation } from '@/components/layout/desktop-navigation';
import { MobileNavigation } from '@/components/layout/mobile-navigation';
import { SearchDialog } from '@/components/search/search-dialog';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Button } from '@/components/ui/button';
import { useScrollDirection } from '@/hooks/use-interaction';
import { siteConfig } from '@/config/site';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);
  const scrollDirection = useScrollDirection();
  const [isScrolled, setIsScrolled] = useState(false);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
    setSearchOpen(false);
  }

  const openSearch = useCallback(() => setSearchOpen(true), []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
        return;
      }
      if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey) {
        const target = event.target as HTMLElement | null;
        const tag = target?.tagName ?? '';
        if (tag !== 'INPUT' && tag !== 'TEXTAREA' && !target?.isContentEditable) {
          event.preventDefault();
          setSearchOpen(true);
        }
      }
    };
    document.addEventListener('keydown', handleShortcut);
    return () => document.removeEventListener('keydown', handleShortcut);
  }, []);

  return (
    <>
      <header
        className={cn(
          'border-border/60 bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-xl transition-all duration-300',
          isScrolled && 'shadow-sm',
          scrollDirection === 'down' && isScrolled && '-translate-y-full',
          className
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg p-2 transition-colors lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>
              <Logo />
            </div>

            <DesktopNavigation className="hidden lg:flex" />

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openSearch}
                className="border-border bg-background text-muted-foreground hover:text-foreground focus-within:border-primary/50 focus-within:ring-primary/20 hidden h-9 w-64 items-center gap-3 rounded-xl border px-3 text-sm transition-all focus-within:ring-2 focus-visible:outline-none md:flex"
                aria-label="Open search"
              >
                <Search className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                <span className="flex-1 truncate text-left">Search...</span>
                <kbd className="bg-muted flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium">
                  <Command className="h-3 w-3" aria-hidden="true" />K
                </kbd>
              </button>
              <ThemeToggle />
              <Button variant="outline" size="icon-sm" asChild className="hidden sm:inline-flex">
                <a
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Toolbox for Devs on GitHub"
                >
                  <Github className="h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
              <Button size="sm" className="hidden md:inline-flex">
                <Star className="h-4 w-4" aria-hidden="true" />
                Star us
              </Button>
              <Link
                href="/search"
                className="text-muted-foreground hover:text-foreground hover:bg-muted inline-flex items-center justify-center rounded-lg p-2 transition-colors md:hidden"
                aria-label="Search"
              >
                <span className="sr-only">Search</span>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <MobileNavigation open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

Header.displayName = 'Header';

export { Header };
