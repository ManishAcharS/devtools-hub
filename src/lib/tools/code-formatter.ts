import beautify from 'js-beautify';

export type CodeLanguage = 'javascript' | 'css' | 'html';

export interface CodeFormatOptions {
  language: CodeLanguage;
  minify?: boolean;
  indentSize?: number;
  indentChar?: ' ' | '\t';
  maxPreserveNewlines?: number;
  preserveNewlines?: boolean;
  endWithNewline?: boolean;
}

export interface CodeFormatResult {
  value: string;
  error: string | null;
}

export function formatCode(text: string, options: CodeFormatOptions): CodeFormatResult {
  const {
    language,
    minify,
    indentSize = 2,
    indentChar = ' ',
    maxPreserveNewlines = 2,
    preserveNewlines = true,
    endWithNewline = true,
  } = options;

  if (!text.trim()) {
    return { value: '', error: null };
  }

  try {
    let output: string;
    if (language === 'javascript') {
      if (minify) {
        output = beautify
          .js(text, {
            indent_size: 0,
            indent_char: '',
            max_preserve_newlines: 0,
            preserve_newlines: false,
            end_with_newline: false,
            brace_style: 'collapse',
          })
          .trim();
      } else {
        output = beautify.js(text, {
          indent_size: indentSize,
          indent_char: indentChar,
          max_preserve_newlines: maxPreserveNewlines,
          preserve_newlines: preserveNewlines,
          end_with_newline: endWithNewline,
          brace_style: 'collapse',
        });
      }
    } else if (language === 'css') {
      if (minify) {
        output = beautify
          .css(text, {
            indent_size: 0,
            indent_char: '',
            max_preserve_newlines: 0,
            preserve_newlines: false,
            end_with_newline: false,
          })
          .trim();
      } else {
        output = beautify.css(text, {
          indent_size: indentSize,
          indent_char: indentChar,
          max_preserve_newlines: maxPreserveNewlines,
          preserve_newlines: preserveNewlines,
          end_with_newline: endWithNewline,
        });
      }
    } else if (language === 'html') {
      if (minify) {
        output = beautify
          .html(text, {
            indent_size: 0,
            indent_char: '',
            max_preserve_newlines: 0,
            preserve_newlines: false,
            end_with_newline: false,
          })
          .trim();
      } else {
        output = beautify.html(text, {
          indent_size: indentSize,
          indent_char: indentChar,
          max_preserve_newlines: maxPreserveNewlines,
          preserve_newlines: preserveNewlines,
          end_with_newline: endWithNewline,
          unformatted: ['code', 'pre', 'script', 'style'],
          content_unformatted: [],
        });
      }
    } else {
      return { value: '', error: `Unsupported language: ${language}` };
    }
    return { value: output, error: null };
  } catch (error) {
    return { value: '', error: `Formatting failed: ${(error as Error).message}` };
  }
}
