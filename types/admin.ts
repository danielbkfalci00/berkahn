// ============================================
// TIPOS DO SISTEMA ADMIN BERKAHN
// ============================================

import type {
  ArticleTable,
  ProcessStep,
  Myth,
  Stat,
  Norm,
  ChartData,
  TabComparison,
  DecisionGuide,
  ArticleGallery,
  ArticleChecklist,
  ArticleVideo,
  BeforeAfterComparison,
  ConstructionTimeline,
  ArticleFAQ,
  ArticleCalculator,
  CertificationBadges,
  ArticleTestimonial,
  ResourceLibrary,
  Comparison3DMatrix,
  MaterialSpecSheet,
  ArticleImage,
  ArticleCTA,
} from './article';

// ============================================
// BASE TYPES
// ============================================

export interface DatabaseTimestamps {
  created_at: string;
  updated_at: string;
}

export interface BaseEntity extends DatabaseTimestamps {
  id: string;
}

// ============================================
// POSTS (Blog/Atualidade)
// ============================================

export type PostStatus = 'draft' | 'scheduled' | 'published' | 'archived';

// Rich components structure for posts
export interface PostComponents {
  stats?: Stat[];
  tables?: ArticleTable[];
  charts?: ChartData[];
  myths?: Myth[];
  norms?: Norm[];
  process?: ProcessStep[];
  tabComparisons?: TabComparison[];
  decisionGuide?: DecisionGuide;
  gallery?: ArticleGallery;
  checklist?: ArticleChecklist;
  // Fase 1: Quick Wins
  videos?: ArticleVideo[];
  beforeAfters?: BeforeAfterComparison[];
  timelines?: ConstructionTimeline[];
  faqs?: ArticleFAQ[];
  // Fase 2: Engajamento Interativo
  calculators?: ArticleCalculator[];
  certifications?: CertificationBadges[];
  testimonials?: ArticleTestimonial[];
  resources?: ResourceLibrary[];
  // Fase 3: Componentes Avançados
  comparison3D?: Comparison3DMatrix[];
  specSheets?: MaterialSpecSheet[];
  // Imagens Contextuais
  images?: ArticleImage[];
  // CTAs Customizáveis
  ctas?: ArticleCTA[];
}

export interface Post extends BaseEntity {
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Markdown content
  cover_image: string | null;
  category: string;
  tags: string[];
  author: string;
  status: PostStatus;
  published_at: string | null;
  scheduled_at: string | null;
  read_time: number; // minutes
  featured: boolean;
  meta_title: string | null;
  meta_description: string | null;
  answer_summary: string | null; // AEO: direct answer paragraph for AI citation
  components: PostComponents; // Rich components (stats, tables, charts, etc.)
}

export interface PostInsert {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image?: string | null;
  category: string;
  tags?: string[];
  author: string;
  status?: PostStatus;
  published_at?: string | null;
  scheduled_at?: string | null;
  read_time?: number;
  featured?: boolean;
  meta_title?: string | null;
  meta_description?: string | null;
  answer_summary?: string | null; // AEO: direct answer paragraph for AI citation
  components?: PostComponents; // Rich components (optional)
}

export interface PostUpdate extends Partial<PostInsert> {
  id: string;
}

// ============================================
// PRESENTATIONS (Apresentações Executivas)
// ============================================

export type PresentationStatus = 'draft' | 'ready' | 'sent' | 'viewed';

export interface PresentationSlide {
  id: string;
  type: 'cover' | 'content' | 'gallery' | 'specs' | 'cta';
  title?: string;
  content?: string;
  image?: string;
  images?: string[];
  bullets?: string[];
  data?: Record<string, unknown>;
}

export interface Presentation extends BaseEntity {
  title: string;
  client_name: string;
  client_email: string | null;
  project_type: string;
  slides: PresentationSlide[];
  cover_image: string | null;
  status: PresentationStatus;
  sent_at: string | null;
  viewed_at: string | null;
  view_count: number;
  access_token: string; // unique token for client access
  expires_at: string | null;
}

export interface PresentationInsert {
  title: string;
  client_name: string;
  client_email?: string | null;
  project_type: string;
  slides?: PresentationSlide[];
  cover_image?: string | null;
  status?: PresentationStatus;
  expires_at?: string | null;
}

export interface PresentationUpdate extends Partial<PresentationInsert> {
  id: string;
}

// ============================================
// PROPOSALS (Propostas de Orçamento)
// ============================================

export type ProposalStatus = 'draft' | 'sent' | 'viewed' | 'approved' | 'rejected' | 'expired';

export interface ProposalItem {
  id: string;
  description: string;
  unit: string;
  quantity: number;
  unit_price: number;
  total: number;
  category?: string;
  notes?: string;
}

export interface Proposal extends BaseEntity {
  proposal_number: string; // BRK-2024-001
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  client_address: string | null;
  project_type: string;
  project_description: string | null;
  items: ProposalItem[];
  subtotal: number;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  discount_amount: number;
  total: number;
  status: ProposalStatus;
  valid_until: string;
  payment_terms: string | null;
  notes: string | null;
  internal_notes: string | null;
  sent_at: string | null;
  viewed_at: string | null;
  responded_at: string | null;
  access_token: string;
}

export interface ProposalInsert {
  client_name: string;
  client_email?: string | null;
  client_phone?: string | null;
  client_address?: string | null;
  project_type: string;
  project_description?: string | null;
  items?: ProposalItem[];
  discount_type?: 'percentage' | 'fixed';
  discount_value?: number;
  valid_until: string;
  payment_terms?: string | null;
  notes?: string | null;
  internal_notes?: string | null;
}

export interface ProposalUpdate extends Partial<ProposalInsert> {
  id: string;
  status?: ProposalStatus;
}

// ============================================
// USER & AUTH
// ============================================

export type UserRole = 'admin' | 'editor' | 'viewer';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  last_sign_in_at: string | null;
}

// ============================================
// DASHBOARD & ANALYTICS
// ============================================

export interface DashboardStats {
  posts: {
    total: number;
    published: number;
    drafts: number;
    scheduled: number;
  };
  proposals: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    total_value: number;
  };
  presentations: {
    total: number;
    sent: number;
    viewed: number;
  };
}

export interface ActivityLog {
  id: string;
  user_id: string;
  user_name: string;
  action: string;
  entity_type: 'post' | 'proposal' | 'presentation';
  entity_id: string;
  entity_name: string;
  details: Record<string, unknown> | null;
  created_at: string;
}

// ============================================
// API RESPONSES
// ============================================

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// ============================================
// FORM STATES
// ============================================

export interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isLoading: boolean;
  isSubmitting: boolean;
}

// ============================================
// FILTER & SORT
// ============================================

export interface PostFilters {
  status?: PostStatus;
  category?: string;
  featured?: boolean;
  search?: string;
}

export interface ProposalFilters {
  status?: ProposalStatus;
  project_type?: string;
  search?: string;
  date_from?: string;
  date_to?: string;
}

export interface PresentationFilters {
  status?: PresentationStatus;
  project_type?: string;
  search?: string;
}

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: string;
  direction: SortDirection;
}
