"use server";

import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { sangriaReasonSchema } from "@/app/lib/validators/sangriaReasonSchema";
import { sangriaReasonStore } from "@/app/lib/sangria/sangriaReasonStore";

export async function updateReason(token: string, input: { id: string; name: string }) {
  await verifyAuthToken(token);
  const payload = sangriaReasonSchema().parse(input);
  return sangriaReasonStore().update({
    id: payload.id!,
    name: payload.name.trim(),
  });
}
