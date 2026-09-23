// CLI do mural de feedback do admin (migration 034). Deixa o Claude ler as
// sugestões, responder e marcar o que implementou, sem abrir o navegador.
//
//   node scripts/admin/feedback.mjs listar [--status=aberto|implementado|todos] [--json]
//   node scripts/admin/feedback.mjs ver <id> [--json]
//   node scripts/admin/feedback.mjs responder <id> --arquivo=<path> [--dry-run]
//   node scripts/admin/feedback.mjs status <id> implementado|aberto [--nota="PR #123"] [--dry-run]
//
// Usa service role: a RLS não se aplica e o trigger de autoria da 034 não roda
// (não há auth.uid()). Por isso a CLI grava autor_nome "Claude" e origem 'cli'
// explicitamente, e registra o activity_log ela mesma na mudança de status,
// porque a RPC set_feedback_status exige owner via auth.uid().
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

const ROOT = process.cwd();
const ENV = resolve(ROOT, ".env.local");
if (existsSync(ENV)) {
  for (const linha of readFileSync(ENV, "utf8").split(/\r?\n/)) {
    const match = linha.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
    }
  }
}

const URL_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const SERVICE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY)?.trim();

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const AUTOR = "Claude";
const CORPO_MAX = 5000;
const NOTA_MAX = 2000;
const ARQUIVO_MAX_BYTES = 64 * 1024;
const COLUNAS_ITEM =
  "id,titulo,categoria,status,pagina_origem,autor_nome,implementado_em,implementado_por," +
  "nota_implementacao,criado_em,atualizado_em";

function abortar(mensagem, codigo = 1) {
  console.error(`\n❌ ${mensagem}`);
  process.exit(codigo);
}

function parseArgs(argv) {
  const posicionais = [];
  const flags = {};
  for (const arg of argv) {
    const m = arg.match(/^--([a-z-]+)(?:=(.*))?$/);
    if (m) flags[m[1]] = m[2] ?? true;
    else posicionais.push(arg);
  }
  return { posicionais, flags };
}

function garantirId(id) {
  if (!UUID.test(id ?? "")) abortar("id inválido, use o UUID do feedback (veja `listar`)");
}

// Mesma detecção de types/feedback.ts (isTabelaAusente). Antes da 034 o
// PostgREST responde PGRST205; o Postgres, 42P01.
function falhaDoBanco(error, contexto) {
  if (error.code === "PGRST205" || error.code === "42P01"
    || /could not find the table|relation .* does not exist/i.test(error.message ?? "")) {
    abortar(
      "a migration 034 (supabase/migrations/034_admin_feedback.sql) ainda não foi aplicada no banco. " +
      "Aplique no SQL Editor do Supabase e rode de novo.",
      2
    );
  }
  abortar(`${contexto}: ${error.message}`);
}

function conectar() {
  if (!URL_SUPABASE || !SERVICE_KEY) {
    abortar("defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY (ou SUPABASE_SERVICE_KEY) no .env.local");
  }
  return createClient(URL_SUPABASE, SERVICE_KEY, { auth: { persistSession: false } });
}

