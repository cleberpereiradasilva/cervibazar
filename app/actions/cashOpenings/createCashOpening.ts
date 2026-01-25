"use server";

import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { cashOpeningSchema } from "@/app/lib/validators/cashOpeningSchema";
import { cashOpeningStore } from "@/app/lib/cash-openings/cashOpeningStore";
import { SEED_ADMIN_ID } from "@/app/constants";

export async function createCashOpening(
  token: string,
  input: { amount: string | number; entryDate: string }
) {
  const auth = await verifyAuthToken(token);
  const payload = cashOpeningSchema().omit({ id: true }).parse(input);
  return cashOpeningStore().add({
    amount: payload.amount,
    createdBy: auth?.sub ?? SEED_ADMIN_ID,
    entryDate: payload.entryDate,
  });
}
