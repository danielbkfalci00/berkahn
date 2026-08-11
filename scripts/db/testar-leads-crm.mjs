import process from "node:process";
import pg from "pg";

const { Client } = pg;
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL ausente.");
const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

await client.connect();
try {
  await client.query("BEGIN");
  const { rows: admins } = await client.query("SELECT id, email FROM auth.users WHERE lower(email) = 'contato.berkahn@gmail.com' LIMIT 1");
  assert(admins[0], "Usuário administrador canônico não encontrado.");
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
  await client.query(`
    INSERT INTO public.activity_logs (user_id, user_name, action, entity_type, entity_id, entity_name, details)
    VALUES ($1, 'Admin', 'Nota de retenção', 'lead', $2, 'Nome sintético', '{"nota":"PII sintética"}'::jsonb)
  `, [admin.id, expiredId]);
  await client.query(`
    INSERT INTO public.orcamentos (
      numero, slug, cliente_nome, cliente_email, cliente_telefone, obra_endereco, obra_cidade,
      projeto_area_m2, projeto_padrao, valor_min, valor_max, valor_m2_min, valor_m2_max,
      pdf_url, pdf_storage_path, lead_id
    ) VALUES (
      'TEST-RETENTION', 'test-retention', 'Cliente sintético', 'retention-test@example.invalid', '11900000000',
      'Rua teste', 'São Paulo', 100, 'alto', 1, 2, 1, 2, 'https://example.invalid/test.pdf',
      'retention/test.pdf', $1
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
  const anonymized = (await client.query("SELECT nome,email,telefone,mensagem,anonimizado_em,retencao_storage_pendente FROM public.leads WHERE id = $1", [expiredId])).rows[0];
  assert(anonymized.nome === "Lead anonimizado" && !anonymized.email && !anonymized.telefone && !anonymized.mensagem && anonymized.anonimizado_em, "Lead não foi anonimizado integralmente.");
  assert(anonymized.retencao_storage_pendente.includes("retention/test.pdf"), "PDF pendente não ficou retryável após anonimização.");
  const anonymizedBudget = (await client.query("SELECT cliente_nome,cliente_email,cliente_telefone,pdf_url,pdf_storage_path FROM public.orcamentos WHERE lead_id = $1", [expiredId])).rows[0];
  assert(anonymizedBudget.cliente_nome === "Cliente anonimizado" && !anonymizedBudget.cliente_email && !anonymizedBudget.cliente_telefone && !anonymizedBudget.pdf_url && !anonymizedBudget.pdf_storage_path, "Orçamento vinculado não foi anonimizado.");
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
