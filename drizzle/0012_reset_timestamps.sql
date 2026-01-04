-- Ajuste: created_at/updated_at em TIMESTAMPTZ (UTC) e coluna day como inteiro AAAAMMDD baseado em America/Sao_Paulo.

-- Fórmula para default do day (America/Sao_Paulo):
-- ((date_part('year', (now() at time zone 'America/Sao_Paulo'))::int * 10000)
--  + (date_part('month', (now() at time zone 'America/Sao_Paulo'))::int * 100)
--  + date_part('day', (now() at time zone 'America/Sao_Paulo'))::int)

-- users
ALTER TABLE "users"
  ALTER COLUMN "day" TYPE date USING "day"::date,
  ALTER COLUMN "day" DROP DEFAULT,
  ALTER COLUMN "day" SET DEFAULT now()::date,
  ALTER COLUMN "created_at" TYPE timestamptz,
  ALTER COLUMN "created_at" SET DEFAULT now(),
  ALTER COLUMN "updated_at" TYPE timestamptz,
  ALTER COLUMN "updated_at" SET DEFAULT now(),
  ALTER COLUMN "deleted_at" TYPE timestamptz;

-- clients
ALTER TABLE "clients"
  ALTER COLUMN "day" TYPE date USING "day"::date,
  ALTER COLUMN "day" DROP DEFAULT,
  ALTER COLUMN "day" SET DEFAULT now()::date,
  ALTER COLUMN "created_at" TYPE timestamptz,
  ALTER COLUMN "created_at" SET DEFAULT now(),
  ALTER COLUMN "updated_at" TYPE timestamptz,
  ALTER COLUMN "updated_at" SET DEFAULT now(),
  ALTER COLUMN "deleted_at" TYPE timestamptz;

-- categories
ALTER TABLE "categories"
  ALTER COLUMN "day" TYPE date USING "day"::date,
  ALTER COLUMN "day" DROP DEFAULT,
  ALTER COLUMN "day" SET DEFAULT now()::date,
  ALTER COLUMN "created_at" TYPE timestamptz,
  ALTER COLUMN "created_at" SET DEFAULT now(),
  ALTER COLUMN "updated_at" TYPE timestamptz,
  ALTER COLUMN "updated_at" SET DEFAULT now(),
  ALTER COLUMN "deleted_at" TYPE timestamptz;

-- sangria_reasons
ALTER TABLE "sangria_reasons"
  ALTER COLUMN "day" TYPE date USING "day"::date,
  ALTER COLUMN "day" DROP DEFAULT,
  ALTER COLUMN "day" SET DEFAULT now()::date,
  ALTER COLUMN "created_at" TYPE timestamptz,
  ALTER COLUMN "created_at" SET DEFAULT now(),
  ALTER COLUMN "updated_at" TYPE timestamptz,
  ALTER COLUMN "updated_at" SET DEFAULT now(),
  ALTER COLUMN "deleted_at" TYPE timestamptz;

-- cash_openings
ALTER TABLE "cash_openings"
  ALTER COLUMN "day" TYPE date USING "day"::date,
  ALTER COLUMN "day" DROP DEFAULT,
  ALTER COLUMN "day" SET DEFAULT now()::date,
  ALTER COLUMN "created_at" TYPE timestamptz,
  ALTER COLUMN "created_at" SET DEFAULT now(),
  ALTER COLUMN "updated_at" TYPE timestamptz,
  ALTER COLUMN "updated_at" SET DEFAULT now(),
  ALTER COLUMN "deleted_at" TYPE timestamptz;

-- sales
ALTER TABLE "sales"
  ALTER COLUMN "day" TYPE date USING "day"::date,
  ALTER COLUMN "day" DROP DEFAULT,
  ALTER COLUMN "day" SET DEFAULT now()::date,
  ALTER COLUMN "created_at" TYPE timestamptz,
  ALTER COLUMN "created_at" SET DEFAULT now(),
  ALTER COLUMN "updated_at" TYPE timestamptz,
  ALTER COLUMN "updated_at" SET DEFAULT now();

-- sale_items
ALTER TABLE "sale_items"
  ALTER COLUMN "day" TYPE date USING "day"::date,
  ALTER COLUMN "day" DROP DEFAULT,
  ALTER COLUMN "day" SET DEFAULT now()::date,
  ALTER COLUMN "created_at" TYPE timestamptz,
  ALTER COLUMN "created_at" SET DEFAULT now();

-- sangrias
ALTER TABLE "sangrias"
  ALTER COLUMN "day" TYPE date USING "day"::date,
  ALTER COLUMN "day" DROP DEFAULT,
  ALTER COLUMN "day" SET DEFAULT now()::date,
  ALTER COLUMN "created_at" TYPE timestamptz,
  ALTER COLUMN "created_at" SET DEFAULT now(),
  ALTER COLUMN "updated_at" TYPE timestamptz,
  ALTER COLUMN "updated_at" SET DEFAULT now(),
  ALTER COLUMN "deleted_at" TYPE timestamptz;

-- closings
ALTER TABLE "closings"
  ALTER COLUMN "day" TYPE date USING "day"::date,
  ALTER COLUMN "day" DROP DEFAULT,
  ALTER COLUMN "day" SET DEFAULT now()::date,
  ALTER COLUMN "created_at" TYPE timestamptz,
  ALTER COLUMN "created_at" SET DEFAULT now(),
  ALTER COLUMN "updated_at" TYPE timestamptz,
  ALTER COLUMN "updated_at" SET DEFAULT now();
