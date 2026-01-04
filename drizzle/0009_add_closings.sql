CREATE TABLE IF NOT EXISTS "closings" (
  "id" text PRIMARY KEY NOT NULL,
  "observation" text,
  "closed_by" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE "sales" ADD COLUMN IF NOT EXISTS "closing_id" text REFERENCES "closings"("id");
ALTER TABLE "sangrias" ADD COLUMN IF NOT EXISTS "closing_id" text REFERENCES "closings"("id");

CREATE INDEX IF NOT EXISTS "idx_sales_closing_id" ON "sales" ("closing_id");
CREATE INDEX IF NOT EXISTS "idx_sangrias_closing_id" ON "sangrias" ("closing_id");
