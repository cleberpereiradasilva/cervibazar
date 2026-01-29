"use server";

import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { listDumps as listDumpEntries } from "@/app/lib/dumps/dumpStorage";

export async function listDumps(token: string) {
  const payload = await verifyAuthToken(token);
  if (payload.role !== "root") {
    throw new Error("Acesso restrito.");
  }
  return listDumpEntries();
}
