-- Migration 020: use run_id as a required fencing token.
-- A stale execution cannot finish a later claim of the same job.

DROP FUNCTION IF EXISTS finalizar_conteudo_automation_job(
  UUID, TEXT, TEXT, JSONB, INTEGER, INTEGER, NUMERIC, TEXT
);

CREATE OR REPLACE FUNCTION finalizar_conteudo_automation_job(
  p_job_id UUID,
  p_worker_id TEXT,
  p_run_id UUID,
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
    RAISE EXCEPTION 'Status final invalido';
  END IF;

  UPDATE conteudo_automation_jobs
  SET status = p_status,
      lease_ate = NULL,
      context_hashes = COALESCE(p_context_hashes, '{}'::JSONB),
      tokens_entrada = p_tokens_entrada,
      tokens_saida = p_tokens_saida,
      custo_estimado = p_custo_estimado,
      erro = CASE WHEN p_status = 'falhou' THEN p_erro ELSE NULL END,
      finalizado_em = CASE
        WHEN p_status IN ('concluido', 'falhou') THEN NOW()
        ELSE NULL
      END
  WHERE id = p_job_id
    AND status = 'executando'
    AND worker_id = p_worker_id
    AND run_id = p_run_id
    AND lease_ate > NOW()
  RETURNING * INTO resultado;

  IF resultado.id IS NULL THEN
    RAISE EXCEPTION 'Job, worker, run_id ou lease invalido';
  END IF;

  INSERT INTO activity_logs
    (user_id, user_name, action, entity_type, entity_id, entity_name, details)
  VALUES
    (NULL, 'Automacao de conteudo', 'Job de conteudo finalizado', 'automation_job',
     resultado.id, resultado.acao,
     jsonb_build_object(
       'run_id', resultado.run_id,
       'status', resultado.status,
       'tokens_entrada', resultado.tokens_entrada,
       'tokens_saida', resultado.tokens_saida,
       'custo_estimado', resultado.custo_estimado,
       'context_hashes', resultado.context_hashes
     ));

  RETURN resultado;
END;
$$;

REVOKE ALL ON FUNCTION finalizar_conteudo_automation_job(
  UUID, TEXT, UUID, TEXT, JSONB, INTEGER, INTEGER, NUMERIC, TEXT
) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION finalizar_conteudo_automation_job(
  UUID, TEXT, UUID, TEXT, JSONB, INTEGER, INTEGER, NUMERIC, TEXT
) TO service_role;
