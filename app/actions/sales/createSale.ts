"use server";

import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { saleStore } from "@/app/lib/sales/saleStore";
import { saleInputSchema } from "@/app/lib/validators/saleInputSchema";

export type CreateSaleInput = {
  saleDate: string;
  sellerId: string;
  customer: { name: string; phone: string; birthDate?: string };
  items: { categoryId: string; quantity: number; price: number }[];
  payments: { credito: number; debito: number; dinheiro: number; pix: number };
};

export async function createSale(token: string, input: CreateSaleInput) {
  const payload = await verifyAuthToken(token);
  const data = saleInputSchema().parse(input);
  const store = saleStore();
  return store.create({
    saleDate: data.saleDate,
    sellerId: data.sellerId,
    customer: data.customer,
    items: data.items,
    payments: data.payments,
    userId: payload.sub,
  });
}
