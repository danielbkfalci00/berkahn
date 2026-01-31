// Tipos para a pagina de orcamento premium
// Extends patterns de types/admin.ts

import type { ProposalStatus } from "./admin";

// ============================================
// CLIENTE
// ============================================

export interface OrcamentoCliente {
  nome: string;
  email?: string;
  telefone?: string;
  endereco?: string;
}

// ============================================
// PROJETO
// ============================================

export interface ComodoMetragem {
  nome: string;
  area: number;
  categoria: "social" | "intimo" | "servico" | "circulacao";
}

export interface PlantaProjeto {
  src: string;
  alt: string;
  tipo: "planta-baixa" | "corte" | "fachada" | "3d";
}

export interface ProjetoPreliminar {
  metragemComodos: ComodoMetragem[];
  metragemTotal: number;
  areaUtil?: number;
  observacoes?: string;
  plantas?: PlantaProjeto[];
}

export interface CamadaVedacao {
  numero: number;
  material: string;
  especificacao: string;
  funcao: "impermeabilizacao" | "estrutural" | "acabamento" | "isolamento";
}

export interface VedacaoDetalhada {
  camadas: CamadaVedacao[];
  espessuraTotal?: string;
}

export interface MetodologiaConstrutiva {
  estruturacao: string;
  vedacaoExterna: VedacaoDetalhada;
  vedacaoInterna: string;
  isolamentoTermico?: string;
  descricaoGeral?: string;
}

export interface EtapaGerenciamento {
  fase: string;
  titulo: string;
  descricao: string;
  entregas: string[];
  prazo?: string;
  icone?: string;
}

export interface PlanoGerenciamento {
  titulo: string;
  etapas: EtapaGerenciamento[];
  observacoes?: string[];
}

export interface OrcamentoProjeto {
  titulo: string; // Ex: "Residencia Familia Silva"
  tipo: "residencial" | "comercial" | "industrial";
  subtipo?: string; // Ex: "casa", "sobrado", "galpao"
  cliente?: string; // Nome do cliente
  localizacao?: string;
  metragem: number; // m2
  terreno?: {
    largura: number;
    comprimento: number;
    declive?: "plano" | "leve" | "acentuado";
  };
  imagemRender?: string; // URL da imagem 3D
  // Campos estendidos para projetos detalhados
  projetoPreliminar?: ProjetoPreliminar;
  metodologia?: MetodologiaConstrutiva;
  planoGerenciamento?: PlanoGerenciamento;
}

// ============================================
// PACOTES DE INVESTIMENTO (Good-Better-Best)
// ============================================

export type PacoteId =
  | "material-somente"
  | "material-treinamento-suporte"
  | "material-acompanhamento-berkahn"
  // Legacy IDs for backwards compatibility
  | "material"
  | "suporte"
  | "fullservice"
  | "material-treinamento"
  | "material-treinamento-acompanhamento";

export interface ItemIncluso {
  categoria: "estrutura" | "acabamento" | "instalacoes" | "extras";
  descricao: string;
  incluso: boolean;
}

export interface ResumoItem {
  nome: string;
  valor: number;
}

export interface PacoteInvestimento {
  id: PacoteId;
  nome: string;
  destaque: boolean; // true para "Mais Popular"
  descricao: string;
  valorTotal: number;
  valorM2: number;
  itens: string[]; // Lista simplificada
  itensDetalhados?: ItemIncluso[]; // Lista detalhada
  diferenciais?: string[]; // O que adiciona vs pacote anterior
  resumo?: ResumoItem[]; // Resumo com valores
  cronograma: string; // Ex: "120 dias"
  garantia: string; // Ex: "10 anos estrutura"
  // Novos campos premium
  imagemRepresentativa?: string; // URL da imagem do pacote
  progressoCompletude: number; // 40, 70, 100 - nível de completude visual
  comparativoAnterior?: string[]; // Diferenças vs pacote anterior
}

// ============================================
// PREMISSAS DA PROPOSTA
// ============================================

export interface PremissasProposta {
  dataValidade: string;
  condicoesTerreno: string[]; // Ex: ["Terreno plano", "Acesso para caminhao"]
  itensInclusos: string[];
  itensExclusos: string[];
  observacoes?: string[];
}

// ============================================
// CONDICOES DE PAGAMENTO
// ============================================

export interface ParcelaPagamento {
  numero: number;
  percentual: number;
  vinculoEtapa?: string;
  descricao?: string;
  prazo?: string;
}

export interface EstruturaPagamento {
  sinal?: {
    percentual: number;
    descricao: string;
  };
  parcelas?: ParcelaPagamento[];
  observacoes?: string[];
}

export interface CondicaoPagamento {
  id: string;
  titulo: string; // Ex: "A vista com 5% desconto"
  parcelas?: number;
  desconto?: number; // Percentual
  destaque?: boolean;
  descricao?: string;
  // Campos estendidos para pagamento estruturado
  estruturaPagamento?: EstruturaPagamento;
  tipoFaturamento?: "direto" | "parcelado" | "financiamento";
  observacoesPagamento?: string[];
}

