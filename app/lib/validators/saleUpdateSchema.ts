import { z } from "zod";
import { saleInputSchema } from "@/app/lib/validators/saleInputSchema";

export function saleUpdateSchema() {
  return saleInputSchema().extend({
    id: z.string().min(1, "ID da venda inválido."),
  });
}
