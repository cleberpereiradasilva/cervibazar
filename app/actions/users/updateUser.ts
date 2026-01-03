"use server";

import { userStore } from "@/app/lib/users/userStore";
import { userUpdateSchema } from "@/app/lib/validators/userUpdateSchema";
import { verifyAuthToken } from "@/app/lib/auth/jwt";

export type UpdateUserInput = {
  id: string;
  name: string;
  username: string;
  role: "admin" | "caixa";
  password?: string;
  confirmPassword?: string;
};

export async function updateUser(token: string, input: UpdateUserInput) {
  await verifyAuthToken(token);
  const payload = userUpdateSchema().parse(input);
  const store = userStore();
  return store.update({
    id: payload.id,
    name: payload.name.trim(),
    username: payload.username,
    role: payload.role,
    password: payload.password,
  });
}
