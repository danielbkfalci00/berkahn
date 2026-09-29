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

export function isKnownInspection(item) {
  return !item.error && item.verdict !== 'ERROR' && item.verdict !== 'UNKNOWN' &&
    Boolean(item.coverageState && item.coverageState.toLowerCase() !== 'unknown');
}

export function buildInsights({ ga4, gsc, ga4Prev, gscPrev, indexation, posts }) {
  const insights = [];

  // GSC: queries com alta impressão e CTR baixo (oportunidade)
  const lowCtrOpportunities = gsc.topQueries
    .filter((q) => q.impressions >= 200 && q.ctr < 2 && q.position > 5)
    .slice(0, 3);
  lowCtrOpportunities.forEach((q) => {
    insights.push({
      text: `Revisar a intenção e o snippet exibido para "${q.query}" antes de alterar o artigo. CTR isolado não identifica a causa.`,
      evidence: `${q.impressions} impressões, ${q.clicks} cliques, CTR ${q.ctr}%, posição média ${q.position}.`,
      confidence: 'moderate', impact: q.impressions * 0.02,
    });
  });

  // Página em posição 11-20 (página 2 do Google)
  const page2Pages = gsc.topPages.filter((p) => p.position >= 11 && p.position <= 20 && p.impressions >= 100);
  if (page2Pages.length > 0) {
    const p = page2Pages[0];
    insights.push({
      text: `Verificar as consultas e páginas concorrentes de "${p.title || p.slug}" para decidir se há conteúdo a atualizar. A posição média não prevê ganho de cliques.`,
      evidence: `${page2Pages.length} páginas com posição média entre 11 e 20; esta página soma ${p.impressions} impressões e ${p.clicks} cliques.`,
      confidence: 'moderate', impact: p.impressions * 0.01,
    });
  }

  // GA4 vs GSC: top page com tempo médio baixo
  const lowEngagement = ga4.topPages.filter((p) => p.users >= 30 && p.avgEngagementTime < 30);
  if (lowEngagement.length > 0) {
    const p = lowEngagement[0];
    insights.push({
      text: `Conferir se "${p.title || p.slug}" resolve uma leitura curta ou apresenta abandono antes de propor uma reescrita.`,
      evidence: `${p.users} usuários e ${p.avgEngagementTime}s de engajamento médio no período.`,
      confidence: 'moderate', impact: p.users,
    });
  }

  // Prioriza volume observável; concentração de tráfego sozinha não pede ação.
  return insights.sort((a, b) => b.impact - a.impact).slice(0, 5).map((i, idx) => ({ ...i, position: idx + 1 }));
}

export function buildActions({ ga4, gsc, indexation, posts }) {
  const p0 = [];
  const p1 = [];
  const p2 = [];

  // P0: artigos não indexados (case-insensitive)
  if (indexation && indexation.length > 0) {
    const notIndexed = indexation.filter((i) => isKnownInspection(i) && !isIndexedState(i.coverageState));
    notIndexed.slice(0, 3).forEach((i) => {
      p0.push({
        text: `Verificar o motivo da exclusão de "/atualidades/${i.slug}" no GSC (${i.coverageState}); solicitar indexação apenas se a URL estiver elegível.`,
      });
    });
  }

  // P0: queda forte em métrica chave
  // (será populado pelo orquestrador com dados de comparação MoM)

  // P1: queries position 11-20 com bom volume
  const page2 = gsc.topPages.filter((p) => p.position >= 11 && p.position <= 20 && p.impressions >= 100).slice(0, 3);
  page2.forEach((p) => {
    p1.push({
      text: `Revisar intenção, snippet e links de "${p.title || p.slug}" (posição média ${p.position}, ${p.impressions} impressões) antes de escolher uma alteração.`,
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
    const inspected = indexation.filter(isKnownInspection);
    const indexed = inspected.filter((i) => isIndexedState(i.coverageState)).length;
    summary.push({
      text: `${indexed} de ${inspected.length} artigos com inspeção válida estão indexados no Google.${inspected.length < indexation.length ? ` ${indexation.length - inspected.length} inspeções indisponíveis.` : ''}`,
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
