// Tipos do quadro de conteúdo (/admin/conteudo)
// Tabela: conteudo_pautas (supabase/migrations/010_conteudo_pautas.sql)
//
// A unidade é a PAUTA (assunto), não o artigo. Um card agrega insights,
// pesquisa, artigo, post de LinkedIn e as duas capas.
//
// Este arquivo é NEUTRO: sem "use client", sem "server-only". É importado dos
// dois lados da fronteira — pela query no servidor e pelos componentes no
// cliente. Não coloque nada aqui que dependa de um dos ambientes.

import type { PostStatus } from "./admin";

export type ColunaPauta =
  | "decisao"
  | "pesquisa"
  | "envelopar"
  | "produzido"
  | "aprovado"
  | "publicado";

export type TipoPauta = "pauta" | "linkedin-acervo";
export type Trilha = "core" | "expansao";
export type Intencao =
  | "transacional"
  | "informacional"
  | "comparativa"
  | "objecao";
export type Funil = "topo" | "meio" | "fundo" | "pos-venda";
export type Plataforma = "blog" | "linkedin";

/** Um dos seis blocos de texto editáveis do card. */
export type BlocoTextoPauta = "insights" | "pesquisa" | "linkedin";

/**
 * Ordem das colunas no quadro. Fonte única — a UI itera isto, e a query ordena
 * por ela. Mudar a ordem aqui reordena o quadro; mudar os valores exige
 * migration (são CHECK no banco).
 */
export const COLUNAS: readonly ColunaPauta[] = [
  "decisao",
  "pesquisa",
  "envelopar",
  "produzido",
  "aprovado",
  "publicado",
] as const;

/**
 * Rótulos exibidos. Ficam aqui e não no banco porque 'Decisão LK/Blog' tem
 * acento e barra: como valor de coluna viraria query string quebrada e
 * comparação sensível a NFC/NFD.
 */
export const COLUNA_LABEL: Record<ColunaPauta, string> = {
  decisao: "Decisão LK/Blog",
  pesquisa: "Pesquisa",
  envelopar: "Envelopar",
  produzido: "Produzido",
  aprovado: "Aprovado",
  publicado: "Publicado",
};

export const INTENCAO_LABEL: Record<Intencao, string> = {
  transacional: "Transacional",
  informacional: "Informacional",
  comparativa: "Comparativa",
  objecao: "Objeção",
};

export const FUNIL_LABEL: Record<Funil, string> = {
  topo: "Topo",
  meio: "Meio",
  fundo: "Fundo",
  "pos-venda": "Pós-venda",
};

export const TRILHA_LABEL: Record<Trilha, string> = {
  core: "Core",
  expansao: "Expansão",
};

export const PLATAFORMA_LABEL: Record<Plataforma, string> = {
  blog: "Blog",
  linkedin: "Linkedin",
};

/**
 * Limites de tamanho, reaplicados nas server actions.
 *
 * `tituloMax` espelha o CHECK da migration 010. Os demais são **só de
 * aplicação**: os blocos de texto não têm CHECK no banco, porque são
 * long-form e um teto no schema exigiria migration a cada vez que a pesquisa
 * crescer. O cap existe para barrar um Ctrl+A acidental, não para modelar o
 * domínio.
 */
export const LIMITES = {
  tituloMax: 300,
  keywordMax: 200,
  blocoMax: 60000,
} as const;

/** Artigo vinculado. Só leitura — o quadro nunca escreve em `posts`. */
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
  coluna: ColunaPauta;
  ordem: number;

  // Planejamento editorial (vem do calendário; null em card criado à mão)
  keyword: string | null;
  intencao: Intencao | null;
  funil: Funil | null;
  prioridade: number | null;
  trilha: Trilha | null;
  semana: number | null;
  /** Data de calendário, formato YYYY-MM-DD. Nunca carrega hora nem fuso. */
  dataAlvo: string | null;

  // Os 6 blocos
  insights: string | null;
  pesquisaConteudo: string | null;
  /** "Artigo Finalizado". Null quando a pauta ainda não tem artigo. */
  artigo: ArtigoVinculado | null;
  capaBlogUrl: string | null;
  capaLinkedinUrl: string | null;
  linkedinTexto: string | null;

  /** Ângulo + dado-âncora do calendário. Insumo do texto, não o texto. */
  linkedinBriefing: string | null;
  plataformas: Plataforma[];

  criadoPor: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

