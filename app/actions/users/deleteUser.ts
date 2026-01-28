"use server";

import { z } from "zod";
import { userStore } from "@/app/lib/users/userStore";
import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { getDb } from "@/app/lib/db/client";
import { users } from "@/app/lib/db/schema/users";
import { eq } from "drizzle-orm";

export async function deleteUser(token: string, userId: string) {
  const schema = z
    .string()
    .trim()
    .min(6, { message: "ID de usuário inválido." });

  const auth = await verifyAuthToken(token);
  const id = schema.parse(userId);
  if (auth.role !== "root") {
    const db = getDb();
    const [existing] = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, id));
    if (existing?.role === "root") {
      throw new Error("Apenas root pode remover um usuário root.");
    }
  }
  return userStore().remove(id);
}
