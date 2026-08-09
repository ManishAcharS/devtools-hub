import type { ToolTransformResult, ToolValidationIssue, ToolValidationResult } from './types';

function getParser(): DOMParser | null {
  return typeof DOMParser !== 'undefined' ? new DOMParser() : null;
}

export interface XmlParseFailure {
  doc: null;
  error: string;
  issues: ToolValidationIssue[];
}

export interface XmlParseSuccess {
  doc: Document;
  error: null;
  issues: ToolValidationIssue[];
}

export type XmlParseResult = XmlParseFailure | XmlParseSuccess;

interface ParserErrorInfo {
  message: string;
  line?: number;
  column?: number;
}

function extractParserError(text: string): ParserErrorInfo {
  const cleaned = text
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const lineMatch = cleaned.match(/[Ll]ine (\d+)/);
  const columnMatch = cleaned.match(/[Cc]olumn (\d+)/);
  let message = cleaned
    .replace(/This page contains the following errors?:?\s*/i, '')
    .replace(/Below is a rendering of the page up to the first error\.\s*/i, '')
    .replace(/XML Parsing Error:\s*/i, '')
    .replace(/[Ll]ocation: [^\s]+/i, '')
    .trim();
  if (lineMatch && columnMatch) {
    message = message.replace(/[Ll]ine \d+,?[Cc]olumn \d+[:\s]*/i, '').trim();
  }
  if (message.length > 1000) {
    message = message.slice(0, 1000) + '…';
  }
  return {
    message: message || 'The document is not well-formed XML.',
    line: lineMatch ? Number(lineMatch[1]) : undefined,
    column: columnMatch ? Number(columnMatch[1]) : undefined,
  };
}

export function parseXml(source: string): XmlParseResult {
  if (source.trim().length === 0) {
    return {
      doc: null,
      error: 'Input is empty. Paste an XML document to parse it.',
      issues: [{ message: 'Input is empty. Paste an XML document to parse it.' }],
    };
  }
  const parser = getParser();
  if (!parser) {
    return {
      doc: null,
      error: 'XML parsing is not available in this environment.',
      issues: [{ message: 'XML parsing requires a browser environment.' }],
    };
  }
  const doc = parser.parseFromString(source, 'application/xml');
  const errorNode = doc.getElementsByTagName('parsererror')[0];
  if (errorNode) {
    const info = extractParserError(errorNode.textContent ?? '');
    const issue: ToolValidationIssue = {
      message: info.message,
      ...(info.line !== undefined ? { line: info.line } : {}),
      ...(info.column !== undefined ? { column: info.column } : {}),
    };
    return {
      doc: null,
      error: info.message,
      issues: [issue],
    };
  }
  return { doc, error: null, issues: [] };
}

