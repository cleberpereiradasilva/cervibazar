import { pgTable, text, timestamp, date } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const sangriaReasons = pgTable("sangria_reasons", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdBy: text("created_by").notNull(),
  day: date("day", { mode: "date" }).default(sql`now()::date`).notNull(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { mode: "date", withTimezone: true }),
});
