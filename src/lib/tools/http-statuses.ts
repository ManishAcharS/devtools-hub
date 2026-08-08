export interface HttpStatusInfo {
  code: number;
  title: string;
  category: 1 | 2 | 3 | 4 | 5;
  description: string;
  whenToUse: string;
  keywords: string[];
}

export const HTTP_STATUSES: HttpStatusInfo[] = [
  {
    code: 100,
    title: 'Continue',
    category: 1,
    description:
      'The server has received the request headers and the client should proceed with the body.',
    whenToUse: 'Rarely set explicitly; used by clients doing expect-continue negotiation.',
    keywords: ['continue', 'expect'],
  },
  {
    code: 101,
    title: 'Switching Protocols',
    category: 1,
    description: 'The server agrees to switch protocols, e.g. upgrading to WebSockets.',
    whenToUse: 'Returned when a client requests an Upgrade header to WebSocket or HTTP/2.',
    keywords: ['websocket', 'upgrade', 'protocol'],
  },
  {
    code: 102,
    title: 'Processing',
    category: 1,
    description: 'The server is still processing the request (WebDAV).',
    whenToUse: 'Sent to avoid client timeouts on slow server-side work.',
    keywords: ['webdav', 'processing'],
  },
  {
    code: 103,
    title: 'Early Hints',
    category: 1,
    description:
      'Sends response headers early so the browser can preload resources while the server finishes.',
    whenToUse: 'Used to push Link headers before the final response.',
    keywords: ['preload', 'hints'],
  },
  {
    code: 200,
    title: 'OK',
    category: 2,
    description:
      'The request succeeded. The meaning of the payload depends on the method: GET returns the resource, POST returns the created result.',
    whenToUse: 'The default success response for most APIs.',
    keywords: ['success', 'ok'],
  },
  {
    code: 201,
    title: 'Created',
    category: 2,
    description:
      'The request succeeded and a new resource was created, usually with a Location header.',
    whenToUse: 'Return after POST requests that create resources.',
    keywords: ['created', 'post'],
  },
  {
    code: 202,
    title: 'Accepted',
    category: 2,
    description: 'The request was accepted for processing, but processing is not complete.',
    whenToUse: 'For async jobs: a task was queued and will complete later.',
    keywords: ['accepted', 'async', 'queue'],
  },
  {
    code: 203,
    title: 'Non-Authoritative Information',
    category: 2,
    description: 'The response was modified by a proxy and may differ from the origin.',
    whenToUse: 'Rarely used; proxies usually pass responses through unchanged.',
    keywords: ['proxy'],
  },
  {
    code: 204,
    title: 'No Content',
    category: 2,
    description: 'The request succeeded but there is no content to send back.',
    whenToUse: 'For DELETE operations or updates that return nothing.',
    keywords: ['no content', 'delete', 'empty'],
  },
  {
    code: 205,
    title: 'Reset Content',
    category: 2,
    description:
      'The server instructs the client to reset the document view that sent the request.',
    whenToUse: 'After form submission, tell the browser to clear the form.',
    keywords: ['reset', 'form'],
  },
  {
    code: 206,
    title: 'Partial Content',
    category: 2,
    description: 'The server delivered only part of the resource, per Range headers.',
    whenToUse: 'Range requests for video streaming and resumable downloads.',
    keywords: ['range', 'streaming', 'partial'],
  },
  {
    code: 207,
    title: 'Multi-Status',
    category: 2,
    description: 'Conveys multiple status codes for multiple operations (WebDAV).',
    whenToUse: 'Batch operations in WebDAV servers.',
    keywords: ['webdav', 'batch'],
  },
  {
    code: 208,
    title: 'Already Reported',
    category: 2,
    description: 'Members of a DAV binding have already been listed (WebDAV).',
    whenToUse: 'Avoids enumerating the same resource twice in PROPFIND.',
    keywords: ['webdav'],
  },
  {
    code: 226,
    title: 'IM Used',
    category: 2,
    description: 'The server fulfilled a request with an instance manipulation applied.',
    whenToUse: 'Delta encoding, where the response is a diff of the resource.',
    keywords: ['delta', 'diff'],
  },
  {
    code: 300,
    title: 'Multiple Choices',
    category: 3,
    description: 'The request has more than one possible response and the client must choose.',
    whenToUse: 'Rarely used; content negotiation alternatives.',
    keywords: ['multiple choices', 'content negotiation'],
  },
  {
    code: 301,
    title: 'Moved Permanently',
    category: 3,
    description:
      'The resource has moved to a new permanent URL. Clients and search engines must update the link.',
    whenToUse: 'Domain or path migrations. Preserves SEO by transferring link equity.',
    keywords: ['redirect', 'moved', 'permanent', 'seo'],
  },
  {
    code: 302,
    title: 'Found',
    category: 3,
    description: 'The resource lives temporarily at a different URL.',
    whenToUse: 'Temporary redirects; the client must keep using the original URL next time.',
    keywords: ['redirect', 'found', 'temporary'],
  },
  {
    code: 303,
    title: 'See Other',
    category: 3,
    description: 'The result of a POST should be fetched with a GET at the given URL.',
    whenToUse: 'POST-redirect-GET pattern after form submissions.',
    keywords: ['post', 'redirect', 'prg'],
  },
  {
    code: 304,
    title: 'Not Modified',
    category: 3,
    description: 'The cached copy is still valid; the server sent no body.',
    whenToUse: 'Conditional requests with If-None-Match or If-Modified-Since.',
    keywords: ['cache', 'not modified', 'etag'],
  },
  {
    code: 305,
    title: 'Use Proxy',
    category: 3,
    description: 'The requested resource must be accessed through the given proxy.',
    whenToUse: 'Deprecated due to security concerns; removed in HTTP/2.',
    keywords: ['proxy', 'deprecated'],
  },
  {
    code: 307,
    title: 'Temporary Redirect',
    category: 3,
    description: 'Like 302 but the method and body must not change.',
    whenToUse: 'Temporary redirects where the HTTP method must be preserved.',
    keywords: ['redirect', 'temporary', 'method'],
  },
  {
    code: 308,
    title: 'Permanent Redirect',
    category: 3,
    description: 'Like 301 but the method and body must not change.',
    whenToUse: 'Permanent moves of API endpoints that must keep POST semantics.',
    keywords: ['redirect', 'permanent', 'method'],
  },
  {
    code: 400,
    title: 'Bad Request',
    category: 4,
    description: 'The server cannot process the request because of malformed syntax.',
    whenToUse: 'Invalid JSON bodies, malformed parameters, or bad encoding.',
    keywords: ['bad request', 'malformed', 'validation'],
  },
  {
    code: 401,
    title: 'Unauthorized',
    category: 4,
    description: 'Authentication is required and has failed or not been provided.',
    whenToUse: 'Missing or invalid credentials; pair with a WWW-Authenticate header.',
    keywords: ['unauthorized', 'auth', 'credentials'],
  },
  {
    code: 402,
    title: 'Payment Required',
    category: 4,
    description: 'Reserved for future use; the request requires payment.',
    whenToUse: 'Rarely used in practice; experiments like API quotas.',
    keywords: ['payment', 'quota'],
  },
  {
    code: 403,
    title: 'Forbidden',
    category: 4,
    description: 'The server understood the request but refuses to authorize it.',
    whenToUse: 'Authenticated users without permission for this resource.',
    keywords: ['forbidden', 'permission', 'authorization'],
  },
  {
    code: 404,
    title: 'Not Found',
    category: 4,
    description: 'The server cannot find the requested resource.',
    whenToUse: 'Unknown endpoints or missing records. The most famous HTTP status.',
    keywords: ['not found', 'missing'],
  },
  {
    code: 405,
    title: 'Method Not Allowed',
    category: 4,
    description: 'The method is known but not supported for this resource.',
    whenToUse: 'POST on a read-only endpoint; include an Allow header.',
    keywords: ['method', 'allow'],
  },
  {
    code: 406,
    title: 'Not Acceptable',
    category: 4,
    description: 'The server cannot produce a response matching the Accept header.',
    whenToUse: 'Content negotiation failures, e.g. requesting an unsupported format.',
    keywords: ['accept', 'content negotiation'],
  },
  {
    code: 407,
    title: 'Proxy Authentication Required',
    category: 4,
    description: 'Authentication with the proxy server is required.',
    whenToUse: 'Same as 401 but for the proxy in front of the origin.',
    keywords: ['proxy', 'auth'],
  },
  {
    code: 408,
    title: 'Request Timeout',
    category: 4,
    description: 'The server gave up waiting for the client to send the full request.',
    whenToUse: 'Slow or stalled clients on long connections.',
    keywords: ['timeout'],
  },
  {
    code: 409,
    title: 'Conflict',
    category: 4,
    description: 'The request conflicts with the current state of the resource.',
    whenToUse: 'Duplicate names, version conflicts, or concurrent edits.',
    keywords: ['conflict', 'duplicate', 'version'],
  },
  {
    code: 410,
    title: 'Gone',
    category: 4,
    description: 'The resource existed but was permanently removed.',
    whenToUse: 'Deprecated API endpoints that should not be linked anymore.',
    keywords: ['gone', 'removed', 'deprecated'],
  },
  {
    code: 411,
    title: 'Length Required',
    category: 4,
    description: 'The request must include a Content-Length header.',
    whenToUse: 'Requests with bodies that omit the length.',
    keywords: ['length', 'content-length'],
  },
  {
    code: 412,
    title: 'Precondition Failed',
    category: 4,
    description: 'One of the request precondition headers failed.',
    whenToUse: 'If-Match or If-Unmodified-Since checks failing.',
    keywords: ['precondition', 'if-match', 'etag'],
  },
  {
    code: 413,
    title: 'Payload Too Large',
    category: 4,
    description: 'The request body exceeds the server limit.',
    whenToUse: 'Upload size limits; include a Retry-After or close the connection.',
    keywords: ['payload', 'upload', 'size'],
  },
  {
    code: 414,
    title: 'URI Too Long',
    category: 4,
    description: 'The URL exceeds the server limit.',
    whenToUse: 'GET requests with excessive query parameters.',
    keywords: ['uri', 'long'],
  },
  {
    code: 415,
    title: 'Unsupported Media Type',
    category: 4,
    description: 'The request body format is not supported.',
    whenToUse: 'POSTing XML to a JSON-only API.',
    keywords: ['media type', 'content-type'],
  },
  {
    code: 416,
    title: 'Range Not Satisfiable',
    category: 4,
    description: 'The Range header cannot be satisfied.',
    whenToUse: 'Requesting a range beyond the end of the file.',
    keywords: ['range'],
  },
  {
    code: 417,
    title: 'Expectation Failed',
    category: 4,
    description: 'The Expect header cannot be satisfied.',
    whenToUse: 'Server does not support 100-continue expectations.',
    keywords: ['expect'],
  },
  {
    code: 418,
    title: "I'm a Teapot",
    category: 4,
    description: 'The server refuses to brew coffee because it is, permanently, a teapot.',
    whenToUse: 'The famous April Fools joke from RFC 2324 — also used for blocking bots.',
    keywords: ['teapot', 'joke', 'rfc 2324'],
  },
  {
    code: 421,
    title: 'Misdirected Request',
    category: 4,
    description: 'The request was directed at a server that cannot produce a response.',
    whenToUse: 'HTTP/2 connection reuse across different origins.',
    keywords: ['http2', 'misdirected'],
  },
  {
    code: 422,
    title: 'Unprocessable Entity',
    category: 4,
    description: 'The request is well-formed but contains semantic errors.',
    whenToUse: 'The standard validation-error response for JSON APIs (WebDAV origin).',
    keywords: ['validation', 'unprocessable'],
  },
  {
    code: 423,
    title: 'Locked',
    category: 4,
    description: 'The resource is locked (WebDAV).',
    whenToUse: 'Concurrent edit protection in WebDAV servers.',
    keywords: ['webdav', 'locked'],
  },
  {
    code: 424,
    title: 'Failed Dependency',
    category: 4,
    description: 'The request failed because a previous request failed (WebDAV).',
    whenToUse: 'Batch operations where one step depends on another.',
    keywords: ['webdav', 'dependency'],
  },
  {
    code: 425,
    title: 'Too Early',
    category: 4,
    description: 'The server refuses to process a request that might be replayed.',
    whenToUse: 'HTTP/2 0-RTT early data protection.',
    keywords: ['early data', 'replay'],
  },
  {
    code: 426,
    title: 'Upgrade Required',
    category: 4,
    description: 'The client should switch to the protocol in the Upgrade header.',
    whenToUse: 'Enforcing TLS on plain HTTP connections.',
    keywords: ['upgrade', 'tls'],
  },
  {
    code: 428,
    title: 'Precondition Required',
    category: 4,
    description: 'The server requires If-Match to prevent lost updates.',
    whenToUse: 'Optimistic locking on shared resources.',
    keywords: ['precondition', 'optimistic locking'],
  },
  {
    code: 429,
    title: 'Too Many Requests',
    category: 4,
    description: 'The client sent too many requests in a given time.',
    whenToUse: 'Rate limiting; include a Retry-After header.',
    keywords: ['rate limit', 'throttle', 'retry-after'],
  },
  {
    code: 431,
    title: 'Request Header Fields Too Large',
    category: 4,
    description: 'The request headers exceed the server limit.',
    whenToUse: 'Oversized cookies or authorization headers.',
    keywords: ['headers', 'cookies', 'size'],
  },
  {
    code: 451,
    title: 'Unavailable For Legal Reasons',
    category: 4,
    description: 'The resource is unavailable due to legal demands.',
    whenToUse: 'Geo-blocking by law; named for Fahrenheit 451.',
    keywords: ['legal', 'geo-blocking'],
  },
  {
    code: 500,
    title: 'Internal Server Error',
    category: 5,
    description: 'The server hit an unexpected condition.',
    whenToUse: 'Unhandled exceptions; log details server-side, never leak them to the client.',
    keywords: ['error', 'exception', 'server'],
  },
  {
    code: 501,
    title: 'Not Implemented',
    category: 5,
    description: 'The server does not support the functionality required.',
    whenToUse: 'Unsupported methods on legacy servers.',
    keywords: ['not implemented'],
  },
  {
    code: 502,
    title: 'Bad Gateway',
    category: 5,
    description: 'An upstream server returned an invalid response.',
    whenToUse: 'A proxy or load balancer cannot reach or understand the backend.',
    keywords: ['gateway', 'proxy', 'upstream'],
  },
  {
    code: 503,
    title: 'Service Unavailable',
    category: 5,
    description:
      'The server is not ready to handle the request, usually due to overload or maintenance.',
    whenToUse: 'Maintenance windows; include a Retry-After header.',
    keywords: ['unavailable', 'maintenance', 'overload'],
  },
  {
    code: 504,
    title: 'Gateway Timeout',
    category: 5,
    description: 'An upstream server did not respond in time.',
    whenToUse: 'Slow backends behind proxies or CDNs.',
    keywords: ['gateway', 'timeout'],
  },
  {
    code: 505,
    title: 'HTTP Version Not Supported',
    category: 5,
    description: 'The server does not support the HTTP version used.',
    whenToUse: 'Legacy servers receiving HTTP/2 requests.',
    keywords: ['http version'],
  },
  {
    code: 506,
    title: 'Variant Also Negotiates',
    category: 5,
    description: 'Content negotiation loops due to circular references.',
    whenToUse: 'Misconfigured transparent content negotiation.',
    keywords: ['negotiation', 'variant'],
  },
  {
    code: 507,
    title: 'Insufficient Storage',
    category: 5,
    description: 'The server cannot store the representation needed (WebDAV).',
    whenToUse: 'Storage exhaustion in WebDAV servers.',
    keywords: ['storage', 'webdav'],
  },
  {
    code: 508,
    title: 'Loop Detected',
    category: 5,
    description: 'The server detected an infinite processing loop.',
    whenToUse: 'Recursive DAV operations or redirect loops.',
    keywords: ['loop'],
  },
  {
    code: 510,
    title: 'Not Extended',
    category: 5,
    description: 'Further extensions are required to fulfil the request.',
    whenToUse: 'Very rare; RFC 2774 extension negotiation.',
    keywords: ['extension'],
  },
  {
    code: 511,
    title: 'Network Authentication Required',
    category: 5,
    description: 'The client must authenticate to the network (captive portal).',
    whenToUse: 'Wi-Fi login pages that intercept traffic.',
    keywords: ['captive portal', 'network auth'],
  },
];

export function getHttpStatus(code: number): HttpStatusInfo | undefined {
  return HTTP_STATUSES.find((status) => status.code === code);
}

export function searchHttpStatuses(query: string): HttpStatusInfo[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return HTTP_STATUSES;
  return HTTP_STATUSES.filter((status) => {
    if (status.code.toString().startsWith(normalized)) return true;
    if (status.title.toLowerCase().includes(normalized)) return true;
    if (status.description.toLowerCase().includes(normalized)) return true;
    return status.keywords.some((keyword) => keyword.includes(normalized));
  });
}

export function httpStatusCategoryLabel(category: number): string {
  switch (category) {
    case 1:
      return 'Informational';
    case 2:
      return 'Success';
    case 3:
      return 'Redirection';
    case 4:
      return 'Client error';
    default:
      return 'Server error';
  }
}
