import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

export function getDb(customDb?: D1Database) {
  if (customDb) {
    return drizzle(customDb, { schema });
  }

  const g = globalThis as any;
  if (g.DB) {
    return drizzle(g.DB, { schema });
  }
  if (g.env?.DB) {
    return drizzle(g.env.DB, { schema });
  }
  if (g.__env__?.DB) {
    return drizzle(g.__env__.DB, { schema });
  }

  try {
    // @ts-ignore
    const { env } = require('cloudflare:workers');
    if (env && env.DB) {
      return drizzle(env.DB, { schema });
    }
  } catch {
    // ignore
  }

  throw new Error('Cloudflare D1 Database binding "DB" not found in environment');
}

export type DbType = ReturnType<typeof getDb>;
export * from './schema';
