-- Stage editorial revisions without taking the currently published post offline.

ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS answer_summary TEXT;

ALTER TABLE conteudo_pautas
  ADD COLUMN IF NOT EXISTS post_draft_payload JSONB;

ALTER TABLE conteudo_pautas
  DROP CONSTRAINT IF EXISTS conteudo_pautas_post_draft_payload_check;
ALTER TABLE conteudo_pautas
  ADD CONSTRAINT conteudo_pautas_post_draft_payload_check
  CHECK (post_draft_payload IS NULL OR jsonb_typeof(post_draft_payload) = 'object');

COMMENT ON COLUMN conteudo_pautas.post_draft_payload IS
  'Revisão estruturada de um post já publicado. Só é aplicada por publicar_artigo_pauta após aprovação humana.';

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
  SELECT * INTO pauta_atual FROM conteudo_pautas WHERE id = p_pauta_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Pauta não encontrada'; END IF;
  IF pauta_atual.post_id IS NULL THEN RAISE EXCEPTION 'Pauta sem artigo vinculado'; END IF;
  IF pauta_atual.status_blog NOT IN ('aprovado', 'publicado') THEN
    RAISE EXCEPTION 'Blog precisa estar aprovado antes de publicar';
  END IF;

  payload := pauta_atual.post_draft_payload;
  IF payload IS NOT NULL THEN
    UPDATE posts
    SET title = COALESCE(payload->>'title', title),
        slug = COALESCE(payload->>'slug', slug),
        excerpt = COALESCE(payload->>'excerpt', excerpt),
        content = COALESCE(payload->>'content', content),
        cover_image = COALESCE(payload->>'cover_image', cover_image),
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

REVOKE ALL ON FUNCTION publicar_artigo_pauta(UUID, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION publicar_artigo_pauta(UUID, TEXT) TO service_role;
