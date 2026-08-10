-- BERKAHN — CRM LEVE DE LEADS NO SUPABASE
-- Migration aditiva. Não agenda pg_cron e não depende de extensões opcionais.

CREATE OR REPLACE FUNCTION public.is_berkahn_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT lower(COALESCE(auth.jwt()->>'email', '')) = 'contato.berkahn@gmail.com';
$$;

REVOKE ALL ON FUNCTION public.is_berkahn_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_berkahn_admin() TO authenticated;

ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_status_check;
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_segmento_check;
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_canal_check;

ALTER TABLE leads
  ALTER COLUMN telefone DROP NOT NULL,
  ALTER COLUMN mensagem DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS tipo_projeto TEXT,
  ADD COLUMN IF NOT EXISTS empresa TEXT,
  ADD COLUMN IF NOT EXISTS cargo TEXT,
  ADD COLUMN IF NOT EXISTS telefone_normalizado TEXT,
  ADD COLUMN IF NOT EXISTS landing_page TEXT,
  ADD COLUMN IF NOT EXISTS referrer TEXT,
  ADD COLUMN IF NOT EXISTS visualizado_em TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS ultimo_contato_em TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS proxima_acao_em TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS motivo_desqualificacao TEXT,
  ADD COLUMN IF NOT EXISTS desqualificado_em TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS convertido_em TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS arquivado_em TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS anonimizado_em TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS origem_legado TEXT,
  ADD COLUMN IF NOT EXISTS importado_em TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS retencao_excecao BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS retencao_excecao_motivo TEXT,
  ADD COLUMN IF NOT EXISTS retencao_storage_pendente TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

ALTER TABLE leads
  ADD CONSTRAINT leads_status_check CHECK (
    status IN ('novo', 'em_contato', 'qualificado', 'proposta_enviada', 'convertido', 'desqualificado')
  ),
  ADD CONSTRAINT leads_segmento_check CHECK (
    segmento IN ('residencial', 'comercial', 'nao_definido')
  ),
  ADD CONSTRAINT leads_canal_check CHECK (
    canal IN ('form', 'whatsapp', 'telefone', 'email', 'indicacao', 'manual')
  );

UPDATE leads
SET motivo_desqualificacao = 'Legado sem motivo documentado'
WHERE status = 'desqualificado' AND motivo_desqualificacao IS NULL;

ALTER TABLE leads
  ADD CONSTRAINT leads_desqualificacao_motivo_check CHECK (
    status <> 'desqualificado'
    OR motivo_desqualificacao IS NOT NULL
    OR anonimizado_em IS NOT NULL
  );

CREATE OR REPLACE FUNCTION public.normalize_lead_phone_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.telefone_normalizado := NULLIF(regexp_replace(COALESCE(NEW.telefone, ''), '\D', '', 'g'), '');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS normalize_lead_phone ON leads;
CREATE TRIGGER normalize_lead_phone
  BEFORE INSERT OR UPDATE OF telefone ON leads
  FOR EACH ROW EXECUTE FUNCTION public.normalize_lead_phone_column();

UPDATE leads
SET telefone_normalizado = NULLIF(regexp_replace(COALESCE(telefone, ''), '\D', '', 'g'), '');

CREATE INDEX IF NOT EXISTS idx_leads_status_proxima_acao
  ON leads(status, proxima_acao_em)
  WHERE arquivado_em IS NULL AND anonimizado_em IS NULL;
CREATE INDEX IF NOT EXISTS idx_leads_nao_visualizados
  ON leads(criado_em DESC)
  WHERE visualizado_em IS NULL AND arquivado_em IS NULL;
CREATE INDEX IF NOT EXISTS idx_leads_telefone_normalizado
  ON leads(telefone_normalizado)
  WHERE telefone_normalizado IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_email_normalizado
  ON leads(lower(email))
  WHERE email IS NOT NULL;
DROP INDEX IF EXISTS idx_leads_origem_legado_unique;
CREATE UNIQUE INDEX idx_leads_origem_legado_unique ON leads(origem_legado);

ALTER TABLE orcamentos
  ADD COLUMN IF NOT EXISTS lead_id UUID REFERENCES leads(id) ON DELETE SET NULL;
