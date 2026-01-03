"use server";

import { verifyAuthToken } from "@/app/lib/auth/jwt";
import { clientUpdateSchema } from "@/app/lib/validators/clientUpdateSchema";
import { clientStore } from "@/app/lib/clients/clientStore";

export type UpdateClientInput = {
  id: string;
  name: string;
  phone: string;
  birthday: string | Date;
};

export async function updateClient(token: string, input: UpdateClientInput) {
  await verifyAuthToken(token);
  const payload = clientUpdateSchema().parse(input);
  return clientStore().update({
    id: payload.id,
    name: payload.name.trim(),
    phone: payload.phone,
    birthday: payload.birthday,
  });
}
