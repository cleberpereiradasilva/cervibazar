-- Seeds iniciais para categorias e motivos de sangria (UTC-3).
INSERT INTO "categories" (id, name, icon, created_by, day, created_at, updated_at)
VALUES
  ('cat-roupas-fem', 'Roupas Femininas', 'shopping_bag', 'cbadmin001', date_trunc('day', timezone('-03', now())), timezone('-03', now()), timezone('-03', now())),
  ('cat-roupas-masc', 'Roupas Masculinas', 'shirt', 'cbadmin001', date_trunc('day', timezone('-03', now())), timezone('-03', now()), timezone('-03', now())),
  ('cat-infantil', 'Infantil', 'toys', 'cbadmin001', date_trunc('day', timezone('-03', now())), timezone('-03', now()), timezone('-03', now())),
  ('cat-calcados', 'Calçados', 'shoe', 'cbadmin001', date_trunc('day', timezone('-03', now())), timezone('-03', now()), timezone('-03', now())),
  ('cat-acessorios', 'Acessórios & Bazar', 'watch', 'cbadmin001', date_trunc('day', timezone('-03', now())), timezone('-03', now()), timezone('-03', now()))
ON CONFLICT (id) DO NOTHING;

INSERT INTO "sangria_reasons" (id, name, created_by, day, created_at, updated_at)
VALUES
  ('sr-troco', 'Troco inicial devolvido', 'cbadmin001', date_trunc('day', timezone('-03', now())), timezone('-03', now()), timezone('-03', now())),
  ('sr-despesa', 'Despesa operacional', 'cbadmin001', date_trunc('day', timezone('-03', now())), timezone('-03', now()), timezone('-03', now())),
  ('sr-deposito', 'Depósito bancário', 'cbadmin001', date_trunc('day', timezone('-03', now())), timezone('-03', now()), timezone('-03', now()))
ON CONFLICT (id) DO NOTHING;

