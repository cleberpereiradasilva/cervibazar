import { and, eq, isNull, desc } from "drizzle-orm";
import { getDb } from "../db/client";
import { sangrias } from "../db/schema/sangrias";
import { generateShortId } from "../id/generateShortId";
import { sangriaReasons } from "../db/schema/sangriaReasons";
import { users } from "../db/schema/users";

export function sangriaStore() {
  const db = getDb();

  const parseEntryDate = (value: string) => {
    const [y, m, d] = value.split("-").map(Number);
    if (!y || !m || !d) {
      throw new Error("Data da sangria inválida.");
    }
    const date = new Date(Date.UTC(y, m - 1, d));
    if (Number.isNaN(date.getTime())) {
      throw new Error("Data da sangria inválida.");
    }
    return date;
  };

  const list = async () => {
    return db
      .select({
        id: sangrias.id,
        reasonId: sangrias.reasonId,
        amount: sangrias.amount,
        day: sangrias.day,
        createdAt: sangrias.createdAt,
        createdBy: sangrias.createdBy,
        reasonName: sangriaReasons.name,
        createdByName: users.name,
        observation: sangrias.observation,
      })
      .from(sangrias)
      .leftJoin(sangriaReasons, eq(sangrias.reasonId, sangriaReasons.id))
      .leftJoin(users, eq(sangrias.createdBy, users.id))
      .where(isNull(sangrias.deletedAt))
      .orderBy(desc(sangrias.createdAt));
  };

  const add = async (input: {
    reasonId: string;
    amount: number;
    createdBy: string;
    entryDate: string;
    observation?: string | null;
  }) => {
    const id = generateShortId();
    const createdAt = new Date();
    const day = parseEntryDate(input.entryDate);
    const [created] = await db
      .insert(sangrias)
      .values({
        id,
        reasonId: input.reasonId,
        amount: input.amount.toString(),
        createdBy: input.createdBy,
        observation: input.observation?.trim() ?? null,
        day,
        createdAt,
        updatedAt: createdAt,
      })
      .returning({
        id: sangrias.id,
        reasonId: sangrias.reasonId,
        amount: sangrias.amount,
        day: sangrias.day,
        createdAt: sangrias.createdAt,
        createdBy: sangrias.createdBy,
        observation: sangrias.observation,
      });
    return created;
  };

  const update = async (input: {
    id: string;
    reasonId: string;
    amount: number;
    entryDate: string;
    observation?: string | null;
  }) => {
    const now = new Date();
    const day = parseEntryDate(input.entryDate);
    const [updated] = await db
      .update(sangrias)
      .set({
        reasonId: input.reasonId,
        amount: input.amount.toString(),
        observation: input.observation?.trim() ?? null,
        day,
        updatedAt: now,
      })
      .where(and(eq(sangrias.id, input.id), isNull(sangrias.deletedAt)))
      .returning({
        id: sangrias.id,
        reasonId: sangrias.reasonId,
        amount: sangrias.amount,
        day: sangrias.day,
        createdAt: sangrias.createdAt,
        createdBy: sangrias.createdBy,
        observation: sangrias.observation,
      });

    if (!updated) {
      throw new Error("Sangria não encontrada.");
    }

    return updated;
  };

  const remove = async (id: string) => {
    const now = new Date();
    const [existing] = await db
      .select({
        id: sangrias.id,
        deletedAt: sangrias.deletedAt,
      })
      .from(sangrias)
      .where(eq(sangrias.id, id));

    if (!existing || existing.deletedAt) {
      throw new Error("Sangria não encontrada.");
    }

    await db
      .update(sangrias)
      .set({
        deletedAt: now,
        updatedAt: now,
      })
      .where(eq(sangrias.id, id));

    return true;
  };

  return { list, add, update, remove };
}
