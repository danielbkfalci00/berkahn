-- ============================================
-- BERKAHN - DOCUMENTOS (seção /admin/documentacoes)
-- ============================================
-- Run this migration in your Supabase SQL Editor
-- Armazena documentos HTML standalone (relatórios de performance, estratégia
-- editorial) exibidos em /admin/documentacoes.
--
-- Por que o HTML mora aqui e não no filesystem: a Vercel só sobe para a Lambda
-- o que o output file tracing enxerga. Um fs.readFile("Berkahn-Vault/...")
-- montado em runtime é invisível ao tracer e falha com ENOENT em produção.
-- O cron berkahn-performance-mensal já escreve nesta base com service_role no
-- mesmo run em que renderiza o HTML, então persistir aqui não adiciona
-- superfície nova.

CREATE TABLE IF NOT EXISTS documentos (
  slug            TEXT PRIMARY KEY,          -- "2026-06-performance-blog"
  titulo          TEXT NOT NULL,
  categoria       TEXT NOT NULL,             -- "performance-mensal" | "estrategia-editorial"
  resumo          TEXT,
  periodo_label   TEXT,                      -- "Junho/2026"
  referencia_data DATE NOT NULL,             -- 2026-06-01 (ordenação cronológica)
  html            TEXT NOT NULL,             -- documento standalone completo
  gerado_em       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_documentos_referencia_desc
  ON documentos (referencia_data DESC);

-- ============================================
-- RLS
-- ============================================
ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;

-- service_role bypassa RLS (cron INSERT/UPSERT)
-- Authenticated users (admin login) podem SELECT
DROP POLICY IF EXISTS "Authenticated admin SELECT" ON documentos;
CREATE POLICY "Authenticated admin SELECT"
  ON documentos FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE documentos IS 'Documentos HTML standalone exibidos em /admin/documentacoes. Populado pelo cron berkahn-performance-mensal (relatórios mensais) e por scripts/documentacoes/seed-documentos.mjs (demais).';
COMMENT ON COLUMN documentos.slug IS 'Chave de upsert. Igual ao nome do arquivo sem extensão, ex: 2026-06-performance-blog.';
COMMENT ON COLUMN documentos.html IS 'Documento HTML completo (<!DOCTYPE html> ... </html>), servido via iframe em /admin/documentacoes/[slug]/raw. Nunca incluir esta coluna em query de listagem.';
COMMENT ON COLUMN documentos.referencia_data IS 'Data que o documento descreve, não a de geração. Primeiro dia do mês para relatórios mensais.';
COMMENT ON COLUMN documentos.atualizado_em IS 'Atualizado a cada upsert. Exibido no viewer para revelar documento desatualizado em relação ao MD fonte no vault.';
