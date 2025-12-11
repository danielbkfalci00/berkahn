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

// 7 Camadas do LSF (de fora para dentro)
export const LSF_LAYERS: LSFLayer[] = [
  {
    id: 1,
    name: "Placa Cimentícia Externa",
    description: "Proteção contra intempéries e base para acabamento externo.",
    fullDescription:
      "A placa ciment\u00edcia externa \u00e9 a primeira linha de defesa contra elementos externos. Fabricada com cimento Portland refor\u00e7ado com fibras sint\u00e9ticas, oferece excel\u00eancia resist\u00eancia \u00e0 umidade, impactos e varia\u00e7\u00f5es t\u00e9rmicas. Serve como base ideal para aplica\u00e7\u00e3o de texturas, pinturas, cer\u00e2micas ou revestimentos de fachada, garantindo durabilidade e est\u00e9tica superior.",
    thickness: "10mm",
    material: "Cimento Portland + Fibras Sint\u00e9ticas",
    function: "Prote\u00e7\u00e3o mec\u00e2nica e base para acabamento",
    color: "#1a1a1a",
  },
  {
    id: 2,
    name: "Barreira Hidr\u00f3fuga (Membrana)",
    description: "Membrana impermea\u0301vel que protege contra infiltra\u00e7\u00f5es de a\u0301gua.",
    fullDescription:
      "Membrana de alta densidade aplicada sobre o OSB estrutural, criando uma barreira imperme\u00e1vel que impede a penetra\u00e7\u00e3o de \u00e1gua da chuva e umidade externa, enquanto permite a passagem de vapor de \u00e1gua do interior para o exterior (respirabilidade). Essencial para prevenir danos estruturais e prolifera\u00e7\u00e3o de fungos e mofos.",
    thickness: "0.2mm",
    material: "Polietileno de Alta Densidade",
    function: "Impermeabiliza\u00e7\u00e3o com respirabilidade",
    color: "#333333",
  },
  {
    id: 3,
    name: "Placa OSB Estrutural",
    description: "Refor\u00e7o estrutural e contraventamento da parede.",
    fullDescription:
      "Oriented Strand Board (OSB) de alta resist\u00eancia mec\u00e2nica, fornece rigidez estrutural ao sistema LSF, funcionando como contraventamento que distribui cargas laterais (vento, sismos) uniformemente pela estrutura. Suas fibras orientadas em camadas cruzadas garantem estabilidade dimensional e resist\u00eancia superior a tra\u00e7\u00f5es e compress\u00f5es.",
    thickness: "11.1mm",
    material: "OSB/3 - Oriented Strand Board",
    function: "Contraventamento e rigidez estrutural",
    color: "#4d4d4d",
  },
  {
    id: 4,
    name: "Estrutura Steel Frame",
    description: "Perfis de a\u00e7o galvanizado que formam a estrutura portante.",
    fullDescription:
      "Esqueleto estrutural composto por perfis de a\u00e7o galvanizado a quente (ASTM A653), conformados a frio em perfis tipo U e C. Os montantes verticais espa\u00e7ados a cada 400mm ou 600mm suportam cargas verticais e horizontais, enquanto guias superiores e inferiores distribuem essas cargas para as funda\u00e7\u00f5es. O a\u00e7o galvanizado garante prote\u00e7\u00e3o contra corros\u00e3o por d\u00e9cadas.",
    thickness: "90mm",
    material: "A\u00e7o Galvanizado ASTM A653 (0.95-1.25mm)",
    function: "Estrutura portante principal",
    color: "#666666",
  },
  {
    id: 5,
    name: "Isolamento T\u00e9rmico/Ac\u00fastico",
    description: "L\u00e3 mineral para conforto te\u0301rmico e ac\u00fa\u0301stico superior.",
    fullDescription:
      "Manta de l\u00e3 de vidro ou l\u00e3 de rocha de alta densidade instalada entre os montantes met\u00e1licos, preenchendo completamente os vazios estruturais. Proporciona isolamento t\u00e9rmico que reduz em at\u00e9 40% o consumo energ\u00e9tico com climatiza\u00e7\u00e3o, al\u00e9m de excelente atenua\u00e7\u00e3o ac\u00fastica (Rw 45-50 dB), criando ambientes internos confort\u00e1veis e silenciosos.",
    thickness: "90mm",
    material: "L\u00e3 de Vidro ou L\u00e3 de Rocha (densidade 48-60 kg/m\u00b3)",
    function: "Isolamento t\u00e9rmico e ac\u00fastico",
    color: "#808080",
  },
  {
    id: 6,
    name: "Barreira de Vapor",
    description: "Membrana que controla a migra\u00e7\u00e3o de vapor do interior.",
    fullDescription:
      "Pel\u00edcula de polietileno instalada na face interna da parede, ap\u00f3s o isolamento t\u00e9rmico, que controla o fluxo de vapor de \u00e1gua do interior aquecido para o exterior mais frio. Previne condensa\u00e7\u00e3o intersticial que poderia degradar o isolamento e favorecer o crescimento de mofo, mantendo a efici\u00eancia energ\u00e9tica e a qualidade do ar interno.",
    thickness: "0.15mm",
    material: "Polietileno (barreira de vapor)",
    function: "Controle de migra\u00e7\u00e3o de vapor e umidade",
    color: "#999999",
  },
  {
    id: 7,
    name: "Placa de Gesso Interna",
    description: "Acabamento interno com excel\u00eancia de acabamento.",
    fullDescription:
      "Placa de gesso acartonado (drywall) que proporciona superf\u00edcie lisa e uniforme para acabamento final interno. Permite aplica\u00e7\u00e3o direta de pintura, papel de parede ou texturas. Dispon\u00edvel em vers\u00f5es standard, resistente \u00e0 umidade (RU - \u00e1reas molhadas) e resistente ao fogo (RF - seguran\u00e7a passiva contra inc\u00eandio). Sua instala\u00e7\u00e3o r\u00e1pida e acabamento de qualidade reduzem tempo de obra.",
    thickness: "12.5mm",
    material: "Gesso Acartonado (Drywall)",
    function: "Acabamento interno e prote\u00e7\u00e3o ao fogo",
    color: "#b3b3b3",
  },
];

