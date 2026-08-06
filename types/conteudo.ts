// Contrato neutro do quadro de conteúdo: compartilhado por Server Components,
// actions e UI. A unidade é a pauta; Blog e LinkedIn têm trilhas independentes.

import type { PostStatus } from "./admin";

export type StatusBlog =
  | "planejada"
  | "pesquisa"
  | "draft"
  | "produzido"
  | "aprovado"
  | "publicado";
export type StatusLinkedin =
  | "planejada"
  | "producao"
  | "produzido"
  | "aprovado"
  | "publicado";
export type EstadoGeral =
  | "planejada"
  | "em-producao"
  | "aguardando-aprovacao"
  | "pronta-publicar"
  | "concluida";
export type VisaoQuadro = "geral" | "blog" | "linkedin";
export type CanalConteudo = Exclude<VisaoQuadro, "geral">;
export type StatusQuadro = StatusBlog | StatusLinkedin | EstadoGeral;

export type TipoPauta = "pauta" | "linkedin-acervo";
export type Trilha = "core" | "expansao";
export type Intencao = "transacional" | "informacional" | "comparativa" | "objecao";
export type Funil = "topo" | "meio" | "fundo" | "pos-venda";
export type Plataforma = "blog" | "linkedin";
export type BlocoTextoPauta =
  | "insights"
  | "pesquisa"
  | "linkedin"
  | "imagem-prompt"
  | "imagem-briefing";

export const STATUS_BLOG: readonly StatusBlog[] = [
  "planejada", "pesquisa", "draft", "produzido", "aprovado", "publicado",
] as const;
export const STATUS_LINKEDIN: readonly StatusLinkedin[] = [
  "planejada", "producao", "produzido", "aprovado", "publicado",
] as const;
export const ESTADOS_GERAIS: readonly EstadoGeral[] = [
  "planejada", "em-producao", "aguardando-aprovacao", "pronta-publicar", "concluida",
] as const;

export const STATUS_LABEL: Record<StatusQuadro, string> = {
  planejada: "Planejada",
  pesquisa: "Pesquisa",
  draft: "Draft",
  producao: "Produção",
  produzido: "Produzido",
  aprovado: "Aprovado",
  publicado: "Publicado",
  "em-producao": "Em produção",
  "aguardando-aprovacao": "Aguardando aprovação",
  "pronta-publicar": "Pronta para publicar",
  concluida: "Concluída",
};

export const INTENCAO_LABEL: Record<Intencao, string> = {
  transacional: "Transacional",
  informacional: "Informacional",
  comparativa: "Comparativa",
  objecao: "Objeção",
};
export const FUNIL_LABEL: Record<Funil, string> = {
  topo: "Topo", meio: "Meio", fundo: "Fundo", "pos-venda": "Pós-venda",
};
export const TRILHA_LABEL: Record<Trilha, string> = { core: "Core", expansao: "Expansão" };
export const PLATAFORMA_LABEL: Record<Plataforma, string> = {
  blog: "Blog", linkedin: "LinkedIn",
};
export const LIMITES = { tituloMax: 300, keywordMax: 200, blocoMax: 60000 } as const;

