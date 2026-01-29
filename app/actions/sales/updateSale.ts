"use server";

import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { saleUpdateSchema } from "@/app/lib/validators/saleUpdateSchema";
import { saleStore } from "@/app/lib/sales/saleStore";

export type UpdateSaleInput = {
  id: string;
  saleDate: string;
  sellerId: string;
  customer: { name: string; phone?: string; birthDate?: string };
  items: { categoryId: string; quantity: number; price: number }[];
  payments: { credito: number; debito: number; dinheiro: number; pix: number };
};

export async function updateSale(token: string, input: UpdateSaleInput) {
  const payload = await verifyAuthToken(token);
  const parsed = saleUpdateSchema().safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    const path = first?.path?.length ? ` (${first.path.join(".")})` : "";
    console.error("updateSale validation error:", {
      issues: parsed.error.issues,
      flatten: parsed.error.flatten(),
      input,
    });
    throw new Error(`${first?.message ?? "Dados inválidos."}${path}`);
  }
  const data = parsed.data;
  return saleStore().update({
    saleId: data.id,
    saleDate: data.saleDate,
    sellerId: data.sellerId,
    customer: data.customer,
    items: data.items,
    payments: data.payments,
    userId: payload.sub,
  });
}
