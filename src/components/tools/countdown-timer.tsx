'use client';

import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Clock, Play, Pause, RotateCcw } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { SectionHeading } from '@/components/shared/section-heading';

const CountdownTimer: React.FC<ToolComponentProps> = () => {
  const [target, setTarget] = useState(() =>
    new Date(Date.now() + 60_000).toISOString().slice(0, 16)
  );
  const [running, setRunning] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const intervalRef = useRef<ReturnType<typeof setInterval> | number | undefined>(undefined);

  const remaining = useMemo(() => {
    const targetTime = new Date(target).getTime();
    if (Number.isNaN(targetTime)) return 0;
    return Math.max(0, targetTime - now);
  }, [target, now]);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
      return;
    }
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    };
  }, [running]);

  const formatMs = (ms: number) => {
    const days = Math.floor(ms / 86_400_000);
    const hours = Math.floor((ms % 86_400_000) / 3_600_000);
    const minutes = Math.floor((ms % 3_600_000) / 60_000);
    const seconds = Math.floor((ms % 60_000) / 1000);
    return { days, hours, minutes, seconds };
  };

  const { days, hours, minutes, seconds } = formatMs(remaining);

  const handleStart = () => setRunning(true);
  const handlePause = () => setRunning(false);
  const handleReset = () => setRunning(false);

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Clock className="h-6 w-6" aria-hidden="true" />}
        title="Countdown timer"
        description="Set a target date and time, then start the countdown."
      />
      <div className="border-border bg-card rounded-xl border p-5">
        <label
          htmlFor="target-time"
          className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
        >
          Target date & time
        </label>
        <input
          id="target-time"
          type="datetime-local"
          value={target}
          onChange={(event) => {
            setTarget(event.target.value);
            setRunning(false);
          }}
          className="border-border bg-background text-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
        />
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="flex flex-wrap items-center justify-center gap-4">
          {[
            { label: 'Days', value: days.toString().padStart(2, '0') },
            { label: 'Hours', value: hours.toString().padStart(2, '0') },
            { label: 'Minutes', value: minutes.toString().padStart(2, '0') },
            { label: 'Seconds', value: seconds.toString().padStart(2, '0') },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span className="font-mono text-4xl font-bold tabular-nums">{value}</span>
              <span className="text-muted-foreground text-xs tracking-wider uppercase">
                {label}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-center gap-3">
          {!running && remaining > 0 ? (
            <button
              type="button"
              onClick={handleStart}
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium"
            >
              <Play className="h-4 w-4" aria-hidden="true" />
              Start
            </button>
          ) : running ? (
            <button
              type="button"
              onClick={handlePause}
              className="border-border bg-background hover:bg-muted inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium"
            >
              <Pause className="h-4 w-4" aria-hidden="true" />
              Pause
            </button>
          ) : null}
          {remaining === 0 && (
            <span className="font-medium text-emerald-600 dark:text-emerald-400">
              Time&rsquo;s up!
            </span>
          )}
          {(running || remaining > 0) && (
            <button
              type="button"
              onClick={handleReset}
              className="border-border bg-background hover:bg-muted inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

CountdownTimer.displayName = 'CountdownTimer';

export { CountdownTimer };
