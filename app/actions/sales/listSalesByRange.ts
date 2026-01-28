"use server";

import { and, desc, eq, isNull, sql } from "drizzle-orm";
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
  creditAmount: string | null;
  debitAmount: string | null;
  cashAmount: string | null;
  pixAmount: string | null;
  clientName: string | null;
  clientPhone: string | null;
};

function parseDate(value: string): Date {
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Data inválida. Utilize o formato YYYY-MM-DD.");
  }
  return parsed;
}

export async function listSalesByRange(
  token: string,
  startDate: string,
  endDate: string,
  filters?: { clientName?: string; clientPhone?: string; sellerId?: string },
): Promise<SaleSummary[]> {
  await verifyAuthToken(token);
  const db = getDb();

  const start = parseDate(startDate);
  const end = parseDate(endDate);
  if (start > end) {
    throw new Error("A data inicial não pode ser maior que a final.");
  }

  const nameQuery = filters?.clientName?.trim();
  const phoneQueryRaw = filters?.clientPhone?.trim();
  const phoneQuery = phoneQueryRaw ? phoneQueryRaw.replace(/\D/g, "") : "";
  const sellerId = filters?.sellerId?.trim();
  const dateCondition = sql`${sales.saleDate} between to_date(${startDate}, 'YYYY-MM-DD') and to_date(${endDate}, 'YYYY-MM-DD')`;
  const conditions = [dateCondition, isNull(sales.deletedAt)];
  if (nameQuery) {
    conditions.push(sql`${clients.name} ilike ${`%${nameQuery}%`}`);
  }
  if (phoneQuery) {
    conditions.push(sql`${clients.phone} like ${`%${phoneQuery}%`}`);
  }
  if (sellerId) {
    conditions.push(sql`(${sales.sellerId} = ${sellerId} or ${sales.createdBy} = ${sellerId})`);
  }
  const whereClause = conditions.length === 1 ? conditions[0] : and(...conditions);

  const rows = await db
    .select({
      id: sales.id,
      createdAt: sales.createdAt,
      saleDate: sales.saleDate,
      totalAmount: sales.totalAmount,
      changeAmount: sales.changeAmount,
      creditAmount: sales.creditAmount,
      debitAmount: sales.debitAmount,
      cashAmount: sales.cashAmount,
      pixAmount: sales.pixAmount,
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
      sales.creditAmount,
      sales.debitAmount,
      sales.cashAmount,
      sales.pixAmount,
    )
    .orderBy(desc(sales.createdAt));

  return rows;
}
