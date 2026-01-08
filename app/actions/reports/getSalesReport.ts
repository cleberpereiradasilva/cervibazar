"use server";

import { and, asc, desc, eq, isNull, sql } from "drizzle-orm";
import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { getDb } from "@/app/lib/db/client";
import { sales } from "@/app/lib/db/schema/sales";
import { saleItems } from "@/app/lib/db/schema/saleItems";
import { categories } from "@/app/lib/db/schema/categories";

export type SalesReportParams = {
  startDate: string;
  endDate: string;
  grouping?: "day" | "month";
};

export type SalesReportResponse = {
  summary: {
    totalSales: number;
    totalItems: number;
    avgTicket: number;
    salesChange: number;
    itemsChange: number;
    ticketChange: number;
  };
  timeline: {
    date: string;
    totalAmount: number;
  }[];
  paymentTimeline: {
    date: string;
    credit: number;
    debit: number;
    cash: number;
    pix: number;
  }[];
  categories: {
    id: string | null;
    name: string;
    totalAmount: number;
    totalItems: number;
    percent: number;
  }[];
};

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function parseDate(value: string): Date {
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Data inválida. Utilize o formato YYYY-MM-DD.");
  }
  return parsed;
}

function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function percentChange(current: number, previous: number): number {
  if (previous === 0) {
    return current === 0 ? 0 : 100;
  }
  return ((current - previous) / Math.abs(previous)) * 100;
}

async function getTotals(db: ReturnType<typeof getDb>, start: string, end: string) {
  const dateCondition = sql`${sales.day} between to_date(${start}, 'YYYY-MM-DD') and to_date(${end}, 'YYYY-MM-DD')`;
  const [salesAgg] = await db
    .select({
      totalSales: sql<string>`coalesce(sum(${sales.totalAmount}), 0)`,
      salesCount: sql<number>`count(${sales.id})`,
    })
    .from(sales)
    .where(dateCondition);

  const [itemsAgg] = await db
    .select({
      totalItems: sql<number>`coalesce(sum(${saleItems.quantity}), 0)`,
    })
    .from(saleItems)
    .where(
      sql`${saleItems.day} between to_date(${start}, 'YYYY-MM-DD') and to_date(${end}, 'YYYY-MM-DD')`,
    );

  const totalSales = Number(salesAgg?.totalSales ?? 0);
  const totalItems = Number(itemsAgg?.totalItems ?? 0);
  const salesCount = Number(salesAgg?.salesCount ?? 0);

  return {
    totalSales,
    totalItems,
    avgTicket: salesCount > 0 ? totalSales / salesCount : 0,
  };
}

async function getTimeline(
  db: ReturnType<typeof getDb>,
  start: string,
  end: string,
  grouping: "day" | "month",
) {
  const isMonthly = grouping === "month";
  const bucket = isMonthly ? sql`date_trunc('month', ${sales.day})` : sales.day;

  const rows = await db
    .select({
      bucket,
      totalAmount: sql<string>`sum(${sales.totalAmount})`.as("total_amount"),
    })
    .from(sales)
    .where(sql`${sales.day} between to_date(${start}, 'YYYY-MM-DD') and to_date(${end}, 'YYYY-MM-DD')`)
    .groupBy(bucket)
    .orderBy(asc(bucket));

  return rows.map((row) => ({
    date: toISODate(new Date(row.bucket)),
    totalAmount: Number(row.totalAmount ?? 0),
  }));
}

async function getPaymentTimeline(
  db: ReturnType<typeof getDb>,
  start: string,
  end: string,
  grouping: "day" | "month",
) {
  const isMonthly = grouping === "month";
  const bucket = isMonthly ? sql`date_trunc('month', ${sales.day})` : sales.day;

  const rows = await db
    .select({
      bucket,
      credit: sql<string>`coalesce(sum(${sales.creditAmount}), 0)`.as("credit"),
      debit: sql<string>`coalesce(sum(${sales.debitAmount}), 0)`.as("debit"),
      cash: sql<string>`coalesce(sum(${sales.cashAmount}), 0)`.as("cash"),
      pix: sql<string>`coalesce(sum(${sales.pixAmount}), 0)`.as("pix"),
    })
    .from(sales)
    .where(sql`${sales.day} between to_date(${start}, 'YYYY-MM-DD') and to_date(${end}, 'YYYY-MM-DD')`)
    .groupBy(bucket)
    .orderBy(asc(bucket));

  return rows.map((row) => ({
    date: toISODate(new Date(row.bucket)),
    credit: Number(row.credit ?? 0),
    debit: Number(row.debit ?? 0),
    cash: Number(row.cash ?? 0),
    pix: Number(row.pix ?? 0),
  }));
}

