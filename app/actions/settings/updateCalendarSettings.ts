"use server";

import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { calendarSettingsSchema } from "@/app/lib/validators/calendarSettingsSchema";
import { calendarSettingsStore } from "@/app/lib/settings/calendarSettingsStore";

export async function updateCalendarSettings(
  token: string,
  input: { highlightedDays: number[]; holidays: string[] },
) {
  const auth = await verifyAuthToken(token);
  if (auth.role !== "admin" && auth.role !== "root") {
    throw new Error("Apenas administradores podem atualizar o calendário.");
  }
  const data = calendarSettingsSchema().parse(input);
  return calendarSettingsStore().update(data.highlightedDays, data.holidays);
}
