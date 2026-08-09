'use client';

import { useCallback, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/use-storage';

const HISTORY_KEY = 'toolboxfordevs-search-history';
const MAX_HISTORY = 8;

export function useSearchHistory() {
  const [history, setHistory] = useLocalStorage<string[]>(HISTORY_KEY, []);

  const addToHistory = useCallback(
    (query: string) => {
      const trimmed = query.trim();
      if (!trimmed) return;
      setHistory((prev) => {
        const next = [
          trimmed,
          ...prev.filter((entry) => entry.toLowerCase() !== trimmed.toLowerCase()),
        ];
        return next.slice(0, MAX_HISTORY);
      });
    },
    [setHistory]
  );

  const removeFromHistory = useCallback(
    (query: string) => {
      setHistory((prev) => prev.filter((entry) => entry.toLowerCase() !== query.toLowerCase()));
    },
    [setHistory]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  const normalizedHistory = useMemo(
    () => Array.from(new Set(history.map((entry) => entry.trim()).filter(Boolean))),
    [history]
  );

  return {
    history: normalizedHistory,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
}
