"use server";

import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { calendarSettingsSchema } from "@/app/lib/validators/calendarSettingsSchema";
import { calendarSettingsStore } from "@/app/lib/settings/calendarSettingsStore";

export async function updateCalendarSettings(
  token: string,
  input: { highlightedDays: number[]; holidays: string[] },
) {
  await verifyAuthToken(token);
  const data = calendarSettingsSchema().parse(input);
  return calendarSettingsStore().update(data.highlightedDays, data.holidays);
}
