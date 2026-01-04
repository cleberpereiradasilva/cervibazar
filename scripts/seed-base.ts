import { config } from "dotenv";
import { seedBaseData } from "../app/lib/db/seedBaseData";

config({ path: ".env.local" });

async function main() {
  try {
    await seedBaseData();
    console.log("Seed de categorias e motivos de sangria aplicada.");
  } catch (err) {
    console.error("Erro ao aplicar seed base:", err);
    process.exit(1);
  }
}

void main();
