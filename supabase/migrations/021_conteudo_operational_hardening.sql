-- Quadro leve, atualizacao atomica de metadados/tags e reorder transacional.

CREATE OR REPLACE VIEW conteudo_pautas_quadro
WITH (security_invoker = true)
AS
SELECT
  p.id, p.titulo, p.tipo,
  p.status_blog, p.status_linkedin, p.ordem_blog, p.ordem_linkedin,
  p.draft_path, p.linkedin_url, p.linkedin_publicado_em,
  p.keyword, p.intencao, p.funil, p.prioridade, p.trilha, p.semana, p.data_alvo,
  p.post_id, p.capa_blog_url, p.capa_linkedin_url, p.plataformas,
  p.criado_por, p.criado_em, p.atualizado_em,
  (NULLIF(trim(p.insights), '') IS NOT NULL) AS tem_insights,
  (NULLIF(trim(p.pesquisa_conteudo), '') IS NOT NULL) AS tem_pesquisa,
  (NULLIF(trim(p.linkedin_texto), '') IS NOT NULL) AS tem_linkedin_texto,
  (NULLIF(trim(p.linkedin_briefing), '') IS NOT NULL) AS tem_linkedin_briefing,
  (NULLIF(trim(p.linkedin_imagem_prompt), '') IS NOT NULL) AS tem_linkedin_imagem_prompt,
  (NULLIF(trim(p.linkedin_imagem_briefing), '') IS NOT NULL) AS tem_linkedin_imagem_briefing,
  post.slug AS post_slug,
  post.title AS post_title,
  post.status AS post_status,
  post.published_at AS post_published_at
FROM conteudo_pautas p
LEFT JOIN posts post ON post.id = p.post_id;

REVOKE ALL ON conteudo_pautas_quadro FROM PUBLIC, anon;
GRANT SELECT ON conteudo_pautas_quadro TO authenticated, service_role;

CREATE OR REPLACE VIEW conteudo_automation_jobs_latest
WITH (security_invoker = true)
AS
SELECT DISTINCT ON (pauta_id)
  id, pauta_id, acao, status, tentativas, erro, criado_em, atualizado_em
FROM conteudo_automation_jobs
ORDER BY pauta_id, criado_em DESC, id DESC;

REVOKE ALL ON conteudo_automation_jobs_latest FROM PUBLIC, anon;
GRANT SELECT ON conteudo_automation_jobs_latest TO authenticated, service_role;

