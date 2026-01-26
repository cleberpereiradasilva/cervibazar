import { and, eq, isNull, desc } from "drizzle-orm";
import { getDb } from "../db/client";
import { cashOpenings } from "../db/schema/cashOpenings";
import { generateShortId } from "../id/generateShortId";
import { users } from "../db/schema/users";

export function cashOpeningStore() {
  const db = getDb();

  const parseEntryDate = (value: string) => {
    const [y, m, d] = value.split("-").map(Number);
    if (!y || !m || !d) {
      throw new Error("Data da abertura inválida.");
    }
    const date = new Date(Date.UTC(y, m - 1, d));
    if (Number.isNaN(date.getTime())) {
      throw new Error("Data da abertura inválida.");
    }
    return date;
  };

  const list = async () => {
    return db
      .select({
        id: cashOpenings.id,
        amount: cashOpenings.amount,
        day: cashOpenings.day,
        createdAt: cashOpenings.createdAt,
        createdBy: cashOpenings.createdBy,
        createdByName: users.name,
      })
      .from(cashOpenings)
      .leftJoin(users, eq(cashOpenings.createdBy, users.id))
      .where(isNull(cashOpenings.deletedAt))
      .orderBy(desc(cashOpenings.createdAt));
  };

  const add = async (input: { amount: number; createdBy: string; entryDate: string }) => {
    const id = generateShortId();
    const createdAt = new Date();
    const day = parseEntryDate(input.entryDate);
    const [created] = await db
      .insert(cashOpenings)
      .values({
        id,
        amount: input.amount.toString(),
        createdBy: input.createdBy,
        day,
        createdAt,
        updatedAt: createdAt,
      })
      .returning({
        id: cashOpenings.id,
        amount: cashOpenings.amount,
        day: cashOpenings.day,
        createdAt: cashOpenings.createdAt,
        createdBy: cashOpenings.createdBy,
      });
    return created;
  };

  const update = async (input: { id: string; amount: number; entryDate: string }) => {
    const now = new Date();
    const day = parseEntryDate(input.entryDate);
    const [updated] = await db
      .update(cashOpenings)
      .set({
        amount: input.amount.toString(),
        day,
        updatedAt: now,
      })
      .where(and(eq(cashOpenings.id, input.id), isNull(cashOpenings.deletedAt)))
      .returning({
        id: cashOpenings.id,
        amount: cashOpenings.amount,
        day: cashOpenings.day,
        createdAt: cashOpenings.createdAt,
        createdBy: cashOpenings.createdBy,
      });

    if (!updated) {
      throw new Error("Abertura não encontrada.");
    }

    return updated;
  };

  const remove = async (id: string) => {
    const now = new Date();
    const [existing] = await db
      .select({ id: cashOpenings.id, deletedAt: cashOpenings.deletedAt })
      .from(cashOpenings)
      .where(eq(cashOpenings.id, id));

    if (!existing || existing.deletedAt) {
      throw new Error("Abertura não encontrada.");
    }

    await db
      .update(cashOpenings)
      .set({ deletedAt: now, updatedAt: now })
      .where(eq(cashOpenings.id, id));

    return true;
  };

  return { list, add, update, remove };
}
