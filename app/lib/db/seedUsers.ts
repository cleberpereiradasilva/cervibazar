import { hash } from "bcryptjs";
import { getDb } from "./client";
import { users } from "./schema/users";
import {
  SEED_ADMIN_ID,
  SEED_ADMIN_NAME,
  SEED_ADMIN_PASSWORD,
  SEED_ADMIN_USERNAME,
} from "../../constants";
import { eq } from "drizzle-orm";

export async function seedAdminUser() {
  const db = getDb();

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, SEED_ADMIN_ID));

  if (existing.length > 0) {
    return;
  }

  const passwordHash = await hash(SEED_ADMIN_PASSWORD, 10);

  await db.insert(users).values({
    id: SEED_ADMIN_ID,
    name: SEED_ADMIN_NAME,
    username: SEED_ADMIN_USERNAME,
    role: "admin",
    passwordHash,
    createdBy: SEED_ADMIN_ID,
  });
}
