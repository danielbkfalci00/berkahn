import {
  Project,
  ProjectCategory,
  ProjectCategoryInfo,
  ProjectSpecification,
  ProjectSegment,
  SEGMENTS
} from '@/types/project';

// Re-exportar SEGMENTS para uso em componentes
export { SEGMENTS };

// Categorias de projetos (novo sistema por segmento)
export const PROJECT_CATEGORIES: ProjectCategoryInfo[] = [
  {
    id: 'residencial',
    name: 'Residencial',
    namePlural: 'Residenciais',
    description: 'Casas, chalés e moradias personalizadas com design exclusivo.',
  },
  {
    id: 'comercial',
    name: 'Comercial',
    namePlural: 'Comerciais',
    description: 'Lojas, showrooms e espaços de varejo modernos.',
  },
  {
    id: 'industrial',
    name: 'Industrial',
    namePlural: 'Industriais',
    description: 'Galpões, fábricas e centros de distribuição.',
  },
  // TEMPORÁRIO: Categoria corporativa ocultada até disponibilização de projetos
  // {
  //   id: 'corporativo',
  //   name: 'Corporativo',
  //   namePlural: 'Corporativos',
  //   description: 'Franquias, escritórios e estabelecimentos de saúde.',
  // },
];

// Especificações padrão para os modelos
export const MODEL_SPECIFICATIONS: ProjectSpecification[] = [
  { id: 'mao-obra', category: 'Execução', name: 'Mão de obra' },
  { id: 'chassi-lsf', category: 'Estrutura', name: 'Chassi em LSF' },
  { id: 'estrutura-lsf', category: 'Estrutura', name: 'Estrutura LSF' },
  { id: 'laje-seca', category: 'Estrutura', name: 'Laje seca em placa cimentícia' },
  { id: 'telhado-pir', category: 'Cobertura', name: 'Telhado termoacústico em PIR' },
  { id: 'sistema-pluvial', category: 'Cobertura', name: 'Sistema pluvial' },
  { id: 'fechamentos-externos', category: 'Fechamentos', name: 'Fechamentos externos de paredes em termosiding' },
  { id: 'esquadrias', category: 'Esquadrias', name: 'Esquadrias linha Suprema com vidro temperado' },
  { id: 'instalacoes', category: 'Infraestrutura', name: 'Instalações complementares (elétrica, hidráulica e ar condicionado)' },
  { id: 'fechamentos-wpc', category: 'Acabamentos', name: 'Fechamentos internos de paredes em WPC nas áreas secas' },
  { id: 'fechamentos-pvc', category: 'Acabamentos', name: 'Fechamentos internos de paredes em PVC decorativo no banheiro' },
  { id: 'forro-wpc', category: 'Acabamentos', name: 'Fechamentos internos de forros em WPC' },
  { id: 'impermeabilizacao', category: 'Acabamentos', name: 'Impermeabilização' },
  { id: 'rodape', category: 'Acabamentos', name: 'Rodapé' },
  { id: 'piso-vinilico', category: 'Acabamentos', name: 'Piso vinílico' },
  { id: 'portas-internas', category: 'Acabamentos', name: 'Portas internas' },
  { id: 'cortina', category: 'Acabamentos', name: 'Cortina' },
  { id: 'loucas-metais', category: 'Acabamentos', name: 'Louças e metais' },
  { id: 'marcenaria', category: 'Mobiliário', name: 'Marcenaria' },
  { id: 'acabamentos-eletricos', category: 'Acabamentos', name: 'Acabamentos de luminárias e interruptores' },
  { id: 'eletrodomesticos', category: 'Mobiliário', name: 'Eletrodomésticos (Cooktop e depurador)' },
];

// ============================================
// PROJETOS
// ============================================

