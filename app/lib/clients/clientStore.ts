import { and, eq, isNull } from "drizzle-orm";
import { getDb } from "../db/client";
import { clients } from "../db/schema/clients";
import { generateShortId } from "../id/generateShortId";

export function clientStore() {
  const db = getDb();

  const list = async () => {
    return db
      .select({
        id: clients.id,
        name: clients.name,
        phone: clients.phone,
        birthday: clients.birthday,
        createdAt: clients.createdAt,
        updatedAt: clients.updatedAt,
      })
      .from(clients)
      .where(isNull(clients.deletedAt))
      .orderBy(clients.name);
  };

  const add = async (input: {
    name: string;
    phone: string;
    birthday: Date;
    createdBy: string;
  }) => {
    const id = generateShortId();
    const createdAt = new Date();
    const [created] = await db
      .insert(clients)
      .values({
        id,
        name: input.name,
        phone: input.phone,
        birthday: input.birthday,
        createdBy: input.createdBy,
        createdAt,
        updatedAt: createdAt,
      })
      .returning({
        id: clients.id,
        name: clients.name,
        phone: clients.phone,
        birthday: clients.birthday,
        createdAt: clients.createdAt,
        updatedAt: clients.updatedAt,
      });
    return created;
  };

  const update = async (input: {
    id: string;
    name: string;
    phone: string;
    birthday: Date;
  }) => {
    const now = new Date();
    const [updated] = await db
      .update(clients)
      .set({
        name: input.name,
        phone: input.phone,
        birthday: input.birthday,
        updatedAt: now,
      })
      .where(and(eq(clients.id, input.id), isNull(clients.deletedAt)))
      .returning({
        id: clients.id,
        name: clients.name,
        phone: clients.phone,
        birthday: clients.birthday,
        createdAt: clients.createdAt,
        updatedAt: clients.updatedAt,
      });

    if (!updated) {
      throw new Error("Cliente não encontrado.");
    }

    return updated;
  };

  const remove = async (id: string) => {
    const now = new Date();
    const [existing] = await db
      .select({
        id: clients.id,
        deletedAt: clients.deletedAt,
      })
      .from(clients)
      .where(eq(clients.id, id));

    if (!existing || existing.deletedAt) {
      throw new Error("Cliente não encontrado.");
    }

    await db
      .update(clients)
      .set({
        deletedAt: now,
        updatedAt: now,
      })
      .where(eq(clients.id, id));

    return true;
  };

  return { list, add, update, remove };
}
