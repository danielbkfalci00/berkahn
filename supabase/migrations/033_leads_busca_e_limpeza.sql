-- BERKAHN — LEADS: ÍNDICES DE BUSCA TEXTUAL
--
-- O que muda:
-- 1. Habilita pg_trgm (schema extensions, como pg_net na 025).
-- 2. Cria índices GIN trigram nas quatro colunas que a busca de
--    app/admin/leads/page.tsx filtra com ILIKE '%termo%': nome, email, telefone
--    e telefone_normalizado. Sem trigram, ILIKE com curinga no início não usa
--    B-tree e cada busca varre a tabela inteira.
--
-- O que NÃO muda (de propósito):
-- - As colunas sheet_sync_* ficam. scripts/leads/import-leads-csv.mjs ainda
--   grava sheet_sync_status no upsert do import legado, e a 032 zera
--   sheet_sync_error na anonimização. O drop espera esses usos saírem.
--
-- Como reverter:
--   DROP INDEX IF EXISTS public.leads_nome_trgm_idx;
--   DROP INDEX IF EXISTS public.leads_email_trgm_idx;
--   DROP INDEX IF EXISTS public.leads_telefone_trgm_idx;
--   DROP INDEX IF EXISTS public.leads_telefone_normalizado_trgm_idx;
--   (pg_trgm pode ficar; DROP EXTENSION só se nada mais depender dela.)

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA extensions;

CREATE INDEX IF NOT EXISTS leads_nome_trgm_idx
  ON public.leads USING GIN (nome extensions.gin_trgm_ops);
CREATE INDEX IF NOT EXISTS leads_email_trgm_idx
  ON public.leads USING GIN (email extensions.gin_trgm_ops);
CREATE INDEX IF NOT EXISTS leads_telefone_trgm_idx
  ON public.leads USING GIN (telefone extensions.gin_trgm_ops);
CREATE INDEX IF NOT EXISTS leads_telefone_normalizado_trgm_idx
  ON public.leads USING GIN (telefone_normalizado extensions.gin_trgm_ops);
