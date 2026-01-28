import { z } from "zod";

export function calendarSettingsSchema() {
  return z.object({
    highlightedDays: z
      .array(z.number().int().min(0).max(6))
      .transform((days) => Array.from(new Set(days)).sort()),
  });
}
