CREATE TABLE IF NOT EXISTS "calendar_settings" (
  "id" text PRIMARY KEY,
  "highlighted_days" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);
