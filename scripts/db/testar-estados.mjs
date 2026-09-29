// Testa o estado geral derivado contra a implementação real em types/conteudo.ts.
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const dir = mkdtempSync(join(tmpdir(), "estados-conteudo-"));
execFileSync(
  process.execPath,
  [
    fileURLToPath(import.meta.resolve("typescript/lib/tsc.js")),
    "types/conteudo.ts",
    "types/admin.ts",
    "--module", "esnext",
    "--target", "es2022",
    "--moduleResolution", "bundler",
    "--outDir", dir,
  ],
  { stdio: "pipe" }
);
const tiposConteudo = await import(
  `file:///${join(dir, "conteudo.js").replace(/\\/g, "/")}`
);
const { estadoDoQuadro, estadoGeral, gapsConteudo, proximaAcao, publicacaoReal } = tiposConteudo;

let falhas = 0;
function checar(nome, recebido, esperado) {
  const passou = recebido === esperado;
  if (!passou) falhas++;
  console.log(
    `  ${passou ? "PASSOU" : "FALHOU  <<<<"}  ${nome} — ${recebido}`
  );
}
function pauta(statusBlog, statusLinkedin, extras = {}) {
  return {
    statusBlog,
    statusLinkedin,
    pesquisaConteudo: null,
    draftPath: null,
    artigo: null,
    capaBlogUrl: null,
    linkedinTexto: null,
    capaLinkedinUrl: null,
    linkedinUrl: null,
    linkedinPublicadoEm: null,
    ...extras,
  };
}

console.log("\nESTADOS DERIVADOS");
checar("duas trilhas planejadas", estadoGeral(pauta("planejada", "planejada")), "planejada");
checar("pesquisa iniciada", estadoGeral(pauta("pesquisa", "planejada")), "em-producao");
checar("duas entregas produzidas", estadoGeral(pauta("produzido", "produzido")), "aguardando-aprovacao");
checar("blog publicado + LinkedIn aprovado", estadoGeral(pauta("publicado", "aprovado")), "pronta-publicar");
checar("duas trilhas publicadas", estadoGeral(pauta("publicado", "publicado")), "concluida");
checar("blog publicado + LinkedIn planejado", estadoGeral(pauta("publicado", "planejada")), "em-producao");
checar("pauta somente Blog publicada", estadoGeral(pauta("publicado", null)), "concluida");
checar("pauta somente LinkedIn produzida", estadoGeral(pauta(null, "produzido")), "aguardando-aprovacao");

console.log("\nPRÓXIMA AÇÃO");
checar("Blog vem antes quando aplicável", proximaAcao(pauta("pesquisa", "planejada", { pesquisaConteudo: "ok" })), "Criar draft do Blog");
checar("LinkedIn assume após Blog publicado", proximaAcao(pauta("publicado", "aprovado", { pesquisaConteudo: "ok", draftPath: "draft.md", artigo: { status: "published" }, capaBlogUrl: "cover", linkedinTexto: "ok", capaLinkedinUrl: "cover" })), "Revisar, publicar e registrar data");

console.log("\nPUBLICAÇÃO REAL E GAPS");
const statusSemArtefatos = pauta("publicado", "publicado");
checar("status Publicado não prova publicação real", publicacaoReal(statusSemArtefatos).blog, "sem-artigo");
checar("LinkedIn Publicado sem data continua irreal", publicacaoReal(statusSemArtefatos).linkedin, "sem-registro");
checar("gaps continuam visíveis após mover status", gapsConteudo(statusSemArtefatos).length > 0, true);
checar("visão Geral não conclui só pelo status", estadoDoQuadro(statusSemArtefatos), "pronta-publicar");
const real = pauta("publicado", "publicado", {
  artigo: { status: "published" }, linkedinUrl: "https://linkedin.com/posts/teste",
  linkedinPublicadoEm: "2026-08-07",
});
checar("artefatos comprovam publicação real do Blog", publicacaoReal(real).blog, "publicado");
checar("URL e data comprovam LinkedIn real", publicacaoReal(real).linkedin, "publicado");
checar("visão Geral conclui com publicação real", estadoDoQuadro(real), "concluida");
const realSemUrl = pauta("publicado", "publicado", {
  artigo: { status: "published" }, linkedinPublicadoEm: "2026-09-12",
});
checar("data sem URL também comprova LinkedIn real", publicacaoReal(realSemUrl).linkedin, "publicado");
checar("visão Geral conclui quando a URL individual não foi coletada", estadoDoQuadro(realSemUrl), "concluida");

