import type { ToolTransformResult } from './types';

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const SAFE_URL_PATTERN = /^(https?:|mailto:|tel:|ftp:|#|\/|\.\/|\.\.\/|[a-zA-Z0-9._-]+:)/i;

function isSafeUrl(value: string): boolean {
  const trimmed = value.trim();
  if (/^javascript:/i.test(trimmed) || /^data:/i.test(trimmed) || /^vbscript:/i.test(trimmed)) {
    return false;
  }
  return SAFE_URL_PATTERN.test(trimmed) || !/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed);
}

function sanitizeUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';
  return isSafeUrl(trimmed) ? trimmed : '';
}

interface InlineState {
  nextPlaceholder: number;
  placeholders: Record<number, string>;
}

function inlineToHtml(text: string): string {
  const state: InlineState = { nextPlaceholder: 0, placeholders: {} };
  const escaped = escapeHtml(text);
  let result = escaped.replace(/`([^`\n]+)`/g, (_, code: string) => {
    const token = `\u0000${state.nextPlaceholder}\u0000`;
    state.placeholders[state.nextPlaceholder] = `<code>${code}</code>`;
    state.nextPlaceholder += 1;
    return token;
  });
  result = result.replace(
    /!\[([^\]]*)\]\(([^)\s]+)(?:\s+["']([^"']*)["'])?\)/g,
    (_, alt: string, src: string, title?: string) => {
      const safeSrc = sanitizeUrl(src);
      if (!safeSrc) return _;
      const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
      return `<img src="${escapeHtml(safeSrc)}" alt="${escapeHtml(alt)}"${titleAttr}>`;
    }
  );
  result = result.replace(
    /\[([^\]]*)\]\(([^)\s]+)(?:\s+["']([^"']*)["'])?\)/g,
    (_, label: string, href: string, title?: string) => {
      const safeHref = sanitizeUrl(href);
      if (!safeHref) return escapeHtml(label);
      const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
      return `<a href="${escapeHtml(safeHref)}"${titleAttr}>${label}</a>`;
    }
  );
  result = result.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
  result = result.replace(/~~([^~\n]+)~~/g, '<del>$1</del>');
  result = result.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
  result = result.replace(/_([^_\n]+)_/g, '<em>$1</em>');
  result = result.replace(
    /\u0000(\d+)\u0000/g,
    (_, index: string) => state.placeholders[Number(index)] ?? ''
  );
  return result;
}

function isListLine(line: string): 'ul' | 'ol' | null {
  const trimmed = line.trim();
  if (/^[-*+]\s+/.test(trimmed)) return 'ul';
  if (/^\d+[.)]\s+/.test(trimmed)) return 'ol';
  return null;
}

function listIndent(line: string): number {
  return line.length - line.trimStart().length;
}

interface ListBlock {
  type: 'ul' | 'ol';
  lines: { indent: number; content: string; index: number }[];
}

function collectList(lines: string[], start: number): { items: ListBlock; next: number } | null {
  const firstType = isListLine(lines[start]);
  if (!firstType) return null;
  const items = [];
  let i = start;
  while (i < lines.length) {
    const type = isListLine(lines[i]);
    const indent = listIndent(lines[i]);
    if (!type) break;
    items.push({ indent, content: lines[i].trim(), index: i });
    i += 1;
  }
  return { items: { type: firstType, lines: items }, next: i };
}

function renderList(block: ListBlock): string {
  const tag = block.type;
  const items = block.lines;
  let html = `<${tag}>\n`;
  let i = 0;
  while (i < items.length) {
    const item = items[i];
    const content = item.content.replace(/^(?:[-*+]|\d+[.)])\s+/, '');
    html += `<li>${inlineToHtml(content)}`;
    if (i + 1 < items.length && items[i + 1].indent > item.indent) {
      let end = i + 1;
      while (end < items.length && items[end].indent > item.indent) end += 1;
      const nestedType = isListLine(items[i + 1].content) === 'ol' ? 'ol' : 'ul';
      html += `\n${renderList({ type: nestedType, lines: items.slice(i + 1, end) })}`;
      i = end;
    } else {
      i += 1;
    }
    html += '</li>\n';
  }
  html += `</${tag}>`;
  return html;
}

export function markdownToHtml(markdown: string): { value: string; error: string | null } {
  const source = markdown.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = source.split('\n');
  const output: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    const fence = line.match(/^```(\w*)\s*$/);
    if (fence) {
      const language = fence[1];
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        codeLines.push(lines[i]);
        i += 1;
      }
      i += 1;
      const code = codeLines.join('\n');
      const languageClass = language ? ` class="language-${escapeHtml(language)}"` : '';
      output.push(`<pre><code${languageClass}>${escapeHtml(code)}</code></pre>`);
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      output.push(`<h${level}>${inlineToHtml(heading[2])}</h${level}>`);
      i += 1;
      continue;
    }

    const table = collectTable(lines, i);
    if (table) {
      output.push(table.html);
      i = table.next;
      continue;
    }

    if (/^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      output.push('<hr>');
      i += 1;
      continue;
    }

    const quoteLines: string[] = [];
    while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
      quoteLines.push(lines[i].replace(/^\s*>\s?/, ''));
      i += 1;
    }
    if (quoteLines.length > 0) {
      const inner = quoteLines.map((quoteLine) => `<p>${inlineToHtml(quoteLine)}</p>`).join('\n');
      output.push(`<blockquote>\n${inner}\n</blockquote>`);
      continue;
    }

    const list = collectList(lines, i);
    if (list) {
      output.push(renderList(list.items));
      i = list.next;
      continue;
    }

    if (/^\s*$/.test(line)) {
      i += 1;
      continue;
    }

    const paragraph: string[] = [];
    while (i < lines.length && !/^\s*$/.test(lines[i])) {
      if (
        /^```\s*$/.test(lines[i]) ||
        /^#{1,6}\s/.test(lines[i]) ||
        isListLine(lines[i]) ||
        /^\s*>\s?/.test(lines[i])
      ) {
        break;
      }
      paragraph.push(lines[i]);
      i += 1;
    }
    if (paragraph.length > 0) {
      output.push(`<p>${inlineToHtml(paragraph.join(' '))}</p>`);
    }
  }

  return { value: output.join('\n\n'), error: null };
}

interface TableResult {
  html: string;
  next: number;
}

function collectTable(lines: string[], start: number): TableResult | null {
  const first = lines[start];
  if (!/^\s*\|.*\|\s*$/.test(first)) return null;
  const second = lines[start + 1];
  if (!second || !/^\s*\|?[\s:|-]+\|\s*$/.test(second) || !second.includes('-')) return null;

  const parseRow = (line: string): string[] =>
    line
      .trim()
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map((cell) => cell.trim());

  const headers = parseRow(first);
  const rows: string[][] = [];
  let i = start + 2;
  while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) {
    rows.push(parseRow(lines[i]));
    i += 1;
  }

  const renderRow = (cells: string[], tag: 'th' | 'td'): string =>
    `<tr>${cells.map((cell) => `<${tag}>${inlineToHtml(cell)}</${tag}>`).join('')}</tr>`;

  const html = [
    '<table>',
    '<thead>',
    renderRow(headers, 'th'),
    '</thead>',
    rows.length > 0
      ? `<tbody>\n${rows.map((row) => renderRow(row, 'td')).join('\n')}\n</tbody>`
      : '',
    '</table>',
  ].join('\n');
  return { html, next: i };
}

export function markdownToHtmlResult(source: string): ToolTransformResult {
  const { value, error } = markdownToHtml(source);
  const lines = source.split(/\r\n|\r|\n/).length;
  return {
    value,
    error,
    stats: [
      { label: 'Input', value: `${source.length.toLocaleString()} chars` },
      { label: 'Lines', value: lines.toLocaleString() },
      { label: 'HTML', value: `${value.length.toLocaleString()} chars` },
    ],
  };
}

function getHtmlParser(): DOMParser | null {
  return typeof DOMParser !== 'undefined' ? new DOMParser() : null;
}

interface ConvertContext {
  lines: string[];
  listStack: string[];
}

function inlineToMarkdown(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return (node.nodeValue ?? '').replace(/\s+/g, ' ');
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return '';
  const element = node as Element;
  const tag = element.tagName.toLowerCase();
  const children = Array.from(element.childNodes).map(inlineToMarkdown).join('');
  switch (tag) {
    case 'strong':
    case 'b':
      return `**${children}**`;
    case 'em':
    case 'i':
      return `*${children}*`;
    case 'del':
    case 's':
    case 'strike':
      return `~~${children}~~`;
    case 'code':
      return `\`${children}\``;
    case 'a': {
      const href = element.getAttribute('href') ?? '';
      if (!href || !isSafeUrl(href)) return children;
      return `[${children}](${href})`;
    }
    case 'img': {
      const src = element.getAttribute('src') ?? '';
      const alt = element.getAttribute('alt') ?? '';
      return src ? `![${alt}](${src})` : '';
    }
    case 'br':
      return '\n';
    case 'sub':
      return `~${children}~`;
    case 'sup':
      return `^${children}^`;
    default:
      return children;
  }
}

