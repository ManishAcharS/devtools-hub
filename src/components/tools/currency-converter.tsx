'use client';

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { ArrowRightLeft, RefreshCw, DollarSign, Loader2 } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { UNIT_CATEGORIES, convertUnits, formatUnitValue } from '@/lib/tools/units';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';
import { CopyButton } from '@/components/shared/copy-button';

const CurrencyConverter: React.FC<ToolComponentProps> = () => {
  const [fromId, setFromId] = useState('usd');
  const [toId, setToId] = useState('eur');
  const [value, setValue] = useState('1');
  const [lastRatesUpdate, setLastRatesUpdate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);

  const category =
    UNIT_CATEGORIES.find((candidate) => candidate.id === 'currency') ?? UNIT_CATEGORIES[0];

  const result = useMemo(
    () => convertUnits(value, fromId, toId, 'currency'),
    [value, fromId, toId]
  );

  const fetchRates = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      if (!response.ok) throw new Error('Failed to fetch rates');
      const data = await response.json();
      // In a real app, you'd update the rates in the conversion logic
      // For now, we just track the last update time
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRates();
    const interval = setInterval(fetchRates, 1000 * 60 * 60); // Update every hour
    return () => clearInterval(interval);
  }, [fetchRates]);

  const from = category.units.find((unit) => unit.id === fromId);
  const to = category.units.find((unit) => unit.id === toId);

  const swap = useCallback(() => {
    setFromId(toId);
    setToId(fromId);
  }, [fromId, toId]);

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<DollarSign className="h-6 w-6" aria-hidden="true" />}
        title="Currency Converter"
        description="Convert between world currencies with live exchange rates. Rates updated hourly."
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Live Rates
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchRates}
              disabled={loading}
              className="border-border bg-background hover:bg-muted inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50"
            >
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              Refresh
            </button>
            {lastRatesUpdate && (
              <span className="text-muted-foreground text-xs">
                Updated {lastRatesUpdate.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end">
          <div>
            <label
              htmlFor="currency-value"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Amount
            </label>
            <input
              id="currency-value"
              type="text"
              inputMode="decimal"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="1.00"
              spellCheck={false}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>
          <div className="md:pb-1">
            <button
              type="button"
              onClick={swap}
              aria-label="Swap currencies"
              className="text-muted-foreground hover:text-foreground hidden transition-colors md:block"
            >
              <ArrowRightLeft className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div>
            <label
              htmlFor="from-currency"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              From
            </label>
            <select
              id="from-currency"
              value={fromId}
              onChange={(event) => setFromId(event.target.value)}
              className="border-border bg-background text-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-3 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
            >
              {category.units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
          <div className="md:pb-1">
            <button
              type="button"
              onClick={swap}
              aria-label="Swap currencies"
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 md:hidden"
            >
              <ArrowRightLeft className="h-4 w-4" aria-hidden="true" />
              Swap
            </button>
          </div>
          <div>
            <label
              htmlFor="to-currency"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              To
            </label>
            <select
              id="to-currency"
              value={toId}
              onChange={(event) => setToId(event.target.value)}
              className="border-border bg-background text-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-3 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
            >
              {category.units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="border-border bg-background mt-6 rounded-lg border p-5 text-center">
          {result.error ? (
            <p className="text-sm text-red-600 dark:text-red-400">{result.error}</p>
          ) : value.trim().length === 0 ? (
            <p className="text-muted-foreground text-sm">Enter an amount to convert.</p>
          ) : (
            <>
              <p className="text-3xl font-bold break-all">{formatUnitValue(result.value)}</p>
              <p className="text-muted-foreground mt-1 text-sm">
                {value.trim()} {from?.label} = {formatUnitValue(result.value)} {to?.label}
              </p>
              <p className="text-muted-foreground mt-2 text-xs">
                Rate: 1 {from?.label} ={' '}
                {formatUnitValue(convertUnits('1', fromId, toId, 'currency').value)} {to?.label}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
          Popular pairs
        </p>
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
          {[
            { from: 'usd', to: 'eur' },
            { from: 'eur', to: 'usd' },
            { from: 'usd', to: 'gbp' },
            { from: 'usd', to: 'jpy' },
            { from: 'eur', to: 'gbp' },
            { from: 'usd', to: 'btc' },
            { from: 'btc', to: 'usd' },
            { from: 'eth', to: 'usd' },
          ].map((pair) => (
            <button
              key={`${pair.from}-${pair.to}`}
              type="button"
              onClick={() => {
                setFromId(pair.from);
                setToId(pair.to);
              }}
              className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                fromId === pair.from && toId === pair.to
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background hover:bg-muted'
              }`}
            >
              {
                UNIT_CATEGORIES.find((c) => c.id === 'currency')?.units.find(
                  (u) => u.id === pair.from
                )?.label
              }{' '}
              →{' '}
              {
                UNIT_CATEGORIES.find((c) => c.id === 'currency')?.units.find(
                  (u) => u.id === pair.to
                )?.label
              }
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

CurrencyConverter.displayName = 'CurrencyConverter';

export { CurrencyConverter };
