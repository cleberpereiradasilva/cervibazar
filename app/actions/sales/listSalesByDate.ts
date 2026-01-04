"use server";

import { and, desc, eq, gte, lt, sql } from "drizzle-orm";
import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { getDb } from "@/app/lib/db/client";
import { sales } from "@/app/lib/db/schema/sales";
import { saleItems } from "@/app/lib/db/schema/saleItems";
import { users } from "@/app/lib/db/schema/users";

export type SaleSummary = {
  id: string;
  createdAt: Date;
  totalAmount: string;
  totalItems: number;
  sellerName: string | null;
};

export async function listSalesByDate(token: string, date: string): Promise<SaleSummary[]> {
  await verifyAuthToken(token);
  const db = getDb();
  // Intervalo em horário local, comparado contra timestamps em UTC
  const [year, month, day] = date.split("-").map((v) => Number(v));
  const start = new Date(year, month - 1, day);
  const end = new Date(year, month - 1, day + 1);

  const rows = await db
    .select({
      id: sales.id,
      createdAt: sales.createdAt,
      totalAmount: sales.totalAmount,
      totalItems: sql<number>`coalesce(sum(${saleItems.quantity}), 0)`.as("total_items"),
      sellerName: users.name,
    })
    .from(sales)
    .leftJoin(saleItems, eq(sales.id, saleItems.saleId))
    .leftJoin(users, eq(users.id, sales.createdBy))
    .where(and(gte(sales.createdAt, start), lt(sales.createdAt, end)))
    .groupBy(sales.id, users.name, sales.createdAt, sales.totalAmount)
    .orderBy(desc(sales.createdAt));

  return rows;
}
