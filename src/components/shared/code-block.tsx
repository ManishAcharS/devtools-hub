'use client';

import React, { useState, useCallback } from 'react';
import { Check, Copy, Terminal, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
  showCopyButton?: boolean;
  defaultCollapsed?: boolean;
  maxHeight?: string;
  className?: string;
  fileName?: string;
}

function highlightCode(code: string): React.ReactNode {
  if (!code.trim()) return null;

  const lines = code.split('\n');

  return lines.map((line, i) => {
    const tokens = line
      .split(
        /(\/\/.*$|\/[*][\s\S]*?[*]\/|"[^"]*"|'[^']*'|`[^`]*`|\b\d+(?:\.\d+)?\b|->|=>|[{}()[\];,:=+\-*%<>!&|?]|\b(?:const|let|var|function|return|if|else|for|while|import|from|export|default|class|extends|new|try|catch|finally|throw|async|await|typeof|instanceof|in|of|switch|case|break|continue|interface|type|enum|namespace|public|private|protected|static|readonly|get|set|yield)\b)/g
      )
      .filter(Boolean);

    return (
      <div key={i} className="flex">
        <span className="mr-4 hidden w-8 flex-shrink-0 text-right text-xs leading-6 text-slate-500 select-none sm:inline-block">
          {i + 1}
        </span>
        <span className="leading-6">
          {tokens.length > 0 ? (
            tokens.map((token, j) => {
              let className = 'text-slate-100';
              if (/^\s*$/.test(token)) {
                className = '';
              } else if (
                token.startsWith('//') ||
                token.startsWith('/*') ||
                token.startsWith('*')
              ) {
                className = 'text-slate-500 italic';
              } else if (/^["'`]/.test(token)) {
                className = 'text-amber-300';
              } else if (/^\d/.test(token)) {
                className = 'text-orange-300';
              } else if (
                /^(const|let|var|function|return|if|else|for|while|import|from|export|default|class|extends|new|try|catch|finally|throw|async|await|typeof|in|of|switch|case|break|continue|interface|type|enum|public|private|protected|static|readonly|get|set|yield)$/.test(
                  token.trim()
                )
              ) {
                className = 'text-purple-400';
              } else if (/^[{}()[\];,:=+\-*%<>!&|?]$/.test(token.trim())) {
                className = 'text-slate-400';
              } else if (/^->|^=>$/.test(token.trim())) {
                className = 'text-slate-400';
              } else if (token.trim().length > 0 && !/^\s*$/.test(token)) {
                className = 'text-sky-300';
              }
              return (
                <span key={j} className={className}>
                  {token}
                </span>
              );
            })
          ) : (
            <span className="text-slate-100">&nbsp;</span>
          )}
        </span>
      </div>
    );
  });
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'text',
  title,
  showLineNumbers = true,
  showCopyButton = true,
  defaultCollapsed = false,
  maxHeight = 'max-h-[32rem]',
  className,
  fileName,
}) => {
  const [copied, setCopied] = useState(false);
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const handleCopy = useCallback(async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = code;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [code]);

  return (
    <div
      className={cn('overflow-hidden rounded-xl border border-slate-800 bg-slate-950', className)}
    >
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <Terminal className="h-4 w-4 flex-shrink-0 text-slate-400" aria-hidden="true" />
          <span className="truncate font-mono text-xs text-slate-300">
            {title || fileName || language}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {showCopyButton && (
            <button
              onClick={handleCopy}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors',
                copied
                  ? 'bg-emerald-400/10 text-emerald-400'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              )}
              aria-label="Copy code"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          )}
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100"
            aria-expanded={!collapsed}
            aria-label={collapsed ? 'Expand code' : 'Collapse code'}
          >
            {collapsed ? (
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
      <div className={cn('overflow-auto', maxHeight, collapsed && 'max-h-0')}>
        <pre
          className={cn(
            'p-4 font-mono text-sm leading-relaxed',
            !showLineNumbers && 'whitespace-pre'
          )}
        >
          <code data-language={language}>{highlightCode(code)}</code>
        </pre>
      </div>
    </div>
  );
};

CodeBlock.displayName = 'CodeBlock';

export { CodeBlock };
