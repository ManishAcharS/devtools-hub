export interface ToolSamples {
  /** Text typed into the primary textarea / text input */
  main?: string;
  /** Number typed into a numeric input */
  number?: string;
  /** Special: file path(s) for file inputs */
  file?: string;
  /** Text typed into a second field (e.g. find/replace) */
  secondary?: string;
  /** Text considered "invalid" for the error-handling test */
  invalid?: string;
  /** Skip the "input works" assertion (still run load/UI/metadata checks) */
  skipInteraction?: boolean;
}

const JSON_SAMPLE = '{"name":"Ada","role":"admin","tags":["ai","web"],"active":true}';
const XML_SAMPLE = '<note><to>Ada</to><from>Grace</from><body>Hi there</body></note>';
const YAML_SAMPLE = 'name: Ada\nrole: admin\nactive: true\n';
const CSV_SAMPLE = 'name,age,city\nAda,36,London\nGrace,45,NYC\n';
const SQL_SAMPLE = 'SELECT id, name FROM users WHERE active = 1 ORDER BY name;';
const MD_SAMPLE = '# Hello\n\nThis is **markdown** with a `code` span.\n\n- one\n- two\n';
const HTML_SAMPLE = '<div class="box"><p>Hello <strong>world</strong></p></div>';
const CSS_SAMPLE = '.box {\n  color: red;\n  margin: 0 auto;\n}\n';
const URL_SAMPLE = 'https://user:pass@example.com:8080/path?page=2&sort=asc#results';
const TEXT_SAMPLE = 'The quick brown fox jumps over the lazy dog.';
const GARBAGE = '!!!not-valid-at-all@@@###';

