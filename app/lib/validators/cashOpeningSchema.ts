import { z } from "zod";

const amountPreprocess = (value: unknown) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const raw = value.trim();
    if (raw === "") return undefined;
    if (raw.includes(",")) {
      const normalized = raw.replace(/\./g, "").replace(",", ".");
      const parsed = Number(normalized);
      return Number.isNaN(parsed) ? undefined : parsed;
    }
    const parsed = Number(raw);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
  return value;
};

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const isValidDate = (value: string) => {
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return false;
  const date = new Date(Date.UTC(y, m - 1, d));
  return (
    date.getUTCFullYear() === y &&
    date.getUTCMonth() === m - 1 &&
    date.getUTCDate() === d
  );
};

export function cashOpeningSchema() {
  return z.object({
    id: z.string().min(6, "ID inválido.").optional(),
    entryDate: z
      .string({ required_error: "Data é obrigatória." })
      .regex(dateRegex, "Data inválida.")
      .refine(isValidDate, "Data inválida."),
    amount: z.preprocess(
      amountPreprocess,
      z
        .number({
          required_error: "Valor é obrigatório.",
          invalid_type_error: "Valor inválido.",
        })
        .nonnegative("Valor não pode ser negativo.")
        .max(9999999999, "Valor muito alto.")
    ),
  });
}
