"use server";

import { userInputSchema } from "@/app/lib/validators/userInputSchema";
import { userStore } from "@/app/lib/users/userStore";

export type CreateUserInput = {
  name: string;
  username: string;
  password: string;
  confirmPassword: string;
  role: "admin" | "caixa";
};

export async function createUser(input: CreateUserInput) {
  const payload = userInputSchema().parse(input);
  const store = userStore();
  const existing = (await store.list()).find(
    (user) => user.username.toLowerCase() === payload.username.toLowerCase()
  );

  if (existing) {
    throw new Error("Login já está em uso.");
  }

  const createdUser = await store.add({
    name: payload.name.trim(),
    username: payload.username,
    role: payload.role,
    password: payload.password,
  });

  return createdUser;
}
