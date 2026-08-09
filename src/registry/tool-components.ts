import type { ToolComponent } from '@/types';
import { Base64EncoderDecoder } from '@/components/tools/base64-encoder-decoder';
import { UrlEncoderDecoder } from '@/components/tools/url-encoder-decoder';
import { XmlFormatterTool, XmlMinifierTool } from '@/components/tools/xml-formatter';
import { XmlValidator } from '@/components/tools/xml-validator';
import { XmlToJson } from '@/components/tools/xml-to-json';
import { CsvViewer } from '@/components/tools/csv-viewer';
import { CsvToJson } from '@/components/tools/csv-to-json';
import { JsonToCsv } from '@/components/tools/json-to-csv';
import { CsvFormatter } from '@/components/tools/csv-formatter';
import { YamlFormatter } from '@/components/tools/yaml-formatter';
import { YamlValidator } from '@/components/tools/yaml-validator';
import { YamlToJson } from '@/components/tools/yaml-to-json';
import { JsonToYaml } from '@/components/tools/json-to-yaml';
import { MarkdownPreview } from '@/components/tools/markdown-preview';
import { MarkdownToHtml } from '@/components/tools/markdown-to-html';
import { HtmlToMarkdown } from '@/components/tools/html-to-markdown';
import { MarkdownFormatter } from '@/components/tools/markdown-formatter';
import { SqlFormatterTool, SqlMinifierTool } from '@/components/tools/sql-formatter';
import { SqlValidator } from '@/components/tools/sql-validator';
import { RegexTester } from '@/components/tools/regex-tester';
import { RegexGenerator } from '@/components/tools/regex-generator';
import { RegexCheatsheet } from '@/components/tools/regex-cheatsheet';
import { IpLookup } from '@/components/tools/ip-lookup';
import { CidrCalculator } from '@/components/tools/cidr-calculator';
import { DnsLookup } from '@/components/tools/dns-lookup';
import { UserAgentParser } from '@/components/tools/user-agent-parser';
import { TimestampConverter } from '@/components/tools/timestamp-converter';
import { UnixTimeConverter } from '@/components/tools/unix-time-converter';
import { DateDifferenceCalculator } from '@/components/tools/date-difference-calculator';
import { TimezoneConverter } from '@/components/tools/timezone-converter';
import { UuidGenerator } from '@/components/tools/uuid-generator';
import { JwtDecoder } from '@/components/tools/jwt-decoder';
import { JwtInspector } from '@/components/tools/jwt-inspector';
import { SlugGenerator } from '@/components/tools/slug-generator';
import { LoremIpsumGenerator } from '@/components/tools/lorem-ipsum-generator';
import { RandomNumberGenerator } from '@/components/tools/random-number-generator';
import { NumberBaseConverter } from '@/components/tools/number-base-converter';
import { PercentageCalculator } from '@/components/tools/percentage-calculator';
import { RomanNumeralConverter } from '@/components/tools/roman-numeral-converter';
import { UrlParser } from '@/components/tools/url-parser';
import { UrlBuilder } from '@/components/tools/url-builder';
import { QueryStringParser } from '@/components/tools/query-string-parser';
import { HttpStatusExplorer } from '@/components/tools/http-status-explorer';
import { Md5Generator } from '@/components/tools/md5-generator';
import { Sha1Generator } from '@/components/tools/sha1-generator';
import { Sha256Generator } from '@/components/tools/sha256-generator';
import { Sha512Generator } from '@/components/tools/sha512-generator';
import { HmacGenerator } from '@/components/tools/hmac-generator';
import { FileHashGenerator } from '@/components/tools/file-hash-generator';
import { ImageCompressor } from '@/components/tools/image-compressor';
import { ImageResizer } from '@/components/tools/image-resizer';
import { ImageCropper } from '@/components/tools/image-cropper';
import { ImageFormatConverter } from '@/components/tools/image-format-converter';
import { ImageMetadataViewer } from '@/components/tools/image-metadata-viewer';
import { Base64ImageConverter } from '@/components/tools/base64-image-converter';
import { JsonFormatterTool, JsonMinifierTool } from '@/components/tools/json-formatter';
import { JsonValidator } from '@/components/tools/json-validator';
import { CaseConverter } from '@/components/tools/case-converter';
import { CharacterCounter } from '@/components/tools/character-counter';
import { TextDiff } from '@/components/tools/text-diff';
import { ColorConverter } from '@/components/tools/color-converter';
import { ColorPaletteGenerator } from '@/components/tools/color-palette-generator';
import { ColorContrastChecker } from '@/components/tools/color-contrast-checker';
import { PdfInfo } from '@/components/tools/pdf-info';
import { PdfTextExtractor } from '@/components/tools/pdf-text-extractor';
import { PdfPagesToImages } from '@/components/tools/pdf-pages-to-images';
import { ImagesToPdf } from '@/components/tools/images-to-pdf';

