-- ADMIN: revisões atômicas, fila comercial, idempotência e indicadores com RLS.
-- Aplicar antes do deploy do código correspondente. Nenhuma infraestrutura local.
BEGIN;

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS submission_id UUID,
  ADD COLUMN IF NOT EXISTS submission_payload_hash TEXT,
  ADD COLUMN IF NOT EXISTS tipo_captacao TEXT NOT NULL DEFAULT 'contato'
    CHECK (tipo_captacao IN ('contato','material')),
  ADD COLUMN IF NOT EXISTS prioridade_ordem SMALLINT GENERATED ALWAYS AS
    (CASE prioridade WHEN 'urgente' THEN 0 WHEN 'alta' THEN 1 ELSE 2 END) STORED;
CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_submission_id
  ON public.leads(submission_id) WHERE submission_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_fila_aberta
  ON public.leads(proxima_acao_em ASC NULLS LAST, prioridade_ordem, criado_em, id)
  WHERE arquivado_em IS NULL AND anonimizado_em IS NULL
    AND status NOT IN ('convertido', 'desqualificado');

ALTER TABLE public.orcamentos
  ADD COLUMN IF NOT EXISTS pdf_generated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS pdf_revision_hash TEXT;
ALTER TABLE public.lead_notification_outbox
  ADD COLUMN IF NOT EXISTS delivered_subscription_ids UUID[] NOT NULL DEFAULT '{}';
ALTER TABLE public.lead_notification_outbox
  DROP CONSTRAINT IF EXISTS lead_notification_outbox_estado_check;
ALTER TABLE public.lead_notification_outbox
  ADD CONSTRAINT lead_notification_outbox_estado_check
  CHECK (estado IN ('pending', 'sending', 'sent', 'failed', 'skipped_no_subscribers', 'skipped_resolved'));

-- Mesma convenção de lib/contact.ts. Não modifica o telefone original.
CREATE OR REPLACE FUNCTION public.normalize_lead_phone_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
DECLARE v_raw TEXT := btrim(COALESCE(NEW.telefone, '')); v_digits TEXT;
BEGIN
  v_digits := regexp_replace(v_raw, '\D', '', 'g');
  NEW.telefone_normalizado := NULLIF(CASE
    WHEN left(v_raw, 1) = '+' THEN v_digits
    WHEN left(v_digits, 2) = '00' THEN substr(v_digits, 3)
    WHEN length(v_digits) IN (10, 11) THEN '55' || v_digits
    ELSE v_digits END, '');
  RETURN NEW;
END;
$$;

-- A normalização técnica não reinicia o prazo de retenção do lead.
ALTER TABLE public.leads DISABLE TRIGGER update_leads_updated_at;
UPDATE public.leads SET tipo_captacao = 'material'
WHERE nome = 'Download de material' AND canal = 'email'
  AND mensagem LIKE 'Material solicitado: %' AND cta_location = 'article-resource-download';
WITH normalized AS (
  SELECT id, NULLIF(CASE
    WHEN left(btrim(COALESCE(telefone, '')), 1) = '+' THEN regexp_replace(telefone, '\D', '', 'g')
    WHEN left(regexp_replace(COALESCE(telefone, ''), '\D', '', 'g'), 2) = '00'
      THEN substr(regexp_replace(telefone, '\D', '', 'g'), 3)
    WHEN length(regexp_replace(COALESCE(telefone, ''), '\D', '', 'g')) IN (10, 11)
      THEN '55' || regexp_replace(telefone, '\D', '', 'g')
    ELSE regexp_replace(COALESCE(telefone, ''), '\D', '', 'g') END, '') AS phone
  FROM public.leads
)
UPDATE public.leads l SET telefone_normalizado = n.phone
FROM normalized n WHERE l.id = n.id AND l.telefone_normalizado IS DISTINCT FROM n.phone;
UPDATE public.leads SET proxima_acao_em = NULL
WHERE status IN ('convertido', 'desqualificado') AND proxima_acao_em IS NOT NULL;
ALTER TABLE public.leads ENABLE TRIGGER update_leads_updated_at;

