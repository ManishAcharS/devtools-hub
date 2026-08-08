import type { CategoryDefinition, ToolCategoryDefinition } from '@/types';

export const categoryDefinitions: ToolCategoryDefinition[] = [
  {
    id: 'cat-api-development',
    slug: 'api-development',
    name: 'API Development',
    description:
      'Tools for designing, building, testing, and documenting REST, GraphQL, and gRPC APIs.',
    icon: 'api',
    featured: true,
    order: 1,
  },
  {
    id: 'cat-databases',
    slug: 'databases',
    name: 'Databases',
    description: 'SQL, NoSQL, ORMs, query builders, and database management tools.',
    icon: 'database',
    featured: true,
    order: 2,
  },
  {
    id: 'cat-frontend',
    slug: 'frontend',
    name: 'Frontend',
    description: 'Frameworks, libraries, UI kits, and tools for building modern web interfaces.',
    icon: 'layout',
    featured: true,
    order: 3,
  },
  {
    id: 'cat-backend',
    slug: 'backend',
    name: 'Backend',
    description: 'Servers, frameworks, microservices, and server-side development tools.',
    icon: 'server',
    featured: true,
    order: 4,
  },
  {
    id: 'cat-testing',
    slug: 'testing',
    name: 'Testing',
    description: 'Unit, integration, end-to-end, and visual testing frameworks and services.',
    icon: 'shield-check',
    featured: false,
    order: 5,
  },
  {
    id: 'cat-monitoring',
    slug: 'monitoring',
    name: 'Monitoring',
    description: 'Logging, metrics, tracing, alerting, and observability platforms.',
    icon: 'activity',
    featured: false,
    order: 6,
  },
  {
    id: 'cat-security',
    slug: 'security',
    name: 'Security',
    description: 'Authentication, authorization, vulnerability scanning, and compliance tools.',
    icon: 'lock',
    featured: false,
    order: 7,
  },
  {
    id: 'cat-ci-cd',
    slug: 'ci-cd',
    name: 'CI/CD',
    description: 'Continuous integration, delivery, and deployment automation platforms.',
    icon: 'git-branch',
    featured: true,
    order: 8,
  },
  {
    id: 'cat-productivity',
    slug: 'productivity',
    name: 'Productivity',
    description: 'IDEs, editors, terminal tools, and automation that speed up development.',
    icon: 'zap',
    featured: false,
    order: 9,
  },
  {
    id: 'cat-design',
    slug: 'design',
    name: 'Design',
    description: 'UI/UX design, prototyping, and developer-designer collaboration tools.',
    icon: 'palette',
    featured: false,
    order: 10,
  },
  {
    id: 'cat-collaboration',
    slug: 'collaboration',
    name: 'Collaboration',
    description: 'Team chat, documentation, project management, and code review tools.',
    icon: 'users',
    featured: false,
    order: 11,
  },
  {
    id: 'cat-infrastructure',
    slug: 'infrastructure',
    name: 'Infrastructure',
    description: 'Cloud platforms, containers, orchestration, and infrastructure as code.',
    icon: 'cloud',
    featured: false,
    order: 12,
  },
];

