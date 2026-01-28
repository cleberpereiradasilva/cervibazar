import { z } from "zod";

export function userInputSchema() {
  return z
    .object({
      name: z
        .string({
          required_error: "Nome e sobrenome sao obrigatorios.",
        })
        .trim()
        .min(5, "Nome e sobrenome devem ter pelo menos 5 caracteres.")
        .max(120, "Nome e sobrenome devem ter no maximo 120 caracteres.")
        .regex(
          /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:['-][A-Za-zÀ-ÖØ-öø-ÿ]+)*(?:\s+[A-Za-zÀ-ÖØ-öø-ÿ]+(?:['-][A-Za-zÀ-ÖØ-öø-ÿ]+)*)+$/,
          "Informe nome e sobrenome (letras, acentos, espacos, hifen e apostrofo)."
        ),
      username: z
        .string({ required_error: "Login e obrigatorio." })
        .trim()
        .toLowerCase()
        .min(5, "Login deve ter pelo menos 5 caracteres.")
        .max(50, "Login deve ter no maximo 50 caracteres.")
        .regex(/^[a-z]+\.[a-z]+$/, "Use o formato nome.sobrenome apenas com letras."),
      password: z
        .string({ required_error: "Senha e obrigatoria." })
        .min(8, "Senha deve ter pelo menos 8 caracteres.")
        .max(64, "Senha deve ter no maximo 64 caracteres.")
        .regex(/[A-Z]/, "Senha deve ter pelo menos uma letra maiuscula.")
        .regex(/[0-9]/, "Senha deve ter pelo menos um numero."),
      confirmPassword: z
        .string({ required_error: "Confirmacao de senha e obrigatoria." })
        .min(8, "Confirmacao deve ter pelo menos 8 caracteres.")
        .max(64, "Confirmacao deve ter no maximo 64 caracteres."),
      role: z.enum(["admin", "caixa", "root"], {
        errorMap: () => ({ message: "Selecione um perfil valido." }),
      }),
    })
    .refine(
      (data) => data.password === data.confirmPassword,
      "As senhas precisam ser iguais."
    );
}
