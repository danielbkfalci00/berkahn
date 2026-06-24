-- ============================================
-- BERKAHN ADMIN - ORCAMENTOS (Estimativa Preliminar Premium)
-- ============================================
-- Run this migration in your Supabase SQL Editor.
-- Cria tabela `orcamentos`, sequence para numero auto-incremental,
-- funcao trigger BEFORE INSERT, RLS e 3 buckets Storage.
--
-- Distinto de:
--   * `proposals` (001_initial_schema.sql:91) - proposta comercial transacional
--   * `/orcamento/pdf` LSF (lib/orcamento-data.ts) - dados hardcoded Chale Johny
--
-- Plano: ~/.claude/plans/eu-preciso-seguir-com-optimized-starlight.md
-- Hub vault: Berkahn-Vault/00-meta/projetos/orcamento-automacao.md

-- ============================================
-- SEQUENCE para numero auto-incremental
-- ============================================

CREATE SEQUENCE IF NOT EXISTS orcamento_numero_seq START 1;

-- Funcao que gera o numero no formato BRK-YYYY-NNNN (4 digitos pad-left)
CREATE OR REPLACE FUNCTION gerar_numero_orcamento()
RETURNS TEXT AS $$
BEGIN
  RETURN 'BRK-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('orcamento_numero_seq')::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TABELA orcamentos
-- ============================================

CREATE TABLE IF NOT EXISTS orcamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'finalizado', 'arquivado')),
  slug TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(6), 'hex'),

  -- Cliente
  cliente_nome TEXT NOT NULL,
  cliente_email TEXT,
  cliente_telefone TEXT,

  -- Obra
  obra_endereco TEXT NOT NULL,
  obra_cidade TEXT NOT NULL,
  obra_referencia TEXT,
  projeto_area_m2 INTEGER NOT NULL CHECK (projeto_area_m2 > 0),
  projeto_pavimentos INTEGER NOT NULL DEFAULT 1 CHECK (projeto_pavimentos > 0),
  projeto_piscina TEXT,
  projeto_padrao TEXT NOT NULL CHECK (projeto_padrao IN ('baixo', 'medio', 'alto', 'altissimo')),

  -- Valores (faixa min-max)
  valor_min NUMERIC(14, 2) NOT NULL CHECK (valor_min >= 0),
  valor_max NUMERIC(14, 2) NOT NULL CHECK (valor_max >= valor_min),
  valor_m2_min NUMERIC(12, 2) NOT NULL CHECK (valor_m2_min >= 0),
  valor_m2_max NUMERIC(12, 2) NOT NULL CHECK (valor_m2_max >= valor_m2_min),
  regime_recomendado TEXT NOT NULL DEFAULT 'indefinido' CHECK (regime_recomendado IN ('administracao', 'fechado', 'pmg', 'indefinido')),
  data_cotacao DATE NOT NULL DEFAULT CURRENT_DATE,

  -- Datas
  data_elaboracao DATE NOT NULL DEFAULT CURRENT_DATE,
  validade_dias INTEGER NOT NULL DEFAULT 30 CHECK (validade_dias > 0),

  -- Conteudo customizavel
  hero_image_url TEXT,
  condicionantes_extras JSONB NOT NULL DEFAULT '[]'::jsonb,
  exclusoes_extras JSONB NOT NULL DEFAULT '[]'::jsonb,
  entrega_categorias_ativas JSONB NOT NULL DEFAULT '["engenharia","suprimentos","fornecedores","planejamento","relatorios","qualidade","seguranca","canteiro","garantia"]'::jsonb,
  responsavel_tecnico TEXT,

  -- Artefatos
  pdf_url TEXT,
  pdf_storage_path TEXT,

  -- Auditoria
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  criado_por TEXT
);

-- Indices para queries comuns
CREATE INDEX IF NOT EXISTS idx_orcamentos_status ON orcamentos(status);
CREATE INDEX IF NOT EXISTS idx_orcamentos_cliente_nome ON orcamentos(cliente_nome);
CREATE INDEX IF NOT EXISTS idx_orcamentos_criado_em ON orcamentos(criado_em DESC);
CREATE INDEX IF NOT EXISTS idx_orcamentos_slug ON orcamentos(slug);

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-preenche `numero` se vazio (BEFORE INSERT)
CREATE OR REPLACE FUNCTION orcamentos_set_numero()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.numero IS NULL OR NEW.numero = '' THEN
    NEW.numero := gerar_numero_orcamento();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_orcamentos_set_numero ON orcamentos;
