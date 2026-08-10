-- BERKAHN — PWA ADMIN E NOTIFICAÇÕES OPERACIONAIS SEM PII

CREATE TABLE IF NOT EXISTS admin_push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth_key TEXT NOT NULL,
  device_label TEXT NOT NULL DEFAULT 'Dispositivo',
  user_agent TEXT,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  ultimo_uso_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE admin_push_subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Berkahn admin manage push subscriptions" ON admin_push_subscriptions;
CREATE POLICY "Berkahn admin manage push subscriptions"
  ON admin_push_subscriptions FOR ALL TO authenticated
  USING (public.is_berkahn_admin() AND user_id = auth.uid())
  WITH CHECK (public.is_berkahn_admin() AND user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_admin_push_subscriptions_active
  ON admin_push_subscriptions(ativo, ultimo_uso_em DESC);

CREATE TABLE IF NOT EXISTS lead_notification_outbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL CHECK (tipo IN ('novo_lead', 'proxima_acao_vencida')),
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  dedupe_key TEXT NOT NULL UNIQUE,
  payload JSONB NOT NULL,
  estado TEXT NOT NULL DEFAULT 'pending' CHECK (estado IN ('pending', 'sending', 'sent', 'failed')),
  tentativas INTEGER NOT NULL DEFAULT 0,
  proxima_tentativa_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ultimo_erro TEXT,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  enviado_em TIMESTAMPTZ,
  CONSTRAINT lead_notification_payload_no_contact CHECK (
    NOT (payload ?| ARRAY['nome', 'email', 'telefone', 'leadId', 'lead_id'])
  )
);

ALTER TABLE lead_notification_outbox ENABLE ROW LEVEL SECURITY;
-- Sem policies: somente service_role acessa a outbox.

CREATE INDEX IF NOT EXISTS idx_lead_notification_outbox_dispatch
  ON lead_notification_outbox(estado, proxima_tentativa_em, criado_em)
  WHERE estado IN ('pending', 'failed', 'sending');

CREATE OR REPLACE FUNCTION public.enqueue_new_lead_push()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO lead_notification_outbox (tipo, lead_id, dedupe_key, payload)
  VALUES (
    'novo_lead',
    NEW.id,
    'novo_lead:' || NEW.id::TEXT,
    jsonb_build_object(
      'title', 'Novo lead recebido',
      'body', 'Abra o admin para revisar o contato.',
      'url', '/admin/leads',
      'tag', 'novo-lead'
    )
  )
  ON CONFLICT (dedupe_key) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enqueue_new_lead_push_trigger ON leads;
CREATE TRIGGER enqueue_new_lead_push_trigger
  AFTER INSERT ON leads
  FOR EACH ROW EXECUTE FUNCTION public.enqueue_new_lead_push();

REVOKE ALL ON FUNCTION public.enqueue_new_lead_push() FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.enqueue_overdue_lead_pushes()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  INSERT INTO lead_notification_outbox (tipo, lead_id, dedupe_key, payload)
  SELECT
    'proxima_acao_vencida',
    l.id,
    'proxima_acao_vencida:' || l.id::TEXT || ':' || CURRENT_DATE::TEXT,
    jsonb_build_object(
      'title', 'Próxima ação vencida',
      'body', 'Há um lead que precisa de acompanhamento.',
      'url', '/admin/leads?vencida=1',
      'tag', 'lead-vencido'
    )
  FROM leads l
  WHERE l.proxima_acao_em < NOW()
    AND l.arquivado_em IS NULL
    AND l.anonimizado_em IS NULL
    AND l.status NOT IN ('convertido', 'desqualificado')
  ON CONFLICT (dedupe_key) DO NOTHING;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;

CREATE OR REPLACE FUNCTION public.claim_lead_push_notifications(p_limit INTEGER DEFAULT 20)
RETURNS SETOF lead_notification_outbox
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  WITH candidates AS (
    SELECT id
    FROM lead_notification_outbox
    WHERE (
      estado IN ('pending', 'failed')
      OR (estado = 'sending' AND atualizado_em < NOW() - INTERVAL '10 minutes')
    )
      AND proxima_tentativa_em <= NOW()
      AND tentativas < 6
    ORDER BY criado_em
    FOR UPDATE SKIP LOCKED
    LIMIT LEAST(GREATEST(p_limit, 1), 100)
  )
  UPDATE lead_notification_outbox n
  SET estado = 'sending',
      tentativas = n.tentativas + 1,
      atualizado_em = NOW()
  FROM candidates c
  WHERE n.id = c.id
  RETURNING n.*;
$$;

CREATE OR REPLACE FUNCTION public.schedule_lead_push_dispatch(p_dispatch_url TEXT)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog, extensions, vault
AS $$
DECLARE
  v_job_id BIGINT;
  v_command TEXT;
BEGIN
  IF NULLIF(btrim(p_dispatch_url), '') IS NULL OR p_dispatch_url !~ '^https://' THEN
    RAISE EXCEPTION 'URL HTTPS do dispatcher é obrigatória';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM vault.decrypted_secrets WHERE name = 'lead_push_cron_secret') THEN
    RAISE EXCEPTION 'Crie lead_push_cron_secret no Supabase Vault antes de agendar';
  END IF;

  PERFORM cron.unschedule(jobid)
  FROM cron.job
  WHERE jobname = 'berkahn-lead-push-dispatch';

  v_command := format(
    $cmd$SELECT public.enqueue_overdue_lead_pushes();
    SELECT net.http_post(
      url := %L,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'x-cron-secret', (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'lead_push_cron_secret')
      ),
      body := '{}'::jsonb,
      timeout_milliseconds := 30000
    );$cmd$,
    p_dispatch_url
  );

  SELECT cron.schedule('berkahn-lead-push-dispatch', '*/15 * * * *', v_command) INTO v_job_id;
  RETURN v_job_id;
END;
$$;

REVOKE ALL ON FUNCTION public.enqueue_overdue_lead_pushes() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.claim_lead_push_notifications(INTEGER) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.schedule_lead_push_dispatch(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.enqueue_overdue_lead_pushes() TO service_role;
GRANT EXECUTE ON FUNCTION public.claim_lead_push_notifications(INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION public.schedule_lead_push_dispatch(TEXT) TO service_role;
