import { pgTable, text, numeric, timestamp } from "drizzle-orm/pg-core";

export const cashOpenings = pgTable("cash_openings", {
  id: text("id").primaryKey(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { mode: "date" }),
});
