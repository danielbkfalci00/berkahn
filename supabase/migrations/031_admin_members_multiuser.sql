-- BERKAHN — MEMBROS MULTIUSUÁRIO, PAPÉIS E PUSH POR CONTA

ALTER TABLE public.lead_responsaveis
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'comercial',
  ADD COLUMN IF NOT EXISTS recebe_leads BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS notificar_novos_leads BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS notificar_acoes_vencidas BOOLEAN NOT NULL DEFAULT TRUE;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'lead_responsaveis_role_check'
      AND conrelid = 'public.lead_responsaveis'::regclass
  ) THEN
    ALTER TABLE public.lead_responsaveis
      ADD CONSTRAINT lead_responsaveis_role_check
      CHECK (role IN ('owner', 'comercial', 'conteudo', 'viewer'));
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_lead_responsaveis_user
  ON public.lead_responsaveis(user_id)
  WHERE user_id IS NOT NULL;
UPDATE public.lead_responsaveis SET email = lower(email) WHERE email IS NOT NULL;
DROP INDEX IF EXISTS public.idx_lead_responsaveis_email;
CREATE UNIQUE INDEX IF NOT EXISTS idx_lead_responsaveis_email
  ON public.lead_responsaveis(email);
CREATE INDEX IF NOT EXISTS idx_lead_responsaveis_active_role
  ON public.lead_responsaveis(ativo, role, user_id);

INSERT INTO public.lead_responsaveis (
  nome, user_id, email, role, ativo, recebe_leads,
  notificar_novos_leads, notificar_acoes_vencidas
)
SELECT
  COALESCE(NULLIF(raw_user_meta_data->>'full_name', ''), 'Bruno Falci'),
  id,
  lower(email),
  'owner',
  TRUE,
  TRUE,
  TRUE,
  TRUE
FROM auth.users
WHERE lower(email) = 'contato.berkahn@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.lead_responsaveis r
    WHERE r.user_id = auth.users.id OR lower(COALESCE(r.email, '')) = lower(auth.users.email)
  )
ON CONFLICT DO NOTHING;

UPDATE public.lead_responsaveis r
SET role = 'owner', ativo = TRUE, email = lower(u.email), user_id = u.id
FROM auth.users u
WHERE lower(u.email) = 'contato.berkahn@gmail.com'
  AND (r.user_id = u.id OR lower(COALESCE(r.email, '')) = lower(u.email));

CREATE OR REPLACE FUNCTION public.is_berkahn_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.lead_responsaveis member
    WHERE member.user_id = (SELECT auth.uid())
      AND member.ativo = TRUE
      AND member.role IN ('owner', 'comercial')
  );
$$;

CREATE OR REPLACE FUNCTION public.has_admin_role(p_roles TEXT[])
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.lead_responsaveis member
    WHERE member.user_id = (SELECT auth.uid())
      AND member.ativo = TRUE
      AND member.role = ANY(p_roles)
  );
$$;

