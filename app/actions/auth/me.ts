"use server";

import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { getDb } from "@/app/lib/db/client";
import { users } from "@/app/lib/db/schema/users";
import { eq } from "drizzle-orm";

export type MeResponse = {
  id: string;
  name: string;
  username: string;
  role: "admin" | "caixa";
};

export async function me(token: string): Promise<MeResponse> {
  const payload = await verifyAuthToken(token);
  const db = getDb();
  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      username: users.username,
      role: users.role,
    })
    .from(users)
    .where(eq(users.id, payload.sub));

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  return user;
}
