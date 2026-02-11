// Dados estaticos para pagina de orcamento
// Segue padrao de lib/lsf-data.ts

import type {
  OrcamentoProjeto,
  PacoteInvestimento,
  PremissasProposta,
  CondicaoPagamento,
  CredenciaisBerkahn,
  StatItem,
  ComparativoItem,
  ProximoPasso,
  TimelineEtapa,
  ProjetoGaleria,
  // Tipos estendidos para projetos detalhados
  ComodoMetragem,
  PlantaProjeto,
  MetodologiaConstrutiva,
  PlanoGerenciamento,
  EstruturaPagamento,
  // Novos tipos para Premissas Unificadas
  ChaleProjeto,
  MetodologiaConstrutivaPremissas,
  MaterialAnalise,
  MaterialItemDetalhado,
  ImpostoInfo,
  // Company Story - Storytelling Humanizado
  CompanyStory,
} from "@/types/orcamento";

// Reutiliza dados de comparativo do LSF
import { COMPARISON_DATA } from "./lsf-data";
export { COMPARISON_DATA };

// ============================================
// PROJETO TEMPLATE - CHALÉ JOHNY
// ============================================

export const PROJETO_TEMPLATE: OrcamentoProjeto = {
  titulo: "Chalé Johny",
  tipo: "residencial",
  subtipo: "chale",
  cliente: "Johny",
  metragem: 44,
  localizacao: "São Roque - SP",
  imagemRender: "/images/orcamento/hero-chale-retangulo.webp",

  // Projeto Preliminar com metragens
  projetoPreliminar: {
    metragemTotal: 44,
    areaUtil: 44,
    metragemComodos: [
      { nome: "Quarto", area: 10, categoria: "intimo" },
      { nome: "Banheiro", area: 6, categoria: "servico" },
      { nome: "Sala", area: 28, categoria: "social" },
    ],
    observacoes: "Metragens aproximadas conforme projeto preliminar",
  },

  // Metodologia Construtiva
  metodologia: {
    estruturacao: "Estruturação da casa em Light Steel Frame",
    vedacaoExterna: {
      camadas: [
        {
          numero: 1,
          material: "Manta Hidrófuga",
          especificacao: "Membrana impermeável para proteção externa",
          funcao: "impermeabilizacao",
        },
        {
          numero: 2,
          material: "Placa Aquapanel",
          especificacao: "Placa cimentícia resistente à umidade",
          funcao: "estrutural",
        },
        {
          numero: 3,
          material: "Argamassa Polimérica",
          especificacao: "Basecoat polimérico para acabamento",
          funcao: "acabamento",
        },
      ],
      espessuraTotal: "~25mm",
    },
    vedacaoInterna: "Placas de gesso acartonado com tratamento acústico",
    isolamentoTermico: "Lã de Rocha 50mm entre perfis",
    descricaoGeral:
      "Sistema construtivo em Light Steel Frame com vedação externa impermeável multicamada e vedação interna com isolamento térmico e acústico de alta performance.",
  },

  // Plano de Gerenciamento Berkahn
  planoGerenciamento: {
    titulo: "Plano de Gerenciamento Berkahn",
    etapas: [
      {
        fase: "aceite",
        titulo: "Aceite da Proposta",
        descricao: "Assinatura do contrato e início do relacionamento",
        entregas: ["Contrato assinado", "Pagamento do sinal (50%)"],
        prazo: "1 dia",
        icone: "FileCheck",
      },
      {
        fase: "desenvolvimento",
        titulo: "Desenvolvimento do Projeto Executivo",
        descricao:
          "Projeto executivo de arquitetura: localização das calhas, pontos de elétrica, pontos de água, remodelagem do projeto de steel com furações e caimentos corretos",
        entregas: [
          "Projeto executivo completo",
          "Memoriais descritivos",
          "Detalhamentos técnicos",
        ],
        prazo: "2-3 semanas",
        icone: "Pencil",
      },
      {
        fase: "aprovacao",
        titulo: "Aprovação do Projeto Executivo",
        descricao: "Validação final do cliente e ajustes necessários",
        entregas: [
          "Aprovação formal do cliente",
          "Cronograma detalhado aprovado",
        ],
        prazo: "3-5 dias",
        icone: "CheckCircle2",
      },
      {
        fase: "producao",
        titulo: "Produção e Construção",
        descricao: "Execução do escopo contratado conforme projeto aprovado",
        entregas: [
          "Estrutura LSF montada",
          "Vedações externas e internas",
          "Cobertura instalada",
        ],
        prazo: "Conforme cronograma do pacote",
        icone: "Building2",
      },
    ],
    observacoes: [
      "Acompanhamento com relatórios fotográficos",
      "Medições conforme etapas concluídas",
      "Comunicação direta via WhatsApp durante toda a obra",
    ],
  },
};

