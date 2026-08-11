-- BERKAHN — REMOÇÃO ATÔMICA DE ARTEFATOS DE LEADS
-- 027 já está em produção; esta migration incremental evita apagar o objeto
-- antes de persistir a intenção de limpeza no banco.

CREATE OR REPLACE FUNCTION public.delete_lead_artifact(
  p_id UUID,
  p_pending_only BOOLEAN
)
RETURNS TABLE (lead_id UUID, bucket TEXT, path TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_artifact lead_artifacts%ROWTYPE;
BEGIN
  IF NOT public.is_berkahn_admin() THEN RAISE EXCEPTION 'Não autorizado'; END IF;

  SELECT * INTO v_artifact
  FROM lead_artifacts
  WHERE id = p_id
  FOR UPDATE;

  IF NOT FOUND THEN RAISE EXCEPTION 'Arquivo não encontrado'; END IF;
  IF p_pending_only AND v_artifact.estado <> 'pending' THEN
    RAISE EXCEPTION 'O upload já foi concluído';
  END IF;

  IF v_artifact.storage_bucket IS NOT NULL AND v_artifact.storage_path IS NOT NULL THEN
    INSERT INTO lead_storage_cleanup (lead_id, bucket, path)
    VALUES (v_artifact.lead_id, v_artifact.storage_bucket, v_artifact.storage_path)
    ON CONFLICT ON CONSTRAINT lead_storage_cleanup_bucket_path_key DO NOTHING;
  END IF;

  DELETE FROM lead_artifacts WHERE id = p_id;

  INSERT INTO activity_logs (user_id, user_name, action, entity_type, entity_id, entity_name, details)
  VALUES (
    auth.uid(), COALESCE(auth.jwt()->>'email', 'Admin'),
    CASE WHEN p_pending_only THEN 'Upload de lead cancelado' ELSE 'Arquivo removido do lead' END,
    'lead', v_artifact.lead_id, 'Lead ' || left(v_artifact.lead_id::TEXT, 8),
    jsonb_build_object('artifact_id', p_id, 'tipo', v_artifact.tipo)
  );

  RETURN QUERY SELECT v_artifact.lead_id, v_artifact.storage_bucket, v_artifact.storage_path;
END;
$$;

REVOKE ALL ON FUNCTION public.delete_lead_artifact(UUID,BOOLEAN) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.delete_lead_artifact(UUID,BOOLEAN) TO authenticated;
