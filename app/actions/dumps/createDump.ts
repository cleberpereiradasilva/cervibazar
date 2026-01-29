"use server";

import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { createDump as createDumpFile } from "@/app/lib/dumps/dumpStorage";

export async function createDump(token: string) {
  const payload = await verifyAuthToken(token);
  if (payload.role !== "root") {
    throw new Error("Acesso restrito.");
  }
  return createDumpFile();
}
