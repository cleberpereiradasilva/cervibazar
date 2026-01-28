import { eq } from "drizzle-orm";
import { getDb } from "../db/client";
import { homeSettings } from "../db/schema/homeSettings";

const SETTINGS_ID = "default";

export function homeMessageStore() {
  const db = getDb();

  const get = async () => {
    const [existing] = await db
      .select({ message: homeSettings.message })
      .from(homeSettings)
      .where(eq(homeSettings.id, SETTINGS_ID));

    if (existing) {
      return { message: existing.message ?? "" };
    }

    const createdAt = new Date();
    await db.insert(homeSettings).values({
      id: SETTINGS_ID,
      message: "",
      createdAt,
      updatedAt: createdAt,
    });
    return { message: "" };
  };

  const update = async (message: string) => {
    const now = new Date();
    const [updated] = await db
      .update(homeSettings)
      .set({ message, updatedAt: now })
      .where(eq(homeSettings.id, SETTINGS_ID))
      .returning({ message: homeSettings.message });

    if (updated) {
      return { message: updated.message ?? "" };
    }

    await db.insert(homeSettings).values({
      id: SETTINGS_ID,
      message,
      createdAt: now,
      updatedAt: now,
    });
    return { message };
  };

  return { get, update };
}
