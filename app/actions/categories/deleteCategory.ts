"use server";

import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { z } from "zod";
import { categoryStore } from "@/app/lib/categories/categoryStore";

export async function deleteCategory(token: string, id: string) {
  await verifyAuthToken(token);
  const parsedId = z.string().trim().min(6, "ID inválido.").parse(id);
  return categoryStore().remove(parsedId);
}
