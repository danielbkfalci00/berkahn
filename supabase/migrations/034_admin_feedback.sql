-- BERKAHN — FEEDBACK E MELHORIAS DO ADMIN (mural compartilhado em formato de chat)
--
-- O que muda:
-- 1. feedback_itens: uma sugestão (título, categoria, status aberto|implementado,
--    página de origem). feedback_mensagens: a conversa do item. Duas tabelas pelo
--    mesmo motivo da 009: o item é dono do status, a mensagem é dona do texto.
-- 2. RLS: todo membro ativo (qualquer papel) lê tudo e escreve item e mensagem em
--    nome próprio. Ninguém autenticado faz UPDATE nem DELETE direto: o status só
--    muda pela RPC set_feedback_status, que exige owner e grava activity_logs.
--    Mural compartilhado e "só owner muda status" são decisões do dono.
-- 3. Trigger de autoria (espírito do bind_activity_log_author da 032): com sessão,
--    autor_id vira auth.uid(), autor_nome vem do cadastro do membro (ou do e-mail
--    do JWT) e origem vira 'admin'. Sem sessão (service role, CLI) o valor enviado
--    é respeitado; é assim que a CLI grava origem 'cli' e autor "Claude".
-- 4. Push: item novo entra na lead_notification_outbox como 'novo_feedback' com
--    texto genérico. O CHECK de tipo da 028 é reescrito com o valor novo.
-- 5. activity_logs.entity_type ganha 'feedback'. Lista copiada da 017, a última que
--    reescreveu o CHECK (conferido com grep em todas as migrations até a 033).
--
-- Como reverter (manual, em ordem):
--   DROP TRIGGER enqueue_new_feedback_push_trigger ON public.feedback_itens;
--   DROP FUNCTION public.enqueue_new_feedback_push();
--   DELETE FROM public.lead_notification_outbox WHERE tipo = 'novo_feedback';
--   Recriar lead_notification_outbox_tipo_check com ('novo_lead', 'proxima_acao_vencida').
--   DELETE FROM public.activity_logs WHERE entity_type = 'feedback';
--   Recriar activity_logs_entity_type_check com a lista da 017 (sem 'feedback').
--   DROP FUNCTION public.set_feedback_status(UUID, TEXT, TEXT);
--   DROP TABLE public.feedback_mensagens; DROP TABLE public.feedback_itens;
--   DROP FUNCTION public.bind_feedback_author(); DROP FUNCTION public.touch_feedback_item();
-- ============================================