// ============================================
// PACOTES DE INVESTIMENTO - CHALÉ JOHNY (3 opções)
// ============================================

export const PACOTES_TEMPLATE: PacoteInvestimento[] = [
  // PROPOSTA 1: Somente Materiais (Mais Simples)
  {
    id: "material-somente",
    nome: "Somente Materiais",
    destaque: false,
    descricao:
      "Fornecimento completo de materiais certificados para construção em Steel Frame",
    valorM2: 2062,
    valorTotal: 90724.93,
    itens: [
      "Perfis Steel Frame certificados ABNT NBR 15253",
      "Placas Aquapanel (cimentícia) para vedação externa",
      "Manta hidrófuga Tyvek para impermeabilização",
      "Argamassa polimérica (basecoat) para acabamento",
      "Lã de rocha 50mm para isolamento térmico e acústico",
      "Sistema de cobertura completo (telhas e estrutura)",
      "Parafusos e fixações especializadas (autoperfurantes)",
      "Fitas para juntas e acabamentos",
      "Manual de montagem digital em PDF",
    ],
    resumo: [
      { nome: "Estrutura", valor: 41618.50 },
      { nome: "Revestimento Externo Paredes e Forro Externo", valor: 28083.92 },
      { nome: "Revestimento Interno Paredes e Forro Interno", valor: 9649.01 },
      { nome: "Cobertura", valor: 11373.50 },
    ],
    cronograma: "Entrega em 30 dias úteis",
    garantia: "5 anos materiais certificados",
    imagemRepresentativa: "/images/Services/projetos-prontos/Chalé/chale_interior_1.webp",
    progressoCompletude: 30,
  },

  // PROPOSTA 2: Material + Treinamento (Intermediária)
  {
    id: "material-treinamento-suporte",
    nome: "Material + Treinamento",
    destaque: false,
    descricao:
      "Material completo + treinamento técnico presencial para capacitação da equipe de obra",
    valorM2: 2088,
    valorTotal: 92324.93,
    itens: [
      "Perfis Steel Frame certificados ABNT NBR 15253",
      "Placas Aquapanel (cimentícia) para vedação externa",
      "Manta hidrófuga Tyvek para impermeabilização",
      "Argamassa polimérica (basecoat) para acabamento",
      "Lã de rocha 50mm para isolamento térmico e acústico",
      "Sistema de cobertura completo (telhas e estrutura)",
      "Parafusos e fixações especializadas (autoperfurantes)",
      "Fitas para juntas e acabamentos",
      "Treinamento técnico presencial de 2 dias (até 6 pessoas)",
      "Manual de montagem digital completo",
      "Certificado de conclusão do treinamento",
    ],
    resumo: [
      { nome: "Estrutura", valor: 41618.50 },
      { nome: "Revestimento Externo Paredes e Forro Externo", valor: 28083.92 },
      { nome: "Revestimento Interno Paredes e Forro Interno", valor: 9649.01 },
      { nome: "Cobertura", valor: 11373.50 },
      { nome: "Mão de Obra", valor: 1600.00 },
    ],
    cronograma: "Entrega 30 dias + 2 dias treinamento",
    garantia: "5 anos materiais + suporte técnico",
    imagemRepresentativa: "/images/orcamento/chale-prototipo-2.webp",
    progressoCompletude: 70,
  },

  // PROPOSTA 3: Material + Treinamento + Acompanhamento Berkahn (MAIS POPULAR)
  {
    id: "material-acompanhamento-berkahn",
    nome: "Material + Treinamento + Acompanhamento Berkahn",
    destaque: true, // ⭐ MAIS POPULAR
    descricao:
      "Solução completa: material certificado + acompanhamento técnico Berkahn durante toda obra + treinamento personalizado pela equipe Berkahn",
    valorM2: 2140,
    valorTotal: 95524.93,
    itens: [
      "Perfis Steel Frame certificados ABNT NBR 15253",
      "Placas Aquapanel (cimentícia) para vedação externa",
      "Manta hidrófuga Tyvek para impermeabilização",
      "Argamassa polimérica (basecoat) para acabamento",
      "Lã de rocha 50mm para isolamento térmico e acústico",
      "Sistema de cobertura completo (telhas e estrutura)",
      "Parafusos e fixações especializadas (autoperfurantes)",
      "Fitas para juntas e acabamentos",
      "Treinamento técnico presencial de 2 dias (até 6 pessoas)",
      "Treinamento personalizado Berkahn (3 dias intensivos)",
      "Acompanhamento técnico Berkahn durante toda a obra",
      "Engenheiro Berkahn responsável pelo projeto",
      "Visitas técnicas semanais na obra",
      "Relatórios técnicos semanais com fotos e progresso",
      "Validação de qualidade em cada etapa construtiva",
      "Suporte remoto ilimitado por 12 meses",
      "Certificado Berkahn de conclusão",
    ],
    resumo: [
      { nome: "Estrutura", valor: 41618.50 },
      { nome: "Revestimento Externo Paredes e Forro Externo", valor: 28083.92 },
      { nome: "Revestimento Interno Paredes e Forro Interno", valor: 9649.01 },
      { nome: "Cobertura", valor: 11373.50 },
      { nome: "Mão de Obra", valor: 4800.00 },
    ],
    cronograma: "Entrega 30 dias + acompanhamento completo durante execução",
    garantia: "10 anos estrutura + 2 anos acompanhamento técnico",
    imagemRepresentativa: "/images/orcamento/chale-prototipo-1.webp",
    progressoCompletude: 100,
    comparativoAnterior: [
      "Acompanhamento durante toda obra",
      "Engenheiro Berkahn dedicado",
      "Treinamento personalizado 3 dias",
      "Visitas técnicas semanais",
      "Relatórios com fotos",
      "Suporte ilimitado 12 meses",
    ],
  },
];

