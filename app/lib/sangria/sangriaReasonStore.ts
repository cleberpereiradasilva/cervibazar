import { and, eq, isNull } from "drizzle-orm";
import { getDb } from "../db/client";
import { sangriaReasons } from "../db/schema/sangriaReasons";
import { generateShortId } from "../id/generateShortId";
import { nowInSaoPaulo } from "../time/nowInSaoPaulo";

export function sangriaReasonStore() {
  const db = getDb();

  const list = async () => {
    return db
      .select({
        id: sangriaReasons.id,
        name: sangriaReasons.name,
        createdAt: sangriaReasons.createdAt,
        updatedAt: sangriaReasons.updatedAt,
      })
      .from(sangriaReasons)
      .where(isNull(sangriaReasons.deletedAt))
      .orderBy(sangriaReasons.name);
  };

  const add = async (input: { name: string; createdBy: string }) => {
    const id = generateShortId();
    const createdAt = nowInSaoPaulo();
    const [created] = await db
      .insert(sangriaReasons)
      .values({
        id,
        name: input.name,
        createdBy: input.createdBy,
        createdAt,
        updatedAt: createdAt,
      })
      .returning({
        id: sangriaReasons.id,
        name: sangriaReasons.name,
        createdAt: sangriaReasons.createdAt,
        updatedAt: sangriaReasons.updatedAt,
      });
    return created;
  };

  const update = async (input: { id: string; name: string }) => {
    const now = nowInSaoPaulo();
    const [updated] = await db
      .update(sangriaReasons)
      .set({
        name: input.name,
        updatedAt: now,
      })
      .where(and(eq(sangriaReasons.id, input.id), isNull(sangriaReasons.deletedAt)))
      .returning({
        id: sangriaReasons.id,
        name: sangriaReasons.name,
        createdAt: sangriaReasons.createdAt,
        updatedAt: sangriaReasons.updatedAt,
      });

    if (!updated) {
      throw new Error("Motivo não encontrado.");
    }

    return updated;
  };

  const remove = async (id: string) => {
    const now = nowInSaoPaulo();
    const [existing] = await db
      .select({
        id: sangriaReasons.id,
        deletedAt: sangriaReasons.deletedAt,
      })
      .from(sangriaReasons)
      .where(eq(sangriaReasons.id, id));

    if (!existing || existing.deletedAt) {
      throw new Error("Motivo não encontrado.");
    }

    await db
      .update(sangriaReasons)
      .set({
        deletedAt: now,
        updatedAt: now,
      })
      .where(eq(sangriaReasons.id, id));

    return true;
  };

  return { list, add, update, remove };
}
