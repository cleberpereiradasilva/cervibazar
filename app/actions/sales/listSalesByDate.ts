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
  changeAmount: string | null;
};

export async function listSalesByDate(
  token: string,
  date: string,
): Promise<SaleSummary[]> {
  await verifyAuthToken(token);
  const db = getDb();

  console.log(date);
  const targetDate = sql`to_date(${date}, 'YYYY-MM-DD')`;
  const dayExpr = sql`(${sales.createdAt} at time zone 'America/Sao_Paulo')::date`;

  const rows = await db
    .select({
      id: sales.id,
      createdAt: sql<Date>`(${sales.createdAt} at time zone 'America/Sao_Paulo')`,
      totalAmount: sales.totalAmount,
      changeAmount: sales.changeAmount,
      totalItems: sql<number>`coalesce(sum(${saleItems.quantity}), 0)`.as(
        "total_items",
      ),
      sellerName: users.name,
    })
    .from(sales)
    .leftJoin(saleItems, eq(sales.id, saleItems.saleId))
    .leftJoin(users, eq(users.id, sales.createdBy))
    .where(eq(dayExpr, targetDate))
    .groupBy(
      sales.id,
      users.name,
      sales.createdAt,
      sales.totalAmount,
      sales.changeAmount,
    )
    .orderBy(desc(sales.createdAt));

  return rows;
}
