import { config } from "dotenv";
import { seedAdminUser } from "../app/lib/db/seedUsers";

config({ path: ".env.local" });

async function main() {
  try {
    await seedAdminUser();
    // eslint-disable-next-line no-console
    console.log("Seed do admin aplicada com sucesso.");
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Erro ao aplicar seed do admin:", err);
    process.exit(1);
  }
}

void main();
