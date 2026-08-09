'use client';

import React, { useMemo, useState } from 'react';
import { Dices, History } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { cn } from '@/lib/utils';
import { SectionHeading } from '@/components/shared/section-heading';

const DICE_TYPES = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'] as const;

type DiceType = (typeof DICE_TYPES)[number] | 'custom';

interface RollRecord {
  label: string;
  rolls: number[];
  total: number;
}

const MAX_HISTORY = 20;

const DiceRoller: React.FC<ToolComponentProps> = () => {
  const [diceType, setDiceType] = useState<DiceType>('d20');
  const [customSides, setCustomSides] = useState('12');
  const [count, setCount] = useState('1');
  const [current, setCurrent] = useState<RollRecord | null>(null);
  const [history, setHistory] = useState<RollRecord[]>([]);
  const [rolling, setRolling] = useState(false);
  const [rollSeq, setRollSeq] = useState(0);

  const sides = useMemo(() => {
    if (diceType === 'custom') {
      const value = Number.parseInt(customSides, 10);
      if (Number.isNaN(value)) return 6;
      return Math.min(9999, Math.max(2, value));
    }
    return Number.parseInt(diceType.slice(1), 10);
  }, [diceType, customSides]);

  const diceCount = useMemo(() => {
    const value = Number.parseInt(count, 10);
    if (Number.isNaN(value)) return 1;
    return Math.min(10, Math.max(1, value));
  }, [count]);

  const diceLabel = diceType === 'custom' ? `d${sides}` : diceType;

  const handleRoll = () => {
    if (rolling) return;
    setRolling(true);
    setCurrent(null);
    window.setTimeout(() => {
      const rolls = Array.from({ length: diceCount }, () => Math.floor(Math.random() * sides) + 1);
      const record: RollRecord = {
        label: diceLabel,
        rolls,
        total: rolls.reduce((sum, value) => sum + value, 0),
      };
      setCurrent(record);
      setHistory((prev) => [record, ...prev].slice(0, MAX_HISTORY));
      setRollSeq((prev) => prev + 1);
      setRolling(false);
    }, 450);
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Dices className="h-6 w-6" aria-hidden="true" />}
        title="Dice roller"
        description="Roll polyhedral dice from d4 to d100, or use custom n-sided dice — with animated results and a rolling history of the last 20 throws."
      />
      <div className="border-border bg-card rounded-xl border p-5">
        <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          Dice type
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {DICE_TYPES.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setDiceType(option)}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
                diceType === option
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border hover:bg-muted'
              )}
              aria-pressed={diceType === option}
            >
              {option}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setDiceType('custom')}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
              diceType === 'custom'
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border hover:bg-muted'
            )}
            aria-pressed={diceType === 'custom'}
          >
            Custom
          </button>
          {diceType === 'custom' && (
            <input
              type="number"
              min={2}
              max={9999}
              value={customSides}
              onChange={(event) => setCustomSides(event.target.value)}
              aria-label="Custom sides"
              className="border-border bg-background text-foreground focus-visible:ring-primary w-24 rounded-lg border px-3 py-1.5 text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
          )}
        </div>
        <div className="mt-5 flex flex-wrap items-end gap-4">
          <div>
            <label
              htmlFor="dice-count"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Number of dice (1-10)
            </label>
            <input
              id="dice-count"
              type="number"
              min={1}
              max={10}
              value={count}
              onChange={(event) => setCount(event.target.value)}
              className="border-border bg-background text-foreground focus-visible:ring-primary mt-2 w-28 rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={handleRoll}
            disabled={rolling}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6 py-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            {rolling ? 'Rolling…' : `Roll ${diceCount}${diceLabel}`}
          </button>
        </div>
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          Result
        </p>
        <div className="bg-muted/40 mt-3 flex min-h-28 flex-col items-center justify-center gap-3 rounded-lg p-5">
          {rolling ? (
            <div
              className="border-primary/60 bg-background h-16 w-16 animate-pulse rounded-xl border-2"
              aria-hidden="true"
            />
          ) : current ? (
            <div key={rollSeq} className="dice-pop flex flex-col items-center gap-3">
              <div className="flex flex-wrap items-center justify-center gap-2">
                {current.rolls.map((roll, index) => (
                  <span
                    key={index}
                    className="bg-card text-foreground border-border flex h-12 w-12 items-center justify-center rounded-xl border text-lg font-bold shadow-sm"
                  >
                    {roll}
                  </span>
                ))}
              </div>
              {current.rolls.length > 1 && (
                <p className="text-foreground text-lg font-semibold">Total: {current.total}</p>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm italic">
              Roll the dice to see the result here…
            </p>
          )}
        </div>
        <style>{`
          @keyframes dicePop {
            0% { transform: scale(0.6) rotate(-8deg); opacity: 0; }
            60% { transform: scale(1.08) rotate(3deg); opacity: 1; }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
          }
          .dice-pop > div, .dice-pop > p {
            animation: dicePop 0.35s ease-out;
          }
        `}</style>
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="flex items-center gap-2">
          <History className="text-muted-foreground h-4 w-4" aria-hidden="true" />
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            History (last {MAX_HISTORY})
          </p>
        </div>
        {history.length === 0 ? (
          <p className="text-muted-foreground mt-3 text-sm italic">
            No rolls yet — history appears here.
          </p>
        ) : (
          <ul className="divide-border mt-3 divide-y">
            {history.map((record, index) => (
              <li
                key={`${index}-${record.total}`}
                className="flex items-center justify-between gap-3 py-2 text-sm"
              >
                <span className="text-muted-foreground font-mono text-xs">
                  {record.label} × {record.rolls.length}
                </span>
                <span className="font-mono">
                  {record.rolls.join(' + ')} = <span className="font-bold">{record.total}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

DiceRoller.displayName = 'DiceRoller';

export { DiceRoller };
