-- BERKAHN — OPERAÇÃO COMERCIAL E ARQUIVOS DE LEADS
-- Migration aditiva: 026 já pode estar aplicada quando esta entrar.

CREATE TABLE IF NOT EXISTS lead_responsaveis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL CHECK (char_length(trim(nome)) BETWEEN 2 AND 80),
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  ordem INTEGER NOT NULL DEFAULT 0,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_lead_responsaveis_nome
  ON lead_responsaveis (lower(nome));

ALTER TABLE lead_responsaveis ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Berkahn admin manage lead responsaveis" ON lead_responsaveis;
CREATE POLICY "Berkahn admin manage lead responsaveis"
  ON lead_responsaveis FOR ALL TO authenticated
  USING (public.is_berkahn_admin())
  WITH CHECK (public.is_berkahn_admin());

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS responsavel_id UUID REFERENCES lead_responsaveis(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS prioridade TEXT NOT NULL DEFAULT 'normal',
  ADD COLUMN IF NOT EXISTS resumo_status TEXT,
  ADD COLUMN IF NOT EXISTS resumo_status_em TIMESTAMPTZ;

ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_prioridade_check;
ALTER TABLE leads ADD CONSTRAINT leads_prioridade_check
  CHECK (prioridade IN ('normal', 'alta', 'urgente'));

CREATE INDEX IF NOT EXISTS idx_leads_responsavel_ativos
  ON leads(responsavel_id, proxima_acao_em)
  WHERE arquivado_em IS NULL AND anonimizado_em IS NULL;
CREATE INDEX IF NOT EXISTS idx_leads_prioridade_ativos
  ON leads(prioridade, criado_em DESC)
  WHERE arquivado_em IS NULL AND anonimizado_em IS NULL;

CREATE TABLE IF NOT EXISTS lead_artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('drive_folder', 'external_link', 'upload')),
  estado TEXT NOT NULL DEFAULT 'ready' CHECK (estado IN ('pending', 'ready')),
  nome TEXT NOT NULL CHECK (char_length(trim(nome)) BETWEEN 1 AND 180),
  external_url TEXT,
  storage_bucket TEXT,
  storage_path TEXT,
  mime_type TEXT,
  size_bytes BIGINT CHECK (size_bytes IS NULL OR size_bytes BETWEEN 0 AND 6291456),
  criado_por UUID REFERENCES auth.users(id) ON DELETE SET NULL DEFAULT auth.uid(),
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT lead_artifacts_source_check CHECK (
    (tipo = 'upload' AND external_url IS NULL AND storage_bucket = 'lead-files' AND storage_path IS NOT NULL)
    OR
    (tipo IN ('drive_folder', 'external_link') AND external_url IS NOT NULL AND storage_bucket IS NULL AND storage_path IS NULL)
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_lead_artifacts_storage_path
  ON lead_artifacts(storage_bucket, storage_path)
  WHERE storage_path IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_lead_artifacts_lead
  ON lead_artifacts(lead_id, criado_em DESC);

ALTER TABLE lead_artifacts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Berkahn admin manage lead artifacts" ON lead_artifacts;
CREATE POLICY "Berkahn admin manage lead artifacts"
  ON lead_artifacts FOR ALL TO authenticated
  USING (public.is_berkahn_admin())
  WITH CHECK (public.is_berkahn_admin());

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'lead-files',
  'lead-files',
  FALSE,
  6291456,
  ARRAY[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'image/webp'
  ]::TEXT[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Berkahn admin read lead files" ON storage.objects;
DROP POLICY IF EXISTS "Berkahn admin insert lead files" ON storage.objects;
DROP POLICY IF EXISTS "Berkahn admin delete lead files" ON storage.objects;
CREATE POLICY "Berkahn admin read lead files" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'lead-files' AND public.is_berkahn_admin());
CREATE POLICY "Berkahn admin insert lead files" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'lead-files' AND public.is_berkahn_admin());
CREATE POLICY "Berkahn admin delete lead files" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'lead-files' AND public.is_berkahn_admin());

