"use server";

import { userStore } from "@/app/lib/users/userStore";
import { verifyAuthToken } from "@/app/lib/auth/jwt";

export async function listUsers(token: string) {
  await verifyAuthToken(token);
  const store = userStore();
  const users = await store.list();
  return users.sort((a, b) => a.name.localeCompare(b.name));
}
