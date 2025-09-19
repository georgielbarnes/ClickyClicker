
export interface Env {
  BLOG_KV: KVNamespace;
  BLOG_ASSETS: R2Bucket;
  JWT_SECRET: string;
  ADMIN_USER: string;
  ADMIN_PASS: string;
  PUBLIC_CDN_BASE?: string;
}

const TOKEN_NAME = 'fb_token';

async function hmac(secret: string, data: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

export async function createToken(env: Env, subject: string, ttlSec = 60 * 60 * 8) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const payload = btoa(JSON.stringify({ sub: subject, iat: now, exp: now + ttlSec }));
  const unsigned = `${header}.${payload}`;
  const sig = await hmac(env.JWT_SECRET, unsigned);
  return `${unsigned}.${sig}`;
}

export async function verifyToken(env: Env, token: string | null) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, payload, sig] = parts;
  const unsigned = `${header}.${payload}`;
  const good = await hmac(env.JWT_SECRET, unsigned);
  if (good !== sig) return null;
  const data = JSON.parse(atob(payload));
  if (data.exp && Date.now()/1000 > data.exp) return null;
  return data as { sub: string; iat: number; exp: number };
}

export function getTokenFromCookie(req: Request) {
  const cookie = req.headers.get('cookie') || '';
  const m = cookie.match(new RegExp(`${TOKEN_NAME}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : null;
}

export function authGuard(handler: (c: {req: Request, env: Env}) => Promise<Response>) {
  return async (req: Request, env: Env) => {
    const token = getTokenFromCookie(req);
    const data = await verifyToken(env, token);
    if (!data) {
      return new Response(JSON.stringify({ ok: false, error: 'unauthorized' }), { status: 401, headers: {'content-type':'application/json'}});
    }
    return handler({ req, env });
  };
}

export function setAuthCookie(token: string) {
  const secure = true;
  const cookie = `fb_token=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=28800; ${secure ? 'Secure;' : ''}`;
  return cookie;
}

export function clearAuthCookie() {
  return 'fb_token=; Path=/; HttpOnly; Max-Age=0; SameSite=Strict; Secure;';
}
