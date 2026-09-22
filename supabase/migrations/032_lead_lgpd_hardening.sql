-- BERKAHN — LEADS: ENDURECIMENTO LGPD (anonimização, retenção e trilha auditável)
--
-- O que muda:
-- 1. Anonimização completa: além do que a 027 já apagava, zera utm, landing_page e
--    sheet_sync_error, que a ingestão trata como sensíveis (app/api/leads/route.ts).
--    Backfill aplica o mesmo às linhas já anonimizadas.
--    origem_legado FICA de propósito: é a chave de idempotência do import
--    (índice único da 024 + upsert onConflict em scripts/leads/import-leads-csv.mjs).
--    Zerar a coluna faria o próximo import do mesmo CSV reinserir o lead com PII.
--    O ponteiro só reidentifica enquanto a planilha de origem guardar a PII.
-- 2. Relógio de retenção: deixa de usar atualizado_em, que o trigger renova em
--    qualquer UPDATE (ver, arquivar, mudar status). Passa a contar da última
--    interação real com o titular: GREATEST(criado_em, ultimo_contato_em).
--    ultimo_contato_em só muda em register_lead_activity com tipo 'contato' (024).
-- 3. Flag de retenção legal: RPC set_lead_retention_exception, só owner, com
--    motivo obrigatório ao ativar e registro em activity_logs.
-- 4. Eliminação a pedido do titular: corpo da anonimização extraído para
--    anonymize_lead_core (interna). anonymize_expired_lead vira wrapper com o
--    mesmo predicado de elegibilidade. anonymize_lead_on_request exige owner,
--    motivo, e recusa lead convertido ou com exceção de retenção (art. 16 LGPD:
--    obrigação legal de guarda prevalece; revise a exceção antes). PDFs de
--    orçamento vão para retencao_storage_pendente e o job mensal de retenção
--    os apaga, como já acontece no fluxo por prazo.
-- 5. activity_logs: INSERT de authenticated passa a exigir user_id = auth.uid(),
--    e um trigger sobrescreve user_name com o e-mail do JWT, para a timeline
--    do lead não aceitar autoria forjada via PostgREST.
--
-- Como reverter (manual, em ordem):
-- - Reaplicar os blocos de anonymize_expired_lead e get_lead_retention_candidates
--   da 027/024 (restaura o predicado por atualizado_em e o UPDATE antigo).
-- - DROP FUNCTION public.anonymize_lead_on_request(UUID, TEXT);
--   DROP FUNCTION public.set_lead_retention_exception(UUID, BOOLEAN, TEXT);
--   DROP FUNCTION public.anonymize_lead_core(UUID, TEXT);
-- - DROP TRIGGER activity_logs_bind_author ON public.activity_logs;
--   DROP FUNCTION public.bind_activity_log_author();
-- - Recriar a policy "Members insert scoped activity logs" como na 031:295-301.
-- O backfill de utm/landing_page/sheet_sync_error não é reversível (é o objetivo).

-- 1+4. Núcleo da anonimização, sem predicado de elegibilidade. Não é exposto:
-- quem chama (wrapper por prazo ou pedido do titular) decide se pode.
CREATE OR REPLACE FUNCTION public.anonymize_lead_core(p_id UUID, p_tipo TEXT)
RETURNS TEXT[]
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_pdf_paths TEXT[];
BEGIN
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
      details = jsonb_build_object('tipo', p_tipo)
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
    utm = '{}'::JSONB, landing_page = NULL, sheet_sync_error = NULL,
    responsavel_id = NULL, anonimizado_em = NOW(),
    retencao_storage_pendente = v_pdf_paths
  WHERE id = p_id;

  RETURN v_pdf_paths;
END;
$$;

REVOKE ALL ON FUNCTION public.anonymize_lead_core(UUID, TEXT) FROM PUBLIC, anon, authenticated;

-- 2. Mesmo contrato da 027 (assinatura, retorno, grant só service_role), com o
-- relógio baseado na última interação real e o corpo delegado ao núcleo.
CREATE OR REPLACE FUNCTION public.anonymize_expired_lead(p_id UUID)
RETURNS TEXT[]
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM leads
    WHERE id = p_id
      AND status <> 'convertido'
      AND retencao_excecao = FALSE
      AND anonimizado_em IS NULL
      AND GREATEST(criado_em, ultimo_contato_em) < NOW() - INTERVAL '24 months'
    FOR UPDATE
  ) THEN
    RAISE EXCEPTION 'Lead não elegível para anonimização';
  END IF;

  RETURN public.anonymize_lead_core(p_id, 'anonimizado_por_retencao');
END;
$$;

REVOKE ALL ON FUNCTION public.anonymize_expired_lead(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.anonymize_expired_lead(UUID) TO service_role;

-- CREATE OR REPLACE mantém a assinatura e os grants definidos na 024.
CREATE OR REPLACE FUNCTION public.get_lead_retention_candidates()
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
      AND GREATEST(l.criado_em, l.ultimo_contato_em) < NOW() - INTERVAL '24 months'
    )
    OR cardinality(l.retencao_storage_pendente) > 0
  GROUP BY l.id, l.retencao_storage_pendente, l.anonimizado_em;
$$;

-- 1. Backfill: linhas anonimizadas pela 027 ainda guardam campanha e página de entrada.
UPDATE leads SET
  utm = '{}'::JSONB, landing_page = NULL, sheet_sync_error = NULL
