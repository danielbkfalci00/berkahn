-- Remove o estado geral legado depois do deploy das trilhas independentes.
-- status_blog/ordem_blog e status_linkedin/ordem_linkedin sao a unica fonte
-- operacional desde o commit b525032.

BEGIN;

LOCK TABLE conteudo_pautas IN ACCESS EXCLUSIVE MODE;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM conteudo_pautas
    WHERE ('blog' = ANY(plataformas)) <>
          (status_blog IS NOT NULL AND ordem_blog IS NOT NULL)
       OR ('linkedin' = ANY(plataformas)) <>
          (status_linkedin IS NOT NULL AND ordem_linkedin IS NOT NULL)
  ) THEN
    RAISE EXCEPTION 'Trilhas inconsistentes; migration 013 cancelada';
  END IF;
END;
$$;

DROP INDEX IF EXISTS idx_pautas_coluna_ordem;

ALTER TABLE conteudo_pautas
  DROP COLUMN IF EXISTS coluna,
  DROP COLUMN IF EXISTS ordem;

COMMENT ON TABLE conteudo_pautas IS
  'Quadro de conteudo com trilhas Blog e LinkedIn independentes; o estado geral e derivado na aplicacao.';

COMMIT;
