-- ============================================
-- BERKAHN - TRILHAS INDEPENDENTES DE CONTEÚDO
-- ============================================
-- Migration aditiva e compatível com a 010/011. `coluna` e `ordem` ficam
-- temporariamente no schema para permitir deploy sem janela de indisponibilidade;
-- a remoção pertence à migration 013, somente depois do deploy compatível.

ALTER TABLE conteudo_pautas
  ADD COLUMN IF NOT EXISTS status_blog TEXT,
  ADD COLUMN IF NOT EXISTS status_linkedin TEXT,
  ADD COLUMN IF NOT EXISTS ordem_blog INTEGER,
  ADD COLUMN IF NOT EXISTS ordem_linkedin INTEGER,
  ADD COLUMN IF NOT EXISTS draft_path TEXT,
  ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
  ADD COLUMN IF NOT EXISTS linkedin_publicado_em TIMESTAMPTZ;

ALTER TABLE conteudo_pautas DROP CONSTRAINT IF EXISTS conteudo_pautas_status_blog_check;
ALTER TABLE conteudo_pautas ADD CONSTRAINT conteudo_pautas_status_blog_check
  CHECK (status_blog IS NULL OR status_blog IN
    ('planejada', 'pesquisa', 'draft', 'produzido', 'aprovado', 'publicado'));

ALTER TABLE conteudo_pautas DROP CONSTRAINT IF EXISTS conteudo_pautas_status_linkedin_check;
ALTER TABLE conteudo_pautas ADD CONSTRAINT conteudo_pautas_status_linkedin_check
  CHECK (status_linkedin IS NULL OR status_linkedin IN
    ('planejada', 'producao', 'produzido', 'aprovado', 'publicado'));

ALTER TABLE conteudo_pautas DROP CONSTRAINT IF EXISTS conteudo_pautas_ordem_blog_check;
ALTER TABLE conteudo_pautas ADD CONSTRAINT conteudo_pautas_ordem_blog_check
  CHECK (ordem_blog IS NULL OR ordem_blog > 0);

ALTER TABLE conteudo_pautas DROP CONSTRAINT IF EXISTS conteudo_pautas_ordem_linkedin_check;
ALTER TABLE conteudo_pautas ADD CONSTRAINT conteudo_pautas_ordem_linkedin_check
  CHECK (ordem_linkedin IS NULL OR ordem_linkedin > 0);

-- Backfill determinístico: preserva as 66 pautas e a ordem editorial atual.
WITH blog AS (
  SELECT id, row_number() OVER (ORDER BY data_alvo NULLS LAST, semana NULLS LAST, ordem, id)::INTEGER AS nova_ordem
  FROM conteudo_pautas
  WHERE 'blog' = ANY(plataformas)
)
UPDATE conteudo_pautas p
SET status_blog = 'planejada', ordem_blog = blog.nova_ordem
FROM blog
WHERE p.id = blog.id;

WITH linkedin AS (
  SELECT id, row_number() OVER (ORDER BY data_alvo NULLS LAST, semana NULLS LAST, ordem, id)::INTEGER AS nova_ordem
  FROM conteudo_pautas
  WHERE 'linkedin' = ANY(plataformas)
)
UPDATE conteudo_pautas p
SET status_linkedin = 'planejada', ordem_linkedin = linkedin.nova_ordem
FROM linkedin
WHERE p.id = linkedin.id;

-- Reconciliação explícita do único legado aprovado para migração. Os demais
-- diretórios antigos do LinkedIn permanecem imutáveis no vault.
UPDATE conteudo_pautas
SET post_id = '27287d63-3804-46c7-9997-94aaff524416'::UUID,
    status_blog = 'publicado',
    status_linkedin = 'producao',
    linkedin_texto = $linkedin$
Se você tem casa em São Paulo e já pensou em energia solar, provavelmente ouviu que precisa instalar antes de dezembro.

A isenção de ICMS acaba mesmo em 31 de dezembro. Só que instalar antes não protege ninguém. Quando ela cai, cai para todo mundo, inclusive para quem tem painel no telhado desde 2019. Com o Fio B é a mesma coisa.

Correr, então, muda pouco. O que muda bastante é mais sem graça, que é usar a energia na hora em que ela é gerada. Programar a bomba da piscina para o meio-dia rende mais no ano do que a pressa toda.

Quem ainda está projetando decide isso de graça, no desenho. Em Light Steel Frame o telhado e o caminho do eletroduto entram no modelo antes da obra. Com a casa pronta, vira reforma.

