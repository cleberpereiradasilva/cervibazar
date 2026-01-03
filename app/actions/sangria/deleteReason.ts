"use server";

import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { z } from "zod";
import { sangriaReasonStore } from "@/app/lib/sangria/sangriaReasonStore";

export async function deleteReason(token: string, reasonId: string) {
  await verifyAuthToken(token);
  const id = z.string().trim().min(6, "ID inválido.").parse(reasonId);
  return sangriaReasonStore().remove(id);
}
