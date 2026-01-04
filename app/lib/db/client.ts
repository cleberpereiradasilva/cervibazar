import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

const { Pool } = pg;
let pool: any = null;

export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL não definida.");
  }

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 10,
    });
  }

  const db = drizzle(pool);
  return db;
}
