CREATE TABLE IF NOT EXISTS "home_settings" (
  "id" text PRIMARY KEY,
  "message" text NOT NULL DEFAULT '',
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);
