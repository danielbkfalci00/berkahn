-- BERKAHN - CORRECAO DA GERACAO DE RUN_ID DA FILA
-- Mantem a precisao corrigida em 018 e usa a funcao UUID do catalogo.

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
  IF COALESCE(trim(p_worker_id), '') = '' THEN RAISE EXCEPTION 'worker_id obrigatorio'; END IF;
  IF p_lease_seconds < 60 OR p_lease_seconds > 3600 THEN RAISE EXCEPTION 'lease invalido'; END IF;

  UPDATE conteudo_automation_jobs j
  SET status = 'falhou', erro = 'Pauta alterada depois do handoff', finalizado_em = NOW()
  FROM conteudo_pautas p
  WHERE j.pauta_id = p.id AND j.status = 'na-fila'
    AND date_trunc('milliseconds', j.esperado_atualizado_em)
      IS DISTINCT FROM date_trunc('milliseconds', p.atualizado_em);

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
      run_id = gen_random_uuid(), iniciado_em = COALESCE(iniciado_em, NOW()), erro = NULL
  WHERE id = escolhido
  RETURNING *;
END;
$$;

REVOKE ALL ON FUNCTION claim_conteudo_automation_job(TEXT, INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION claim_conteudo_automation_job(TEXT, INTEGER) TO service_role;
