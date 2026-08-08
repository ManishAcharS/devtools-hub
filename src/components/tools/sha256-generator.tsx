'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { sha256Hex } from '@/lib/tools/hashing';
import { SectionHeading } from '@/components/shared/section-heading';
import { HashPanel } from '@/components/tools/hash-panel';

const Sha256Generator: React.FC<ToolComponentProps> = () => {
  const compute = React.useCallback((text: string) => sha256Hex(text), []);
  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<ShieldCheck className="h-6 w-6" aria-hidden="true" />}
        title="SHA-256 generator"
        description="Compute the SHA-256 digest of any text using WebCrypto. Ideal for checksums, commit hashes, and API signing inputs."
      />
      <HashPanel algorithmName="SHA-256" compute={compute} />
    </div>
  );
};

Sha256Generator.displayName = 'Sha256Generator';

export { Sha256Generator };
