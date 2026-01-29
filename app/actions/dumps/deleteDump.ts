"use server";

import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { deleteDump as deleteDumpFile } from "@/app/lib/dumps/dumpStorage";

export async function deleteDump(token: string, id: string) {
  const payload = await verifyAuthToken(token);
  if (payload.role !== "root") {
    throw new Error("Acesso restrito.");
  }
  return deleteDumpFile(id);
}
