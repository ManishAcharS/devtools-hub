'use client';

import React, { useMemo, useState } from 'react';
import { HardDrive } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import {
  FILE_SIZE_UNITS,
  convertFileSize,
  formatFileSizeValue,
  listFileSizes,
  type FileSizeUnit,
} from '@/lib/tools/units-file';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';

const FileSizeConverter: React.FC<ToolComponentProps> = () => {
  const [value, setValue] = useState('2048');
  const [from, setFrom] = useState<FileSizeUnit>('MB');
  const [to, setTo] = useState<FileSizeUnit>('GiB');

  const parsed = useMemo(() => {
    const trimmed = value.trim();
    if (trimmed.length === 0) return null;
    const number = Number(trimmed);
    if (!Number.isFinite(number) || number < 0) return null;
    return number;
  }, [value]);

  const result = useMemo(
    () => (parsed === null ? null : convertFileSize(parsed, from, to)),
    [parsed, from, to]
  );

  const rows = useMemo(() => (parsed === null ? [] : listFileSizes(parsed, from)), [parsed, from]);

  const decimalUnits = FILE_SIZE_UNITS.filter((unit) => unit === 'B' || !unit.endsWith('iB'));
  const binaryUnits = FILE_SIZE_UNITS.filter((unit) => unit === 'B' || unit.endsWith('iB'));

  const inputClass =
    'border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none';

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<HardDrive className="h-6 w-6" aria-hidden="true" />}
        title="File size converter"
        description="Convert file sizes between bytes, KB, MB, GB, TB, and PB using both decimal (1000) and binary (1024) bases, with a full table of every unit."
      />
      <div className="border-border bg-card rounded-xl border p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="file-size-value"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Value
            </label>
            <input
              id="file-size-value"
              type="text"
              inputMode="decimal"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="2048"
              spellCheck={false}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="file-size-from"
                className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
              >
                From
              </label>
              <select
                id="file-size-from"
                value={from}
                onChange={(event) => setFrom(event.target.value as FileSizeUnit)}
                className={inputClass}
              >
                {decimalUnits.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
                {binaryUnits
                  .filter((unit) => unit !== 'B')
                  .map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="file-size-to"
                className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
              >
                To
              </label>
              <select
                id="file-size-to"
                value={to}
                onChange={(event) => setTo(event.target.value as FileSizeUnit)}
                className={inputClass}
              >
                {decimalUnits.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
                {binaryUnits
                  .filter((unit) => unit !== 'B')
                  .map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        <div className="border-border bg-background mt-6 rounded-lg border p-5 text-center">
          {parsed === null ? (
            <p className="text-muted-foreground text-sm">
              {value.trim().length === 0
                ? 'Enter a value to convert.'
                : 'Enter a non-negative number.'}
            </p>
          ) : result === null ? (
            <p className="text-sm text-red-600 dark:text-red-400">Conversion failed.</p>
          ) : (
            <>
              <p className="text-3xl font-bold break-all">{formatFileSizeValue(result)}</p>
              <p className="text-muted-foreground mt-1 text-sm">
                {formatFileSizeValue(parsed)} {from} = {formatFileSizeValue(result)} {to}
              </p>
            </>
          )}
        </div>
      </div>

      {rows.length > 0 && (
        <div className="border-border bg-card rounded-xl border p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              All units
            </p>
            <p className="text-muted-foreground text-xs">
              Decimal base 1000 (KB, MB, GB) vs binary base 1024 (KiB, MiB, GiB)
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground text-left text-xs tracking-wider uppercase">
                  <th className="pr-4 pb-2 font-semibold">Unit</th>
                  <th className="pr-4 pb-2 font-semibold">Value</th>
                  <th className="pr-4 pb-2 font-semibold">Base</th>
                  <th className="pb-2 text-right font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.unit} className="border-border border-t">
                    <td className="py-2 pr-4 font-mono font-semibold">{row.unit}</td>
                    <td className="text-foreground py-2 pr-4 font-mono">{row.formatted}</td>
                    <td className="text-muted-foreground py-2 pr-4 text-xs">
                      {row.unit === 'B' ? '—' : row.unit.endsWith('iB') ? 'binary' : 'decimal'}
                    </td>
                    <td className="py-2 text-right">
                      <CopyButton
                        value={`${row.formatted} ${row.unit}`}
                        label="Copy"
                        size="sm"
                        iconOnly
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

FileSizeConverter.displayName = 'FileSizeConverter';

export { FileSizeConverter };