CREATE TRIGGER trg_orcamentos_set_numero
  BEFORE INSERT ON orcamentos
  FOR EACH ROW
  EXECUTE FUNCTION orcamentos_set_numero();

-- Auto-atualiza `atualizado_em` (BEFORE UPDATE)
-- Reusa funcao update_updated_at_column criada em 001, adaptando para nome de coluna em pt-BR
CREATE OR REPLACE FUNCTION orcamentos_set_atualizado_em()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_orcamentos_set_atualizado_em ON orcamentos;
CREATE TRIGGER trg_orcamentos_set_atualizado_em
  BEFORE UPDATE ON orcamentos
  FOR EACH ROW
  EXECUTE FUNCTION orcamentos_set_atualizado_em();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE orcamentos ENABLE ROW LEVEL SECURITY;

-- Authenticated admins podem fazer CRUD (mesmo padrao de posts/proposals)
DROP POLICY IF EXISTS "Allow authenticated users to manage orcamentos" ON orcamentos;
CREATE POLICY "Allow authenticated users to manage orcamentos"
  ON orcamentos
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- NAO expor a anon - dados comerciais sensiveis.
-- Service role bypassa RLS para operacoes server-side (rota renderizadora gera com SUPABASE_SERVICE_KEY).

-- ============================================
-- ACTIVITY LOGS - estende entity_type para 'orcamento'
-- ============================================

ALTER TABLE activity_logs DROP CONSTRAINT IF EXISTS activity_logs_entity_type_check;
ALTER TABLE activity_logs ADD CONSTRAINT activity_logs_entity_type_check
  CHECK (entity_type IN ('post', 'proposal', 'presentation', 'task', 'orcamento'));

-- ============================================
-- STORAGE BUCKETS
-- ============================================
-- Rodar via Supabase Dashboard > Storage OU executar os INSERTs abaixo:

-- orcamento-pdfs: PRIVADO, signed URLs (validade 7 dias gerada na API)
INSERT INTO storage.buckets (id, name, public)
VALUES ('orcamento-pdfs', 'orcamento-pdfs', false)
ON CONFLICT (id) DO NOTHING;

-- orcamento-heroes: PRIVADO, signed URLs
INSERT INTO storage.buckets (id, name, public)
VALUES ('orcamento-heroes', 'orcamento-heroes', false)
ON CONFLICT (id) DO NOTHING;

-- orcamento-templates: PUBLICO, hospeda modelo-orcamento.xlsx para download
INSERT INTO storage.buckets (id, name, public)
VALUES ('orcamento-templates', 'orcamento-templates', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: authenticated pode tudo, anon nao acessa os privados
-- Templates: anon pode SELECT (bucket public ja libera, mas explicitamos)

-- ============================================
-- COMMENTS (documentacao no schema)
-- ============================================

COMMENT ON TABLE orcamentos IS 'Estimativas preliminares premium - gerador automatico via admin (form ou upload planilha-modelo). Cria PDFs A4 com identidade Berkahn. Distinto de proposals (transacional) e orcamento-data LSF (hardcoded).';
COMMENT ON COLUMN orcamentos.numero IS 'BRK-YYYY-NNNN auto-gerado via trigger (gerar_numero_orcamento). Override permitido se informado no INSERT.';
COMMENT ON COLUMN orcamentos.slug IS 'Slug curto hex para URL admin (/admin/orcamentos/[id] pode usar slug); auto-gerado via gen_random_bytes.';
COMMENT ON COLUMN orcamentos.entrega_categorias_ativas IS 'Array JSONB de CardEntregaId - quais dos 9 cards "O que entregamos" mostrar no PDF. Default: todos 9.';
COMMENT ON COLUMN orcamentos.condicionantes_extras IS 'Array JSONB de CondicionanteExtra ({texto: string}) - extras alem dos defaults exibidos no PDF.';
COMMENT ON COLUMN orcamentos.exclusoes_extras IS 'Array JSONB de ExclusaoExtra ({texto: string}) - extras alem dos defaults exibidos no PDF.';
COMMENT ON COLUMN orcamentos.pdf_url IS 'Signed URL atual (validade 7 dias). Para URL fresca, chamar /api/admin/orcamentos/[id]/pdf-url.';
COMMENT ON COLUMN orcamentos.pdf_storage_path IS 'Path interno no bucket orcamento-pdfs (ex: 2026/06/BRK-2026-0001.pdf).';
