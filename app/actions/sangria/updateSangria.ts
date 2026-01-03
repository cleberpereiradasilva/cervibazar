"use server";

import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { sangriaEntrySchema } from "@/app/lib/validators/sangriaEntrySchema";
import { sangriaStore } from "@/app/lib/sangria/sangriaStore";

export async function updateSangria(
  token: string,
  input: { id: string; reasonId: string; amount: number | string; observation?: string }
) {
  await verifyAuthToken(token);
  const payload = sangriaEntrySchema().parse(input);
  return sangriaStore().update({
    id: payload.id!,
    reasonId: payload.reasonId,
    amount: payload.amount,
    observation: payload.observation?.trim() ?? null,
  });
}