WHERE anonimizado_em IS NOT NULL
  AND (utm <> '{}'::JSONB OR landing_page IS NOT NULL OR sheet_sync_error IS NOT NULL);

-- 4. Pedido do titular. Só owner; motivo fica no log para comprovar o atendimento.
CREATE OR REPLACE FUNCTION public.anonymize_lead_on_request(p_id UUID, p_motivo TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_status TEXT;
  v_excecao BOOLEAN;
  v_anonimizado TIMESTAMPTZ;
BEGIN
  IF NOT public.has_admin_role(ARRAY['owner']) THEN RAISE EXCEPTION 'Não autorizado'; END IF;
  IF p_motivo IS NULL OR btrim(p_motivo) = '' THEN
    RAISE EXCEPTION 'Informe o motivo do pedido';
  END IF;

  SELECT status, retencao_excecao, anonimizado_em
  INTO v_status, v_excecao, v_anonimizado
  FROM leads WHERE id = p_id FOR UPDATE;

  IF NOT FOUND THEN RAISE EXCEPTION 'Lead não encontrado'; END IF;
  IF v_anonimizado IS NOT NULL THEN RAISE EXCEPTION 'Lead já anonimizado'; END IF;
  -- Guarda legal prevalece sobre o pedido: a exceção precisa ser revista antes.
  IF v_excecao THEN RAISE EXCEPTION 'Lead com exceção de retenção legal ativa'; END IF;
  IF v_status = 'convertido' THEN
    RAISE EXCEPTION 'Lead convertido tem documentos com guarda obrigatória';
  END IF;

  PERFORM public.anonymize_lead_core(p_id, 'anonimizado_a_pedido');

  -- Registrado depois do núcleo, que reescreve os logs anteriores do lead.
  INSERT INTO activity_logs (user_id, user_name, action, entity_type, entity_id, entity_name, details)
  VALUES (
    auth.uid(), COALESCE(auth.jwt()->>'email', 'Admin'), 'update', 'lead', p_id,
    'Lead ' || left(p_id::TEXT, 8),
    jsonb_build_object('tipo', 'anonimizado_a_pedido', 'motivo', left(btrim(p_motivo), 500))
  );
END;
$$;

REVOKE ALL ON FUNCTION public.anonymize_lead_on_request(UUID, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.anonymize_lead_on_request(UUID, TEXT) TO authenticated;

-- 3. Exceção de retenção legal, prometida na política de privacidade.
CREATE OR REPLACE FUNCTION public.set_lead_retention_exception(
  p_id UUID, p_ativo BOOLEAN, p_motivo TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_admin_role(ARRAY['owner']) THEN RAISE EXCEPTION 'Não autorizado'; END IF;
  IF p_ativo AND (p_motivo IS NULL OR btrim(p_motivo) = '') THEN
    RAISE EXCEPTION 'Informe o motivo da exceção';
  END IF;

  UPDATE leads SET
    retencao_excecao = p_ativo,
    retencao_excecao_motivo = CASE WHEN p_ativo THEN left(btrim(p_motivo), 500) ELSE NULL END
  WHERE id = p_id AND anonimizado_em IS NULL;
  IF NOT FOUND THEN RAISE EXCEPTION 'Lead não encontrado ou já anonimizado'; END IF;

  INSERT INTO activity_logs (user_id, user_name, action, entity_type, entity_id, entity_name, details)
  SELECT auth.uid(), COALESCE(auth.jwt()->>'email', 'Admin'), 'update', 'lead', l.id, l.nome,
    jsonb_build_object(
      'tipo', CASE WHEN p_ativo THEN 'retencao_excecao_ativada' ELSE 'retencao_excecao_removida' END,
      'motivo', NULLIF(left(btrim(COALESCE(p_motivo, '')), 500), '')
    )
  FROM leads l WHERE l.id = p_id;
END;
$$;

REVOKE ALL ON FUNCTION public.set_lead_retention_exception(UUID, BOOLEAN, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.set_lead_retention_exception(UUID, BOOLEAN, TEXT) TO authenticated;

-- 5. Autoria da timeline amarrada à sessão. Mesma regra de papel da 031.
DROP POLICY IF EXISTS "Members insert scoped activity logs" ON public.activity_logs;
CREATE POLICY "Members insert scoped activity logs" ON public.activity_logs
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND (
      public.has_admin_role(ARRAY['owner'])
      OR (public.has_admin_role(ARRAY['comercial']) AND entity_type IN ('lead', 'orcamento', 'proposal', 'task'))
      OR (public.has_admin_role(ARRAY['conteudo']) AND entity_type IN ('post', 'pauta', 'documento', 'presentation', 'task'))
    )
  );

-- user_name não cabe na policy sem quebrar quem manda 'Admin' como fallback; o
-- trigger ignora o valor do cliente quando há sessão. Sem sessão (service_role,
-- jobs) o valor enviado é mantido.
CREATE OR REPLACE FUNCTION public.bind_activity_log_author()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF (SELECT auth.uid()) IS NOT NULL THEN
    NEW.user_id := (SELECT auth.uid());
    NEW.user_name := COALESCE((SELECT auth.jwt()->>'email'), NEW.user_name);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS activity_logs_bind_author ON public.activity_logs;
CREATE TRIGGER activity_logs_bind_author
  BEFORE INSERT ON public.activity_logs
  FOR EACH ROW EXECUTE FUNCTION public.bind_activity_log_author();
