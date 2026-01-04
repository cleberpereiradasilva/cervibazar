"use server";

import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { z } from "zod";
import { cashOpeningStore } from "@/app/lib/cash-openings/cashOpeningStore";

export async function deleteCashOpening(token: string, id: string) {
  await verifyAuthToken(token);
  const parsedId = z.string().trim().min(6, "ID inválido.").parse(id);
  return cashOpeningStore().remove(parsedId);
}
