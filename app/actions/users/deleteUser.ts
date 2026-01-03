"use server";

import { z } from "zod";
import { userStore } from "@/app/lib/users/userStore";
import { verifyAuthToken } from "@/app/lib/auth/jwt";

export async function deleteUser(token: string, userId: string) {
  const schema = z
    .string()
    .trim()
    .min(6, { message: "ID de usuário inválido." });

  await verifyAuthToken(token);
  const id = schema.parse(userId);
  return userStore().remove(id);
}
