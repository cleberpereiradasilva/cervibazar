import { pgTable, text, numeric, timestamp, date } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { closings } from "./closings";

export const sangrias = pgTable("sangrias", {
  id: text("id").primaryKey(),
  reasonId: text("reason_id").notNull(),
  closingId: text("closing_id").references(() => closings.id),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  createdBy: text("created_by").notNull(),
  observation: text("observation"),
  day: date("day", { mode: "date" }).default(sql`now()::date`).notNull(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { mode: "date", withTimezone: true }),
});