export const SAMPLES: Record<string, ToolSamples> = {
  'base64-encoder-decoder': {
    main: 'Hello, world! This is a test of base64.',
    invalid: GARBAGE,
  },
  'url-encoder-decoder': { main: URL_SAMPLE, invalid: '%E0%A4%A' },
  'xml-formatter': { main: XML_SAMPLE, invalid: '<note><unclosed>' },
  'xml-minifier': { main: XML_SAMPLE, invalid: '<note><unclosed>' },
  'xml-validator': { main: XML_SAMPLE, invalid: '<note><unclosed>' },
  'xml-to-json': { main: XML_SAMPLE, invalid: '<note><unclosed>' },
  'csv-viewer': { main: CSV_SAMPLE, invalid: 'a,b\n1\n' },
  'csv-to-json': { main: CSV_SAMPLE, invalid: GARBAGE },
  'json-to-csv': { main: JSON_SAMPLE, invalid: 'not json' },
  'csv-formatter': { main: 'name,age\nAda,36\nGrace,45\n' },
  'yaml-formatter': { main: YAML_SAMPLE },
  'yaml-validator': { main: YAML_SAMPLE, invalid: 'a: b: c' },
  'yaml-to-json': { main: YAML_SAMPLE, invalid: 'a: [unclosed' },
  'json-to-yaml': { main: JSON_SAMPLE, invalid: 'not json' },
  'markdown-preview': { main: MD_SAMPLE },
  'markdown-to-html': { main: MD_SAMPLE },
  'html-to-markdown': { main: HTML_SAMPLE },
  'markdown-formatter': { main: MD_SAMPLE },
  'sql-formatter': { main: SQL_SAMPLE },
  'sql-minifier': { main: SQL_SAMPLE },
  'sql-validator': { main: SQL_SAMPLE, invalid: 'SELEC FROM' },
  'regex-tester': { main: 'Hello 123 world 456', secondary: '\\d+' },
  'regex-generator': { main: 'hello@example.com' },
  'regex-cheatsheet': { main: '\\d' },
  'ip-lookup': { main: '8.8.8.8', invalid: '999.1.1.1' },
  'cidr-calculator': { main: '192.168.1.0/24', invalid: '999.999.0.0/33' },
  'dns-lookup': { main: 'example.com', invalid: 'not a domain!' },
  'user-agent-parser': {
    main: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  },
  'timestamp-converter': { main: '1767225600', invalid: 'not-a-time' },
  'unix-time-converter': { main: '1767225600', invalid: 'abc' },
  'date-difference-calculator': { main: '2026-01-01' },
  'timezone-converter': { main: '2026-08-08T10:30:00' },
  'uuid-generator': { main: '550e8400-e29b-41d4-a716-446655440000' },
  'jwt-decoder': {
    main: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkYSIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    invalid: 'not.a.jwt',
  },
  'jwt-inspector': {
    main: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkYSIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  },
  'jwt-encoder': { main: '{"name":"Ada","role":"admin"}' },
  'slug-generator': { main: 'Hello World — This is a Test!' },
  'lorem-ipsum-generator': { main: '5' },
  'random-number-generator': { main: '100' },
  'number-base-converter': { main: '255', secondary: '10' },
  'percentage-calculator': { main: '50' },
  'roman-numeral-converter': { main: '1999', invalid: '0' },
  'url-parser': { main: URL_SAMPLE },
  'url-builder': { main: 'example.com' },
  'query-string-parser': { main: 'page=2&sort=asc&limit=50' },
  'http-status-explorer': { main: '404' },
  'md5-generator': { main: TEXT_SAMPLE },
  'sha1-generator': { main: TEXT_SAMPLE },
  'sha256-generator': { main: TEXT_SAMPLE },
  'sha512-generator': { main: TEXT_SAMPLE },
  'hmac-generator': { main: TEXT_SAMPLE },
  'file-hash-generator': { main: TEXT_SAMPLE },
  'image-compressor': { file: 'e2e/fixtures/sample.png' },
  'image-resizer': { file: 'e2e/fixtures/sample.png' },
  'image-cropper': { file: 'e2e/fixtures/sample.png' },
  'image-format-converter': { file: 'e2e/fixtures/sample.png' },
  'image-metadata-viewer': { file: 'e2e/fixtures/sample.png' },
  'base64-image-converter': {
    main: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  },
  'json-formatter': { main: JSON_SAMPLE, invalid: 'not json' },
  'json-minifier': { main: JSON_SAMPLE, invalid: 'not json' },
  'json-validator': { main: JSON_SAMPLE, invalid: '{"a": 1,}' },
  'case-converter': { main: 'hello world from devtools' },
  'character-counter': { main: TEXT_SAMPLE },
  'text-diff': { main: 'The quick brown fox', secondary: 'The quick brown dog' },
  'color-converter': { main: '#3366ff', invalid: '#gggggg' },
  'color-palette-generator': { main: '#3366ff' },
  'color-contrast-checker': { main: '#ffffff' },
  'pdf-info': { file: 'e2e/fixtures/sample.pdf' },
  'pdf-text-extractor': { file: 'e2e/fixtures/sample.pdf' },
  'pdf-pages-to-images': { file: 'e2e/fixtures/sample.pdf' },
  'images-to-pdf': { file: 'e2e/fixtures/sample.png' },
  'text-reverser': { main: 'Hello World' },
  'whitespace-remover': { main: '  a   b\tc\n  d  ' },
  'find-replace': { main: 'The quick brown fox', secondary: 'brown' },
  'keyword-density-checker': { main: 'The fox and the hound. The fox runs fast.' },
  'password-strength-checker': { main: 'Tr0ub4dor&3' },
  'prime-number-checker': { main: '97', invalid: '3.14' },
  'gcd-lcm-calculator': { main: '12, 18, 24', invalid: 'a, b' },
  'unit-converter': { main: '12' },
  'age-calculator': { main: '1990-05-15' },
  'working-days-calculator': { main: '2026-01-01' },
  'iso-8601-converter': { main: '2026-08-08T10:30:00Z', invalid: 'not a date' },
  'countdown-timer': { main: '2027-01-01' },
  'json-to-xml': { main: JSON_SAMPLE, invalid: 'not json' },
  'code-formatter': { main: JSON_SAMPLE, invalid: 'not json' },
  'gitignore-generator': { main: 'node_modules' },
  'readme-generator': { main: 'My Awesome Project' },
  'license-generator': { main: 'Ada Lovelace' },
  'cron-generator': { main: '0 12 * * 1', invalid: 'not a cron' },
  'gradient-generator': { main: '#3366ff' },
  'box-shadow-generator': { main: '#3366ff' },
  'border-radius-generator': { main: '16' },
  'clip-path-generator': { main: '#3366ff' },
  'px-rem-converter': { main: '16', invalid: 'abc' },
  'color-blindness-simulator': { main: '#ff0000' },
  'favicon-generator': { main: 'DT' },
  'meta-tag-generator': { main: 'My Cool Site' },
  'open-graph-preview': { main: 'https://example.com' },
  'robots-txt-generator': { main: 'https://example.com' },
  'sitemap-generator': { main: 'https://example.com' },
  'htaccess-generator': { main: 'https://example.com' },
  'what-is-my-ip': {},
  'svg-optimizer': {
    main: '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><circle cx="5" cy="5" r="4" fill="red" /></svg>',
  },
  'csv-to-excel': { main: CSV_SAMPLE },
  'excel-to-csv': { file: 'e2e/fixtures/sample.xlsx' },
  'bcrypt-generator': { main: 'mySecretPassword123' },
  'keypair-generator': {},
  'qr-code-generator': { main: 'https://example.com' },
  'qr-code-scanner': { file: 'e2e/fixtures/sample-qr.png' },
  'currency-converter': { main: '100' },
  'alt-text-checker': { main: '<img src="cat.png" alt="A cat sleeping">' },
  'api-key-generator': { main: 'sk_live_' },
  'aria-reference': { main: 'button' },
  'aspect-ratio-calculator': { main: '16:9', secondary: '1920' },
  'base32-converter': { main: 'Hello world 123', invalid: GARBAGE },
  'basic-auth-header-generator': { main: 'admin', secondary: 'secret123' },
  'changelog-generator': { main: '1.0.0' },
  'config-file-converter': {
    main: JSON_SAMPLE,
    invalid: 'not json',
  },
  'connection-string-parser': {
    main: 'postgres://user:pass@localhost:5432/dbname',
    invalid: 'not a connection string!',
  },
  'conventional-commit-generator': { main: 'add password reset flow' },
  'coordinate-converter': { main: '37.7749', secondary: '-122.4194' },
  'css-animation-generator': { main: 'fadeIn' },
  'css-specificity-calculator': { main: '#header .nav li a:hover' },
  'css-triangle-generator': { main: '#3366ff' },
  'csv-to-sql': { main: CSV_SAMPLE, invalid: GARBAGE },
  'curl-generator': { main: 'https://api.example.com/v1/users' },
  'dice-roller': { main: '6' },
  'dockerfile-generator': { main: 'my-app', secondary: '3000' },
  'duplicate-line-remover': { main: 'one\ntwo\ntwo\nthree\nthree\n' },
  'env-file-generator': { main: 'API_KEY', secondary: 'secret' },
  'factorial-fibonacci-generator': { main: '10' },
  'file-size-converter': { main: '2048' },
  'git-cheatsheet': { main: 'commit' },
  'glassmorphism-generator': { main: '#3366ff' },
  'graphql-formatter': {
    main: '{ user(id: 1) { name email posts { title } } }',
    invalid: 'query { broken',
  },
  'html-entity-converter': { main: '<p>"Hello" & \'World\'</p>' },
  'html-table-generator': { main: 'data-table' },
  'htpasswd-generator': { main: 'admin', secondary: 'secret123' },
  'json-ld-generator': { main: JSON_SAMPLE },
  'json-schema-generator': { main: JSON_SAMPLE, invalid: 'not json' },
  'json-to-structs': { main: JSON_SAMPLE, invalid: 'not json' },
  'json-to-typescript': { main: JSON_SAMPLE, invalid: 'not json' },
  'mac-address-generator': {},
  'markdown-table-generator': { main: '2', secondary: '3' },
  'mock-data-generator': { main: 'users' },
  'morse-code-translator': { main: 'SOS help me' },
  'number-to-words': { main: '12345', invalid: 'abc' },
  'palindrome-checker': { main: 'A man, a plan, a canal: Panama' },
  'placeholder-image-generator': { main: '400', secondary: '300' },
  'punycode-converter': { main: 'münchen.de' },
  'quadratic-solver': { main: '1', secondary: '-3' },
  'random-color-generator': {},
  'readability-score': {
    main: 'This is a simple sentence. It has some words. The fog was so dense that the red truck slowed to a crawl.',
  },
  'rrule-calculator': { main: 'FREQ=WEEKLY;BYDAY=MO,WE;COUNT=5' },
  'statistics-calculator': { main: '1, 2, 3, 4, 5' },
  'svg-wave-generator': { main: '#3366ff' },
  'text-sorter': { main: 'banana\napple\ncherry' },
  'timezone-meeting-planner': { main: '2026-08-10T09:00:00' },
  'twitter-card-preview': { main: 'https://example.com' },
  'working-days-adder': { main: '2026-08-10', secondary: '10' },
};

