import { pgTable, text, numeric, timestamp } from "drizzle-orm/pg-core";

export const sangrias = pgTable("sangrias", {
  id: text("id").primaryKey(),
  reasonId: text("reason_id").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  createdBy: text("created_by").notNull(),
  observation: text("observation"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { mode: "date" }),
});