CREATE OR REPLACE FUNCTION public.update_lead_operations(
  p_id UUID,
  p_responsavel_id UUID,
  p_prioridade TEXT,
  p_resumo_status TEXT
)
RETURNS leads
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_lead leads%ROWTYPE;
BEGIN
  IF NOT public.is_berkahn_admin() THEN RAISE EXCEPTION 'Não autorizado'; END IF;
  IF p_prioridade NOT IN ('normal', 'alta', 'urgente') THEN
    RAISE EXCEPTION 'Prioridade inválida';
  END IF;
  IF p_responsavel_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM lead_responsaveis WHERE id = p_responsavel_id AND ativo = TRUE
  ) THEN
    RAISE EXCEPTION 'Responsável inválido ou inativo';
  END IF;

  UPDATE leads SET
    responsavel_id = p_responsavel_id,
    prioridade = p_prioridade,
    resumo_status = NULLIF(trim(p_resumo_status), ''),
    resumo_status_em = CASE
      WHEN resumo_status IS DISTINCT FROM NULLIF(trim(p_resumo_status), '') THEN NOW()
      ELSE resumo_status_em
    END
  WHERE id = p_id
  RETURNING * INTO v_lead;
  IF NOT FOUND THEN RAISE EXCEPTION 'Lead não encontrado'; END IF;

  INSERT INTO activity_logs (user_id, user_name, action, entity_type, entity_id, entity_name, details)
  VALUES (
    auth.uid(), COALESCE(auth.jwt()->>'email', 'Admin'), 'Situação operacional atualizada',
    'lead', p_id, 'Lead ' || left(p_id::TEXT, 8),
    jsonb_build_object(
      'responsavel_id', p_responsavel_id,
      'prioridade', p_prioridade,
      'resumo_status', NULLIF(trim(p_resumo_status), '')
    )
  );
  RETURN v_lead;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_lead_external_artifact(
  p_lead_id UUID,
  p_tipo TEXT,
  p_nome TEXT,
  p_url TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  IF NOT public.is_berkahn_admin() THEN RAISE EXCEPTION 'Não autorizado'; END IF;
  IF p_tipo NOT IN ('drive_folder', 'external_link') THEN RAISE EXCEPTION 'Tipo inválido'; END IF;
  IF trim(p_url) !~* '^https://' THEN RAISE EXCEPTION 'Use uma URL HTTPS'; END IF;

  INSERT INTO lead_artifacts (lead_id, tipo, nome, external_url)
  VALUES (p_lead_id, p_tipo, trim(p_nome), trim(p_url))
  RETURNING id INTO v_id;

  INSERT INTO activity_logs (user_id, user_name, action, entity_type, entity_id, entity_name, details)
  VALUES (
    auth.uid(), COALESCE(auth.jwt()->>'email', 'Admin'), 'Arquivo externo vinculado',
    'lead', p_lead_id, 'Lead ' || left(p_lead_id::TEXT, 8),
    jsonb_build_object('artifact_id', v_id, 'tipo', p_tipo)
  );
  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.update_lead_operations(UUID,UUID,TEXT,TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.create_lead_external_artifact(UUID,TEXT,TEXT,TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_lead_operations(UUID,UUID,TEXT,TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_lead_external_artifact(UUID,TEXT,TEXT,TEXT) TO authenticated;

-- Fila durável para objetos privados que precisam ser removidos pela Edge Function.
-- A referência sobrevive à anonimização e a falhas temporárias do Storage.
CREATE TABLE IF NOT EXISTS lead_storage_cleanup (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  bucket TEXT NOT NULL,
  path TEXT NOT NULL,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  tentativas INTEGER NOT NULL DEFAULT 0,
  ultimo_erro TEXT,
  UNIQUE (bucket, path)
);

ALTER TABLE lead_storage_cleanup ENABLE ROW LEVEL SECURITY;
-- Sem policies: somente service_role acessa a fila.

CREATE OR REPLACE FUNCTION public.anonymize_expired_lead(p_id UUID)
RETURNS TEXT[]
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_pdf_paths TEXT[];
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM leads
    WHERE id = p_id
      AND status <> 'convertido'
      AND retencao_excecao = FALSE
      AND anonimizado_em IS NULL
      AND atualizado_em < NOW() - INTERVAL '24 months'
    FOR UPDATE
  ) THEN
    RAISE EXCEPTION 'Lead não elegível para anonimização';
  END IF;

  SELECT COALESCE(
    array_agg(pdf_storage_path) FILTER (WHERE pdf_storage_path IS NOT NULL),
    ARRAY[]::TEXT[]
  )
  INTO v_pdf_paths
  FROM orcamentos
  WHERE lead_id = p_id;

  INSERT INTO lead_storage_cleanup (lead_id, bucket, path)
  SELECT p_id, storage_bucket, storage_path
  FROM lead_artifacts
  WHERE lead_id = p_id
    AND tipo = 'upload'
    AND storage_bucket IS NOT NULL
    AND storage_path IS NOT NULL
  ON CONFLICT (bucket, path) DO NOTHING;

  DELETE FROM lead_artifacts WHERE lead_id = p_id;

  UPDATE activity_logs
  SET entity_name = 'Lead ' || left(p_id::TEXT, 8),
      details = jsonb_build_object('tipo', 'anonimizado_por_retencao')
  WHERE entity_type = 'lead' AND entity_id = p_id;

  UPDATE orcamentos SET
    cliente_nome = 'Cliente anonimizado', cliente_email = NULL, cliente_telefone = NULL,
    obra_endereco = 'Anonimizado', obra_cidade = 'Anonimizado', obra_referencia = NULL,
    pdf_url = NULL, pdf_storage_path = NULL
  WHERE lead_id = p_id;

  UPDATE proposals SET
    client_name = 'Cliente anonimizado', client_email = NULL, client_phone = NULL,
    client_address = NULL, project_description = NULL, notes = NULL, internal_notes = NULL
  WHERE lead_id = p_id;

  UPDATE leads SET
    nome = 'Lead anonimizado', email = NULL, telefone = NULL, mensagem = NULL,
    tipo_projeto = NULL, empresa = NULL, cargo = NULL, referrer = NULL,
    request_fingerprint = NULL, motivo_desqualificacao = NULL,
    retencao_excecao_motivo = NULL, resumo_status = NULL,
    responsavel_id = NULL, anonimizado_em = NOW(),
    retencao_storage_pendente = v_pdf_paths
  WHERE id = p_id;

  RETURN v_pdf_paths;
END;
$$;

REVOKE ALL ON FUNCTION public.anonymize_expired_lead(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.anonymize_expired_lead(UUID) TO service_role;
