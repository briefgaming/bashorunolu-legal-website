import postgres from 'postgres';

export type Sql = ReturnType<typeof postgres>;

const g = globalThis as unknown as { __obSql?: Sql; __obSchema?: Promise<void> };

export const hasDatabase = () => Boolean(process.env.DATABASE_URL);

const SCHEMA = [
  `create table if not exists posts (
    id serial primary key,
    slug text not null unique,
    title text not null,
    topic text not null,
    summary text not null,
    body text not null default '',
    cover_url text,
    cover_alt text not null default '',
    author_name text not null default 'Olu Bashorun & Co',
    author_role text not null default '',
    featured boolean not null default false,
    status text not null default 'draft' check (status in ('draft', 'published')),
    published_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  )`,
  `create index if not exists posts_published_idx on posts (status, published_at desc)`,
  `create table if not exists images (
    id serial primary key,
    content_type text not null,
    data bytea not null,
    created_at timestamptz not null default now()
  )`,
  `create table if not exists login_attempts (
    id serial primary key,
    ip text not null,
    attempted_at timestamptz not null default now()
  )`,
  `create index if not exists login_attempts_ip_idx on login_attempts (ip, attempted_at desc)`,
];

function client(): Sql {
  if (!g.__obSql) {
    g.__obSql = postgres(process.env.DATABASE_URL as string, {
      prepare: false,
      max: 1,
      idle_timeout: 20,
      connect_timeout: 15,
      onnotice: () => {},
    });
  }
  return g.__obSql;
}

/** Returns the shared client, creating the tables on first use. */
export async function db(): Promise<Sql> {
  if (!hasDatabase()) throw new Error('DATABASE_URL is not set');
  const sql = client();
  if (!g.__obSchema) {
    g.__obSchema = (async () => {
      for (const statement of SCHEMA) await sql.unsafe(statement);
    })().catch((error) => {
      g.__obSchema = undefined;
      throw error;
    });
  }
  await g.__obSchema;
  return sql;
}
