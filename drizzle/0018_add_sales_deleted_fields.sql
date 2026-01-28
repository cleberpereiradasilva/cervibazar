ALTER TABLE "sales"
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp with time zone,
  ADD COLUMN IF NOT EXISTS "deleted_by" text,
  ADD COLUMN IF NOT EXISTS "deleted_seller_id" text;
