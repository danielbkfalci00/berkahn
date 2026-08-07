// Types do pipeline de analytics (GA4 + GSC) consumidos pelo /admin/analytics

// ============================================
// Raw data shapes (mirror dos scripts/analytics/fetch-*)
// ============================================

export interface Ga4Source {
  label: string;
  sessions: number;
  users: number;
  pctOfTotal: number;
}

export interface Ga4PageRow {
  path: string;
  slug: string;
  pageviews: number;
  users: number;
  avgEngagementTime: number;
  // Métricas adicionadas no Sprint 2 (fetch-ga4 retorna 0 quando não disponível)
  bounceRate?: number; // 0-100 (pct)
  engagementRate?: number; // 0-100 (pct)
  sessions?: number;
  newUsers?: number;
  // Enriched fields (preenchidos pelo client após join com Supabase)
  title?: string;
  category?: string | null;
  momText?: string;
}

// ============================================
// Performance de post — usado pelo Ato 3
// ============================================

export type PostStatus = "engaged" | "rising" | "cold" | "abandoned" | "neutral";

export interface PostMeta {
  slug: string;
  title: string;
  category: string;
  readTimeMin: number;
  publishedAt: string | null;
}

export interface PostPerformance {
  slug: string;
  title: string;
  category: string;
  readTimeMin: number;
  ageInDays: number | null;
  pageviews: number;
  pageviewsPrev: number | null;
  pageviewsMoMPct: number | null;
  pageviewsSparkline: number[]; // últimos N meses (cresce com o tempo)
  users: number;
  avgEngagementTime: number;
  bounceRate: number | null;
  engagementRate: number | null;
  retentionPct: number;
  status: PostStatus;
}

export interface Ga4Device {
  device: string;
  users: number;
  pctOfTotal: number;
}

export interface Ga4Area {
  area: string;
  pageviews: number;
  pctOfTotal: number;
}

export interface Ga4Event {
  name: string;
  count: number;
  topPages?: string;
}

export interface Ga4Data {
  users: number;
  sessions: number;
  pageviews: number;
  engagementRate: number; // 0-100 (pct)
  avgSessionDuration: number; // seconds
  topPages: Ga4PageRow[];
  topSources: Ga4Source[];
  byDevice: Ga4Device[];
  byArea: Ga4Area[];
  events: Ga4Event[];
  period: { startDate: string; endDate: string };
}

export interface GscQuery {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number; // 0-100 (pct)
  position: number;
}

export interface GscPage {
  page: string;
  slug: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  title?: string;
  category?: string | null;
}

export interface GscDelta {
  query: string;
  clicksCurrent: number;
  clicksPrevious: number;
  clicksDelta: number;
}

export interface GscIndexation {
  url: string;
  slug: string;
  title?: string;
  verdict: string;
  coverageState: string;
  indexingState?: string;
  lastCrawlTime: string | null;
  googleCanonical?: string | null;
  userCanonical?: string | null;
  statusLabel?: string;
  error?: string;
}

export interface GscData {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  topQueries: GscQuery[];
  topPages: GscPage[];
  risingQueries: GscDelta[];
  fallingQueries: GscDelta[];
  indexation: GscIndexation[];
  period: { startDate: string; endDate: string };
}

// ============================================
// Context object (gerado pelo orquestrador)
// ============================================

export interface SummaryItem {
  text: string;
}

export interface Insight {
  position: number;
  text: string;
}

export interface ActionItem {
  text: string;
}

// ============================================
// Sistema de tarefas (Sprint 7) — tabela analytics_tasks
// ============================================

export type TaskPriority = "p0" | "p1" | "p2";
export type TaskStatus = "open" | "done";

/** Espelha a tabela `analytics_tasks` (snake_case direto do Supabase). */
export interface AnalyticsTask {
  id: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  sort_order: number;
  source: "system" | "manual";
  origin_signal: string | null;
  completion_note: string | null;
  completed_by: string | null;
  completed_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  pauta_id: string | null;
  evidence: Record<string, unknown>;
  approval_status: "pendente" | "aprovada" | "rejeitada";
}

export type LeadStatus = "novo" | "qualificado" | "desqualificado" | "convertido";

