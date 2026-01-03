"use server";

import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { sangriaReasonStore } from "@/app/lib/sangria/sangriaReasonStore";

export async function listReasons(token: string) {
  await verifyAuthToken(token);
  return sangriaReasonStore().list();
}