ALTER TABLE proposals
  ADD COLUMN IF NOT EXISTS lead_id UUID REFERENCES leads(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_orcamentos_lead ON orcamentos(lead_id) WHERE lead_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_proposals_lead ON proposals(lead_id) WHERE lead_id IS NOT NULL;

-- A policy antiga liberava inclusive notas de lead para qualquer authenticated.
DROP POLICY IF EXISTS "Allow authenticated users to view activity logs" ON activity_logs;
DROP POLICY IF EXISTS "Allow authenticated users to insert activity logs" ON activity_logs;
DROP POLICY IF EXISTS "Authenticated users view scoped activity logs" ON activity_logs;
DROP POLICY IF EXISTS "Authenticated users insert scoped activity logs" ON activity_logs;

CREATE POLICY "Authenticated users view scoped activity logs"
  ON activity_logs FOR SELECT TO authenticated
  USING (entity_type <> 'lead' OR public.is_berkahn_admin());

CREATE POLICY "Authenticated users insert scoped activity logs"
  ON activity_logs FOR INSERT TO authenticated
  WITH CHECK (entity_type <> 'lead' OR public.is_berkahn_admin());

CREATE OR REPLACE FUNCTION public.create_manual_lead(
  p_nome TEXT,
  p_email TEXT,
  p_telefone TEXT,
  p_segmento TEXT,
  p_mensagem TEXT,
  p_canal TEXT,
  p_tipo_projeto TEXT,
  p_empresa TEXT,
  p_cargo TEXT,
  p_pagina_origem TEXT,
  p_cta_location TEXT,
  p_proxima_acao_em TIMESTAMPTZ
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  IF NOT public.is_berkahn_admin() THEN
    RAISE EXCEPTION 'Não autorizado';
  END IF;
  IF NULLIF(btrim(p_nome), '') IS NULL THEN
    RAISE EXCEPTION 'Nome é obrigatório';
  END IF;
  IF NULLIF(btrim(COALESCE(p_email, '')), '') IS NULL
     AND NULLIF(regexp_replace(COALESCE(p_telefone, ''), '\D', '', 'g'), '') IS NULL THEN
    RAISE EXCEPTION 'Informe telefone ou email';
  END IF;

  INSERT INTO leads (
    nome, email, telefone, segmento, mensagem, canal, tipo_projeto,
    empresa, cargo, pagina_origem, cta_location, proxima_acao_em,
    visualizado_em
  ) VALUES (
    btrim(p_nome), NULLIF(lower(btrim(COALESCE(p_email, ''))), ''),
    NULLIF(btrim(COALESCE(p_telefone, '')), ''), COALESCE(NULLIF(p_segmento, ''), 'nao_definido'),
    NULLIF(btrim(COALESCE(p_mensagem, '')), ''), COALESCE(NULLIF(p_canal, ''), 'manual'),
    NULLIF(btrim(COALESCE(p_tipo_projeto, '')), ''), NULLIF(btrim(COALESCE(p_empresa, '')), ''),
    NULLIF(btrim(COALESCE(p_cargo, '')), ''), NULLIF(btrim(COALESCE(p_pagina_origem, '')), ''),
    NULLIF(btrim(COALESCE(p_cta_location, '')), ''), p_proxima_acao_em, NOW()
  )
  RETURNING id INTO v_id;

  INSERT INTO activity_logs (
    user_id, user_name, action, entity_type, entity_id, entity_name, details
  ) VALUES (
    auth.uid(), COALESCE(auth.jwt()->>'email', 'Admin'), 'Lead criado manualmente',
    'lead', v_id, 'Lead ' || left(v_id::TEXT, 8),
    jsonb_build_object('tipo', 'criacao_manual', 'canal', COALESCE(NULLIF(p_canal, ''), 'manual'))
  );

  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_lead_status(
  p_id UUID,
  p_status TEXT,
  p_motivo TEXT DEFAULT NULL
)
RETURNS leads
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_anterior TEXT;
  v_lead leads%ROWTYPE;
BEGIN
  IF NOT public.is_berkahn_admin() THEN
    RAISE EXCEPTION 'Não autorizado';
  END IF;
  IF p_status NOT IN ('novo', 'em_contato', 'qualificado', 'proposta_enviada', 'convertido', 'desqualificado') THEN
    RAISE EXCEPTION 'Status inválido';
  END IF;
  IF p_status = 'desqualificado' AND NULLIF(btrim(COALESCE(p_motivo, '')), '') IS NULL THEN
    RAISE EXCEPTION 'Motivo da desqualificação é obrigatório';
  END IF;

  SELECT status INTO v_anterior FROM leads WHERE id = p_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Lead não encontrado'; END IF;

  UPDATE leads SET
    status = p_status,
    motivo_desqualificacao = CASE WHEN p_status = 'desqualificado' THEN btrim(p_motivo) ELSE NULL END,
    desqualificado_em = CASE WHEN p_status = 'desqualificado' THEN COALESCE(desqualificado_em, NOW()) ELSE NULL END,
    qualificado_em = CASE
      WHEN p_status IN ('qualificado', 'proposta_enviada', 'convertido') THEN COALESCE(qualificado_em, NOW())
      ELSE qualificado_em
    END,
    qualificado_por = CASE
      WHEN p_status IN ('qualificado', 'proposta_enviada', 'convertido') THEN COALESCE(qualificado_por, auth.uid())
      ELSE qualificado_por
    END,
    convertido_em = CASE WHEN p_status = 'convertido' THEN COALESCE(convertido_em, NOW()) ELSE NULL END,
    visualizado_em = COALESCE(visualizado_em, NOW())
  WHERE id = p_id
  RETURNING * INTO v_lead;

  INSERT INTO activity_logs (
    user_id, user_name, action, entity_type, entity_id, entity_name, details
  ) VALUES (
    auth.uid(), COALESCE(auth.jwt()->>'email', 'Admin'), 'Status do lead alterado',
    'lead', p_id, 'Lead ' || left(p_id::TEXT, 8),
    jsonb_strip_nulls(jsonb_build_object(
      'tipo', 'status', 'status_anterior', v_anterior, 'status_novo', p_status,
      'motivo_desqualificacao', NULLIF(btrim(COALESCE(p_motivo, '')), '')
    ))
  );

  RETURN v_lead;
END;
$$;

CREATE OR REPLACE FUNCTION public.register_lead_activity(
  p_id UUID,
  p_tipo TEXT,
  p_nota TEXT,
  p_proxima_acao_em TIMESTAMPTZ DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_berkahn_admin() THEN RAISE EXCEPTION 'Não autorizado'; END IF;
  IF p_tipo NOT IN ('nota', 'contato') THEN RAISE EXCEPTION 'Tipo de atividade inválido'; END IF;
  IF NULLIF(btrim(COALESCE(p_nota, '')), '') IS NULL THEN RAISE EXCEPTION 'Nota é obrigatória'; END IF;

  UPDATE leads SET
    ultimo_contato_em = CASE WHEN p_tipo = 'contato' THEN NOW() ELSE ultimo_contato_em END,
    proxima_acao_em = COALESCE(p_proxima_acao_em, proxima_acao_em),
    visualizado_em = COALESCE(visualizado_em, NOW())
  WHERE id = p_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Lead não encontrado'; END IF;

  INSERT INTO activity_logs (
    user_id, user_name, action, entity_type, entity_id, entity_name, details
  ) VALUES (
    auth.uid(), COALESCE(auth.jwt()->>'email', 'Admin'),
    CASE WHEN p_tipo = 'contato' THEN 'Contato com lead registrado' ELSE 'Nota do lead registrada' END,
    'lead', p_id, 'Lead ' || left(p_id::TEXT, 8),
    jsonb_strip_nulls(jsonb_build_object(
      'tipo', p_tipo, 'nota', btrim(p_nota), 'proxima_acao_em', p_proxima_acao_em
    ))
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.set_lead_next_action(p_id UUID, p_proxima_acao_em TIMESTAMPTZ)
RETURNS VOID
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_berkahn_admin() THEN RAISE EXCEPTION 'Não autorizado'; END IF;
  UPDATE leads SET proxima_acao_em = p_proxima_acao_em, visualizado_em = COALESCE(visualizado_em, NOW())
  WHERE id = p_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Lead não encontrado'; END IF;

  INSERT INTO activity_logs (user_id, user_name, action, entity_type, entity_id, entity_name, details)
  VALUES (
    auth.uid(), COALESCE(auth.jwt()->>'email', 'Admin'), 'Próxima ação do lead alterada',
    'lead', p_id, 'Lead ' || left(p_id::TEXT, 8),
    jsonb_build_object('tipo', 'proxima_acao', 'proxima_acao_em', p_proxima_acao_em)
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.mark_lead_viewed(p_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_berkahn_admin() THEN RAISE EXCEPTION 'Não autorizado'; END IF;
  UPDATE leads SET visualizado_em = COALESCE(visualizado_em, NOW()) WHERE id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_lead_archived(p_id UUID, p_arquivado BOOLEAN)
RETURNS VOID
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_berkahn_admin() THEN RAISE EXCEPTION 'Não autorizado'; END IF;
  UPDATE leads SET arquivado_em = CASE WHEN p_arquivado THEN NOW() ELSE NULL END WHERE id = p_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Lead não encontrado'; END IF;

  INSERT INTO activity_logs (user_id, user_name, action, entity_type, entity_id, entity_name, details)
  VALUES (
    auth.uid(), COALESCE(auth.jwt()->>'email', 'Admin'),
    CASE WHEN p_arquivado THEN 'Lead arquivado' ELSE 'Lead reaberto' END,
    'lead', p_id, 'Lead ' || left(p_id::TEXT, 8),
    jsonb_build_object('tipo', 'arquivamento', 'arquivado', p_arquivado)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.create_manual_lead(TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TIMESTAMPTZ) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.update_lead_status(UUID,TEXT,TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.register_lead_activity(UUID,TEXT,TEXT,TIMESTAMPTZ) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.set_lead_next_action(UUID,TIMESTAMPTZ) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.mark_lead_viewed(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.set_lead_archived(UUID,BOOLEAN) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_manual_lead(TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TIMESTAMPTZ) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_lead_status(UUID,TEXT,TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.register_lead_activity(UUID,TEXT,TEXT,TIMESTAMPTZ) TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_lead_next_action(UUID,TIMESTAMPTZ) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_lead_viewed(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_lead_archived(UUID,BOOLEAN) TO authenticated;

DROP FUNCTION IF EXISTS public.get_lead_retention_candidates();
CREATE FUNCTION public.get_lead_retention_candidates()
RETURNS TABLE (lead_id UUID, pdf_paths TEXT[], requires_anonymization BOOLEAN)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    l.id,
    CASE
      WHEN cardinality(l.retencao_storage_pendente) > 0 THEN l.retencao_storage_pendente
      ELSE COALESCE(
        array_agg(o.pdf_storage_path) FILTER (WHERE o.pdf_storage_path IS NOT NULL),
        ARRAY[]::TEXT[]
      )
    END,
    l.anonimizado_em IS NULL
  FROM leads l
  LEFT JOIN orcamentos o ON o.lead_id = l.id
  WHERE (
      l.status <> 'convertido'
      AND l.retencao_excecao = FALSE
      AND l.anonimizado_em IS NULL
      AND l.atualizado_em < NOW() - INTERVAL '24 months'
    )
    OR cardinality(l.retencao_storage_pendente) > 0
  GROUP BY l.id, l.retencao_storage_pendente, l.anonimizado_em;
$$;

DROP FUNCTION IF EXISTS public.anonymize_expired_lead(UUID);
CREATE FUNCTION public.anonymize_expired_lead(p_id UUID)
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
    retencao_excecao_motivo = NULL, anonimizado_em = NOW(),
    retencao_storage_pendente = v_pdf_paths
  WHERE id = p_id;

  RETURN v_pdf_paths;
END;
$$;

CREATE OR REPLACE FUNCTION public.complete_lead_storage_cleanup(p_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE leads
  SET retencao_storage_pendente = ARRAY[]::TEXT[]
  WHERE id = p_id AND anonimizado_em IS NOT NULL;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Lead anonimizado não encontrado';
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.get_lead_retention_candidates() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.anonymize_expired_lead(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.complete_lead_storage_cleanup(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_lead_retention_candidates() TO service_role;
GRANT EXECUTE ON FUNCTION public.anonymize_expired_lead(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.complete_lead_storage_cleanup(UUID) TO service_role;
