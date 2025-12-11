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

export type ProjectCategory = 'chale' | 'tiny-house' | 'casa-campo' | 'casa-praia';

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
  category: ProjectCategory;
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
}

// Funções utilitárias de tipo
export function getCategoryLabel(category: ProjectCategory): string {
  const labels: Record<ProjectCategory, string> = {
    'chale': 'Chalé',
    'tiny-house': 'Tiny House',
    'casa-campo': 'Casa de Campo',
    'casa-praia': 'Casa de Praia',
  };
  return labels[category];
}

export function formatArea(area: number): string {
  return `${area.toFixed(2).replace('.', ',')} m²`;
}

export function formatDimensions(width: number, length: number): string {
  return `${width.toFixed(1).replace('.', ',')}m x ${length.toFixed(1).replace('.', ',')}m`;
}
