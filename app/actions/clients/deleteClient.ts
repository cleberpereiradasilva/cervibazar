"use server";

import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { z } from "zod";
import { clientStore } from "@/app/lib/clients/clientStore";

export async function deleteClient(token: string, clientId: string) {
  await verifyAuthToken(token);
  const id = z.string().trim().min(6, "ID inválido.").parse(clientId);
  return clientStore().remove(id);
}
