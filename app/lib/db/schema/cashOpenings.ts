import { pgTable, text, numeric, timestamp, date } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const cashOpenings = pgTable("cash_openings", {
  id: text("id").primaryKey(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  createdBy: text("created_by").notNull(),
  day: date("day", { mode: "date" }).default(sql`now()::date`).notNull(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { mode: "date", withTimezone: true }),
});
