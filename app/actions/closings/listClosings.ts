"use server";

import { sql } from "drizzle-orm";
import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { getDb } from "@/app/lib/db/client";

export type ClosingRow = {
  dateKey: string; // YYYY-MM-DD
  dateLabel: string;
  weekday: string;
  items: number;
  opening: number;
  total: number;
  change: number;
  sangria: number;
  netTotal: number;
  status: "auditado" | "pendente";
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

  const dayExpr = sql`(s.created_at at time zone 'America/Sao_Paulo')::date`;
  const dayOpeningExpr = sql`(c.created_at at time zone 'America/Sao_Paulo')::date`;
  const daySangriaExpr = sql`(sa.created_at at time zone 'America/Sao_Paulo')::date`;
  const targetDate = sql`to_date(${date}, 'YYYY-MM-DD')`;

  const query = sql<{
    day: Date;
    total: string | null;
    troco: string | null;
    opening: string | null;
    items: string | null;
  }>`
    with sales_by_day as (
      with items_by_sale as (
        select
          sale_id,
          sum(quantity) as items
        from sale_items
        group by sale_id
      )
      select
        ${dayExpr} as day,
        sum(s.total_amount) as total,
        sum(s.change_amount) as troco,
        coalesce(sum(ibs.items), 0) as items
      from sales s
      left join items_by_sale ibs on ibs.sale_id = s.id
      where ${dayExpr} = ${targetDate}
      group by ${dayExpr}
    ),
    openings_by_day as (
      select
        ${dayOpeningExpr} as day,
        sum(c.amount) as opening
      from cash_openings c
      where ${dayOpeningExpr} = ${targetDate}
        and c.deleted_at is null
      group by ${dayOpeningExpr}
    ),
    sangrias_by_day as (
      select
        ${daySangriaExpr} as day,
        sum(sa.amount) as sangria
      from sangrias sa
      where ${daySangriaExpr} = ${targetDate}
        and sa.deleted_at is null
      group by ${daySangriaExpr}
    )
    select
      s.day,
      coalesce(s.items, 0) as items,
      coalesce(s.total, 0) as total,
      coalesce(s.troco, 0) as troco,
      coalesce(o.opening, 0) as opening,
      coalesce(sa.sangria, 0) as sangria
    from sales_by_day s
    left join openings_by_day o on o.day = s.day
    left join sangrias_by_day sa on sa.day = s.day
    order by day desc;
  `;

  const { rows } = await db.execute(query);
  if (!rows.length) return [];

  const todayKey = toDateKey(new Date());

  return rows.map((row) => {
    const rawDay =
      typeof row.day === "string"
        ? row.day
        : row.day instanceof Date
          ? row.day.toISOString().slice(0, 10)
          : "";
    const [y, m, d] = rawDay.split("-").map((v) => Number(v));
    const dateObj = new Date(y || 0, (m || 1) - 1, d || 1); // usa data local para não recuar um dia
    const key = toDateKey(dateObj);
    return {
      dateKey: key,
      dateLabel: toLabel(dateObj),
      weekday: toWeekday(dateObj),
      items: Number(row.items) || 0,
      opening: Number(row.opening) || 0,
      total: Number(row.total) || 0,
      change: Number(row.troco) || 0,
      sangria: Number(row.sangria) || 0,
      netTotal:
        Number(row.total || 0) + Number(row.opening || 0) - Number(row.troco || 0) - Number(row.sangria || 0),
      status: key === todayKey ? ("pendente" as const) : ("auditado" as const),
    };
  });
}