// Benef\u00edcios do LSF com dados estat\u00edsticos
export const BENEFITS: Benefit[] = [
  {
    icon: "speed",
    title: "Velocidade",
    stat: 50,
    suffix: "%",
    description: "Mais r\u00e1pido que constru\u00e7\u00e3o tradicional",
    details:
      "Sistema construtivo a seco elimina tempo de cura de concreto e argamassas. Componentes pr\u00e9-fabricados e padronizados permitem montagem r\u00e1pida com m\u00e3o de obra especializada. Uma resid\u00eancia de 150m\u00b2 pode ser conclu\u00edda em 3-4 meses, contra 8-12 meses da constru\u00e7\u00e3o convencional.",
  },
  {
    icon: "sustainability",
    title: "Sustentabilidade",
    stat: 80,
    suffix: "%",
    description: "Redu\u00e7\u00e3o de desperd\u00edcio de materiais",
    details:
      "Pr\u00e9-fabrica\u00e7\u00e3o industrial com cortes precisos minimiza desperd\u00edcio. Gera\u00e7\u00e3o m\u00ednima de entulho no canteiro. Materiais reci\u00e1veis (a\u00e7o, gesso, OSB) podem ser reaproveitados. Redu\u00e7\u00e3o de 60% no consumo de \u00e1gua durante a constru\u00e7\u00e3o comparado ao m\u00e9todo tradicional.",
  },
  {
    icon: "energy",
    title: "Efici\u00eancia Energ\u00e9tica",
    stat: 40,
    suffix: "%",
    description: "Economia em climatiza\u00e7\u00e3o",
    details:
      "Isolamento t\u00e9rmico cont\u00ed nuo de 90mm (l\u00e3 mineral) nas paredes externas cria envelope t\u00e9rmico superior. Redu\u00e7\u00e3o de pontes t\u00e9rmicas atrav\u00e9s de t\u00e9cnicas construtivas adequadas. Classifica\u00e7\u00e3o energ\u00e9tica A no PBE Edifica (Procel), resultando em economia de at\u00e9 40% em gastos com ar-condicionado e aquecimento.",
  },
  {
    icon: "durability",
    title: "Durabilidade",
    stat: 100,
    suffix: "+",
    description: "Anos de vida \u00fatil garantidos",
    details:
      "A\u00e7o galvanizado ASTM A653 com revestimento Z275 garante prote\u00e7\u00e3o contra corros\u00e3o por d\u00e9cadas. Sistema multicamadas protege estrutura de umidade e intempéries. Vida \u00fatil projetada de 100+ anos com manuten\u00e7\u00e3o adequada, comparável ou superior \u00e0 constru\u00e7\u00e3o tradicional. Estrutura n\u00e3o apodrece, n\u00e3o \u00e9 atacada por cupins ou outros insetos.",
  },
];

