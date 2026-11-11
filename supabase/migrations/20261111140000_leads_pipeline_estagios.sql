-- LEADS: dois novos estágios no pipeline comercial (feedback do admin, 09/11).
--
-- O que muda:
-- 1. leads_status_check ganha 'proposta_execucao' (propostas de execução de obra,
--    depois da proposta de projeto) e 'on_hold_projeto' (projeto em
--    desenvolvimento, pausado por decisão do cliente). Os seis valores
--    existentes continuam com o mesmo significado — só o rótulo exibido muda
--    no admin ('em_contato' vira "Contato/Consulta", 'qualificado' vira
--    "Estimativa", 'proposta_enviada' vira "Proposta Projeto", 'desqualificado'
--    vira "Perdido" — só na UI, ver components/admin/analytics/LeadsQueue.tsx).
--    Nenhum lead existente muda de status: quem já está em 'proposta_enviada'
--    continua lá (agora rotulado "Proposta Projeto"), ninguém é promovido
--    automaticamente para 'proposta_execucao'.
-- 2. update_lead_status() (020260929141528) é recriada com a lista nova e com
--    'proposta_execucao'/'on_hold_projeto' contando para qualificado_em e
--    qualificado_por, igual 'qualificado'/'proposta_enviada' já contavam.
-- 3. Nenhum outro CHECK, índice ou trigger referencia a lista de status — só
--    esses dois pontos, conferido em todas as migrations até a 20261105130000.
--
-- Como reverter:
--   ALTER TABLE public.leads DROP CONSTRAINT leads_status_check;
--   ALTER TABLE public.leads ADD CONSTRAINT leads_status_check CHECK (
--     status IN ('novo', 'em_contato', 'qualificado', 'proposta_enviada', 'convertido', 'desqualificado')
--   );
--   Recriar update_lead_status() com a lista de seis valores (ver 20260929141528).
--   Requer migrar de volta qualquer lead em 'proposta_execucao'/'on_hold_projeto'.
-- ============================================
BEGIN;

ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_status_check;
ALTER TABLE public.leads ADD CONSTRAINT leads_status_check CHECK (
  status IN (
    'novo', 'em_contato', 'qualificado', 'proposta_enviada',
    'proposta_execucao', 'on_hold_projeto', 'convertido', 'desqualificado'
  )
);

CREATE OR REPLACE FUNCTION public.update_lead_status(p_id UUID, p_status TEXT, p_motivo TEXT DEFAULT NULL)
RETURNS public.leads LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
DECLARE v_anterior TEXT; v_lead public.leads%ROWTYPE;
BEGIN
  IF NOT public.is_berkahn_admin() THEN RAISE EXCEPTION 'Não autorizado'; END IF;
  IF p_status IS NULL OR p_status NOT IN (
    'novo', 'em_contato', 'qualificado', 'proposta_enviada',
    'proposta_execucao', 'on_hold_projeto', 'convertido', 'desqualificado'
  ) THEN
    RAISE EXCEPTION 'Status inválido';
  END IF;
  IF p_status = 'desqualificado' AND NULLIF(btrim(COALESCE(p_motivo, '')), '') IS NULL THEN
    RAISE EXCEPTION 'Motivo da desqualificação é obrigatório';
  END IF;
  SELECT status INTO v_anterior FROM public.leads WHERE id = p_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Lead não encontrado'; END IF;
  UPDATE public.leads SET
    status = p_status,
    motivo_desqualificacao = CASE WHEN p_status = 'desqualificado' THEN btrim(p_motivo) ELSE NULL END,
    desqualificado_em = CASE WHEN p_status = 'desqualificado' THEN COALESCE(desqualificado_em, NOW()) ELSE NULL END,
    qualificado_em = CASE WHEN p_status IN ('qualificado', 'proposta_enviada', 'proposta_execucao', 'on_hold_projeto', 'convertido') THEN COALESCE(qualificado_em, NOW()) ELSE qualificado_em END,
    qualificado_por = CASE WHEN p_status IN ('qualificado', 'proposta_enviada', 'proposta_execucao', 'on_hold_projeto', 'convertido') THEN COALESCE(qualificado_por, auth.uid()) ELSE qualificado_por END,
    convertido_em = CASE WHEN p_status = 'convertido' THEN COALESCE(convertido_em, NOW()) ELSE convertido_em END,
    proxima_acao_em = CASE WHEN p_status IN ('convertido', 'desqualificado') THEN NULL ELSE proxima_acao_em END,
    visualizado_em = COALESCE(visualizado_em, NOW())
  WHERE id = p_id RETURNING * INTO v_lead;
  INSERT INTO public.activity_logs(user_id, user_name, action, entity_type, entity_id, entity_name, details)
  VALUES (auth.uid(), COALESCE(auth.jwt()->>'email', 'Admin'), 'Status do lead alterado', 'lead', p_id,
    'Lead ' || left(p_id::TEXT, 8), jsonb_strip_nulls(jsonb_build_object(
      'tipo', 'status', 'status_anterior', v_anterior, 'status_novo', p_status,
      'motivo_desqualificacao', NULLIF(btrim(COALESCE(p_motivo, '')), ''))));
  RETURN v_lead;
END;
$$;

COMMIT;
