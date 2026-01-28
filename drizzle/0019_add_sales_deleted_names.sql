ALTER TABLE "sales"
  ADD COLUMN IF NOT EXISTS "deleted_by_name" text,
  ADD COLUMN IF NOT EXISTS "deleted_seller_name" text;