// ============================================
// PREMISSAS DA PROPOSTA - CHALÉ JOHNY
// ============================================

export const PREMISSAS_TEMPLATE: PremissasProposta = {
  dataValidade: "20 dias",
  condicoesTerreno: [
    "Terreno plano ou com declive leve (até 5%)",
    "Acesso para caminhão de entrega de materiais",
    "Ponto de energia disponível no local",
    "Ponto de água disponível no local",
  ],
  itensInclusos: [
    "Todos os insumos necessários que viabilizam a execução do escopo contratado",
    "Alimentação para equipe técnica",
    "Estadia para equipe técnica (se necessário)",
  ],
  itensExclusos: [
    "Acabamento da parede (interna e externa) - exemplo: pintura",
    "Chapas OSB",
    "Calhas do telhado",
    "Instalações elétricas completas",
    "Piso e revestimentos",
    "Deck externo",
    "Instalações hidráulicas completas",
    "Esquadrias (portas e janelas)",
    "Fundação (radier ou sapata)",
  ],
  observacoes: [
    "Valores sujeitos a análise técnica do terreno",
    "Prazo contado a partir da aprovação do projeto executivo",
    "Medições mensais conforme cronograma acordado",
    "Proposta válida por 20 dias",
  ],
};

// ============================================
// CONDICOES DE PAGAMENTO - CHALÉ JOHNY
// ============================================

