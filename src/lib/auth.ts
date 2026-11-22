/** Single-password admin sign-in using signed, expiring cookies. Works in the Edge runtime. */
export const SESSION_COOKIE = 'ob_admin';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

const encoder = new TextEncoder();

const toHex = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

async function hmac(key: string, message: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey('raw', encoder.encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return toHex(await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(message)));
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

const secret = () => process.env.ADMIN_PASSWORD ?? '';

export const adminConfigured = () => secret().length >= 8;

export async function checkPassword(input: string): Promise<boolean> {
  if (!adminConfigured()) return false;
  const [a, b] = await Promise.all([hmac('password-check', input), hmac('password-check', secret())]);
  return safeEqual(a, b);
}

export async function createSession(): Promise<string> {
  const expires = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  return `${expires}.${await hmac(secret(), `session:${expires}`)}`;
}

export async function verifySession(token: string | undefined): Promise<boolean> {
  if (!token || !adminConfigured()) return false;
  const [expires, signature] = token.split('.');
  if (!expires || !signature || Number(expires) < Date.now() / 1000) return false;
  return safeEqual(signature, await hmac(secret(), `session:${expires}`));
}
