// Dados completos para a página /lsf - Light Steel Frame

export interface LSFLayer {
  id: number;
  name: string;
  description: string;
  fullDescription: string;
  thickness: string;
  material: string;
  function: string;
  color: string;
  image: string;
}

export interface Benefit {
  icon: string; // Nome do icon para render
  title: string;
  stat: number;
  suffix: string;
  description: string;
  details: string;
}

export interface TechnicalSpec {
  label: string;
  value: string;
}

export interface SpecCategory {
  category: string;
  specs: TechnicalSpec[];
}

export interface ComparisonItem {
  category: string;
  lsf: string;
  traditional: string;
  winner: "lsf" | "traditional";
}

export interface TimelinePhase {
  phase: string;
  title: string;
  description: string;
  imageUrl: string;
  duration: string;
  highlights: string[];
}

// 6 Camadas do LSF (de fora para dentro)
export const LSF_LAYERS: LSFLayer[] = [
  {
    id: 1,
    name: "Base Coat",
    description: "Acabamento externo texturizado para proteção e estética.",
    fullDescription:
      "Camada de acabamento final externa aplicada sobre a placa cimentícia. Proporciona textura estética e proteção adicional contra intempéries e radiação UV. Pode receber pintura ou textura decorativa, permitindo diversos estilos arquitetônicos. Sua aplicação uniforme garante um acabamento profissional e durável.",
    thickness: "3-5mm",
    material: "Argamassa Texturizada",
    function: "Acabamento estético e proteção UV",
    color: "#1a1a1a",
    image: "/images/Lsf/Layers/base-coat.webp",
  },
  {
    id: 2,
    name: "Placa Cimentícia",
    description: "Primeira barreira física contra elementos externos.",
    fullDescription:
      "Placa fabricada com cimento Portland reforçado com fibras sintéticas, oferecendo excelente resistência à umidade, impactos e variações térmicas. Serve como base robusta para aplicação do Base Coat, garantindo proteção mecânica e suporte estrutural para o sistema de fachada.",
    thickness: "10-12mm",
    material: "Cimento + Fibras Sintéticas",
    function: "Proteção mecânica e suporte para acabamento",
    color: "#333333",
    image: "/images/Lsf/Layers/placa-cimenticia.webp",
  },
  {
    id: 3,
    name: "Manta Hidrófuga",
    description: "Barreira impermeável com respirabilidade controlada.",
    fullDescription:
      "Membrana de polietileno de alta densidade que impede a penetração de água da chuva e umidade externa, enquanto permite a passagem de vapor de água do interior para o exterior (respirabilidade). Essencial para prevenir danos estruturais, condensação intersticial e proliferação de fungos e mofos.",
    thickness: "0.2mm",
    material: "Polietileno de Alta Densidade",
    function: "Impermeabilização com respirabilidade",
    color: "#4d4d4d",
    image: "/images/Lsf/Layers/manta-hidrofuga.webp",
  },
  {
    id: 4,
    name: "Lã de Vidro",
    description: "Isolamento térmico e acústico de alta performance.",
    fullDescription:
      "Manta de lã de vidro de alta densidade instalada entre os montantes metálicos, preenchendo completamente os vazios estruturais. Proporciona isolamento térmico que reduz em até 40% o consumo energético com climatização, além de excelente atenuação acústica (Rw 45-50 dB), criando ambientes internos confortáveis e silenciosos.",
    thickness: "50-100mm",
    material: "Lã de Vidro (densidade 20-40 kg/m³)",
    function: "Conforto térmico e acústico",
    color: "#666666",
    image: "/images/Lsf/Layers/la-de-vidro.webp",
  },
  {
    id: 5,
    name: "Perfis de Steel Frame",
    description: "Esqueleto estrutural em aço galvanizado.",
    fullDescription:
      "Estrutura portante composta por perfis de aço galvanizado a quente (ASTM A653), conformados a frio em perfis tipo U e C. Os montantes verticais espaçados a cada 400mm ou 600mm suportam cargas verticais e horizontais, enquanto guias superiores e inferiores distribuem essas cargas para as fundações. O aço galvanizado garante proteção contra corrosão por décadas.",
    thickness: "90-150mm",
    material: "Aço Galvanizado ASTM A653",
    function: "Estrutura portante principal",
    color: "#808080",
    image: "/images/Lsf/Layers/perfis-steel-frame.webp",
  },
  {
    id: 6,
    name: "Placa de Gesso",
    description: "Acabamento interno liso e uniforme.",
    fullDescription:
      "Placa de gesso acartonado (drywall) que proporciona superfície lisa e uniforme para acabamento final interno. Permite aplicação direta de pintura, papel de parede ou texturas. Disponível em versões standard (ST), resistente à umidade (RU - áreas molhadas) e resistente ao fogo (RF - segurança passiva contra incêndio).",
    thickness: "12.5mm",
    material: "Gesso Acartonado (Drywall)",
    function: "Acabamento interno e proteção passiva",
    color: "#b3b3b3",
    image: "/images/Lsf/Layers/placa-de-gesso.webp",
  },
];

