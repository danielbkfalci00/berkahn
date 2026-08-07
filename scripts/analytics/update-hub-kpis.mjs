// Atualiza KPIs nos hubs blog.md e seo-aeo.md a partir do context do report
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Health Score: replica da fórmula em lib/analytics/health-score.ts (mantém em sincronia)
// Pesos editáveis aqui — alinhar com lib/analytics/health-score.ts
const HEALTH_WEIGHTS = { indexation: 0.3, usersGrowth: 0.3, clicksGrowth: 0.2, engagementRate: 0.2 };

function clampScore(n) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function momToScore(pct) {
  if (pct === undefined || pct === null || Number.isNaN(pct)) return 50;
  return clampScore(50 + 40 * Math.tanh(pct / 40));
}

function computeHealthScore(context) {
  const indexed = context.indexedCount ?? 0;
  const total = context.totalArticles ?? 0;
  const indexationScore = total > 0 ? clampScore((indexed / total) * 100) : 0;
  const usersScore = momToScore(context.ga4?.usersMoMPct);
  const clicksScore = momToScore(context.gsc?.clicksMoMPct);
  const engagementScore = clampScore(context.ga4?.engagementRate ?? 50);
  return clampScore(
    indexationScore * HEALTH_WEIGHTS.indexation +
      usersScore * HEALTH_WEIGHTS.usersGrowth +
      clicksScore * HEALTH_WEIGHTS.clicksGrowth +
      engagementScore * HEALTH_WEIGHTS.engagementRate
  );
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const VAULT_ROOT = path.resolve(__dirname, '../..', 'Berkahn-Vault');

const BLOG_HUB = path.join(VAULT_ROOT, '00-meta/projetos/blog.md');
const SEO_HUB = path.join(VAULT_ROOT, '00-meta/projetos/seo-aeo.md');

// Atualiza ou insere um campo de frontmatter. Mantém ordem se já existir.
function upsertFrontmatterField(content, key, value) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return content;
  const fm = frontmatterMatch[1];
  const lineRegex = new RegExp(`^${key}:.*$`, 'm');
  let newFm;
  if (lineRegex.test(fm)) {
    newFm = fm.replace(lineRegex, `${key}: ${value}`);
  } else {
    // Inserir antes de kpi_atualizado_em se existir, senão antes de contextos_aplicados, senão antes do --- final
    const insertBefore = fm.match(/^(kpi_atualizado_em|contextos_aplicados):/m);
    if (insertBefore) {
      newFm = fm.replace(new RegExp(`^(${insertBefore[1]}:)`, 'm'), `${key}: ${value}\n$1`);
    } else {
      newFm = `${fm}\n${key}: ${value}`;
    }
  }
  return content.replace(frontmatterMatch[0], `---\n${newFm}\n---`);
}

export async function updateHubKpis(context, { allowPartial = false } = {}) {
  // Um relatório parcial cobre um PREFIXO do mês, então todo KPI seu é
  // estritamente menor que o do fechamento. Gravar isso nos hubs faria
  // /standup e /wrap-up — que leem os hubs como source of truth — narrarem
  // uma queda que não aconteceu. O run do dia 1 sobrescreve com o mês cheio.
  if (context.partial && !allowPartial) {
    return { skipped: true, reason: 'partial' };
  }

  const today = context.generatedDate;

  // blog.md: KPIs de GA4/GSC do mês + atualizado_em
  if (fs.existsSync(BLOG_HUB)) {
    let blog = fs.readFileSync(BLOG_HUB, 'utf-8');
    blog = upsertFrontmatterField(blog, 'kpi_ga4_users_mes', context.ga4.users);
    blog = upsertFrontmatterField(blog, 'kpi_ga4_sessions_mes', context.ga4.sessions);
    blog = upsertFrontmatterField(blog, 'kpi_ga4_pageviews_mes', context.ga4.pageviews);
    blog = upsertFrontmatterField(blog, 'kpi_gsc_clicks_mes', context.gsc.clicks);
    blog = upsertFrontmatterField(blog, 'kpi_gsc_impressions_mes', context.gsc.impressions);
    blog = upsertFrontmatterField(blog, 'kpi_indexados_google', context.indexedCount);
    blog = upsertFrontmatterField(blog, 'kpi_health_score_mes', computeHealthScore(context));
    blog = upsertFrontmatterField(blog, 'kpi_atualizado_em', today);
    // atualizado: do header (não só do KPI)
    blog = blog.replace(/^atualizado: \d{4}-\d{2}-\d{2}/m, `atualizado: ${today}`);
    fs.writeFileSync(BLOG_HUB, blog);
  }

  // seo-aeo.md: KPIs de score + indexação + tráfego
  if (fs.existsSync(SEO_HUB)) {
    let seo = fs.readFileSync(SEO_HUB, 'utf-8');
    seo = upsertFrontmatterField(seo, 'kpi_paginas_indexadas', context.indexedCount);
    seo = upsertFrontmatterField(seo, 'kpi_trafego_cliques_30d', context.gsc.clicks);
    seo = upsertFrontmatterField(seo, 'kpi_trafego_impressoes_30d', context.gsc.impressions);
    seo = upsertFrontmatterField(seo, 'kpi_ctr_medio', context.gsc.ctr);
    seo = upsertFrontmatterField(seo, 'kpi_posicao_media', context.gsc.position);
    seo = upsertFrontmatterField(seo, 'kpi_atualizado_em', today);
    seo = seo.replace(/^atualizado: \d{4}-\d{2}-\d{2}/m, `atualizado: ${today}`);
    fs.writeFileSync(SEO_HUB, seo);
  }

  return { skipped: false };
}
