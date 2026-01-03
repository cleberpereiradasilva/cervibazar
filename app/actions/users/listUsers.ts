"use server";

import { userStore } from "@/app/lib/users/userStore";

export async function listUsers() {
  const store = userStore();
  const users = await store.list();
  return users.sort((a, b) => a.name.localeCompare(b.name));
}
