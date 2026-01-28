import { z } from "zod";

export function calendarSettingsSchema() {
  return z.object({
    highlightedDays: z
      .array(z.number().int().min(0).max(6))
      .transform((days) => Array.from(new Set(days)).sort()),
    holidays: z
      .array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
      .transform((dates) => Array.from(new Set(dates)).sort()),
  });
}