// New tools
import { TextReverser } from '@/components/tools/text-reverser';
import { WhitespaceRemover } from '@/components/tools/whitespace-remover';
import { FindReplace } from '@/components/tools/find-replace';
import { KeywordDensityChecker } from '@/components/tools/keyword-density-checker';
import { PasswordStrengthChecker } from '@/components/tools/password-strength-checker';
import { PrimeNumberChecker } from '@/components/tools/prime-number-checker';
import { GcdLcmCalculator } from '@/components/tools/gcd-lcm-calculator';
import { UnitConverter } from '@/components/tools/unit-converter';
import { AgeCalculator } from '@/components/tools/age-calculator';
import { WorkingDaysCalculator } from '@/components/tools/working-days-calculator';
import { Iso8601Converter } from '@/components/tools/iso-8601-converter';
import { CountdownTimer } from '@/components/tools/countdown-timer';
import { JsonToXml } from '@/components/tools/json-to-xml';
import { CodeFormatter } from '@/components/tools/code-formatter';
import { GitignoreGenerator } from '@/components/tools/gitignore-generator';
import { ReadmeGenerator } from '@/components/tools/readme-generator';
import { LicenseGenerator } from '@/components/tools/license-generator';
import { CronGenerator } from '@/components/tools/cron-generator';
import { GradientGenerator } from '@/components/tools/gradient-generator';
import { BoxShadowGenerator } from '@/components/tools/box-shadow-generator';
import { BorderRadiusGenerator } from '@/components/tools/border-radius-generator';
import { ClipPathGenerator } from '@/components/tools/clip-path-generator';
import { PxRemConverter } from '@/components/tools/px-rem-converter';
import { ColorBlindnessSimulator } from '@/components/tools/color-blindness-simulator';
import { FaviconGenerator } from '@/components/tools/favicon-generator';
import { MetaTagGenerator } from '@/components/tools/meta-tag-generator';
import { OpenGraphPreview } from '@/components/tools/open-graph-preview';
import { RobotsTxtGenerator } from '@/components/tools/robots-txt-generator';
import { SitemapGenerator } from '@/components/tools/sitemap-generator';
import { HtaccessGenerator } from '@/components/tools/htaccess-generator';
import { WhatIsMyIp } from '@/components/tools/what-is-my-ip';
import { SvgOptimizer } from '@/components/tools/svg-optimizer';
import { CsvToExcel } from '@/components/tools/csv-to-excel';
import { ExcelToCsv } from '@/components/tools/excel-to-csv';
import { BcryptGenerator } from '@/components/tools/bcrypt-generator';
import { KeypairGenerator } from '@/components/tools/keypair-generator';
import { QrCodeGenerator } from '@/components/tools/qr-code-generator';
import { QrCodeScanner } from '@/components/tools/qr-code-scanner';
import { CurrencyConverter } from '@/components/tools/currency-converter';

