import { and, eq, isNull } from "drizzle-orm";
import { hash } from "bcryptjs";
import { getDb } from "../db/client";
import { users } from "../db/schema/users";
import { generateShortId } from "../id/generateShortId";
import { SEED_ADMIN_ID } from "@/app/constants";
import { nowInSaoPaulo } from "../time/nowInSaoPaulo";

type UserRole = "admin" | "caixa";

export function userStore() {
  const db = getDb();

  const list = async () => {
    const rows = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(isNull(users.deletedAt))
      .orderBy(users.name);

    return rows;
  };

  const add = async (input: {
    name: string;
    username: string;
    role: UserRole;
    password: string;
    createdBy?: string;
  }) => {
    const id = generateShortId();
    const passwordHash = await hash(input.password, 10);
    const createdBy = input.createdBy ?? SEED_ADMIN_ID;
    const createdAt = nowInSaoPaulo();
    try {
      const [created] = await db
        .insert(users)
        .values({
          id,
          name: input.name,
          username: input.username,
          role: input.role,
          passwordHash,
          createdBy,
          createdAt,
          updatedAt: createdAt,
        })
        .returning({
          id: users.id,
          name: users.name,
          username: users.username,
          role: users.role,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        });
      return created;
    } catch (error) {
      const message =
        error instanceof Error && "code" in error && (error as any).code === "23505"
          ? "Login já está em uso."
          : "Erro ao salvar usuário.";
      throw new Error(message);
    }
  };

  const update = async (input: {
    id: string;
    name: string;
    username: string;
    role: UserRole;
    password?: string;
  }) => {
    const now = nowInSaoPaulo();
    const updates: Record<string, unknown> = {
      name: input.name,
      username: input.username,
      role: input.role,
      updatedAt: now,
    };

    if (input.password && input.password.length > 0) {
      updates.passwordHash = await hash(input.password, 10);
    }

    try {
      const [updated] = await db
        .update(users)
        .set(updates)
        .where(and(eq(users.id, input.id), isNull(users.deletedAt)))
        .returning({
          id: users.id,
          name: users.name,
          username: users.username,
          role: users.role,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        });

      if (!updated) {
        throw new Error("Usuário não encontrado.");
      }

      return updated;
    } catch (error) {
      const message =
        error instanceof Error && "code" in error && (error as any).code === "23505"
          ? "Login já está em uso."
          : error instanceof Error
            ? error.message
            : "Erro ao atualizar usuário.";
      throw new Error(message);
    }
  };

  const remove = async (id: string) => {
    const now = nowInSaoPaulo();
    const [existing] = await db
      .select({
        id: users.id,
        username: users.username,
        deletedAt: users.deletedAt,
      })
      .from(users)
      .where(eq(users.id, id));

    if (!existing || existing.deletedAt) {
      throw new Error("Usuário não encontrado.");
    }

    const newUsername = `${existing.username}__${now.getTime()}`;

    await db
      .update(users)
      .set({
        deletedAt: now,
        updatedAt: now,
        username: newUsername,
      })
      .where(eq(users.id, id));

    return true;
  };

  return { list, add, remove, update };
}
