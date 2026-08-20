import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

// During build/CI environments, DATABASE_URL might be undefined.
// We prevent hard crashing at import-time by providing a fallback,
// which is perfectly safe as long as no real queries are executed before runtime.
const finalUrl = databaseUrl || "postgresql://postgres:postgres@127.0.0.1:5432/dummy_db_during_build";

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: finalUrl,
    // Add connection timeouts to fail fast if someone attempts real queries at build time
    connectionTimeoutMillis: 5000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);
export const hasDatabaseConfig = !!databaseUrl;