REVOKE ALL ON FUNCTION public.is_berkahn_admin() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.has_admin_role(TEXT[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_berkahn_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_admin_role(TEXT[]) TO authenticated;

DROP POLICY IF EXISTS "Berkahn admin manage lead responsaveis" ON public.lead_responsaveis;
DROP POLICY IF EXISTS "Admin members read team" ON public.lead_responsaveis;
DROP POLICY IF EXISTS "Owners manage team" ON public.lead_responsaveis;
CREATE POLICY "Admin members read team" ON public.lead_responsaveis
  FOR SELECT TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR public.has_admin_role(ARRAY['owner', 'comercial'])
  );
CREATE POLICY "Owners manage team" ON public.lead_responsaveis
  FOR ALL TO authenticated
  USING (public.has_admin_role(ARRAY['owner']))
  WITH CHECK (public.has_admin_role(ARRAY['owner']));
DROP POLICY IF EXISTS "Berkahn admin manage push subscriptions" ON public.admin_push_subscriptions;
DROP POLICY IF EXISTS "Members manage own push subscriptions" ON public.admin_push_subscriptions;
CREATE POLICY "Members manage own push subscriptions" ON public.admin_push_subscriptions
  FOR ALL TO authenticated
  USING (public.has_admin_role(ARRAY['owner', 'comercial', 'conteudo', 'viewer']) AND user_id = (SELECT auth.uid()))
  WITH CHECK (public.has_admin_role(ARRAY['owner', 'comercial', 'conteudo', 'viewer']) AND user_id = (SELECT auth.uid()));

ALTER TABLE public.lead_notification_outbox
  DROP CONSTRAINT IF EXISTS lead_notification_outbox_estado_check;
ALTER TABLE public.lead_notification_outbox
  ADD CONSTRAINT lead_notification_outbox_estado_check
  CHECK (estado IN ('pending', 'sending', 'sent', 'failed', 'skipped_no_subscribers'));

DROP POLICY IF EXISTS "Berkahn admin manage leads" ON public.leads;
DROP POLICY IF EXISTS "Commercial team manage leads" ON public.leads;
CREATE POLICY "Commercial team manage leads" ON public.leads
  FOR ALL TO authenticated
  USING (public.has_admin_role(ARRAY['owner', 'comercial']))
  WITH CHECK (public.has_admin_role(ARRAY['owner', 'comercial']));

DROP POLICY IF EXISTS "Berkahn admin manage lead artifacts" ON public.lead_artifacts;
DROP POLICY IF EXISTS "Commercial team manage lead artifacts" ON public.lead_artifacts;
CREATE POLICY "Commercial team manage lead artifacts" ON public.lead_artifacts
  FOR ALL TO authenticated
  USING (public.has_admin_role(ARRAY['owner', 'comercial']))
  WITH CHECK (public.has_admin_role(ARRAY['owner', 'comercial']));

DROP POLICY IF EXISTS "Berkahn admin manage orcamentos" ON public.orcamentos;
DROP POLICY IF EXISTS "Commercial team manage orcamentos" ON public.orcamentos;
CREATE POLICY "Commercial team manage orcamentos" ON public.orcamentos
  FOR ALL TO authenticated
  USING (public.has_admin_role(ARRAY['owner', 'comercial']))
  WITH CHECK (public.has_admin_role(ARRAY['owner', 'comercial']));

DROP POLICY IF EXISTS "Berkahn admin manage proposals" ON public.proposals;
DROP POLICY IF EXISTS "Commercial team manage proposals" ON public.proposals;
CREATE POLICY "Commercial team manage proposals" ON public.proposals
  FOR ALL TO authenticated
  USING (public.has_admin_role(ARRAY['owner', 'comercial']))
  WITH CHECK (public.has_admin_role(ARRAY['owner', 'comercial']));

DROP POLICY IF EXISTS "Authenticated admin SELECT" ON public.analytics_snapshots;
DROP POLICY IF EXISTS "Admin members read analytics snapshots" ON public.analytics_snapshots;
CREATE POLICY "Admin members read analytics snapshots" ON public.analytics_snapshots
  FOR SELECT TO authenticated
  USING (public.has_admin_role(ARRAY['owner', 'comercial', 'conteudo', 'viewer']));

DROP POLICY IF EXISTS "Allow authenticated users to manage analytics tasks" ON public.analytics_tasks;
DROP POLICY IF EXISTS "Admin members read analytics tasks" ON public.analytics_tasks;
DROP POLICY IF EXISTS "Owners and content manage analytics tasks" ON public.analytics_tasks;
CREATE POLICY "Admin members read analytics tasks" ON public.analytics_tasks
  FOR SELECT TO authenticated USING (public.has_admin_role(ARRAY['owner', 'comercial', 'conteudo', 'viewer']));
CREATE POLICY "Owners and content manage analytics tasks" ON public.analytics_tasks
  FOR ALL TO authenticated
  USING (public.has_admin_role(ARRAY['owner', 'conteudo']))
  WITH CHECK (public.has_admin_role(ARRAY['owner', 'conteudo']));

DROP POLICY IF EXISTS "Allow authenticated users to manage posts" ON public.posts;
DROP POLICY IF EXISTS "Admin members read posts" ON public.posts;
DROP POLICY IF EXISTS "Owners and content insert posts" ON public.posts;
DROP POLICY IF EXISTS "Owners and content update posts" ON public.posts;
DROP POLICY IF EXISTS "Owners and content delete posts" ON public.posts;
CREATE POLICY "Admin members read posts" ON public.posts
  FOR SELECT TO authenticated USING (public.has_admin_role(ARRAY['owner', 'comercial', 'conteudo', 'viewer']));
CREATE POLICY "Owners and content insert posts" ON public.posts
  FOR INSERT TO authenticated WITH CHECK (public.has_admin_role(ARRAY['owner', 'conteudo']));
CREATE POLICY "Owners and content update posts" ON public.posts
  FOR UPDATE TO authenticated
  USING (public.has_admin_role(ARRAY['owner', 'conteudo']))
  WITH CHECK (public.has_admin_role(ARRAY['owner', 'conteudo']));
CREATE POLICY "Owners and content delete posts" ON public.posts
  FOR DELETE TO authenticated USING (public.has_admin_role(ARRAY['owner', 'conteudo']));

DROP POLICY IF EXISTS "Authenticated manage pautas" ON public.conteudo_pautas;
DROP POLICY IF EXISTS "Admin members read pautas" ON public.conteudo_pautas;
DROP POLICY IF EXISTS "Owners and content manage pautas" ON public.conteudo_pautas;
CREATE POLICY "Admin members read pautas" ON public.conteudo_pautas
  FOR SELECT TO authenticated USING (public.has_admin_role(ARRAY['owner', 'comercial', 'conteudo', 'viewer']));
CREATE POLICY "Owners and content manage pautas" ON public.conteudo_pautas
  FOR ALL TO authenticated
  USING (public.has_admin_role(ARRAY['owner', 'conteudo']))
  WITH CHECK (public.has_admin_role(ARRAY['owner', 'conteudo']));

DROP POLICY IF EXISTS "Authenticated read pauta tags" ON public.conteudo_pauta_tags;
DROP POLICY IF EXISTS "Authenticated insert pauta tags" ON public.conteudo_pauta_tags;
DROP POLICY IF EXISTS "Authenticated delete pauta tags" ON public.conteudo_pauta_tags;
DROP POLICY IF EXISTS "Admin members read pauta tags" ON public.conteudo_pauta_tags;
DROP POLICY IF EXISTS "Owners and content manage pauta tags" ON public.conteudo_pauta_tags;
CREATE POLICY "Admin members read pauta tags" ON public.conteudo_pauta_tags
  FOR SELECT TO authenticated USING (public.has_admin_role(ARRAY['owner', 'comercial', 'conteudo', 'viewer']));
CREATE POLICY "Owners and content manage pauta tags" ON public.conteudo_pauta_tags
  FOR ALL TO authenticated
  USING (public.has_admin_role(ARRAY['owner', 'conteudo']))
  WITH CHECK (public.has_admin_role(ARRAY['owner', 'conteudo']));

DROP POLICY IF EXISTS "Authenticated read content tag catalog" ON public.conteudo_tags;
DROP POLICY IF EXISTS "Admin members read content tag catalog" ON public.conteudo_tags;
CREATE POLICY "Admin members read content tag catalog" ON public.conteudo_tags
  FOR SELECT TO authenticated USING (public.has_admin_role(ARRAY['owner', 'comercial', 'conteudo', 'viewer']));

DROP POLICY IF EXISTS "Authenticated read content performance" ON public.conteudo_performance_snapshots;
DROP POLICY IF EXISTS "Admin members read content performance" ON public.conteudo_performance_snapshots;
CREATE POLICY "Admin members read content performance" ON public.conteudo_performance_snapshots
  FOR SELECT TO authenticated USING (public.has_admin_role(ARRAY['owner', 'comercial', 'conteudo', 'viewer']));

DROP POLICY IF EXISTS "Authenticated read content worker heartbeat" ON public.conteudo_worker_heartbeats;
DROP POLICY IF EXISTS "Owners and content read worker heartbeat" ON public.conteudo_worker_heartbeats;
CREATE POLICY "Owners and content read worker heartbeat" ON public.conteudo_worker_heartbeats
  FOR SELECT TO authenticated USING (public.has_admin_role(ARRAY['owner', 'conteudo']));

DROP POLICY IF EXISTS "Authenticated read automation jobs" ON public.conteudo_automation_jobs;
DROP POLICY IF EXISTS "Authenticated queue automation jobs" ON public.conteudo_automation_jobs;
DROP POLICY IF EXISTS "Authenticated cancel own automation jobs" ON public.conteudo_automation_jobs;
DROP POLICY IF EXISTS "Owners and content read automation jobs" ON public.conteudo_automation_jobs;
DROP POLICY IF EXISTS "Owners and content queue automation jobs" ON public.conteudo_automation_jobs;
DROP POLICY IF EXISTS "Owners and content cancel own automation jobs" ON public.conteudo_automation_jobs;
CREATE POLICY "Owners and content read automation jobs" ON public.conteudo_automation_jobs
  FOR SELECT TO authenticated USING (public.has_admin_role(ARRAY['owner', 'conteudo']));
CREATE POLICY "Owners and content queue automation jobs" ON public.conteudo_automation_jobs
  FOR INSERT TO authenticated
  WITH CHECK (
    public.has_admin_role(ARRAY['owner', 'conteudo'])
    AND solicitado_por = (SELECT auth.uid())
  );
CREATE POLICY "Owners and content cancel own automation jobs" ON public.conteudo_automation_jobs
  FOR UPDATE TO authenticated
  USING (
    public.has_admin_role(ARRAY['owner', 'conteudo'])
    AND solicitado_por = (SELECT auth.uid())
    AND status IN ('na-fila', 'falhou')
  )
  WITH CHECK (status = 'cancelado');

DROP POLICY IF EXISTS "Berkahn admin read documentos" ON public.documentos;
DROP POLICY IF EXISTS "Admin members read documentos" ON public.documentos;
CREATE POLICY "Admin members read documentos" ON public.documentos
  FOR SELECT TO authenticated USING (public.has_admin_role(ARRAY['owner', 'comercial', 'conteudo', 'viewer']));

DROP POLICY IF EXISTS "Authenticated manage threads" ON public.documento_threads;
DROP POLICY IF EXISTS "Admin members read threads" ON public.documento_threads;
DROP POLICY IF EXISTS "Owners and content manage threads" ON public.documento_threads;
CREATE POLICY "Admin members read threads" ON public.documento_threads
  FOR SELECT TO authenticated USING (public.has_admin_role(ARRAY['owner', 'comercial', 'conteudo', 'viewer']));
CREATE POLICY "Owners and content manage threads" ON public.documento_threads
  FOR ALL TO authenticated
  USING (public.has_admin_role(ARRAY['owner', 'conteudo']))
  WITH CHECK (public.has_admin_role(ARRAY['owner', 'conteudo']));

DROP POLICY IF EXISTS "Authenticated manage comentarios" ON public.documento_comentarios;
DROP POLICY IF EXISTS "Admin members read comentarios" ON public.documento_comentarios;
DROP POLICY IF EXISTS "Owners and content manage comentarios" ON public.documento_comentarios;
CREATE POLICY "Admin members read comentarios" ON public.documento_comentarios
  FOR SELECT TO authenticated USING (public.has_admin_role(ARRAY['owner', 'comercial', 'conteudo', 'viewer']));
CREATE POLICY "Owners and content manage comentarios" ON public.documento_comentarios
  FOR ALL TO authenticated
  USING (public.has_admin_role(ARRAY['owner', 'conteudo']))
  WITH CHECK (public.has_admin_role(ARRAY['owner', 'conteudo']));

COMMENT ON COLUMN public.documento_comentarios.autor_nome IS
  'Nome do membro ativo resolvido no servidor a partir de lead_responsaveis.';
COMMENT ON COLUMN public.documento_comentarios.autor_user_id IS
  'auth.users.id individual do autor; obrigatório nas novas escritas do admin.';

DROP POLICY IF EXISTS "Berkahn admin manage presentations" ON public.presentations;
DROP POLICY IF EXISTS "Admin members read presentations" ON public.presentations;
DROP POLICY IF EXISTS "Owners and content manage presentations" ON public.presentations;
CREATE POLICY "Admin members read presentations" ON public.presentations
  FOR SELECT TO authenticated USING (public.has_admin_role(ARRAY['owner', 'comercial', 'conteudo', 'viewer']));
CREATE POLICY "Owners and content manage presentations" ON public.presentations
  FOR ALL TO authenticated
  USING (public.has_admin_role(ARRAY['owner', 'conteudo']))
  WITH CHECK (public.has_admin_role(ARRAY['owner', 'conteudo']));

DROP POLICY IF EXISTS "Berkahn admin read activity logs" ON public.activity_logs;
DROP POLICY IF EXISTS "Berkahn admin insert activity logs" ON public.activity_logs;
DROP POLICY IF EXISTS "Members read scoped activity logs" ON public.activity_logs;
DROP POLICY IF EXISTS "Members insert scoped activity logs" ON public.activity_logs;
CREATE POLICY "Members read scoped activity logs" ON public.activity_logs
  FOR SELECT TO authenticated
  USING (
    public.has_admin_role(ARRAY['owner'])
    OR (public.has_admin_role(ARRAY['comercial']) AND entity_type IN ('lead', 'orcamento', 'proposal', 'task'))
    OR (public.has_admin_role(ARRAY['conteudo']) AND entity_type IN ('post', 'pauta', 'documento', 'presentation', 'task'))
  );
CREATE POLICY "Members insert scoped activity logs" ON public.activity_logs
  FOR INSERT TO authenticated
  WITH CHECK (
    public.has_admin_role(ARRAY['owner'])
    OR (public.has_admin_role(ARRAY['comercial']) AND entity_type IN ('lead', 'orcamento', 'proposal', 'task'))
    OR (public.has_admin_role(ARRAY['conteudo']) AND entity_type IN ('post', 'pauta', 'documento', 'presentation', 'task'))
  );

DROP POLICY IF EXISTS "Authenticated read content covers" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated insert content covers" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update content covers" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete content covers" ON storage.objects;
DROP POLICY IF EXISTS "Admin members read content covers" ON storage.objects;
DROP POLICY IF EXISTS "Owners and content insert covers" ON storage.objects;
DROP POLICY IF EXISTS "Owners and content update covers" ON storage.objects;
DROP POLICY IF EXISTS "Owners and content delete covers" ON storage.objects;
CREATE POLICY "Admin members read content covers" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'post-images'
    AND public.has_admin_role(ARRAY['owner', 'comercial', 'conteudo', 'viewer'])
    AND (
      name ~ '^conteudo/[0-9a-fA-F-]{36}/(blog|linkedin)(/[0-9a-f]{64}\.jpg|\.jpg)$'
      OR name ~ '^covers/[a-z0-9][a-z0-9-]*\.(png|jpe?g|webp)$'
    )
  );