CREATE OR REPLACE FUNCTION public.update_lead_status(p_id UUID, p_status TEXT, p_motivo TEXT DEFAULT NULL)
RETURNS public.leads LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
DECLARE v_anterior TEXT; v_lead public.leads%ROWTYPE;
BEGIN
  IF NOT public.is_berkahn_admin() THEN RAISE EXCEPTION 'Não autorizado'; END IF;
  IF p_status IS NULL OR p_status NOT IN ('novo', 'em_contato', 'qualificado', 'proposta_enviada', 'convertido', 'desqualificado') THEN
    RAISE EXCEPTION 'Status inválido';
  END IF;
  IF p_status = 'desqualificado' AND NULLIF(btrim(COALESCE(p_motivo, '')), '') IS NULL THEN
    RAISE EXCEPTION 'Motivo da desqualificação é obrigatório';
  END IF;
  SELECT status INTO v_anterior FROM public.leads WHERE id = p_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Lead não encontrado'; END IF;
  UPDATE public.leads SET
    status = p_status,
    motivo_desqualificacao = CASE WHEN p_status = 'desqualificado' THEN btrim(p_motivo) ELSE NULL END,
    desqualificado_em = CASE WHEN p_status = 'desqualificado' THEN COALESCE(desqualificado_em, NOW()) ELSE NULL END,
    qualificado_em = CASE WHEN p_status IN ('qualificado', 'proposta_enviada', 'convertido') THEN COALESCE(qualificado_em, NOW()) ELSE qualificado_em END,
    qualificado_por = CASE WHEN p_status IN ('qualificado', 'proposta_enviada', 'convertido') THEN COALESCE(qualificado_por, auth.uid()) ELSE qualificado_por END,
    convertido_em = CASE WHEN p_status = 'convertido' THEN COALESCE(convertido_em, NOW()) ELSE convertido_em END,
    proxima_acao_em = CASE WHEN p_status IN ('convertido', 'desqualificado') THEN NULL ELSE proxima_acao_em END,
    visualizado_em = COALESCE(visualizado_em, NOW())
  WHERE id = p_id RETURNING * INTO v_lead;
  INSERT INTO public.activity_logs(user_id, user_name, action, entity_type, entity_id, entity_name, details)
  VALUES (auth.uid(), COALESCE(auth.jwt()->>'email', 'Admin'), 'Status do lead alterado', 'lead', p_id,
    'Lead ' || left(p_id::TEXT, 8), jsonb_strip_nulls(jsonb_build_object(
      'tipo', 'status', 'status_anterior', v_anterior, 'status_novo', p_status,
      'motivo_desqualificacao', NULLIF(btrim(COALESCE(p_motivo, '')), ''))));
  RETURN v_lead;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_lead_next_action(p_id UUID, p_proxima_acao_em TIMESTAMPTZ)
RETURNS VOID LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
DECLARE v_status TEXT;
BEGIN
  IF NOT public.is_berkahn_admin() THEN RAISE EXCEPTION 'Não autorizado'; END IF;
  SELECT status INTO v_status FROM public.leads WHERE id = p_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Lead não encontrado'; END IF;
  IF v_status IN ('convertido', 'desqualificado') AND p_proxima_acao_em IS NOT NULL THEN
    RAISE EXCEPTION 'Reabra o lead antes de agendar uma próxima ação';
  END IF;
  UPDATE public.leads SET proxima_acao_em = p_proxima_acao_em, visualizado_em = COALESCE(visualizado_em, NOW()) WHERE id = p_id;
  INSERT INTO public.activity_logs(user_id, user_name, action, entity_type, entity_id, entity_name, details)
  VALUES (auth.uid(), COALESCE(auth.jwt()->>'email', 'Admin'), 'Próxima ação do lead alterada', 'lead', p_id,
    'Lead ' || left(p_id::TEXT, 8), jsonb_build_object('tipo', 'proxima_acao', 'proxima_acao_em', p_proxima_acao_em));
END;
$$;

