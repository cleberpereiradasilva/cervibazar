"use server";

import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { cashOpeningStore } from "@/app/lib/cash-openings/cashOpeningStore";

export async function listCashOpenings(token: string) {
  await verifyAuthToken(token);
  return cashOpeningStore().list();
}
