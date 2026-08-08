-- Heartbeat do worker Codex e historico de performance editorial em janelas de 28 dias.

CREATE TABLE conteudo_worker_heartbeats (
  worker_id TEXT PRIMARY KEY,
  versao TEXT,
  detalhes JSONB NOT NULL DEFAULT '{}'::JSONB,
  visto_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE conteudo_worker_heartbeats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read content worker heartbeat"
  ON conteudo_worker_heartbeats FOR SELECT TO authenticated USING (TRUE);
REVOKE ALL ON conteudo_worker_heartbeats FROM PUBLIC, anon, authenticated;
GRANT SELECT ON conteudo_worker_heartbeats TO authenticated;
GRANT ALL ON conteudo_worker_heartbeats TO service_role;

CREATE OR REPLACE FUNCTION registrar_conteudo_worker_heartbeat(
  p_worker_id TEXT,
  p_versao TEXT DEFAULT NULL,
  p_detalhes JSONB DEFAULT '{}'::JSONB
)
RETURNS conteudo_worker_heartbeats
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  resultado conteudo_worker_heartbeats;
BEGIN
  IF current_user <> 'service_role' AND auth.role() <> 'service_role' THEN
    RAISE EXCEPTION 'Apenas service role pode registrar heartbeat';
  END IF;
  IF COALESCE(trim(p_worker_id), '') = '' THEN
    RAISE EXCEPTION 'worker_id obrigatorio';
  END IF;

  INSERT INTO conteudo_worker_heartbeats(worker_id, versao, detalhes, visto_em)
  VALUES (p_worker_id, NULLIF(trim(p_versao), ''), COALESCE(p_detalhes, '{}'::JSONB), NOW())
  ON CONFLICT(worker_id) DO UPDATE
    SET versao = EXCLUDED.versao,
        detalhes = EXCLUDED.detalhes,
        visto_em = EXCLUDED.visto_em
  RETURNING * INTO resultado;
  RETURN resultado;
END;
$$;

REVOKE ALL ON FUNCTION registrar_conteudo_worker_heartbeat(TEXT, TEXT, JSONB)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION registrar_conteudo_worker_heartbeat(TEXT, TEXT, JSONB)
  TO service_role;

CREATE TABLE conteudo_performance_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pauta_id UUID NOT NULL REFERENCES conteudo_pautas(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
  janela_inicio DATE NOT NULL,
  janela_fim DATE NOT NULL,
  sessoes INTEGER NOT NULL DEFAULT 0 CHECK (sessoes >= 0),
  sessoes_engajadas INTEGER NOT NULL DEFAULT 0 CHECK (sessoes_engajadas >= 0 AND sessoes_engajadas <= sessoes),
  tempo_medio_engajamento NUMERIC(10, 2),
  profundidade_25 INTEGER NOT NULL DEFAULT 0,
  profundidade_50 INTEGER NOT NULL DEFAULT 0,
  profundidade_75 INTEGER NOT NULL DEFAULT 0,
  profundidade_90 INTEGER NOT NULL DEFAULT 0,
  leads_qualificados INTEGER NOT NULL DEFAULT 0 CHECK (leads_qualificados >= 0),
  leads_por_100_engajadas NUMERIC(10, 3),
  palavras INTEGER,
  headings INTEGER,
  amostra_suficiente BOOLEAN NOT NULL DEFAULT FALSE,
  evidencias JSONB NOT NULL DEFAULT '{}'::JSONB,
  run_id UUID NOT NULL DEFAULT uuid_generate_v4(),
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (janela_inicio <= janela_fim),
  UNIQUE(pauta_id, janela_inicio, janela_fim)
);

CREATE INDEX idx_conteudo_performance_pauta_data
  ON conteudo_performance_snapshots(pauta_id, janela_fim DESC);

ALTER TABLE conteudo_performance_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read content performance"
  ON conteudo_performance_snapshots FOR SELECT TO authenticated USING (TRUE);
REVOKE ALL ON conteudo_performance_snapshots FROM PUBLIC, anon, authenticated;
GRANT SELECT ON conteudo_performance_snapshots TO authenticated;
GRANT ALL ON conteudo_performance_snapshots TO service_role;
