'use client';

import React from 'react';
import { FileKey } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { sha1Hex } from '@/lib/tools/hashing';
import { SectionHeading } from '@/components/shared/section-heading';
import { HashPanel } from '@/components/tools/hash-panel';

const Sha1Generator: React.FC<ToolComponentProps> = () => {
  const compute = React.useCallback((text: string) => sha1Hex(text), []);
  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<FileKey className="h-6 w-6" aria-hidden="true" />}
        title="SHA-1 generator"
        description="Generate the 160-bit SHA-1 digest of any text with the browser's native WebCrypto — no data leaves your machine."
      />
      <HashPanel algorithmName="SHA-1" compute={compute} />
    </div>
  );
};

Sha1Generator.displayName = 'Sha1Generator';

export { Sha1Generator };
