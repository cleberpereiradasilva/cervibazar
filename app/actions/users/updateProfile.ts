"use server";

import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { userStore } from "@/app/lib/users/userStore";
import { z } from "zod";

const profileSchema = z
  .object({
    id: z.string().min(6, "ID inválido."),
    name: z
      .string()
      .trim()
      .min(5, "Informe nome e sobrenome.")
      .max(120, "Nome deve ter no máximo 120 caracteres.")
      .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:\s+[A-Za-zÀ-ÖØ-öø-ÿ]+)+$/, "Informe nome e sobrenome."),
    username: z
      .string()
      .trim()
      .toLowerCase()
      .min(5, "Login deve ter pelo menos 5 caracteres.")
      .max(50, "Login deve ter no máximo 50 caracteres.")
      .regex(/^[a-z]+\.[a-z]+$/, "Use o formato nome.sobrenome apenas com letras."),
    password: z
      .string()
      .min(8, "Senha deve ter pelo menos 8 caracteres.")
      .max(64, "Senha deve ter no máximo 64 caracteres.")
      .regex(/[A-Z]/, "Senha deve ter pelo menos uma letra maiúscula.")
      .regex(/[0-9]/, "Senha deve ter pelo menos um número.")
      .optional()
      .or(z.literal("")),
    confirmPassword: z
      .string()
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (data) => {
      if (!data.password && !data.confirmPassword) return true;
      return data.password === data.confirmPassword;
    },
    { message: "As senhas precisam ser iguais.", path: ["confirmPassword"] }
  );

export async function updateProfile(token: string, input: unknown) {
  const auth = await verifyAuthToken(token);
  const payload = profileSchema.parse(input);

  // Admin pode alterar role via updateUser, mas no perfil apenas os próprios dados
  const store = userStore();
  const updated = await store.update({
    id: payload.id,
    name: payload.name.trim(),
    username: payload.username,
    role: auth.role, // mantém o mesmo nível, não permite troca aqui
    password: payload.password || undefined,
  });

  return updated;
}
