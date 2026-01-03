import { z } from "zod";

const phoneRegex = /^\d{10,11}$/;

function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

export function clientUpdateSchema() {
  return z.object({
    id: z.string().min(6, "ID inválido."),
    name: z
      .string({ required_error: "Nome é obrigatório." })
      .trim()
      .min(5, "Informe nome e sobrenome.")
      .max(120, "Nome deve ter no máximo 120 caracteres.")
      .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:\s+[A-Za-zÀ-ÖØ-öø-ÿ]+)+$/, "Informe nome e sobrenome."),
    phone: z.preprocess(
      (value) => normalizePhone(String(value ?? "")),
      z
        .string()
        .refine((val) => phoneRegex.test(val), {
          message: "Telefone inválido. Use DDD + número.",
        })
    ),
    birthday: z.preprocess(
      (value) => {
        if (value instanceof Date) return value;
        const str = typeof value === "string" ? value : "";
        const parsed = new Date(str);
        return isNaN(parsed.getTime()) ? undefined : parsed;
      },
      z.date({
        required_error: "Data de aniversário é obrigatória.",
        invalid_type_error: "Data de aniversário é inválida.",
      })
    ),
  });
}