function elementToMarkdown(element: Element, context: ConvertContext): void {
  const tag = element.tagName.toLowerCase();
  const headingMatch = tag.match(/^h([1-6])$/);

  if (headingMatch) {
    const level = Number(headingMatch[1]);
    const text = inlineToMarkdown(element).trim();
    if (text) context.lines.push(`${'#'.repeat(level)} ${text}`);
    return;
  }

  if (tag === 'pre') {
    const code = element.textContent ?? '';
    context.lines.push('```', code.replace(/\n$/, ''), '```');
    return;
  }

  if (tag === 'ul' || tag === 'ol') {
    const isOl = tag === 'ol';
    context.listStack.push(tag);
    const items = Array.from(element.children).filter(
      (child) => child.tagName.toLowerCase() === 'li'
    );
    items.forEach((item, index) => {
      const marker = isOl ? `${index + 1}.` : '-';
      const prefix = '  '.repeat(context.listStack.length - 1);
      const text = inlineToMarkdown(item).trim();
      if (text) context.lines.push(`${prefix}${marker} ${text}`);
      const nested = Array.from(item.children).filter((child) =>
        ['ul', 'ol'].includes(child.tagName.toLowerCase())
      );
      nested.forEach((child) => elementToMarkdown(child as Element, context));
    });
    context.listStack.pop();
    return;
  }

  if (tag === 'blockquote') {
    const before = context.lines.length;
    Array.from(element.childNodes).forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) elementToMarkdown(child as Element, context);
      else {
        const text = inlineToMarkdown(child).trim();
        if (text) context.lines.push(text);
      }
    });
    for (let i = before; i < context.lines.length; i += 1) {
      context.lines[i] = `> ${context.lines[i]}`;
    }
    return;
  }

  if (tag === 'hr') {
    context.lines.push('---');
    return;
  }

  if (tag === 'table') {
    const rows = Array.from(element.querySelectorAll('tr'));
    const cellsOf = (row: Element): string[] =>
      Array.from(row.children)
        .map((cell) => inlineToMarkdown(cell).trim().replace(/\|/g, '\\|'))
        .filter((cell) => cell !== '');
    if (rows.length === 0) return;
    const headerRow = rows[0];
    const headers = cellsOf(headerRow);
    if (headers.length === 0) return;
    context.lines.push(`| ${headers.join(' | ')} |`);
    context.lines.push(`| ${headers.map(() => '---').join(' | ')} |`);
    rows.slice(1).forEach((row) => {
      const cells = cellsOf(row);
      if (cells.length > 0) context.lines.push(`| ${cells.join(' | ')} |`);
    });
    return;
  }

  const blockTags = new Set([
    'p',
    'div',
    'section',
    'article',
    'main',
    'aside',
    'header',
    'footer',
    'figure',
    'figcaption',
    'address',
    'form',
    'fieldset',
    'details',
    'summary',
    'td',
    'th',
    'tr',
    'tbody',
    'thead',
  ]);
  if (blockTags.has(tag)) {
    let hasChildBlock = false;
    Array.from(element.children).forEach((child) => {
      const childTag = child.tagName.toLowerCase();
      if (
        [
          'p',
          'div',
          'ul',
          'ol',
          'pre',
          'blockquote',
          'table',
          'h1',
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          'hr',
        ].includes(childTag)
      ) {
        hasChildBlock = true;
      }
    });
    if (hasChildBlock) {
      Array.from(element.childNodes).forEach((child) => {
        if (child.nodeType === Node.ELEMENT_NODE) elementToMarkdown(child as Element, context);
      });
      return;
    }
    const text = inlineToMarkdown(element).trim();
    if (text) context.lines.push(text);
    return;
  }

  if (
    ['script', 'style', 'noscript', 'head', 'meta', 'link', 'iframe', 'svg', 'form'].includes(tag)
  ) {
    return;
  }

  if (
    tag === 'li' ||
    tag === 'span' ||
    tag === 'a' ||
    tag === 'code' ||
    tag === 'em' ||
    tag === 'strong'
  ) {
    return;
  }

  const text = inlineToMarkdown(element).trim();
  if (text) context.lines.push(text);
}