/**
 * True quando a coluna do quadro discorda do estado real do artigo — card em
 * "Publicado" com artigo em rascunho, ou o contrário. O quadro nunca escreve
 * em `posts.status`, então essa divergência é possível de propósito; a UI a
 * exibe em vez de esconder.
 *
 * Cards `linkedin-acervo` nunca divergem: eles nascem de um artigo que JÁ está
 * no ar, e a coluna descreve o andamento do post de LinkedIn, não o do artigo.
 * Sem esta exceção o aviso apareceria nos 22 de uma vez, e um alerta que
 * dispara em um terço do quadro só ensina a ignorá-lo.
 */
export function divergeDoArtigo(pauta: Pauta): boolean {
  if (!pauta.artigo) return false;
  if (pauta.tipo === "linkedin-acervo") return false;

  const publicadoNoSite = pauta.artigo.status === "published";
  return pauta.coluna === "publicado" ? !publicadoNoSite : publicadoNoSite;
}

// ============================================
// Shapes crus do PostgREST (snake_case)
// ============================================

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
  coluna: string;
  ordem: number;
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
  plataformas: string[] | null;
  criado_por: string | null;
  criado_em: string;
  atualizado_em: string;
  /**
   * Embed do PostgREST. Para FK to-one ele devolve objeto, mas a tipagem
   * gerada às vezes diz array — aceitar as duas formas e normalizar em
   * `toPauta` sai mais barato que brigar com o gerador.
   */
  posts?: PostVinculadoRow | PostVinculadoRow[] | null;
}

// ============================================
// Guards e mapper
// ============================================

export function ehColunaPauta(valor: string): valor is ColunaPauta {
  return (COLUNAS as readonly string[]).includes(valor);
}

export function ehPlataforma(valor: string): valor is Plataforma {
  return valor === "blog" || valor === "linkedin";
}

function ehTipoPauta(valor: string): valor is TipoPauta {
  return valor === "pauta" || valor === "linkedin-acervo";
}

function ehIntencao(valor: string): valor is Intencao {
  return valor in INTENCAO_LABEL;
}

function ehFunil(valor: string): valor is Funil {
  return valor in FUNIL_LABEL;
}

function ehTrilha(valor: string): valor is Trilha {
  return valor === "core" || valor === "expansao";
}

function ehPostStatus(valor: string): valor is PostStatus {
  return (
    valor === "draft" ||
    valor === "scheduled" ||
    valor === "published" ||
    valor === "archived"
  );
}

/** Normaliza o embed, que pode vir objeto, array de um, ou null. */
function primeiroArtigo(
  embed: PautaRow["posts"]
): PostVinculadoRow | null {
  if (!embed) return null;
  return Array.isArray(embed) ? embed[0] ?? null : embed;
}

export function toPauta(row: PautaRow): Pauta {
  const post = primeiroArtigo(row.posts);

  return {
    id: row.id,
    titulo: row.titulo,
    // Enums caem no default em vez de estourar: uma linha com valor
    // inesperado some da tela se lançarmos, e o quadro inteiro vai junto.
    tipo: row.tipo && ehTipoPauta(row.tipo) ? row.tipo : "pauta",
    coluna: row.coluna && ehColunaPauta(row.coluna) ? row.coluna : "decisao",
    ordem: row.ordem ?? 0,

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
    plataformas: (row.plataformas ?? []).filter(ehPlataforma),

    criadoPor: row.criado_por,
    criadoEm: row.criado_em,
    atualizadoEm: row.atualizado_em,
  };
}