export const CONDICOES_PAGAMENTO: CondicaoPagamento[] = [
  {
    id: "parcelado",
    titulo: "Pagamento Parcelado",
    destaque: true,
    descricao: "Sinal de 33,3% + 2 parcelas de 33,3%",
    tipoFaturamento: "direto",
    estruturaPagamento: {
      sinal: {
        percentual: 33.3,
        descricao: "Na aprovação do contrato",
      },
      parcelas: [
        {
          numero: 1,
          percentual: 33.3,
          descricao: "1ª Parcela",
        },
        {
          numero: 2,
          percentual: 33.3,
          descricao: "2ª Parcela",
        },
      ],
    },
    observacoesPagamento: [
      "Forma de pagamento: Faturamento direto via nota fiscal",
      "Prazo de pagamento: 10 dias úteis após emissão da NF",
    ],
  },
];

// ============================================
// CREDENCIAIS BERKAHN
// ============================================

export const CREDENCIAIS_BERKAHN: CredenciaisBerkahn = {
  anosExperiencia: 20, // Combinados dos fundadores
  projetosEntregues: 0, // Honestidade: empresa nascente
  m2Construidos: 0,
  satisfacaoClientes: 0,
  certificacoes: [], // Sem certificações ainda
};

// ============================================
// COMPANY STORY - Storytelling Humanizado
// ============================================

export const COMPANY_STORY: CompanyStory = {
  founding: {
    year: 2026,
    motivation: "Unir duas décadas de aprendizado em construção para criar algo diferente",
    firstProject: {
      name: "Chalé Johny",
      image: "/images/orcamento/chale-prototipo-1.webp",
      insight: "Seu projeto é onde essa história começa",
    },
  },

  timeline: [
    {
      year: 2006,
      milestone: "Primeiro contato com Steel Frame",
      image: "/images/orcamento/chale-prototipo-2.webp",
    },
    {
      year: 2015,
      milestone: "Especialização em métodos construtivos",
      image: "/images/orcamento/chale-prototipo-3.webp",
    },
    {
      year: 2026,
      milestone: "Nasce a Berkahn",
      isHighlight: true,
    },
  ],

  insights: [
    {
      title: "Previsibilidade",
      subtitle: "A maior surpresa é não ter surpresas",
      description:
        "Steel Frame não depende de clima, cura de concreto, ou 'vamos ver como fica'. Seu cronograma não é uma estimativa. É um compromisso.",
      proof: {
        type: "metric",
        value: "99%",
        label: "de precisão orçamentária no método Steel Frame",
      },
    },
    {
      title: "Transparência",
      subtitle: "Você sabe exatamente o que está pagando",
      description:
        "Orçamento fechado antes de começar. Sem 'custos extras' no meio do caminho. Cada item detalhado, cada etapa documentada.",
      proof: {
        type: "metric",
        value: "100%",
        label: "dos itens especificados em contrato",
      },
    },
    {
      title: "Parceria",
      subtitle: "Construímos juntos",
      description:
        "Estamos com você da aprovação do projeto à entrega das chaves. Fotos diárias, reuniões semanais, comunicação direta com quem executa.",
      proof: {
        type: "metric",
        value: "20",
        label: "anos de experiência combinada",
      },
    },
  ],

  statsWithContext: [
    {
      value: 20,
      suffix: "",
      label: "ANOS DE APRENDIZADO COMBINADOS",
      context: "Duas décadas de experiência em construção que agora trabalham para você",
      visualization: "timeline",
    },
  ],

  certificationsExplained: [],
};

// ============================================
// STATS PARA DISPLAY
// ============================================

export const STATS_CREDIBILIDADE: StatItem[] = [
  { value: 20, suffix: "+", label: "Anos de aprendizado combinados" },
];

// ============================================
// COMPARATIVO LSF (SIMPLIFICADO PARA ORCAMENTO)
// ============================================

export const COMPARATIVO_ORCAMENTO: ComparativoItem[] = [
  {
    criterio: "Tempo de obra",
    lsf: "Ate 6x mais rapido",
    tradicional: "Longo prazo",
    vencedor: "lsf",
  },
  {
    criterio: "Precisao orcamentaria",
    lsf: "99% de precisao",
    tradicional: "Variacoes frequentes",
    vencedor: "lsf",
  },
  {
    criterio: "Desperdicio de materiais",
    lsf: "Menos de 3%",
    tradicional: "15-25%",
    vencedor: "lsf",
  },
  {
    criterio: "Conforto termico",
    lsf: "Isolamento superior",
    tradicional: "Isolamento basico",
    vencedor: "lsf",
  },
  {
    criterio: "Sustentabilidade",
    lsf: "90% reciclavel",
    tradicional: "Baixa reciclagem",
    vencedor: "lsf",
  },
  {
    criterio: "Durabilidade",
    lsf: "+100 anos",
    tradicional: "50-70 anos",
    vencedor: "lsf",
  },
];

