-- LEADS: tags livres no CRM (feedback do admin, 26/11).
--
-- O que muda:
-- 1. leads.tags TEXT[] NOT NULL DEFAULT '{}' — rótulos livres, editados no card
--    do Kanban e na prévia. Índice GIN para filtrar por tag no futuro.
-- 2. set_lead_tags(p_id, p_tags) — SECURITY INVOKER (RLS vale), exige admin,
--    normaliza (trim, minúsculas, sem vazias/duplicadas), limita a 10 tags de
--    até 30 caracteres e registra em activity_logs.
--
-- Como reverter:
--   DROP FUNCTION public.set_lead_tags(UUID, TEXT[]);
--   ALTER TABLE public.leads DROP COLUMN tags;
-- ============================================
BEGIN;

ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT '{}';
CREATE INDEX IF NOT EXISTS leads_tags_gin ON public.leads USING GIN (tags);

CREATE OR REPLACE FUNCTION public.set_lead_tags(p_id UUID, p_tags TEXT[])
RETURNS public.leads LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
DECLARE v_tags TEXT[]; v_lead public.leads%ROWTYPE;
BEGIN
  IF NOT public.is_berkahn_admin() THEN RAISE EXCEPTION 'Não autorizado'; END IF;
  SELECT COALESCE(array_agg(t ORDER BY ord), '{}') INTO v_tags FROM (
    SELECT DISTINCT ON (t) t, ord FROM (
      SELECT lower(btrim(x)) AS t, ord FROM unnest(COALESCE(p_tags, '{}')) WITH ORDINALITY AS u(x, ord)
    ) s WHERE t <> '' ORDER BY t, ord
  ) d;
  IF cardinality(v_tags) > 10 THEN RAISE EXCEPTION 'Máximo de 10 tags por lead'; END IF;
  IF EXISTS (SELECT 1 FROM unnest(v_tags) t WHERE char_length(t) > 30) THEN
    RAISE EXCEPTION 'Cada tag deve ter até 30 caracteres';
  END IF;
  UPDATE public.leads SET tags = v_tags WHERE id = p_id RETURNING * INTO v_lead;
  IF NOT FOUND THEN RAISE EXCEPTION 'Lead não encontrado'; END IF;
  INSERT INTO public.activity_logs(user_id, user_name, action, entity_type, entity_id, entity_name, details)
  VALUES (auth.uid(), COALESCE(auth.jwt()->>'email', 'Admin'), 'Tags do lead alteradas', 'lead', p_id,
    'Lead ' || left(p_id::TEXT, 8), jsonb_build_object('tipo', 'tags', 'tags', to_jsonb(v_tags)));
  RETURN v_lead;
END;
$$;

REVOKE ALL ON FUNCTION public.set_lead_tags(UUID, TEXT[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.set_lead_tags(UUID, TEXT[]) TO authenticated;

COMMIT;