Tem um artigo com a conta aberta no nosso blog.

https://www.berkahn.com.br/atualidades/isencao-icms-energia-solar-sp?utm_source=linkedin&utm_medium=social&utm_campaign=post-organico

#LightSteelFrame #SteelFrame #EnergiaSolar #ConstruçãoIndustrializada #EficiênciaEnergética
$linkedin$,
    linkedin_imagem_prompt = $prompt$
Photorealistic architectural photograph, slightly elevated angle, of the roof of a contemporary high-end single-family house in a leafy residential neighbourhood of São Paulo, Brazil. Dark standing-seam metal roof with a matte black photovoltaic array mounted flush and perfectly aligned with the roof geometry: panels sit low and parallel to the surface, with no visible cabling, no conduit and no improvised brackets, so the array reads as part of the original design rather than a later addition. In the lower third of the frame, a rectangular swimming pool with still water reflecting the sky. Solar noon: high hard sunlight, short sharp shadows, bright but neutral light. Restrained palette of charcoal, warm grey, off-white render and green foliage. Neighbouring rooftops and tropical vegetation softly out of focus in the background. Full-frame camera, 35mm lens, f/8, deep focus, natural colour grading, subtle real-world imperfections such as faint dust on the panels and slight tonal variation in the metal. Calm, documentary, editorial architecture photography. Vertical 4:5 composition with clean negative space in the upper third.

Negative prompt: text, lettering, typography, watermark, logo, signature, captions, UI overlay, people, faces, brick walls, masonry, exposed concrete blocks, conventional construction site, scaffolding, rubble, ground-mounted solar farm, tilted panel racks, visible mounting rails, oversaturated blue sky, golden hour, HDR look, lens flare, illustration, 3D render, CGI look
$prompt$,
    linkedin_imagem_briefing = $briefing$
Fotografia gerada por IA, sem texto na arte. A imagem deve mostrar que o sistema foi pensado junto com a casa: painéis rentes ao plano do telhado, alinhados à geometria da cobertura, sem cabo aparente nem suporte improvisado. Sol a pino, com sombras curtas e duras, para sustentar o argumento do autoconsumo no meio do dia. Incluir a piscina no enquadramento e evitar alvenaria aparente, andaimes, entulho, golden hour ou aparência de render. Formato final 1080×1350 (4:5), paleta neutra e dessaturada. Assinatura BERKAHN discreta no canto inferior esquerdo e berkahn.com.br no inferior direito.
$briefing$
WHERE id = '63542e4b-8d91-4aba-8f42-2b0c872bd081'::UUID;

-- A trilha existe se, e somente se, a plataforma se aplica.
ALTER TABLE conteudo_pautas DROP CONSTRAINT IF EXISTS conteudo_pautas_trilha_blog_check;
ALTER TABLE conteudo_pautas ADD CONSTRAINT conteudo_pautas_trilha_blog_check CHECK (
  (('blog' = ANY(plataformas)) AND status_blog IS NOT NULL AND ordem_blog IS NOT NULL)
  OR
  (NOT ('blog' = ANY(plataformas)) AND status_blog IS NULL AND ordem_blog IS NULL)
);

ALTER TABLE conteudo_pautas DROP CONSTRAINT IF EXISTS conteudo_pautas_trilha_linkedin_check;
ALTER TABLE conteudo_pautas ADD CONSTRAINT conteudo_pautas_trilha_linkedin_check CHECK (
  (('linkedin' = ANY(plataformas)) AND status_linkedin IS NOT NULL AND ordem_linkedin IS NOT NULL)
  OR
  (NOT ('linkedin' = ANY(plataformas)) AND status_linkedin IS NULL AND ordem_linkedin IS NULL)
);

