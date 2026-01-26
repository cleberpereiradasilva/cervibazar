"use server";

import { eq, sql } from "drizzle-orm";
import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { getDb } from "@/app/lib/db/client";
import { sales } from "@/app/lib/db/schema/sales";
import { saleItems } from "@/app/lib/db/schema/saleItems";
import { clients } from "@/app/lib/db/schema/clients";
import { categories } from "@/app/lib/db/schema/categories";

export type SaleDetail = {
  id: string;
  createdAt: Date;
  saleDate: Date;
  sellerId: string;
  totalAmount: string;
  creditAmount: string;
  debitAmount: string;
  cashAmount: string;
  pixAmount: string;
  changeAmount: string;
  pendingAmount: string;
  client: {
    name: string;
    phone: string;
    birthday: Date | null;
  };
  sellerName: string | null;
  items: {
    categoryId: string;
    categoryName: string | null;
    categoryIcon: string | null;
    quantity: number;
    unitPrice: string;
    lineTotal: string;
  }[];
};

export async function getSaleDetail(token: string, saleId: string): Promise<SaleDetail> {
  await verifyAuthToken(token);
  const db = getDb();
  const id = String(saleId ?? "").trim();
  if (!id) {
    throw new Error("Venda não encontrada.");
  }

  const [sale] = await db
    .select({
      id: sales.id,
      createdAt: sales.createdAt,
      saleDate: sales.saleDate,
      totalAmount: sales.totalAmount,
      creditAmount: sales.creditAmount,
      debitAmount: sales.debitAmount,
      cashAmount: sales.cashAmount,
      pixAmount: sales.pixAmount,
      changeAmount: sales.changeAmount,
      pendingAmount: sales.pendingAmount,
      clientId: sales.clientId,
      sellerId: sales.sellerId,
      sellerName: sql<string>`coalesce(
        (select u.name from users u where u.id = ${sales.sellerId}),
        (select u.name from users u where u.id = ${sales.createdBy})
      )`.as("seller_name"),
      clientName: clients.name,
      clientPhone: clients.phone,
      clientBirthday: clients.birthday,
    })
    .from(sales)
    .leftJoin(clients, eq(clients.id, sales.clientId))
    .where(eq(sales.id, id));

  if (!sale) {
    throw new Error("Venda não encontrada.");
  }

  const items = await db
    .select({
      categoryId: saleItems.categoryId,
      quantity: saleItems.quantity,
      unitPrice: saleItems.unitPrice,
      lineTotal: saleItems.lineTotal,
      categoryName: categories.name,
      categoryIcon: categories.icon,
    })
    .from(saleItems)
    .leftJoin(categories, eq(categories.id, saleItems.categoryId))
    .where(eq(saleItems.saleId, saleId));

  return {
    id: sale.id,
    createdAt: sale.createdAt,
    saleDate: sale.saleDate,
    sellerId: sale.sellerId ?? "",
    totalAmount: sale.totalAmount,
    creditAmount: sale.creditAmount,
    debitAmount: sale.debitAmount,
    cashAmount: sale.cashAmount,
    pixAmount: sale.pixAmount,
    changeAmount: sale.changeAmount,
    pendingAmount: sale.pendingAmount,
    client: {
      name: sale.clientName ?? "",
      phone: sale.clientPhone ?? "",
      birthday: sale.clientBirthday ?? null,
    },
    sellerName: sale.sellerName,
    items,
  };
}
