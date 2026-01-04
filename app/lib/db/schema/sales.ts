import { pgTable, text, numeric, timestamp } from "drizzle-orm/pg-core";

export const sales = pgTable("sales", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull(),
  createdBy: text("created_by").notNull(),
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
  creditAmount: numeric("credit_amount", { precision: 12, scale: 2 }).default("0").notNull(),
  debitAmount: numeric("debit_amount", { precision: 12, scale: 2 }).default("0").notNull(),
  cashAmount: numeric("cash_amount", { precision: 12, scale: 2 }).default("0").notNull(),
  pixAmount: numeric("pix_amount", { precision: 12, scale: 2 }).default("0").notNull(),
  changeAmount: numeric("change_amount", { precision: 12, scale: 2 }).default("0").notNull(),
  pendingAmount: numeric("pending_amount", { precision: 12, scale: 2 }).default("0").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});
