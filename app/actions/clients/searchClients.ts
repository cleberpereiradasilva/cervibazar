"use server";

import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { clientStore } from "@/app/lib/clients/clientStore";

export async function searchClients(token: string, term: string) {
  await verifyAuthToken(token);
  const normalized = term.trim().replace(/\D/g, "");
  if (normalized.length < 3) return [];
  const store = clientStore();
  const all = await store.list();
  return all
    .filter((client) => {
      const clientDigits = client.phone.replace(/\D/g, "");
      return (
        clientDigits.includes(normalized) || client.name.toLowerCase().includes(term.toLowerCase())
      );
    })
    .slice(0, 5);
}
