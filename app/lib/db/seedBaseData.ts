import { getDb } from "./client";
import { categories } from "./schema/categories";
import { sangriaReasons } from "./schema/sangriaReasons";

const BASE_USER_ID = "cbadmin001";

const CATEGORY_SEEDS = [
  { id: "cat-roupas-fem", name: "Roupas Femininas", icon: "shopping_bag" },
  { id: "cat-roupas-masc", name: "Roupas Masculinas", icon: "shirt" },
  { id: "cat-infantil", name: "Infantil", icon: "toys" },
  { id: "cat-calcados", name: "Calçados", icon: "shoe" },
  { id: "cat-acessorios", name: "Acessórios & Bazar", icon: "watch" },
] as const;

const SANGRIA_REASON_SEEDS = [
  { id: "sr-troco", name: "Troco inicial devolvido" },
  { id: "sr-despesa", name: "Despesa operacional" },
  { id: "sr-deposito", name: "Depósito bancário" },
] as const;

export async function seedBaseData() {
  const db = getDb();
  const createdAt = new Date();

  await db
    .insert(categories)
    .values(
      CATEGORY_SEEDS.map((cat) => ({
        id: cat.id,
        name: cat.name,
        icon: cat.icon,
        createdBy: BASE_USER_ID,
        createdAt,
        updatedAt: createdAt,
      })),
    )
    .onConflictDoNothing();

  await db
    .insert(sangriaReasons)
    .values(
      SANGRIA_REASON_SEEDS.map((reason) => ({
        id: reason.id,
        name: reason.name,
        createdBy: BASE_USER_ID,
        createdAt,
        updatedAt: createdAt,
      })),
    )
    .onConflictDoNothing();
}
