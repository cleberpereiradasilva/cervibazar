"use server";

import { sql } from "drizzle-orm";
import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { getDb } from "@/app/lib/db/client";

export type ClosingRow = {
  dateKey: string; // YYYY-MM-DD
  dateLabel: string;
  weekday: string;
  opening: number;
  total: number;
  change: number;
  sangria: number;
  netTotal: number;
  totalSales?: number;
  unclosedSales?: number;
  closingCount?: number;
  status: "aberto" | "pendente" | "fechado";
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

export async function listClosings(
  token: string,
  date: string,
  _nextDate: string,
): Promise<ClosingRow[]> {
  await verifyAuthToken(token);
  const db = getDb();

  const targetDate = sql`to_date(${date}, 'YYYY-MM-DD')`;
  const saleDayExpr = sql`(s.created_at at time zone 'America/Sao_Paulo')::date`;
  const openingDayExpr = sql`(c.created_at at time zone 'America/Sao_Paulo')::date`;
  const sangriaDayExpr = sql`(sa.created_at at time zone 'America/Sao_Paulo')::date`;
  const closingDayExpr = sql`(cl.created_at at time zone 'America/Sao_Paulo')::date`;

  const query = sql<{
    day: Date;
    total: string | null;
    troco: string | null;
    opening: string | null;
  sangria: string | null;
  totalSales: number | null;
  closedSales: number | null;
  totalSangrias: number | null;
  closedSangrias: number | null;
  closingCount: number | null;
}>`
    select
      ${targetDate} as day,
      (
        select coalesce(sum(s.total_amount), 0)
        from sales s
        where ${saleDayExpr} = ${targetDate}
      ) as total,
      (
        select coalesce(sum(s.change_amount), 0)
        from sales s
        where ${saleDayExpr} = ${targetDate}
      ) as troco,
      (
        select coalesce(sum(c.amount), 0)
        from cash_openings c
        where ${openingDayExpr} = ${targetDate}
          and c.deleted_at is null
      ) as opening,
      (
        select coalesce(sum(sa.amount), 0)
        from sangrias sa
        where ${sangriaDayExpr} = ${targetDate}
          and sa.deleted_at is null
      ) as sangria,
      (
        select coalesce(count(*), 0)
        from sales s
        where ${saleDayExpr} = ${targetDate}
      ) as "totalSales",
      (
        select coalesce(count(*), 0)
        from sales s
        where ${saleDayExpr} = ${targetDate} and s.closing_id is not null
      ) as "closedSales",
      (
        select coalesce(count(*), 0)
        from sangrias sa
        where ${sangriaDayExpr} = ${targetDate} and sa.deleted_at is null
      ) as "totalSangrias",
      (
        select coalesce(count(*), 0)
        from sangrias sa
        where ${sangriaDayExpr} = ${targetDate} and sa.closing_id is not null and sa.deleted_at is null
      ) as "closedSangrias",
      (
        select coalesce(count(*), 0)
        from closings cl
        where ${closingDayExpr} = ${targetDate}
      ) as closingCount
    ;
  `;

  const { rows } = await db.execute(query);
  if (!rows.length) return [];

  return rows.map((row) => {
    const rawDay =
      typeof row.day === "string"
        ? row.day
        : row.day instanceof Date
          ? row.day.toISOString().slice(0, 10)
          : "";
    const [y, m, d] = rawDay.split("-").map((v) => Number(v));
    const dateObj = new Date(
      Number(y) || 0,
      (Number(m) || 1) - 1,
      Number(d) || 1,
    ); // usa data local para evitar recuo de timezone
    const key = toDateKey(dateObj);
    return {
      dateKey: key,
      dateLabel: toLabel(dateObj),
      weekday: toWeekday(dateObj),
      opening: Number(row.opening) || 0,
      total: Number(row.total) || 0,
      change: Number(row.troco) || 0,
      sangria: Number(row.sangria) || 0,
      netTotal:
        Number(row.total || 0) +
        Number(row.opening || 0) -
        Number(row.troco || 0) -
        Number(row.sangria || 0),
      status: (() => {
        const totalSales = Number(row.totalSales || 0);
        const closedSales = Number(row.closedSales || 0);
        const totalSangrias = Number(row.totalSangrias || 0);
        const closedSangrias = Number(row.closedSangrias || 0);

        const hasMov = totalSales + totalSangrias > 0;
        const allClosed = closedSales === totalSales && closedSangrias === totalSangrias && hasMov;

        if (!hasMov) return "aberto" as const;
        if (allClosed) return "fechado" as const;
        if (closedSales > 0 || closedSangrias > 0) return "pendente" as const;
        return "aberto" as const;
      })(),
      totalSales: Number(row.totalSales) || 0,
      unclosedSales: Number(row.totalSales || 0) - Number(row.closedSales || 0),
    };
  });
}
