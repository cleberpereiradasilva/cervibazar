"use server";

import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { categorySchema } from "@/app/lib/validators/categorySchema";
import { categoryStore } from "@/app/lib/categories/categoryStore";

export async function updateCategory(
  token: string,
  input: { id: string; name: string; icon: string }
) {
  await verifyAuthToken(token);
  const payload = categorySchema().parse(input);
  return categoryStore().update({
    id: payload.id!,
    name: payload.name,
    icon: payload.icon,
  });
}