CREATE TABLE IF NOT EXISTS public.feedback_itens (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo             TEXT NOT NULL CHECK (char_length(btrim(titulo)) BETWEEN 4 AND 160),
  categoria          TEXT NOT NULL DEFAULT 'melhoria'
                     CHECK (categoria IN ('melhoria', 'bug', 'ideia', 'outro')),
  status             TEXT NOT NULL DEFAULT 'aberto'
                     CHECK (status IN ('aberto', 'implementado')),
  pagina_origem      TEXT CHECK (pagina_origem IS NULL OR char_length(pagina_origem) <= 300),
  autor_id           UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  autor_nome         TEXT NOT NULL,
  implementado_em    TIMESTAMPTZ,
  implementado_por   TEXT,
  nota_implementacao TEXT CHECK (nota_implementacao IS NULL OR char_length(nota_implementacao) <= 2000),
  criado_em          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- A lista filtra por status e ordena pela atividade mais recente.
CREATE INDEX IF NOT EXISTS idx_feedback_itens_status
  ON public.feedback_itens (status, atualizado_em DESC);

CREATE TABLE IF NOT EXISTS public.feedback_mensagens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id     UUID NOT NULL REFERENCES public.feedback_itens(id) ON DELETE CASCADE,
  autor_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  autor_nome  TEXT NOT NULL,
  corpo       TEXT NOT NULL CHECK (char_length(btrim(corpo)) BETWEEN 1 AND 5000),
  origem      TEXT NOT NULL DEFAULT 'admin' CHECK (origem IN ('admin', 'cli')),
  criado_em   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feedback_mensagens_item
  ON public.feedback_mensagens (item_id, criado_em);

-- update_atualizado_em_column() existe desde a 009 (naming em português).
DROP TRIGGER IF EXISTS update_feedback_itens_atualizado_em ON public.feedback_itens;
CREATE TRIGGER update_feedback_itens_atualizado_em
  BEFORE UPDATE ON public.feedback_itens
  FOR EACH ROW EXECUTE FUNCTION update_atualizado_em_column();

-- ============================================
-- AUTORIA AMARRADA À SESSÃO
-- ============================================
-- SECURITY DEFINER só para ler lead_responsaveis: a policy da 031 não deixa um
-- 'conteudo' ou 'viewer' ler o cadastro de ninguém além do próprio, e o nome
-- vem justamente do próprio. O uid continua sendo o do JWT, então não há como
-- escrever em nome de outra pessoa.
CREATE OR REPLACE FUNCTION public.bind_feedback_author()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_uid UUID := (SELECT auth.uid());
BEGIN
  IF v_uid IS NOT NULL THEN
    NEW.autor_id := v_uid;
    NEW.autor_nome := COALESCE(
      (SELECT NULLIF(btrim(m.nome), '') FROM public.lead_responsaveis m
        WHERE m.user_id = v_uid AND m.ativo = TRUE LIMIT 1),
      (SELECT auth.jwt()->>'email'),
      NEW.autor_nome
    );
    IF TG_TABLE_NAME = 'feedback_mensagens' THEN
      -- O selo "via Claude" só pode nascer da CLI (service role).
      NEW.origem := 'admin';
    ELSE
      -- Item novo nasce aberto; marcar como implementado é papel da RPC.
      NEW.status := 'aberto';
      NEW.implementado_em := NULL;
      NEW.implementado_por := NULL;
      NEW.nota_implementacao := NULL;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.bind_feedback_author() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS feedback_itens_bind_author ON public.feedback_itens;
CREATE TRIGGER feedback_itens_bind_author
  BEFORE INSERT ON public.feedback_itens
  FOR EACH ROW EXECUTE FUNCTION public.bind_feedback_author();

DROP TRIGGER IF EXISTS feedback_mensagens_bind_author ON public.feedback_mensagens;
CREATE TRIGGER feedback_mensagens_bind_author
  BEFORE INSERT ON public.feedback_mensagens
  FOR EACH ROW EXECUTE FUNCTION public.bind_feedback_author();

-- Mensagem nova sobe o item na lista ("atividade recente"). Definer porque
-- authenticated não tem UPDATE em feedback_itens, de propósito.
CREATE OR REPLACE FUNCTION public.touch_feedback_item()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.feedback_itens SET atualizado_em = NOW() WHERE id = NEW.item_id;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.touch_feedback_item() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS feedback_mensagens_touch_item ON public.feedback_mensagens;
CREATE TRIGGER feedback_mensagens_touch_item
  AFTER INSERT ON public.feedback_mensagens
  FOR EACH ROW EXECUTE FUNCTION public.touch_feedback_item();

-- ============================================
-- RLS
-- ============================================
-- Obrigatória: o middleware protege a rota, não a tabela.
ALTER TABLE public.feedback_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_mensagens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin members read feedback" ON public.feedback_itens;
CREATE POLICY "Admin members read feedback" ON public.feedback_itens
  FOR SELECT TO authenticated
  USING (public.has_admin_role(ARRAY['owner', 'comercial', 'conteudo', 'viewer']));

DROP POLICY IF EXISTS "Admin members create feedback" ON public.feedback_itens;
CREATE POLICY "Admin members create feedback" ON public.feedback_itens
  FOR INSERT TO authenticated
  WITH CHECK (
    public.has_admin_role(ARRAY['owner', 'comercial', 'conteudo', 'viewer'])
    AND autor_id = (SELECT auth.uid())
  );

DROP POLICY IF EXISTS "Admin members read feedback messages" ON public.feedback_mensagens;
CREATE POLICY "Admin members read feedback messages" ON public.feedback_mensagens
  FOR SELECT TO authenticated
  USING (public.has_admin_role(ARRAY['owner', 'comercial', 'conteudo', 'viewer']));

DROP POLICY IF EXISTS "Admin members reply feedback" ON public.feedback_mensagens;
CREATE POLICY "Admin members reply feedback" ON public.feedback_mensagens
  FOR INSERT TO authenticated
  WITH CHECK (
    public.has_admin_role(ARRAY['owner', 'comercial', 'conteudo', 'viewer'])
    AND autor_id = (SELECT auth.uid())
  );
-- Sem policy de UPDATE/DELETE: status só pela RPC abaixo; histórico não se apaga.

-- ============================================
-- activity_logs.entity_type + 'feedback'
-- ============================================
-- Lista vigente copiada da 017:54-56. Copiar uma lista mais antiga apagaria
-- 'lead' e 'automation_job' e quebraria a timeline dos leads.
ALTER TABLE public.activity_logs DROP CONSTRAINT IF EXISTS activity_logs_entity_type_check;
ALTER TABLE public.activity_logs ADD CONSTRAINT activity_logs_entity_type_check
  CHECK (entity_type IN
    ('post', 'proposal', 'presentation', 'task', 'orcamento', 'pauta', 'lead', 'automation_job', 'feedback'));

-- ============================================
-- RPC: mudança de status (só owner)
-- ============================================
CREATE OR REPLACE FUNCTION public.set_feedback_status(p_id UUID, p_status TEXT, p_nota TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_nota TEXT := NULLIF(left(btrim(COALESCE(p_nota, '')), 2000), '');
  v_quem TEXT := COALESCE(auth.jwt()->>'email', 'Admin');
  v_titulo TEXT;
BEGIN
  IF NOT public.has_admin_role(ARRAY['owner']) THEN RAISE EXCEPTION 'Não autorizado'; END IF;
  IF p_status NOT IN ('aberto', 'implementado') THEN RAISE EXCEPTION 'Status inválido'; END IF;

  UPDATE feedback_itens SET
    status = p_status,
    implementado_em = CASE WHEN p_status = 'implementado' THEN NOW() ELSE NULL END,
    implementado_por = CASE WHEN p_status = 'implementado' THEN v_quem ELSE NULL END,
    -- Reabrir mantém a nota anterior se nenhuma nova vier: ela ainda explica
    -- o que foi tentado.
    nota_implementacao = COALESCE(v_nota, nota_implementacao)
  WHERE id = p_id
  RETURNING titulo INTO v_titulo;
  IF NOT FOUND THEN RAISE EXCEPTION 'Feedback não encontrado'; END IF;

  INSERT INTO activity_logs (user_id, user_name, action, entity_type, entity_id, entity_name, details)
  VALUES (auth.uid(), v_quem, 'update', 'feedback', p_id, v_titulo,
    jsonb_build_object('tipo', 'status', 'status', p_status, 'nota', v_nota, 'origem', 'admin'));
END;
$$;

REVOKE ALL ON FUNCTION public.set_feedback_status(UUID, TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.set_feedback_status(UUID, TEXT, TEXT) TO authenticated;

-- ============================================
-- PUSH para owners
-- ============================================
ALTER TABLE public.lead_notification_outbox
  DROP CONSTRAINT IF EXISTS lead_notification_outbox_tipo_check;
ALTER TABLE public.lead_notification_outbox
  ADD CONSTRAINT lead_notification_outbox_tipo_check
  CHECK (tipo IN ('novo_lead', 'proxima_acao_vencida', 'novo_feedback'));

-- Payload sem PII e sem o texto do feedback: a notificação aparece na tela
-- bloqueada. Só o id vai, dentro da URL. O CHECK de payload da 028 continua valendo.
CREATE OR REPLACE FUNCTION public.enqueue_new_feedback_push()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO lead_notification_outbox (tipo, lead_id, dedupe_key, payload)
  VALUES (
    'novo_feedback',
    NULL,
    'novo_feedback:' || NEW.id::TEXT,
    jsonb_build_object(
      'title', 'Novo feedback no admin',
      'body', 'Abra o admin para ver a sugestão.',
      'url', '/admin/feedback/' || NEW.id::TEXT,
      'tag', 'novo-feedback'
    )
  )
  ON CONFLICT (dedupe_key) DO NOTHING;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.enqueue_new_feedback_push() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS enqueue_new_feedback_push_trigger ON public.feedback_itens;
CREATE TRIGGER enqueue_new_feedback_push_trigger
  AFTER INSERT ON public.feedback_itens
  FOR EACH ROW EXECUTE FUNCTION public.enqueue_new_feedback_push();

COMMENT ON TABLE public.feedback_itens IS 'Sugestões de melhoria do admin. Mural compartilhado: todo membro ativo lê e responde; só owner (RPC) ou a CLI mudam status.';
COMMENT ON COLUMN public.feedback_itens.pagina_origem IS 'Pathname do admin onde o formulário rápido foi aberto. Capturado automaticamente.';
COMMENT ON COLUMN public.feedback_itens.nota_implementacao IS 'Nota opcional do owner ao mudar status, ex.: link do PR.';
COMMENT ON COLUMN public.feedback_mensagens.origem IS 'admin = escrita pela UI (forçada pelo trigger); cli = scripts/admin/feedback.mjs com service role.';
