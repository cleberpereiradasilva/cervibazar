import { z } from "zod";

export function sangriaReasonSchema() {
  return z.object({
    id: z.string().min(6, "ID inválido.").optional(),
    name: z
      .string({ required_error: "Descrição é obrigatória." })
      .trim()
      .min(3, "Descrição deve ter no mínimo 3 caracteres.")
      .max(50, "Descrição deve ter no máximo 50 caracteres."),
  });
}
