import { z } from "zod";

export function homeMessageSchema() {
  return z.object({
    message: z
      .string()
      .trim()
      .min(1, "A frase não pode estar vazia.")
      .max(200, "A frase deve ter no máximo 200 caracteres."),
  });
}