export function htmlToMarkdown(html: string): { value: string; error: string | null } {
  if (html.trim().length === 0) {
    return { value: '', error: 'Input is empty. Paste HTML to convert it to Markdown.' };
  }
  const parser = getHtmlParser();
  if (!parser) {
    return { value: '', error: 'HTML parsing is not available in this environment.' };
  }
  const doc = parser.parseFromString(html, 'text/html');
  const context: ConvertContext = { lines: [], listStack: [] };
  const body = doc.body;
  if (!body) {
    return { value: '', error: 'The HTML document has no <body> to convert.' };
  }
  Array.from(body.childNodes).forEach((child) => {
    const before = context.lines.length;
    if (child.nodeType === Node.ELEMENT_NODE) elementToMarkdown(child as Element, context);
    else {
      const text = inlineToMarkdown(child).trim();
      if (text) context.lines.push(text);
    }
    if (context.lines.length > before) context.lines.push('');
  });

  const collapsed = context.lines
    .map((line) => line.replace(/\s+$/, ''))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return { value: `${collapsed}\n`, error: null };
}

export function tidyMarkdown(markdown: string): {
  value: string;
  error: string | null;
  stats: { label: string; value: string }[];
} {
  const source = markdown.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  if (source.trim().length === 0) {
    return { value: '', error: 'Input is empty. Paste Markdown to format it.', stats: [] };
  }
  const lines = source.split('\n').map((line) => line.replace(/\s+$/, ''));
  const output: string[] = [];
  let orderedCounter: number | null = null;
  let orderedMarker: '.' | ')' | null = null;
  let prevIsBlank = true;

  lines.forEach((line) => {
    const prev = output.length > 0 ? output[output.length - 1] : null;

    if (/^\s*$/.test(line)) {
      orderedCounter = null;
      orderedMarker = null;
      if (!prevIsBlank && prev !== null) output.push('');
      prevIsBlank = true;
      return;
    }

    prevIsBlank = false;

    const heading = line.match(/^(#{1,6})\s*(.*)$/);
    if (heading) {
      orderedCounter = null;
      if (prev !== null && prev !== '' && !/^\s*[>-]\s/.test(prev)) output.push('');
      const content = heading[2].trim();
      output.push(content ? `${heading[1]} ${content}` : heading[1]);
      return;
    }

    if (/^```/.test(line)) {
      orderedCounter = null;
      if (prev !== null && prev !== '') output.push('');
      output.push(line);
      return;
    }

    const unordered = line.match(/^(\s*)[*+]\s+(.*)$/);
    if (unordered) {
      orderedCounter = null;
      output.push(`${unordered[1]}- ${unordered[2].trim()}`);
      return;
    }

    const ordered = line.match(/^(\s*)(\d+)([.)])\s+(.*)$/);
    if (ordered) {
      const marker = ordered[3] as '.' | ')';
      if (orderedMarker !== marker || orderedCounter === null) {
        orderedCounter = 1;
        orderedMarker = marker;
      }
      output.push(`${ordered[1]}${orderedCounter}${marker} ${ordered[4].trim()}`);
      orderedCounter += 1;
      return;
    }

    output.push(line.trimEnd());
  });

  while (output.length > 0 && output[output.length - 1] === '') output.pop();
  const value = `${output.join('\n')}\n`;
  return {
    value,
    error: null,
    stats: [
      {
        label: 'Lines',
        value: `${lines.length.toLocaleString()} → ${output.length.toLocaleString()}`,
      },
      { label: 'Output', value: `${value.length.toLocaleString()} chars` },
    ],
  };
}
