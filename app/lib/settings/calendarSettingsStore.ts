import { eq } from "drizzle-orm";
import { getDb } from "../db/client";
import { calendarSettings } from "../db/schema/calendarSettings";

const SETTINGS_ID = "default";

export function calendarSettingsStore() {
  const db = getDb();

  const get = async () => {
    const [existing] = await db
      .select({ highlightedDays: calendarSettings.highlightedDays })
      .from(calendarSettings)
      .where(eq(calendarSettings.id, SETTINGS_ID));

    if (existing) {
      return { highlightedDays: existing.highlightedDays ?? [] };
    }

    const createdAt = new Date();
    await db.insert(calendarSettings).values({
      id: SETTINGS_ID,
      highlightedDays: [],
      createdAt,
      updatedAt: createdAt,
    });
    return { highlightedDays: [] };
  };

  const update = async (highlightedDays: number[]) => {
    const now = new Date();
    const [updated] = await db
      .update(calendarSettings)
      .set({ highlightedDays, updatedAt: now })
      .where(eq(calendarSettings.id, SETTINGS_ID))
      .returning({ highlightedDays: calendarSettings.highlightedDays });

    if (updated) {
      return { highlightedDays: updated.highlightedDays ?? [] };
    }

    await db.insert(calendarSettings).values({
      id: SETTINGS_ID,
      highlightedDays,
      createdAt: now,
      updatedAt: now,
    });
    return { highlightedDays };
  };

  return { get, update };
}