export interface AnalyticsLead {
  id: string;
  nome: string;
  email: string | null;
  telefone: string;
  segmento: string;
  mensagem: string;
  canal: string;
  status: LeadStatus;
  pagina_origem: string | null;
  slug_origem: string | null;
  cta_location: string | null;
  pauta_id: string | null;
  sheet_sync_status: "pendente" | "sincronizado" | "falhou";
  sheet_sync_tentativas: number;
  sheet_sync_error: string | null;
  criado_em: string;
}

export interface SnapshotContext {
  generatedDate: string;
  generatedAt: string;
  monthLabel: string;
  monthSlug: string; // "YYYY-MM"
  periodStart: string;
  periodEnd: string;
  ga4: Ga4Data & {
    usersMoMText?: string;
    usersMoMPct?: number;
    sessionsMoMText?: string;
    sessionsMoMPct?: number;
    pageviewsMoMText?: string;
    pageviewsMoMPct?: number;
    engagementRateMoMText?: string;
    engagementRateMoMPct?: number;
    avgSessionDurationMoMText?: string;
    avgSessionDurationMoMPct?: number;
  };
  gsc: GscData & {
    clicksMoMText?: string;
    clicksMoMPct?: number;
    impressionsMoMText?: string;
    impressionsMoMPct?: number;
    ctrMoMText?: string;
    ctrMoMPct?: number;
    positionMoMText?: string;
    positionMoMPct?: number;
  };
  indexation: GscIndexation[];
  indexedCount: number;
  totalArticles: number;
  topArticle: { title: string; slug: string };
  summary: SummaryItem[];
  insights: Insight[];
  actionsP0: ActionItem[];
  actionsP1: ActionItem[];
  actionsP2: ActionItem[];
  topAction: ActionItem;
  ga4PropertyId: string;
  gscSiteUrl: string;
  historicalMonths: string;

  // Mês parcial. Ausentes nos snapshots gerados antes do suporte a parcial
  // (2026-02 a 2026-06) — `partial === undefined` é falsy, então basta
  // `if (ctx.partial)` sem guard extra.
  /** True quando o mês ainda não fechou e a janela foi cortada no lag do GSC. */
  partial?: boolean;
  daysCovered?: number;
  daysInMonth?: number;
  /** Último dia com dado consolidado (= periodEnd). */
  asOfDate?: string;
  gscLagDays?: number | null;
  /** Janela do mês anterior usada no MoM — equivalente em dias quando parcial. */
  prevPeriodStart?: string;
  prevPeriodEnd?: string;
  prevDaysCovered?: number | null;
  /** "2026-07-01 a 2026-07-26 (parcial, 26 de 31 dias)" */
  periodoAnaliseLabel?: string;
}

// ============================================
// Supabase row shape
// ============================================

export interface AnalyticsSnapshot {
  month: string; // "YYYY-MM-DD" (first of month)
  ga4_data: Ga4Data;
  gsc_data: GscData;
  ga4_prev: Ga4Data | null;
  gsc_prev: GscData | null;
  context: SnapshotContext;
  generated_at: string;
}

// ============================================
// UI shapes (dashboard components)
// ============================================

export type DeltaDirection = "up" | "down" | "flat";

export interface KpiCardData {
  label: string;
  value: string; // formatado
  rawValue: number;
  delta?: {
    direction: DeltaDirection;
    text: string;
    pct: number;
  };
  sparkline?: number[]; // valores ao longo dos últimos N meses
  description?: string;
  goal?: {
    /** "de 421 (76%)" */
    label: string;
    pct: number;
    color: string;
    /** "meta = média 3m × 1.30" */
    formula?: string;
    basedOnMonths?: number;
  };
}

export interface TrendPoint {
  monthSlug: string;
  monthLabel: string;
  users: number;
  sessions: number;
  pageviews: number;
  clicks: number;
  impressions: number;
  /** Mês ainda aberto: o ponto cobre menos dias que os anteriores. */
  partial?: boolean;
}

export interface TopQueryWithTrend extends GscQuery {
  trend?: number[]; // clicks nos últimos N meses
}
