-- Normaliza timestamps para fuso UTC-3 e adiciona coluna "day" (00h) em todas as tabelas.

-- Helpers para defaults
-- created/updated: timezone('-03', now())
-- day: date_trunc('day', timezone('-03', now()))

-- users
ALTER TABLE "users"
  ALTER COLUMN "created_at" TYPE timestamp,
  ALTER COLUMN "created_at" SET DEFAULT (now() at time zone '-03'),
  ALTER COLUMN "updated_at" TYPE timestamp,
  ALTER COLUMN "updated_at" SET DEFAULT (now() at time zone '-03'),
  ALTER COLUMN "deleted_at" TYPE timestamp;
ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "day" timestamp DEFAULT date_trunc('day', (now() at time zone '-03')) NOT NULL;

-- clients
ALTER TABLE "clients"
  ALTER COLUMN "created_at" TYPE timestamp,
  ALTER COLUMN "created_at" SET DEFAULT (now() at time zone '-03'),
  ALTER COLUMN "updated_at" TYPE timestamp,
  ALTER COLUMN "updated_at" SET DEFAULT (now() at time zone '-03'),
  ALTER COLUMN "deleted_at" TYPE timestamp;
ALTER TABLE "clients"
  ADD COLUMN IF NOT EXISTS "day" timestamp DEFAULT date_trunc('day', (now() at time zone '-03')) NOT NULL;

-- categories
ALTER TABLE "categories"
  ALTER COLUMN "created_at" TYPE timestamp,
  ALTER COLUMN "created_at" SET DEFAULT (now() at time zone '-03'),
  ALTER COLUMN "updated_at" TYPE timestamp,
  ALTER COLUMN "updated_at" SET DEFAULT (now() at time zone '-03'),
  ALTER COLUMN "deleted_at" TYPE timestamp;
ALTER TABLE "categories"
  ADD COLUMN IF NOT EXISTS "day" timestamp DEFAULT date_trunc('day', (now() at time zone '-03')) NOT NULL;

-- sangria_reasons
ALTER TABLE "sangria_reasons"
  ALTER COLUMN "created_at" TYPE timestamp,
  ALTER COLUMN "created_at" SET DEFAULT (now() at time zone '-03'),
  ALTER COLUMN "updated_at" TYPE timestamp,
  ALTER COLUMN "updated_at" SET DEFAULT (now() at time zone '-03'),
  ALTER COLUMN "deleted_at" TYPE timestamp;
ALTER TABLE "sangria_reasons"
  ADD COLUMN IF NOT EXISTS "day" timestamp DEFAULT date_trunc('day', (now() at time zone '-03')) NOT NULL;

-- cash_openings
ALTER TABLE "cash_openings"
  ALTER COLUMN "created_at" TYPE timestamp,
  ALTER COLUMN "created_at" SET DEFAULT (now() at time zone '-03'),
  ALTER COLUMN "updated_at" TYPE timestamp,
  ALTER COLUMN "updated_at" SET DEFAULT (now() at time zone '-03'),
  ALTER COLUMN "deleted_at" TYPE timestamp;
ALTER TABLE "cash_openings"
  ADD COLUMN IF NOT EXISTS "day" timestamp DEFAULT date_trunc('day', (now() at time zone '-03')) NOT NULL;

-- sales
ALTER TABLE "sales"
  ALTER COLUMN "created_at" TYPE timestamp,
  ALTER COLUMN "created_at" SET DEFAULT (now() at time zone '-03'),
  ALTER COLUMN "updated_at" TYPE timestamp,
  ALTER COLUMN "updated_at" SET DEFAULT (now() at time zone '-03');
ALTER TABLE "sales"
  ADD COLUMN IF NOT EXISTS "day" timestamp DEFAULT date_trunc('day', (now() at time zone '-03')) NOT NULL;

-- sale_items
ALTER TABLE "sale_items"
  ALTER COLUMN "created_at" TYPE timestamp,
  ALTER COLUMN "created_at" SET DEFAULT (now() at time zone '-03');
ALTER TABLE "sale_items"
  ADD COLUMN IF NOT EXISTS "day" timestamp DEFAULT date_trunc('day', (now() at time zone '-03')) NOT NULL;

-- sangrias
ALTER TABLE "sangrias"
  ALTER COLUMN "created_at" TYPE timestamp,
  ALTER COLUMN "created_at" SET DEFAULT (now() at time zone '-03'),
  ALTER COLUMN "updated_at" TYPE timestamp,
  ALTER COLUMN "updated_at" SET DEFAULT (now() at time zone '-03'),
  ALTER COLUMN "deleted_at" TYPE timestamp;
ALTER TABLE "sangrias"
  ADD COLUMN IF NOT EXISTS "day" timestamp DEFAULT date_trunc('day', (now() at time zone '-03')) NOT NULL;

-- closings
ALTER TABLE "closings"
  ALTER COLUMN "created_at" TYPE timestamp,
  ALTER COLUMN "created_at" SET DEFAULT (now() at time zone '-03'),
  ALTER COLUMN "updated_at" TYPE timestamp,
  ALTER COLUMN "updated_at" SET DEFAULT (now() at time zone '-03');
ALTER TABLE "closings"
  ADD COLUMN IF NOT EXISTS "day" timestamp DEFAULT date_trunc('day', (now() at time zone '-03')) NOT NULL;

-- Seeds para categorias e motivos de sangria
DO $$
DECLARE
  v_now timestamp := (now() at time zone '-03');
  v_day timestamp := date_trunc('day', v_now);
BEGIN
  INSERT INTO "categories" (id, name, icon, created_by, day, created_at, updated_at)
  VALUES
    ('cat-roupas-fem', 'Roupas Femininas', 'shopping_bag', 'cbadmin001', v_day, v_now, v_now),
    ('cat-roupas-masc', 'Roupas Masculinas', 'shirt', 'cbadmin001', v_day, v_now, v_now),
    ('cat-infantil', 'Infantil', 'toys', 'cbadmin001', v_day, v_now, v_now),
    ('cat-calcados', 'Calçados', 'shoe', 'cbadmin001', v_day, v_now, v_now),
    ('cat-acessorios', 'Acessórios & Bazar', 'watch', 'cbadmin001', v_day, v_now, v_now)
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO "sangria_reasons" (id, name, created_by, day, created_at, updated_at)
  VALUES
    ('sr-troco', 'Troco inicial devolvido', 'cbadmin001', v_day, v_now, v_now),
    ('sr-despesa', 'Despesa operacional', 'cbadmin001', v_day, v_now, v_now),
    ('sr-deposito', 'Depósito bancário', 'cbadmin001', v_day, v_now, v_now)
  ON CONFLICT (id) DO NOTHING;
END $$;
