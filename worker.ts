import database from './tina/database';

interface Env {
  CF_ACCESS_TEAM_DOMAIN: string;
  CF_ACCESS_AUD: string;
  GITHUB_OWNER: string;
  GITHUB_REPO: string;
  GITHUB_PERSONAL_ACCESS_TOKEN: string;
  GITHUB_BRANCH: string;
  KV_REST_API_URL: string;
  KV_REST_API_TOKEN: string;
}

// --- Cloudflare Access JWT verification ---

function base64UrlDecode(str: string): Uint8Array {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

async function verifyAccessJwt(
  jwt: string,
  aud: string,
  teamDomain: string
): Promise<boolean> {
  const parts = jwt.split('.');
  if (parts.length !== 3) return false;

  const [headerB64, payloadB64, signatureB64] = parts;

  // Decode header to find key ID
  const header = JSON.parse(new TextDecoder().decode(base64UrlDecode(headerB64)));
  if (!header.kid) return false;

  // Fetch Cloudflare Access public keys
  const certsUrl = `https://${teamDomain}.cloudflareaccess.com/cdn-cgi/access/certs`;
  const certsRes = await fetch(certsUrl);
  if (!certsRes.ok) return false;

  const { keys } = (await certsRes.json()) as { keys: JsonWebKey[] };
  const jwk = keys.find((k: any) => k.kid === header.kid);
  if (!jwk) return false;

  // Import public key and verify signature
  const publicKey = await crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify']
  );

  const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
  const signature = base64UrlDecode(signatureB64);

  const valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', publicKey, signature, data);
  if (!valid) return false;

  // Check audience and expiry
  const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(payloadB64)));
  if (Array.isArray(payload.aud) ? !payload.aud.includes(aud) : payload.aud !== aud) {
    return false;
  }
  if (payload.exp && Date.now() / 1000 > payload.exp) return false;

  return true;
}

// --- Worker entry ---

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Only handle /api/tina/* routes
    if (!url.pathname.startsWith('/api/tina/')) {
      return new Response('Not Found', { status: 404 });
    }

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': url.origin,
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cf-Access-Jwt-Assertion',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // Verify Cloudflare Access JWT
    const jwt =
      request.headers.get('Cf-Access-Jwt-Assertion') ||
      getCookie(request, 'CF_Authorization');

    if (!jwt) {
      return jsonError('Unauthorized: no access token', 401);
    }

    const authorized = await verifyAccessJwt(jwt, env.CF_ACCESS_AUD, env.CF_ACCESS_TEAM_DOMAIN);
    if (!authorized) {
      return jsonError('Forbidden: invalid access token', 403);
    }

    // Bridge Worker env to process.env for TinaCMS database module
    process.env.GITHUB_OWNER = env.GITHUB_OWNER;
    process.env.GITHUB_REPO = env.GITHUB_REPO;
    process.env.GITHUB_PERSONAL_ACCESS_TOKEN = env.GITHUB_PERSONAL_ACCESS_TOKEN;
    process.env.GITHUB_BRANCH = env.GITHUB_BRANCH;
    process.env.KV_REST_API_URL = env.KV_REST_API_URL;
    process.env.KV_REST_API_TOKEN = env.KV_REST_API_TOKEN;

    // Handle /api/tina/gql
    if (url.pathname === '/api/tina/gql' && request.method === 'POST') {
      try {
        const { query, variables } = (await request.json()) as {
          query: string;
          variables?: Record<string, unknown>;
        };
        const result = await database.request({ query, variables });

        return new Response(JSON.stringify(result), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': url.origin,
          },
        });
      } catch (err: any) {
        console.error('TinaCMS GQL error:', err);
        return jsonError(err.message || 'Internal Server Error', 500);
      }
    }

    return jsonError('Not Found', 404);
  },
} satisfies ExportedHandler<Env>;

// --- Helpers ---

function getCookie(request: Request, name: string): string | null {
  const cookies = request.headers.get('Cookie');
  if (!cookies) return null;
  const match = cookies.split(';').find((c) => c.trim().startsWith(`${name}=`));
  return match ? match.split('=').slice(1).join('=').trim() : null;
}

function jsonError(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