export const PROJECTS: Project[] = [
  // ============================================
  // RESIDENCIAL
  // ============================================

  // Casa Alto Padrão
  {
    id: 'res-casa-01',
    slug: 'casa-contemporanea-alphaville',
    name: 'Casa Contemporânea Alphaville',
    category: 'residencial',
    subtype: 'casa',
    tagline: '280m² de design contemporâneo e sofisticação',
    description: `Residência de alto padrão construída em Light Steel Frame no condomínio Alphaville. O projeto une linhas contemporâneas com funcionalidade, oferecendo amplos espaços integrados e acabamento premium.

A estrutura em LSF permitiu execução 50% mais rápida que construção convencional, com precisão milimétrica nos acabamentos. Destaque para o pé-direito duplo na sala de estar e a integração total com a área externa.`,
    heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2400&q=80',
    cardImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    area: {
      builtArea: 280.00,
      minLotWidth: 15.0,
      minLotLength: 30.0,
      buildWidth: 14.0,
      buildLength: 20.0,
    },
    features: {
      bedrooms: 4,
      bathrooms: 5,
      suites: 3,
      kitchens: 1,
      livingRooms: 2,
      diningRooms: 1,
      laundries: 1,
      garages: 3,
    },
    gallery: [
      { src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', alt: 'Fachada principal', type: 'exterior' },
      { src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', alt: 'Sala de estar integrada', type: 'interior' },
      { src: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80', alt: 'Área gourmet', type: 'interior' },
    ],
    floorPlans: [],
    models: [],
    specifications: [],
    highlights: [
      'Construção 50% mais rápida',
      'Pé-direito duplo na sala',
      'Piscina com borda infinita',
      'Automação residencial completa',
    ],
    constructionTime: '120-150 dias',
    warranty: '5 anos',
    location: 'Alphaville, SP',
    year: 2024,
  },

  // Chalé Montana
  {
    id: 'res-chale-01',
    slug: 'chale-montana',
    name: 'Chalé Montana',
    category: 'residencial',
    subtype: 'chale',
    tagline: 'Refúgio de montanha com design contemporâneo',
    description: 'Um chalé moderno que combina o aconchego da madeira com a tecnologia do Steel Frame. Ideal para regiões serranas e climas frios, com excelente isolamento térmico.',
    heroImage: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=2400&q=80',
    cardImage: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80',
    area: {
      builtArea: 85.00,
      minLotWidth: 12.0,
      minLotLength: 20.0,
      buildWidth: 8.5,
      buildLength: 10.0,
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      suites: 1,
      kitchens: 1,
      livingRooms: 1,
      diningRooms: 1,
      laundries: 1,
      garages: 1,
    },
    gallery: [
      { src: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80', alt: 'Chalé Montana - Vista Externa', type: 'exterior' },
    ],
    floorPlans: [],
    models: [],
    specifications: [],
    highlights: [
      'Design contemporâneo',
      'Isolamento térmico superior',
      'Lareira integrada',
    ],
    constructionTime: '60-90 dias',
    warranty: '5 anos',
    location: 'Campos do Jordão, SP',
    year: 2023,
  },

  // Tiny House Fiano
  {
    id: 'res-tiny-01',
    slug: 'tiny-house-fiano',
    name: 'Tiny House Fiano',
    category: 'residencial',
    subtype: 'tiny-house',
    tagline: '16m² de praticidade e liberdade em um ambiente integrado',
    description: `Tiny House Fiano oferece 16 m² de praticidade em um ambiente integrado com quarto, sala, cozinha e lavanderia, além de banheiro privativo. A ampla porta de vidro frontal garante iluminação natural e conexão com a vista.

Móvel e transportável, permite mudar de lugar sempre que necessário. Construída em Light Steel Frame, é até 50% mais rápida e seis vezes mais leve que a alvenaria.`,
    heroImage: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&w=2400&q=80',
    cardImage: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&w=800&q=80',
    area: {
      builtArea: 16.00,
      minLotWidth: 5.6,
      minLotLength: 9.0,
      buildWidth: 2.6,
      buildLength: 6.0,
    },
    features: {
      bedrooms: 1,
      bathrooms: 1,
      suites: 0,
      kitchens: 1,
      livingRooms: 1,
      diningRooms: 1,
      laundries: 1,
      garages: 0,
    },
    gallery: [
      { src: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&w=1200&q=80', alt: 'Tiny House Fiano - Vista Externa', type: 'exterior' },
      { src: 'https://images.unsplash.com/photo-1585128792020-803d29415281?auto=format&fit=crop&w=1200&q=80', alt: 'Tiny House Fiano - Interior', type: 'interior' },
    ],
    floorPlans: [],
    models: [],
    specifications: MODEL_SPECIFICATIONS,
    highlights: [
      'Construção 50% mais rápida',
      'Móvel e transportável',
      'Telhado termoacústico PIR',
      'Baixa manutenção',
    ],
    constructionTime: '30-45 dias',
    warranty: '5 anos',
    location: 'São Paulo, SP',
    year: 2024,
  },

  // Sobrado Moderno
  {
    id: 'res-sobrado-01',
    slug: 'sobrado-vila-madalena',
    name: 'Sobrado Vila Madalena',
    category: 'residencial',
    subtype: 'sobrado',
    tagline: 'Arquitetura urbana com eficiência construtiva',
    description: 'Sobrado contemporâneo em terreno estreito, maximizando cada metro quadrado com inteligência. O Steel Frame permitiu vãos maiores e aproveitamento total do lote.',
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80',
    cardImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    area: {
      builtArea: 180.00,
      minLotWidth: 7.0,
      minLotLength: 25.0,
      buildWidth: 6.5,
      buildLength: 20.0,
    },
    features: {
      bedrooms: 3,
      bathrooms: 3,
      suites: 2,
      kitchens: 1,
      livingRooms: 1,
      diningRooms: 1,
      laundries: 1,
      garages: 2,
    },
    gallery: [
      { src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', alt: 'Fachada do Sobrado', type: 'exterior' },
    ],
    floorPlans: [],
    models: [],
    specifications: [],
    highlights: [
      'Aproveitamento máximo do terreno',
      'Vãos amplos sem pilares',
      'Terraço com jardim vertical',
    ],
    constructionTime: '90-120 dias',
    warranty: '5 anos',
    location: 'Vila Madalena, SP',
    year: 2024,
  },

  // ============================================
  // COMERCIAL
  // ============================================

  // Showroom Automotivo
  {
    id: 'com-showroom-01',
    slug: 'showroom-automotivo-premium',
    name: 'Showroom Automotivo Premium',
    category: 'comercial',
    subtype: 'showroom',
    tagline: '800m² de exposição com vãos livres de 20 metros',
    description: `Showroom automotivo de alto padrão com estrutura em Steel Frame que permitiu vãos livres de até 20 metros sem pilares intermediários. O projeto combina funcionalidade comercial com arquitetura impressionante.

A construção foi finalizada em tempo recorde, permitindo inauguração antes do prazo previsto e economia significativa para o cliente.`,
    heroImage: 'https://images.unsplash.com/photo-1562911791-c7a97b729ec5?auto=format&fit=crop&w=2400&q=80',
    cardImage: 'https://images.unsplash.com/photo-1562911791-c7a97b729ec5?auto=format&fit=crop&w=800&q=80',
    area: {
      builtArea: 800.00,
      minLotWidth: 30.0,
      minLotLength: 40.0,
      buildWidth: 25.0,
      buildLength: 32.0,
    },
    features: {
      bedrooms: 0,
      bathrooms: 4,
      suites: 0,
      kitchens: 1,
      livingRooms: 0,
      diningRooms: 0,
      laundries: 0,
      garages: 50,
    },
    gallery: [
      { src: 'https://images.unsplash.com/photo-1567449303078-57ad995bd329?auto=format&fit=crop&w=1200&q=80', alt: 'Showroom - Área de exposição', type: 'interior' },
    ],
    floorPlans: [],
    models: [],
    specifications: [],
    highlights: [
      'Vãos livres de 20 metros',
      'Iluminação natural zenital',
      'Climatização integrada',
      'Piso de alta resistência',
    ],
    constructionTime: '90-120 dias',
    warranty: '5 anos',
    location: 'São Paulo, SP',
    year: 2023,
  },

  // Loja Conceito
  {
    id: 'com-loja-01',
    slug: 'loja-conceito-moda',
    name: 'Loja Conceito Moda',
    category: 'comercial',
    subtype: 'loja',
    tagline: 'Varejo de experiência com arquitetura diferenciada',
    description: 'Loja conceito para marca de moda premium, com design que valoriza os produtos e proporciona experiência única ao cliente. A estrutura leve permitiu fachada totalmente envidraçada.',
    heroImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2400&q=80',
    cardImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    area: {
      builtArea: 250.00,
      minLotWidth: 10.0,
      minLotLength: 25.0,
      buildWidth: 10.0,
      buildLength: 25.0,
    },
    features: {
      bedrooms: 0,
      bathrooms: 2,
      suites: 0,
      kitchens: 0,
      livingRooms: 0,
      diningRooms: 0,
      laundries: 0,
      garages: 0,
    },
    gallery: [
      { src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80', alt: 'Interior da loja', type: 'interior' },
    ],
    floorPlans: [],
    models: [],
    specifications: [],
    highlights: [
      'Fachada totalmente envidraçada',
      'Iluminação cênica',
      'Provadores amplos',
      'Mezanino metálico',
    ],
    constructionTime: '60-75 dias',
    warranty: '5 anos',
    location: 'Jardins, SP',
    year: 2024,
  },

  // Restaurante
  {
    id: 'com-restaurante-01',
    slug: 'restaurante-gastronomico-chef',
    name: 'Restaurante Gastronômico',
    category: 'comercial',
    subtype: 'restaurante',
    tagline: 'Gastronomia em ambiente arquitetônico premiado',
    description: 'Restaurante de alta gastronomia com cozinha industrial integrada. O Steel Frame permitiu flexibilidade total no layout e instalações técnicas complexas em tempo recorde.',
    heroImage: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=2400&q=80',
    cardImage: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
    area: {
      builtArea: 350.00,
      minLotWidth: 15.0,
      minLotLength: 25.0,
      buildWidth: 14.0,
      buildLength: 25.0,
    },
    features: {
      bedrooms: 0,
      bathrooms: 4,
      suites: 0,
      kitchens: 2,
      livingRooms: 0,
      diningRooms: 0,
      laundries: 0,
      garages: 20,
    },
    gallery: [
      { src: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80', alt: 'Salão principal', type: 'interior' },
    ],
    floorPlans: [],
    models: [],
    specifications: [],
    highlights: [
      'Cozinha industrial integrada',
      'Sistema de exaustão eficiente',
      'Acústica tratada',
      'Terraço descoberto',
    ],
    constructionTime: '75-90 dias',
    warranty: '5 anos',
    location: 'Pinheiros, SP',
    year: 2023,
  },

  // ============================================
  // INDUSTRIAL
  // ============================================

  // Galpão Logístico
  {
    id: 'ind-galpao-01',
    slug: 'galpao-logistico-cajamar',
    name: 'Galpão Logístico Cajamar',
    category: 'industrial',
    subtype: 'galpao',
    tagline: '2.000m² de área útil com pé-direito de 12 metros',
    description: `Centro de distribuição de grande porte construído em Steel Frame, combinando estrutura principal em aço com fechamentos em painéis termoacústicos. O projeto atende às exigências de operações logísticas modernas.

A construção em tempo recorde permitiu início das operações 40% antes do previsto com métodos tradicionais.`,
    heroImage: '/images/comercial_steel_frame.webp',
    cardImage: '/images/comercial_steel_frame.webp',
    area: {
      builtArea: 2000.00,
      minLotWidth: 50.0,
      minLotLength: 60.0,
      buildWidth: 40.0,
      buildLength: 50.0,
    },
    features: {
      bedrooms: 0,
      bathrooms: 6,
      suites: 0,
      kitchens: 1,
      livingRooms: 0,
      diningRooms: 0,
      laundries: 0,
      garages: 100,
    },
    gallery: [
      { src: '/images/comercial_steel_frame.webp', alt: 'Vista externa do galpão', type: 'exterior' },
    ],
    floorPlans: [],
    models: [],
    specifications: [],
    highlights: [
      'Pé-direito de 12 metros',
      'Docas para 10 carretas',
      'Sprinklers e brigada',
      'Escritório integrado',
    ],
    constructionTime: '120-150 dias',
    warranty: '5 anos',
    location: 'Cajamar, SP',
    year: 2024,
  },

  // Centro de Distribuição
  {
    id: 'ind-cd-01',
    slug: 'centro-distribuicao-ecommerce',
    name: 'Centro de Distribuição E-commerce',
    category: 'industrial',
    subtype: 'deposito',
    tagline: 'Operação automatizada com 5.000m²',
    description: 'Centro de distribuição projetado para operações de e-commerce com alto volume de pedidos. Estrutura otimizada para instalação de sistemas automatizados de picking e expedição.',
    heroImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2400&q=80',
    cardImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    area: {
      builtArea: 5000.00,
      minLotWidth: 80.0,
      minLotLength: 100.0,
      buildWidth: 62.0,
      buildLength: 80.0,
    },
    features: {
      bedrooms: 0,
      bathrooms: 10,
      suites: 0,
      kitchens: 2,
      livingRooms: 0,
      diningRooms: 0,
      laundries: 0,
      garages: 200,
    },
    gallery: [
      { src: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80', alt: 'Interior do CD', type: 'interior' },
    ],
    floorPlans: [],
    models: [],
    specifications: [],
    highlights: [
      'Preparado para automação',
      'Cross-docking',
      'Mezanino operacional',
      'Certificação LEED',
    ],
    constructionTime: '150-180 dias',
    warranty: '5 anos',
    location: 'Guarulhos, SP',
    year: 2023,
  },

  // Fábrica Modular
  {
    id: 'ind-fabrica-01',
    slug: 'fabrica-modular-alimenticios',
    name: 'Fábrica Modular Alimentícios',
    category: 'industrial',
    subtype: 'fabrica',
    tagline: 'Produção industrial com padrão sanitário',
    description: 'Unidade fabril para indústria alimentícia com todos os requisitos sanitários. Estrutura em Steel Frame com fechamentos em painéis frigoríficos e áreas limpas controladas.',
    heroImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=2400&q=80',
    cardImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    area: {
      builtArea: 1500.00,
      minLotWidth: 40.0,
      minLotLength: 50.0,
      buildWidth: 30.0,
      buildLength: 50.0,
    },
    features: {
      bedrooms: 0,
      bathrooms: 8,
      suites: 0,
      kitchens: 0,
      livingRooms: 0,
      diningRooms: 0,
      laundries: 0,
      garages: 50,
    },
    gallery: [
      { src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80', alt: 'Área de produção', type: 'interior' },
    ],
    floorPlans: [],
    models: [],
    specifications: [],
    highlights: [
      'Áreas limpas ISO 7',
      'Câmaras frigoríficas',
      'Vestiários com barreira',
      'Aprovação ANVISA',
    ],
    constructionTime: '120-150 dias',
    warranty: '5 anos',
    location: 'Jundiaí, SP',
    year: 2024,
  },

  // ============================================
  // CORPORATIVO - TEMPORÁRIO: Projetos ocultados até disponibilização
  // ============================================

  // // McDonald's
  // {
  //   id: 'corp-mcdonalds-01',
  //   slug: 'mcdonalds-drive-thru-curitiba',
  //   name: "McDonald's Drive-Thru",
  //   category: 'corporativo',
  //   subtype: 'franquia',
  //   tagline: 'Franquia inaugurada em tempo recorde',
  //   description: `Unidade McDonald's com Drive-Thru construída em Steel Frame, seguindo todos os padrões internacionais da marca. A construção foi concluída em apenas 60 dias, permitindo inauguração antes do previsto.
  //
  // O sistema construtivo atendeu todas as especificações técnicas da franqueadora, incluindo instalações elétricas, hidráulicas, exaustão e climatização.`,
  //   heroImage: '/images/mac_steel_frame.webp',
  //   cardImage: '/images/mac_steel_frame.webp',
  //   area: {
  //     builtArea: 450.00,
  //     minLotWidth: 25.0,
  //     minLotLength: 35.0,
  //     buildWidth: 20.0,
  //     buildLength: 22.0,
  //   },
  //   features: {
  //     bedrooms: 0,
  //     bathrooms: 4,
  //     suites: 0,
  //     kitchens: 1,
  //     livingRooms: 0,
  //     diningRooms: 0,
  //     laundries: 0,
  //     garages: 30,
  //   },
  //   gallery: [
  //     { src: '/images/mac_steel_frame.webp', alt: "McDonald's em construção", type: 'exterior' },
  //   ],
  //   floorPlans: [],
  //   models: [],
  //   specifications: [],
  //   highlights: [
  //     'Padrão internacional da marca',
  //     'Drive-Thru completo',
  //     'Cozinha industrial aprovada',
  //     'Inauguração em 60 dias',
  //   ],
  //   constructionTime: '45-60 dias',
  //   warranty: '5 anos',
  //   location: 'Curitiba, PR',
  //   year: 2024,
  //   client: "Arcos Dorados",
  // },

  // // Escritório Corporativo
  // {
  //   id: 'corp-escritorio-01',
  //   slug: 'escritorio-tech-startup',
  //   name: 'Escritório Tech Startup',
  //   category: 'corporativo',
  //   subtype: 'escritorio',
  //   tagline: 'Ambiente de trabalho moderno e colaborativo',
  //   description: 'Sede corporativa para startup de tecnologia, com layout flexível e infraestrutura para crescimento. O Steel Frame permitiu instalação rápida de cabeamento estruturado e climatização.',
  //   heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2400&q=80',
  //   cardImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
  //   area: {
  //     builtArea: 600.00,
  //     minLotWidth: 20.0,
  //     minLotLength: 35.0,
  //     buildWidth: 17.0,
  //     buildLength: 35.0,
  //   },
  //   features: {
  //     bedrooms: 0,
  //     bathrooms: 6,
  //     suites: 0,
  //     kitchens: 2,
  //     livingRooms: 0,
  //     diningRooms: 0,
  //     laundries: 0,
  //     garages: 25,
  //   },
  //   gallery: [
  //     { src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80', alt: 'Open space', type: 'interior' },
  //   ],
  //   floorPlans: [],
  //   models: [],
  //   specifications: [],
  //   highlights: [
  //     'Layout open space',
  //     'Salas de reunião acústicas',
  //     'Área de descompressão',
  //     'Infraestrutura de TI',
  //   ],
  //   constructionTime: '75-90 dias',
  //   warranty: '5 anos',
  //   location: 'Faria Lima, SP',
  //   year: 2024,
  // },

  // // Clínica Médica
  // {
  //   id: 'corp-clinica-01',
  //   slug: 'clinica-medica-especializada',
  //   name: 'Clínica Médica Especializada',
  //   category: 'corporativo',
  //   subtype: 'clinica',
  //   tagline: 'Saúde com infraestrutura de ponta',
  //   description: 'Clínica multiespecialidades com centro cirúrgico ambulatorial. Estrutura projetada para atender todas as normas da ANVISA e do Corpo de Bombeiros.',
  //   heroImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=2400&q=80',
  //   cardImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
  //   area: {
  //     builtArea: 800.00,
  //     minLotWidth: 25.0,
  //     minLotLength: 40.0,
  //     buildWidth: 20.0,
  //     buildLength: 40.0,
  //   },
  //   features: {
  //     bedrooms: 0,
  //     bathrooms: 12,
  //     suites: 0,
  //     kitchens: 1,
  //     livingRooms: 0,
  //     diningRooms: 0,
  //     laundries: 0,
  //     garages: 40,
  //   },
  //   gallery: [
  //     { src: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80', alt: 'Recepção da clínica', type: 'interior' },
  //   ],
  //   floorPlans: [],
  //   models: [],
  //   specifications: [],
  //   highlights: [
  //     'Centro cirúrgico ambulatorial',
  //     'Salas de exames equipadas',
  //     'Acessibilidade total',
  //     'Aprovação ANVISA',
  //   ],
  //   constructionTime: '90-120 dias',
  //   warranty: '5 anos',
  //   location: 'Moema, SP',
  //   year: 2023,
  // },
];

// ============================================
// FUNÇÕES UTILITÁRIAS
// ============================================

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find(p => p.slug === slug);
}

export function getProjectsByCategory(category: ProjectCategory): Project[] {
  return PROJECTS.filter(p => p.category === category);
}

export function getProjectsBySegment(segment: ProjectSegment): Project[] {
  return PROJECTS.filter(p => p.category === segment);
}

export function getAllProjectSlugs(): string[] {
  return PROJECTS.map(p => p.slug);
}

export function getCategoryInfo(category: ProjectCategory): ProjectCategoryInfo | undefined {
  return PROJECT_CATEGORIES.find(c => c.id === category);
}

export function getSpecificationName(specId: string): string {
  const spec = MODEL_SPECIFICATIONS.find(s => s.id === specId);
  return spec?.name || specId;
}

export function getProjectCountBySegment(segment: ProjectSegment): number {
  return PROJECTS.filter(p => p.category === segment).length;
}
