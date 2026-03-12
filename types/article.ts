import { BlogCategory } from "./blog";

// Extended article types for rich content pages
export interface RichArticle {
  slug: string;
  title: string;
  subtitle?: string;
  category: BlogCategory;
  author: string;
  publishDate: string;
  readTime: number; // in minutes
  heroImage: string;
  excerpt: string;

  // Table of contents
  sections: ArticleSection[];

  // Special content components
  tables?: ArticleTable[];
  process?: ProcessStep[];
  myths?: Myth[];
  stats?: Stat[];
  norms?: Norm[];
  charts?: ChartData[];
  tabComparisons?: TabComparison[];
  decisionGuide?: DecisionGuide;
  gallery?: ArticleGallery;
  checklist?: ArticleChecklist;

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

export interface ArticleSection {
  id: string;
  title: string;
  content: string;
  level: 2 | 3;
}

export interface ArticleTable {
  id: string;
  caption?: string;
  headers: string[];
  rows: (string | number)[][];
  highlightColumn?: number;
}

export interface ProcessStep {
  number: number;
  title: string;
  shortTitle: string;
  description: string;
  duration?: string;
}

export interface Myth {
  myth: string;
  truth: string;
}

export interface Stat {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  description?: string;
}

export interface Norm {
  code: string;
  title: string;
  description: string;
  year?: string;
}

// Chart data structure for interactive visualizations
export interface ChartData {
  id: string;
  type: 'bar' | 'line' | 'radar' | 'pie';
  title?: string;
  data: any[];
  config?: {
    xAxisKey?: string;
    dataKeys?: string[];
    colors?: string[];
  };
}

// Tab comparison structure for side-by-side comparisons
export interface TabComparison {
  id: string;
  title: string;
  tabs: {
    label: string;
    value: string;
    content: {
      stats?: Stat[];
      description?: string;
      table?: ArticleTable;
      items?: string[];
    };
  }[];
}

// Decision guide structure for interactive recommendations
export interface DecisionGuide {
  question: string;
  options: {
    label: string;
    recommendation: 'lsf' | 'alvenaria' | 'neutral';
    explanation: string;
  }[];
}

// Gallery structure for image carousels
export interface ArticleGallery {
  id: string;
  title?: string;
  images: {
    url: string;
    alt: string;
    caption?: string;
  }[];
}

// Checklist structure for verification items
export interface ArticleChecklist {
  id: string;
  title: string;
  items: {
    label: string;
    description: string;
  }[];
}

// ============================================
// FASE 1: NOVOS PLACEHOLDERS (Quick Wins)
// ============================================

// Video embed structure for YouTube, Vimeo, or direct video
export interface ArticleVideo {
  id: string;
  platform: 'youtube' | 'vimeo' | 'direct';
  videoId: string; // YouTube/Vimeo ID or direct URL
  url?: string; // Direct MP4 URL (for platform: 'direct')
  title?: string;
  caption?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1';
}

// Before/After comparison with image slider
export interface BeforeAfterComparison {
  id: string;
  title?: string;
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string; // Default: "Antes"
  afterLabel?: string; // Default: "Depois"
}

// Construction timeline visualization
export interface ConstructionTimeline {
  id: string;
  title?: string;
  milestones: ProcessStep[]; // Reuses existing ProcessStep type
  totalDuration?: string;
  showProgress?: boolean;
}

// FAQ section with accordion
export interface ArticleFAQ {
  id: string;
  title?: string;
  questions: {
    question: string;
    answer: string;
    category?: string;
  }[];
}

// ============================================
// FASE 2: ENGAJAMENTO INTERATIVO
// ============================================

// Dynamic calculator for ROI, cost comparisons, etc.
export interface ArticleCalculator {
  id: string;
  type: 'roi' | 'cost-comparison' | 'timeline-estimate' | 'custom';
  title: string;
  description?: string;
  inputs: {
    id: string;
    label: string;
    type: 'number' | 'select' | 'slider';
    unit?: string; // "m²", "R$", "%"
    min?: number;
    max?: number;
    step?: number;
    options?: { value: string; label: string }[];
    defaultValue: number | string;
    tooltip?: string;
  }[];
  formula: string; // Safe math expression (evaluated with math.js)
  resultLabel: string;
  resultUnit?: string;
  resultFormat?: 'currency' | 'percentage' | 'number' | 'days';
  disclaimer?: string;
}

// Certification badges for ABNT, LEED, ISO, etc.
export interface CertificationBadges {
  id: string;
  title?: string;
  certifications: {
    name: string;
    issuer: string; // "ABNT", "LEED", "ISO"
    code?: string; // "NBR 15253:2014"
    logo?: string;
    description?: string;
    link?: string;
    year?: string;
  }[];
  layout?: 'grid' | 'list' | 'carousel';
}

// Client testimonials with ratings
export interface ArticleTestimonial {
  id: string;
  title?: string;
  testimonials: {
    quote: string;
    author: string;
    role?: string; // "Proprietário", "Arquiteto"
    company?: string;
    project?: string; // "Casa Laranjeiras"
    avatar?: string;
    rating?: number; // 1-5 stars
    date?: string; // "Janeiro 2025"
    location?: string; // "São Paulo, SP"
  }[];
  layout?: 'cards' | 'carousel' | 'list';
}

// Resource downloads (PDFs, spreadsheets, guides)
export interface ResourceLibrary {
  id: string;
  title?: string;
  description?: string;
  resources: {
    title: string;
    description: string;
    type: 'pdf' | 'xlsx' | 'docx' | 'zip' | 'link';
    fileSize?: string; // "2.3 MB"
    downloadUrl?: string;
    thumbnail?: string;
    requiresEmail?: boolean; // Lead capture gate
    tags?: string[];
  }[];
  layout?: 'grid' | 'list';
}

// ============================================
// FASE 3: COMPONENTES AVANÇADOS
// ============================================

// 3D comparison matrix using radar chart
export interface Comparison3DMatrix {
  id: string;
  title: string;
  description?: string;
  dimensions: string[]; // ["Custo", "Prazo", "Sustentabilidade", "Durabilidade", "Manutenção"]
  options: {
    name: string; // "Steel Frame", "Alvenaria", "Madeira"
    scores: number[]; // [8, 9, 10, 7, 8] (0-10 scale for each dimension)
    color?: string; // Optional custom color
    description?: string;
  }[];
  maxScore?: number; // Default: 10
  showLegend?: boolean;
}

// Material specification sheet
export interface MaterialSpecSheet {
  id: string;
  material: string; // "Perfil Steel Frame 90mm"
  manufacturer?: string;
  category?: string; // "Estrutural", "Fechamento", "Acabamento"
  image?: string;
  specifications: {
    category: string; // "Dimensões", "Características Técnicas", "Desempenho"
    items: {
      property: string; // "Espessura"
      value: string; // "0.95 mm"
      unit?: string; // "mm"
      tolerance?: string; // "±0.05"
      standard?: string; // "NBR 15253"
    }[];
  }[];
  datasheetUrl?: string; // Link to PDF datasheet
  certifications?: string[]; // ["NBR 15253:2014", "ISO 9001"]
  applications?: string[]; // ["Paredes estruturais", "Lajes secas"]
  notes?: string;
}

/**
 * Article Image - Single optimized image for contextual use in articles
 * Use for photos that illustrate specific points in the text
 */
export interface ArticleImage {
  id: string;
  src: string; // Image path (e.g., "/images/blog/article/photo.jpg")
  alt: string; // Required for accessibility
  caption?: string; // Optional caption below image
  credit?: string; // Photo credit/attribution
  sourceUrl?: string; // Link to original source (makes credit clickable)
  layout?: 'full' | 'wide' | 'center' | 'float-left' | 'float-right'; // Layout style
  aspectRatio?: '16:9' | '4:3' | '1:1' | '3:2' | 'auto'; // Aspect ratio
  priority?: boolean; // Load immediately (for above-fold images)
  enableLightbox?: boolean; // Allow click to expand
}

/**
 * CTA (Call-to-Action) customizável para artigos
 * Permite configurar ação contextual ao final do artigo
 */
export interface ArticleCTA {
  id: string;
  label?: string; // Texto pequeno acima do título (e.g., "PRÓXIMO PASSO")
  title?: string; // Título principal do CTA
  description?: string; // Descrição do CTA
  actionType?: "dialog" | "link"; // Dialog abre form, link navega
  actionText?: string; // Texto do botão (e.g., "Solicitar Orçamento")
  actionHref?: string; // URL (apenas para actionType="link")
  defaultSegment?: "residencial" | "comercial" | ""; // Segmento pré-selecionado no form
}