export const dynamicCategoryDefinitions: CategoryDefinition[] = [
  {
    id: 'cat-json',
    slug: 'json',
    title: 'JSON',
    shortDescription: 'Tools for formatting, validating, converting, and debugging JSON data.',
    longDescription:
      'JSON is the universal data interchange format of the web. Whether you are validating API responses, pretty-printing payloads, converting between JSON and other formats, or debugging deeply nested structures, this collection covers the tools every developer reaches for when working with JSON.',
    icon: 'braces',
    color: 'amber',
    keywords: [
      'json',
      'serialization',
      'data interchange',
      'api responses',
      'jsonpath',
      'pretty print',
    ],
    seo: {
      keywords: ['json tools', 'json formatter', 'json validator', 'json to yaml', 'jsonpath'],
    },
    featuredTools: [],
    relatedCategories: ['xml', 'yaml', 'csv', 'text', 'encoding', 'regex'],
    featuredArticles: [],
    faqs: [
      {
        question: 'What can JSON tools do for developers?',
        answer:
          'They help you validate syntax, format and minify payloads, convert between JSON and YAML/XML/CSV, query nested documents with JSONPath, and generate JSON from schemas — saving time on everyday debugging.',
      },
      {
        question: 'Is JSON still the best data format for APIs?',
        answer:
          'For most REST APIs JSON remains the default: it is human-readable, language-agnostic, and fast to parse. Alternatives like YAML are better for configuration, while Protocol Buffers shine where payload size matters.',
      },
    ],
    displayOrder: 13,
  },
  {
    id: 'cat-xml',
    slug: 'xml',
    title: 'XML',
    shortDescription: 'Tools for formatting, validating, and transforming XML documents.',
    longDescription:
      'XML powers sitemaps, RSS feeds, SVG internals, and countless enterprise integrations. This category groups utilities for pretty-printing, validating against schemas, converting to JSON or YAML, and building XPath queries so XML never slows you down.',
    icon: 'code-xml',
    color: 'blue',
    keywords: ['xml', 'markup', 'sitemap', 'rss', 'xslt', 'xpath', 'schema'],
    seo: {
      keywords: ['xml tools', 'xml formatter', 'xml validator', 'xml to json', 'xpath'],
    },
    featuredTools: [],
    relatedCategories: ['json', 'yaml', 'csv', 'text'],
    featuredArticles: [],
    faqs: [
      {
        question: 'When should I use XML instead of JSON?',
        answer:
          'XML is still the right choice for document-centric data with mixed content, XSLT pipelines, and ecosystems that require schemas such as SVG, sitemaps, RSS, and many enterprise protocols.',
      },
      {
        question: 'How do I validate an XML document?',
        answer:
          'Use an XML validator that checks well-formedness, then optionally validate against an XSD schema or DTD. Most category tools combine both checks and report the exact line and column of errors.',
      },
    ],
    displayOrder: 14,
  },
  {
    id: 'cat-yaml',
    slug: 'yaml',
    title: 'YAML',
    shortDescription: 'Tools for formatting, validating, and converting YAML configuration.',
    longDescription:
      'YAML is the de facto language of configuration: CI pipelines, Docker Compose, Kubernetes manifests, and deployment files are all written in it. These utilities lint syntax, catch indentation mistakes, convert YAML to JSON and back, and help you reason about complex nested configs.',
    icon: 'list-tree',
    color: 'cyan',
    keywords: ['yaml', 'config', 'configuration', 'data serialization', 'yaml lint', 'anchors'],
    seo: {
      keywords: ['yaml tools', 'yaml validator', 'yaml formatter', 'yaml to json', 'yaml lint'],
    },
    featuredTools: [],
    relatedCategories: ['json', 'xml', 'csv', 'encoding'],
    featuredArticles: [],
    faqs: [
      {
        question: 'Why is YAML used for configuration files?',
        answer:
          'YAML is human-friendly, supports comments, nested structures, anchors and aliases, and reads almost like plain English — which is why Docker Compose, GitHub Actions, and Kubernetes all adopted it.',
      },
      {
        question: 'What are the most common YAML mistakes?',
        answer:
          'Inconsistent indentation, tabs instead of spaces, missing quotes around special strings like "yes" and "no", and misused anchors. A good YAML linter catches all of these before your pipeline breaks.',
      },
    ],
    displayOrder: 15,
  },
  {
    id: 'cat-csv',
    slug: 'csv',
    title: 'CSV',
    shortDescription: 'Tools for viewing, validating, and converting CSV and tabular data.',
    longDescription:
      'CSV remains the simplest way to move tabular data between databases, spreadsheets, and APIs. Here you will find utilities for inspecting large CSVs, fixing quoting and delimiter issues, filtering rows, and converting between CSV, JSON, and SQL.',
    icon: 'table',
    color: 'emerald',
    keywords: ['csv', 'spreadsheet', 'tabular data', 'data import', 'delimiter', 'tsv'],
    seo: {
      keywords: ['csv tools', 'csv viewer', 'csv to json', 'csv validator', 'tsv'],
    },
    featuredTools: [],
    relatedCategories: ['json', 'xml', 'text', 'numbers'],
    featuredArticles: [],
    faqs: [
      {
        question: 'How do I open a CSV file with millions of rows?',
        answer:
          'Spreadsheets choke on large files. Use a dedicated CSV viewer or command-line tool that streams rows, supports filtering, and renders only what fits on screen.',
      },
      {
        question: 'What makes a CSV file malformed?',
        answer:
          'Unescaped quotes, inconsistent delimiters, multiline fields, and trailing commas. Validators highlight the exact row and column so you can fix imports quickly.',
      },
    ],
    displayOrder: 16,
  },
  {
    id: 'cat-text',
    slug: 'text',
    title: 'Text',
    shortDescription: 'Utilities for manipulating, comparing, and converting plain text.',
    longDescription:
      'Every developer ends up wrangling plain text: trimming whitespace, converting case, counting words, diffing strings, and transforming line endings. These lightweight tools handle everyday text chores without leaving the browser.',
    icon: 'type',
    color: 'violet',
    keywords: ['text', 'plain text', 'string', 'copy', 'format', 'diff'],
    seo: {
      keywords: ['text tools', 'text formatter', 'case converter', 'text diff', 'string utilities'],
    },
    featuredTools: [],
    relatedCategories: ['json', 'markdown', 'csv', 'regex'],
    featuredArticles: [],
    faqs: [
      {
        question: 'What text tools do developers use most?',
        answer:
          'Case converters, whitespace trimmers, line-ending normalizers, text diff, URL slug generators, and text-to-base64 converters are the most requested utilities.',
      },
      {
        question: 'Are browser-based text tools safe for sensitive data?',
        answer:
          'Most run entirely in your browser and never send data to a server. Look for tools that explicitly state client-side processing if you work with confidential text.',
      },
    ],
    displayOrder: 17,
  },
  {
    id: 'cat-regex',
    slug: 'regex',
    title: 'Regex',
    shortDescription: 'Interactive tools for building, testing, and debugging regular expressions.',
    longDescription:
      'Regular expressions are one of the most powerful and error-prone parts of programming. Interactive testers with real-time matching, expression explainers, and generators for common patterns help you build correct regexes for validation, extraction, and search.',
    icon: 'regex',
    color: 'rose',
    keywords: ['regex', 'regular expression', 'pattern', 'string matching', 'validation'],
    seo: {
      keywords: ['regex tester', 'regex generator', 'regular expression tool', 'regex cheat sheet'],
    },
    featuredTools: [],
    relatedCategories: ['text', 'encoding', 'numbers', 'programming'],
    featuredArticles: [],
    faqs: [
      {
        question: 'How do I debug a regex that does not match?',
        answer:
          'Use an interactive tester with live highlighting: step through the pattern against sample input, inspect each match group, and try a simpler pattern first to isolate the failing part.',
      },
      {
        question: 'What is a greedy vs lazy match?',
        answer:
          'Greedy quantifiers (like .*) consume as much as possible; lazy ones (like .*?) stop at the first opportunity. Choosing the wrong one is the most common cause of unexpected regex results.',
      },
    ],
    displayOrder: 18,
  },
  {
    id: 'cat-encoding',
    slug: 'encoding',
    title: 'Encoding',
    shortDescription: 'Converters and encoders for Base64, URL, Unicode, and hash formats.',
    longDescription:
      'Encoding utilities handle the grunt work of data conversion: Base64 encoding and decoding, URL percent-encoding, HTML entities, Unicode normalization, and hash generation for quick integrity checks and password reset flows.',
    icon: 'binary',
    color: 'cyan',
    keywords: ['encoding', 'base64', 'url encode', 'hash', 'unicode', 'html entities'],
    seo: {
      keywords: [
        'base64 encoder',
        'url encoder',
        'hash generator',
        'unicode converter',
        'html entities',
      ],
    },
    featuredTools: [],
    relatedCategories: ['text', 'security-tools', 'json', 'regex'],
    featuredArticles: [],
    faqs: [
      {
        question: 'When should I Base64 encode data?',
        answer:
          'When binary data must travel through text-only channels — email, JSON payloads, URLs — or when you need a safe representation for storage in text columns.',
      },
      {
        question: 'Are encoding tools the same as encryption?',
        answer:
          'No. Encoding (Base64, URL) is reversible and offers no security. Encryption protects data with keys. If you need to protect content, reach for encryption, not encoding.',
      },
    ],
    displayOrder: 19,
  },
  {
    id: 'cat-security-tools',
    slug: 'security-tools',
    title: 'Security',
    shortDescription: 'Utilities for hashing, token inspection, and quick security checks.',
    longDescription:
      'A practical toolkit for day-to-day security chores: hash generators and checkers, JWT and OAuth token decoders, password strength meters, entropy calculators, and random token generators for secrets and API keys.',
    icon: 'key-round',
    color: 'rose',
    keywords: ['security', 'jwt', 'hash', 'encryption', 'password', 'token'],
    seo: {
      keywords: [
        'jwt decoder',
        'hash generator',
        'password strength checker',
        'random token generator',
        'security utilities',
      ],
    },
    featuredTools: ['auth0'],
    relatedCategories: ['encoding', 'network', 'sql', 'programming'],
    featuredArticles: [],
    faqs: [
      {
        question: 'What are the best security utilities for developers?',
        answer:
          'JWT inspectors, bcrypt/sha hash generators, password entropy checkers, UUID and token generators, and TLS/SSL checkers cover most day-to-day needs.',
      },
      {
        question: 'How should I store generated tokens and secrets?',
        answer:
          'Never commit secrets to repositories. Store them in a dedicated secrets manager or encrypted environment store, rotate them regularly, and use the principle of least privilege.',
      },
    ],
    displayOrder: 20,
  },
  {
    id: 'cat-sql',
    slug: 'sql',
    title: 'SQL',
    shortDescription: 'Tools for writing, formatting, and analyzing SQL queries and schemas.',
    longDescription:
      'SQL is everywhere: application databases, warehouses, and analytics. These utilities format messy queries, explain execution plans, validate syntax, convert between SQL dialects, and generate schema and seed data for your database work.',
    icon: 'database-zap',
    color: 'blue',
    keywords: ['sql', 'database', 'query', 'orm', 'postgresql', 'mysql'],
    seo: {
      keywords: [
        'sql formatter',
        'sql validator',
        'sql to json',
        'query builder',
        'database tools',
      ],
    },
    featuredTools: ['prisma', 'supabase'],
    relatedCategories: ['databases', 'programming', 'json', 'numbers'],
    featuredArticles: [],
    faqs: [
      {
        question: 'Why should I format SQL queries?',
        answer:
          'Readable SQL is easier to review, debug, and maintain. Formatters normalize capitalization, indentation, and clause ordering, and most support multiple dialect conventions.',
      },
      {
        question: 'How do I test a query without touching production data?',
        answer:
          'Use an SQL playground or local database container, add EXPLAIN to inspect execution plans, and always validate against a schema before running on real data.',
      },
    ],
    displayOrder: 21,
  },
  {
    id: 'cat-markdown',
    slug: 'markdown',
    title: 'Markdown',
    shortDescription: 'Editors, converters, and previewers for Markdown documentation.',
    longDescription:
      'Markdown is the language of READMEs, docs sites, and engineering notes. This category brings together live preview editors, HTML converters, table generators, and linters so your documentation stays consistent and render-ready.',
    icon: 'file-text',
    color: 'violet',
    keywords: ['markdown', 'documentation', 'readme', 'docs', 'mdx'],
    seo: {
      keywords: ['markdown editor', 'markdown to html', 'markdown preview', 'readme generator'],
    },
    featuredTools: [],
    relatedCategories: ['text', 'programming', 'json'],
    featuredArticles: [],
    faqs: [
      {
        question: 'What is the difference between Markdown and HTML?',
        answer:
          'Markdown is a lightweight, human-readable syntax that converts to HTML. It is easier to write and review than raw HTML, while advanced syntax (tables, footnotes) covers most documentation needs.',
      },
      {
        question: 'Why does my Markdown render differently on different platforms?',
        answer:
          'Dialects vary: GitHub Flavored Markdown supports tables and task lists, CommonMark is the baseline standard. Preview tools let you check the target dialect before committing docs.',
      },
    ],
    displayOrder: 22,
  },
  {
    id: 'cat-color',
    slug: 'color',
    title: 'Color',
    shortDescription: 'Converters, pickers, and accessibility tools for CSS colors.',
    longDescription:
      'Designing in code means thinking in hex, RGB, HSL, and now OKLCH. Color utilities convert between formats, generate accessible contrast pairs, build palettes, and preview how colors look on real backgrounds.',
    icon: 'swatch-book',
    color: 'rose',
    keywords: ['color', 'hex', 'hsl', 'rgb', 'contrast', 'palette', 'oklch'],
    seo: {
      keywords: [
        'color converter',
        'hex to rgb',
        'contrast checker',
        'color palette generator',
        'oklch',
      ],
    },
    featuredTools: [],
    relatedCategories: ['images', 'design', 'programming'],
    featuredArticles: [],
    faqs: [
      {
        question: 'What is the difference between HEX, RGB, and HSL?',
        answer:
          'They describe the same colors in different coordinate systems. HEX is compact and universal, RGB is device-oriented, and HSL expresses hue, saturation, and lightness — easier to reason about when adjusting colors.',
      },
      {
        question: 'How do I check text contrast for accessibility?',
        answer:
          'Use a contrast checker that computes the WCAG ratio between text and background colors. Aim for at least 4.5:1 for normal text and 3:1 for large text.',
      },
    ],
    displayOrder: 23,
  },
  {
    id: 'cat-network',
    slug: 'network',
    title: 'Network',
    shortDescription: 'Utilities for HTTP requests, DNS, ports, and network debugging.',
    longDescription:
      'From quick HTTP request builders to DNS lookups, IP information, port scanners, and header inspectors — these network utilities help you debug connectivity, test endpoints, and understand what is happening on the wire.',
    icon: 'globe',
    color: 'cyan',
    keywords: ['network', 'http', 'request', 'dns', 'ip', 'web'],
    seo: {
      keywords: ['http request tool', 'dns lookup', 'ip lookup', 'port scanner', 'network tools'],
    },
    featuredTools: ['postman'],
    relatedCategories: ['security-tools', 'encoding', 'programming', 'sql'],
    featuredArticles: [],
    faqs: [
      {
        question: 'What should I check first when an API request fails?',
        answer:
          'The status code, response headers, and network timing. Then verify DNS resolution, TLS handshake, and whether a proxy or firewall is intercepting the request.',
      },
      {
        question: 'Are network debugging tools safe to use?',
        answer:
          'Yes — most are read-only (lookups, requests you initiate). Avoid pasting secrets or tokens into any tool, and never scan systems you do not own or have permission to test.',
      },
    ],
    displayOrder: 24,
  },
  {
    id: 'cat-images',
    slug: 'images',
    title: 'Images',
    shortDescription: 'Tools for resizing, converting, and optimizing images for the web.',
    longDescription:
      'Fast pages depend on well-optimized images. These utilities resize, crop, convert between WebP/PNG/JPEG/AVIF, compress without visible quality loss, generate placeholders, and preview responsive image variants.',
    icon: 'image',
    color: 'emerald',
    keywords: ['image', 'picture', 'photo', 'png', 'jpeg', 'svg', 'optimization'],
    seo: {
      keywords: [
        'image converter',
        'image compressor',
        'resize image',
        'webp to png',
        'svg optimizer',
      ],
    },
    featuredTools: [],
    relatedCategories: ['color', 'pdf', 'design', 'markdown'],
    featuredArticles: [],
    faqs: [
      {
        question: 'Which image format should I use for the web?',
        answer:
          'Use AVIF or WebP for photos and complex graphics (much smaller than JPEG), SVG for logos and icons, and PNG only when you need lossless transparency.',
      },
      {
        question: 'How much should I compress images?',
        answer:
          'Compress until quality loss is invisible — usually 60-80% for JPEG and 70-90% for WebP. Always generate responsive sizes rather than shipping one large file.',
      },
    ],
    displayOrder: 25,
  },
  {
    id: 'cat-pdf',
    slug: 'pdf',
    title: 'PDF',
    shortDescription: 'Utilities for merging, splitting, converting, and inspecting PDFs.',
    longDescription:
      'PDFs are everywhere in business software, but they are painful to work with. These tools merge and split documents, convert to and from text and images, inspect metadata, compress files, and validate accessibility basics.',
    icon: 'file-type',
    color: 'amber',
    keywords: ['pdf', 'document', 'print', 'conversion', 'pdf merge'],
    seo: {
      keywords: ['pdf merger', 'pdf splitter', 'pdf to text', 'pdf compressor', 'pdf tools'],
    },
    featuredTools: [],
    relatedCategories: ['text', 'images', 'markdown', 'numbers'],
    featuredArticles: [],
    faqs: [
      {
        question: 'How do I extract text from a PDF?',
        answer:
          'Use a PDF-to-text converter. Scanned documents first need OCR to recognize characters — most converters include an OCR option for image-based pages.',
      },
      {
        question: 'Is it safe to upload documents to PDF tools?',
        answer:
          'Prefer tools that process locally in the browser for sensitive files. If you must use a server-side tool, review its privacy policy and avoid legal or confidential documents.',
      },
    ],
    displayOrder: 26,
  },
  {
    id: 'cat-date-time',
    slug: 'date-time',
    title: 'Date & Time',
    shortDescription: 'Converters and calculators for timestamps, timezones, and date math.',
    longDescription:
      'Date handling is famously tricky: timezones, DST, unix timestamps, and ISO 8601. These utilities convert timestamps in any format, compare times across zones, calculate durations, and generate cron expressions without the headache.',
    icon: 'calendar-clock',
    color: 'violet',
    keywords: ['date', 'time', 'timezone', 'timestamp', 'calendar', 'datetime'],
    seo: {
      keywords: [
        'unix timestamp converter',
        'timezone converter',
        'date calculator',
        'cron generator',
        'iso 8601',
      ],
    },
    featuredTools: [],
    relatedCategories: ['numbers', 'programming', 'text'],
    featuredArticles: [],
    faqs: [
      {
        question: 'What is the safest way to store dates?',
        answer:
          'Store UTC timestamps (ISO 8601 or unix time) and convert to local time only for display. This avoids timezone bugs and makes sorting trivial.',
      },
      {
        question: 'What is a cron expression?',
        answer:
          'A compact schedule syntax with five or six fields (minute, hour, day, month, weekday). Generators build and explain them visually, preventing off-by-one scheduling mistakes.',
      },
    ],
    displayOrder: 27,
  },
  {
    id: 'cat-numbers',
    slug: 'numbers',
    title: 'Numbers',
    shortDescription: 'Calculators and converters for base, unit, and numeric formats.',
    longDescription:
      'Quick numeric helpers every developer needs: base conversion between binary, octal, decimal, and hex; unit and byte conversion; number system format checkers; and simple bitwise and math calculators.',
    icon: 'calculator',
    color: 'blue',
    keywords: ['numbers', 'math', 'conversion', 'calculator', 'units', 'hex'],
    seo: {
      keywords: [
        'base converter',
        'hex to binary',
        'byte converter',
        'unit converter',
        'number tools',
      ],
    },
    featuredTools: [],
    relatedCategories: ['date-time', 'programming', 'encoding', 'sql'],
    featuredArticles: [],
    faqs: [
      {
        question: 'How do I convert between number bases?',
        answer:
          'Base converters translate between binary, octal, decimal, and hex instantly. Knowing how hex bytes map to decimal values is essential for debugging binary protocols and color values.',
      },
      {
        question: 'Why does 0.1 + 0.2 not equal 0.3?',
        answer:
          'Floating point numbers store values in binary, so some decimals cannot be represented exactly. Use integer math or decimal libraries when precision matters.',
      },
    ],
    displayOrder: 28,
  },
  {
    id: 'cat-programming',
    slug: 'programming',
    title: 'Programming',
    shortDescription:
      'General-purpose utilities for developers: snippets, format, and lookup tools.',
    longDescription:
      'The daily driver collection: syntax highlighting, code formatters, cheatsheets, HTTP status references, ASCII tables, and language converters. The tools every developer keeps open in a tab.',
    icon: 'code',
    color: 'primary',
    keywords: ['programming', 'typescript', 'javascript', 'code', 'developer'],
    seo: {
      keywords: [
        'code formatter',
        'cheatsheet',
        'http status codes',
        'ascii table',
        'developer utilities',
      ],
    },
    featuredTools: ['turborepo', 'vitest'],
    relatedCategories: ['regex', 'sql', 'markdown', 'text'],
    featuredArticles: [],
    faqs: [
      {
        question: 'What are the most useful developer utilities?',
        answer:
          'HTTP status reference, ASCII table, code formatters, regex testers, timestamp converters, and cheatsheets for your stack cover the majority of quick lookups.',
      },
      {
        question: 'Should I memorize everything or use lookup tools?',
        answer:
          'Memory matters less than knowing where to find things quickly. Bookmarking a few reliable reference tools is faster and more accurate than recalling syntax from memory.',
      },
    ],
    displayOrder: 29,
  },
  {
    id: 'cat-web',
    slug: 'web',
    title: 'Web',
    shortDescription: 'URL, query string, and HTTP utilities for everyday web development.',
    longDescription:
      'The building blocks of the web — URLs, query strings, HTTP semantics, and browser identity — demystified. Parse URLs into their parts, build them back up, decode query strings, and explore every HTTP status code.',
    icon: 'globe',
    color: 'cyan',
    keywords: ['web', 'url', 'query string', 'http', 'headers', 'user agent'],
    seo: {
      keywords: [
        'url parser',
        'url builder',
        'query string parser',
        'http status codes',
        'user agent parser',
      ],
    },
    featuredTools: [],
    relatedCategories: ['network', 'encoding', 'regex', 'security-tools'],
    featuredArticles: [],
    faqs: [
      {
        question: 'What is a URL exactly?',
        answer:
          'A URL (Uniform Resource Locator) identifies a resource on the web. It decomposes into scheme, authority (host and port), path, query string, and fragment — each with its own encoding rules.',
      },
      {
        question: 'What is the difference between URL encoding and decoding?',
        answer:
          'Encoding replaces unsafe characters with percent sequences so data can travel in URLs; decoding reverses that. Query string parsers do both so you can read and edit parameters safely.',
      },
    ],
    displayOrder: 30,
  },
];