// Benefícios do LSF com dados estatísticos
export const BENEFITS: Benefit[] = [
  {
    icon: "speed",
    title: "Velocidade",
    stat: 50,
    suffix: "%",
    description: "Velocidade de construção superior",
    details:
      "Sistema construtivo a seco elimina tempo de cura de concreto e argamassas. Componentes pré-fabricados e padronizados permitem montagem rápida com mão de obra especializada. Uma residência de 150m² pode ser concluída em 3-4 meses, contra 8-12 meses da construção convencional.",
  },
  {
    icon: "sustainability",
    title: "Sustentabilidade",
    stat: 80,
    suffix: "%",
    description: "Redução de desperdício de materiais",
    details:
      "Pré-fabricação industrial com cortes precisos minimiza desperdício. Geração mínima de entulho no canteiro. Materiais recicláveis (aço, gesso, OSB) podem ser reaproveitados. Redução de 60% no consumo de água durante a construção comparado ao método tradicional.",
  },
  {
    icon: "energy",
    title: "Eficiência Energética",
    stat: 40,
    suffix: "%",
    description: "Economia em climatização",
    details:
      "Isolamento térmico contínuo de 90mm (lã mineral) nas paredes externas cria envelope térmico superior. Redução de pontes térmicas através de técnicas construtivas adequadas. Classificação energética A no PBE Edifica (Procel), resultando em economia de até 40% em gastos com ar-condicionado e aquecimento.",
  },
  {
    icon: "acoustic",
    title: "Isolamento Acústico",
    stat: 68,
    suffix: "%",
    description: "Isolamento acústico superior",
    details:
      "Sistema com lã de rocha proporciona redução de até 10dB, 68% superior às paredes convencionais. Desempenho acústico igual ou superior à alvenaria com menor espessura.",
  },
  {
    icon: "area",
    title: "Maximização de área útil",
    stat: 5,
    suffix: "%",
    description: "Mais área útil interna",
    details:
      "Paredes mais finas que a alvenaria tradicional proporcionam ganho de 4-5% de área útil. Ideal para apartamentos e escritórios onde cada metro quadrado conta.",
  },
  {
    icon: "weight",
    title: "Estrutura Leve",
    stat: 4,
    suffix: "x",
    description: "Mais leve que alvenaria",
    details:
      "Peso médio de 250kg/m² contra 1000kg/m² da alvenaria. Reduz custos com fundação e permite construção em terrenos com menor capacidade de carga.",
  },
  {
    icon: "precision",
    title: "Precisão no orçamento",
    stat: 95,
    suffix: "%",
    description: "Planejamento e precisão",
    details:
      "Sistema industrializado permite orçamento preciso desde o início. Pré-fabricação elimina surpresas e custos extras comuns na construção tradicional.",
  },
  {
    icon: "durability",
    title: "Durabilidade da estrutura",
    stat: 150,
    suffix: "+",
    description: "Anos de garantia",
    details:
      "Aço galvanizado ASTM A653 com revestimento Z275 garante proteção contra corrosão por décadas. Sistema multicamadas protege estrutura de umidade e intempéries. Vida útil projetada de 100+ anos com manutenção adequada, comparável ou superior à construção tradicional. Estrutura não apodrece, não é atacada por cupins ou outros insetos.",
  },
];

