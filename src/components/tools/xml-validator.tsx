'use client';

import React, { useMemo, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { validateXml } from '@/lib/tools/xml';
import { SectionHeading } from '@/components/shared/section-heading';
import { ValidatorPanel } from '@/components/tools/validator-panel';

const XmlValidator: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');

  const result = useMemo(() => {
    if (input.trim().length === 0) return null;
    return validateXml(input);
  }, [input]);

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<ShieldCheck className="h-6 w-6" aria-hidden="true" />}
        title="XML validator"
        description="Check that your XML is well-formed, and get the exact line and column of any syntax error."
      />
      <ValidatorPanel
        inputId="xml-validator-input"
        inputValue={input}
        onInputChange={setInput}
        placeholder="Paste an XML document to validate…"
        inputLabel="XML document"
        result={result}
        validMessage="This is well-formed XML."
        invalidMessage="This document is not well-formed XML."
      />
    </div>
  );
};

XmlValidator.displayName = 'XmlValidator';

export { XmlValidator };
