"use server";

import { and, isNull, sql } from "drizzle-orm";
import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { getDb } from "@/app/lib/db/client";
import { generateShortId } from "@/app/lib/id/generateShortId";
import { closings } from "@/app/lib/db/schema/closings";
import { sales } from "@/app/lib/db/schema/sales";
import { sangrias } from "@/app/lib/db/schema/sangrias";

type CloseDayInput = {
  date: string; // YYYY-MM-DD
  observation?: string | null;
};

export async function closeDay(token: string, input: CloseDayInput) {
  const payload = await verifyAuthToken(token);
  const db = getDb();

  const { date } = input;
  const targetDate = sql`to_date(${date}, 'YYYY-MM-DD')`;
  const saleDayExpr = sales.saleDate;
  const sangriaDayExpr = sangrias.day;

  const closingId = generateShortId();
  const createdAt = new Date();

  await db.transaction(async (tx) => {
    await tx.insert(closings).values({
      id: closingId,
      observation: input.observation ?? null,
      closedBy: payload.sub,
      day: targetDate,
      createdAt,
      updatedAt: createdAt,
    });

    await tx
      .update(sales)
      .set({ closingId, updatedAt: new Date() })
      .where(and(sql`${saleDayExpr} = ${targetDate}`, isNull(sales.deletedAt)));

    await tx
      .update(sangrias)
      .set({ closingId, updatedAt: new Date() })
      .where(sql`${sangriaDayExpr} = ${targetDate}`);
  });

  return { closingId };
}
