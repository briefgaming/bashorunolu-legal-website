import { db } from './db';

const MAX_FAILURES = 5;

/** Blocks an address after 5 wrong passwords in 15 minutes. */
export async function isBlocked(ip: string): Promise<boolean> {
  const sql = await db();
  const rows = await sql<{ n: number }[]>`
    select count(*)::int as n from login_attempts where ip = ${ip} and attempted_at > now() - interval '15 minutes'`;
  return rows[0].n >= MAX_FAILURES;
}

export async function recordFailure(ip: string): Promise<void> {
  const sql = await db();
  await sql`insert into login_attempts (ip) values (${ip})`;
  await sql`delete from login_attempts where attempted_at < now() - interval '1 day'`;
}

export async function clearFailures(ip: string): Promise<void> {
  const sql = await db();
  await sql`delete from login_attempts where ip = ${ip}`;
}
