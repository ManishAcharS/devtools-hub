'use client';

import React from 'react';
import { Fingerprint } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { md5HexString } from '@/lib/tools/hashing';
import { SectionHeading } from '@/components/shared/section-heading';
import { HashPanel } from '@/components/tools/hash-panel';

const Md5Generator: React.FC<ToolComponentProps> = () => {
  const compute = React.useCallback((text: string) => Promise.resolve(md5HexString(text)), []);
  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Fingerprint className="h-6 w-6" aria-hidden="true" />}
        title="MD5 generator"
        description="Compute the 128-bit MD5 checksum of any text. Everything runs locally — nothing is sent to a server."
      />
      <HashPanel algorithmName="MD5" compute={compute} />
    </div>
  );
};

Md5Generator.displayName = 'Md5Generator';

export { Md5Generator };
