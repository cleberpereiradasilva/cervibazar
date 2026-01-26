"use server";

import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { saleUpdateSchema } from "@/app/lib/validators/saleUpdateSchema";
import { saleStore } from "@/app/lib/sales/saleStore";

export type UpdateSaleInput = {
  id: string;
  saleDate: string;
  sellerId: string;
  customer: { name: string; phone: string; birthDate?: string };
  items: { categoryId: string; quantity: number; price: number }[];
  payments: { credito: number; debito: number; dinheiro: number; pix: number };
};

export async function updateSale(token: string, input: UpdateSaleInput) {
  const payload = await verifyAuthToken(token);
  const data = saleUpdateSchema().parse(input);
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
