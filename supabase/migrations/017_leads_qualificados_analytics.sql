-- BERKAHN - LEADS COMO FONTE PRIM?RIA E RECOMENDA??ES APROV?VEIS

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  email TEXT,
  telefone TEXT NOT NULL,
  segmento TEXT NOT NULL CHECK (segmento IN ('residencial', 'comercial')),
  mensagem TEXT NOT NULL,
  canal TEXT NOT NULL DEFAULT 'form' CHECK (canal IN ('form', 'whatsapp', 'manual')),
  status TEXT NOT NULL DEFAULT 'novo' CHECK (status IN ('novo', 'qualificado', 'desqualificado', 'convertido')),
  pagina_origem TEXT,
  slug_origem TEXT,
  cta_location TEXT,
  utm JSONB NOT NULL DEFAULT '{}'::JSONB,
  post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
  pauta_id UUID REFERENCES conteudo_pautas(id) ON DELETE SET NULL,
  request_fingerprint TEXT,
  qualificado_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  qualificado_em TIMESTAMPTZ,
  sheet_sync_status TEXT NOT NULL DEFAULT 'pendente' CHECK (sheet_sync_status IN ('pendente', 'sincronizado', 'falhou')),
  sheet_sync_tentativas INTEGER NOT NULL DEFAULT 0 CHECK (sheet_sync_tentativas >= 0),
  sheet_synced_at TIMESTAMPTZ,
  sheet_sync_error TEXT,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leads_status_criado ON leads(status, criado_em DESC);
CREATE INDEX idx_leads_pauta ON leads(pauta_id, criado_em DESC);
CREATE INDEX idx_leads_fingerprint ON leads(request_fingerprint, criado_em DESC)
  WHERE request_fingerprint IS NOT NULL;

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_atualizado_em_column();

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Berkahn admin manage leads" ON leads
  FOR ALL TO authenticated
  USING (lower(COALESCE(auth.jwt()->>'email', '')) = 'contato.berkahn@gmail.com')
  WITH CHECK (lower(COALESCE(auth.jwt()->>'email', '')) = 'contato.berkahn@gmail.com');

ALTER TABLE analytics_tasks
  ADD COLUMN IF NOT EXISTS pauta_id UUID REFERENCES conteudo_pautas(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS evidence JSONB NOT NULL DEFAULT '{}'::JSONB,
  ADD COLUMN IF NOT EXISTS approval_status TEXT NOT NULL DEFAULT 'aprovada'
    CHECK (approval_status IN ('pendente', 'aprovada', 'rejeitada'));

CREATE INDEX IF NOT EXISTS idx_analytics_tasks_pauta ON analytics_tasks(pauta_id);
CREATE INDEX IF NOT EXISTS idx_analytics_tasks_approval ON analytics_tasks(approval_status, status);

ALTER TABLE activity_logs DROP CONSTRAINT IF EXISTS activity_logs_entity_type_check;
ALTER TABLE activity_logs ADD CONSTRAINT activity_logs_entity_type_check
  CHECK (entity_type IN
    ('post', 'proposal', 'presentation', 'task', 'orcamento', 'pauta', 'lead', 'automation_job'));