// Especifica\u00e7\u00f5es T\u00e9cnicas Detalhadas
export const TECHNICAL_SPECS: SpecCategory[] = [
  {
    category: "Fundações",
    specs: [
      {
        label: "Tipo Recomendado",
        value: "Radier, Sapata Corrida ou Baldrame",
      },
      {
        label: "Redução de Concreto",
        value: "Até 60% vs. alvenaria convencional",
      },
      {
        label: "Peso Próprio da Estrutura",
        value: "60-100 kg/m² (vs. 1200 kg/m² alvenaria)",
      },
      {
        label: "Tempo de Cura",
        value: "7-14 dias (radier)",
      },
      {
        label: "Cargas Concentradas",
        value: "Distribuídas uniformemente",
      },
      {
        label: "Adaptação a Terrenos",
        value: "Flexível (irregulares, íngremes)",
      },
    ],
  },
  {
    category: "Estrutura",
    specs: [
      {
        label: "Material dos Perfis",
        value: "Aço Galvanizado ASTM A653 Gr33 (Z275)",
      },
      {
        label: "Espessura dos Perfis",
        value: "0.95mm (Light) | 1.25mm (Heavy)",
      },
      {
        label: "Espaçamento Montantes",
        value: "400mm ou 600mm (c/c)",
      },
      {
        label: "Capacidade de Carga",
        value: "Até 300 kg/m² (sobrecarga)",
      },
      {
        label: "Resistência a Vento",
        value: "Até 60 m/s (216 km/h)",
      },
      {
        label: "Módulo de Elasticidade",
        value: "200 GPa (aço)",
      },
    ],
  },
  {
    category: "Isolamento",
    specs: [
      {
        label: "Material Isolante",
        value: "Lã de Vidro ou Lã de Rocha",
      },
      {
        label: "Espessura do Isolamento",
        value: "90mm (paredes) | 200mm (cobertura)",
      },
      {
        label: "Densidade",
        value: "48-60 kg/m³",
      },
      {
        label: "Condutividade Térmica (λ)",
        value: "0.035 - 0.045 W/(m·K)",
      },
      {
        label: "Resistência Térmica (R)",
        value: "2.0 - 2.6 m²·K/W",
      },
      {
        label: "Atenuação Acústica (Rw)",
        value: "45-50 dB",
      },
    ],
  },
  {
    category: "Revestimento",
    specs: [
      {
        label: "Placa Externa",
        value: "Cimentícia 10mm ou OSB 11.1mm",
      },
      {
        label: "Placa Interna",
        value: "Gesso Acartonado 12.5mm (ST, RU ou RF)",
      },
      {
        label: "Barreira Hidrófuga",
        value: "Membrana PEAD 0.2mm",
      },
      {
        label: "Barreira de Vapor",
        value: "Polietileno 0.15mm",
      },
      {
        label: "Acabamento Externo",
        value: "Pintura, Textura, Cerâmica ou Siding",
      },
      {
        label: "Acabamento Interno",
        value: "Pintura, Papel de Parede ou Textura",
      },
    ],
  },
  {
    category: "Acabamentos",
    specs: [
      {
        label: "Pintura Interna",
        value: "Látex PVA ou Acrílico sobre massa corrida",
      },
      {
        label: "Pintura Externa",
        value: "Acrílico premium com primer selador",
      },
      {
        label: "Pisos",
        value: "Porcelanato, Vinílico ou Laminado",
      },
      {
        label: "Forros",
        value: "Gesso acartonado ou Drywall",
      },
      {
        label: "Esquadrias",
        value: "Alumínio, PVC ou Madeira",
      },
      {
        label: "Instalações",
        value: "Embutidas nos painéis (elétrica e hidráulica)",
      },
    ],
  },
];