ALTER TABLE conteudo_pautas DROP CONSTRAINT IF EXISTS conteudo_pautas_linkedin_publicacao_check;
ALTER TABLE conteudo_pautas ADD CONSTRAINT conteudo_pautas_linkedin_publicacao_check CHECK (
  status_linkedin <> 'publicado'
  OR (linkedin_url IS NOT NULL AND linkedin_publicado_em IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_pautas_blog_ordem
  ON conteudo_pautas (status_blog, ordem_blog) WHERE status_blog IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_pautas_linkedin_ordem
  ON conteudo_pautas (status_linkedin, ordem_linkedin) WHERE status_linkedin IS NOT NULL;

-- Alternar plataformas nunca deixa metade de uma trilha inicializada. O
-- conteúdo produzido é preservado; somente estado e ordem deixam de se aplicar.
CREATE OR REPLACE FUNCTION sincronizar_trilhas_conteudo()
RETURNS TRIGGER AS $$
BEGIN
  IF 'blog' = ANY(NEW.plataformas) THEN
    NEW.status_blog := COALESCE(NEW.status_blog, 'planejada');
    IF NEW.ordem_blog IS NULL THEN
      SELECT COALESCE(MAX(ordem_blog), 0) + 1 INTO NEW.ordem_blog
      FROM conteudo_pautas WHERE status_blog = NEW.status_blog;
    END IF;
  ELSE
    NEW.status_blog := NULL;
    NEW.ordem_blog := NULL;
  END IF;

  IF 'linkedin' = ANY(NEW.plataformas) THEN
    NEW.status_linkedin := COALESCE(NEW.status_linkedin, 'planejada');
    IF NEW.ordem_linkedin IS NULL THEN
      SELECT COALESCE(MAX(ordem_linkedin), 0) + 1 INTO NEW.ordem_linkedin
      FROM conteudo_pautas WHERE status_linkedin = NEW.status_linkedin;
    END IF;
  ELSE
    NEW.status_linkedin := NULL;
    NEW.ordem_linkedin := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sincronizar_trilhas_conteudo_trigger ON conteudo_pautas;
CREATE TRIGGER sincronizar_trilhas_conteudo_trigger
  BEFORE INSERT OR UPDATE OF plataformas ON conteudo_pautas
  FOR EACH ROW EXECUTE FUNCTION sincronizar_trilhas_conteudo();

-- Eventos automatizados não têm auth.uid(). O ator continua obrigatório como
-- nome legível, mas user_id passa a representar apenas um usuário real.
ALTER TABLE activity_logs ALTER COLUMN user_id DROP NOT NULL;

-- Reordenação por canal em uma única transação. Qualquer item inválido levanta
-- exceção e desfaz todo o lote.
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
BEGIN
  IF p_canal NOT IN ('blog', 'linkedin') THEN
    RAISE EXCEPTION 'Canal inválido: %', p_canal;
  END IF;
  IF jsonb_typeof(p_updates) <> 'array' THEN
    RAISE EXCEPTION 'Updates devem ser um array JSON';
  END IF;

  FOR item IN SELECT value FROM jsonb_array_elements(p_updates)
  LOOP
    novo_status := item->>'status';
    nova_ordem := (item->>'ordem')::INTEGER;
    IF nova_ordem < 1 THEN RAISE EXCEPTION 'Ordem inválida'; END IF;
    IF p_canal = 'blog' AND novo_status NOT IN
      ('planejada', 'pesquisa', 'draft', 'produzido', 'aprovado', 'publicado') THEN
      RAISE EXCEPTION 'Status de Blog inválido: %', novo_status;
    END IF;
    IF p_canal = 'linkedin' AND novo_status NOT IN
      ('planejada', 'producao', 'produzido', 'aprovado', 'publicado') THEN
      RAISE EXCEPTION 'Status de LinkedIn inválido: %', novo_status;
    END IF;

    SELECT * INTO pauta_atual FROM conteudo_pautas
    WHERE id = (item->>'id')::UUID FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'Pauta não encontrada: %', item->>'id'; END IF;

    -- Publicação não é uma transição de quadro. Blog é publicado apenas pela
    -- RPC dedicada; LinkedIn exige URL e data na action específica.
    IF novo_status = 'publicado' THEN
      RAISE EXCEPTION 'Publicação exige a operação explícita do canal';
    END IF;

    IF p_canal = 'blog' THEN
      IF pauta_atual.status_blog IS NULL THEN RAISE EXCEPTION 'Blog não se aplica à pauta'; END IF;
      IF novo_status = 'draft' AND pauta_atual.draft_path IS NULL THEN
        RAISE EXCEPTION 'Draft exige draft_path';
      END IF;
      IF novo_status IN ('produzido', 'aprovado')
         AND (pauta_atual.post_id IS NULL OR pauta_atual.draft_path IS NULL
              OR pauta_atual.capa_blog_url IS NULL) THEN
        RAISE EXCEPTION 'Blog produzido exige artigo, draft_path e capa';
      END IF;
      IF novo_status = 'aprovado'
         AND pauta_atual.status_blog NOT IN ('produzido', 'aprovado') THEN
        RAISE EXCEPTION 'Aprovação do Blog exige estado produzido';
      END IF;
      UPDATE conteudo_pautas SET status_blog = novo_status, ordem_blog = nova_ordem
      WHERE id = pauta_atual.id;
      IF pauta_atual.status_blog IS DISTINCT FROM novo_status THEN
        INSERT INTO activity_logs
          (user_id, user_name, action, entity_type, entity_id, entity_name, details)
        VALUES
          (auth.uid(), COALESCE(auth.jwt()->>'email', 'Automação'), 'Status da pauta alterado',
           'pauta', pauta_atual.id, pauta_atual.titulo,
           jsonb_build_object('canal', p_canal, 'origem', p_origem,
             'anterior', pauta_atual.status_blog, 'novo', novo_status));
      END IF;
    ELSE
      IF pauta_atual.status_linkedin IS NULL THEN RAISE EXCEPTION 'LinkedIn não se aplica à pauta'; END IF;
      IF novo_status IN ('produzido', 'aprovado')
         AND (pauta_atual.linkedin_texto IS NULL OR pauta_atual.capa_linkedin_url IS NULL) THEN
        RAISE EXCEPTION 'LinkedIn produzido exige texto e capa 4:5';
      END IF;
      IF novo_status = 'aprovado'
         AND pauta_atual.status_linkedin NOT IN ('produzido', 'aprovado') THEN
        RAISE EXCEPTION 'Aprovação do LinkedIn exige estado produzido';
      END IF;
      UPDATE conteudo_pautas SET status_linkedin = novo_status, ordem_linkedin = nova_ordem
      WHERE id = pauta_atual.id;
      IF pauta_atual.status_linkedin IS DISTINCT FROM novo_status THEN
        INSERT INTO activity_logs
          (user_id, user_name, action, entity_type, entity_id, entity_name, details)
        VALUES
          (auth.uid(), COALESCE(auth.jwt()->>'email', 'Automação'), 'Status da pauta alterado',
           'pauta', pauta_atual.id, pauta_atual.titulo,
           jsonb_build_object('canal', p_canal, 'origem', p_origem,
             'anterior', pauta_atual.status_linkedin, 'novo', novo_status));
      END IF;
    END IF;
  END LOOP;
END;
$$;

REVOKE ALL ON FUNCTION mover_pautas_conteudo(TEXT, JSONB, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION mover_pautas_conteudo(TEXT, JSONB, TEXT) TO authenticated, service_role;

-- Operação atômica usada apenas pelo CLI genérico. É idempotente e concentra
-- a única escrita simultânea em posts.status + status_blog.
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
BEGIN
  SELECT * INTO pauta_atual FROM conteudo_pautas WHERE id = p_pauta_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Pauta não encontrada'; END IF;
  IF pauta_atual.post_id IS NULL THEN RAISE EXCEPTION 'Pauta sem artigo vinculado'; END IF;
  IF pauta_atual.status_blog NOT IN ('aprovado', 'publicado') THEN
    RAISE EXCEPTION 'Blog precisa estar aprovado antes de publicar';
  END IF;

  UPDATE posts
  SET status = 'published', published_at = COALESCE(published_at, NOW())
  WHERE id = pauta_atual.post_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Artigo vinculado não encontrado'; END IF;

  UPDATE conteudo_pautas
  SET status_blog = 'publicado', draft_path = p_publicado_path
  WHERE id = p_pauta_id;

  INSERT INTO activity_logs
    (user_id, user_name, action, entity_type, entity_id, entity_name, details)
  VALUES
    (NULL, 'Automação de conteúdo', 'Artigo publicado pela pauta', 'pauta',
     pauta_atual.id, pauta_atual.titulo,
     jsonb_build_object('canal', 'blog', 'origem', 'cli',
       'anterior', pauta_atual.status_blog, 'novo', 'publicado',
       'post_id', pauta_atual.post_id));
END;
$$;

REVOKE ALL ON FUNCTION publicar_artigo_pauta(UUID, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION publicar_artigo_pauta(UUID, TEXT) TO service_role;

COMMENT ON COLUMN conteudo_pautas.status_blog IS 'Trilha Blog: planejada, pesquisa, draft, produzido, aprovado, publicado. NULL quando Blog não se aplica.';
COMMENT ON COLUMN conteudo_pautas.status_linkedin IS 'Trilha LinkedIn: planejada, producao, produzido, aprovado, publicado. NULL quando LinkedIn não se aplica.';
COMMENT ON COLUMN conteudo_pautas.draft_path IS 'Caminho relativo do markdown no vault; o corpo do draft não é duplicado no banco.';
COMMENT ON COLUMN conteudo_pautas.linkedin_url IS 'URL pública obrigatória para marcar o LinkedIn como publicado.';