console.log("\nTAXONOMIA");
const vault = readFileSync("Berkahn-Vault/CLAUDE.md", "utf8");
const migration = readFileSync("supabase/migrations/015_conteudo_tags.sql", "utf8");
const vaultTags = [...new Set(vault.match(new RegExp("domain/[a-z0-9-]+", "g")) ?? [])].sort();
const dbTags = [...new Set(migration.match(new RegExp("domain/[a-z0-9-]+", "g")) ?? [])].sort();
checar("vault e catálogo operacional têm os mesmos domínios", vaultTags.join(","), dbTags.join(","));

console.log("\nORQUESTRAÇÃO E PUBLICAÇÃO LOCAL");
const {
  compararPautas, corpoPublicavelDoMarkdown, gapsDaPauta, prepararArquivoPublicado,
  prepararMovimentoPublicado,
  proximaAcaoPauta, urlLinkedinParametrizada,
} = await import(new URL("../conteudo/pauta.mjs", import.meta.url));
const base = {
  id: "b", data_alvo: "2026-08-20", prioridade: 2,
  ordem_blog: 2, ordem_linkedin: 2, status_blog: "planejada",
  status_linkedin: "planejada", job_status: null,
};
const ordenadas = [
  base,
  { ...base, id: "curso", status_blog: "draft" },
  { ...base, id: "fila", job_status: "na-fila" },
  { ...base, id: "aprovar", job_status: "aguardando-aprovacao" },
].sort(compararPautas);
checar("WIP limita pautas novas", ordenadas.map((p) => p.id).join(","), "aprovar,fila,curso,b");
checar(
  "URL do LinkedIn recebe UTMs canônicas",
  urlLinkedinParametrizada("slug-teste"),
  "https://www.berkahn.com.br/atualidades/slug-teste?utm_source=linkedin&utm_medium=social&utm_campaign=post-organico"
);
const corpo = corpoPublicavelDoMarkdown(
  "Berkahn-Vault/40-content/blog/publicados/quanto-custa-construir-steel-frame-precos-m2-2026.md"
);
checar("corpo deriva do markdown sem frontmatter", corpo.startsWith("Para planejar uma casa"), true);
checar("especificações internas não vazam no post", corpo.includes("ESPECIFICAÇÕES TÉCNICAS"), false);
const revisaoStaged = {
  status_blog: "produzido", status_linkedin: null, pesquisa_conteudo: "ok",
  draft_path: "draft.md", post_id: "post", capa_blog_url: "cover",
  post_draft_payload: { title: "novo" }, posts: { status: "published" },
};
checar("revisão staged volta para revisão", proximaAcaoPauta(revisaoStaged), "revisar");
checar(
  "revisão staged expõe aprovação pendente",
  gapsDaPauta(revisaoStaged).includes("revisao_blog_aguarda_aprovacao"),
  true
);

const origem = join(dir, "draft.md");
const destino = join(dir, "publicado.md");
writeFileSync(origem, "draft novo", "utf8");
writeFileSync(destino, "publicado antigo", "utf8");
const rollback = prepararMovimentoPublicado(origem, destino, "publicado novo");
checar("substituição prepara a versão nova", readFileSync(destino, "utf8"), "publicado novo");
checar("draft sai do caminho durante a transação", existsSync(origem), false);
rollback.desfazer();
checar("rollback restaura o draft", readFileSync(origem, "utf8"), "draft novo");
checar("rollback restaura o publicado anterior", readFileSync(destino, "utf8"), "publicado antigo");
const commit = prepararMovimentoPublicado(origem, destino, "publicado novo");
checar("commit limpa backups", commit.confirmar().length, 0);
checar("commit remove o draft", existsSync(origem), false);
checar("commit preserva somente o novo publicado", readFileSync(destino, "utf8"), "publicado novo");

const capaDestino = join(dir, "cover.webp");
writeFileSync(capaDestino, "capa antiga", "utf8");
const capaRollback = prepararArquivoPublicado(capaDestino, Buffer.from("capa nova"));
checar("capa gerada substitui a versão anterior", readFileSync(capaDestino, "utf8"), "capa nova");
capaRollback.desfazer();
checar("rollback restaura a capa anterior", readFileSync(capaDestino, "utf8"), "capa antiga");
const capaCommit = prepararArquivoPublicado(capaDestino, Buffer.from("capa final"));
checar("commit da capa limpa backup", capaCommit.confirmar().length, 0);
checar("commit preserva a capa final", readFileSync(capaDestino, "utf8"), "capa final");

