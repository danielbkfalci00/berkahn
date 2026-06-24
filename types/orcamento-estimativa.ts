// Tipos para o módulo de Estimativa Preliminar (admin/orcamentos)
// Distinto de types/orcamento.ts (LSF Chalé) e de types/admin.ts:Proposal (transacional com items+descontos).
// Espelha o schema da tabela `orcamentos` em supabase/migrations/006_create_orcamentos.sql.

export type OrcamentoStatus = "rascunho" | "finalizado" | "arquivado";

export type PadraoAcabamento = "baixo" | "medio" | "alto" | "altissimo";

export type RegimeRecomendado =
  | "administracao"
  | "fechado"
  | "pmg"
  | "indefinido";

export interface CondicionanteExtra {
  texto: string;
}

export interface ExclusaoExtra {
  texto: string;
}

export type CardEntregaId =
  | "engenharia"
  | "suprimentos"
  | "fornecedores"
  | "planejamento"
  | "relatorios"
  | "qualidade"
  | "seguranca"
  | "canteiro"
  | "garantia";

export interface Orcamento {
  id: string;
  numero: string;
  status: OrcamentoStatus;
  slug: string;

  cliente_nome: string;
  cliente_email: string | null;
  cliente_telefone: string | null;

  obra_endereco: string;
  obra_cidade: string;
  obra_referencia: string | null;
  projeto_area_m2: number;
  projeto_pavimentos: number;
  projeto_piscina: string | null;
  projeto_padrao: PadraoAcabamento;

  valor_min: number;
  valor_max: number;
  valor_m2_min: number;
  valor_m2_max: number;
  regime_recomendado: RegimeRecomendado;
  data_cotacao: string;

  data_elaboracao: string;
  validade_dias: number;

  hero_image_url: string | null;
  condicionantes_extras: CondicionanteExtra[];
  exclusoes_extras: ExclusaoExtra[];
  entrega_categorias_ativas: CardEntregaId[];
  responsavel_tecnico: string | null;

  pdf_url: string | null;
  pdf_storage_path: string | null;

  criado_em: string;
  atualizado_em: string;
  criado_por: string | null;
}

export type OrcamentoInsert = Omit<
  Orcamento,
  "id" | "numero" | "slug" | "criado_em" | "atualizado_em"
> & {
  id?: string;
  numero?: string;
  slug?: string;
};

export type OrcamentoUpdate = Partial<
  Omit<Orcamento, "id" | "numero" | "criado_em">
>;

export interface OrcamentoListItem {
  id: string;
  numero: string;
  status: OrcamentoStatus;
  cliente_nome: string;
  obra_cidade: string;
  projeto_area_m2: number;
  valor_min: number;
  valor_max: number;
  data_elaboracao: string;
  pdf_url: string | null;
  criado_em: string;
}

export interface PlanilhaOrcamentoRow {
  cliente_nome: string;
  cliente_email?: string;
  cliente_telefone?: string;
  obra_endereco: string;
  obra_cidade: string;
  obra_referencia?: string;
  area_m2: number;
  pavimentos: number;
  piscina?: string;
  padrao_acabamento: PadraoAcabamento;
  valor_min: number;
  valor_max: number;
  valor_m2_min: number;
  valor_m2_max: number;
  regime_recomendado: RegimeRecomendado;
  data_cotacao: string;
  validade_dias?: number;
  responsavel_tecnico?: string;
}

export const PLANILHA_COLUNAS: readonly (keyof PlanilhaOrcamentoRow)[] = [
  "cliente_nome",
  "cliente_email",
  "cliente_telefone",
  "obra_endereco",
  "obra_cidade",
  "obra_referencia",
  "area_m2",
  "pavimentos",
  "piscina",
  "padrao_acabamento",
  "valor_min",
  "valor_max",
  "valor_m2_min",
  "valor_m2_max",
  "regime_recomendado",
  "data_cotacao",
  "validade_dias",
  "responsavel_tecnico",
] as const;

export const PLANILHA_COLUNAS_OBRIGATORIAS: readonly (keyof PlanilhaOrcamentoRow)[] = [
  "cliente_nome",
  "obra_endereco",
  "obra_cidade",
  "area_m2",
  "pavimentos",
  "padrao_acabamento",
  "valor_min",
  "valor_max",
  "valor_m2_min",
  "valor_m2_max",
  "regime_recomendado",
  "data_cotacao",
] as const;

export const CARDS_ENTREGA_DEFAULT: CardEntregaId[] = [
  "engenharia",
  "suprimentos",
  "fornecedores",
  "planejamento",
  "relatorios",
  "qualidade",
  "seguranca",
  "canteiro",
  "garantia",
];
