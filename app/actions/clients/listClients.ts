"use server";

import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { clientStore } from "@/app/lib/clients/clientStore";

export async function listClients(token: string) {
  await verifyAuthToken(token);
  const store = clientStore();
  const data = await store.list();
  return data.sort((a, b) => a.name.localeCompare(b.name));
}