// Phase 9 tools
import { AltTextChecker } from '@/components/tools/alt-text-checker';
import { ApiKeyGenerator } from '@/components/tools/api-key-generator';
import { AriaReference } from '@/components/tools/aria-reference';
import { AspectRatioCalculator } from '@/components/tools/aspect-ratio-calculator';
import { Base32Converter } from '@/components/tools/base32-converter';
import { BasicAuthHeaderGenerator } from '@/components/tools/basic-auth-header-generator';
import { ChangelogGenerator } from '@/components/tools/changelog-generator';
import { JsonFileConverter } from '@/components/tools/config-file-converter';
import { ConnectionStringParser } from '@/components/tools/connection-string-parser';
import { ConventionalCommitGenerator } from '@/components/tools/conventional-commit-generator';
import { CoordinateConverter } from '@/components/tools/coordinate-converter';
import { CSSAnimationGenerator } from '@/components/tools/css-animation-generator';
import { CSSSpecificityCalculator } from '@/components/tools/css-specificity-calculator';
import { CSSTriangleGenerator } from '@/components/tools/css-triangle-generator';
import { CsvToSql } from '@/components/tools/csv-to-sql';
import { CurlGenerator } from '@/components/tools/curl-generator';
import { DiceRoller } from '@/components/tools/dice-roller';
import { DockerfileGenerator } from '@/components/tools/dockerfile-generator';
import { DuplicateLineRemover } from '@/components/tools/duplicate-line-remover';
import { EnvFileGenerator } from '@/components/tools/env-file-generator';
import { FactorialFibonacciGenerator } from '@/components/tools/factorial-fibonacci-generator';
import { FileSizeConverter } from '@/components/tools/file-size-converter';
import { GitCheatsheet } from '@/components/tools/git-cheatsheet';
import { GlassmorphismGenerator } from '@/components/tools/glassmorphism-generator';
import { GraphqlFormatter } from '@/components/tools/graphql-formatter';
import { HtmlEntityConverter } from '@/components/tools/html-entity-converter';
import { HtmlTableGenerator } from '@/components/tools/html-table-generator';
import { HtpasswdGenerator } from '@/components/tools/htpasswd-generator';
import { JsonLdGenerator } from '@/components/tools/json-ld-generator';
import { JsonSchemaGenerator } from '@/components/tools/json-schema-generator';
import { JsonToStructs } from '@/components/tools/json-to-structs';
import { JsonToTypeScript } from '@/components/tools/json-to-typescript';
import { JwtEncoder } from '@/components/tools/jwt-encoder';
import { MacAddressGenerator } from '@/components/tools/mac-address-generator';
import { MarkdownTableGenerator } from '@/components/tools/markdown-table-generator';
import { MockDataGenerator } from '@/components/tools/mock-data-generator';
import { MorseCodeTranslator } from '@/components/tools/morse-code-translator';
import { NumberToWords } from '@/components/tools/number-to-words';
import { PalindromeChecker } from '@/components/tools/palindrome-checker';
import { PlaceholderImageGenerator } from '@/components/tools/placeholder-image-generator';
import { PunycodeConverter } from '@/components/tools/punycode-converter';
import { QuadraticSolver } from '@/components/tools/quadratic-solver';
import { RandomColorGenerator } from '@/components/tools/random-color-generator';
import { ReadabilityScore } from '@/components/tools/readability-score';
import { RruleCalculator } from '@/components/tools/rrule-calculator';
import { StatisticsCalculator } from '@/components/tools/statistics-calculator';
import { SvgWaveGenerator } from '@/components/tools/svg-wave-generator';
import { TextSorter } from '@/components/tools/text-sorter';
import { TimezoneMeetingPlanner } from '@/components/tools/timezone-meeting-planner';
import { TwitterCardPreview } from '@/components/tools/twitter-card-preview';
import { WorkingDaysAdder } from '@/components/tools/working-days-adder';

