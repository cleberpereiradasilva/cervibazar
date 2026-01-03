"use server";

import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { sangriaReasonSchema } from "@/app/lib/validators/sangriaReasonSchema";
import { sangriaReasonStore } from "@/app/lib/sangria/sangriaReasonStore";
import { SEED_ADMIN_ID } from "@/app/constants";

export async function createReason(token: string, input: { name: string }) {
  const auth = await verifyAuthToken(token);
  const payload = sangriaReasonSchema().omit({ id: true }).parse(input);
  return sangriaReasonStore().add({
    name: payload.name.trim(),
    createdBy: auth?.sub ?? SEED_ADMIN_ID,
  });
}
