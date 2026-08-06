'use client';

import React, { type ReactNode } from 'react';
import { ThemeProvider as BaseThemeProvider } from '@/hooks/use-theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  return <BaseThemeProvider>{children}</BaseThemeProvider>;
}
