import { z } from "zod";

const phoneRegex = /^\d{10,11}$/;
const isoDatePattern = /^(\d{4})-(\d{2})-(\d{2})$/;

function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

function parseLocalDate(value: string) {
  const match = isoDatePattern.exec(value);
  if (!match) return null;
  const [, y, m, d] = match;
  const year = Number(y);
  const month = Number(m) - 1;
  const day = Number(d);
  const date = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function clientInputSchema() {
  return z.object({
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
        const parsedLocal = parseLocalDate(str);
        if (parsedLocal) return parsedLocal;
        const parsed = new Date(str);
        return Number.isNaN(parsed.getTime()) ? undefined : parsed;
      },
      z.date({
        required_error: "Data de aniversário é obrigatória.",
        invalid_type_error: "Data de aniversário é inválida.",
      })
    ),
  });
}
