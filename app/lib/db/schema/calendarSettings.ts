import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const calendarSettings = pgTable("calendar_settings", {
  id: text("id").primaryKey(),
  highlightedDays: jsonb("highlighted_days")
    .$type<number[]>()
    .notNull()
    .default(sql`'[]'::jsonb`),
  holidays: jsonb("holidays")
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'::jsonb`),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
});
