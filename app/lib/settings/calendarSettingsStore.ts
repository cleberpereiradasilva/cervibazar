import { eq } from "drizzle-orm";
import { getDb } from "../db/client";
import { calendarSettings } from "../db/schema/calendarSettings";

const SETTINGS_ID = "default";

export function calendarSettingsStore() {
  const db = getDb();

  const get = async () => {
    const [existing] = await db
      .select({
        highlightedDays: calendarSettings.highlightedDays,
        holidays: calendarSettings.holidays,
      })
      .from(calendarSettings)
      .where(eq(calendarSettings.id, SETTINGS_ID));

    if (existing) {
      return {
        highlightedDays: existing.highlightedDays ?? [],
        holidays: existing.holidays ?? [],
      };
    }

    const createdAt = new Date();
    await db.insert(calendarSettings).values({
      id: SETTINGS_ID,
      highlightedDays: [],
      holidays: [],
      createdAt,
      updatedAt: createdAt,
    });
    return { highlightedDays: [], holidays: [] };
  };

  const update = async (highlightedDays: number[], holidays: string[]) => {
    const now = new Date();
    const [updated] = await db
      .update(calendarSettings)
      .set({ highlightedDays, holidays, updatedAt: now })
      .where(eq(calendarSettings.id, SETTINGS_ID))
      .returning({
        highlightedDays: calendarSettings.highlightedDays,
        holidays: calendarSettings.holidays,
      });

    if (updated) {
      return {
        highlightedDays: updated.highlightedDays ?? [],
        holidays: updated.holidays ?? [],
      };
    }

    await db.insert(calendarSettings).values({
      id: SETTINGS_ID,
      highlightedDays,
      holidays,
      createdAt: now,
      updatedAt: now,
    });
    return { highlightedDays, holidays };
  };

  return { get, update };
}
