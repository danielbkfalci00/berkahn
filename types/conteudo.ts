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
export type TagConteudo = `domain/${string}`;
export type AcaoAutomacao =
  | "pesquisar"
  | "criar-draft"
  | "produzir-artigo"
  | "produzir-linkedin"
  | "revisar"
  | "preparar-publicacao";
export type StatusAutomacao =
  | "na-fila"
  | "executando"
  | "aguardando-aprovacao"
  | "concluido"
  | "falhou"
  | "cancelado";
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
export interface JobAutomacao {
  id: string;
  acao: AcaoAutomacao;
  status: StatusAutomacao;
  tentativas: number;
  erro: string | null;
  criadoEm: string;
  atualizadoEm: string;
}
export interface TagCatalogo {
  slug: TagConteudo;
  label: string;
  ativo: boolean;
  ordem: number;
}

export interface StatusWorkerConteudo {
  online: boolean;
  workerId: string | null;
  versao: string | null;
  vistoEm: string | null;
}

export interface ArtefatosResumoPauta {
  insights: boolean;
  pesquisa: boolean;
  linkedinTexto: boolean;
  linkedinBriefing: boolean;
  linkedinImagemPrompt: boolean;
  linkedinImagemBriefing: boolean;
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
  tags: TagConteudo[];
  automationJob: JobAutomacao | null;
  criadoPor: string | null;
  /** Presencas calculadas pela view leve do quadro; o detalhe usa os textos reais. */
  artefatosResumo?: ArtefatosResumoPauta;
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
  return estadoDoQuadro(pauta);
}

export function ordemNaVisao(pauta: Pauta, visao: CanalConteudo): number | null {
  return visao === "blog" ? pauta.ordemBlog : pauta.ordemLinkedin;
}

export interface PublicacaoReal {
  blog: "nao-se-aplica" | "sem-artigo" | "draft" | "publicado";
  linkedin: "nao-se-aplica" | "sem-registro" | "publicado";
}

export function publicacaoReal(pauta: Pauta): PublicacaoReal {
  return {
    blog: !pauta.statusBlog ? "nao-se-aplica" : !pauta.artigo ? "sem-artigo" : pauta.artigo.status === "published" ? "publicado" : "draft",
    linkedin: !pauta.statusLinkedin ? "nao-se-aplica" : pauta.linkedinUrl && pauta.linkedinPublicadoEm ? "publicado" : "sem-registro",
  };
}

/** A visão Geral só encerra quando a publicação real também está comprovada. */
export function estadoDoQuadro(pauta: Pauta): EstadoGeral {
  const posicao = estadoGeral(pauta);
  if (posicao !== "concluida") return posicao;
  const real = publicacaoReal(pauta);
  const blogOk = real.blog === "nao-se-aplica" || real.blog === "publicado";
  const linkedinOk = real.linkedin === "nao-se-aplica" || real.linkedin === "publicado";
  return blogOk && linkedinOk ? "concluida" : "pronta-publicar";
}
export function gapsConteudo(pauta: Pauta): string[] {
  const gaps: string[] = [];
  if (pauta.statusBlog) {
    if (!temArtefato(pauta, "pesquisa", pauta.pesquisaConteudo)) gaps.push("Pesquisa do Blog");
    if (!pauta.draftPath) gaps.push("Draft do Blog");
    if (!pauta.artigo) gaps.push("Artigo vinculado");
    if (!pauta.capaBlogUrl) gaps.push("Capa do Blog");
    if (pauta.statusBlog === "publicado" && publicacaoReal(pauta).blog !== "publicado") gaps.push("Publicação real do Blog");
  }
  if (pauta.statusLinkedin) {
    if (!temArtefato(pauta, "linkedinTexto", pauta.linkedinTexto)) gaps.push("Texto do LinkedIn");
    if (!pauta.capaLinkedinUrl) gaps.push("Capa do LinkedIn");
    if (pauta.statusLinkedin === "publicado" && publicacaoReal(pauta).linkedin !== "publicado") gaps.push("URL e data reais do LinkedIn");
  }
  return gaps;
}

export function proximaAcaoOperacional(pauta: Pauta): string {
  const real = publicacaoReal(pauta);
  if (pauta.statusBlog) {
    if (!temArtefato(pauta, "pesquisa", pauta.pesquisaConteudo)) return "Pesquisar para o Blog";
    if (!pauta.draftPath) return "Criar draft do Blog";
    if (!pauta.artigo || !pauta.capaBlogUrl) return "Produzir artigo e capa";
    if (real.blog !== "publicado") return "Revisar e publicar artigo";
  }
  if (pauta.statusLinkedin) {
    if (!temArtefato(pauta, "linkedinTexto", pauta.linkedinTexto)) return "Produzir texto do LinkedIn";
    if (!pauta.capaLinkedinUrl) return "Produzir capa do LinkedIn";
    if (real.linkedin !== "publicado") return "Revisar, publicar e registrar URL";
  }
  return "Publicação real concluída";
}

function temArtefato(
  pauta: Pauta,
  campo: keyof ArtefatosResumoPauta,
  valorCompleto: string | null
): boolean {
  return pauta.artefatosResumo?.[campo] ?? Boolean(valorCompleto?.trim());
}

export const proximaAcao = proximaAcaoOperacional;

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

export interface PautaQuadroRow {
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
  post_id: string | null;
  capa_blog_url: string | null;
  capa_linkedin_url: string | null;
  plataformas: string[] | null;
  criado_por: string | null;
  criado_em: string;
  atualizado_em: string;
  tem_insights: boolean;
  tem_pesquisa: boolean;
  tem_linkedin_texto: boolean;
  tem_linkedin_briefing: boolean;
  tem_linkedin_imagem_prompt: boolean;
  tem_linkedin_imagem_briefing: boolean;
  post_slug: string | null;
  post_title: string | null;
  post_status: string | null;
  post_published_at: string | null;
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
    tags: [],
    automationJob: null,
    criadoPor: row.criado_por,
    criadoEm: row.criado_em,
    atualizadoEm: row.atualizado_em,
  };
}
export function toPautaQuadro(row: PautaQuadroRow): Pauta {
  const pauta = toPauta({
    ...row,
    insights: null,
    pesquisa_conteudo: null,
    linkedin_texto: null,
    linkedin_briefing: null,
    linkedin_imagem_prompt: null,
    linkedin_imagem_briefing: null,
    posts: row.post_id && row.post_slug && row.post_title && row.post_status
      ? {
          id: row.post_id,
          slug: row.post_slug,
          title: row.post_title,
          status: row.post_status,
          published_at: row.post_published_at,
        }
      : null,
  });
  pauta.artefatosResumo = {
    insights: row.tem_insights,
    pesquisa: row.tem_pesquisa,
    linkedinTexto: row.tem_linkedin_texto,
    linkedinBriefing: row.tem_linkedin_briefing,
    linkedinImagemPrompt: row.tem_linkedin_imagem_prompt,
    linkedinImagemBriefing: row.tem_linkedin_imagem_briefing,
  };
  return pauta;
}
