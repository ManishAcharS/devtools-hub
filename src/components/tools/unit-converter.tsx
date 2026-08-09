'use client';

import React, { useMemo, useState } from 'react';
import { Ruler } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { UNIT_CATEGORIES, convertUnits, formatUnitValue } from '@/lib/tools/units';
import { SectionHeading } from '@/components/shared/section-heading';

const UnitConverter: React.FC<ToolComponentProps> = () => {
  const [categoryId, setCategoryId] = useState(UNIT_CATEGORIES[0].id);
  const [fromId, setFromId] = useState(UNIT_CATEGORIES[0].units[2].id);
  const [toId, setToId] = useState(UNIT_CATEGORIES[0].units[3].id);
  const [value, setValue] = useState('1');

  const category =
    UNIT_CATEGORIES.find((candidate) => candidate.id === categoryId) ?? UNIT_CATEGORIES[0];

  // Stable conversion function for React Compiler
  const doConvert = (val: string, from: string, to: string, cat: string) =>
    convertUnits(val, from, to, cat);

  const result = useMemo(
    () => doConvert(value, fromId, toId, categoryId),
    [value, fromId, toId, categoryId]
  );

  const selectCategory = (nextCategoryId: string) => {
    const nextCategory = UNIT_CATEGORIES.find((candidate) => candidate.id === nextCategoryId);
    if (!nextCategory) return;
    setCategoryId(nextCategoryId);
    setFromId(nextCategory.units[1].id);
    setToId(nextCategory.units[2].id);
  };

  const from = category.units.find((unit) => unit.id === fromId);
  const to = category.units.find((unit) => unit.id === toId);

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Ruler className="h-6 w-6" aria-hidden="true" />}
        title="Unit converter"
        description="Convert between length, weight, data size, temperature, and speed units instantly."
      />

      <div className="flex flex-wrap gap-2">
        {UNIT_CATEGORIES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => selectCategory(item.id)}
            aria-pressed={categoryId === item.id}
            className={`inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              categoryId === item.id
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-background text-muted-foreground hover:text-foreground'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end">
          <div>
            <label
              htmlFor="unit-value"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Value
            </label>
            <input
              id="unit-value"
              type="text"
              inputMode="decimal"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="1"
              spellCheck={false}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>
          <div className="md:pb-1">
            <span className="text-muted-foreground hidden text-2xl md:block">→</span>
          </div>
          <div>
            <label
              htmlFor="from-unit"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              From
            </label>
            <select
              id="from-unit"
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
            <span className="text-muted-foreground hidden text-2xl md:block">→</span>
          </div>
          <div>
            <label
              htmlFor="to-unit"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              To
            </label>
            <select
              id="to-unit"
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
            <p className="text-muted-foreground text-sm">Enter a value to convert.</p>
          ) : (
            <>
              <p className="text-3xl font-bold break-all">{formatUnitValue(result.value)}</p>
              <p className="text-muted-foreground mt-1 text-sm">
                {value.trim()} {from?.label} = {formatUnitValue(result.value)} {to?.label}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

UnitConverter.displayName = 'UnitConverter';

export { UnitConverter };
