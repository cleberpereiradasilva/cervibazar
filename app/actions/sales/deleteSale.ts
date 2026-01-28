"use server";

import { z } from "zod";
import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { saleStore } from "@/app/lib/sales/saleStore";

export async function deleteSale(token: string, saleId: string) {
  await verifyAuthToken(token);
  const id = z.string().trim().min(6, "ID inválido.").parse(saleId);
  return saleStore().remove(id);
}
