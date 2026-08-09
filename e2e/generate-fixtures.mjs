import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures');
mkdirSync(dir, { recursive: true });

const PNG_1X1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
);
writeFileSync(path.join(dir, 'sample.png'), PNG_1X1);

const { toFile } = await import('qrcode');
await toFile(path.join(dir, 'sample-qr.png'), 'https://example.com', { width: 160 });

const XLSX = await import('xlsx');
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet([
  ['name', 'age', 'city'],
  ['Ada', 36, 'London'],
  ['Grace', 45, 'NYC'],
]);
XLSX.utils.book_append_sheet(wb, ws, 'people');
XLSX.writeFile(wb, path.join(dir, 'sample.xlsx'));

const objects = [
  '<</Type/Catalog/Pages 2 0 R>>',
  '<</Type/Pages/Kids[3 0 R]/Count 1>>',
  '<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>',
  '<</Length 44>>stream\nBT /F1 24 Tf 72 720 Td (Hello PDF) Tj ET\nendstream',
  '<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>',
];

let pdf = '%PDF-1.4\n';
const offsets = [];
for (let i = 0; i < objects.length; i++) {
  offsets.push(pdf.length);
  pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
}
const xrefStart = pdf.length;
pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
for (const offset of offsets) pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
pdf += `trailer\n<</Size ${objects.length + 1}/Root 1 0 R>>\nstartxref\n${xrefStart}\n%%EOF\n`;
writeFileSync(path.join(dir, 'sample.pdf'), pdf);

console.log('Fixtures written to', dir);
