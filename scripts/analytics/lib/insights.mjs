// Geração de insights e ações priorizadas a partir dos dados crus

/**
 * Uma URL só conta como indexada se o coverageState do GSC disser "indexed"
 * SEM ser "not indexed". O teste ingênuo (`state.includes('indexed')`) casa
 * com "Crawled - currently not indexed" e "Discovered - currently not indexed".
 *
 * Isso tinha dois efeitos opostos e igualmente errados: inflava o indexedCount
 * do resumo (Julho/2026 dizia 38/38 quando o real era 34/38) e, na negação,
 * fazia buildActions NÃO gerar P0 para justamente essas páginas — por isso
 * relatórios com artigo não indexado saíam com "nenhuma ação P0 identificada".
 */
export function isIndexedState(coverageState) {
  const state = (coverageState || '').toLowerCase();
  return state.includes('indexed') && !state.includes('not indexed');
}

export function buildInsights({ ga4, gsc, ga4Prev, gscPrev, indexation, posts }) {
  const insights = [];

  // GSC: queries com alta impressão e CTR baixo (oportunidade)
  const lowCtrOpportunities = gsc.topQueries
    .filter((q) => q.impressions >= 200 && q.ctr < 2 && q.position > 5)
    .slice(0, 3);
  lowCtrOpportunities.forEach((q) => {
    insights.push({
      text: `Query "${q.query}" tem ${q.impressions} impressões mas só ${q.ctr}% de CTR (posição ${q.position}). Oportunidade de otimizar meta title/description ou subir posição.`,
    });
  });

  // Página em posição 11-20 (página 2 do Google)
  const page2Pages = gsc.topPages.filter((p) => p.position >= 11 && p.position <= 20 && p.impressions >= 100);
  if (page2Pages.length > 0) {
    const p = page2Pages[0];
    insights.push({
      text: `${page2Pages.length} página(s) na 2ª página do Google. Destaque: ${p.title || p.slug} (posição ${p.position}, ${p.impressions} impressões). Subir 5 posições pode triplicar cliques.`,
    });
  }

  // GA4 vs GSC: top page com tempo médio baixo
  const lowEngagement = ga4.topPages.filter((p) => p.users >= 30 && p.avgEngagementTime < 30);
  if (lowEngagement.length > 0) {
    const p = lowEngagement[0];
    insights.push({
      text: `Página ${p.title || p.slug} recebe ${p.users} users mas tempo médio é só ${p.avgEngagementTime}s. Investigar bounce ou problema de conteúdo.`,
    });
  }

  // Fonte de tráfego dominante
  if (ga4.topSources.length > 0 && ga4.topSources[0].pctOfTotal >= 60) {
    insights.push({
      text: `${ga4.topSources[0].pctOfTotal}% do tráfego vem de "${ga4.topSources[0].label}". Diversificar fontes reduz risco.`,
    });
  }

  // Adicionar índice
  return insights.slice(0, 5).map((i, idx) => ({ ...i, position: idx + 1 }));
}

export function buildActions({ ga4, gsc, indexation, posts }) {
  const p0 = [];
  const p1 = [];
  const p2 = [];

  // P0: artigos não indexados (case-insensitive)
  if (indexation && indexation.length > 0) {
    const notIndexed = indexation.filter((i) => i.coverageState && !isIndexedState(i.coverageState));
    notIndexed.slice(0, 3).forEach((i) => {
      p0.push({
        text: `Solicitar indexação manual no GSC para "/atualidades/${i.slug}" (status: ${i.coverageState}).`,
      });
    });
  }

  // P0: queda forte em métrica chave
  // (será populado pelo orquestrador com dados de comparação MoM)

  // P1: queries position 11-20 com bom volume
  const page2 = gsc.topPages.filter((p) => p.position >= 11 && p.position <= 20 && p.impressions >= 100).slice(0, 3);
  page2.forEach((p) => {
    p1.push({
      text: `Otimizar "${p.title || p.slug}" (posição ${p.position}, ${p.impressions} impressões) — meta title/description + internal links.`,
    });
  });

  // P1: queries com CTR <2% e impressões altas
  const lowCtr = gsc.topQueries.filter((q) => q.impressions >= 200 && q.ctr < 2).slice(0, 2);
  lowCtr.forEach((q) => {
    p1.push({
      text: `Revisar SERP snippet para query "${q.query}" (CTR ${q.ctr}%, ${q.impressions} impressões).`,
    });
  });

  // P2: melhorias incrementais
  const lowEngagementPages = ga4.topPages.filter((p) => p.users >= 20 && p.avgEngagementTime < 30).slice(0, 2);
  lowEngagementPages.forEach((p) => {
    p2.push({
      text: `Analisar bounce de "${p.title || p.slug}" (tempo médio ${p.avgEngagementTime}s, ${p.users} users).`,
    });
  });

  // P2: se mobile >70%, garantir mobile-first
  const mobile = ga4.byDevice.find((d) => d.device === 'mobile');
  if (mobile && mobile.pctOfTotal >= 70) {
    p2.push({
      text: `Mobile representa ${mobile.pctOfTotal}% dos users — auditar Core Web Vitals mobile com PageSpeed Insights.`,
    });
  }

  return { actionsP0: p0, actionsP1: p1, actionsP2: p2 };
}

export function buildSummary({ ga4, gsc, ga4Prev, gscPrev, indexation }) {
  const summary = [];

  const usersMoM = ga4Prev?.users ? ((ga4.users - ga4Prev.users) / ga4Prev.users) * 100 : null;
  const clicksMoM = gscPrev?.clicks ? ((gsc.clicks - gscPrev.clicks) / gscPrev.clicks) * 100 : null;

  if (ga4.users > 0) {
    summary.push({
      text: `${ga4.users} usuários e ${ga4.pageviews} pageviews no GA4${usersMoM !== null ? ` (${usersMoM >= 0 ? '+' : ''}${usersMoM.toFixed(0)}% MoM)` : ''}.`,
    });
  }

  if (gsc.clicks > 0) {
    summary.push({
      text: `${gsc.clicks} cliques e ${gsc.impressions} impressões no Google Search${clicksMoM !== null ? ` (${clicksMoM >= 0 ? '+' : ''}${clicksMoM.toFixed(0)}% MoM)` : ''}, posição média ${gsc.position}.`,
    });
  }

  if (indexation && indexation.length > 0) {
    const indexed = indexation.filter((i) => isIndexedState(i.coverageState)).length;
    summary.push({
      text: `${indexed} de ${indexation.length} artigos indexados no Google.`,
    });
  }

  const topPage = ga4.topPages[0];
  if (topPage) {
    summary.push({
      text: `Página mais acessada: ${topPage.title || topPage.slug} (${topPage.pageviews} pageviews).`,
    });
  }

  return summary;
}
