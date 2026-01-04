"use server";

import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { saleStore } from "@/app/lib/sales/saleStore";

export type CreateSaleInput = {
  customer: { name: string; phone: string; birthDate?: string };
  items: { categoryId: string; quantity: number; price: number }[];
  payments: { credito: number; debito: number; dinheiro: number; pix: number };
};

export async function createSale(token: string, input: CreateSaleInput) {
  const payload = await verifyAuthToken(token);
  const store = saleStore();
  return store.create({
    customer: input.customer,
    items: input.items,
    payments: input.payments,
    userId: payload.sub,
  });
}
