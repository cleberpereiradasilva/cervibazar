"use server";

import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { cashOpeningSchema } from "@/app/lib/validators/cashOpeningSchema";
import { cashOpeningStore } from "@/app/lib/cash-openings/cashOpeningStore";

export async function updateCashOpening(
  token: string,
  input: { id: string; amount: string | number; entryDate: string }
) {
  await verifyAuthToken(token);
  const payload = cashOpeningSchema().parse(input);
  return cashOpeningStore().update({
    id: payload.id!,
    amount: payload.amount,
    entryDate: payload.entryDate,
  });
}