CREATE OR REPLACE FUNCTION atualizar_pauta_metadados(
  p_pauta_id UUID,
  p_patch JSONB DEFAULT '{}'::JSONB,
  p_tags TEXT[] DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  chaves_invalidas TEXT[];
  tags_invalidas TEXT[];
  plataformas_novas TEXT[];
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Sessao expirada';
  END IF;

  SELECT array_agg(chave)
  INTO chaves_invalidas
  FROM jsonb_object_keys(COALESCE(p_patch, '{}'::JSONB)) AS chave
  WHERE chave NOT IN (
    'titulo', 'keyword', 'intencao', 'funil', 'prioridade',
    'trilha', 'semana', 'data_alvo', 'plataformas'
  );
  IF chaves_invalidas IS NOT NULL THEN
    RAISE EXCEPTION 'Campos invalidos: %', array_to_string(chaves_invalidas, ', ');
  END IF;

  IF p_patch ? 'plataformas' THEN
    SELECT array_agg(value)
    INTO plataformas_novas
    FROM jsonb_array_elements_text(p_patch->'plataformas') AS value;
    IF plataformas_novas IS NULL
       OR cardinality(plataformas_novas) = 0
       OR EXISTS (
         SELECT 1 FROM unnest(plataformas_novas) AS plataforma
         WHERE plataforma NOT IN ('blog', 'linkedin')
       ) THEN
      RAISE EXCEPTION 'Plataformas invalidas';
    END IF;
  END IF;

  UPDATE conteudo_pautas
  SET
    titulo = CASE WHEN p_patch ? 'titulo' THEN p_patch->>'titulo' ELSE titulo END,
    keyword = CASE WHEN p_patch ? 'keyword' THEN NULLIF(p_patch->>'keyword', '') ELSE keyword END,
    intencao = CASE WHEN p_patch ? 'intencao' THEN NULLIF(p_patch->>'intencao', '') ELSE intencao END,
    funil = CASE WHEN p_patch ? 'funil' THEN NULLIF(p_patch->>'funil', '') ELSE funil END,
    prioridade = CASE
      WHEN p_patch ? 'prioridade' AND jsonb_typeof(p_patch->'prioridade') = 'null' THEN NULL
      WHEN p_patch ? 'prioridade' THEN (p_patch->>'prioridade')::INTEGER
      ELSE prioridade
    END,
    trilha = CASE WHEN p_patch ? 'trilha' THEN NULLIF(p_patch->>'trilha', '') ELSE trilha END,
    semana = CASE
      WHEN p_patch ? 'semana' AND jsonb_typeof(p_patch->'semana') = 'null' THEN NULL
      WHEN p_patch ? 'semana' THEN (p_patch->>'semana')::INTEGER
      ELSE semana
    END,
    data_alvo = CASE
      WHEN p_patch ? 'data_alvo' AND jsonb_typeof(p_patch->'data_alvo') = 'null' THEN NULL
      WHEN p_patch ? 'data_alvo' THEN (p_patch->>'data_alvo')::DATE
      ELSE data_alvo
    END,
    plataformas = CASE WHEN p_patch ? 'plataformas' THEN plataformas_novas ELSE plataformas END
  WHERE id = p_pauta_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Pauta nao encontrada';
  END IF;

  IF p_tags IS NOT NULL THEN
    SELECT array_agg(tag)
    INTO tags_invalidas
    FROM unnest(p_tags) AS tag
    LEFT JOIN conteudo_tags catalogo ON catalogo.slug = tag AND catalogo.ativo
    WHERE catalogo.slug IS NULL;
    IF tags_invalidas IS NOT NULL THEN
      RAISE EXCEPTION 'Tags invalidas ou inativas: %', array_to_string(tags_invalidas, ', ');
    END IF;

    DELETE FROM conteudo_pauta_tags WHERE pauta_id = p_pauta_id;
    INSERT INTO conteudo_pauta_tags (pauta_id, tag_slug)
    SELECT p_pauta_id, tag FROM unnest(p_tags) AS tag
    ON CONFLICT DO NOTHING;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION atualizar_pauta_metadados(UUID, JSONB, TEXT[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION atualizar_pauta_metadados(UUID, JSONB, TEXT[]) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION reordenar_analytics_tasks(p_updates JSONB)
RETURNS VOID
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  esperado INTEGER;
  alterado INTEGER;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Sessao expirada';
  END IF;
  IF jsonb_typeof(p_updates) <> 'array' THEN
    RAISE EXCEPTION 'Updates devem ser um array';
  END IF;

  SELECT count(*) INTO esperado FROM jsonb_array_elements(p_updates);
  IF EXISTS (
    SELECT 1
    FROM jsonb_to_recordset(p_updates) AS item(id UUID, sort_order INTEGER, priority TEXT)
    WHERE item.sort_order < 0 OR item.priority NOT IN ('p0', 'p1', 'p2')
  ) THEN
    RAISE EXCEPTION 'Update de tarefa invalido';
  END IF;

  UPDATE analytics_tasks tarefa
  SET sort_order = item.sort_order, priority = item.priority
  FROM jsonb_to_recordset(p_updates) AS item(id UUID, sort_order INTEGER, priority TEXT)
  WHERE tarefa.id = item.id;
  GET DIAGNOSTICS alterado = ROW_COUNT;

  IF alterado <> esperado THEN
    RAISE EXCEPTION 'Uma ou mais tarefas nao existem ou nao podem ser atualizadas';
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION reordenar_analytics_tasks(JSONB) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION reordenar_analytics_tasks(JSONB) TO authenticated, service_role;

CREATE UNIQUE INDEX IF NOT EXISTS idx_analytics_tasks_system_signal_open
  ON analytics_tasks(origin_signal)
  WHERE source = 'system' AND status = 'open' AND origin_signal IS NOT NULL;
