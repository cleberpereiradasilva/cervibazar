"use server";

import { userInputSchema } from "@/app/lib/validators/userInputSchema";
import { userStore } from "@/app/lib/users/userStore";
import { SEED_ADMIN_ID } from "@/app/constants";
import { verifyAuthToken } from "@/app/lib/auth/jwt";

export type CreateUserInput = {
  name: string;
  username: string;
  password: string;
  confirmPassword: string;
  role: "admin" | "caixa";
};

export async function createUser(token: string, input: CreateUserInput) {
  const auth = await verifyAuthToken(token);
  const payload = userInputSchema().parse(input);
  const store = userStore();
  const createdUser = await store.add({
    name: payload.name.trim(),
    username: payload.username,
    role: payload.role,
    password: payload.password,
    createdBy: auth?.sub ?? SEED_ADMIN_ID,
  });

  return createdUser;
}