async function getCategoryBreakdown(db: ReturnType<typeof getDb>, start: string, end: string) {
  const rows = await db
    .select({
      id: categories.id,
      name: categories.name,
      totalAmount: sql<string>`coalesce(sum(${saleItems.lineTotal}), 0)`.as("total_amount"),
      totalItems: sql<number>`coalesce(sum(${saleItems.quantity}), 0)`.as("total_items"),
    })
    .from(categories)
    .leftJoin(
      saleItems,
      and(
        eq(categories.id, saleItems.categoryId),
        sql`${saleItems.day} between to_date(${start}, 'YYYY-MM-DD') and to_date(${end}, 'YYYY-MM-DD')`,
      ),
    )
    .where(isNull(categories.deletedAt))
    .groupBy(categories.id, categories.name)
    .orderBy(desc(sql`coalesce(sum(${saleItems.lineTotal}), 0)`));

  const totalAmount = rows.reduce((sum, row) => sum + Number(row.totalAmount ?? 0), 0);

  return rows.map((row) => {
    const amount = Number(row.totalAmount ?? 0);
    return {
      id: row.id,
      name: row.name ?? "Sem categoria",
      totalAmount: amount,
      totalItems: Number(row.totalItems ?? 0),
      percent: totalAmount > 0 ? (amount / totalAmount) * 100 : 0,
    };
  });
}

function monthsDiffInclusive(start: Date, end: Date) {
  return end.getFullYear() * 12 + end.getMonth() - (start.getFullYear() * 12 + start.getMonth()) + 1;
}

function buildDateRange(start: Date, end: Date, grouping: "day" | "month") {
  const dates: string[] = [];
  if (grouping === "month") {
    const totalMonths = monthsDiffInclusive(start, end);
    for (let i = 0; i < totalMonths; i++) {
      const cursor = new Date(start.getFullYear(), start.getMonth() + i, 1);
      dates.push(toISODate(cursor));
    }
    return dates;
  }

  let cursor = new Date(start);
  while (cursor <= end) {
    dates.push(toISODate(cursor));
    cursor = new Date(cursor.getTime() + MS_PER_DAY);
  }
  return dates;
}

export async function getSalesReport(
  token: string,
  params: SalesReportParams,
): Promise<SalesReportResponse> {
  await verifyAuthToken(token);
  const db = getDb();

  const grouping: "day" | "month" = params.grouping === "month" ? "month" : "day";
  const start = parseDate(params.startDate);
  const end = parseDate(params.endDate);
  if (start > end) {
    throw new Error("A data inicial não pode ser maior que a final.");
  }

  let previousStart: Date;
  let previousEnd: Date;
  if (grouping === "month") {
    const totalMonths = monthsDiffInclusive(start, end);
    const startOfCurrent = new Date(start.getFullYear(), start.getMonth(), 1);
    previousEnd = new Date(startOfCurrent.getTime() - MS_PER_DAY);
    previousStart = new Date(previousEnd.getFullYear(), previousEnd.getMonth() - (totalMonths - 1), 1);
  } else {
    const rangeDays = Math.max(1, Math.floor((end.getTime() - start.getTime()) / MS_PER_DAY) + 1);
    previousEnd = new Date(start.getTime() - MS_PER_DAY);
    previousStart = new Date(previousEnd.getTime() - (rangeDays - 1) * MS_PER_DAY);
  }

  const [currentTotals, previousTotals, timelineRows, paymentRows, categoryRows] = await Promise.all([
    getTotals(db, toISODate(start), toISODate(end)),
    getTotals(db, toISODate(previousStart), toISODate(previousEnd)),
    getTimeline(db, toISODate(start), toISODate(end), grouping),
    getPaymentTimeline(db, toISODate(start), toISODate(end), grouping),
    getCategoryBreakdown(db, toISODate(start), toISODate(end)),
  ]);

  const timelineByDate = new Map(timelineRows.map((row) => [row.date, row.totalAmount]));
  const paymentByDate = new Map(
    paymentRows.map((row) => [
      row.date,
      { credit: row.credit, debit: row.debit, cash: row.cash, pix: row.pix },
    ]),
  );
  const timeline = buildDateRange(start, end, grouping).map((date) => ({
    date,
    totalAmount: timelineByDate.get(date) ?? 0,
  }));

  return {
    summary: {
      totalSales: currentTotals.totalSales,
      totalItems: currentTotals.totalItems,
      avgTicket: currentTotals.avgTicket,
      salesChange: percentChange(currentTotals.totalSales, previousTotals.totalSales),
      itemsChange: percentChange(currentTotals.totalItems, previousTotals.totalItems),
      ticketChange: percentChange(currentTotals.avgTicket, previousTotals.avgTicket),
    },
    timeline,
    paymentTimeline: buildDateRange(start, end, grouping).map((date) => {
      const payments = paymentByDate.get(date) ?? { credit: 0, debit: 0, cash: 0, pix: 0 };
      return { date, ...payments };
    }),
    categories: categoryRows,
  };
}