function escapeXmlText(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeXmlAttribute(value: string): string {
  return escapeXmlText(value).replace(/"/g, '&quot;');
}

interface SerializeOptions {
  minify: boolean;
  indentSize: number;
}

function serializeChildren(
  node: Element,
  depth: number,
  options: SerializeOptions,
  lines: string[]
): void {
  for (const child of Array.from(node.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.nodeValue ?? '';
      if (options.minify) {
        if (!/^\s*$/.test(text)) lines.push(text);
      } else {
        const trimmed = text.trim();
        if (trimmed)
          lines.push(`${' '.repeat(depth * options.indentSize)}${escapeXmlText(trimmed)}`);
      }
    } else if (child.nodeType === Node.CDATA_SECTION_NODE) {
      const data = child.nodeValue ?? '';
      if (options.minify) lines.push(`<![CDATA[${data}]]>`);
      else lines.push(`${' '.repeat(depth * options.indentSize)}<![CDATA[${data}]]>`);
    } else if (child.nodeType === Node.COMMENT_NODE) {
      const data = child.nodeValue ?? '';
      if (options.minify) lines.push(`<!--${data}-->`);
      else lines.push(`${' '.repeat(depth * options.indentSize)}<!--${data}-->`);
    } else if (child.nodeType === Node.PROCESSING_INSTRUCTION_NODE) {
      const target = child.nodeName;
      const data = child.nodeValue ?? '';
      if (options.minify) lines.push(`<?${target}${data ? ` ${data}` : ''}?>`);
      else
        lines.push(
          `${' '.repeat(depth * options.indentSize)}<?${target}${data ? ` ${data}` : ''}?>`
        );
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      serializeElement(child as Element, depth, options, lines);
    }
  }
}

function serializeElement(
  node: Element,
  depth: number,
  options: SerializeOptions,
  lines: string[]
): void {
  const indent = ' '.repeat(depth * options.indentSize);
  const name = node.nodeName;
  const attrs = Array.from(node.attributes)
    .map((attr) => ` ${attr.name}="${escapeXmlAttribute(attr.value)}"`)
    .join('');

  const directChildren = Array.from(node.childNodes).filter(
    (child) =>
      child.nodeType === Node.ELEMENT_NODE ||
      child.nodeType === Node.CDATA_SECTION_NODE ||
      child.nodeType === Node.PROCESSING_INSTRUCTION_NODE ||
      (child.nodeType === Node.TEXT_NODE && !/^\s*$/.test(child.nodeValue ?? ''))
  );

  const onlyText = directChildren.length === 1 && directChildren[0].nodeType === Node.TEXT_NODE;

  if (directChildren.length === 0) {
    if (options.minify) lines.push(`<${name}${attrs}/>`);
    else lines.push(`${indent}<${name}${attrs}/>`);
    return;
  }

  if (onlyText) {
    const text = directChildren[0].nodeValue ?? '';
    if (options.minify) lines.push(`<${name}${attrs}>${escapeXmlText(text)}</${name}>`);
    else lines.push(`${indent}<${name}${attrs}>${escapeXmlText(text)}</${name}>`);
    return;
  }

  if (options.minify) {
    lines.push(`<${name}${attrs}>`);
    serializeChildren(node, depth, options, lines);
    lines.push(`</${name}>`);
  } else {
    lines.push(`${indent}<${name}${attrs}>`);
    serializeChildren(node, depth + 1, options, lines);
    lines.push(`${indent}</${name}>`);
  }
}

function serializeDocument(doc: Document, options: SerializeOptions): string[] {
  const lines: string[] = [];
  for (const child of Array.from(doc.childNodes)) {
    if (child.nodeType === Node.ELEMENT_NODE) {
      serializeElement(child as Element, 0, options, lines);
    } else if (child.nodeType === Node.COMMENT_NODE) {
      const data = child.nodeValue ?? '';
      if (options.minify) lines.push(`<!--${data}-->`);
      else lines.push(`<!--${data}-->`);
    } else if (child.nodeType === Node.PROCESSING_INSTRUCTION_NODE) {
      const target = child.nodeName;
      const data = child.nodeValue ?? '';
      if (options.minify) lines.push(`<?${target}${data ? ` ${data}` : ''}?>`);
      else lines.push(`<?${target}${data ? ` ${data}` : ''}?>`);
    }
  }
  return lines;
}

export function formatXml(
  source: string,
  options: { minify: boolean; indentSize: number }
): ToolTransformResult {
  const parsed = parseXml(source);
  if (!parsed.doc) {
    return { value: '', error: parsed.error };
  }
  const value = serializeDocument(parsed.doc, options).join(options.minify ? '' : '\n');
  return {
    value,
    error: null,
    stats: [
      { label: 'Input', value: `${source.length.toLocaleString()} chars` },
      { label: 'Output', value: `${value.length.toLocaleString()} chars` },
      {
        label: 'Lines',
        value: options.minify ? '1' : value.split('\n').length.toLocaleString(),
      },
    ],
  };
}

export interface XmlJsonNode {
  tag: string;
  attributes: Record<string, string>;
  text?: string;
  children?: XmlJsonNode[];
}

export function xmlToJson(source: string): ToolTransformResult {
  const parsed = parseXml(source);
  if (!parsed.doc) {
    return { value: '', error: parsed.error };
  }

  function convertNode(node: Element): XmlJsonNode {
    const result: XmlJsonNode = {
      tag: node.nodeName,
      attributes: {},
    };
    for (const attr of Array.from(node.attributes)) {
      result.attributes[attr.name] = attr.value;
    }
    const children: XmlJsonNode[] = [];
    const textParts: string[] = [];
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        children.push(convertNode(child as Element));
      } else if (child.nodeType === Node.TEXT_NODE || child.nodeType === Node.CDATA_SECTION_NODE) {
        const text = child.nodeValue ?? '';
        if (text.trim()) textParts.push(text.trim());
      } else if (child.nodeType === Node.COMMENT_NODE) {
        children.push({ tag: '#comment', attributes: {}, text: child.nodeValue ?? '' });
      }
    }
    if (children.length > 0) result.children = children;
    if (textParts.length > 0) result.text = textParts.join(' ');
    return result;
  }

  const value = JSON.stringify(convertNode(parsed.doc.documentElement), null, 2);
  return {
    value,
    error: null,
    stats: [
      { label: 'Output', value: `${value.length.toLocaleString()} chars` },
      { label: 'Root', value: parsed.doc.documentElement.nodeName },
    ],
  };
}

export function validateXml(source: string): ToolValidationResult {
  const parsed = parseXml(source);
  if (!parsed.doc) {
    return {
      valid: false,
      error: parsed.error,
      issues: parsed.issues,
    };
  }
  const elementCount = parsed.doc.getElementsByTagName('*').length;
  const attributeCount = Array.from(parsed.doc.getElementsByTagName('*')).reduce(
    (total, element) => total + element.attributes.length,
    0
  );
  return {
    valid: true,
    error: null,
    issues: [],
    stats: [
      { label: 'Elements', value: elementCount.toLocaleString() },
      { label: 'Attributes', value: attributeCount.toLocaleString() },
      { label: 'Size', value: `${source.length.toLocaleString()} chars` },
    ],
  };
}
