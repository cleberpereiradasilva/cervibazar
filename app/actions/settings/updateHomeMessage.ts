"use server";

import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { homeMessageSchema } from "@/app/lib/validators/homeMessageSchema";
import { homeMessageStore } from "@/app/lib/settings/homeMessageStore";
import { revalidatePath } from "next/cache";

export async function updateHomeMessage(token: string, input: { message: string }) {
  const auth = await verifyAuthToken(token);
  if (auth.role !== "admin") {
    throw new Error("Apenas administradores podem atualizar a frase.");
  }
  const data = homeMessageSchema().parse(input);
  const result = await homeMessageStore().update(data.message);
  revalidatePath("/");
  revalidatePath("/frase");
  return result;
}
