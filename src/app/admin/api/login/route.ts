import { NextResponse } from 'next/server';
import { SESSION_COOKIE, SESSION_MAX_AGE, adminConfigured, checkPassword, createSession } from '@/lib/auth';
import { clearFailures, isBlocked, recordFailure } from '@/lib/throttle';

export const dynamic = 'force-dynamic';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request: Request) {
  if (!adminConfigured()) {
    return NextResponse.json({ error: 'Admin sign-in has not been set up yet.' }, { status: 503 });
  }
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  if (await isBlocked(ip)) {
    return NextResponse.json({ error: 'Too many attempts. Please try again in 15 minutes.' }, { status: 429 });
  }

  let password = '';
  try {
    password = String((await request.json()).password ?? '');
  } catch {
    /* empty body */
  }
  if (!(await checkPassword(password))) {
    await recordFailure(ip);
    await sleep(500);
    return NextResponse.json({ error: 'That password is not right.' }, { status: 401 });
  }

  await clearFailures(ip);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, await createSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
  return response;
}
