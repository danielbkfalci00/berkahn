-- BERKAHN - TAXONOMIA CONTROLADA DO QUADRO

CREATE TABLE conteudo_tags (
  slug TEXT PRIMARY KEY CHECK (slug ~ '^domain/[a-z0-9]+(?:-[a-z0-9]+)*$'),
  label TEXT NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  ordem INTEGER NOT NULL DEFAULT 0 CHECK (ordem >= 0),
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_conteudo_tags_updated_at
  BEFORE UPDATE ON conteudo_tags
  FOR EACH ROW EXECUTE FUNCTION update_atualizado_em_column();

CREATE TABLE conteudo_pauta_tags (
  pauta_id UUID NOT NULL REFERENCES conteudo_pautas(id) ON DELETE CASCADE,
  tag_slug TEXT NOT NULL REFERENCES conteudo_tags(slug) ON UPDATE CASCADE ON DELETE RESTRICT,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (pauta_id, tag_slug)
);

CREATE INDEX idx_conteudo_pauta_tags_tag ON conteudo_pauta_tags(tag_slug, pauta_id);

INSERT INTO conteudo_tags (slug, label, ordem) VALUES
  ('domain/admin', 'Admin', 10),
  ('domain/architecture', 'Arquitetura', 20),
  ('domain/brand', 'Marca', 30),
  ('domain/drywall', 'Drywall', 40),
  ('domain/financiamento', 'Financiamento', 50),
  ('domain/integrations', 'Integra??es', 60),
  ('domain/lsf', 'Light Steel Frame', 70),
  ('domain/normas', 'Normas', 80),
  ('domain/seo', 'SEO/AEO', 90),
  ('domain/steel-frame', 'Steel Frame', 100),
  ('domain/sustentabilidade', 'Sustentabilidade', 110);

ALTER TABLE conteudo_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE conteudo_pauta_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated read content tag catalog" ON conteudo_tags
  FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Authenticated read pauta tags" ON conteudo_pauta_tags
  FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Authenticated insert pauta tags" ON conteudo_pauta_tags
  FOR INSERT TO authenticated WITH CHECK (TRUE);
CREATE POLICY "Authenticated delete pauta tags" ON conteudo_pauta_tags
  FOR DELETE TO authenticated USING (TRUE);

CREATE OR REPLACE FUNCTION atualizar_tags_pauta(p_pauta_id UUID, p_tags TEXT[])
RETURNS VOID
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  invalidas TEXT[];
BEGIN
  IF NOT EXISTS (SELECT 1 FROM conteudo_pautas WHERE id = p_pauta_id) THEN
    RAISE EXCEPTION 'Pauta n?o encontrada';
  END IF;

  SELECT array_agg(tag)
  INTO invalidas
  FROM unnest(COALESCE(p_tags, ARRAY[]::TEXT[])) AS tag
  LEFT JOIN conteudo_tags c ON c.slug = tag AND c.ativo
  WHERE c.slug IS NULL;

  IF invalidas IS NOT NULL THEN
    RAISE EXCEPTION 'Tags inv?lidas ou inativas: %', array_to_string(invalidas, ', ');
  END IF;

  DELETE FROM conteudo_pauta_tags WHERE pauta_id = p_pauta_id;
  INSERT INTO conteudo_pauta_tags (pauta_id, tag_slug)
  SELECT p_pauta_id, tag
  FROM unnest(COALESCE(p_tags, ARRAY[]::TEXT[])) AS tag
  ON CONFLICT DO NOTHING;
END;
$$;

REVOKE ALL ON FUNCTION atualizar_tags_pauta(UUID, TEXT[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION atualizar_tags_pauta(UUID, TEXT[]) TO authenticated, service_role;
