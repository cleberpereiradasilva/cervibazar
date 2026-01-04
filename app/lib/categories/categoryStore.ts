import { and, eq, isNull, desc } from "drizzle-orm";
import { getDb } from "../db/client";
import { categories } from "../db/schema/categories";
import { generateShortId } from "../id/generateShortId";
import { nowInSaoPaulo } from "../time/nowInSaoPaulo";

export function categoryStore() {
  const db = getDb();

  const list = async () => {
    return db
      .select({
        id: categories.id,
        name: categories.name,
        icon: categories.icon,
        createdAt: categories.createdAt,
        updatedAt: categories.updatedAt,
      })
      .from(categories)
      .where(isNull(categories.deletedAt))
      .orderBy(desc(categories.createdAt));
  };

  const add = async (input: { name: string; icon: string; createdBy: string }) => {
    const id = generateShortId();
    const createdAt = nowInSaoPaulo();
    const [created] = await db
      .insert(categories)
      .values({
        id,
        name: input.name,
        icon: input.icon,
        createdBy: input.createdBy,
        createdAt,
        updatedAt: createdAt,
      })
      .returning({
        id: categories.id,
        name: categories.name,
        icon: categories.icon,
        createdAt: categories.createdAt,
        updatedAt: categories.updatedAt,
      });
    return created;
  };

  const update = async (input: { id: string; name: string; icon: string }) => {
    const now = nowInSaoPaulo();
    const [updated] = await db
      .update(categories)
      .set({
        name: input.name,
        icon: input.icon,
        updatedAt: now,
      })
      .where(and(eq(categories.id, input.id), isNull(categories.deletedAt)))
      .returning({
        id: categories.id,
        name: categories.name,
        icon: categories.icon,
        createdAt: categories.createdAt,
        updatedAt: categories.updatedAt,
      });

    if (!updated) {
      throw new Error("Categoria não encontrada.");
    }

    return updated;
  };

  const remove = async (id: string) => {
    const now = nowInSaoPaulo();
    const [existing] = await db
      .select({ id: categories.id, deletedAt: categories.deletedAt })
      .from(categories)
      .where(eq(categories.id, id));

    if (!existing || existing.deletedAt) {
      throw new Error("Categoria não encontrada.");
    }

    await db
      .update(categories)
      .set({ deletedAt: now, updatedAt: now })
      .where(eq(categories.id, id));

    return true;
  };

  return { list, add, update, remove };
}
