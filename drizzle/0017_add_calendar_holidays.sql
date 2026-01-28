ALTER TABLE "calendar_settings"
  ADD COLUMN IF NOT EXISTS "holidays" jsonb NOT NULL DEFAULT '[]'::jsonb;