// ============================================
// CREDENCIAIS DA EMPRESA
// ============================================

export interface Certificacao {
  sigla: string; // Ex: "ABNT NBR 16970"
  titulo: string;
  descricao?: string;
}

export interface CredenciaisBerkahn {
  anosExperiencia: number;
  projetosEntregues: number;
  m2Construidos: number;
  satisfacaoClientes: number;
  certificacoes: Certificacao[];
}

// ============================================
// ORCAMENTO COMPLETO
// ============================================

export interface Orcamento {
  id: string;
  numero: string; // Ex: "BRK-2026-0042"
  cliente: OrcamentoCliente;
  projeto: OrcamentoProjeto;
  pacotes: PacoteInvestimento[];
  premissas: PremissasProposta;
  condicoesPagamento: CondicaoPagamento[];
  status: ProposalStatus;
  criadoEm: string;
  validoAte: string;
}

// ============================================
// STATS PARA DISPLAY
// ============================================

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

// ============================================
// COMPARATIVO LSF
// ============================================

export interface ComparativoItem {
  criterio: string;
  lsf: string;
  tradicional: string;
  vencedor: "lsf" | "tradicional" | "empate";
}

// ============================================
// PROXIMOS PASSOS (CTA)
// ============================================

export interface ProximoPasso {
  numero: number;
  titulo: string;
  descricao: string;
}

// ============================================
// TIMELINE DA OBRA
// ============================================

export interface TimelineEtapa {
  numero: number;
  titulo: string;
  descricao: string;
  icone: string; // Nome do ícone Lucide
  duracaoEstimada: string; // Ex: "2 semanas"
}

// ============================================
// MINI GALERIA PROJETOS
// ============================================

export interface ProjetoGaleria {
  id: string;
  titulo: string;
  imagem: string;
  categoria: string;
  metragem?: number;
}

// ============================================
// SEÇÃO PREMISSAS UNIFICADAS - Estruturas Específicas
// ============================================

export interface ComodoMetragem2 {
  nome: string;
  area: number;
}

export interface ChaleProjeto {
  titulo: string;
  metragem: number;
  imagens: {
    prototipo: string[];
    plantasBaixas: { src: string; label: string }[];
    elevacoes: { src: string; label: string }[];
  };
  comodos: ComodoMetragem2[];
}

export interface ItemMetodologia {
  letra: string;
  titulo: string;
  descricao: string;
}

export interface MetodologiaConstrutivaPremissas {
  imagemTecnica: string;
  itens: ItemMetodologia[];
}

export interface MaterialAnalise {
  letra: string;
  categoria: string;
  especificacao: string;
}

// Nova estrutura hierárquica para materiais detalhados
export interface MaterialItemDetalhado {
  item: string; // "1", "1.1", "2.1.1", etc.
  descricao: string;
  unidade?: string; // "un", "m2", etc. (vazio para categorias)
  quantidade?: string; // "1,00", "101,00", "Incluso", etc.
  custoUnitarioMat?: number; // Custo unitário material (R$)
  custoUnitarioMO?: number; // Custo unitário mão de obra (R$)
  valorTotal?: number | string; // Valor total numérico ou "INCLUSO"
  isCategoria?: boolean; // true para categorias principais (1, 2, 3)
  isSubcategoria?: boolean; // true para subcategorias (2.1, 2.2, 2.3)
}

export interface ImpostoInfo {
  cnae: string;
  anexo: string;
  faixaDescricao: string;
  aliquotaNominal: string;
  aliquotaEfetiva: number;
  valorTotal: number;
}

// ============================================
// COMPANY STORY - Storytelling Humanizado
// ============================================

export interface TimelineMilestone {
  year: number;
  milestone: string;
  image?: string;
  isHighlight?: boolean;
}

export interface InsightProof {
  type: 'project' | 'testimonial' | 'metric';
  name?: string;
  quote?: string;
  image?: string;
  value?: string;
  label?: string;
}

export interface Insight {
  title: string;
  subtitle: string;
  description: string;
  proof: InsightProof;
}

export interface TestimonialContext {
  type: string;
  name?: string;
  project?: string;
  quote?: string;
  image?: string;
}

export interface StatWithContext {
  value: number;
  suffix: string;
  label: string;
  context: string | TestimonialContext;
  visualization: 'timeline' | 'grid-of-houses' | 'project-gallery' | 'quote-card';
}

export interface CertificationExplained {
  sigla: string;
  benefits: string[];
  whyItMatters: string;
}

export interface CompanyStory {
  founding: {
    year: number;
    motivation: string;
    firstProject: {
      name: string;
      image: string;
      insight: string;
    };
  };
  timeline: TimelineMilestone[];
  insights: Insight[];
  statsWithContext: StatWithContext[];
  certificationsExplained: CertificationExplained[];
}
