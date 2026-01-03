"use server";

import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { clientInputSchema } from "@/app/lib/validators/clientInputSchema";
import { clientStore } from "@/app/lib/clients/clientStore";
import { SEED_ADMIN_ID } from "@/app/constants";

export type CreateClientInput = {
  name: string;
  phone: string;
  birthday: string | Date;
};

export async function createClient(token: string, input: CreateClientInput) {
  const auth = await verifyAuthToken(token);
  const payload = clientInputSchema().parse(input);
  const store = clientStore();
  return store.add({
    name: payload.name.trim(),
    phone: payload.phone,
    birthday: payload.birthday,
    createdBy: auth?.sub ?? SEED_ADMIN_ID,
  });
}
