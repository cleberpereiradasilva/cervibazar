import { z } from "zod";

export function userUpdateSchema() {
  const optionalPassword = z.preprocess(
    (value) =>
      typeof value === "string" && value.trim().length === 0
        ? undefined
        : value,
    z
      .string()
      .min(8, "Senha deve ter pelo menos 8 caracteres.")
      .max(64, "Senha deve ter no maximo 64 caracteres.")
      .regex(/[A-Z]/, "Senha deve ter pelo menos uma letra maiuscula.")
      .regex(/[0-9]/, "Senha deve ter pelo menos um numero.")
      .optional()
  );

  return z
    .object({
      id: z.string().uuid("ID invalido."),
      name: z
        .string()
        .trim()
        .min(5, "Nome e sobrenome devem ter pelo menos 5 caracteres.")
        .max(120, "Nome e sobrenome devem ter no maximo 120 caracteres.")
        .regex(
          /^[A-Za-z]+(?:\s+[A-Za-z]+)+$/,
          "Informe nome e sobrenome (apenas letras e espacos)."
        ),
      username: z
        .string()
        .trim()
        .toLowerCase()
        .min(5, "Login deve ter pelo menos 5 caracteres.")
        .max(50, "Login deve ter no maximo 50 caracteres.")
        .regex(
          /^[a-z]+\.[a-z]+$/,
          "Use o formato nome.sobrenome apenas com letras."
        ),
      role: z.enum(["admin", "caixa"], {
        errorMap: () => ({ message: "Selecione um perfil valido." }),
      }),
      password: optionalPassword,
      confirmPassword: optionalPassword,
    })
    .refine(
      (data) => !data.password || data.password === data.confirmPassword,
      { message: "As senhas precisam ser iguais.", path: ["confirmPassword"] }
    );
}
