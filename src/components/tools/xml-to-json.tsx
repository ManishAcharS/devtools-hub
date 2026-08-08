'use client';

import React, { useMemo, useState } from 'react';
import { Braces } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { xmlToJson } from '@/lib/tools/xml';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

const XmlToJson: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');

  const result = useMemo(() => xmlToJson(input), [input]);

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Braces className="h-6 w-6" aria-hidden="true" />}
        title="XML to JSON converter"
        description="Convert an XML document into a structured JSON object, preserving element names, attributes, and text."
      />
      <TransformPanel
        inputId="xml-json-input"
        inputValue={input}
        onInputChange={setInput}
        inputLabel="XML"
        inputPlaceholder="Paste an XML document here…"
        outputValue={result.value}
        outputLabel="JSON"
        outputPlaceholder="Converted JSON will appear here…"
        fileName="converted.json"
        error={result.error}
        stats={result.stats}
      />
    </div>
  );
};

XmlToJson.displayName = 'XmlToJson';

export { XmlToJson };
