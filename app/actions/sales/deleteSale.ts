"use server";

import { z } from "zod";
import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { saleStore } from "@/app/lib/sales/saleStore";

export async function deleteSale(
  token: string,
  input: { saleId: string; sellerId?: string | null },
) {
  const payload = await verifyAuthToken(token);
  const data = z.object({
    saleId: z.string().trim().min(6, "ID inválido."),
    sellerId: z.string().trim().min(1).optional().nullable(),
  }).parse(input);
  return saleStore().remove({
    saleId: data.saleId,
    deletedBy: payload.sub,
    deletedSellerId: data.sellerId ?? null,
  });
}