// Compara\u00e7\u00e3o LSF vs. Constru\u00e7\u00e3o Tradicional
export const COMPARISON_DATA: ComparisonItem[] = [
  {
    category: "Tempo de Obra",
    lsf: "3-6 meses",
    traditional: "8-12 meses",
    winner: "lsf",
  },
  {
    category: "Desperd\u00edcio de Material",
    lsf: "< 5%",
    traditional: "25-30%",
    winner: "lsf",
  },
  {
    category: "Consumo de \u00c1gua",
    lsf: "100-200L/m\u00b2",
    traditional: "500-800L/m\u00b2",
    winner: "lsf",
  },
  {
    category: "Precisão Dimensional",
    lsf: "± 1-2mm",
    traditional: "± 10-20mm",
    winner: "lsf",
  },
  {
    category: "Peso Estrutural",
    lsf: "60-100 kg/m\u00b2",
    traditional: "1200-1500 kg/m\u00b2",
    winner: "lsf",
  },
  {
    category: "Isolamento T\u00e9rmico",
    lsf: "Alto (R=2.0-2.6)",
    traditional: "Baixo (R=0.5-1.0)",
    winner: "lsf",
  },
  {
    category: "Flexibilidade de Projeto",
    lsf: "M\u00e1xima (v\u00e3os at\u00e9 8m)",
    traditional: "Limitada (v\u00e3os at\u00e9 4m)",
    winner: "lsf",
  },
  {
    category: "Facilidade de Amplia\u00e7\u00e3o",
    lsf: "Alta (modular)",
    traditional: "M\u00e9dia (estrutural)",
    winner: "lsf",
  },
  {
    category: "M\u00e3o de Obra",
    lsf: "Especializada",
    traditional: "Generalista",
    winner: "traditional",
  },
  {
    category: "Custo Inicial (m\u00b2)",
    lsf: "R$ 2.500-3.500",
    traditional: "R$ 2.000-3.000",
    winner: "traditional",
  },
];