export const toolComponents: Record<string, ToolComponent> = {
  'base64-encoder-decoder': Base64EncoderDecoder,
  'url-encoder-decoder': UrlEncoderDecoder,
  'xml-formatter': XmlFormatterTool,
  'xml-minifier': XmlMinifierTool,
  'xml-validator': XmlValidator,
  'xml-to-json': XmlToJson,
  'csv-viewer': CsvViewer,
  'csv-to-json': CsvToJson,
  'json-to-csv': JsonToCsv,
  'csv-formatter': CsvFormatter,
  'yaml-formatter': YamlFormatter,
  'yaml-validator': YamlValidator,
  'yaml-to-json': YamlToJson,
  'json-to-yaml': JsonToYaml,
  'markdown-preview': MarkdownPreview,
  'markdown-to-html': MarkdownToHtml,
  'html-to-markdown': HtmlToMarkdown,
  'markdown-formatter': MarkdownFormatter,
  'sql-formatter': SqlFormatterTool,
  'sql-minifier': SqlMinifierTool,
  'sql-validator': SqlValidator,
  'regex-tester': RegexTester,
  'regex-generator': RegexGenerator,
  'regex-cheatsheet': RegexCheatsheet,
  'ip-lookup': IpLookup,
  'cidr-calculator': CidrCalculator,
  'dns-lookup': DnsLookup,
  'user-agent-parser': UserAgentParser,
  'timestamp-converter': TimestampConverter,
  'unix-time-converter': UnixTimeConverter,
  'date-difference-calculator': DateDifferenceCalculator,
  'timezone-converter': TimezoneConverter,
  'uuid-generator': UuidGenerator,
  'jwt-decoder': JwtDecoder,
  'jwt-inspector': JwtInspector,
  'slug-generator': SlugGenerator,
  'lorem-ipsum-generator': LoremIpsumGenerator,
  'random-number-generator': RandomNumberGenerator,
  'number-base-converter': NumberBaseConverter,
  'percentage-calculator': PercentageCalculator,
  'roman-numeral-converter': RomanNumeralConverter,
  'url-parser': UrlParser,
  'url-builder': UrlBuilder,
  'query-string-parser': QueryStringParser,
  'http-status-explorer': HttpStatusExplorer,
  'md5-generator': Md5Generator,
  'sha1-generator': Sha1Generator,
  'sha256-generator': Sha256Generator,
  'sha512-generator': Sha512Generator,
  'hmac-generator': HmacGenerator,
  'file-hash-generator': FileHashGenerator,
  'image-compressor': ImageCompressor,
  'image-resizer': ImageResizer,
  'image-cropper': ImageCropper,
  'image-format-converter': ImageFormatConverter,
  'image-metadata-viewer': ImageMetadataViewer,
  'base64-image-converter': Base64ImageConverter,
  'json-formatter': JsonFormatterTool,
  'json-minifier': JsonMinifierTool,
  'json-validator': JsonValidator,
  'case-converter': CaseConverter,
  'character-counter': CharacterCounter,
  'text-diff': TextDiff,
  'color-converter': ColorConverter,
  'color-palette-generator': ColorPaletteGenerator,
  'color-contrast-checker': ColorContrastChecker,
  'pdf-info': PdfInfo,
  'pdf-text-extractor': PdfTextExtractor,
  'pdf-pages-to-images': PdfPagesToImages,
  'images-to-pdf': ImagesToPdf,

  // New tools
  'text-reverser': TextReverser,
  'whitespace-remover': WhitespaceRemover,
  'find-replace': FindReplace,
  'keyword-density-checker': KeywordDensityChecker,
  'password-strength-checker': PasswordStrengthChecker,
  'prime-number-checker': PrimeNumberChecker,
  'gcd-lcm-calculator': GcdLcmCalculator,
  'unit-converter': UnitConverter,
  'age-calculator': AgeCalculator,
  'working-days-calculator': WorkingDaysCalculator,
  'iso-8601-converter': Iso8601Converter,
  'countdown-timer': CountdownTimer,
  'json-to-xml': JsonToXml,
  'code-formatter': CodeFormatter,
  'gitignore-generator': GitignoreGenerator,
  'readme-generator': ReadmeGenerator,
  'license-generator': LicenseGenerator,
  'cron-generator': CronGenerator,
  'gradient-generator': GradientGenerator,
  'box-shadow-generator': BoxShadowGenerator,
  'border-radius-generator': BorderRadiusGenerator,
  'clip-path-generator': ClipPathGenerator,
  'px-rem-converter': PxRemConverter,
  'color-blindness-simulator': ColorBlindnessSimulator,
  'favicon-generator': FaviconGenerator,
  'meta-tag-generator': MetaTagGenerator,
  'open-graph-preview': OpenGraphPreview,
  'robots-txt-generator': RobotsTxtGenerator,
  'sitemap-generator': SitemapGenerator,
  'htaccess-generator': HtaccessGenerator,
  'what-is-my-ip': WhatIsMyIp,
  'svg-optimizer': SvgOptimizer,
  'csv-to-excel': CsvToExcel,
  'excel-to-csv': ExcelToCsv,
  'bcrypt-generator': BcryptGenerator,
  'keypair-generator': KeypairGenerator,
  'qr-code-generator': QrCodeGenerator,
  'qr-code-scanner': QrCodeScanner,
  'currency-converter': CurrencyConverter,

  // Phase 9 tools
  'alt-text-checker': AltTextChecker,
  'api-key-generator': ApiKeyGenerator,
  'aria-reference': AriaReference,
  'aspect-ratio-calculator': AspectRatioCalculator,
  'base32-converter': Base32Converter,
  'basic-auth-header-generator': BasicAuthHeaderGenerator,
  'changelog-generator': ChangelogGenerator,
  'config-file-converter': JsonFileConverter,
  'connection-string-parser': ConnectionStringParser,
  'conventional-commit-generator': ConventionalCommitGenerator,
  'coordinate-converter': CoordinateConverter,
  'css-animation-generator': CSSAnimationGenerator,
  'css-specificity-calculator': CSSSpecificityCalculator,
  'css-triangle-generator': CSSTriangleGenerator,
  'csv-to-sql': CsvToSql,
  'curl-generator': CurlGenerator,
  'dice-roller': DiceRoller,
  'dockerfile-generator': DockerfileGenerator,
  'duplicate-line-remover': DuplicateLineRemover,
  'env-file-generator': EnvFileGenerator,
  'factorial-fibonacci-generator': FactorialFibonacciGenerator,
  'file-size-converter': FileSizeConverter,
  'git-cheatsheet': GitCheatsheet,
  'glassmorphism-generator': GlassmorphismGenerator,
  'graphql-formatter': GraphqlFormatter,
  'html-entity-converter': HtmlEntityConverter,
  'html-table-generator': HtmlTableGenerator,
  'htpasswd-generator': HtpasswdGenerator,
  'json-ld-generator': JsonLdGenerator,
  'json-schema-generator': JsonSchemaGenerator,
  'json-to-structs': JsonToStructs,
  'json-to-typescript': JsonToTypeScript,
  'jwt-encoder': JwtEncoder,
  'mac-address-generator': MacAddressGenerator,
  'markdown-table-generator': MarkdownTableGenerator,
  'mock-data-generator': MockDataGenerator,
  'morse-code-translator': MorseCodeTranslator,
  'number-to-words': NumberToWords,
  'palindrome-checker': PalindromeChecker,
  'placeholder-image-generator': PlaceholderImageGenerator,
  'punycode-converter': PunycodeConverter,
  'quadratic-solver': QuadraticSolver,
  'random-color-generator': RandomColorGenerator,
  'readability-score': ReadabilityScore,
  'rrule-calculator': RruleCalculator,
  'statistics-calculator': StatisticsCalculator,
  'svg-wave-generator': SvgWaveGenerator,
  'text-sorter': TextSorter,
  'timezone-meeting-planner': TimezoneMeetingPlanner,
  'twitter-card-preview': TwitterCardPreview,
  'working-days-adder': WorkingDaysAdder,
};
