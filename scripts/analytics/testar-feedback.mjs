// Testa a validação pura do mural de feedback (types/feedback.ts).
//
// Mesmo molde de testar-heatmaps.mjs: compila o arquivo real com o tsc do
// projeto, sem copiar a lógica. types/feedback.ts não tem imports justamente
// para isto funcionar sem remendo.
//
// O que precisa pegar: título curto passando, categoria forjada, link externo
// virando pagina_origem clicável, e o erro de "tabela ausente" que a UI usa
// para mostrar o aviso da migration 034 em vez de quebrar.
import { execFileSync } from "node:child_process";
import { mkdtempSync, copyFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const dir = mkdtempSync(join(tmpdir(), "feedback-"));
copyFileSync("types/feedback.ts", join(dir, "feedback.ts"));
execFileSync(
  process.execPath,
  [
    fileURLToPath(import.meta.resolve("typescript/lib/tsc.js")),
    join(dir, "feedback.ts"),
    "--module", "esnext", "--target", "es2022",
    "--moduleResolution", "bundler", "--outDir", dir,
  ],
  { stdio: "pipe" }
);
const m = await import(pathToFileURL(join(dir, "feedback.js")).href);

let falhas = 0;
let total = 0;
function ok(nome, condicao, detalhe) {
  total++;
  if (!condicao) {
    falhas++;
    console.error(`  ✗ ${nome}${detalhe ? ` — ${detalhe}` : ""}`);
  }
}

console.log("validarNovoFeedback");
{
  const r = m.validarNovoFeedback({ titulo: "  Filtro   por cidade ", categoria: "melhoria", descricao: " x ", paginaOrigem: "/admin/leads?x=1" });
  ok("aceita entrada válida", r.ok);
  ok("colapsa espaços do título", r.ok && r.valor.titulo === "Filtro por cidade", r.ok ? r.valor.titulo : r.erro);
  ok("apara a descrição", r.ok && r.valor.descricao === "x");
  ok("tira query da página", r.ok && r.valor.paginaOrigem === "/admin/leads");
  ok("recusa título com menos de 4", !m.validarNovoFeedback({ titulo: "abc", categoria: "bug" }).ok);
  ok("recusa título de 161", !m.validarNovoFeedback({ titulo: "a".repeat(161), categoria: "bug" }).ok);
  ok("aceita título de 160", m.validarNovoFeedback({ titulo: "a".repeat(160), categoria: "bug" }).ok);
  ok("recusa categoria forjada", !m.validarNovoFeedback({ titulo: "Título ok", categoria: "admin" }).ok);
  ok("recusa descrição de 5001", !m.validarNovoFeedback({ titulo: "Título ok", categoria: "ideia", descricao: "a".repeat(5001) }).ok);
  ok("descrição vazia é permitida", m.validarNovoFeedback({ titulo: "Título ok", categoria: "outro" }).ok);
}

console.log("normalizarPagina");
{
  ok("aceita rota do admin", m.normalizarPagina("/admin/leads/123") === "/admin/leads/123");
  ok("aceita /admin puro", m.normalizarPagina("/admin") === "/admin");
  ok("recusa URL externa", m.normalizarPagina("https://evil.example/admin") === null);
  ok("recusa protocolo relativo", m.normalizarPagina("//evil.example/admin") === null);
  ok("recusa fora do admin", m.normalizarPagina("/atualidades/x") === null);
  ok("recusa traversal", m.normalizarPagina("/admin/../api") === null);
  ok("recusa javascript:", m.normalizarPagina("javascript:alert(1)") === null);
  ok("recusa não-string", m.normalizarPagina(42) === null);
  ok("corta em 300", m.normalizarPagina("/admin/" + "a".repeat(400)).length === 300);
}

console.log("validarCorpo / validarNota");
{
  ok("corpo vazio recusado", !m.validarCorpo("   ").ok);
  ok("corpo apara", m.validarCorpo("  oi ").valor === "oi");
  ok("corpo de 5001 recusado", !m.validarCorpo("a".repeat(5001)).ok);
  ok("nota vazia vira null", m.validarNota("  ").valor === null);
  ok("nota de 2001 recusada", !m.validarNota("a".repeat(2001)).ok);
}

console.log("parseFiltro / isTabelaAusente / isUuid");
{
  ok("filtro padrão é aberto", m.parseFiltro(undefined) === "aberto");
  ok("filtro desconhecido cai em aberto", m.parseFiltro("resolvido") === "aberto");
  ok("filtro todos", m.parseFiltro("todos") === "todos");
  ok("PGRST205 é tabela ausente", m.isTabelaAusente({ code: "PGRST205", message: "" }));
  ok("42P01 é tabela ausente", m.isTabelaAusente({ code: "42P01", message: "" }));
  ok("mensagem do PostgREST", m.isTabelaAusente({ message: "Could not find the table 'public.feedback_itens' in the schema cache" }));
  ok("outro erro não é ausência", !m.isTabelaAusente({ code: "42501", message: "permission denied" }));
  ok("null não é ausência", !m.isTabelaAusente(null));
  ok("uuid válido", m.isUuid("3f2b8c1e-1a2b-4c3d-8e9f-0123456789ab"));
  ok("uuid inválido", !m.isUuid("123"));
}

console.log("toItemFeedback");
{
  const i = m.toItemFeedback({
    id: "x", titulo: "t", categoria: "hack", status: "qualquer", pagina_origem: null, autor_nome: "a",
    implementado_em: null, implementado_por: null, nota_implementacao: null,
    criado_em: "2026-09-22", atualizado_em: "2026-09-22", feedback_mensagens: [{ count: 3 }],
  });
  ok("categoria desconhecida vira outro", i.categoria === "outro");
  ok("status desconhecido vira aberto", i.status === "aberto");
  ok("conta mensagens do embed", i.totalMensagens === 3);
  ok("origem desconhecida vira admin", m.toMensagemFeedback({ origem: "x" }).origem === "admin");
}

rmSync(dir, { recursive: true, force: true });

if (falhas === 0) {
  console.log(`\n✓ feedback: ${total} assercoes passaram`);
} else {
  console.error(`\n✗ ${falhas} de ${total} assercoes falharam`);
  process.exit(1);
}