-- NULL em próxima ação significa limpar explicitamente, não manter a ação vencida.
CREATE OR REPLACE FUNCTION public.register_lead_attendance(
  p_id UUID, p_nota TEXT, p_status TEXT, p_proxima_acao_em TIMESTAMPTZ, p_motivo TEXT DEFAULT NULL
)
RETURNS public.leads LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
DECLARE v_lead public.leads%ROWTYPE; v_anterior TEXT;
BEGIN
  IF NOT public.is_berkahn_admin() THEN RAISE EXCEPTION 'Não autorizado'; END IF;
  IF NULLIF(btrim(COALESCE(p_nota, '')), '') IS NULL OR length(p_nota) > 10000 THEN
    RAISE EXCEPTION 'Descreva o atendimento em até 10000 caracteres';
  END IF;
  SELECT * INTO v_lead FROM public.leads WHERE id = p_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Lead não encontrado'; END IF;
  IF v_lead.anonimizado_em IS NOT NULL THEN RAISE EXCEPTION 'Lead anonimizado não pode receber atendimento'; END IF;
  v_anterior := v_lead.status;
  IF p_status IS NOT NULL AND p_status IS DISTINCT FROM v_lead.status THEN
    SELECT * INTO v_lead FROM public.update_lead_status(p_id, p_status, p_motivo);
  END IF;
  UPDATE public.leads SET ultimo_contato_em = NOW(), visualizado_em = COALESCE(visualizado_em, NOW()),
    proxima_acao_em = CASE WHEN status IN ('convertido', 'desqualificado') THEN NULL ELSE p_proxima_acao_em END
  WHERE id = p_id RETURNING * INTO v_lead;
  INSERT INTO public.activity_logs(user_id, user_name, action, entity_type, entity_id, entity_name, details)
  VALUES (auth.uid(), COALESCE(auth.jwt()->>'email', 'Admin'), 'Atendimento do lead registrado', 'lead', p_id,
    'Lead ' || left(p_id::TEXT, 8), jsonb_build_object('tipo', 'atendimento', 'nota', btrim(p_nota),
      'status_anterior', v_anterior, 'status_novo', v_lead.status, 'proxima_acao_em', v_lead.proxima_acao_em));
  RETURN v_lead;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_lead_contact(
  p_id UUID, p_nome TEXT, p_email TEXT, p_telefone TEXT, p_segmento TEXT,
  p_tipo_projeto TEXT, p_empresa TEXT, p_cargo TEXT
)
RETURNS public.leads LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
DECLARE v_lead public.leads%ROWTYPE; v_before public.leads%ROWTYPE; v_fields TEXT[];
BEGIN
  IF NOT public.is_berkahn_admin() THEN RAISE EXCEPTION 'Não autorizado'; END IF;
  IF NULLIF(btrim(p_nome), '') IS NULL OR length(p_nome) > 200 THEN RAISE EXCEPTION 'Nome inválido'; END IF;
  IF NULLIF(btrim(COALESCE(p_email, '')), '') IS NULL
    AND NULLIF(regexp_replace(COALESCE(p_telefone, ''), '\D', '', 'g'), '') IS NULL THEN
    RAISE EXCEPTION 'Informe telefone ou email';
  END IF;
  IF length(COALESCE(p_email, '')) > 254 OR length(COALESCE(p_telefone, '')) > 40
    OR length(COALESCE(p_empresa, '')) > 200 OR length(COALESCE(p_cargo, '')) > 200
    OR length(COALESCE(p_tipo_projeto, '')) > 200 THEN RAISE EXCEPTION 'Dados de contato muito longos'; END IF;
  IF NULLIF(btrim(COALESCE(p_email, '')), '') IS NOT NULL AND p_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' THEN
    RAISE EXCEPTION 'Email inválido';
  END IF;
  IF p_segmento IS NULL OR p_segmento NOT IN ('residencial', 'comercial', 'nao_definido') THEN RAISE EXCEPTION 'Segmento inválido'; END IF;
  SELECT * INTO v_before FROM public.leads WHERE id = p_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Lead não encontrado'; END IF;
  IF v_before.anonimizado_em IS NOT NULL THEN RAISE EXCEPTION 'Lead anonimizado não pode ser editado'; END IF;
  UPDATE public.leads SET nome = btrim(p_nome), email = NULLIF(lower(btrim(p_email)), ''),
    telefone = NULLIF(btrim(p_telefone), ''), segmento = p_segmento,
    tipo_projeto = NULLIF(btrim(p_tipo_projeto), ''), empresa = NULLIF(btrim(p_empresa), ''), cargo = NULLIF(btrim(p_cargo), '')
  WHERE id = p_id RETURNING * INTO v_lead;
  SELECT COALESCE(array_agg(key), '{}') INTO v_fields FROM jsonb_each(to_jsonb(v_lead))
  WHERE key IN ('nome','email','telefone','segmento','tipo_projeto','empresa','cargo')
    AND value IS DISTINCT FROM to_jsonb(v_before)->key;
  INSERT INTO public.activity_logs(user_id, user_name, action, entity_type, entity_id, entity_name, details)
  VALUES (auth.uid(), COALESCE(auth.jwt()->>'email', 'Admin'), 'Dados do lead atualizados', 'lead', p_id,
    'Lead ' || left(p_id::TEXT, 8), jsonb_build_object('tipo', 'contato_editado', 'campos', v_fields));
  RETURN v_lead;
