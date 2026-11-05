-- Retenção LGPD: a anonimização também zera os campos de área e terreno do lead.
BEGIN;
CREATE OR REPLACE FUNCTION public.anonymize_lead_core(p_id uuid, p_tipo text)
 RETURNS text[]
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_pdf_paths TEXT[];
BEGIN
  SELECT COALESCE(
    array_agg(pdf_storage_path) FILTER (WHERE pdf_storage_path IS NOT NULL),
    ARRAY[]::TEXT[]
  )
  INTO v_pdf_paths
  FROM orcamentos
  WHERE lead_id = p_id;

  INSERT INTO lead_storage_cleanup (lead_id, bucket, path)
  SELECT p_id, storage_bucket, storage_path
  FROM lead_artifacts
  WHERE lead_id = p_id
    AND tipo = 'upload'
    AND storage_bucket IS NOT NULL
    AND storage_path IS NOT NULL
  ON CONFLICT (bucket, path) DO NOTHING;

  DELETE FROM lead_artifacts WHERE lead_id = p_id;

  UPDATE activity_logs
  SET entity_name = 'Lead ' || left(p_id::TEXT, 8),
      details = jsonb_build_object('tipo', p_tipo)
  WHERE entity_type = 'lead' AND entity_id = p_id;

  UPDATE orcamentos SET
    cliente_nome = 'Cliente anonimizado', cliente_email = NULL, cliente_telefone = NULL,
    obra_endereco = 'Anonimizado', obra_cidade = 'Anonimizado', obra_referencia = NULL,
    pdf_url = NULL, pdf_storage_path = NULL, pdf_generated_at = NULL, pdf_revision_hash = NULL
  WHERE lead_id = p_id;

  UPDATE proposals SET
    client_name = 'Cliente anonimizado', client_email = NULL, client_phone = NULL,
    client_address = NULL, project_description = NULL, notes = NULL, internal_notes = NULL
  WHERE lead_id = p_id;

  UPDATE leads SET
    nome = 'Lead anonimizado', email = NULL, telefone = NULL, mensagem = NULL,
    tipo_projeto = NULL, area_obra_m2 = NULL, terreno_adquirido = NULL, empresa = NULL, cargo = NULL, referrer = NULL,
    request_fingerprint = NULL, submission_id = NULL, submission_payload_hash = NULL, motivo_desqualificacao = NULL,
    retencao_excecao_motivo = NULL, resumo_status = NULL,
    utm = '{}'::JSONB, landing_page = NULL, sheet_sync_error = NULL,
    responsavel_id = NULL, anonimizado_em = NOW(),
    retencao_storage_pendente = v_pdf_paths
  WHERE id = p_id;

  RETURN v_pdf_paths;
END;
$function$
;
REVOKE ALL ON FUNCTION public.anonymize_lead_core(UUID, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.anonymize_lead_core(UUID, TEXT) TO service_role;
COMMIT;