// Timeline do Processo Construtivo (5 Fases)
export const CONSTRUCTION_TIMELINE: TimelinePhase[] = [
  {
    phase: "Fase 1",
    title: "Funda\u00e7\u00e3o e Prepara\u00e7\u00e3o",
    description:
      "Prepara\u00e7\u00e3o do terreno, marca\u00e7\u00e3o, escava\u00e7\u00e3o e execu\u00e7\u00e3o da funda\u00e7\u00e3o (radier ou sapata corrida). Sistema LSF permite funda\u00e7\u00f5es mais leves e econ\u00f4micas devido ao baixo peso estrutural.",
    imageUrl: "/images/Lsf/lsf-fase-1.webp",
    duration: "5-10 dias",
    highlights: [
      "Prepara\u00e7\u00e3o e nivelamento do terreno",
      "Marca\u00e7\u00e3o topogr\u00e1fica precisa",
      "Escava\u00e7\u00e3o e compacta\u00e7\u00e3o do solo",
      "Execu\u00e7\u00e3o de funda\u00e7\u00e3o (radier ou sapatas)",
      "Cura do concreto (7-14 dias)",
      "Impermeabiliza\u00e7\u00e3o da base",
    ],
  },
  {
    phase: "Fase 2",
    title: "Montagem da Estrutura",
    description:
      "Montagem dos perfis de a\u00e7o galvanizado: instala\u00e7\u00e3o de guias, montantes, vergas, contravergas e estrutura de cobertura. Processo r\u00e1pido e preciso com uso de parafusos auto-atarraxantes.",
    imageUrl: "/images/Lsf/lsf-fase-2.webp",
    duration: "10-15 dias",
    highlights: [
      "Fixa\u00e7\u00e3o das guias inferiores",
      "Montagem dos montantes verticais (400-600mm c/c)",
      "Instala\u00e7\u00e3o de vergas e contravergas (v\u00e3os)",
      "Montagem da estrutura de cobertura (tesouras)",
      "Contraventamento e travamento estrutural",
      "Inspe\u00e7\u00e3o de prumo e nivelamento",
    ],
  },
  {
    phase: "Fase 3",
    title: "Fechamento e Isolamento",
    description:
      "Instala\u00e7\u00e3o de placas OSB estruturais, barreiras hidr\u00f3fugas, isolamento t\u00e9rmico/ac\u00fastico com l\u00e3 mineral, e barreiras de vapor. Esta fase cria o envelope eficiente da edifica\u00e7\u00e3o.",
    imageUrl: "/images/Lsf/lsf-fase-3.webp",
    duration: "10-15 dias",
    highlights: [
      "Fixa\u00e7\u00e3o de placas OSB estruturais externas",
      "Aplica\u00e7\u00e3o de membrana hidr\u00f3fuga (Tyvek ou similar)",
      "Instala\u00e7\u00e3o de l\u00e3 mineral (90mm paredes, 200mm cobertura)",
      "Aplica\u00e7\u00e3o de barreira de vapor interna",
      "Fixa\u00e7\u00e3o de placas de gesso internamente",
      "Instala\u00e7\u00e3o de placas ciment\u00edcias externas",
    ],
  },
  {
    phase: "Fase 4",
    title: "Instala\u00e7\u00f5es Prediais",
    description:
      "Execu\u00e7\u00e3o de instala\u00e7\u00f5es el\u00e9tricas, hidrossanit\u00e1rias, HVAC e automa\u00e7\u00e3o. Sistema LSF facilita passagem de tubula\u00e7\u00f5es e fios atrav\u00e9s dos perfis met\u00e1licos com aberturas pr\u00e9-existentes.",
    imageUrl: "/images/Lsf/lsf-fase-4.webp",
    duration: "10-20 dias",
    highlights: [
      "Instala\u00e7\u00e3o el\u00e9trica (cabos, eletrodutos, caixas)",
      "Instala\u00e7\u00e3o hidrossanit\u00e1ria (PVC, PEX)",
      "Sistema de climatiza\u00e7\u00e3o (HVAC, splits)",
      "Instala\u00e7\u00e3o de aquecimento (solar, gas, el\u00e9trico)",
      "Automa\u00e7\u00e3o e cabeamento estruturado",
      "Testes de press\u00e3o e funcionamento",
    ],
  },
  {
    phase: "Fase 5",
    title: "Acabamentos Finais",
    description:
      "Aplica\u00e7\u00e3o de acabamentos internos e externos: tratamento de juntas em gesso, pintura, revestimentos, esquadrias, pisos e lou\u00e7as. Fase que d\u00e1 personalidade e finaliza a obra.",
    imageUrl:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80",
    duration: "15-30 dias",
    highlights: [
      "Tratamento de juntas (massa e fita)",
      "Pintura interna (parede e teto)",
      "Instala\u00e7\u00e3o de pisos (cer\u00e2mica, porcelanato, madeira)",
      "Revestimentos externos (pintura, textura, cer\u00e2mica)",
      "Instala\u00e7\u00e3o de esquadrias (portas, janelas)",
      "Lou\u00e7as, metais, arm\u00e1rios e acabamentos finais",
    ],
  },
];

// Imagens para Gallery (6 projetos em LSF)
export const GALLERY_IMAGES = [
  {
    id: 1,
    title: "Resid\u00eancia Contempor\u00e2nea 180m\u00b2",
    imageUrl:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80",
    category: "Residencial",
  },
  {
    id: 2,
    title: "Casa de Campo com Varanda Integrada",
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80",
    category: "Residencial",
  },
  {
    id: 3,
    title: "Sobrado Moderno 250m\u00b2",
    imageUrl:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80",
    category: "Residencial",
  },
  {
    id: 4,
    title: "Escrit\u00f3rio Corporativo",
    imageUrl:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80",
    category: "Comercial",
  },
  {
    id: 5,
    title: "Interior Minimalista",
    imageUrl:
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80",
    category: "Interior",
  },
  {
    id: 6,
    title: "Fachada com Revestimento Cer\u00e2mico",
    imageUrl:
      "https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80",
    category: "Fachada",
  },
];

// Comparação LSF vs. Construção Tradicional (versão resumida para Home - 7 itens)
export const COMPARISON_DATA_HOME: ComparisonItem[] = COMPARISON_DATA.filter(
  item => !["Isolamento Térmico", "Flexibilidade de Projeto", "Facilidade de Ampliação"].includes(item.category)
);