END;
$$;

-- A mesma pauta é bloqueada antes do post, como no fluxo de publicação existente.
-- O advisory lock serializa também a criação da primeira pauta de revisão.
CREATE OR REPLACE FUNCTION public.salvar_revisao_post_admin(
  p_post_id UUID, p_payload JSONB, p_post_updated_at TIMESTAMPTZ,
  p_pauta_updated_at TIMESTAMPTZ DEFAULT NULL
)
RETURNS JSONB LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
DECLARE v_post public.posts%ROWTYPE; v_pauta public.conteudo_pautas%ROWTYPE; v_count INTEGER;
BEGIN
  IF NOT public.has_admin_role(ARRAY['owner', 'conteudo']) THEN RAISE EXCEPTION 'Não autorizado'; END IF;
  IF p_payload IS NULL OR jsonb_typeof(p_payload) <> 'object' THEN RAISE EXCEPTION 'Revisão inválida'; END IF;
  IF EXISTS (SELECT 1 FROM jsonb_object_keys(p_payload) key WHERE key NOT IN
    ('title','slug','excerpt','content','cover_image','category','tags','author','read_time','featured','meta_title','meta_description','answer_summary','components')) THEN
    RAISE EXCEPTION 'Campo não permitido na revisão';
  END IF;
  IF NULLIF(btrim(p_payload->>'title'), '') IS NULL OR length(p_payload->>'title') > 300
    OR NULLIF(btrim(p_payload->>'slug'), '') IS NULL THEN RAISE EXCEPTION 'Título e slug são obrigatórios'; END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended('admin-post-revision:' || p_post_id::TEXT, 0));
  SELECT count(*) INTO v_count FROM public.conteudo_pautas WHERE post_id = p_post_id;
  IF v_count > 1 THEN RAISE EXCEPTION 'Há mais de uma pauta vinculada. Abra a revisão pelo quadro editorial'; END IF;
  SELECT * INTO v_pauta FROM public.conteudo_pautas WHERE post_id = p_post_id FOR UPDATE;
  IF (v_pauta.id IS NULL AND p_pauta_updated_at IS NOT NULL)
    OR (v_pauta.id IS NOT NULL AND v_pauta.atualizado_em IS DISTINCT FROM p_pauta_updated_at) THEN
    RAISE EXCEPTION 'A pauta foi alterada por outra sessão. Recarregue antes de salvar';
  END IF;
  SELECT * INTO v_post FROM public.posts WHERE id = p_post_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Artigo não encontrado'; END IF;
  IF v_post.status <> 'published' OR v_post.updated_at IS DISTINCT FROM p_post_updated_at THEN
    RAISE EXCEPTION 'O artigo foi alterado por outra sessão. Recarregue antes de salvar';
  END IF;
  IF v_pauta.id IS NULL THEN
    INSERT INTO public.conteudo_pautas(titulo, tipo, plataformas, post_id, status_blog, post_draft_payload, capa_blog_url, criado_por)
    VALUES (p_payload->>'title', 'pauta', ARRAY['blog'], p_post_id, 'produzido', p_payload, v_post.cover_image, auth.jwt()->>'email')
    RETURNING * INTO v_pauta;
  ELSE
    UPDATE public.conteudo_pautas SET titulo = p_payload->>'title', post_draft_payload = p_payload,
      status_blog = 'produzido', ordem_blog = CASE WHEN status_blog = 'produzido' THEN ordem_blog ELSE NULL END,
      plataformas = CASE WHEN 'blog' = ANY(plataformas) THEN plataformas ELSE array_append(plataformas, 'blog') END
    WHERE id = v_pauta.id RETURNING * INTO v_pauta;
  END IF;
  INSERT INTO public.activity_logs(user_id, user_name, action, entity_type, entity_id, entity_name, details)
  VALUES (auth.uid(), COALESCE(auth.jwt()->>'email', 'Admin'), 'Revisão de artigo salva', 'pauta', v_pauta.id,
    v_pauta.titulo, jsonb_build_object('tipo', 'revisao_post', 'post_id', p_post_id, 'status_blog', 'produzido'));
  RETURN jsonb_build_object('pauta_id', v_pauta.id, 'atualizado_em', v_pauta.atualizado_em);
