'use client';

import React, { useMemo, useState } from 'react';
import { CalendarClock } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { cn } from '@/lib/utils';
import {
  findOverlaps,
  formatOverlapWindow,
  shiftWindowToZone,
  workingHourSet,
  zoneOffsetMinutes,
  type TimeZoneOffset,
} from '@/lib/tools/meeting-planner';
import { SectionHeading } from '@/components/shared/section-heading';

const CURATED_ZONES: string[] = [
  'UTC',
  'Pacific/Honolulu',
  'America/Anchorage',
  'America/Los_Angeles',
  'America/Denver',
  'America/Phoenix',
  'America/Chicago',
  'America/New_York',
  'America/Toronto',
  'America/Sao_Paulo',
  'America/Buenos_Aires',
  'Atlantic/Reykjavik',
  'Europe/London',
  'Europe/Dublin',
  'Europe/Lisbon',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Madrid',
  'Europe/Rome',
  'Europe/Amsterdam',
  'Europe/Stockholm',
  'Europe/Copenhagen',
  'Europe/Warsaw',
  'Europe/Prague',
  'Europe/Athens',
  'Europe/Helsinki',
  'Europe/Moscow',
  'Europe/Istanbul',
  'Africa/Casablanca',
  'Africa/Cairo',
  'Africa/Lagos',
  'Africa/Nairobi',
  'Africa/Johannesburg',
  'Asia/Dubai',
  'Asia/Tehran',
  'Asia/Karachi',
  'Asia/Kolkata',
  'Asia/Dhaka',
  'Asia/Bangkok',
  'Asia/Jakarta',
  'Asia/Singapore',
  'Asia/Shanghai',
  'Asia/Hong_Kong',
  'Asia/Taipei',
  'Asia/Seoul',
  'Asia/Tokyo',
  'Australia/Perth',
  'Australia/Brisbane',
  'Australia/Sydney',
  'Australia/Adelaide',
  'Pacific/Auckland',
];

const DEFAULT_SELECTED: string[] = ['America/New_York', 'Europe/London', 'Asia/Tokyo'];

const HOURS = Array.from({ length: 24 }, (_, index) => index);

function browserTimeZone(): string {
  if (typeof Intl === 'undefined' || typeof Intl.DateTimeFormat !== 'function') return 'UTC';
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return CURATED_ZONES.includes(zone) ? zone : 'UTC';
  } catch {
    return 'UTC';
  }
}

function zoneShortName(zone: string, date: Date): string {
  try {
    return (
      new Intl.DateTimeFormat('en-US', {
        timeZone: zone,
        timeZoneName: 'short',
        hour: '2-digit',
      })
        .formatToParts(date)
        .find((part) => part.type === 'timeZoneName')?.value ?? zone
    );
  } catch {
    return zone;
  }
}

