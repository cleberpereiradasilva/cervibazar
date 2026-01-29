import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

let pool: any = null;

export function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL não definida.");
  }

  if (!pool) {
    pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 10,
    });
  }
  return pool;
}

export function getDb() {
  const db = drizzle(getPool());
  return db;
}
