"use server";

import { userStore } from "@/app/lib/users/userStore";
import { userUpdateSchema } from "@/app/lib/validators/userUpdateSchema";

export type UpdateUserInput = {
  id: string;
  name: string;
  username: string;
  role: "admin" | "caixa";
  password?: string;
  confirmPassword?: string;
};

export async function updateUser(input: UpdateUserInput) {
  const payload = userUpdateSchema().parse(input);
  const store = userStore();
  const users = await store.list();
  const exists = users.find((user) => user.id === payload.id);

  if (!exists) {
    throw new Error("Usuário nao encontrado.");
  }

  const usernameTaken = users.find(
    (user) =>
      user.username.toLowerCase() === payload.username.toLowerCase() &&
      user.id !== payload.id
  );

  if (usernameTaken) {
    throw new Error("Login já está em uso.");
  }

  const updated = await store.update({
    id: payload.id,
    name: payload.name.trim(),
    username: payload.username,
    role: payload.role,
    password: payload.password,
  });

  if (!updated) {
    throw new Error("Não foi possível atualizar o usuário.");
  }

  return updated;
}
