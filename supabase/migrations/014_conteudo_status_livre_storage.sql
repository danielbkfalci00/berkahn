-- BERKAHN - STATUS DECLARATIVO E CAPAS DO QUADRO
-- O status do quadro nunca executa uma publica??o. Gaps s?o observ?veis, n?o bloqueios.

ALTER TABLE conteudo_pautas
  DROP CONSTRAINT IF EXISTS conteudo_pautas_linkedin_publicacao_check;

CREATE OR REPLACE FUNCTION mover_pautas_conteudo(
  p_canal TEXT,
  p_updates JSONB,
  p_origem TEXT DEFAULT 'admin'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  item JSONB;
  pauta_atual conteudo_pautas%ROWTYPE;
  novo_status TEXT;
  nova_ordem INTEGER;
  gaps TEXT[];
BEGIN
  IF p_canal NOT IN ('blog', 'linkedin') THEN
    RAISE EXCEPTION 'Canal inv?lido: %', p_canal;
  END IF;
  IF jsonb_typeof(p_updates) <> 'array' THEN
    RAISE EXCEPTION 'Updates devem ser um array JSON';
  END IF;

  FOR item IN SELECT value FROM jsonb_array_elements(p_updates)
  LOOP
    novo_status := item->>'status';
    nova_ordem := (item->>'ordem')::INTEGER;
    IF nova_ordem < 1 THEN RAISE EXCEPTION 'Ordem inv?lida'; END IF;
    IF p_canal = 'blog' AND novo_status NOT IN
      ('planejada', 'pesquisa', 'draft', 'produzido', 'aprovado', 'publicado') THEN
      RAISE EXCEPTION 'Status de Blog inv?lido: %', novo_status;
    END IF;
    IF p_canal = 'linkedin' AND novo_status NOT IN
      ('planejada', 'producao', 'produzido', 'aprovado', 'publicado') THEN
      RAISE EXCEPTION 'Status de LinkedIn inv?lido: %', novo_status;
    END IF;

    SELECT * INTO pauta_atual
    FROM conteudo_pautas
    WHERE id = (item->>'id')::UUID
    FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'Pauta n?o encontrada: %', item->>'id'; END IF;

    IF p_canal = 'blog' THEN
      IF pauta_atual.status_blog IS NULL THEN RAISE EXCEPTION 'Blog n?o se aplica ? pauta'; END IF;
      gaps := ARRAY[]::TEXT[];
      IF pauta_atual.pesquisa_conteudo IS NULL THEN gaps := array_append(gaps, 'pesquisa'); END IF;
      IF pauta_atual.draft_path IS NULL THEN gaps := array_append(gaps, 'draft'); END IF;
      IF pauta_atual.post_id IS NULL THEN gaps := array_append(gaps, 'artigo'); END IF;
      IF pauta_atual.capa_blog_url IS NULL THEN gaps := array_append(gaps, 'capa'); END IF;

      UPDATE conteudo_pautas
      SET status_blog = novo_status, ordem_blog = nova_ordem
      WHERE id = pauta_atual.id;

      IF pauta_atual.status_blog IS DISTINCT FROM novo_status THEN
        INSERT INTO activity_logs
          (user_id, user_name, action, entity_type, entity_id, entity_name, details)
        VALUES
          (auth.uid(), COALESCE(auth.jwt()->>'email', 'Automa??o'), 'Status da pauta alterado',
           'pauta', pauta_atual.id, pauta_atual.titulo,
           jsonb_build_object('canal', p_canal, 'origem', p_origem,
             'anterior', pauta_atual.status_blog, 'novo', novo_status, 'gaps', gaps));
      END IF;
    ELSE
      IF pauta_atual.status_linkedin IS NULL THEN RAISE EXCEPTION 'LinkedIn n?o se aplica ? pauta'; END IF;
      gaps := ARRAY[]::TEXT[];
      IF pauta_atual.linkedin_texto IS NULL THEN gaps := array_append(gaps, 'texto'); END IF;
      IF pauta_atual.capa_linkedin_url IS NULL THEN gaps := array_append(gaps, 'capa'); END IF;
      IF pauta_atual.linkedin_url IS NULL THEN gaps := array_append(gaps, 'url_publicacao'); END IF;
      IF pauta_atual.linkedin_publicado_em IS NULL THEN gaps := array_append(gaps, 'data_publicacao'); END IF;

      UPDATE conteudo_pautas
      SET status_linkedin = novo_status, ordem_linkedin = nova_ordem
      WHERE id = pauta_atual.id;

      IF pauta_atual.status_linkedin IS DISTINCT FROM novo_status THEN
        INSERT INTO activity_logs
          (user_id, user_name, action, entity_type, entity_id, entity_name, details)
        VALUES
          (auth.uid(), COALESCE(auth.jwt()->>'email', 'Automa??o'), 'Status da pauta alterado',
           'pauta', pauta_atual.id, pauta_atual.titulo,
           jsonb_build_object('canal', p_canal, 'origem', p_origem,
             'anterior', pauta_atual.status_linkedin, 'novo', novo_status, 'gaps', gaps));
      END IF;
    END IF;
  END LOOP;
END;
$$;

REVOKE ALL ON FUNCTION mover_pautas_conteudo(TEXT, JSONB, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION mover_pautas_conteudo(TEXT, JSONB, TEXT) TO authenticated, service_role;

-- Storage: paths conhecidos do card e do editor de posts. As policies s?o
-- separadas porque upsert exige SELECT + INSERT + UPDATE e remo??o exige DELETE.
DROP POLICY IF EXISTS "Authenticated read content covers" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated insert content covers" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update content covers" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete content covers" ON storage.objects;

CREATE POLICY "Authenticated read content covers" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'post-images' AND (
      name ~ '^conteudo/[0-9a-fA-F-]{36}/(blog|linkedin)(/[0-9a-f]{64}\.jpg|\.jpg)$'
      OR name ~ '^covers/[a-z0-9][a-z0-9-]*\.(png|jpe?g|webp)$'
    )
  );

CREATE POLICY "Authenticated insert content covers" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'post-images' AND (
      name ~ '^conteudo/[0-9a-fA-F-]{36}/(blog|linkedin)(/[0-9a-f]{64}\.jpg|\.jpg)$'
      OR name ~ '^covers/[a-z0-9][a-z0-9-]*\.(png|jpe?g|webp)$'
    )
  );

