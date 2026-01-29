import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";

export const dbDumps = pgTable("db_dumps", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  size: integer("size").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
});
