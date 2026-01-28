"use server";

import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { calendarSettingsStore } from "@/app/lib/settings/calendarSettingsStore";

export async function getCalendarSettings(token: string) {
  await verifyAuthToken(token);
  return calendarSettingsStore().get();
}
