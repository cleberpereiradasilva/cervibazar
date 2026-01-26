"use server";

import { and, desc, eq, sql } from "drizzle-orm";
import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { getDb } from "@/app/lib/db/client";
import { sales } from "@/app/lib/db/schema/sales";
import { saleItems } from "@/app/lib/db/schema/saleItems";
import { clients } from "@/app/lib/db/schema/clients";

export type SaleSummary = {
  id: string;
  createdAt: Date;
  saleDate: Date;
  totalAmount: string;
  totalItems: number;
  sellerName: string | null;
  changeAmount: string | null;
  clientName: string | null;
  clientPhone: string | null;
};

export async function listSalesByDate(
  token: string,
  date: string,
  filters?: { clientName?: string; clientPhone?: string }
): Promise<SaleSummary[]> {
  await verifyAuthToken(token);
  const db = getDb();

  const targetDate = sql`to_date(${date}, 'YYYY-MM-DD')`;
  const nameQuery = filters?.clientName?.trim();
  const phoneQueryRaw = filters?.clientPhone?.trim();
  const phoneQuery = phoneQueryRaw ? phoneQueryRaw.replace(/\D/g, "") : "";
  const conditions = [eq(sales.saleDate, targetDate)];
  if (nameQuery) {
    conditions.push(sql`${clients.name} ilike ${`%${nameQuery}%`}`);
  }
  if (phoneQuery) {
    conditions.push(sql`${clients.phone} like ${`%${phoneQuery}%`}`);
  }
  const whereClause = conditions.length === 1 ? conditions[0] : and(...conditions);

  const rows = await db
    .select({
      id: sales.id,
      createdAt: sales.createdAt,
      saleDate: sales.saleDate,
      totalAmount: sales.totalAmount,
      changeAmount: sales.changeAmount,
      totalItems: sql<number>`coalesce(sum(${saleItems.quantity}), 0)`.as(
        "total_items",
      ),
      sellerName: sql<string>`coalesce(
        (select u.name from users u where u.id = ${sales.sellerId}),
        (select u.name from users u where u.id = ${sales.createdBy})
      )`.as("seller_name"),
      clientName: clients.name,
      clientPhone: clients.phone,
    })
    .from(sales)
    .leftJoin(clients, eq(clients.id, sales.clientId))
    .leftJoin(saleItems, eq(sales.id, saleItems.saleId))
    .where(whereClause)
    .groupBy(
      sales.id,
      clients.name,
      clients.phone,
      sales.createdAt,
      sales.saleDate,
      sales.totalAmount,
      sales.changeAmount,
    )
    .orderBy(desc(sales.createdAt));

  return rows;
}
