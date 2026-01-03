"use server";

import { and, eq, isNull } from "drizzle-orm";
import { getDb } from "@/app/lib/db/client";
import { users } from "@/app/lib/db/schema/users";
import { signAuthToken } from "@/app/lib/auth/jwt";
import { compare } from "bcryptjs";
import { z } from "zod";

export async function login(input: {
  username: string;
  password: string;
}) {
  const schema = z.object({
    username: z.string().trim().min(1).max(100),
    password: z.string().min(1).max(100),
  });

  let payload: { username: string; password: string };
  try {
    payload = schema.parse(input);
  } catch {
    throw new Error("Usuário ou senha inválidos.");
  }

  const db = getDb();
  const [user] = await db
    .select()
    .from(users)
    .where(
      and(
        eq(users.username, payload.username.toLowerCase()),
        isNull(users.deletedAt)
      )
    );

  if (!user || user.deletedAt) {
    throw new Error("Usuário ou senha inválidos.");
  }

  const passwordOk = await compare(payload.password.trim(), user.passwordHash);
  if (!passwordOk) {
    throw new Error("Usuário ou senha inválidos.");
  }

  const token = await signAuthToken({
    sub: user.id,
    username: user.username,
    role: user.role,
  });

  return {
    id: user.id,
    username: user.username,
    role: user.role,
    name: user.name,
    token,
  };
}