// Especifica\u00e7\u00f5es T\u00e9cnicas Detalhadas
export const TECHNICAL_SPECS: SpecCategory[] = [
  {
    category: "Estrutura",
    specs: [
      {
        label: "Material dos Perfis",
        value: "A\u00e7o Galvanizado ASTM A653 Gr33 (Z275)",
      },
      {
        label: "Espessura dos Perfis",
        value: "0.95mm (Light) | 1.25mm (Heavy)",
      },
      {
        label: "Espa\u00e7amento Montantes",
        value: "400mm ou 600mm (c/c)",
      },
      {
        label: "Capacidade de Carga",
        value: "At\u00e9 300 kg/m\u00b2 (sobrecarga)",
      },
      {
        label: "Resist\u00eancia a Vento",
        value: "At\u00e9 60 m/s (216 km/h)",
      },
      {
        label: "M\u00f3dulo de Elasticidade",
        value: "200 GPa (a\u00e7o)",
      },
    ],
  },
  {
    category: "Isolamento",
    specs: [
      {
        label: "Material Isolante",
        value: "L\u00e3 de Vidro ou L\u00e3 de Rocha",
      },
      {
        label: "Espessura do Isolamento",
        value: "90mm (paredes) | 200mm (cobertura)",
      },
      {
        label: "Densidade",
        value: "48-60 kg/m\u00b3",
      },
      {
        label: "Condutividade T\u00e9rmica (\u03bb)",
        value: "0.035 - 0.045 W/(m\u00b7K)",
      },
      {
        label: "Resist\u00eancia T\u00e9rmica (R)",
        value: "2.0 - 2.6 m\u00b2\u00b7K/W",
      },
      {
        label: "Atenua\u00e7\u00e3o Ac\u00fastica (Rw)",
        value: "45-50 dB",
      },
    ],
  },
  {
    category: "Revestimento",
    specs: [
      {
        label: "Placa Externa",
        value: "Ciment\u00edcia 10mm ou OSB 11.1mm",
      },
      {
        label: "Placa Interna",
        value: "Gesso Acartonado 12.5mm (ST, RU ou RF)",
      },
      {
        label: "Barreira Hidr\u00f3fuga",
        value: "Membrana PEAD 0.2mm",
      },
      {
        label: "Barreira de Vapor",
        value: "Polietileno 0.15mm",
      },
      {
        label: "Acabamento Externo",
        value: "Pintura, Textura, Cer\u00e2mica ou Siding",
      },
      {
        label: "Acabamento Interno",
        value: "Pintura, Papel de Parede ou Textura",
      },
    ],
  },
  {
    category: "Funda\u00e7\u00f5es",
    specs: [
      {
        label: "Tipo Recomendado",
        value: "Radier, Sapata Corrida ou Baldrame",
      },
      {
        label: "Redu\u00e7\u00e3o de Concreto",
        value: "At\u00e9 60% vs. alvenaria convencional",
      },
      {
        label: "Peso Pr\u00f3prio da Estrutura",
        value: "60-100 kg/m\u00b2 (vs. 1200 kg/m\u00b2 alvenaria)",
      },
      {
        label: "Tempo de Cura",
        value: "7-14 dias (radier)",
      },
      {
        label: "Cargas Concentradas",
        value: "Distribu\u00eddas uniformemente",
      },
      {
        label: "Adapta\u00e7\u00e3o a Terrenos",
        value: "Flex\u00edvel (irregulares, \u00edngremes)",
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
    category: "Prec\u0098is\u00e3o Dimensional",
    lsf: "\u00b1 1-2mm",
    traditional: "\u00b1 10-20mm",
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
    imageUrl:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80",
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
    imageUrl:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80",
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
    imageUrl:
      "https://images.unsplash.com/photo-1572981762384-5a1c1a7c8f60?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80",
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
    imageUrl:
      "https://images.unsplash.com/photo-1621905251918-48416bd8575a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80",
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
