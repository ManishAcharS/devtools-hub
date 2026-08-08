'use client';

import React from 'react';
import { Lock } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { sha512Hex } from '@/lib/tools/hashing';
import { SectionHeading } from '@/components/shared/section-heading';
import { HashPanel } from '@/components/tools/hash-panel';

const Sha512Generator: React.FC<ToolComponentProps> = () => {
  const compute = React.useCallback((text: string) => sha512Hex(text), []);
  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Lock className="h-6 w-6" aria-hidden="true" />}
        title="SHA-512 generator"
        description="Generate the 512-bit SHA-512 digest of any text locally with WebCrypto. Stronger than SHA-256 for long-lived integrity checks."
      />
      <HashPanel algorithmName="SHA-512" compute={compute} />
    </div>
  );
};

Sha512Generator.displayName = 'Sha512Generator';

export { Sha512Generator };