// ============================================
// BENEFICIOS LSF (STATS VISUAIS)
// ============================================

export const BENEFICIOS_LSF_STATS: StatItem[] = [
  { value: 6, suffix: "x", label: "Mais rapido" },
  { value: 90, suffix: "%", label: "Menos agua" },
  { value: 400, suffix: "%", label: "Menos entulho" },
  { value: 100, suffix: "+", label: "Anos de vida util" },
];

// ============================================
// PROXIMOS PASSOS (CTA)
// ============================================

export const PROXIMOS_PASSOS: ProximoPasso[] = [
  {
    numero: 1,
    titulo: "Escolha seu pacote",
    descricao: "Analise as opcoes e selecione o pacote ideal para seu projeto",
  },
  {
    numero: 2,
    titulo: "Agende visita tecnica",
    descricao:
      "Nossa equipe ira ao terreno para validar as premissas do orcamento",
  },
  {
    numero: 3,
    titulo: "Inicie sua obra",
    descricao: "Apos aprovacao do projeto, comecamos a construir seu sonho",
  },
];

// ============================================
// CONTATOS
// ============================================

export const CONTATOS = {
  whatsapp: "5511966415742",
  telefone: "(11) 96641-5742",
  email: "contato@berkahn.com.br",
  endereco: "Sao Paulo, SP",
  cnpj: "39.455.932/0001-64",
};

// ============================================
// TIMELINE DA OBRA
// ============================================

export const TIMELINE_ETAPAS: TimelineEtapa[] = [
  {
    numero: 1,
    titulo: "Projeto",
    descricao: "Desenvolvimento dos projetos arquitetonico e estrutural",
    icone: "Pencil",
    duracaoEstimada: "3-4 semanas",
  },
  {
    numero: 2,
    titulo: "Aprovacoes",
    descricao: "Aprovacao na prefeitura e obtencao de alvara",
    icone: "FileCheck",
    duracaoEstimada: "4-6 semanas",
  },
  {
    numero: 3,
    titulo: "Fundacao",
    descricao: "Execucao do radier e infraestrutura basica",
    icone: "Layers",
    duracaoEstimada: "2 semanas",
  },
  {
    numero: 4,
    titulo: "Estrutura",
    descricao: "Montagem da estrutura em Steel Frame",
    icone: "Building2",
    duracaoEstimada: "3-4 semanas",
  },
  {
    numero: 5,
    titulo: "Acabamentos",
    descricao: "Instalacoes, revestimentos e finalizacoes",
    icone: "Paintbrush",
    duracaoEstimada: "4-6 semanas",
  },
  {
    numero: 6,
    titulo: "Entrega",
    descricao: "Vistoria final e entrega das chaves",
    icone: "Key",
    duracaoEstimada: "1 semana",
  },
];

// ============================================
// MINI GALERIA PROJETOS
// ============================================

export const PROJETOS_GALERIA: ProjetoGaleria[] = [
  {
    id: "1",
    titulo: "Casa Alphaville",
    imagem: "/images/galeria/projeto-01.webp",
    categoria: "Residencial",
    metragem: 280,
  },
  {
    id: "2",
    titulo: "Residencia Granja Viana",
    imagem: "/images/galeria/projeto-05.webp",
    categoria: "Residencial",
    metragem: 320,
  },
  {
    id: "3",
    titulo: "Casa Cotia",
    imagem: "/images/galeria/projeto-08.webp",
    categoria: "Residencial",
    metragem: 180,
  },
];

// ============================================
// PREMISSAS UNIFICADAS - DADOS ESPECÍFICOS
// ============================================

