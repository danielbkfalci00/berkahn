-- Infra explícita para agendar retenção. Não cria o job automaticamente:
-- primeiro publique a Edge Function e grave lead_retention_cron_secret no Vault.

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

CREATE OR REPLACE FUNCTION public.schedule_monthly_lead_retention(p_function_url TEXT)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog, extensions, vault
AS $$
DECLARE
  v_job_id BIGINT;
  v_command TEXT;
BEGIN
  IF NULLIF(btrim(p_function_url), '') IS NULL OR p_function_url !~ '^https://' THEN
    RAISE EXCEPTION 'URL HTTPS da Edge Function é obrigatória';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM vault.decrypted_secrets WHERE name = 'lead_retention_cron_secret') THEN
    RAISE EXCEPTION 'Crie lead_retention_cron_secret no Supabase Vault antes de agendar';
  END IF;

  PERFORM cron.unschedule(jobid)
  FROM cron.job
  WHERE jobname = 'berkahn-lead-retention-monthly';

  v_command := format(
    $cmd$SELECT net.http_post(
      url := %L,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'x-cron-secret', (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'lead_retention_cron_secret')
      ),
      body := '{}'::jsonb,
      timeout_milliseconds := 30000
    );$cmd$,
    p_function_url
  );

  SELECT cron.schedule('berkahn-lead-retention-monthly', '15 3 1 * *', v_command) INTO v_job_id;
  RETURN v_job_id;
END;
$$;

REVOKE ALL ON FUNCTION public.schedule_monthly_lead_retention(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.schedule_monthly_lead_retention(TEXT) TO service_role;
