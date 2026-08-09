'use client';

import React, { useMemo, useState } from 'react';
import { FileSpreadsheet, Download, Table, Upload, ArrowRightLeft } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import * as XLSX from 'xlsx';
import { SectionHeading } from '@/components/shared/section-heading';
import { FileDropzone } from '@/components/tools/file-dropzone';
import { DownloadButton } from '@/components/shared/download-button';

const ExcelToCsv: React.FC<ToolComponentProps> = () => {
  const [file, setFile] = useState<File | null>(null);
  const [sheetIndex, setSheetIndex] = useState(0);
  const [delimiter, setDelimiter] = useState(',');
  const [output, setOutput] = useState('');
  const [fileName, setFileName] = useState('converted.csv');
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [preview, setPreview] = useState<string[][]>([]);

  const handleFile = (files: File[]) => {
    if (files[0]) {
      setFile(files[0]);
      setFileName(files[0].name.replace(/\.[^.]+$/, '') + '.csv');
    }
  };

  const processFile = () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        setSheetNames(workbook.SheetNames);
        setSheetIndex(0);
        if (workbook.SheetNames.length > 0) {
          convertSheet(workbook, 0);
        }
      } catch (error) {
        console.error('Excel read error:', error);
        alert(`Failed to read file: ${(error as Error).message}`);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const convertSheet = (workbook: XLSX.WorkBook, index: number) => {
    const sheetName = workbook.SheetNames[index];
    const worksheet = workbook.Sheets[sheetName];
    const csv = XLSX.utils.sheet_to_csv(worksheet, { FS: delimiter });
    setOutput(csv);
    const json = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
    setPreview(json as string[][]);
  };

  const handleSheetChange = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        convertSheet(workbook, sheetIndex);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  React.useEffect(() => {
    if (file) processFile();
  }, [file]);

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<FileSpreadsheet className="h-6 w-6" aria-hidden="true" />}
        title="Excel to CSV converter"
        description="Convert Excel (.xlsx, .xls) files to CSV format with sheet selection and delimiter options."
      />
      <div className="border-border bg-card rounded-xl border p-5">
        <FileDropzone
          onFiles={handleFile}
          accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          maxFiles={1}
        />
        {file && (
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase">
                Sheet
              </label>
              <select
                value={sheetIndex}
                onChange={(e) => {
                  setSheetIndex(Number(e.target.value));
                  handleSheetChange();
                }}
                className="border-border bg-background text-foreground focus-visible:ring-primary mt-1 w-full rounded-lg border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
              >
                {sheetNames.map((name, i) => (
                  <option key={name} value={i}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase">
                Delimiter
              </label>
              <select
                value={delimiter}
                onChange={(e) => {
                  setDelimiter(e.target.value);
                  handleSheetChange();
                }}
                className="border-border bg-background text-foreground focus-visible:ring-primary mt-1 w-full rounded-lg border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
              >
                <option value=",">Comma (,)</option>
                <option value=";">Semicolon (;)</option>
                <option value="\t">Tab</option>
                <option value="|">Pipe (|)</option>
              </select>
            </div>
            <div>
              <label className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase">
                Output filename
              </label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="border-border bg-background text-foreground focus-visible:ring-primary mt-1 w-full rounded-lg border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {output && (
        <div className="border-border bg-card rounded-xl border p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Preview (first 20 rows)
            </p>
            <p className="text-muted-foreground text-xs">
              {preview.length} rows × {preview[0]?.length ?? 0} columns
            </p>
          </div>
          <div className="max-h-64 overflow-x-auto">
            <table className="w-full font-mono text-sm">
              <tbody>
                {preview.slice(0, 20).map((row, i) => (
                  <tr key={i} className={i === 0 ? 'bg-muted/50' : ''}>
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className="border-border/50 max-w-[200px] truncate border-r p-2 last:border-r-0"
                      >
                        {cell ?? ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <DownloadButton
            content={output}
            fileName={fileName}
            contentType="text/csv;charset=utf-8"
            label="Download CSV"
            size="sm"
            className="mt-3"
          />
        </div>
      )}
    </div>
  );
};

ExcelToCsv.displayName = 'ExcelToCsv';

export { ExcelToCsv };
