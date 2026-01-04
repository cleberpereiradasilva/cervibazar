import { pgTable, text, timestamp, date } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const closings = pgTable("closings", {
  id: text("id").primaryKey(),
  observation: text("observation"),
  closedBy: text("closed_by").notNull(),
  day: date("day", { mode: "date" }).default(sql`now()::date`).notNull(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
});
