import { NextResponse } from "next/server";
import { getPool } from "@/app/lib/db/client";
import { createDump } from "@/app/lib/dumps/dumpStorage";

export const runtime = "nodejs";

function getSecret(request: Request) {
  const auth = request.headers.get("authorization") ?? "";
  if (auth.toLowerCase().startsWith("bearer ")) {
    return auth.slice(7).trim();
  }
  return request.headers.get("x-cron-secret") ?? "";
}

export async function GET(request: Request) {
  const expected = (process.env.CRON_SECRET ?? "").trim();
  const received = getSecret(request).trim();
  if (!expected || received !== expected) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  const pool = getPool();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const result = await pool.query(
    `select count(1)::int as total
     from sales
     where deleted_at is null and created_at >= $1`,
    [since]
  );
  const total = Number(result.rows[0]?.total ?? 0);

  if (total <= 0) {
    return NextResponse.json({ ok: true, skipped: true, reason: "Sem vendas." });
  }

  const dump = await createDump();
  return NextResponse.json({ ok: true, skipped: false, dump });
}
