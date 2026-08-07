-- BERKAHN - FILA CARD + CODEX

CREATE TABLE conteudo_automation_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pauta_id UUID NOT NULL REFERENCES conteudo_pautas(id) ON DELETE CASCADE,
  acao TEXT NOT NULL CHECK (acao IN
    ('pesquisar', 'criar-draft', 'produzir-artigo', 'produzir-linkedin', 'revisar', 'preparar-publicacao')),
  status TEXT NOT NULL DEFAULT 'na-fila' CHECK (status IN
    ('na-fila', 'executando', 'aguardando-aprovacao', 'concluido', 'falhou', 'cancelado')),
  solicitado_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  worker_id TEXT,
  tentativas INTEGER NOT NULL DEFAULT 0 CHECK (tentativas >= 0),
  lease_ate TIMESTAMPTZ,
  esperado_atualizado_em TIMESTAMPTZ NOT NULL,
  run_id UUID,
  erro TEXT,
  context_hashes JSONB NOT NULL DEFAULT '{}'::JSONB,
  tokens_entrada INTEGER,
  tokens_saida INTEGER,
  custo_estimado NUMERIC(12, 6),
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  iniciado_em TIMESTAMPTZ,
  finalizado_em TIMESTAMPTZ,
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_conteudo_jobs_fila ON conteudo_automation_jobs(status, criado_em);
CREATE INDEX idx_conteudo_jobs_pauta ON conteudo_automation_jobs(pauta_id, criado_em DESC);
CREATE UNIQUE INDEX idx_conteudo_jobs_ativo
  ON conteudo_automation_jobs(pauta_id, acao)
  WHERE status IN ('na-fila', 'executando', 'aguardando-aprovacao');

CREATE TRIGGER update_conteudo_jobs_updated_at
  BEFORE UPDATE ON conteudo_automation_jobs
  FOR EACH ROW EXECUTE FUNCTION update_atualizado_em_column();

ALTER TABLE conteudo_automation_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read automation jobs" ON conteudo_automation_jobs
  FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Authenticated queue automation jobs" ON conteudo_automation_jobs
  FOR INSERT TO authenticated WITH CHECK (solicitado_por = auth.uid());
CREATE POLICY "Authenticated cancel own automation jobs" ON conteudo_automation_jobs
  FOR UPDATE TO authenticated
  USING (solicitado_por = auth.uid() AND status IN ('na-fila', 'falhou'))
  WITH CHECK (solicitado_por = auth.uid() AND status = 'cancelado');

CREATE OR REPLACE FUNCTION claim_conteudo_automation_job(
  p_worker_id TEXT,
  p_lease_seconds INTEGER DEFAULT 900
)
RETURNS SETOF conteudo_automation_jobs
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  escolhido UUID;
BEGIN
  IF COALESCE(trim(p_worker_id), '') = '' THEN RAISE EXCEPTION 'worker_id obrigat?rio'; END IF;
  IF p_lease_seconds < 60 OR p_lease_seconds > 3600 THEN RAISE EXCEPTION 'lease inv?lido'; END IF;

  UPDATE conteudo_automation_jobs j
  SET status = 'falhou', erro = 'Pauta alterada depois do handoff', finalizado_em = NOW()
  FROM conteudo_pautas p
  WHERE j.pauta_id = p.id AND j.status = 'na-fila'
    AND j.esperado_atualizado_em IS DISTINCT FROM p.atualizado_em;

  SELECT id INTO escolhido
  FROM conteudo_automation_jobs
  WHERE (status = 'na-fila' OR (status = 'executando' AND lease_ate < NOW()))
    AND tentativas < 4
  ORDER BY criado_em
  FOR UPDATE SKIP LOCKED
  LIMIT 1;

  IF escolhido IS NULL THEN RETURN; END IF;

  RETURN QUERY
  UPDATE conteudo_automation_jobs
  SET status = 'executando', worker_id = p_worker_id,
      tentativas = tentativas + 1, lease_ate = NOW() + make_interval(secs => p_lease_seconds),
      run_id = uuid_generate_v4(), iniciado_em = COALESCE(iniciado_em, NOW()), erro = NULL
  WHERE id = escolhido
  RETURNING *;
END;
$$;

CREATE OR REPLACE FUNCTION finalizar_conteudo_automation_job(
  p_job_id UUID,
  p_worker_id TEXT,
  p_status TEXT,
  p_context_hashes JSONB DEFAULT '{}'::JSONB,
  p_tokens_entrada INTEGER DEFAULT NULL,
  p_tokens_saida INTEGER DEFAULT NULL,
  p_custo_estimado NUMERIC DEFAULT NULL,
  p_erro TEXT DEFAULT NULL
)
RETURNS conteudo_automation_jobs
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  resultado conteudo_automation_jobs;
BEGIN
  IF p_status NOT IN ('aguardando-aprovacao', 'concluido', 'falhou') THEN
    RAISE EXCEPTION 'Status final inv?lido';
  END IF;

  UPDATE conteudo_automation_jobs
  SET status = p_status, lease_ate = NULL, context_hashes = COALESCE(p_context_hashes, '{}'::JSONB),
      tokens_entrada = p_tokens_entrada, tokens_saida = p_tokens_saida,
      custo_estimado = p_custo_estimado, erro = CASE WHEN p_status = 'falhou' THEN p_erro ELSE NULL END,
      finalizado_em = CASE WHEN p_status IN ('concluido', 'falhou') THEN NOW() ELSE NULL END
  WHERE id = p_job_id AND status = 'executando' AND worker_id = p_worker_id
  RETURNING * INTO resultado;

  IF resultado.id IS NULL THEN RAISE EXCEPTION 'Job n?o encontrado ou lease pertence a outro worker'; END IF;
  INSERT INTO activity_logs
    (user_id, user_name, action, entity_type, entity_id, entity_name, details)
  VALUES
    (NULL, 'Automacao de conteudo', 'Job de conteudo finalizado', 'automation_job',
     resultado.id, resultado.acao,
     jsonb_build_object('run_id', resultado.run_id, 'status', resultado.status,
       'tokens_entrada', resultado.tokens_entrada, 'tokens_saida', resultado.tokens_saida,
       'custo_estimado', resultado.custo_estimado, 'context_hashes', resultado.context_hashes));
  RETURN resultado;
END;
$$;

REVOKE ALL ON FUNCTION claim_conteudo_automation_job(TEXT, INTEGER) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION finalizar_conteudo_automation_job(UUID, TEXT, TEXT, JSONB, INTEGER, INTEGER, NUMERIC, TEXT)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION claim_conteudo_automation_job(TEXT, INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION finalizar_conteudo_automation_job(UUID, TEXT, TEXT, JSONB, INTEGER, INTEGER, NUMERIC, TEXT)
  TO service_role;
