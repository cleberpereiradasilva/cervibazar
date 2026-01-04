"use server";

import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { categoryStore } from "@/app/lib/categories/categoryStore";

export async function listCategories(token: string) {
  await verifyAuthToken(token);
  return categoryStore().list();
}
