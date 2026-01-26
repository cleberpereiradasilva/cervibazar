import { z } from "zod";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export function saleInputSchema() {
  const amount = z.preprocess((value) => Number(value), z.number().min(0));

  return z.object({
    saleDate: z
      .string()
      .regex(dateRegex, "Data da venda inválida.")
      .refine((value) => {
        const [y, m, d] = value.split("-").map(Number);
        if (!y || !m || !d) return false;
        const date = new Date(Date.UTC(y, m - 1, d));
        return (
          date.getUTCFullYear() === y &&
          date.getUTCMonth() === m - 1 &&
          date.getUTCDate() === d
        );
      }, "Data da venda inválida."),
    sellerId: z.string().min(1, "Selecione o vendedor."),
    customer: z.object({
      name: z.string().trim().min(1).max(120),
      phone: z.string().trim().min(1).max(40),
      birthDate: z.string().trim().min(10).optional(),
    }),
    items: z
      .array(
        z.object({
          categoryId: z.string().min(1),
          quantity: z.preprocess(
            (value) => Number(value),
            z.number().int().min(1),
          ),
          price: z.preprocess((value) => Number(value), z.number().min(0)),
        }),
      )
      .min(1),
    payments: z.object({
      credito: amount,
      debito: amount,
      dinheiro: amount,
      pix: amount,
    }),
  });
}
