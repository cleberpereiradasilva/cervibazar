"use server";

import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { sangriaStore } from "@/app/lib/sangria/sangriaStore";

export async function listSangrias(token: string) {
  await verifyAuthToken(token);
  return sangriaStore().list();
}
