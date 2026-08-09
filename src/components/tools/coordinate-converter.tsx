'use client';

import React, { useMemo, useState } from 'react';
import { MapPin } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { cn } from '@/lib/utils';
import {
  decimalToDms,
  dmsToDecimal,
  formatDecimal,
  formatDms,
  parseDecimalCoordinate,
  type Hemisphere,
} from '@/lib/tools/geo';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';

type Mode = 'decimal-to-dms' | 'dms-to-decimal';

interface DmsInputs {
  latDegrees: string;
  latMinutes: string;
  latSeconds: string;
  latHemisphere: Hemisphere;
  lonDegrees: string;
  lonMinutes: string;
  lonSeconds: string;
  lonHemisphere: Hemisphere;
}

const INITIAL_DMS: DmsInputs = {
  latDegrees: '37',
  latMinutes: '46',
  latSeconds: '29.64',
  latHemisphere: 'N',
  lonDegrees: '122',
  lonMinutes: '25',
  lonSeconds: '9.84',
  lonHemisphere: 'W',
};

const CoordinateConverter: React.FC<ToolComponentProps> = () => {
  const [mode, setMode] = useState<Mode>('decimal-to-dms');
  const [latValue, setLatValue] = useState('37.7749');
  const [lonValue, setLonValue] = useState('-122.4194');
  const [dms, setDms] = useState<DmsInputs>(INITIAL_DMS);

  const decimalResult = useMemo(() => {
    const parsed = parseDecimalCoordinate(latValue, lonValue);
    if (parsed.error) return { error: parsed.error, latDms: null, lonDms: null, output: '' };
    const latDms = decimalToDms(parsed.latitude as number, true);
    const lonDms = decimalToDms(parsed.longitude as number, false);
    return {
      error: null,
      latDms,
      lonDms,
      output: `${formatDms(latDms, 2)}, ${formatDms(lonDms, 2)}`,
    };
  }, [latValue, lonValue]);

  const dmsResult = useMemo(() => {
    const lat = dmsToDecimal(
      Number(dms.latDegrees || '0'),
      Number(dms.latMinutes || '0'),
      Number(dms.latSeconds || '0'),
      dms.latHemisphere
    );
    const lon = dmsToDecimal(
      Number(dms.lonDegrees || '0'),
      Number(dms.lonMinutes || '0'),
      Number(dms.lonSeconds || '0'),
      dms.lonHemisphere
    );
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return { error: 'The entered DMS values are out of range.', output: '' };
    }
    return { error: null, output: formatDecimal(lat, lon) };
  }, [dms]);

  const inputClass =
    'border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none';
  const selectClass =
    'border-border bg-background text-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-3 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none';

  const updateDms = (key: keyof DmsInputs, next: string) => {
    setDms((previous) => ({ ...previous, [key]: next }));
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<MapPin className="h-6 w-6" aria-hidden="true" />}
        title="Coordinate converter"
        description="Convert geographic coordinates between decimal degrees and degrees-minutes-seconds (DMS). Negative values map to south and west hemispheres automatically."
      />
      <div className="flex flex-wrap gap-2">
        {(
          [
            { id: 'decimal-to-dms', label: 'Decimal → DMS' },
            { id: 'dms-to-decimal', label: 'DMS → Decimal' },
          ] as { id: Mode; label: string }[]
        ).map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setMode(option.id)}
            aria-pressed={mode === option.id}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
              mode === option.id
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-background text-muted-foreground hover:text-foreground'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        {mode === 'decimal-to-dms' ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="lat-decimal"
                className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
              >
                Latitude
              </label>
              <input
                id="lat-decimal"
                type="text"
                inputMode="decimal"
                value={latValue}
                onChange={(event) => setLatValue(event.target.value)}
                placeholder="37.7749"
                spellCheck={false}
                className={inputClass}
              />
            </div>
            <div>
              <label
                htmlFor="lon-decimal"
                className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
              >
                Longitude
              </label>
              <input
                id="lon-decimal"
                type="text"
                inputMode="decimal"
                value={lonValue}
                onChange={(event) => setLonValue(event.target.value)}
                placeholder="-122.4194"
                spellCheck={false}
                className={inputClass}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-[1fr_1fr_1fr_80px] items-end gap-3">
              <div>
                <label
                  htmlFor="lat-dms-degrees"
                  className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
                >
                  Lat degrees
                </label>
                <input
                  id="lat-dms-degrees"
                  type="text"
                  inputMode="decimal"
                  value={dms.latDegrees}
                  onChange={(event) => updateDms('latDegrees', event.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="lat-dms-minutes"
                  className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
                >
                  Minutes
                </label>
                <input
                  id="lat-dms-minutes"
                  type="text"
                  inputMode="decimal"
                  value={dms.latMinutes}
                  onChange={(event) => updateDms('latMinutes', event.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="lat-dms-seconds"
                  className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
                >
                  Seconds
                </label>
                <input
                  id="lat-dms-seconds"
                  type="text"
                  inputMode="decimal"
                  value={dms.latSeconds}
                  onChange={(event) => updateDms('latSeconds', event.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="lat-dms-hemisphere"
                  className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
                >
                  Hemi
                </label>
                <select
                  id="lat-dms-hemisphere"
                  value={dms.latHemisphere}
                  onChange={(event) => updateDms('latHemisphere', event.target.value)}
                  className={selectClass}
                >
                  <option value="N">N</option>
                  <option value="S">S</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-[1fr_1fr_1fr_80px] items-end gap-3">
              <div>
                <label
                  htmlFor="lon-dms-degrees"
                  className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
                >
                  Lon degrees
                </label>
                <input
                  id="lon-dms-degrees"
                  type="text"
                  inputMode="decimal"
                  value={dms.lonDegrees}
                  onChange={(event) => updateDms('lonDegrees', event.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="lon-dms-minutes"
                  className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
                >
                  Minutes
                </label>
                <input
                  id="lon-dms-minutes"
                  type="text"
                  inputMode="decimal"
                  value={dms.lonMinutes}
                  onChange={(event) => updateDms('lonMinutes', event.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="lon-dms-seconds"
                  className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
                >
                  Seconds
                </label>
                <input
                  id="lon-dms-seconds"
                  type="text"
                  inputMode="decimal"
                  value={dms.lonSeconds}
                  onChange={(event) => updateDms('lonSeconds', event.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="lon-dms-hemisphere"
                  className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
                >
                  Hemi
                </label>
                <select
                  id="lon-dms-hemisphere"
                  value={dms.lonHemisphere}
                  onChange={(event) => updateDms('lonHemisphere', event.target.value)}
                  className={selectClass}
                >
                  <option value="E">E</option>
                  <option value="W">W</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="border-border bg-background mt-6 rounded-lg border p-5">
          {mode === 'decimal-to-dms' ? (
            decimalResult.error ? (
              <p className="text-sm text-red-600 dark:text-red-400">{decimalResult.error}</p>
            ) : (
              <div className="space-y-3">
                {decimalResult.latDms && decimalResult.lonDms && (
                  <>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                        DMS
                      </p>
                      <CopyButton value={decimalResult.output} label="Copy" size="sm" />
                    </div>
                    <p className="font-mono text-lg break-all">
                      {formatDms(decimalResult.latDms, 2)}
                    </p>
                    <p className="font-mono text-lg break-all">
                      {formatDms(decimalResult.lonDms, 2)}
                    </p>
                  </>
                )}
              </div>
            )
          ) : dmsResult.error ? (
            <p className="text-sm text-red-600 dark:text-red-400">{dmsResult.error}</p>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  Decimal degrees
                </p>
                <CopyButton value={dmsResult.output} label="Copy" size="sm" />
              </div>
              <p className="font-mono text-lg break-all">{dmsResult.output}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

CoordinateConverter.displayName = 'CoordinateConverter';

export { CoordinateConverter };
