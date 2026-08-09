'use client';

import React, { useMemo, useState } from 'react';
import { FileSpreadsheet, Download, Table, Upload, ArrowRightLeft } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import * as XLSX from 'xlsx';
import { SectionHeading } from '@/components/shared/section-heading';
import { FileDropzone } from '@/components/tools/file-dropzone';
import { DownloadButton } from '@/components/shared/download-button';

const CsvToExcel: React.FC<ToolComponentProps> = () => {
  const [csvInput, setCsvInput] = useState('');
  const [delimiter, setDelimiter] = useState(',');
  const [output, setOutput] = useState<Uint8Array | null>(null);
  const [fileName, setFileName] = useState('converted.xlsx');
  const [sheetName, setSheetName] = useState('Sheet1');
  const [keepTypes, setKeepTypes] = useState(true);

  const handleFile = (files: File[]) => {
    if (files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => setCsvInput(e.target?.result as string);
      reader.readAsText(files[0]);
    }
  };

  const convert = () => {
    try {
      const workbook = XLSX.utils.book_new();
      // Parse CSV manually
      const lines = csvInput.split('\n').filter((line) => line.trim());
      const data = lines.map((line) => {
        // Simple CSV parsing - handle quoted fields
        const cells: string[] = [];
        let cell = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
              cell += '"';
              i++;
            } else {
              inQuotes = !inQuotes;
            }
          } else if (char === delimiter && !inQuotes) {
            cells.push(cell);
            cell = '';
          } else {
            cell += char;
          }
        }
        cells.push(cell);
        return cells;
      });
      const worksheet = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      const xlsx = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      setOutput(new Uint8Array(xlsx));
    } catch (error) {
      console.error('CSV to Excel error:', error);
      alert(`Conversion failed: ${(error as Error).message}`);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<FileSpreadsheet className="h-6 w-6" aria-hidden="true" />}
        title="CSV to Excel converter"
        description="Convert CSV data to Excel (.xlsx) format with automatic type detection."
      />
      <div className="border-border bg-card rounded-xl border p-5">
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <FileDropzone onFiles={handleFile} accept=".csv,text/csv" maxFiles={1} />
          <div className="flex items-center gap-4">
            <div>
              <label className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase">
                Delimiter
              </label>
              <select
                value={delimiter}
                onChange={(e) => setDelimiter(e.target.value)}
                className="border-border bg-background text-foreground focus-visible:ring-primary mt-1 w-32 rounded-lg border px-2 py-1.5 text-sm focus-visible:ring-2 focus-visible:outline-none"
              >
                <option value=",">Comma (,)</option>
                <option value=";">Semicolon (;)</option>
                <option value="\t">Tab</option>
                <option value="|">Pipe (|)</option>
              </select>
            </div>
            <div>
              <label className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase">
                Sheet name
              </label>
              <input
                type="text"
                value={sheetName}
                onChange={(e) => setSheetName(e.target.value)}
                className="border-border bg-background text-foreground focus-visible:ring-primary mt-1 w-32 rounded-lg border px-2 py-1.5 text-sm focus-visible:ring-2 focus-visible:outline-none"
              />
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-xs font-medium">
              <input
                type="checkbox"
                checked={keepTypes}
                onChange={(e) => setKeepTypes(e.target.checked)}
                className="accent-primary h-4 w-4"
              />
              Auto-detect types
            </label>
          </div>
        </div>

        <label className="text-muted-foreground mb-2 block text-xs font-semibold tracking-wider uppercase">
          Or paste CSV directly
        </label>
        <textarea
          value={csvInput}
          onChange={(e) => setCsvInput(e.target.value)}
          placeholder="Paste CSV data here…"
          rows={8}
          spellCheck={false}
          className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary w-full resize-y rounded-lg border px-4 py-3 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={convert}
          disabled={!csvInput.trim()}
          className="border-primary bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          <Table className="h-4 w-4" />
          Convert to Excel
        </button>
        <button
          type="button"
          onClick={() => setCsvInput('')}
          className="border-border bg-background hover:bg-muted inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium"
        >
          <Upload className="h-4 w-4" />
          Clear
        </button>
      </div>

      {output && (
        <div className="border-border bg-card rounded-xl border p-5">
          <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
            Download
          </p>
          <DownloadButton
            content={output}
            fileName={fileName}
            contentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            label="Download .xlsx"
            size="sm"
          />
          <div className="mt-3">
            <label className="text-muted-foreground mb-1 block text-xs font-semibold tracking-wider uppercase">
              Output filename
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="border-border bg-background text-foreground focus-visible:ring-primary w-64 rounded-lg border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};

CsvToExcel.displayName = 'CsvToExcel';

export { CsvToExcel };
