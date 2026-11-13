/**
 * Kiran Automation HRMS Cloudflare Worker API Edge Gateway
 *
 * Security responsibilities:
 * - Enforces strict CORS allowlist (GitHub Pages origin only)
 * - Validates and allowlists HRMS API and media paths
 * - Authenticates upstream HTTPS requests to Lightsail via secret X-Bridge-Secret header
 * - Preserves JWT headers (Authorization, x-access-token, x-domain, x-user-id, etc.)
 */

const ALLOWED_METHODS = 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS';
const ALLOWED_HEADERS = [
  'Content-Type',
  'Authorization',
  'x-domain',
  'x-access-token',
  'x-entity-id',
  'x-user-id',
  'session-id',
  'x-skip-loader',
  'x-idempotency-key',
].join(', ');

const ALLOWED_PATH_PREFIXES = [
  '/api/',
  '/erp-api/',
  '/uploaded_files/',
  '/digital_signature/',
  '/leadfile/',
  '/masterDocument/',
];

function getAllowedOrigins(env) {
  return String(env.ALLOWED_ORIGIN || '')
    .split(',')
    .map((o) => o.trim().replace(/\/$/, ''))
    .filter(Boolean);
}

function isAllowedPath(pathname) {
  if (
    pathname === '/' ||
    pathname === '/health' ||
    pathname === '/worker-health' ||
    pathname === '/erp-api' ||
    pathname === '/erp-api/' ||
    pathname === '/erp-api/health'
  ) {
    return true;
  }
  return ALLOWED_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function buildCorsHeaders(origin, allowedOrigins) {
  const headers = new Headers();
  if (origin && allowedOrigins.includes(origin)) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Credentials', 'true');
    headers.set('Vary', 'Origin');
  }
  headers.set('Access-Control-Allow-Methods', ALLOWED_METHODS);
  headers.set('Access-Control-Allow-Headers', ALLOWED_HEADERS);
  headers.set('Access-Control-Max-Age', '86400');
  return headers;
}

function addSecurityHeaders(headers, isApiRoute) {
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'SAMEORIGIN');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.delete('X-Powered-By');
  headers.delete('Server');
  if (isApiRoute && !headers.has('Cache-Control')) {
    headers.set('Cache-Control', 'no-store');
  }
}

function jsonResponse(body, status, corsHeaders) {
  const headers = new Headers(corsHeaders);
  headers.set('Content-Type', 'application/json; charset=utf-8');
  addSecurityHeaders(headers, true);
  return new Response(JSON.stringify(body), { status, headers });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = (request.headers.get('Origin') || '').replace(/\/$/, '');
    const allowedOrigins = getAllowedOrigins(env);

    // 1. Validate browser Origin against strict CORS allowlist
    if (origin && !allowedOrigins.includes(origin)) {
      return jsonResponse({ status: 'error', message: 'Origin not allowed' }, 403, new Headers());
    }

    const corsHeaders = buildCorsHeaders(origin, allowedOrigins);

    // 2. Handle CORS preflight immediately at edge
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // 3. Path traversal & route allowlist check
    const rawPathname = url.pathname;
    if (rawPathname.includes('..') || rawPathname.includes('\0')) {
      return jsonResponse({ status: 'error', message: 'Invalid path' }, 400, corsHeaders);
    }

    if (!isAllowedPath(rawPathname)) {
      return jsonResponse({ status: 'error', message: 'Not Found' }, 404, corsHeaders);
    }

    // Edge-only lightweight health check
    if (rawPathname === '/worker-health') {
      return jsonResponse({ status: 'ok', service: 'hrms-api-worker' }, 200, corsHeaders);
    }

    // 4. Verify Lightsail HTTPS bridge configuration
    const bridgeUrl = String(env.BRIDGE_URL || '').trim().replace(/\/$/, '');
    const bridgeSecret = String(env.BRIDGE_SECRET || '').trim();

    if (!bridgeUrl || !bridgeUrl.startsWith('https://')) {
      return jsonResponse(
        { status: 'error', message: 'Upstream HTTPS bridge is not configured' },
        500,
        corsHeaders
      );
    }

    if (!bridgeSecret) {
      return jsonResponse(
        { status: 'error', message: 'Bridge authentication secret is missing' },
        500,
        corsHeaders
      );
    }

    // 5. Build upstream HTTPS request with shared bridge authentication header
    const upstreamUrl = `${bridgeUrl}${rawPathname}${url.search}`;
    const forwardHeaders = new Headers();

    for (const [key, value] of request.headers.entries()) {
      const lower = key.toLowerCase();
      if (
        lower === 'host' ||
        lower === 'connection' ||
        lower === 'content-length' ||
        lower === 'transfer-encoding' ||
        lower === 'x-bridge-secret' ||
        lower.startsWith('cf-')
      ) {
        continue;
      }
      forwardHeaders.set(key, value);
    }

    forwardHeaders.set('X-Bridge-Secret', bridgeSecret);
    forwardHeaders.set('X-Forwarded-Host', url.host);
    forwardHeaders.set('X-Forwarded-Proto', 'https');
    const clientIp = request.headers.get('CF-Connecting-IP');
    if (clientIp) {
      forwardHeaders.set('X-Forwarded-For', clientIp);
    }

    const hasBody = !['GET', 'HEAD'].includes(request.method.toUpperCase());

    try {
      const upstreamResponse = await fetch(upstreamUrl, {
        method: request.method,
        headers: forwardHeaders,
        body: hasBody ? request.body : undefined,
        redirect: 'manual',
      });

      // 6. Sanitize upstream headers and attach strict Worker CORS + security headers
      const responseHeaders = new Headers(upstreamResponse.headers);
      responseHeaders.delete('Access-Control-Allow-Origin');
      responseHeaders.delete('Access-Control-Allow-Methods');
      responseHeaders.delete('Access-Control-Allow-Headers');
      responseHeaders.delete('Access-Control-Allow-Credentials');

      for (const [k, v] of corsHeaders.entries()) {
        responseHeaders.set(k, v);
      }

      addSecurityHeaders(
        responseHeaders,
        rawPathname.startsWith('/api/') || rawPathname.startsWith('/erp-api/')
      );

      return new Response(upstreamResponse.body, {
        status: upstreamResponse.status,
        statusText: upstreamResponse.statusText,
        headers: responseHeaders,
      });
    } catch (err) {
      return jsonResponse(
        { status: 'error', message: 'Upstream Lightsail bridge unavailable' },
        502,
        corsHeaders
      );
    }
  },
};
