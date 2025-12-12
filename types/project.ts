// Tipos para a seção de Projetos Prontos

export interface ProjectArea {
  builtArea: number;        // Área construída em m²
  minLotWidth: number;      // Largura mínima do lote em metros
  minLotLength: number;     // Comprimento mínimo do lote em metros
  buildWidth: number;       // Largura da obra em metros
  buildLength: number;      // Comprimento da obra em metros
}

export interface ProjectFeatures {
  bedrooms: number;         // Dormitórios
  bathrooms: number;        // Banheiros
  suites: number;           // Suítes
  kitchens: number;         // Cozinhas
  livingRooms: number;      // Salas de Estar
  diningRooms: number;      // Salas de Jantar
  laundries: number;        // Lavanderias
  garages: number;          // Vagas de garagem
}

export interface ProjectImage {
  src: string;
  alt: string;
  type: 'exterior' | 'interior' | 'floor-plan' | 'detail' | 'render';
}

export interface ProjectModelFeature {
  name: string;
  included: boolean;
}

export interface ProjectModel {
  id: string;
  name: string;                       // Ex: "Steel", "Supreme"
  shortName: string;                  // Ex: "Steel", "Sup."
  description?: string;
  price?: string;
  features: ProjectModelFeature[];
}

export interface ProjectSpecification {
  id: string;
  category: string;                   // Ex: "Estrutura", "Acabamentos"
  name: string;                       // Ex: "Chassi em LSF"
  description?: string;
}

// Segmentos principais
// TEMPORÁRIO: 'corporativo' ocultado até disponibilização de projetos
export type ProjectSegment = 'residencial' | 'comercial' | 'industrial'; // | 'corporativo'

// Subcategorias por segmento
export type ResidentialType = 'casa' | 'chale' | 'tiny-house' | 'sobrado';
export type CommercialType = 'loja' | 'showroom' | 'restaurante';
export type IndustrialType = 'galpao' | 'deposito' | 'fabrica';
export type CorporateType = 'franquia' | 'escritorio' | 'clinica';

export type ProjectSubtype = ResidentialType | CommercialType | IndustrialType | CorporateType;

// Manter compatibilidade com código existente
export type ProjectCategory = ProjectSegment;

export interface ProjectSegmentInfo {
  id: ProjectSegment;
  name: string;
  namePlural: string;
  description: string;
  icon?: string;
  projectCount: number;
  image: string;
}

export interface ProjectCategoryInfo {
  id: ProjectCategory;
  name: string;
  namePlural: string;
  description: string;
  icon?: string;
}

export interface Project {
  id: string;
  slug: string;
  name: string;                       // Ex: "Tiny House Fiano"
  category: ProjectCategory;          // Segmento: residencial, comercial, industrial, corporativo
  subtype?: ProjectSubtype;           // Subcategoria específica
  tagline: string;                    // Frase curta para o card
  description: string;                // Descrição completa (pode ter múltiplos parágrafos)
  heroImage: string;
  cardImage: string;
  area: ProjectArea;
  features: ProjectFeatures;
  gallery: ProjectImage[];
  floorPlans: ProjectImage[];
  models: ProjectModel[];
  specifications: ProjectSpecification[];
  highlights: string[];               // Lista de diferenciais
  constructionTime?: string;          // Ex: "45 dias"
  warranty?: string;                  // Ex: "5 anos"
  location?: string;                  // Ex: "São Paulo, SP"
  year?: number;                      // Ano de conclusão
  client?: string;                    // Nome do cliente (opcional)
}

// Funções utilitárias de tipo
export function getCategoryLabel(category: ProjectCategory): string {
  const labels: Record<ProjectCategory, string> = {
    'residencial': 'Residencial',
    'comercial': 'Comercial',
    'industrial': 'Industrial',
    // 'corporativo': 'Corporativo', // TEMPORÁRIO: Ocultado
  };
  return labels[category];
}

export function getSubtypeLabel(subtype: ProjectSubtype): string {
  const labels: Record<ProjectSubtype, string> = {
    'casa': 'Casa',
    'chale': 'Chalé',
    'tiny-house': 'Tiny House',
    'sobrado': 'Sobrado',
    'loja': 'Loja',
    'showroom': 'Showroom',
    'restaurante': 'Restaurante',
    'galpao': 'Galpão',
    'deposito': 'Depósito',
    'fabrica': 'Fábrica',
    'franquia': 'Franquia',
    'escritorio': 'Escritório',
    'clinica': 'Clínica',
  };
  return labels[subtype];
}

// Dados dos segmentos para showcase
export const SEGMENTS: ProjectSegmentInfo[] = [
  {
    id: 'residencial',
    name: 'Residencial',
    namePlural: 'Residenciais',
    description: 'Casas, chalés e moradias personalizadas',
    projectCount: 85,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'comercial',
    name: 'Comercial',
    namePlural: 'Comerciais',
    description: 'Lojas, showrooms e espaços de varejo',
    projectCount: 35,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'industrial',
    name: 'Industrial',
    namePlural: 'Industriais',
    description: 'Galpões, fábricas e centros de distribuição',
    projectCount: 20,
    image: '/images/comercial_steel_frame.webp',
  },
  // TEMPORÁRIO: Segmento corporativo ocultado até disponibilização de projetos
  // {
  //   id: 'corporativo',
  //   name: 'Corporativo',
  //   namePlural: 'Corporativos',
  //   description: 'Franquias, escritórios e clínicas',
  //   projectCount: 15,
  //   image: '/images/mac_steel_frame.webp',
  // },
];

export function formatArea(area: number): string {
  return `${area.toFixed(2).replace('.', ',')} m²`;
}

export function formatDimensions(width: number, length: number): string {
  return `${width.toFixed(1).replace('.', ',')}m x ${length.toFixed(1).replace('.', ',')}m`;
}
