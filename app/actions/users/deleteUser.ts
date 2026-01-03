"use server";

import { z } from "zod";
import { userStore } from "@/app/lib/users/userStore";

export async function deleteUser(userId: string) {
  const schema = z
    .string()
    .trim()
    .uuid({ message: "ID de usuário inválido." });

  const id = schema.parse(userId);
  const removed = await userStore().remove(id);
  if (!removed) {
    throw new Error("Usuário não encontrado.");
  }

  return true;
}
