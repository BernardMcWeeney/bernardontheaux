import { createDatabase } from '@tinacms/datalayer';
import { GitHubProvider } from 'tinacms-gitprovider-github';
import { Redis } from '@upstash/redis';
import RedisLevelPkg from 'upstash-redis-level';

// Handle CJS/ESM interop — the package may export RedisLevel as default or named
const RedisLevel = (RedisLevelPkg as any).RedisLevel ?? RedisLevelPkg;

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

  const header = JSON.parse(new TextDecoder().decode(base64UrlDecode(headerB64)));
  if (!header.kid) return false;

  const certsUrl = `https://${teamDomain}.cloudflareaccess.com/cdn-cgi/access/certs`;
  const certsRes = await fetch(certsUrl);
  if (!certsRes.ok) return false;

  const { keys } = (await certsRes.json()) as { keys: JsonWebKey[] };
  const jwk = keys.find((k: any) => k.kid === header.kid);
  if (!jwk) return false;

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

  const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(payloadB64)));
  if (Array.isArray(payload.aud) ? !payload.aud.includes(aud) : payload.aud !== aud) {
    return false;
  }
  if (payload.exp && Date.now() / 1000 > payload.exp) return false;

  return true;
}

// --- Production database (created once per Worker instance) ---

let _db: ReturnType<typeof createDatabase> | null = null;

function getDatabase(env: Env) {
  if (_db) return _db;

  const branch = env.GITHUB_BRANCH || 'main';

  _db = createDatabase({
    gitProvider: new GitHubProvider({
      repo: env.GITHUB_REPO,
      owner: env.GITHUB_OWNER,
      token: env.GITHUB_PERSONAL_ACCESS_TOKEN,
      branch,
    }),
    databaseAdapter: new RedisLevel({
      redis: new Redis({
        url: env.KV_REST_API_URL,
        token: env.KV_REST_API_TOKEN,
      }),
      debug: false,
      namespace: branch,
    }),
  });

  return _db;
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

    // Handle /api/tina/gql
    if (url.pathname === '/api/tina/gql' && request.method === 'POST') {
      try {
        const database = getDatabase(env);
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