CREATE POLICY "Owners and content insert covers" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'post-images'
    AND public.has_admin_role(ARRAY['owner', 'conteudo'])
    AND (
      name ~ '^conteudo/[0-9a-fA-F-]{36}/(blog|linkedin)(/[0-9a-f]{64}\.jpg|\.jpg)$'
      OR name ~ '^covers/[a-z0-9][a-z0-9-]*\.(png|jpe?g|webp)$'
    )
  );
CREATE POLICY "Owners and content update covers" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'post-images'
    AND public.has_admin_role(ARRAY['owner', 'conteudo'])
    AND (
      name ~ '^conteudo/[0-9a-fA-F-]{36}/(blog|linkedin)(/[0-9a-f]{64}\.jpg|\.jpg)$'
      OR name ~ '^covers/[a-z0-9][a-z0-9-]*\.(png|jpe?g|webp)$'
    )
  )
  WITH CHECK (
    bucket_id = 'post-images'
    AND public.has_admin_role(ARRAY['owner', 'conteudo'])
    AND (
      name ~ '^conteudo/[0-9a-fA-F-]{36}/(blog|linkedin)(/[0-9a-f]{64}\.jpg|\.jpg)$'
      OR name ~ '^covers/[a-z0-9][a-z0-9-]*\.(png|jpe?g|webp)$'
    )
  );
