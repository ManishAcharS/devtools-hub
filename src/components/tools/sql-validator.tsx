'use client';

import React, { useMemo, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { validateSql } from '@/lib/tools/sql';
import { SectionHeading } from '@/components/shared/section-heading';
import { ValidatorPanel } from '@/components/tools/validator-panel';

const SqlValidator: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');

  const result = useMemo(() => {
    if (input.trim().length === 0) return null;
    return validateSql(input);
  }, [input]);

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<ShieldCheck className="h-6 w-6" aria-hidden="true" />}
        title="SQL validator"
        description="Catch unclosed strings, mismatched parentheses, and invalid statement starters before your query hits the database."
      />
      <ValidatorPanel
        inputId="sql-validator-input"
        inputValue={input}
        onInputChange={setInput}
        placeholder="Paste a SQL statement to validate…"
        inputLabel="SQL statement"
        result={result}
        validMessage="This statement looks structurally valid."
        invalidMessage="This statement has structural problems."
      />
    </div>
  );
};

SqlValidator.displayName = 'SqlValidator';

export { SqlValidator };
