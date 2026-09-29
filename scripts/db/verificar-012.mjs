// Verificação transacional das migrations 012–030 em produção.
// Toda escrita fica dentro de BEGIN/ROLLBACK; nenhuma pauta é persistida.
import { existsSync, readFileSync } from "node:fs";
import pg from "pg";

if (existsSync(".env.local")) {
  for (const linha of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const m = linha.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
    if (m && !process.env[m[1]])
      process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL ausente");

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.SUPABASE_CA_CERT
    ? { rejectUnauthorized: true, ca: readFileSync(process.env.SUPABASE_CA_CERT, "utf8") }
    : { rejectUnauthorized: true },
});
let falhas = 0;
function checar(nome, condicao, detalhe = "") {
  if (!condicao) falhas++;
  console.log(`  ${condicao ? "PASSOU" : "FALHOU  <<<<"}  ${nome}${detalhe ? ` — ${detalhe}` : ""}`);
}

await client.connect();

// Contratos novos isolados dos dados/contagens históricas do verificador 012.
// Executar somente em banco de validação já migrado; tudo reverte no finally.
if (process.argv.includes("--admin-reliability")) {
  try {
    await client.query("BEGIN");
    const { rows: [owner] } = await client.query("SELECT user_id,email FROM public.lead_responsaveis WHERE role='owner' AND ativo AND user_id IS NOT NULL LIMIT 1");
    if (!owner) throw new Error("Owner ativo necessário para validar as RPCs com identidade real.");
    const { rows: [post] } = await client.query(`
      INSERT INTO public.posts(title,slug,excerpt,content,status,published_at,cover_image)
      VALUES('Teste ADMIN','admin-test-' || gen_random_uuid()::text,'Teste','Conteúdo original','published','2025-01-10T12:00:00Z','/original.webp')
      RETURNING id,slug,updated_at::text,published_at::text
    `);
    await client.query("SET LOCAL ROLE authenticated");
    await client.query("SELECT set_config('request.jwt.claims',$1,true)", [JSON.stringify({sub:owner.user_id,email:owner.email,role:"authenticated"})]);
    const payload = JSON.stringify({title:"Revisão confirmada",slug:post.slug,content:"Conteúdo revisado",cover_image:null});
    const { rows: [saved] } = await client.query("SELECT public.salvar_revisao_post_admin($1,$2::jsonb,$3,NULL) AS result", [post.id,payload,post.updated_at]);
    const current = (await client.query("SELECT content,published_at::text FROM public.posts WHERE id=$1",[post.id])).rows[0];
    checar("salvar revisão preserva conteúdo live e data", current.content === "Conteúdo original" && current.published_at === post.published_at);
    async function expectFailure(name, sql, args) {
      await client.query("SAVEPOINT expected_error");
      let rejected = false;
      try { await client.query(sql,args); }
      catch { rejected = true; await client.query("ROLLBACK TO SAVEPOINT expected_error"); }
      await client.query("RELEASE SAVEPOINT expected_error");
      checar(name,rejected);
    }
    await expectFailure("segunda sessão sem pauta conhecida não sobrescreve revisão", "SELECT public.salvar_revisao_post_admin($1,$2::jsonb,$3,NULL)", [post.id,payload,post.updated_at]);
    await expectFailure("publicação rejeita revisão obsoleta", "SELECT public.publicar_revisao_post_admin($1,$2,'2000-01-01')", [post.id,post.updated_at]);
    await expectFailure("staging rejeita status dentro do payload", "SELECT public.salvar_revisao_post_admin($1,$2::jsonb,$3,$4)", [post.id,JSON.stringify({title:"Teste",slug:post.slug,status:"published"}),post.updated_at,saved.result.atualizado_em]);
    await client.query("SELECT public.publicar_revisao_post_admin($1,$2,$3)",[post.id,post.updated_at,saved.result.atualizado_em]);
    const published = (await client.query("SELECT content,published_at::text,cover_image FROM public.posts WHERE id=$1",[post.id])).rows[0];
    checar("publicação aplica payload e mantém data original",published.content === "Conteúdo revisado" && published.published_at === post.published_at);
    checar("remoção explícita de capa é aplicada",published.cover_image === null);
    const pauta = (await client.query("SELECT post_draft_payload,status_blog FROM public.conteudo_pautas WHERE post_id=$1",[post.id])).rows[0];
    checar("publicação limpa staging",pauta.post_draft_payload === null && pauta.status_blog === "publicado");
    const stats = (await client.query("SELECT public.get_dashboard_stats() AS data")).rows[0].data;
    checar("dashboard retorna métricas do fluxo existente",typeof stats.budgets.total === "number" && typeof stats.documents === "number");
    await client.query("SELECT set_config('request.jwt.claims',$1,true)",[JSON.stringify({sub:"00000000-0000-0000-0000-000000000001",role:"authenticated"})]);
    await expectFailure("usuário sem membership não lê agregado", "SELECT public.get_dashboard_stats()", []);
    await expectFailure("usuário sem membership não publica via definer", "SELECT public.publicar_revisao_post_admin($1,$2,$3)", [post.id,post.updated_at,saved.result.atualizado_em]);
    await client.query("RESET ROLE");
    const grants = (await client.query("SELECT has_function_privilege('anon','public.get_dashboard_stats()','EXECUTE') AS stats,has_function_privilege('anon','public.publicar_revisao_post_admin(uuid,timestamptz,timestamptz)','EXECUTE') AS publish")).rows[0];
    checar("anon não executa RPCs administrativas",!grants.stats && !grants.publish);
  } finally {
    await client.query("ROLLBACK").catch(() => {});
    await client.end();
  }
  process.exit(falhas === 0 ? 0 : 1);
}
if (process.argv.includes("--dry-run-013")) {
  try {
    const migrationUrl = new URL("../../supabase/migrations/013_remover_colunas_legadas_conteudo.sql", import.meta.url);
    const sql = readFileSync(migrationUrl, "utf8").replace(/COMMIT;\s*$/, "ROLLBACK;");
    await client.query(sql);
    const { rows: legado } = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'conteudo_pautas'
        AND column_name IN ('coluna', 'ordem')
      ORDER BY column_name
    `);
    checar("migration 013 executa e reverte", legado.map((r) => r.column_name).join(",") === "coluna,ordem");
  } finally {
    await client.end();
  }
  console.log(falhas === 0 ? "\o dry-run 013 verificado" : `\nL ${falhas} falha(s)`);
  process.exit(falhas === 0 ? 0 : 1);
}

try {
  const { rows: legado } = await client.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'conteudo_pautas'
      AND column_name IN ('coluna', 'ordem')
  `);
  console.log("\nSCHEMA");
  checar("colunas legadas removidas", legado.length === 0, legado.map((r) => r.column_name).join(", "));

  const { rows } = await client.query(`
    SELECT
      count(*)::int AS total,
      count(*) FILTER (WHERE status_blog IS NOT NULL)::int AS blog,
      count(*) FILTER (WHERE status_blog IS NULL)::int AS sem_blog,
      count(*) FILTER (WHERE status_linkedin IS NOT NULL)::int AS linkedin,
      count(*) FILTER (WHERE plataformas = ARRAY['blog','linkedin']::text[])::int AS ambas,
      count(*) FILTER (WHERE plataformas = ARRAY['linkedin']::text[])::int AS so_linkedin
    FROM conteudo_pautas
  `);
  const contagem = rows[0];
  console.log("\nBACKFILL");
  checar("66 pautas preservadas", contagem.total === 66, String(contagem.total));
  checar("44 trilhas Blog", contagem.blog === 44, String(contagem.blog));
  checar("22 sem Blog", contagem.sem_blog === 22, String(contagem.sem_blog));
  checar("66 trilhas LinkedIn", contagem.linkedin === 66, String(contagem.linkedin));
  checar("distribuição 44/22", contagem.ambas === 44 && contagem.so_linkedin === 22);

  const { rows: [icms] } = await client.query(`
    SELECT post_id, status_blog, status_linkedin, linkedin_texto,
           linkedin_imagem_prompt, linkedin_imagem_briefing
    FROM conteudo_pautas
    WHERE id = '63542e4b-8d91-4aba-8f42-2b0c872bd081'
  `);
  console.log("\nICMS");
  checar("post vinculado", icms.post_id === "27287d63-3804-46c7-9997-94aaff524416");
  checar("Blog publicado", icms.status_blog === "publicado");
  checar("LinkedIn em produção", icms.status_linkedin === "producao");
  checar("legado copiado", Boolean(icms.linkedin_texto && icms.linkedin_imagem_prompt && icms.linkedin_imagem_briefing));

  await client.query("BEGIN");
  const { rows: [alvo] } = await client.query(`
    SELECT id, status_blog, ordem_blog, status_linkedin, ordem_linkedin
    FROM conteudo_pautas
    WHERE status_blog = 'planejada' AND status_linkedin = 'planejada'
    ORDER BY ordem_blog LIMIT 1
  `);

  console.log("\nCONSTRAINTS E RPC");
  await client.query("SAVEPOINT constraint_status");
  let constraintFalhou = false;
  try {
    await client.query("UPDATE conteudo_pautas SET status_blog = NULL WHERE id = $1", [alvo.id]);
  } catch {
    constraintFalhou = true;
    await client.query("ROLLBACK TO SAVEPOINT constraint_status");
  }
  checar("status NULL é recusado quando Blog se aplica", constraintFalhou);

  await client.query("SAVEPOINT rpc_atomica");
  let rpcFalhou = false;
  try {
    await client.query(
      "SELECT mover_pautas_conteudo('blog', $1::jsonb, 'teste-rollback')",
      [JSON.stringify([
        { id: alvo.id, status: "pesquisa", ordem: 999 },
        { id: "00000000-0000-0000-0000-000000000000", status: "pesquisa", ordem: 1 },
      ])]
    );
  } catch {
    rpcFalhou = true;
    await client.query("ROLLBACK TO SAVEPOINT rpc_atomica");
  }
  const { rows: [depoisErro] } = await client.query(
    "SELECT status_blog, ordem_blog FROM conteudo_pautas WHERE id = $1",
    [alvo.id]
  );
  checar("RPC rejeita item inválido", rpcFalhou);
  checar(
    "erro intermediário não altera nenhuma linha",
    depoisErro.status_blog === alvo.status_blog && depoisErro.ordem_blog === alvo.ordem_blog
  );

  await client.query(
    "SELECT mover_pautas_conteudo('linkedin', $1::jsonb, 'teste-independencia')",
    [JSON.stringify([{ id: alvo.id, status: "producao", ordem: 999 }])]
  );
  const { rows: [independente] } = await client.query(
    "SELECT status_blog, ordem_blog, status_linkedin FROM conteudo_pautas WHERE id = $1",
    [alvo.id]
  );
  checar("ordens independentes por canal", independente.status_blog === alvo.status_blog && independente.ordem_blog === alvo.ordem_blog && independente.status_linkedin === "producao");

  console.log("\nSTATUS LIVRE E PUBLICAÇÃO REAL");
  const { rows: postsAntes } = await client.query(
    "SELECT status, count(*)::int AS total FROM posts GROUP BY status ORDER BY status"
  );
  await client.query(
    "SELECT mover_pautas_conteudo('blog', $1::jsonb, 'teste-status-livre')",
    [JSON.stringify([{ id: alvo.id, status: "publicado", ordem: 1001 }])]
  );
  await client.query(
    "SELECT mover_pautas_conteudo('linkedin', $1::jsonb, 'teste-status-livre')",
    [JSON.stringify([{ id: alvo.id, status: "publicado", ordem: 1001 }])]
  );
  const { rows: [livre] } = await client.query(
    "SELECT status_blog,status_linkedin,linkedin_url,linkedin_publicado_em FROM conteudo_pautas WHERE id=$1",
    [alvo.id]
  );
  const { rows: postsDepois } = await client.query(
    "SELECT status, count(*)::int AS total FROM posts GROUP BY status ORDER BY status"
  );
  checar("Blog aceita Publicado com gaps", livre.status_blog === "publicado");
  checar("LinkedIn aceita Publicado sem URL/data",
    livre.status_linkedin === "publicado" && !livre.linkedin_url && !livre.linkedin_publicado_em);
  checar("mover status não altera posts", JSON.stringify(postsAntes) === JSON.stringify(postsDepois));

  console.log("\nTAGS, FILA E LEADS");
  const { rows: [tagCount] } = await client.query("SELECT count(*)::int AS total FROM conteudo_tags");
  checar("11 domínios canônicos semeados", tagCount.total === 11, String(tagCount.total));
  await client.query("SELECT atualizar_tags_pauta($1, $2::text[])", [
    alvo.id, ["domain/lsf", "domain/steel-frame"],
  ]);
  const { rows: [pautaTags] } = await client.query(
    "SELECT count(*)::int AS total FROM conteudo_pauta_tags WHERE pauta_id=$1", [alvo.id]
  );
  checar("tags normalizadas atualizam atomicamente", pautaTags.total === 2);

  const { rows: [versao] } = await client.query(
    "SELECT atualizado_em FROM conteudo_pautas WHERE id=$1", [alvo.id]
  );
  const { rows: [job] } = await client.query(
    "INSERT INTO conteudo_automation_jobs(pauta_id,acao,esperado_atualizado_em) VALUES($1,'revisar',$2) RETURNING id",
    [alvo.id, versao.atualizado_em]
  );
  const { rows: claimed } = await client.query(
    "SELECT id,status,run_id FROM claim_conteudo_automation_job('teste-worker',60)"
  );
  checar("claim reserva um job", claimed.length === 1 && claimed[0].id === job.id);
  const { rows: secondClaim } = await client.query(
    "SELECT id FROM claim_conteudo_automation_job('outro-worker',60)"
  );
  checar("claim concorrente não duplica reserva", secondClaim.length === 0);
  await client.query("SAVEPOINT job_fencing");
  let runObsoletoRecusado = false;
  try {
    await client.query(
      "SELECT finalizar_conteudo_automation_job($1,'teste-worker','00000000-0000-0000-0000-000000000001','concluido','{}',10,5,0.01,NULL)",
      [job.id]
    );
  } catch {
    runObsoletoRecusado = true;
    await client.query("ROLLBACK TO SAVEPOINT job_fencing");
  }
  checar("run_id obsoleto não finaliza tentativa ativa", runObsoletoRecusado);

  await client.query(
    "SELECT finalizar_conteudo_automation_job($1,'teste-worker',$2,'concluido','{}',10,5,0.01,NULL)",
    [job.id, claimed[0].run_id]
  );

  const { rows: [staleJob] } = await client.query(
    "INSERT INTO conteudo_automation_jobs(pauta_id,acao,esperado_atualizado_em) VALUES($1,'pesquisar',$2) RETURNING id",
    [alvo.id, new Date(0)]
  );
  await client.query("SELECT id FROM claim_conteudo_automation_job('teste-worker',60)");
  const { rows: [stale] } = await client.query(
    "SELECT status FROM conteudo_automation_jobs WHERE id=$1", [staleJob.id]
  );
  checar("job obsoleto é recusado antes do claim", stale.status === "falhou");

  const { rows: [lead] } = await client.query(
    "INSERT INTO leads(nome,telefone,segmento,mensagem) VALUES('Teste','11999999999','residencial','Teste transacional') RETURNING id"
  );
  await client.query("UPDATE leads SET status='qualificado' WHERE id=$1", [lead.id]);
  const { rows: [leadAtualizado] } = await client.query(
    "SELECT status,atualizado_em FROM leads WHERE id=$1", [lead.id]
  );
  checar("lead qualificado atualiza sem quebrar trigger", leadAtualizado.status === "qualificado");

  const { rows: anonPolicies } = await client.query(`
    SELECT tablename FROM pg_policies
    WHERE schemaname='public' AND tablename IN
      ('leads','conteudo_tags','conteudo_pauta_tags','conteudo_automation_jobs')
      AND 'anon'=ANY(roles)
  `);
  checar("nenhuma tabela nova exposta a anon", anonPolicies.length === 0);

  console.log("\nHARDENING 021–023");
  const { rows: [quadro] } = await client.query(`
    SELECT
      count(*)::int AS total,
      bool_and(tem_pesquisa IS NOT NULL)::boolean AS resumos_validos
    FROM conteudo_pautas_quadro
  `);
  checar("view leve preserva as 66 pautas", quadro.total === 66 && quadro.resumos_validos);
  const { rows: colunasPesadas } = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_schema='public' AND table_name='conteudo_pautas_quadro'
      AND column_name IN ('pesquisa_conteudo','linkedin_texto','insights')
  `);
  checar("view do quadro não expõe blocos pesados", colunasPesadas.length === 0);

  await client.query("SELECT set_config('request.jwt.claim.sub', gen_random_uuid()::text, true)");
  await client.query("SELECT set_config('request.jwt.claim.role', 'authenticated', true)");
  const { rows: [antesMetadados] } = await client.query(
    "SELECT titulo FROM conteudo_pautas WHERE id=$1", [alvo.id]
  );
  await client.query("SAVEPOINT metadados_tags");
  let metadadosFalharam = false;
  try {
    await client.query(
      "SELECT atualizar_pauta_metadados($1,$2::jsonb,$3::text[])",
      [alvo.id, JSON.stringify({ titulo: "Título que deve reverter" }), ["domain/inexistente"]]
    );
  } catch {
    metadadosFalharam = true;
    await client.query("ROLLBACK TO SAVEPOINT metadados_tags");
  }
  const { rows: [depoisMetadados] } = await client.query(
    "SELECT titulo FROM conteudo_pautas WHERE id=$1", [alvo.id]
  );
  checar("metadados e tags revertem juntos", metadadosFalharam && depoisMetadados.titulo === antesMetadados.titulo);

  const { rows: [tarefa] } = await client.query(
    "INSERT INTO analytics_tasks(title,priority,sort_order) VALUES('Teste reorder 021','p1',21) RETURNING id,priority,sort_order"
  );
  await client.query("SAVEPOINT reorder_analytics");
  let reorderFalhou = false;
  try {
    await client.query(
      "SELECT reordenar_analytics_tasks($1::jsonb)",
      [JSON.stringify([
        { id: tarefa.id, priority: "p0", sort_order: 1 },
        { id: "00000000-0000-0000-0000-000000000000", priority: "p2", sort_order: 2 },
      ])]
    );
  } catch {
    reorderFalhou = true;
    await client.query("ROLLBACK TO SAVEPOINT reorder_analytics");
  }
  const { rows: [tarefaDepois] } = await client.query(
    "SELECT priority,sort_order FROM analytics_tasks WHERE id=$1", [tarefa.id]
  );
  checar("reorder de analytics é transacional", reorderFalhou && tarefaDepois.priority === "p1" && tarefaDepois.sort_order === 21);

  await client.query("SELECT set_config('request.jwt.claim.role', 'service_role', true)");
  const { rows: heartbeat } = await client.query(
    "SELECT worker_id FROM registrar_conteudo_worker_heartbeat('verificador-023','teste',$1::jsonb)",
    [JSON.stringify({ dry_run: true })]
  );
  checar("worker registra heartbeat", heartbeat[0]?.worker_id === "verificador-023");

  await client.query("SAVEPOINT snapshot_constraint");
  let snapshotRecusado = false;
  try {
    await client.query(
      `INSERT INTO conteudo_performance_snapshots
       (pauta_id,janela_inicio,janela_fim,sessoes,sessoes_engajadas)
       VALUES($1,CURRENT_DATE - 27,CURRENT_DATE,1,2)`,
      [alvo.id]
    );
  } catch {
    snapshotRecusado = true;
    await client.query("ROLLBACK TO SAVEPOINT snapshot_constraint");
  }
  checar("snapshot recusa engajadas acima de sessões", snapshotRecusado);

  const { rows: [integracoes] } = await client.query(
    "SELECT label FROM conteudo_tags WHERE slug='domain/integrations'"
  );
  checar("rótulo de integrações está em UTF-8", integracoes.label === "Integrações", integracoes.label);

  console.log("\nREVISÃO SEGURA DE POST PUBLICADO — 030");
  const { rows: [publicadoAntes] } = await client.query(`
    SELECT p.id, p.title, p.status
    FROM conteudo_pautas cp
    JOIN posts p ON p.id = cp.post_id
    WHERE cp.id = '63542e4b-8d91-4aba-8f42-2b0c872bd081'
  `);
  await client.query(`
    UPDATE conteudo_pautas
    SET status_blog='aprovado',
        post_draft_payload=jsonb_build_object(
          'title', 'Título staged 030',
          'slug', 'isencao-icms-energia-solar-sp',
          'excerpt', 'Teste transacional',
          'content', 'Conteúdo de teste',
          'cover_image', '/images/img_blog/isencao-icms-energia-solar-sp/cover.webp'
        )
    WHERE id='63542e4b-8d91-4aba-8f42-2b0c872bd081'
  `);
  const { rows: [duranteStage] } = await client.query(
    "SELECT title,status FROM posts WHERE id=$1", [publicadoAntes.id]
  );
  checar(
    "staging não retira nem altera o artigo live",
    duranteStage.status === "published" && duranteStage.title === publicadoAntes.title
  );
  await client.query(
    "SELECT publicar_artigo_pauta($1,$2)",
    ["63542e4b-8d91-4aba-8f42-2b0c872bd081", "Berkahn-Vault/40-content/blog/publicados/isencao-icms-energia-solar-sp.md"]
  );
  const { rows: [depoisPublicar] } = await client.query(`
    SELECT p.title,p.status,cp.post_draft_payload
    FROM conteudo_pautas cp JOIN posts p ON p.id=cp.post_id
    WHERE cp.id='63542e4b-8d91-4aba-8f42-2b0c872bd081'
  `);
  checar(
    "aprovação aplica revisão e limpa staging atomicamente",
    depoisPublicar.status === "published" &&
      depoisPublicar.title === "Título staged 030" &&
      depoisPublicar.post_draft_payload === null
  );

  await client.query("ROLLBACK");
} finally {
  await client.query("ROLLBACK").catch(() => {});
  await client.end();
}

console.log(falhas === 0 ? "\n✅ schema 012–030 verificado" : `\n❌ ${falhas} falha(s)`);
process.exit(falhas === 0 ? 0 : 1);
