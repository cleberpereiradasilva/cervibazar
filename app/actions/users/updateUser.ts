"use server";

import { userStore } from "@/app/lib/users/userStore";
import { userUpdateSchema } from "@/app/lib/validators/userUpdateSchema";
import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { getDb } from "@/app/lib/db/client";
import { users } from "@/app/lib/db/schema/users";
import { eq } from "drizzle-orm";

export type UpdateUserInput = {
  id: string;
  name: string;
  username: string;
  role: "admin" | "caixa" | "root";
  password?: string;
  confirmPassword?: string;
};

export async function updateUser(token: string, input: UpdateUserInput) {
  const auth = await verifyAuthToken(token);
  const payload = userUpdateSchema().parse(input);
  if (payload.role === "root" && auth.role !== "root") {
    throw new Error("Apenas root pode definir o perfil root.");
  }
  if (auth.role !== "root") {
    const db = getDb();
    const [existing] = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, payload.id));
    if (existing?.role === "root") {
      throw new Error("Apenas root pode editar um usuário root.");
    }
  }
  const store = userStore();
  return store.update({
    id: payload.id,
    name: payload.name.trim(),
    username: payload.username,
    role: payload.role,
    password: payload.password,
  });
}