function quando(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

async function buscarItem(db, id) {
  const { data, error } = await db.from("feedback_itens").select(COLUNAS_ITEM).eq("id", id).maybeSingle();
  if (error) falhaDoBanco(error, "leitura do feedback");
  if (!data) abortar(`feedback ${id} não encontrado`);
  return data;
}

async function listar(db, flags) {
  const status = typeof flags.status === "string" ? flags.status : "aberto";
  if (!["aberto", "implementado", "todos"].includes(status)) abortar("--status aceita aberto, implementado ou todos");
  let query = db
    .from("feedback_itens")
    .select(`${COLUNAS_ITEM},feedback_mensagens(count)`)
    .order("atualizado_em", { ascending: false })
    .limit(200);
  if (status !== "todos") query = query.eq("status", status);
  const { data, error } = await query;
  if (error) falhaDoBanco(error, "listagem");

  const itens = (data ?? []).map(({ feedback_mensagens: contagem, ...item }) => ({
    ...item,
    mensagens: contagem?.[0]?.count ?? 0,
  }));
  if (flags.json) {
    console.log(JSON.stringify(itens, null, 2));
    return;
  }
  if (itens.length === 0) {
    console.log(`Nenhum feedback com status "${status}".`);
    return;
  }
  console.log(`${itens.length} feedback(s) · status: ${status}\n`);
  for (const i of itens) {
    console.log(`${i.id}  [${i.status}] [${i.categoria}]  ${i.titulo}`);
    console.log(`    ${i.autor_nome} · ${quando(i.atualizado_em)} · ${i.mensagens} msg${i.pagina_origem ? ` · ${i.pagina_origem}` : ""}`);
  }
}

async function ver(db, id, flags) {
  garantirId(id);
  const item = await buscarItem(db, id);
  const { data: mensagens, error } = await db
    .from("feedback_mensagens")
    .select("id,autor_nome,corpo,origem,criado_em")
    .eq("item_id", id)
    .order("criado_em", { ascending: true });
  if (error) falhaDoBanco(error, "leitura das mensagens");

  if (flags.json) {
    console.log(JSON.stringify({ ...item, mensagens }, null, 2));
    return;
  }
  console.log(`${item.titulo}`);
  console.log(`[${item.status}] [${item.categoria}] · ${item.autor_nome} · ${quando(item.criado_em)}`);
  if (item.pagina_origem) console.log(`Página: ${item.pagina_origem}`);
  if (item.status === "implementado") console.log(`Implementado ${quando(item.implementado_em)} por ${item.implementado_por ?? "?"}`);
  if (item.nota_implementacao) console.log(`Nota: ${item.nota_implementacao}`);
  console.log("");
  for (const m of mensagens ?? []) {
    console.log(`── ${m.autor_nome}${m.origem === "cli" ? " (via Claude)" : ""} · ${quando(m.criado_em)}`);
    console.log(m.corpo);
    console.log("");
  }
  if (!mensagens?.length) console.log("(sem mensagens)");
}

/** O texto vem sempre de arquivo: argv passa pelo shell e mutila acento e aspas. */
function lerCorpo(arquivo) {
  if (typeof arquivo !== "string" || !arquivo) abortar("--arquivo=<path> é obrigatório");
  const caminho = resolve(ROOT, arquivo);
  if (!existsSync(caminho)) abortar(`arquivo não encontrado: ${arquivo}`);
  if (statSync(caminho).size > ARQUIVO_MAX_BYTES) abortar("arquivo grande demais para uma mensagem");
  const corpo = readFileSync(caminho, "utf8").replace(/^﻿/, "").trim();
  if (!corpo) abortar("arquivo vazio");
  if (corpo.length > CORPO_MAX) abortar(`mensagem com ${corpo.length} caracteres; o limite é ${CORPO_MAX}`);
  return corpo;
}

async function responderCmd(db, id, flags) {
  garantirId(id);
  const corpo = lerCorpo(flags.arquivo);
  const item = await buscarItem(db, id);
  const linha = { item_id: id, corpo, autor_id: null, autor_nome: AUTOR, origem: "cli" };
  if (flags["dry-run"]) {
    console.log(`[dry-run] responderia em "${item.titulo}" como ${AUTOR} (origem cli):\n\n${corpo}`);
    return;
  }
  const { data, error } = await db.from("feedback_mensagens").insert(linha).select("id");
  if (error) falhaDoBanco(error, "gravação da resposta");
  if (!data?.length) abortar("nada foi gravado (zero linhas devolvidas)");
  console.log(`✅ resposta gravada em "${item.titulo}" (${data[0].id})`);
}

// activity_logs.user_id é NOT NULL e não há sessão na CLI. O responsável pela
// mudança é o owner ativo: a CLI age em nome dele, e user_name deixa claro que
// foi o Claude. O trigger bind_activity_log_author só sobrescreve com sessão.
async function ownerResponsavel(db) {
  const { data, error } = await db
    .from("lead_responsaveis")
    .select("user_id,nome")
    .eq("role", "owner")
    .eq("ativo", true)
    .not("user_id", "is", null)
    .order("criado_em", { ascending: true })
    .limit(1);
  if (error) abortar(`leitura do owner: ${error.message}`);
  if (!data?.length) abortar("nenhum owner ativo com conta vinculada em lead_responsaveis; o activity_log precisa de um user_id");
  return data[0];
}

async function statusCmd(db, id, novo, flags) {
  garantirId(id);
  if (!["implementado", "aberto"].includes(novo)) abortar("status aceita implementado ou aberto");
  const nota = typeof flags.nota === "string" ? flags.nota.trim().slice(0, NOTA_MAX) || null : null;
  const item = await buscarItem(db, id);
  const owner = await ownerResponsavel(db);
  const agora = new Date().toISOString();
  const update = {
    status: novo,
    implementado_em: novo === "implementado" ? agora : null,
    implementado_por: novo === "implementado" ? `${AUTOR} (CLI)` : null,
    // Mesmo comportamento da RPC: sem nota nova, a anterior fica.
    ...(nota ? { nota_implementacao: nota } : {}),
  };

  if (flags["dry-run"]) {
    console.log(`[dry-run] "${item.titulo}": ${item.status} → ${novo}${nota ? ` · nota: ${nota}` : ""}`);
    console.log(`[dry-run] activity_log em nome de ${owner.nome} (user_name "${AUTOR} (CLI)")`);
    return;
  }

  const { data, error } = await db.from("feedback_itens").update(update).eq("id", id).select("id,status");
  if (error) falhaDoBanco(error, "mudança de status");
  if (!data?.length) abortar("nada foi gravado (zero linhas devolvidas)");

  const { error: erroLog } = await db.from("activity_logs").insert({
    user_id: owner.user_id,
    user_name: `${AUTOR} (CLI)`,
    action: "update",
    entity_type: "feedback",
    entity_id: id,
    entity_name: item.titulo,
    details: { tipo: "status", status: novo, nota, origem: "cli" },
  });
  // O status já mudou; sem transação no PostgREST, o melhor é avisar alto.
  if (erroLog) abortar(`status gravado, mas o activity_log falhou: ${erroLog.message}`);
  console.log(`✅ "${item.titulo}": ${item.status} → ${novo}`);
}

async function main() {
  const [comando, ...resto] = process.argv.slice(2);
  const { posicionais, flags } = parseArgs(resto);
  const ajuda = "uso: feedback.mjs listar|ver|responder|status (veja o cabeçalho do arquivo)";
  if (!comando || comando === "--help" || comando === "ajuda") {
    console.log(ajuda);
    return;
  }
  const db = conectar();
  if (comando === "listar") return listar(db, flags);
  if (comando === "ver") return ver(db, posicionais[0], flags);
  if (comando === "responder") return responderCmd(db, posicionais[0], flags);
  if (comando === "status") return statusCmd(db, posicionais[0], posicionais[1], flags);
  abortar(`comando desconhecido: ${comando}\n${ajuda}`);
}

main().catch((erro) => abortar(erro?.message ?? String(erro)));
