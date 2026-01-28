"use server";

import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { homeMessageSchema } from "@/app/lib/validators/homeMessageSchema";
import { homeMessageStore } from "@/app/lib/settings/homeMessageStore";

export async function updateHomeMessage(token: string, input: { message: string }) {
  await verifyAuthToken(token);
  const data = homeMessageSchema().parse(input);
  return homeMessageStore().update(data.message);
}
