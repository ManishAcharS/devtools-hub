'use client';

import React, { useMemo, useState } from 'react';
import { Network, RefreshCw } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';
import { DownloadButton } from '@/components/shared/download-button';

type MacFormat = 'colon' | 'hyphen' | 'dot';

function generateMacAddresses(
  format: MacFormat,
  count: number,
  unicast: boolean,
  locallyAdministered: boolean,
  nonce: number
): string[] {
  const nonceByte = nonce & 0xff;
  return Array.from({ length: count }, () => {
    const bytes = new Uint8Array(6);
    crypto.getRandomValues(bytes);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = (bytes[i] ?? 0) ^ nonceByte;
    }
    bytes[0] = (bytes[0] ?? 0) & 0xfc;
    bytes[0] = (bytes[0] ?? 0) | (locallyAdministered ? 0x02 : 0);
    bytes[0] = (bytes[0] ?? 0) | (unicast ? 0x00 : 0x01);
    const octets = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0'));
    if (format === 'colon') return octets.join(':');
    if (format === 'hyphen') return octets.join('-');
    return `${octets[0]}${octets[1]}.${octets[2]}${octets[3]}.${octets[4]}${octets[5]}`;
  });
}

const MAC_ADDRESS_DEFAULT_COUNT = 3;

const MacAddressGenerator: React.FC<ToolComponentProps> = () => {
  const [format, setFormat] = useState<MacFormat>('colon');
  const [count, setCount] = useState(MAC_ADDRESS_DEFAULT_COUNT);
  const [unicast, setUnicast] = useState(true);
  const [locallyAdministered, setLocallyAdministered] = useState(false);
  const [nonce, setNonce] = useState(0);
  const addresses = useMemo(
    () => generateMacAddresses(format, count, unicast, locallyAdministered, nonce),
    [format, count, unicast, locallyAdministered, nonce]
  );

  const regenerate = () => {
    setNonce((value) => value + 1);
  };

  const allText = addresses.join('\n') + (addresses.length > 0 ? '\n' : '');
  const firstOctet = (locallyAdministered ? 0x02 : 0) | (unicast ? 0x00 : 0x01);

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Network className="h-6 w-6" aria-hidden="true" />}
        title="MAC address generator"
        description="Generate random MAC addresses in colon, hyphen, or Cisco dot notation, controlling the unicast/multicast and locally administered bits."
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-muted-foreground mb-1 block text-xs font-semibold tracking-wider uppercase">
              Format
            </label>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { value: 'colon', label: 'aa:bb:cc:dd:ee:ff' },
                  { value: 'hyphen', label: 'aa-bb-cc-dd-ee-ff' },
                  { value: 'dot', label: 'aabb.ccdd.eeff' },
                ] as const
              ).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormat(option.value)}
                  className={
                    format === option.value
                      ? 'bg-primary text-primary-foreground border-primary rounded-lg border px-3 py-1.5 text-xs font-medium'
                      : 'border-border bg-background hover:bg-muted text-foreground rounded-lg border px-3 py-1.5 text-xs font-medium'
                  }
                  aria-pressed={format === option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label
              htmlFor="mac-count"
              className="text-muted-foreground mb-1 block text-xs font-semibold tracking-wider uppercase"
            >
              Count: {count}
            </label>
            <input
              id="mac-count"
              type="range"
              min={1}
              max={20}
              value={count}
              onChange={(event) => setCount(Number(event.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={unicast}
              onChange={(event) => setUnicast(event.target.checked)}
              className="accent-primary h-4 w-4"
            />
            Unicast {unicast ? '(I/G bit 0)' : '(I/G bit 1)'}
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={locallyAdministered}
              onChange={(event) => setLocallyAdministered(event.target.checked)}
              className="accent-primary h-4 w-4"
            />
            Locally administered {locallyAdministered ? '(U/L bit 1)' : '(U/L bit 0)'}
          </label>
          <button
            type="button"
            onClick={regenerate}
            className="border-border bg-background hover:bg-muted text-foreground inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Regenerate
          </button>
        </div>
        <p className="text-muted-foreground mt-3 text-xs">
          First octet: 0x{firstOctet.toString(16).padStart(2, '0')} — the I/G bit is{' '}
          {unicast ? '0 (unicast)' : '1 (multicast)'} and the U/L bit is{' '}
          {locallyAdministered ? '1 (locally administered)' : '0 (universally administered)'}.
        </p>
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            {addresses.length} MAC addresses
          </p>
          <div className="flex flex-wrap gap-2">
            <CopyButton value={allText} label="Copy all" />
            <DownloadButton content={allText} fileName="mac-addresses.txt" label="Download" />
          </div>
        </div>
        <ul className="mt-4 space-y-2">
          {addresses.map((address) => (
            <li
              key={address}
              className="border-border bg-background flex items-center justify-between gap-3 rounded-lg border px-4 py-2"
            >
              <code className="text-foreground font-mono text-sm break-all">{address}</code>
              <CopyButton value={address} label="Copy" size="sm" iconOnly />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

MacAddressGenerator.displayName = 'MacAddressGenerator';

export { MacAddressGenerator };