END;
$$;

CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS JSON LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
BEGIN
  IF NOT public.has_admin_role(ARRAY['owner','comercial','conteudo','viewer']) THEN RAISE EXCEPTION 'Não autorizado'; END IF;
  RETURN json_build_object(
    'posts', (SELECT json_build_object('total',count(*),'published',count(*) FILTER (WHERE status='published'),
      'drafts',count(*) FILTER (WHERE status='draft'),'scheduled',count(*) FILTER (WHERE status='scheduled')) FROM public.posts),
    'proposals', (SELECT json_build_object('total',count(*),'pending',count(*) FILTER (WHERE status IN ('draft','sent','viewed')),
      'approved',count(*) FILTER (WHERE status='approved'),'rejected',count(*) FILTER (WHERE status='rejected'),
      'total_value',COALESCE(sum(total) FILTER (WHERE status='approved'),0)) FROM public.proposals),
    'presentations', (SELECT json_build_object('total',count(*),'sent',count(*) FILTER (WHERE status='sent'),
      'viewed',count(*) FILTER (WHERE status='viewed')) FROM public.presentations),
    'budgets', (SELECT json_build_object('total',count(*),'drafts',count(*) FILTER (WHERE status='rascunho'),
      'finalized',count(*) FILTER (WHERE status='finalizado')) FROM public.orcamentos WHERE status <> 'arquivado'),
    'documents', (SELECT count(*) FROM public.documentos)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.get_dashboard_stats() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.salvar_revisao_post_admin(UUID,JSONB,TIMESTAMPTZ,TIMESTAMPTZ) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.register_lead_attendance(UUID,TEXT,TEXT,TIMESTAMPTZ,TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.update_lead_contact(UUID,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.update_lead_status(UUID,TEXT,TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.set_lead_next_action(UUID,TIMESTAMPTZ) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_dashboard_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.salvar_revisao_post_admin(UUID,JSONB,TIMESTAMPTZ,TIMESTAMPTZ) TO authenticated;
GRANT EXECUTE ON FUNCTION public.register_lead_attendance(UUID,TEXT,TEXT,TIMESTAMPTZ,TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_lead_contact(UUID,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_lead_status(UUID,TEXT,TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_lead_next_action(UUID,TIMESTAMPTZ) TO authenticated;

-- Permite remover explicitamente a capa na revisão, mantendo as demais regras.
CREATE OR REPLACE FUNCTION publicar_artigo_pauta(
  p_pauta_id UUID,
  p_publicado_path TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  pauta_atual conteudo_pautas%ROWTYPE;
  payload JSONB;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtextextended('admin-post-publishing', 0));
  SELECT * INTO pauta_atual FROM conteudo_pautas WHERE id = p_pauta_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Pauta não encontrada'; END IF;
  IF pauta_atual.post_id IS NULL THEN RAISE EXCEPTION 'Pauta sem artigo vinculado'; END IF;
  IF pauta_atual.status_blog NOT IN ('aprovado', 'publicado') THEN
    RAISE EXCEPTION 'Blog precisa estar aprovado antes de publicar';
  END IF;

  payload := pauta_atual.post_draft_payload;
  IF payload IS NOT NULL THEN
    IF payload->>'featured' = 'true' THEN
      UPDATE posts SET featured = false WHERE featured = true AND id <> pauta_atual.post_id;
    END IF;
    UPDATE posts
    SET title = COALESCE(payload->>'title', title),
        slug = COALESCE(payload->>'slug', slug),
        excerpt = COALESCE(payload->>'excerpt', excerpt),
        content = COALESCE(payload->>'content', content),
        cover_image = CASE WHEN payload ? 'cover_image' THEN payload->>'cover_image' ELSE cover_image END,
        category = COALESCE(payload->>'category', category),
        tags = CASE WHEN payload ? 'tags'
          THEN ARRAY(SELECT jsonb_array_elements_text(payload->'tags')) ELSE tags END,
        author = COALESCE(payload->>'author', author),
        read_time = CASE WHEN payload ? 'read_time'
          THEN (payload->>'read_time')::INTEGER ELSE read_time END,
        featured = CASE WHEN payload ? 'featured'
          THEN (payload->>'featured')::BOOLEAN ELSE featured END,
        meta_title = CASE WHEN payload ? 'meta_title' THEN payload->>'meta_title' ELSE meta_title END,
        meta_description = CASE WHEN payload ? 'meta_description'
          THEN payload->>'meta_description' ELSE meta_description END,
        answer_summary = CASE WHEN payload ? 'answer_summary'
          THEN payload->>'answer_summary' ELSE answer_summary END,
        components = CASE WHEN payload ? 'components' THEN payload->'components' ELSE components END,
        status = 'published',
        published_at = COALESCE(published_at, NOW())
    WHERE id = pauta_atual.post_id;
  ELSE
    UPDATE posts
    SET status = 'published', published_at = COALESCE(published_at, NOW())
    WHERE id = pauta_atual.post_id;
  END IF;
  IF NOT FOUND THEN RAISE EXCEPTION 'Artigo vinculado não encontrado'; END IF;

  UPDATE conteudo_pautas
  SET status_blog = 'publicado',
      draft_path = p_publicado_path,
      post_draft_payload = NULL
  WHERE id = p_pauta_id;

  INSERT INTO activity_logs
    (user_id, user_name, action, entity_type, entity_id, entity_name, details)
  VALUES
    (NULL, 'Automação de conteúdo', 'Artigo publicado pela pauta', 'pauta',
     pauta_atual.id, pauta_atual.titulo,
     jsonb_build_object(
       'canal', 'blog', 'origem', 'cli',
       'anterior', pauta_atual.status_blog, 'novo', 'publicado',
       'post_id', pauta_atual.post_id,
       'revisao_aplicada', payload IS NOT NULL
     ));
END;
$$;


-- Publicação humana da revisão que o usuário acabou de conferir no ADMIN.
-- Definer é necessário para chamar o publicador privado; guard e versões são obrigatórios.
CREATE OR REPLACE FUNCTION public.publicar_revisao_post_admin(
  p_post_id UUID, p_post_updated_at TIMESTAMPTZ, p_pauta_updated_at TIMESTAMPTZ
)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_post public.posts%ROWTYPE; v_pauta public.conteudo_pautas%ROWTYPE; v_count INTEGER;
BEGIN
  IF NOT public.has_admin_role(ARRAY['owner', 'conteudo']) THEN RAISE EXCEPTION 'Não autorizado'; END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended('admin-post-publishing', 0));
  PERFORM pg_advisory_xact_lock(hashtextextended('admin-post-revision:' || p_post_id::TEXT, 0));
  SELECT count(*) INTO v_count FROM public.conteudo_pautas WHERE post_id = p_post_id;
  IF v_count <> 1 THEN RAISE EXCEPTION 'Não foi possível identificar uma única revisão'; END IF;
  SELECT * INTO v_pauta FROM public.conteudo_pautas WHERE post_id = p_post_id FOR UPDATE;
  SELECT * INTO v_post FROM public.posts WHERE id = p_post_id FOR UPDATE;
  IF NOT FOUND OR v_post.status <> 'published' THEN RAISE EXCEPTION 'Artigo publicado não encontrado'; END IF;
  IF v_post.updated_at IS DISTINCT FROM p_post_updated_at
    OR v_pauta.atualizado_em IS DISTINCT FROM p_pauta_updated_at THEN
    RAISE EXCEPTION 'A revisão foi alterada por outra sessão. Recarregue antes de publicar';
  END IF;
  IF v_pauta.post_draft_payload IS NULL THEN RAISE EXCEPTION 'Não há revisão salva para publicar'; END IF;
  INSERT INTO public.activity_logs(user_id, user_name, action, entity_type, entity_id, entity_name, details)
  VALUES (auth.uid(), COALESCE(auth.jwt()->>'email', 'Admin'), 'Revisão aprovada para publicação no ADMIN',
    'pauta', v_pauta.id, v_pauta.titulo,
    jsonb_build_object('tipo','aprovacao_revisao','post_id',p_post_id,'revisao_em',v_pauta.atualizado_em,
      'origem','admin','sync_vault_pendente',true));
  UPDATE public.conteudo_pautas SET status_blog = 'aprovado' WHERE id = v_pauta.id;
  PERFORM public.publicar_artigo_pauta(v_pauta.id, v_pauta.draft_path);
  SELECT * INTO v_post FROM public.posts WHERE id = p_post_id;
  SELECT * INTO v_pauta FROM public.conteudo_pautas WHERE id = v_pauta.id;
  RETURN jsonb_build_object('pauta_id',v_pauta.id,'post_updated_at',v_post.updated_at,'atualizado_em',v_pauta.atualizado_em);
END;
$$;
REVOKE ALL ON FUNCTION public.publicar_revisao_post_admin(UUID,TIMESTAMPTZ,TIMESTAMPTZ) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.publicar_revisao_post_admin(UUID,TIMESTAMPTZ,TIMESTAMPTZ) TO authenticated;

-- Estende o núcleo da 032: preserva pedido do titular, anexos e relógio de retenção.
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
    pdf_url = NULL, pdf_storage_path = NULL, pdf_generated_at = NULL, pdf_revision_hash = NULL
  WHERE lead_id = p_id;

  UPDATE proposals SET
    client_name = 'Cliente anonimizado', client_email = NULL, client_phone = NULL,
    client_address = NULL, project_description = NULL, notes = NULL, internal_notes = NULL
  WHERE lead_id = p_id;

  UPDATE leads SET
    nome = 'Lead anonimizado', email = NULL, telefone = NULL, mensagem = NULL,
    tipo_projeto = NULL, empresa = NULL, cargo = NULL, referrer = NULL,
    request_fingerprint = NULL, submission_id = NULL, submission_payload_hash = NULL, motivo_desqualificacao = NULL,
    retencao_excecao_motivo = NULL, resumo_status = NULL,
    utm = '{}'::JSONB, landing_page = NULL, sheet_sync_error = NULL,
    responsavel_id = NULL, anonimizado_em = NOW(),
    retencao_storage_pendente = v_pdf_paths
  WHERE id = p_id;

  RETURN v_pdf_paths;
END;
$$;

REVOKE ALL ON FUNCTION public.anonymize_lead_core(UUID, TEXT) FROM PUBLIC, anon, authenticated;

COMMIT;