const TimezoneMeetingPlanner: React.FC<ToolComponentProps> = () => {
  const [localZone, setLocalZone] = useState(browserTimeZone);
  const [selected, setSelected] = useState<Set<string>>(new Set(DEFAULT_SELECTED));
  const [startHour, setStartHour] = useState(9);
  const [endHour, setEndHour] = useState(17);

  const offsets = useMemo(() => {
    const date = new Date();
    const entries: { zone: string; offset: number | null }[] = [
      localZone,
      ...Array.from(selected),
    ].map((zone) => ({ zone, offset: zoneOffsetMinutes(zone, date) }));
    return entries;
  }, [localZone, selected]);

  const hasInvalidOffset = offsets.some((entry) => entry.offset === null);

  const zones: TimeZoneOffset[] = useMemo(
    () =>
      offsets
        .filter((entry): entry is { zone: string; offset: number } => entry.offset !== null)
        .map((entry) => ({ name: entry.zone, offsetMinutes: entry.offset })),
    [offsets]
  );

  const overlapUtc = useMemo(
    () => findOverlaps(zones, startHour, endHour),
    [zones, startHour, endHour]
  );

  const referenceOffset = useMemo(() => {
    const entry = offsets.find((candidate) => candidate.zone === localZone);
    return entry?.offset ?? 0;
  }, [offsets, localZone]);

  const overlapRefWindows = useMemo(
    () => overlapUtc.flatMap((window) => shiftWindowToZone(window, 0, referenceOffset)),
    [overlapUtc, referenceOffset]
  );

  const overlapHours = useMemo(() => {
    const set = new Set<number>();
    for (const [start, end] of overlapRefWindows) {
      for (let hour = Math.ceil(start); hour < end; hour += 1) {
        set.add(((hour % 24) + 24) % 24);
      }
    }
    return set;
  }, [overlapRefWindows]);

  const referenceZone: TimeZoneOffset = { name: localZone, offsetMinutes: referenceOffset };

  const toggleZone = (zone: string) => {
    setSelected((previous) => {
      const next = new Set(previous);
      if (next.has(zone)) {
        next.delete(zone);
      } else {
        next.add(zone);
      }
      return next;
    });
  };

  const inputClass =
    'border-border bg-background text-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-3 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none';

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<CalendarClock className="h-6 w-6" aria-hidden="true" />}
        title="Time zone meeting planner"
        description="Find overlapping working hours across multiple time zones. Pick your local zone, add participants, and see every overlapping window on a shared hour grid."
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label
              htmlFor="planner-local-zone"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Your time zone
            </label>
            <select
              id="planner-local-zone"
              value={localZone}
              onChange={(event) => setLocalZone(event.target.value)}
              className={inputClass}
            >
              {CURATED_ZONES.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="planner-start"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Working day starts
            </label>
            <select
              id="planner-start"
              value={startHour}
              onChange={(event) => setStartHour(Number(event.target.value))}
              className={inputClass}
            >
              {HOURS.map((hour) => (
                <option key={hour} value={hour}>
                  {hour}:00
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="planner-end"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Working day ends
            </label>
            <select
              id="planner-end"
              value={endHour}
              onChange={(event) => setEndHour(Number(event.target.value))}
              className={inputClass}
            >
              {HOURS.map((hour) => (
                <option key={hour} value={hour}>
                  {hour}:00
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Participants ({selected.size})
          </p>
          <div className="mt-3 grid gap-x-6 gap-y-1.5 sm:grid-cols-2 lg:grid-cols-3">
            {CURATED_ZONES.map((zone) => (
              <label key={zone} className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selected.has(zone)}
                  onChange={() => toggleZone(zone)}
                  className="accent-primary h-4 w-4"
                />
                <span
                  className={cn(
                    'truncate',
                    selected.has(zone) ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {zone.replaceAll('_', ' ')}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {hasInvalidOffset ? (
        <p className="text-sm text-red-600 dark:text-red-400">
          One of the selected zones could not be resolved. Try a different selection.
        </p>
      ) : (
        <>
          <div className="border-border bg-card rounded-xl border p-5">
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Overlapping windows ({localZone.replaceAll('_', ' ')} time)
            </p>
            {overlapRefWindows.length === 0 ? (
              <p className="mt-3 text-sm text-amber-600 dark:text-amber-400">
                No overlap found for the selected working hours. Try widening the working window or
                removing a zone.
              </p>
            ) : (
              <ul className="mt-3 space-y-1">
                {overlapRefWindows.map(([start, end]) => (
                  <li key={`${start}-${end}`} className="font-mono text-sm font-medium">
                    {formatOverlapWindow({ startHour: start, endHour: end })}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-border bg-card overflow-x-auto rounded-xl border p-5">
            <table className="w-full border-separate border-spacing-0.5 text-center text-[10px]">
              <thead>
                <tr>
                  <th className="text-muted-foreground bg-card sticky left-0 pr-2 text-left font-semibold uppercase">
                    Zone
                  </th>
                  {HOURS.map((hour) => (
                    <th key={hour} className="text-muted-foreground min-w-7 px-0.5 font-medium">
                      {hour}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {zones.map((zone) => {
                  const working = workingHourSet(zone, referenceZone, startHour, endHour);
                  return (
                    <tr key={zone.name}>
                      <td className="text-muted-foreground bg-card sticky left-0 max-w-40 truncate pr-2 text-left font-medium">
                        {zoneShortName(zone.name, new Date())} ·{' '}
                        {zone.name.split('/').pop()?.replaceAll('_', ' ')}
                      </td>
                      {HOURS.map((hour) => {
                        const isWorking = working.has(hour);
                        const isOverlap = overlapHours.has(hour);
                        return (
                          <td
                            key={hour}
                            title={`${zone.name} ${hour}:00`}
                            className={cn(
                              'h-4 rounded',
                              isOverlap && isWorking
                                ? 'bg-primary'
                                : isWorking
                                  ? 'bg-primary/20'
                                  : 'bg-muted'
                            )}
                          />
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-4 text-xs">
              <span className="inline-flex items-center gap-1.5">
                <span className="bg-primary inline-block h-3 w-3 rounded" /> overlap
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="bg-primary/20 inline-block h-3 w-3 rounded" /> working
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="bg-muted inline-block h-3 w-3 rounded" /> outside
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

TimezoneMeetingPlanner.displayName = 'TimezoneMeetingPlanner';

export { TimezoneMeetingPlanner };
