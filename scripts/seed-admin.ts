import { config } from "dotenv";
import { seedAdminUser } from "../app/lib/db/seedUsers";

config({ path: ".env.local" });

async function main() {
  try {
    await seedAdminUser();
    console.log("Seed do admin aplicada com sucesso.");
  } catch (err) {
    console.error("Erro ao aplicar seed do admin:", err);
    process.exit(1);
  }
}

void main();
