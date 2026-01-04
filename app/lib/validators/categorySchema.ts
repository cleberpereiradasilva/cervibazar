import { z } from "zod";

export function categorySchema() {
  return z.object({
    id: z.string().min(6, "ID inválido.").optional(),
    name: z
      .string({ required_error: "Descrição é obrigatória." })
      .trim()
      .min(3, "Descrição deve ter no mínimo 3 caracteres.")
      .max(60, "Descrição deve ter no máximo 60 caracteres."),
    icon: z
      .string({ required_error: "Ícone é obrigatório." })
      .trim()
      .min(2, "Selecione um ícone."),
  });
}