console.log("\nRETORNO DO QUADRO FILTRADO");
{
  // Reproduce the browser regression: typing filters the board while Next's
  // search params still describe the old URL. Exercise the actual component
  // chain, with no server actions or debounced URL synchronization.
  const states = new Map();
  let rendering;
  let filters;
  const react = {
    useState(initial) {
      const context = rendering, index = context.cursor++;
      if (!(index in context.slots)) context.slots[index] = typeof initial === "function" ? initial() : initial;
      return [context.slots[index], (next) => { context.slots[index] = typeof next === "function" ? next(context.slots[index]) : next; }];
    },
    useRef(initial) { const index = rendering.cursor++; rendering.slots[index] ??= { current: initial }; return rendering.slots[index]; },
    useMemo(compute) { rendering.cursor++; return compute(); },
    useEffect() { rendering.cursor++; },
    useTransition() { rendering.cursor++; return [false, () => { throw new Error("Mutação inesperada"); }]; },
  };
  const element = (type, props, key) => ({ type, props, key });
  const symbols = new Proxy({}, { get: (_, name) => String(name) });
  const cache = new Map();
  const sourceFiles = {
    "@/lib/admin/return-to": "lib/admin/return-to.ts",
    "@/lib/conteudo/colunas": "lib/conteudo/colunas.ts",
    "./CartaoPauta": "components/admin/conteudo/CartaoPauta.tsx",
    "./ColunaPauta": "components/admin/conteudo/ColunaPauta.tsx",
    "./SeloPostVinculado": "components/admin/conteudo/SeloPostVinculado.tsx",
  };
  function loadComponent(path) {
    if (cache.has(path)) return cache.get(path);
    const api = {};
    cache.set(path, api);
    const output = ts.transpileModule(readFileSync(path, "utf8"), {
      fileName: path,
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
    }).outputText;
    new Function("require", "exports", output)((name) => {
      if (sourceFiles[name]) return loadComponent(sourceFiles[name]);
      if (name === "react") return react;
      if (name === "react/jsx-runtime") return { jsx: element, jsxs: element, Fragment: "Fragment" };
      if (name === "next/link") return { default: "Link" };
      if (name === "next/navigation") return { useRouter: () => ({}), useSearchParams: () => new URLSearchParams() };
      if (name === "@/types/conteudo") return tiposConteudo;
      if (name === "@/lib/utils") return { cn: (...values) => values.filter(Boolean).join(" ") };
      if (name === "@/lib/analytics/use-url-filters") return { useUrlFilters: () => ({ values: filters, setValue() {}, clearValues() {} }) };
      if (name === "@/hooks/use-lista-otimista") return { useListaOtimista: (itens) => ({ itens, erro: null, pendente: false }) };
      if (name === "@/hooks/use-tela-larga") return { useTelaLarga: () => false };
      if (name === "@/hooks/use-arrastar-entre-colunas") return { PREFIXO_COLUNA: "coluna:", useArrastarEntreColunas: () => ({ sensores: [], pautaAtiva: null }) };
      if (name === "@dnd-kit/core") return { DndContext: "DndContext", DragOverlay: "DragOverlay", useDroppable: () => ({ setNodeRef() {}, isOver: false }) };
      if (name === "@dnd-kit/sortable") return { SortableContext: "SortableContext", useSortable: () => ({ attributes: {}, listeners: {}, setNodeRef() {}, isDragging: false }) };
      if (name === "@dnd-kit/utilities") return { CSS: { Translate: { toString: () => undefined } } };
      if (name === "@/app/admin/conteudo/actions") return {};
      if (name === "lucide-react" || name.startsWith("@/components/ui/") || ["./NovaPautaInline", "./BadgesPlataforma"].includes(name)) return symbols;
      throw new Error(`Import inesperado: ${name}`);
    }, api);
    return api;
  }
  function render(component, props) {
    rendering = states.get(component) ?? { slots: [], cursor: 0 };
    states.set(component, rendering);
    rendering.cursor = 0;
    const tree = component(props);
    rendering = null;
    return tree;
  }
  function findNodes(tree, predicate) {
    if (Array.isArray(tree)) return tree.flatMap((child) => findNodes(child, predicate));
    if (!tree || typeof tree !== "object" || !tree.props) return [];
    return [...(predicate(tree) ? [tree] : []), ...findNodes(tree.props.children, predicate)];
  }
  const { QuadroConteudo } = loadComponent("components/admin/conteudo/QuadroConteudo.tsx");
  const item = pauta("planejada", "planejada", {
    id: "12345678-1234-1234-1234-123456789abc", titulo: "Projeto integrado", tipo: "pauta",
    keyword: "steel frame", plataformas: ["blog", "linkedin"], trilha: "core", funil: "topo",
    intencao: "informacional", prioridade: 2, dataAlvo: null, tags: [], ordemBlog: 1, ordemLinkedin: 1,
    artigo: { id: "post-1", titulo: "Projeto integrado", slug: "projeto-integrado", status: "draft" },
  });
  const boardProps = { pautas: [item, { ...item, id: "outro", titulo: "Outro tema" }], tagsCatalogo: [], worker: { online: false } };
  for (const visao of ["geral", "blog", "linkedin"]) {
    states.clear();
    filters = { conteudo_visao: visao, conteudo_q: "", conteudo_plataforma: "blog", conteudo_trilha: "core", conteudo_funil: "topo", conteudo_intencao: "informacional", conteudo_prioridade: "2", conteudo_prazo: "sem-data" };
    let tree = render(QuadroConteudo, boardProps);
    const search = () => findNodes(tree, (node) => node.type === "Input" && node.props.placeholder === "Buscar título ou keyword")[0];
    search().props.onChange({ target: { value: "Projeto integrado" } });
    tree = render(QuadroConteudo, boardProps);
    const group = findNodes(tree, (node) => ["AgendaGeral", "ColunaPauta"].includes(node.type?.name) && node.props.pautas.length > 0)[0];
    checar(`${visao}: busca efetiva reduz para uma pauta`, group.props.pautas.length, 1);
    const groupTree = render(group.type, group.props);
    const card = findNodes(groupTree, (node) => node.type?.name === "CartaoPauta")[0];
    const cardTree = render(card.type, card.props);
    const pautaLink = findNodes(cardTree, (node) => node.type === "Link" && node.props.href.startsWith("/admin/conteudo/"))[0];
    const badge = findNodes(cardTree, (node) => node.type?.name === "SeloPostVinculado")[0];
    const articleLink = findNodes(render(badge.type, badge.props), (node) => node.type === "Link")[0];
    for (const [label, link] of [["pauta", pautaLink], ["artigo", articleLink]]) {
      const returnTo = new URL(link.props.href, "https://admin.example").searchParams.get("returnTo");
      const actual = new URL(returnTo, "https://admin.example").searchParams;
      checar(`${visao}/${label}: retorno acompanha busca com URL antiga`, actual.get("conteudo_q"), "Projeto integrado");
      for (const [key, value] of Object.entries(filters).filter(([key]) => key !== "conteudo_q")) {
        checar(`${visao}/${label}: preserva ${key}`, actual.get(key) ?? "geral", value);
      }
      checar(`${visao}/${label}: não reabre criação`, actual.has("nova"), false);
    }
    search().props.onChange({ target: { value: "__todos__" } });
    tree = render(QuadroConteudo, boardProps);
    const emptyGroup = findNodes(tree, (node) => ["AgendaGeral", "ColunaPauta"].includes(node.type?.name))[0];
    checar(`${visao}: busca literal igual ao sentinel é preservada`, new URL(emptyGroup.props.returnTo, "https://admin.example").searchParams.get("conteudo_q"), "__todos__");
    search().props.onChange({ target: { value: "" } });
    tree = render(QuadroConteudo, boardProps);
    const clearedGroup = findNodes(tree, (node) => ["AgendaGeral", "ColunaPauta"].includes(node.type?.name))[0];
    checar(`${visao}: limpar busca remove query do retorno`, new URL(clearedGroup.props.returnTo, "https://admin.example").searchParams.has("conteudo_q"), false);
  }
}

rmSync(dir, { recursive: true, force: true });
console.log(falhas === 0 ? "\n✅ tudo passou" : `\n❌ ${falhas} falha(s)`);
process.exit(falhas === 0 ? 0 : 1);
