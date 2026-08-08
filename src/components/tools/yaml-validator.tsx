'use client';

import React, { useMemo, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { validateYaml } from '@/lib/tools/yaml';
import { SectionHeading } from '@/components/shared/section-heading';
import { ValidatorPanel } from '@/components/tools/validator-panel';

const YamlValidator: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');

  const result = useMemo(() => {
    if (input.trim().length === 0) return null;
    return validateYaml(input);
  }, [input]);

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<ShieldCheck className="h-6 w-6" aria-hidden="true" />}
        title="YAML validator"
        description="Check indentation, quoting, and structure — the usual culprits behind broken configuration files."
      />
      <ValidatorPanel
        inputId="yaml-validator-input"
        inputValue={input}
        onInputChange={setInput}
        placeholder="Paste a YAML document to validate…"
        inputLabel="YAML document"
        result={result}
        validMessage="This is valid YAML."
        invalidMessage="This document is not valid YAML."
      />
    </div>
  );
};

YamlValidator.displayName = 'YamlValidator';

export { YamlValidator };