export const CHALE_PROJETO: ChaleProjeto = {
  titulo: "CHALÉ (01)",
  metragem: 44,
  imagens: {
    prototipo: [
      "/images/orcamento/chale-prototipo-1.webp",
      "/images/orcamento/chale-prototipo-2.webp",
      "/images/orcamento/chale-prototipo-3.webp",
      "/images/orcamento/chale-prototipo-4.webp",
    ],
    plantasBaixas: [
      { src: "/images/orcamento/chale-planta-01.webp", label: "PLANTA BAIXA TÉRREO" },
      { src: "/images/orcamento/chale-planta-cobertura.webp", label: "PLANTA BAIXA COBERTURA" },
    ],
    elevacoes: [
      {
        src: "/images/orcamento/chale-elevacao-norte.webp",
        label: "ELEVAÇÃO NORTE",
      },
      { src: "/images/orcamento/chale-elevacao-sul.webp", label: "ELEVAÇÃO SUL" },
      {
        src: "/images/orcamento/chale-elevacao-leste.webp",
        label: "ELEVAÇÃO LESTE",
      },
      {
        src: "/images/orcamento/chale-elevacao-oeste.webp",
        label: "ELEVAÇÃO OESTE",
      },
    ],
  },
  comodos: [
    { nome: "Quarto", area: 10 },
    { nome: "Banheiro", area: 6 },
    { nome: "Sala", area: 28 },
  ],
};

export const METODOLOGIA_LSF: MetodologiaConstrutivaPremissas = {
  imagemTecnica: "/images/orcamento/estrutura-lsf.webp",
  itens: [
    {
      letra: "A",
      titulo: "Superestrutura e vedação do projeto",
      descricao: "Light Steel Frame",
    },
    {
      letra: "B",
      titulo: "Sistema de Vedação externa",
      descricao: "Aquapanel + Basecoat (2 demãos)",
    },
    {
      letra: "C",
      titulo: "Emplacamento Interno",
      descricao: "Isolamento térmico (Lã de vidro) + Placa de Gesso",
    },
    {
      letra: "D",
      titulo: "Fechamento da cobertura",
      descricao: "Telha sanduíche",
    },
  ],
};

export const MATERIAIS_ANALITICOS: MaterialAnalise[] = [
  {
    letra: "A",
    categoria: "Estruturação da casa em Light Steel Frame",
    especificacao: "Perfis estruturais em aço galvanizado com proteção anticorrosiva",
  },
  {
    letra: "B",
    categoria: "Vedação Externa em Light Steel Frame",
    especificacao: "Manta Hidrófuga + Placa Aquapanel + Argamassa Polimérica (basecoat com 2 demãos)",
  },
  {
    letra: "C",
    categoria: "Vedação Interna",
    especificacao: "Isolamento térmico em Lã de Rocha + Placa de Gesso acartonado",
  },
  {
    letra: "D",
    categoria: "Cobertura em telha sanduíche",
    especificacao: "Telha termoacústica com núcleo de poliuretano ou poliestireno expandido",
  },
  {
    letra: "E",
    categoria: "Fechamento de forro",
    especificacao: "Forro em gesso acartonado com tratamento acústico conforme projeto",
  },
];

