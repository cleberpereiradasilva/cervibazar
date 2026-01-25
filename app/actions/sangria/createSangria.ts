"use server";

import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { sangriaEntrySchema } from "@/app/lib/validators/sangriaEntrySchema";
import { sangriaStore } from "@/app/lib/sangria/sangriaStore";
import { SEED_ADMIN_ID } from "@/app/constants";

export async function createSangria(
  token: string,
  input: {
    reasonId: string;
    amount: number | string;
    entryDate: string;
    observation?: string;
  }
) {
  const auth = await verifyAuthToken(token);
  const payload = sangriaEntrySchema().omit({ id: true }).parse(input);
  const store = sangriaStore();
  return store.add({
    reasonId: payload.reasonId,
    amount: payload.amount,
    createdBy: auth?.sub ?? SEED_ADMIN_ID,
    entryDate: payload.entryDate,
    observation: payload.observation?.trim(),
  });
}
