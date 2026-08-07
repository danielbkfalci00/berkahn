// Verificação transacional da migration 012 em produção.
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

  await client.query("ROLLBACK");
} finally {
  await client.query("ROLLBACK").catch(() => {});
  await client.end();
}

console.log(falhas === 0 ? "\n✅ schema 012/013 verificado" : `\n❌ ${falhas} falha(s)`);
process.exit(falhas === 0 ? 0 : 1);
