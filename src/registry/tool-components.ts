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
};
