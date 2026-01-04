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

export function cashOpeningSchema() {
  return z.object({
    id: z.string().min(6, "ID inválido.").optional(),
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