// Nova estrutura detalhada com hierarquia (conforme planilha)
export const MATERIAIS_DETALHADOS: MaterialItemDetalhado[] = [
  // 1. Projetos
  {
    item: "1.",
    descricao: "Projetos",
    isCategoria: true,
  },
  {
    item: "1.1",
    descricao: "Projeto Estrutural Light Steel Frame",
    unidade: "un",
    quantidade: "1,00",
    valorTotal: "INCLUSO",
  },
  // 2. Material
  {
    item: "2.",
    descricao: "Material",
    isCategoria: true,
    valorTotal: 90724.93,
  },
  // 2.1 Estrutura
  {
    item: "2.1",
    descricao: "Estrutura",
    isSubcategoria: true,
    valorTotal: 41618.50,
  },
  {
    item: "2.1.1",
    descricao: "Estrutura em LSF - Aço galvanizado ZAR400 Z350",
    unidade: "un",
    quantidade: "1,00",
    custoUnitarioMat: 41618.50,
    custoUnitarioMO: 0,
    valorTotal: 41618.50,
  },
  // 2.2 Revestimento Externo e Interno Paredes
  {
    item: "2.2",
    descricao: "Revestimento Externo e Interno Paredes",
    isSubcategoria: true,
    valorTotal: 32231.80,
  },
  {
    item: "2.2.1",
    descricao: "Aquapanel Residential 8mm",
    unidade: "m²",
    quantidade: "101,00",
    custoUnitarioMat: 223.59,
    custoUnitarioMO: 0,
    valorTotal: 22582.79,
  },
  {
    item: "2.2.2",
    descricao: "Chapa de Gesso ST Knauf 1200 1800 12,5mm",
    unidade: "m²",
    quantidade: "115,00",
    custoUnitarioMat: 50.81,
    custoUnitarioMO: 0,
    valorTotal: 5842.82,
  },
  {
    item: "2.2.3",
    descricao: "Chapa de Gesso RU 1200 1800 12,55mm",
    unidade: "m²",
    quantidade: "60,00",
    custoUnitarioMat: 63.44,
    custoUnitarioMO: 0,
    valorTotal: 3806.19,
  },
  // 2.3 Forros de Gesso
  {
    item: "2.3",
    descricao: "Forros de Gesso",
    isSubcategoria: true,
    valorTotal: 5501.13,
  },
  {
    item: "2.3.1",
    descricao: "Forro Leve KNAUF",
    unidade: "m²",
    quantidade: "70,00",
    custoUnitarioMat: 78.59,
    custoUnitarioMO: 0,
    valorTotal: 5501.13,
  },
  // 2.4 Cobertura
  {
    item: "2.4",
    descricao: "Cobertura",
    isSubcategoria: true,
    valorTotal: 11373.50,
  },
  {
    item: "2.4.1",
    descricao: "Telha Sanduiche Trapezoidal Kingspan/Perfilor",
    unidade: "m²",
    quantidade: "86,00",
    custoUnitarioMat: 132.25,
    custoUnitarioMO: 0,
    valorTotal: 11373.50,
  },
  // 3. Mão de Obra
  {
    item: "3.",
    descricao: "MÃO DE OBRA",
    isCategoria: true,
    valorTotal: 4800.00,
  },
  // 3.1 Treinamento Presencial
  {
    item: "3.1",
    descricao: "Treinamento Presencial",
    isSubcategoria: true,
    valorTotal: 1600.00,
  },
  {
    item: "3.2",
    descricao: "1 dia de treinamento + 1 dia de acompanhamento inicial",
    unidade: "dia",
    quantidade: "2,00",
    custoUnitarioMat: 800.00,
    valorTotal: 1600.00,
  },
  // 3.3 Acompanhamento Técnico de Obra
  {
    item: "3.3",
    descricao: "Acompanhamento Técnico de Obra",
    isSubcategoria: true,
    valorTotal: 3200.00,
  },
  {
    item: "3.4",
    descricao: "Acompanhamento contínuo da equipe durante execução",
    unidade: "mês",
    quantidade: "1,00",
    custoUnitarioMat: 3200.00,
    valorTotal: 3200.00,
  },
];

// Informações de Tributação
export const IMPOSTO_INFO: ImpostoInfo = {
  cnae: "71.12-0-00 - Serviços de engenharia",
  anexo: "Anexo IV do Simples Nacional",
  faixaDescricao: "Presumindo Faturamento de 180 mil anualmente: Faixa 1",
  aliquotaNominal: "4,5%",
  aliquotaEfetiva: 14.2,
  valorTotal: 11628.56,
};

// ============================================
// HELPER: Formatar valor em Real
// ============================================

export function formatarValor(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valor);
}

// ============================================
// HELPER: Gerar numero de orcamento
// ============================================

export function gerarNumeroOrcamento(): string {
  // Número fixo para template - evita erro de hydration
  // Em produção com dados dinâmicos, usar ID do banco de dados
  const ano = new Date().getFullYear();
  return `BRK-${ano}-0042`;
}

// ============================================
// HELPER: Calcular data de validade
// ============================================

export function calcularDataValidade(dias: number = 30): string {
  const data = new Date();
  data.setDate(data.getDate() + dias);
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
