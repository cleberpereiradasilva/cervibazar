import { z } from "zod";

const amountPreprocess = (value: unknown) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const raw = value.trim();
    if (raw === "") return undefined;
    const hasComma = raw.includes(",");
    if (hasComma) {
      const normalized = raw.replace(/\./g, "").replace(",", ".");
      const parsed = Number(normalized);
      return Number.isNaN(parsed) ? undefined : parsed;
    }
    // No comma: treat dot as decimal separator, keep it
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

export function sangriaEntrySchema() {
  return z.object({
    id: z.string().min(6, "ID inválido.").optional(),
    entryDate: z
      .string({ required_error: "Data é obrigatória." })
      .regex(dateRegex, "Data inválida.")
      .refine(isValidDate, "Data inválida."),
    reasonId: z.string().min(3, "Selecione um motivo."),
    amount: z.preprocess(
      amountPreprocess,
      z
        .number({
          required_error: "Valor é obrigatório.",
          invalid_type_error: "Valor inválido.",
        })
        .positive("Informe um valor maior que zero.")
        .max(9999999999, "Valor muito alto.")
    ),
    observation: z
      .string()
      .trim()
      .max(500, "Observação deve ter no máximo 500 caracteres.")
      .optional()
      .or(z.literal("").transform(() => undefined)),
  });
}