CREATE POLICY "Owners and content delete covers" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'post-images'
    AND public.has_admin_role(ARRAY['owner', 'conteudo'])
    AND (
      name ~ '^conteudo/[0-9a-fA-F-]{36}/(blog|linkedin)(/[0-9a-f]{64}\.jpg|\.jpg)$'
      OR name ~ '^covers/[a-z0-9][a-z0-9-]*\.(png|jpe?g|webp)$'
    )
  );

DROP POLICY IF EXISTS "Berkahn admin read lead files" ON storage.objects;
DROP POLICY IF EXISTS "Berkahn admin insert lead files" ON storage.objects;
DROP POLICY IF EXISTS "Berkahn admin delete lead files" ON storage.objects;
DROP POLICY IF EXISTS "Commercial team read lead files" ON storage.objects;
DROP POLICY IF EXISTS "Commercial team insert lead files" ON storage.objects;
DROP POLICY IF EXISTS "Commercial team delete lead files" ON storage.objects;
CREATE POLICY "Commercial team read lead files" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'lead-files' AND public.has_admin_role(ARRAY['owner', 'comercial']));
CREATE POLICY "Commercial team insert lead files" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'lead-files' AND public.has_admin_role(ARRAY['owner', 'comercial']));
CREATE POLICY "Commercial team delete lead files" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'lead-files' AND public.has_admin_role(ARRAY['owner', 'comercial']));