/** Fallback heuristics for any slug without an explicit entry. */
export function heuristicSamples(slug: string): ToolSamples {
  if (slug.includes('json')) return { main: JSON_SAMPLE, invalid: 'not json' };
  if (slug.includes('xml')) return { main: XML_SAMPLE, invalid: '<unclosed>' };
  if (slug.includes('yaml')) return { main: YAML_SAMPLE };
  if (slug.includes('csv')) return { main: CSV_SAMPLE };
  if (slug.includes('sql')) return { main: SQL_SAMPLE };
  if (slug.includes('markdown') || slug.includes('md-')) return { main: MD_SAMPLE };
  if (slug.includes('html')) return { main: HTML_SAMPLE };
  if (slug.includes('css')) return { main: CSS_SAMPLE };
  if (slug.includes('url') || slug.includes('domain')) return { main: URL_SAMPLE };
  if (slug.includes('uuid')) return { main: '550e8400-e29b-41d4-a716-446655440000' };
  if (slug.includes('base64') || slug.includes('base32')) return { main: 'Hello world 123' };
  if (slug.includes('color')) return { main: '#3366ff' };
  if (slug.includes('number') || slug.includes('count')) return { main: '42' };
  if (slug.includes('regex')) return { main: '\\d+' };
  return { main: TEXT_SAMPLE };
}

export function getSamples(slug: string): ToolSamples {
  return { ...heuristicSamples(slug), ...(SAMPLES[slug] ?? {}) };
}
