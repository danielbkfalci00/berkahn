// Defaults estáticos para o módulo de Estimativa Preliminar.
// Textos extraídos de C:\Users\bruno\Downloads\Apresentacao_Estimativa_Preliminar.docx.
// Bruno pode customizar valores variáveis por orçamento; estes são os fallbacks.

import type {
  CardEntregaId,
  PadraoAcabamento,
  RegimeRecomendado,
} from "@/types/orcamento-estimativa"

export interface CardEntrega {
  id: CardEntregaId
  titulo: string
  descricao: string
  icone: string
}

export interface PadraoInfo {
  id: PadraoAcabamento
  nome: string
  descricao: string
}

export interface RegimeInfo {
  id: RegimeRecomendado
  nome: string
  resumo: string
  caracteristicas: string[]
}

export interface SecaoIndice {
  numero: number
  titulo: string
}

export const SECOES_INDICE: SecaoIndice[] = [
  { numero: 1, titulo: "Natureza deste documento" },
  { numero: 2, titulo: "A Construtora" },
  { numero: 3, titulo: "O que entregamos" },
  { numero: 4, titulo: "Padrões de Acabamento" },
  { numero: 5, titulo: "Estimativa de Custos" },
  { numero: 6, titulo: "Premissas Consideradas" },
  { numero: 7, titulo: "Condicionantes e Exclusões" },
  { numero: 8, titulo: "Condições Comerciais" },
  { numero: 9, titulo: "Próximos Passos" },
]

export const NATUREZA_DOCUMENTO = {
  intro: [
    "Esta apresentação constitui uma estimativa preliminar de custos elaborada com base nas informações técnicas disponíveis até a presente data.",
    "Os valores apresentados possuem caráter orientativo e foram desenvolvidos a partir da análise do projeto arquitetônico, parâmetros construtivos adotados, referências de mercado, histórico de empreendimentos similares e indicadores internos de custos da construtora.",
    "Por se tratar de uma etapa inicial do empreendimento, esta estimativa não deve ser interpretada como orçamento executivo, proposta comercial vinculante ou instrumento contratual.",
  ],
  consolidacaoTitulo: "O valor definitivo da obra será consolidado somente após:",
  consolidacaoItens: [
    "Conclusão dos projetos complementares",
    "Compatibilização técnica entre disciplinas",
    "Definição dos materiais e acabamentos",
    "Realização da sondagem geotécnica do terreno",
    "Desenvolvimento do orçamento analítico executivo",
    "Definição do regime contratual de execução",
  ],
  fechamento:
    "Nosso objetivo nesta etapa é fornecer uma visão realista e tecnicamente fundamentada da ordem de grandeza do investimento necessário, reduzindo incertezas e permitindo maior previsibilidade financeira ao longo da evolução do projeto.",
}

export const SOBRE_BERKAHN = {
  paragrafos: [
    "A Berkahn atua no desenvolvimento e execução de empreendimentos residenciais de alto padrão, conduzindo obras que exigem elevado nível de planejamento, controle técnico e coordenação multidisciplinar.",
    "Nossa atuação está fundamentada na integração entre engenharia, gestão e execução, permitindo que cada empreendimento seja conduzido de forma estruturada desde os estudos preliminares até a entrega final.",
    "Entendemos que construir uma residência de alto padrão exige muito mais do que capacidade executiva: exige organização, transparência, previsibilidade e comprometimento permanente com o resultado final.",
  ],
  processosTitulo: "Por essa razão, adotamos processos de gestão que envolvem:",
  processos: [
    "Planejamento executivo detalhado",
    "Controle físico-financeiro permanente",
    "Gestão estratégica de suprimentos",
    "Coordenação de fornecedores especializados",
    "Controle de qualidade dos serviços executados",
    "Monitoramento contínuo de prazo e custos",
    "Gestão documental e rastreabilidade das decisões do empreendimento",
  ],
  compromisso:
    "Nosso compromisso é proporcionar uma experiência de construção organizada, transparente e tecnicamente segura, com elevado nível de controle e previsibilidade em cada etapa.",
}

