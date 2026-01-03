import { z } from "zod";

const amountPreprocess = (value: unknown) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const raw = value.trim();
    if (raw === "") return undefined;
    const hasComma = raw.includes(",");
    const hasDot = raw.includes(".");
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

export function sangriaEntrySchema() {
  return z.object({
    id: z.string().min(6, "ID inválido.").optional(),
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
