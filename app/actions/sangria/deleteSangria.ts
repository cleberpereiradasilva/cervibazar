"use server";

import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { z } from "zod";
import { sangriaStore } from "@/app/lib/sangria/sangriaStore";

export async function deleteSangria(token: string, id: string) {
  await verifyAuthToken(token);
  const parsedId = z.string().trim().min(6, "ID inválido.").parse(id);
  return sangriaStore().remove(parsedId);
}
