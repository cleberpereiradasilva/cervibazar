"use server";

import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { categorySchema } from "@/app/lib/validators/categorySchema";
import { categoryStore } from "@/app/lib/categories/categoryStore";
import { SEED_ADMIN_ID } from "@/app/constants";

export async function createCategory(
  token: string,
  input: { name: string; icon: string }
) {
  const auth = await verifyAuthToken(token);
  const payload = categorySchema().omit({ id: true }).parse(input);
  return categoryStore().add({
    name: payload.name,
    icon: payload.icon,
    createdBy: auth?.sub ?? SEED_ADMIN_ID,
  });
}