export interface ArtigoVinculado {
  id: string;
  slug: string;
  titulo: string;
  status: PostStatus;
  publicadoEm: string | null;
}
export interface Pauta {
  id: string;
  titulo: string;
  tipo: TipoPauta;
  statusBlog: StatusBlog | null;
  statusLinkedin: StatusLinkedin | null; // gitleaks:allow — nome de campo, não client id
  ordemBlog: number | null;
  ordemLinkedin: number | null;
  draftPath: string | null;
  linkedinUrl: string | null;
  linkedinPublicadoEm: string | null;
  keyword: string | null;
  intencao: Intencao | null;
  funil: Funil | null;
  prioridade: number | null;
  trilha: Trilha | null;
  semana: number | null;
  dataAlvo: string | null;
  insights: string | null;
  pesquisaConteudo: string | null;
  artigo: ArtigoVinculado | null;
  capaBlogUrl: string | null;
  capaLinkedinUrl: string | null;
  linkedinTexto: string | null;
  linkedinBriefing: string | null;
  linkedinImagemPrompt: string | null;
  linkedinImagemBriefing: string | null;
  plataformas: Plataforma[];
  criadoPor: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

const RANK_BLOG: Record<StatusBlog, number> = {
  planejada: 0, pesquisa: 1, draft: 2, produzido: 3, aprovado: 4, publicado: 5,
};
const RANK_LINKEDIN: Record<StatusLinkedin, number> = {
  planejada: 0, producao: 1, produzido: 2, aprovado: 3, publicado: 4,
};

/** Estado geral derivado: nunca há uma terceira coluna persistida. */
export function estadoGeral(pauta: Pauta): EstadoGeral {
  const trilhas = [
    pauta.statusBlog && {
      rank: RANK_BLOG[pauta.statusBlog], produzido: 3, aprovado: 4, publicado: 5,
    },
    pauta.statusLinkedin && {
      rank: RANK_LINKEDIN[pauta.statusLinkedin], produzido: 2, aprovado: 3, publicado: 4,
    },
  ].filter(Boolean) as { rank: number; produzido: number; aprovado: number; publicado: number }[];

  if (trilhas.length === 0 || trilhas.every((t) => t.rank === 0)) return "planejada";
  if (trilhas.every((t) => t.rank >= t.publicado)) return "concluida";
  if (trilhas.every((t) => t.rank >= t.aprovado)) return "pronta-publicar";
  if (trilhas.every((t) => t.rank >= t.produzido)) return "aguardando-aprovacao";
  return "em-producao";
}

export function statusNaVisao(pauta: Pauta, visao: VisaoQuadro): StatusQuadro | null {
  if (visao === "blog") return pauta.statusBlog;
  if (visao === "linkedin") return pauta.statusLinkedin;
  return estadoGeral(pauta);
}

export function ordemNaVisao(pauta: Pauta, visao: CanalConteudo): number | null {
  return visao === "blog" ? pauta.ordemBlog : pauta.ordemLinkedin;
}

export function proximaAcao(pauta: Pauta): string {
  if (pauta.statusBlog && pauta.statusBlog !== "publicado") {
    const blog: Record<Exclude<StatusBlog, "publicado">, string> = {
      planejada: "Pesquisar para o Blog",
      pesquisa: "Criar draft do Blog",
      draft: "Produzir artigo",
      produzido: "Aprovar artigo",
      aprovado: "Publicar artigo",
    };
    return blog[pauta.statusBlog];
  }
  if (pauta.statusLinkedin && pauta.statusLinkedin !== "publicado") {
    const linkedin: Record<Exclude<StatusLinkedin, "publicado">, string> = {
      planejada: "Produzir LinkedIn",
      producao: "Finalizar texto e capa",
      produzido: "Aprovar LinkedIn",
      aprovado: "Publicar e informar URL",
    };
    return linkedin[pauta.statusLinkedin];
  }
  return "Concluída";
}

export function divergeDoArtigo(pauta: Pauta): boolean {
  if (!pauta.artigo || pauta.tipo === "linkedin-acervo" || !pauta.statusBlog) return false;
  const publicadoNoSite = pauta.artigo.status === "published";
  return pauta.statusBlog === "publicado" ? !publicadoNoSite : publicadoNoSite;
}

export interface PostVinculadoRow {
  id: string;
  slug: string;
  title: string;
  status: string;
  published_at: string | null;
}
export interface PautaRow {
  id: string;
  titulo: string;
  tipo: string;
  status_blog: string | null;
  status_linkedin: string | null;
  ordem_blog: number | null;
  ordem_linkedin: number | null;
  draft_path: string | null;
  linkedin_url: string | null;
  linkedin_publicado_em: string | null;
  keyword: string | null;
  intencao: string | null;
  funil: string | null;
  prioridade: number | null;
  trilha: string | null;
  semana: number | null;
  data_alvo: string | null;
  insights: string | null;
  pesquisa_conteudo: string | null;
  post_id: string | null;
  capa_blog_url: string | null;
  capa_linkedin_url: string | null;
  linkedin_texto: string | null;
  linkedin_briefing: string | null;
  linkedin_imagem_prompt: string | null;
  linkedin_imagem_briefing: string | null;
  plataformas: string[] | null;
  criado_por: string | null;
  criado_em: string;
  atualizado_em: string;
  posts?: PostVinculadoRow | PostVinculadoRow[] | null;
}

export function ehStatusBlog(valor: string): valor is StatusBlog {
  return (STATUS_BLOG as readonly string[]).includes(valor);
}
export function ehStatusLinkedin(valor: string): valor is StatusLinkedin {
  return (STATUS_LINKEDIN as readonly string[]).includes(valor);
}
export function ehStatusDoCanal(
  canal: CanalConteudo,
  valor: string
): valor is StatusBlog | StatusLinkedin {
  return canal === "blog" ? ehStatusBlog(valor) : ehStatusLinkedin(valor);
}
export function ehPlataforma(valor: string): valor is Plataforma {
  return valor === "blog" || valor === "linkedin";
}
function ehTipoPauta(valor: string): valor is TipoPauta {
  return valor === "pauta" || valor === "linkedin-acervo";
}
function ehIntencao(valor: string): valor is Intencao { return valor in INTENCAO_LABEL; }
function ehFunil(valor: string): valor is Funil { return valor in FUNIL_LABEL; }
function ehTrilha(valor: string): valor is Trilha { return valor === "core" || valor === "expansao"; }
function ehPostStatus(valor: string): valor is PostStatus {
  return ["draft", "scheduled", "published", "archived"].includes(valor);
}
function primeiroArtigo(embed: PautaRow["posts"]): PostVinculadoRow | null {
  if (!embed) return null;
  return Array.isArray(embed) ? embed[0] ?? null : embed;
}

export function toPauta(row: PautaRow): Pauta {
  const post = primeiroArtigo(row.posts);
  return {
    id: row.id,
    titulo: row.titulo,
    tipo: ehTipoPauta(row.tipo) ? row.tipo : "pauta",
    statusBlog: row.status_blog && ehStatusBlog(row.status_blog) ? row.status_blog : null,
    statusLinkedin:
      row.status_linkedin && ehStatusLinkedin(row.status_linkedin)
        ? row.status_linkedin
        : null,
    ordemBlog: row.ordem_blog,
    ordemLinkedin: row.ordem_linkedin,
    draftPath: row.draft_path,
    linkedinUrl: row.linkedin_url,
    linkedinPublicadoEm: row.linkedin_publicado_em,
    keyword: row.keyword,
    intencao: row.intencao && ehIntencao(row.intencao) ? row.intencao : null,
    funil: row.funil && ehFunil(row.funil) ? row.funil : null,
    prioridade: row.prioridade,
    trilha: row.trilha && ehTrilha(row.trilha) ? row.trilha : null,
    semana: row.semana,
    dataAlvo: row.data_alvo,
    insights: row.insights,
    pesquisaConteudo: row.pesquisa_conteudo,
    artigo: post
      ? {
          id: post.id,
          slug: post.slug,
          titulo: post.title,
          status: ehPostStatus(post.status) ? post.status : "draft",
          publicadoEm: post.published_at,
        }
      : null,
    capaBlogUrl: row.capa_blog_url,
    capaLinkedinUrl: row.capa_linkedin_url,
    linkedinTexto: row.linkedin_texto,
    linkedinBriefing: row.linkedin_briefing,
    linkedinImagemPrompt: row.linkedin_imagem_prompt,
    linkedinImagemBriefing: row.linkedin_imagem_briefing,
    plataformas: (row.plataformas ?? []).filter(ehPlataforma),
    criadoPor: row.criado_por,
    criadoEm: row.criado_em,
    atualizadoEm: row.atualizado_em,
  };
}
