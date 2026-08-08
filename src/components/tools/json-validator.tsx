'use client';

import React, { useMemo, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { validateJson } from '@/lib/tools/json';
import { SectionHeading } from '@/components/shared/section-heading';
import { ValidatorPanel } from '@/components/tools/validator-panel';

const JsonValidator: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');

  const result = useMemo(() => {
    if (input.trim().length === 0) return null;
    return validateJson(input);
  }, [input]);

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<ShieldCheck className="h-6 w-6" aria-hidden="true" />}
        title="JSON validator"
        description="Check your JSON for syntax errors, trailing commas, and malformed values — with the exact line and column of the problem."
      />
      <ValidatorPanel
        inputId="json-validator-input"
        inputValue={input}
        onInputChange={setInput}
        placeholder="Paste a JSON document to validate…"
        inputLabel="JSON document"
        result={result}
        validMessage="This is valid JSON."
        invalidMessage="This document is not valid JSON."
      />
    </div>
  );
};

JsonValidator.displayName = 'JsonValidator';

export { JsonValidator };
