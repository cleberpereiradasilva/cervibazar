"use server";

import { sql } from "drizzle-orm";
import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { getDb } from "@/app/lib/db/client";

export type PaymentTotals = {
  credit: number;
  debit: number;
  cash: number;
  pix: number;
  pending: number;
};

export type CategoryTotals = {
  category: string;
  quantity: number;
  total: number;
};

export type ClosingDetail = {
  dateKey: string;
  dateLabel: string;
  weekday: string;
  items: number;
  opening: number;
  total: number;
  change: number;
  netTotal: number;
  payments: PaymentTotals;
  categories: CategoryTotals[];
  sangriaTotal: number;
  sangriasByReason: CategoryTotals[];
};

function toDateKey(date: Date) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function toLabel(date: Date) {
  const months = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  return `${String(date.getDate()).padStart(2, "0")} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function toWeekday(date: Date) {
  const weekDays = [
    "domingo",
    "segunda-feira",
    "terça-feira",
    "quarta-feira",
    "quinta-feira",
    "sexta-feira",
    "sábado",
  ];
  const label = weekDays[date.getDay()] ?? "";
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export async function getClosingDetail(
  token: string,
  date: string,
  _nextDate: string,
): Promise<ClosingDetail | null> {
  await verifyAuthToken(token);
  const db = getDb();

  const targetDate = sql`to_date(${date}, 'YYYY-MM-DD')`;

  const totalsQuery = sql<{
    total: string | null;
    troco: string | null;
    opening: string | null;
    items: string | null;
    sangria: string | null;
  }>`
    with sales_items as (
      select
        s.id,
        s.created_at,
        s.total_amount,
        s.change_amount,
        coalesce(sum(si.quantity), 0) as items
      from sales s
      left join sale_items si on si.sale_id = s.id
      where s.day = ${targetDate}
      group by s.id, s.created_at, s.total_amount, s.change_amount
    )
    select
      sum(total_amount) as total,
      sum(change_amount) as troco,
      sum(items) as items,
      (
        select coalesce(sum(amount), 0)
        from cash_openings c
        where c.day = ${targetDate}
          and c.deleted_at is null
      ) as opening,
      (
        select coalesce(sum(amount), 0)
        from sangrias sa
        where sa.day = ${targetDate}
          and sa.deleted_at is null
      ) as sangria
    from sales_items;
  `;

  const paymentsQuery = sql<{
    credit: string | null;
    debit: string | null;
    cash: string | null;
    pix: string | null;
    pending: string | null;
  }>`
    select
      coalesce(sum(credit_amount), 0) as credit,
      coalesce(sum(debit_amount), 0) as debit,
      coalesce(sum(cash_amount), 0) as cash,
      coalesce(sum(pix_amount), 0) as pix,
      coalesce(sum(pending_amount), 0) as pending
    from sales s
    where s.day = ${targetDate}
  `;

  const categoriesQuery = sql<CategoryTotals>`
    select
      coalesce(cat.name, 'Sem categoria') as category,
      coalesce(sum(si.quantity), 0)::int as quantity,
      coalesce(sum(si.line_total), 0) as total
    from sales s
    left join sale_items si on si.sale_id = s.id
    left join categories cat on cat.id = si.category_id
    where s.day = ${targetDate}
    group by cat.name
    order by category asc;
  `;

  const sangriasQuery = sql<CategoryTotals>`
    select
      coalesce(sr.name, 'Sem motivo') as category,
      0::int as quantity,
      coalesce(sum(sa.amount), 0) as total
    from sangrias sa
    left join sangria_reasons sr on sr.id = sa.reason_id
    where sa.day = ${targetDate}
      and sa.deleted_at is null
    group by sr.name
    order by sr.name;
  `;

  const { rows: totalsRows } = await db.execute(totalsQuery);
  const totals = totalsRows[0];
  if (!totals) {
    const dateObj = new Date(date);
    return {
      dateKey: toDateKey(dateObj),
      dateLabel: toLabel(dateObj),
      weekday: toWeekday(dateObj),
      items: 0,
      opening: 0,
      total: 0,
      change: 0,
      netTotal: 0,
      payments: { credit: 0, debit: 0, cash: 0, pix: 0, pending: 0 },
      categories: [],
      sangriaTotal: 0,
      sangriasByReason: [],
    };
  }

  const { rows: paymentRows } = await db.execute(paymentsQuery);
  const payment = paymentRows[0];

  const { rows: categories } = await db.execute(categoriesQuery);
  const { rows: sangriasByReason } = await db.execute(sangriasQuery);

  const dayDate = new Date(date);
  return {
    dateKey: toDateKey(dayDate),
    dateLabel: toLabel(dayDate),
    weekday: toWeekday(dayDate),
    items: Number(totals.items) || 0,
    opening: Number(totals.opening) || 0,
    total: Number(totals.total) || 0,
    change: Number(totals.troco) || 0,
    netTotal:
      Number(totals.total || 0) +
      Number(totals.opening || 0) -
      Number(totals.troco || 0) -
      Number(totals.sangria || 0),
    payments: {
      credit: Number(payment?.credit) || 0,
      debit: Number(payment?.debit) || 0,
      cash: Number(payment?.cash) || 0,
      pix: Number(payment?.pix) || 0,
      pending: Number(payment?.pending) || 0,
    },
    categories: categories.map((row) => ({
      category: row.category,
      quantity: row.quantity,
      total: Number(row.total) || 0,
    })),
    sangriaTotal: Number(totals.sangria) || 0,
    sangriasByReason: sangriasByReason.map((row) => ({
      category: row.category,
      quantity: 0,
      total: Number(row.total) || 0,
    })),
  };
}