CREATE POLICY "Authenticated update content covers" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'post-images' AND (
      name ~ '^conteudo/[0-9a-fA-F-]{36}/(blog|linkedin)(/[0-9a-f]{64}\.jpg|\.jpg)$'
      OR name ~ '^covers/[a-z0-9][a-z0-9-]*\.(png|jpe?g|webp)$'
    )
  )
  WITH CHECK (
    bucket_id = 'post-images' AND (
      name ~ '^conteudo/[0-9a-fA-F-]{36}/(blog|linkedin)(/[0-9a-f]{64}\.jpg|\.jpg)$'
      OR name ~ '^covers/[a-z0-9][a-z0-9-]*\.(png|jpe?g|webp)$'
    )
  );

CREATE POLICY "Authenticated delete content covers" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'post-images' AND (
      name ~ '^conteudo/[0-9a-fA-F-]{36}/(blog|linkedin)(/[0-9a-f]{64}\.jpg|\.jpg)$'
      OR name ~ '^covers/[a-z0-9][a-z0-9-]*\.(png|jpe?g|webp)$'
    )
  );

COMMENT ON COLUMN conteudo_pautas.status_blog IS
  'Posi??o declarativa no quadro. N?o publica nem comprova prontid?o.';
COMMENT ON COLUMN conteudo_pautas.status_linkedin IS
  'Posi??o declarativa no quadro. URL/data representam a publica??o real.';
