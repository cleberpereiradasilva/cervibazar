ALTER TABLE "sales"
ADD COLUMN IF NOT EXISTS "sale_date" date DEFAULT now()::date NOT NULL;

ALTER TABLE "sale_items"
ADD COLUMN IF NOT EXISTS "sale_date" date DEFAULT now()::date NOT NULL;

UPDATE "sales" SET "sale_date" = "day" WHERE "sale_date" IS NULL;
UPDATE "sale_items" SET "sale_date" = "day" WHERE "sale_date" IS NULL;

CREATE INDEX IF NOT EXISTS "idx_sales_sale_date" ON "sales" ("sale_date");
CREATE INDEX IF NOT EXISTS "idx_sale_items_sale_date" ON "sale_items" ("sale_date");