export const CARDS_ENTREGA: CardEntrega[] = [
  {
    id: "engenharia",
    titulo: "Engenharia & Gestão Técnica",
    descricao:
      "Engenheiro de obra dedicado, responsável técnico com ART/RRT, mestre de obras em campo. Acompanhamento técnico contínuo do início ao fim.",
    icone: "Hammer",
  },
  {
    id: "suprimentos",
    titulo: "Suprimentos & Compras",
    descricao:
      "Time dedicado para aquisição de todo material. Cotação com múltiplos fornecedores, homologação, gestão de logística e prazo de entrega.",
    icone: "ShoppingCart",
  },
  {
    id: "fornecedores",
    titulo: "Fornecedores & Subempreiteiros",
    descricao:
      "Elaboração e gestão de contratos, medição dos serviços executados, aprovação por etapa, controle de pagamentos auditável.",
    icone: "Users",
  },
  {
    id: "planejamento",
    titulo: "Planejamento & Cronograma",
    descricao:
      "Cronograma físico-financeiro, acompanhamento do avanço real x planejado, replanejamento quando necessário, gestão de alterações de projeto.",
    icone: "CalendarDays",
  },
  {
    id: "relatorios",
    titulo: "Relatórios & Transparência",
    descricao:
      "Relatórios quinzenais ou mensais de andamento físico, relatórios de custos e cronograma. No regime Administração, transparência total dos custos.",
    icone: "FileText",
  },
  {
    id: "qualidade",
    titulo: "Qualidade & Conformidade Técnica",
    descricao:
      "Conferência de todos os serviços conforme normas técnicas (NBR), controle tecnológico de materiais e sistemas, verificação por etapa.",
    icone: "ShieldCheck",
  },
  {
    id: "seguranca",
    titulo: "Segurança do Trabalho",
    descricao:
      "Gestão da segurança conforme NR-18, NR-35 e demais aplicáveis. Fornecimento e fiscalização de EPIs. Canteiro em conformidade legal.",
    icone: "HardHat",
  },
  {
    id: "canteiro",
    titulo: "Gestão de Canteiro & Materiais",
    descricao:
      "Recebimento e conferência de materiais, armazenamento adequado contra perda e dano, organização e limpeza do canteiro durante toda execução.",
    icone: "Warehouse",
  },
  {
    id: "garantia",
    titulo: "Garantia & Assistência Técnica",
    descricao:
      "Garantia por sistema construtivo conforme NBR 17170 (estrutura, impermeabilização, instalações). Assistência técnica no pós-obra.",
    icone: "BadgeCheck",
  },
]

export const PADROES_ACABAMENTO: PadraoInfo[] = [
  {
    id: "baixo",
    nome: "Baixo",
    descricao:
      "Acabamentos econômicos, especificações básicas, foco em funcionalidade.",
  },
  {
    id: "medio",
    nome: "Médio",
    descricao:
      "Materiais de linha intermediária, boa durabilidade, especificações de mercado.",
  },
  {
    id: "alto",
    nome: "Alto",
    descricao:
      "Materiais de primeira linha, esquadrias e revestimentos selecionados, bom detalhamento.",
  },
  {
    id: "altissimo",
    nome: "Altíssimo",
    descricao:
      "Materiais importados/sob medida, automação ampla, interiores e paisagismo dedicados, alta personalização.",
  },
]

export const REGIMES_COMERCIAIS: RegimeInfo[] = [
  {
    id: "administracao",
    nome: "Administração",
    resumo:
      "A construtora administra a obra e é remunerada por taxa sobre o custo dos serviços e insumos, com total transparência de custos.",
    caracteristicas: [
      "Taxa de administração: 13% sobre o custo da obra",
      "Taxa reduzida de 8% em marcenaria, luminárias, louças, metais, automação e HVAC",
      "Transparência total dos custos durante toda a obra",
      "Alterações fluem pelo custo real, acrescidas da taxa aplicável",
    ],
  },
  {
    id: "fechado",
    nome: "Preço Fechado",
    resumo:
      "Empreitada global. A construtora assume um valor fixo para a execução, conforme escopo definido.",
    caracteristicas: [
      "Valor fixo determinado no contrato",
      "Reajustes apenas em alteração de escopo ou condicionantes",
      "Aditivo formal ajusta valor e prazo em mudanças",
      "Risco de execução transferido para a construtora",
    ],
  },
  {
    id: "pmg",
    nome: "PMG (Preço Máximo Garantido)",
    resumo:
      "Modelo híbrido: a obra é executada em administração, porém com teto de custo garantido. Economia abaixo do teto é compartilhada.",
    caracteristicas: [
      "Teto de custo definido em contrato",
      "Execução em regime de administração com transparência",
      "Economia abaixo do teto compartilhada conforme negociação",
      "Aditivo formal em alteração de escopo ou condicionantes",
    ],
  },
]

export const CONDICIONANTES_DEFAULT: string[] = [
  "Sondagem do terreno (SPT) e eventual fundação especial (estacas, tubulões) decorrente das condições do solo",
  "Terraplenagem, cortes, aterros e contenções decorrentes da topografia real do terreno",
  "Ligações definitivas de água, esgoto e energia, e eventuais taxas de concessionárias e prefeitura",
  "Adequações exigidas por aprovação legal, corpo de bombeiros ou normas locais",
]

export const EXCLUSOES_DEFAULT: string[] = [
  "Automação residencial",
  "Paisagismo e projeto de jardins",
  "Marcenaria sob medida (armários, painéis)",
  "Irrigação",
  "Mobiliário solto, decoração e eletrodomésticos",
]

export const PROXIMOS_PASSOS_DEFAULT: string[] = [
  "Projeto arquitetônico executivo com memorial descritivo",
  "Projeto estrutural (confirma a premissa de estrutura)",
  "Projetos de instalações: hidrossanitário e elétrico (e, conforme o porte, climatização, incêndio e demais complementares)",
  "Sondagem do terreno (SPT) — define a fundação e remove a principal incerteza",
  "Definição final do padrão de acabamento e do regime de execução",
]

export const TAGLINE = "Erguendo o amanhã."

export const NATUREZA_RODAPE =
  "Documento preliminar e não-vinculante. Não constitui proposta comercial nem contrato."

export const LOGOS = {
  preto: "/orcamento/logo-berkahn-preto.png",
  claro: "/orcamento/logo-berkahn-claro.png",
}

export const HERO_DEFAULT = "/orcamento/hero-default.webp"
