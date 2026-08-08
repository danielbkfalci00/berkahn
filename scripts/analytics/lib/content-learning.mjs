import { randomUUID } from 'node:crypto';
import { serviceRequest } from './supabase-snapshot.mjs';

const MIN_ENGAGED_SESSIONS = 30;

export function countWords(markdown = '') {
  const plain = markdown
    .replace(/<[^>]+>/g, ' ')
    .replace(/[^A-Za-z0-9\u00C0-\u024F]+/g, ' ')
    .trim();
  return plain ? plain.split(/\s+/).length : 0;
}

export function countHeadings(markdown = '') {
  return (markdown.match(/^#{1,6}\s+.+$/gm) || []).length;
}


export function progressBySlug(articleProgress) {
  const result = new Map();
  for (const row of articleProgress?.rows || []) {
    if (!row.slug || ![25, 50, 75, 90].includes(row.percent)) continue;
    const current = result.get(row.slug) || { 25: 0, 50: 0, 75: 0, 90: 0 };
    current[row.percent] += row.count;
    result.set(row.slug, current);
  }
  return result;
}

function dateOnly(date) {
  return date.toISOString().slice(0, 10);
}

function articlePageMap(ga4) {
  return new Map(
    (ga4?.topPages || [])
      .filter((page) => page.slug)
      .map((page) => [page.slug, page])
  );
}

function searchPageMap(gsc) {
  return new Map(
    (gsc?.topPages || [])
      .filter((page) => page.slug)
      .map((page) => [page.slug, page])
  );
}

async function loadContentRows(startDate, endDate) {
  const pautas = await serviceRequest(
    'GET',
    '/rest/v1/conteudo_pautas?select=id,post_id&post_id=not.is.null',
    null
  );
  if (!pautas.length) return [];

  const ids = pautas.map((pauta) => pauta.post_id).filter(Boolean);
  const encodedIds = encodeURIComponent(`(${ids.join(',')})`);
  const [posts, leads] = await Promise.all([
    serviceRequest(
      'GET',
      `/rest/v1/posts?select=id,slug,content,read_time,status&id=in.${encodedIds}`,
      null
    ),
    serviceRequest(
      'GET',
      `/rest/v1/leads?select=pauta_id,slug_origem,status,criado_em&status=in.(qualificado,convertido)&criado_em=gte.${encodeURIComponent(startDate)}&criado_em=lte.${encodeURIComponent(`${endDate}T23:59:59Z`)}`,
      null
    ),
  ]);

  const postById = new Map(posts.map((post) => [post.id, post]));
  const leadsByPauta = new Map();
  const leadsBySlug = new Map();
  for (const lead of leads) {
    if (lead.pauta_id) {
      leadsByPauta.set(lead.pauta_id, (leadsByPauta.get(lead.pauta_id) || 0) + 1);
    } else if (lead.slug_origem) {
      leadsBySlug.set(lead.slug_origem, (leadsBySlug.get(lead.slug_origem) || 0) + 1);
    }
  }

  return pautas
    .map((pauta) => {
      const post = postById.get(pauta.post_id);
      if (!post) return null;
      return {
        pauta,
        post,
        qualifiedLeads: (leadsByPauta.get(pauta.id) || 0) + (leadsBySlug.get(post.slug) || 0),
      };
    })
    .filter(Boolean);
}

export function recommendationFor(snapshot) {
  if (!snapshot.amostra_suficiente) return null;

  if (snapshot.leads_por_100_engajadas >= 2) {
    return {
      kind: 'padrao-forte',
      title: `Documentar padrao do artigo ${snapshot.slug}`,
      description: 'O artigo superou 2 leads qualificados por 100 sessoes engajadas. Revisar angulo, estrutura e CTA antes de reutilizar o padrao.',
      priority: 'p1',
    };
  }

  if (
    snapshot.leads_qualificados === 0 &&
    snapshot.tempo_medio_engajamento >= 60
  ) {
    return {
      kind: 'cta',
      title: `Revisar CTA do artigo ${snapshot.slug}`,
      description: 'Ha atencao suficiente, mas nenhum lead qualificado na janela. Verificar aderencia entre intencao, oferta e CTA.',
      priority: 'p1',
    };
  }

  if (
    snapshot.retentionPct !== null &&
    snapshot.retentionPct < 35
  ) {
    return {
      kind: 'retencao',
      title: `Revisar abertura e estrutura de ${snapshot.slug}`,
      description: 'A retencao estimada ficou abaixo de 35%. Investigar a promessa inicial e a escaneabilidade; a recomendacao nao altera o artigo automaticamente.',
      priority: 'p2',
    };
  }

  return null;
}

async function enqueueRecommendations(candidates, dryRun) {
  if (!candidates.length || dryRun) return candidates;

  const signals = candidates.map((item) => item.origin_signal);
  const filter = encodeURIComponent(`(${signals.map((signal) => `"${signal}"`).join(',')})`);
  const existing = await serviceRequest(
    'GET',
    `/rest/v1/analytics_tasks?select=origin_signal&status=eq.open&origin_signal=in.${filter}`,
    null
  );
  const existingSignals = new Set(existing.map((item) => item.origin_signal));
  const missing = candidates.filter((item) => !existingSignals.has(item.origin_signal));
  if (!missing.length) return [];

  await serviceRequest('POST', '/rest/v1/analytics_tasks', missing, {
    Prefer: 'return=minimal',
  });
  return missing;
}

export async function syncContentLearning({
  ga4,
  gsc,
  endDate = dateOnly(new Date()),
  startDate,
  dryRun = false,
} = {}) {
  const resolvedStart = startDate || dateOnly(new Date(new Date(endDate).getTime() - 27 * 86400000));
  const contentRows = await loadContentRows(resolvedStart, endDate);
  const pages = articlePageMap(ga4);
  const search = searchPageMap(gsc);
  const progress = progressBySlug(ga4?.articleProgress);
  const runId = randomUUID();

  const snapshots = contentRows.map(({ pauta, post, qualifiedLeads }) => {
    const page = pages.get(post.slug) || {};
    const searchPage = search.get(post.slug) || {};
    const depth = progress.get(post.slug) || { 25: 0, 50: 0, 75: 0, 90: 0 };
    const engaged = page.engagedSessions || 0;
    const readTimeSeconds = post.read_time ? post.read_time * 60 : null;
    const avgEngagement = page.avgEngagementTime || 0;
    const retentionPct = readTimeSeconds
      ? Math.min(100, Number(((avgEngagement / readTimeSeconds) * 100).toFixed(1)))
      : null;

    return {
      pauta_id: pauta.id,
      post_id: post.id,
      janela_inicio: resolvedStart,
      janela_fim: endDate,
      sessoes: page.sessions || 0,
      sessoes_engajadas: engaged,
      tempo_medio_engajamento: avgEngagement,
      profundidade_25: depth[25],
      profundidade_50: depth[50],
      profundidade_75: depth[75],
      profundidade_90: depth[90],
      leads_qualificados: qualifiedLeads,
      leads_por_100_engajadas: engaged > 0
        ? Number(((qualifiedLeads / engaged) * 100).toFixed(3))
        : null,
      palavras: countWords(post.content),
      headings: countHeadings(post.content),
      amostra_suficiente: engaged >= MIN_ENGAGED_SESSIONS,
      evidencias: {
        slug: post.slug,
        pageviews: page.pageviews || 0,
        search_clicks: searchPage.clicks || 0,
        search_impressions: searchPage.impressions || 0,
        search_ctr: searchPage.ctr || 0,
        retention_estimate_pct: retentionPct,
        article_progress_available: ga4?.articleProgress?.available === true,
      },
      run_id: runId,
      slug: post.slug,
      retentionPct,
    };
  });

  const dbSnapshots = snapshots.map(({ slug, retentionPct, ...snapshot }) => snapshot);
  if (!dryRun && dbSnapshots.length) {
    await serviceRequest(
      'POST',
      '/rest/v1/conteudo_performance_snapshots?on_conflict=pauta_id,janela_inicio,janela_fim',
      dbSnapshots,
      { Prefer: 'resolution=merge-duplicates,return=minimal' }
    );
  }

  const candidates = snapshots.flatMap((snapshot) => {
    const recommendation = recommendationFor(snapshot);
    if (!recommendation) return [];
    return [{
      title: recommendation.title,
      description: recommendation.description,
      priority: recommendation.priority,
      source: 'system',
      status: 'open',
      origin_signal: `content-learning:${snapshot.pauta_id}:${recommendation.kind}`,
      pauta_id: snapshot.pauta_id,
      approval_status: 'pendente',
      evidence: {
        janela_inicio: snapshot.janela_inicio,
        janela_fim: snapshot.janela_fim,
        sessoes_engajadas: snapshot.sessoes_engajadas,
        leads_qualificados: snapshot.leads_qualificados,
        leads_por_100_engajadas: snapshot.leads_por_100_engajadas,
        retention_estimate_pct: snapshot.retentionPct,
        run_id: runId,
      },
    }];
  });
  const enqueued = await enqueueRecommendations(candidates, dryRun);

  return {
    runId,
    startDate: resolvedStart,
    endDate,
    snapshots: snapshots.length,
    sufficientSamples: snapshots.filter((item) => item.amostra_suficiente).length,
    recommendations: enqueued.length,
    dryRun,
  };
}
