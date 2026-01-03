"use server";

import { z } from "zod";
import { userStore } from "@/app/lib/users/userStore";

export async function deleteUser(userId: string) {
  const schema = z
    .string()
    .trim()
    .min(6, { message: "ID de usuário inválido." });

  const id = schema.parse(userId);
  return userStore().remove(id);
}
