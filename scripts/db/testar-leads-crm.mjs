import process from "node:process";
import { readFileSync } from "node:fs";
import pg from "pg";

const { Client } = pg;
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL ausente.");
const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: process.env.SUPABASE_CA_CERT ? { rejectUnauthorized: true, ca: readFileSync(process.env.SUPABASE_CA_CERT, "utf8") } : { rejectUnauthorized: true } });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

await client.connect();
try {
  await client.query("BEGIN");
  const { rows: admins } = await client.query("SELECT user_id AS id, email FROM public.lead_responsaveis WHERE role = 'owner' AND ativo AND user_id IS NOT NULL LIMIT 1");
  assert(admins[0], "Owner ativo não encontrado.");
  const admin = admins[0];
  const { rows: leads } = await client.query(`
    INSERT INTO public.leads (nome, email, telefone, segmento, mensagem, canal)
    VALUES ('Teste transacional', 'crm-test@example.invalid', '(11) 99999-9999', 'residencial', 'Teste', 'manual')
    RETURNING id
  `);
  const leadId = leads[0].id;
  const { rows: logs } = await client.query(`
    INSERT INTO public.activity_logs (user_id, user_name, action, entity_type, entity_id, entity_name, details)
    VALUES ($1, 'Admin', 'Teste de RLS', 'lead', $2, 'Lead teste', '{}'::jsonb)
    RETURNING id
  `, [admin.id, leadId]);
  const leadLogId = logs[0].id;
  const { rows: normalLogs } = await client.query(`
    INSERT INTO public.activity_logs (user_id, user_name, action, entity_type, entity_id, entity_name, details)
    VALUES ($1, 'Admin', 'Teste de acesso normal', 'task', gen_random_uuid(), 'Task teste', '{}'::jsonb)
    RETURNING id
  `, [admin.id]);

  await client.query("SET LOCAL ROLE anon");
  assert(Number((await client.query("SELECT count(*) AS total FROM public.leads WHERE id = $1", [leadId])).rows[0].total) === 0, "Anon visualizou lead.");

  await client.query("RESET ROLE");
  await client.query("SET LOCAL ROLE authenticated");
  await client.query("SELECT set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: "00000000-0000-0000-0000-000000000001", email: "nao-autorizado@example.invalid", role: "authenticated" })]);
  assert(Number((await client.query("SELECT count(*) AS total FROM public.leads WHERE id = $1", [leadId])).rows[0].total) === 0, "Usuário não autorizado visualizou lead.");
  assert(Number((await client.query("SELECT count(*) AS total FROM public.activity_logs WHERE id = $1", [leadLogId])).rows[0].total) === 0, "Usuário não autorizado visualizou log de lead.");
  assert(Number((await client.query("SELECT count(*) AS total FROM public.activity_logs WHERE id = $1", [normalLogs[0].id])).rows[0].total) === 0, "Usuário não autorizado visualizou log administrativo.");
  assert(Number((await client.query("SELECT count(*) AS total FROM public.lead_responsaveis")).rows[0].total) === 0, "Usuário não autorizado visualizou responsáveis.");
  assert(Number((await client.query("SELECT count(*) AS total FROM public.admin_push_subscriptions")).rows[0].total) === 0, "Usuário não autorizado visualizou assinaturas push.");

  await client.query("RESET ROLE");
  await client.query("SET LOCAL ROLE authenticated");
  await client.query("SELECT set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: admin.id, email: admin.email, role: "authenticated" })]);
  assert(Number((await client.query("SELECT count(*) AS total FROM public.leads WHERE id = $1", [leadId])).rows[0].total) === 1, "Administrador não visualizou lead.");
  await client.query("SELECT public.update_lead_status($1, 'qualificado', NULL)", [leadId]);
  assert((await client.query("SELECT status FROM public.leads WHERE id = $1", [leadId])).rows[0].status === "qualificado", "RPC não atualizou status.");

  assert((await client.query("SELECT telefone_normalizado FROM public.leads WHERE id = $1", [leadId])).rows[0].telefone_normalizado === "5511999999999", "Telefone nacional não recebeu o DDI brasileiro.");
  await client.query("SELECT public.register_lead_attendance($1, 'Retorno combinado', 'em_contato', NOW() + INTERVAL '1 day', NULL)", [leadId]);
  const scheduledLead = (await client.query("SELECT status,ultimo_contato_em,proxima_acao_em FROM public.leads WHERE id = $1", [leadId])).rows[0];
  assert(scheduledLead.status === "em_contato" && scheduledLead.ultimo_contato_em && scheduledLead.proxima_acao_em, "Atendimento não salvou etapa e próximo passo juntos.");
  await client.query("SELECT public.register_lead_attendance($1, 'Contrato confirmado', 'convertido', NOW() + INTERVAL '1 day', NULL)", [leadId]);
  const convertedLead = (await client.query("SELECT convertido_em,proxima_acao_em FROM public.leads WHERE id = $1", [leadId])).rows[0];
  assert(convertedLead.convertido_em && !convertedLead.proxima_acao_em, "Conversão manteve uma pendência aberta.");
  await client.query("SELECT public.update_lead_status($1, 'qualificado', NULL)", [leadId]);
  assert((await client.query("SELECT convertido_em FROM public.leads WHERE id = $1", [leadId])).rows[0].convertido_em, "Regressão apagou a conversão histórica.");
  await client.query("SELECT public.update_lead_contact($1, 'Contato revisado', 'revisado@example.invalid', '+55 (11) 99999-9999', 'comercial', 'Projeto de teste', '', '')", [leadId]);
  const revisedContact = (await client.query("SELECT nome,email,telefone_normalizado,segmento FROM public.leads WHERE id = $1", [leadId])).rows[0];
  assert(revisedContact.nome === "Contato revisado" && revisedContact.email === "revisado@example.invalid" && revisedContact.telefone_normalizado === "5511999999999" && revisedContact.segmento === "comercial", "Edição do contato não preservou os dados normalizados.");
  const submissionId = "a077a964-96f3-4ad3-b2f9-48a5cc879ffd";
  await client.query("UPDATE public.leads SET submission_id = $2 WHERE id = $1", [leadId, submissionId]);
  await client.query("SAVEPOINT before_duplicate_submission");
  let duplicateSubmissionBlocked = false;
  try {
    await client.query("INSERT INTO public.leads (nome,email,telefone,segmento,mensagem,canal,submission_id) VALUES ('Retry de teste','retry@example.invalid','11999999999','residencial','Teste','form',$1)", [submissionId]);
  } catch (error) {
    duplicateSubmissionBlocked = error.code === "23505";
    await client.query("ROLLBACK TO SAVEPOINT before_duplicate_submission");
  }
  assert(duplicateSubmissionBlocked, "O mesmo identificador de submissão criou dois leads.");

  await client.query("RESET ROLE");
  await client.query(`CREATE FUNCTION pg_temp.fail_lead_log() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'falha de log simulada'; END $$`);
  await client.query("CREATE TRIGGER fail_lead_log BEFORE INSERT ON public.activity_logs FOR EACH ROW EXECUTE FUNCTION pg_temp.fail_lead_log()");
  await client.query("SET LOCAL ROLE authenticated");
  await client.query("SELECT set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: admin.id, email: admin.email, role: "authenticated" })]);
  await client.query("SAVEPOINT before_atomic_failure");
  let failedAsExpected = false;
  try {
    await client.query("SELECT public.update_lead_status($1, 'convertido', NULL)", [leadId]);
  } catch {
    failedAsExpected = true;
    await client.query("ROLLBACK TO SAVEPOINT before_atomic_failure");
  }
  assert(failedAsExpected, "Falha simulada do log não interrompeu a RPC.");
  assert((await client.query("SELECT status FROM public.leads WHERE id = $1", [leadId])).rows[0].status === "qualificado", "Mudança de status não foi revertida com a falha do log.");

  await client.query("RESET ROLE");
  await client.query("DROP TRIGGER fail_lead_log ON public.activity_logs");

  const artifactPath = `${leadId}/atomic-delete-test.pdf`;
  const { rows: artifacts } = await client.query(`
    INSERT INTO public.lead_artifacts (
      lead_id, tipo, estado, nome, storage_bucket, storage_path, mime_type, size_bytes
    ) VALUES (
      $1, 'upload', 'ready', 'atomic-delete-test.pdf', 'lead-files', $2, 'application/pdf', 128
    ) RETURNING id
  `, [leadId, artifactPath]);
  await client.query("SET LOCAL ROLE authenticated");
  await client.query("SELECT set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: admin.id, email: admin.email, role: "authenticated" })]);
  const deletedArtifact = (await client.query(
    "SELECT * FROM public.delete_lead_artifact($1, FALSE)",
    [artifacts[0].id]
  )).rows[0];
  assert(deletedArtifact?.path === artifactPath, "RPC não retornou o objeto removido.");
  assert(Number((await client.query("SELECT count(*) AS total FROM public.lead_artifacts WHERE id = $1", [artifacts[0].id])).rows[0].total) === 0, "RPC não removeu o vínculo do arquivo.");
  assert(Number((await client.query("SELECT count(*) AS total FROM public.lead_storage_cleanup WHERE path = $1", [artifactPath])).rows[0].total) === 0, "Authenticated acessou a fila interna de Storage.");

  await client.query("RESET ROLE");
  assert(Number((await client.query("SELECT count(*) AS total FROM public.lead_storage_cleanup WHERE path = $1", [artifactPath])).rows[0].total) === 1, "RPC não enfileirou a remoção durável do objeto.");
  const { rows: expiredLeads } = await client.query(`
    INSERT INTO public.leads (
      nome, email, telefone, segmento, mensagem, canal, criado_em, atualizado_em
    ) VALUES (
      'Retenção teste', 'retention-test@example.invalid', '11900000000',
      'nao_definido', 'Nota com PII sintética', 'manual', NOW() - INTERVAL '25 months', NOW() - INTERVAL '25 months'
    ) RETURNING id
  `);
  const expiredId = expiredLeads[0].id;
  // Atualizações técnicas recentes não adiam a retenção por interação (migration 032).
  await client.query("UPDATE public.leads SET submission_id=gen_random_uuid(), submission_payload_hash=repeat('a',64), utm='{\"campaign\":\"synthetic\"}'::jsonb, landing_page='/synthetic', resumo_status='Synthetic context', sheet_sync_error='Synthetic error', origem_legado='synthetic:retention' WHERE id=$1", [expiredId]);
  await client.query(`
    INSERT INTO public.activity_logs (user_id, user_name, action, entity_type, entity_id, entity_name, details)
    VALUES ($1, 'Admin', 'Nota de retenção', 'lead', $2, 'Nome sintético', '{"nota":"PII sintética"}'::jsonb)
  `, [admin.id, expiredId]);
  await client.query(`
    INSERT INTO public.orcamentos (
      numero, slug, cliente_nome, cliente_email, cliente_telefone, obra_endereco, obra_cidade,
      projeto_area_m2, projeto_padrao, valor_min, valor_max, valor_m2_min, valor_m2_max,
      pdf_url, pdf_storage_path, pdf_generated_at, pdf_revision_hash, lead_id
    ) VALUES (
      'TEST-RETENTION', 'test-retention', 'Cliente sintético', 'retention-test@example.invalid', '11900000000',
      'Rua teste', 'São Paulo', 100, 'alto', 1, 2, 1, 2, 'https://example.invalid/test.pdf',
      'retention/test.pdf', NOW(), repeat('b',64), $1
    )
  `, [expiredId]);
  await client.query(`
    INSERT INTO public.proposals (
      proposal_number, client_name, client_email, client_phone, client_address, project_type,
      project_description, notes, internal_notes, lead_id
    ) VALUES (
      'TEST-RETENTION', 'Cliente sintético', 'retention-test@example.invalid', '11900000000',
      'Rua teste', 'residencial', 'Descrição sintética', 'Nota sintética', 'Nota interna sintética', $1
    )
  `, [expiredId]);
  await client.query(`
    INSERT INTO public.lead_artifacts (
      lead_id, tipo, estado, nome, storage_bucket, storage_path, mime_type, size_bytes
    ) VALUES (
      $1, 'upload', 'ready', 'teste.pdf', 'lead-files', $2, 'application/pdf', 128
    )
  `, [expiredId, `${expiredId}/teste.pdf`]);

  await client.query("SET LOCAL ROLE service_role");
  assert(Number((await client.query("SELECT count(*) AS total FROM public.leads WHERE id = $1", [leadId])).rows[0].total) === 1, "Service role não acessou lead.");
  const candidates = await client.query("SELECT * FROM public.get_lead_retention_candidates() WHERE lead_id = $1", [expiredId]);
  assert(candidates.rows[0]?.pdf_paths?.includes("retention/test.pdf"), "Candidato de retenção não incluiu o PDF vinculado.");
  const retentionResult = await client.query("SELECT public.anonymize_expired_lead($1) AS pdf_paths", [expiredId]);
  assert(retentionResult.rows[0]?.pdf_paths?.includes("retention/test.pdf"), "Anonimização não devolveu o PDF para limpeza segura.");
  const anonymized = (await client.query("SELECT nome,email,telefone,mensagem,anonimizado_em,retencao_storage_pendente,submission_id,submission_payload_hash,utm,landing_page,resumo_status,sheet_sync_error,origem_legado FROM public.leads WHERE id = $1", [expiredId])).rows[0];
  assert(anonymized.nome === "Lead anonimizado" && !anonymized.email && !anonymized.telefone && !anonymized.mensagem && anonymized.anonimizado_em, "Lead não foi anonimizado integralmente.");
  assert(!anonymized.submission_id && !anonymized.submission_payload_hash && !anonymized.landing_page && !anonymized.resumo_status && !anonymized.sheet_sync_error && Object.keys(anonymized.utm).length === 0 && anonymized.origem_legado === "synthetic:retention", "Anonimização perdeu o contrato LGPD ou reteve identificadores novos.");
  assert(anonymized.retencao_storage_pendente.includes("retention/test.pdf"), "PDF pendente não ficou retryável após anonimização.");
  const anonymizedBudget = (await client.query("SELECT cliente_nome,cliente_email,cliente_telefone,pdf_url,pdf_storage_path,pdf_generated_at,pdf_revision_hash FROM public.orcamentos WHERE lead_id = $1", [expiredId])).rows[0];
  assert(anonymizedBudget.cliente_nome === "Cliente anonimizado" && !anonymizedBudget.cliente_email && !anonymizedBudget.cliente_telefone && !anonymizedBudget.pdf_url && !anonymizedBudget.pdf_storage_path && !anonymizedBudget.pdf_generated_at && !anonymizedBudget.pdf_revision_hash, "Orçamento vinculado não foi anonimizado.");
  const anonymizedProposal = (await client.query("SELECT client_name,client_email,client_phone,notes,internal_notes FROM public.proposals WHERE lead_id = $1", [expiredId])).rows[0];
  assert(anonymizedProposal.client_name === "Cliente anonimizado" && !anonymizedProposal.client_email && !anonymizedProposal.client_phone && !anonymizedProposal.notes && !anonymizedProposal.internal_notes, "Proposta vinculada não foi anonimizada.");
  const anonymizedLog = (await client.query("SELECT details FROM public.activity_logs WHERE entity_type = 'lead' AND entity_id = $1 ORDER BY created_at DESC LIMIT 1", [expiredId])).rows[0];
  assert(anonymizedLog.details?.tipo === "anonimizado_por_retencao", "Log vinculado não foi limpo.");
  const artifactCleanup = (await client.query("SELECT bucket,path FROM public.lead_storage_cleanup WHERE lead_id = $1", [expiredId])).rows[0];
  assert(artifactCleanup?.bucket === "lead-files" && artifactCleanup.path === `${expiredId}/teste.pdf`, "Anexo privado não entrou na fila durável de remoção.");
  assert(Number((await client.query("SELECT count(*) AS total FROM public.lead_artifacts WHERE lead_id = $1", [expiredId])).rows[0].total) === 0, "Vínculo de arquivo sobreviveu à anonimização.");
  const pendingCandidate = await client.query("SELECT * FROM public.get_lead_retention_candidates() WHERE lead_id = $1", [expiredId]);
  assert(pendingCandidate.rows[0]?.requires_anonymization === false, "Cleanup pendente tentou anonimizar novamente o lead.");
  await client.query("SELECT public.complete_lead_storage_cleanup($1)", [expiredId]);
  assert((await client.query("SELECT cardinality(retencao_storage_pendente) AS total FROM public.leads WHERE id = $1", [expiredId])).rows[0].total === 0, "Cleanup concluído não limpou a fila de Storage.");

  await client.query("RESET ROLE");
  const requestedId = (await client.query("INSERT INTO public.leads(nome,email,segmento,canal,submission_id,submission_payload_hash) VALUES ('Pedido sintetico','request@example.invalid','nao_definido','manual',gen_random_uuid(),repeat('c',64)) RETURNING id")).rows[0].id;
  await client.query("SET LOCAL ROLE authenticated");
  await client.query("SELECT set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: admin.id, email: admin.email, role: "authenticated" })]);
  await client.query("SELECT public.anonymize_lead_on_request($1, 'Pedido sintetico do titular')", [requestedId]);
  const requestedLead = (await client.query("SELECT submission_id,submission_payload_hash,anonimizado_em FROM public.leads WHERE id=$1", [requestedId])).rows[0];
  assert(requestedLead.anonimizado_em && !requestedLead.submission_id && !requestedLead.submission_payload_hash, "Pedido do titular reteve identificadores novos.");
  await client.query("RESET ROLE");
  await client.query("SET LOCAL ROLE service_role");
  const outbox = (await client.query("SELECT payload FROM public.lead_notification_outbox WHERE lead_id = $1 AND tipo = 'novo_lead'", [leadId])).rows[0];
  assert(outbox && !outbox.payload.nome && !outbox.payload.email && !outbox.payload.telefone && !outbox.payload.leadId && !outbox.payload.lead_id && !JSON.stringify(outbox.payload).includes(leadId), "Outbox push contém PII ou identificador proibido no payload.");

  await client.query("RESET ROLE");
  await client.query("ROLLBACK");
  console.log("leads CRM: RLS, atomicidade e retenção verificadas em transação revertida");
} catch (error) {
  await client.query("ROLLBACK").catch(() => undefined);
  console.error(error instanceof Error ? error.message : "Falha desconhecida");
  process.exitCode = 1;
} finally {
  await client.end();
}
