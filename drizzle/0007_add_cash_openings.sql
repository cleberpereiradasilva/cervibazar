CREATE TABLE IF NOT EXISTS "cash_openings" (
  "id" text PRIMARY KEY NOT NULL,
  "amount" numeric(12, 2) NOT NULL,
  "created_by" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  "deleted_at" timestamp
);
