"use server";

import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { homeMessageStore } from "@/app/lib/settings/homeMessageStore";

export async function getHomeMessage(token: string) {
  await verifyAuthToken(token);
  return homeMessageStore().get();
}
