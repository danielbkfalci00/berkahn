// Backfill da cauda longa nos snapshots historicos.
//
// De fevereiro a agosto de 2026 o pipeline armazenou 20 queries de uma
// distribuicao de ~1.126, 15 paginas do GSC e 50 do GA4. Os limites foram
// corrigidos, mas snapshot ja gravado nao se corrige sozinho. Este script
// reescreve APENAS as listas, para o historico ficar comparavel com o que o
// pipeline passa a coletar.
//
// Uso:
//   node --env-file=.env.local scripts/analytics/backfill-cauda.mjs --dry-run
//   node --env-file=.env.local scripts/analytics/backfill-cauda.mjs --month 2026-06
//   node --env-file=.env.local scripts/analytics/backfill-cauda.mjs --aplicar
//
// ---------------------------------------------------------------------------
// POR QUE NAO `generate-report.mjs --month`
// ---------------------------------------------------------------------------
// Um run ao vivo chama fetchGsc(..., urlsToInspect), e a URL Inspection API NAO
// tem modo historico: devolve o status de indexacao de HOJE. Rodar
// `--month 2026-02` gravaria a indexacao de agosto dentro do snapshot de
// fevereiro, e dali ela flui para insights, actions, summary e indexedCount
// dentro de `context`. O upsertSnapshot faz merge-duplicates e sobrescreve sem
// avisar.
//
// Isso desfaria a decisao registrada em analytics-methodology.md de NAO
// regenerar os relatorios de fev a jun por causa do +1 de indexacao.
//
// Este script so toca:
//   gsc_data.topQueries, gsc_data.topPages, ga4_data.topPages, ga4_data.topSources
// e preserva indexation, risingQueries, fallingQueries, context e todos os
// totais, que continuam vindo das chamadas `overall` originais.
import { fetchGsc } from './fetch-gsc.mjs';
import { fetchGa4 } from './fetch-ga4.mjs';
import { serviceRequest } from './lib/supabase-snapshot.mjs';
import { monthBounds, parseMonthArg } from './lib/period.mjs';

const args = process.argv.slice(2);
const valorDe = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : null;
};
const dryRun = args.includes('--dry-run');
const aplicar = args.includes('--aplicar');
const mesArg = valorDe('--month');

if (!dryRun && !aplicar) {
  console.error('Recusando gravar sem intencao explicita.');
  console.error('  --dry-run  mostra o que mudaria');
  console.error('  --aplicar  grava de verdade');
  process.exit(2);
}

// Chaves que este script reescreve. Tudo fora desta lista fica intocado.
const CHAVES_GSC = ['topQueries', 'topPages'];
const CHAVES_GA4 = ['topPages', 'topSources'];

async function listarSnapshots() {
  const linhas = await serviceRequest(
    'GET',
    '/rest/v1/analytics_snapshots?select=month,ga4_data,gsc_data&order=month.asc'
  );
  return linhas || [];
}

function slugDoMes(month) {
  return String(month).slice(0, 7);
}

async function backfillMes(linha) {
  const slug = slugDoMes(linha.month);
  const { year, month } = parseMonthArg(slug);
  const bounds = monthBounds(year, month);

  const [gsc, ga4] = await Promise.all([
    // Sem previousPeriod e sem urlsToInspect: nao queremos deltas nem
    // indexacao. Deltas seguem os do snapshot original; indexacao e o que
    // este script existe para NAO tocar.
    fetchGsc(bounds.startDate, bounds.endDate),
    fetchGa4(bounds.startDate, bounds.endDate),
  ]);

  const antes = {
    gscQueries: (linha.gsc_data?.topQueries ?? []).length,
    gscPages: (linha.gsc_data?.topPages ?? []).length,
    ga4Pages: (linha.ga4_data?.topPages ?? []).length,
    ga4Sources: (linha.ga4_data?.topSources ?? []).length,
  };
  const depois = {
    gscQueries: gsc.topQueries.length,
    gscPages: gsc.topPages.length,
    ga4Pages: ga4.topPages.length,
    ga4Sources: ga4.topSources.length,
  };

  // Sanidade: os totais tem que continuar batendo. Se a chamada `overall`
  // devolver numero diferente do que esta gravado, alguma coisa mudou no
  // periodo (reprocessamento do Google) e sobrescrever as listas produziria um
  // snapshot internamente inconsistente.
  const totalGravado = linha.gsc_data?.clicks;
  const divergencia =
    Number.isFinite(totalGravado) && Math.abs(totalGravado - gsc.clicks) > 0;

  // Backfill so ADICIONA cauda. Se a lista nova for menor que a gravada, o
  // efeito liquido e apagar historico — exatamente o contrario do objetivo.
  //
  // Acontece de verdade nos meses iniciais: em fev e mar de 2026 o site tinha
  // tao pouco trafego que quase toda query ficava em 1 ou 2 impressoes, abaixo
  // do MIN_IMPRESSOES_ARMAZENADAS que hoje filtra ruido. O piso e correto para
  // o volume atual e destrutivo para aquele.
  const encolheria =
    depois.gscQueries < antes.gscQueries ||
    depois.gscPages < antes.gscPages ||
    depois.ga4Pages < antes.ga4Pages ||
    depois.ga4Sources < antes.ga4Sources;

  // Merge raso por chave: preserva tudo que nao esta em CHAVES_*.
  const gscNovo = { ...linha.gsc_data };
  for (const k of CHAVES_GSC) gscNovo[k] = gsc[k];
  const ga4Novo = { ...linha.ga4_data };
  for (const k of CHAVES_GA4) ga4Novo[k] = ga4[k];

  return { slug, antes, depois, divergencia, encolheria, totalGravado, totalNovo: gsc.clicks, gscNovo, ga4Novo };
}

const linhas = await listarSnapshots();
const alvo = mesArg ? linhas.filter((l) => slugDoMes(l.month) === mesArg) : linhas;

if (alvo.length === 0) {
  console.error(mesArg ? `Nenhum snapshot para ${mesArg}.` : 'Nenhum snapshot no banco.');
  process.exit(1);
}

console.log(`${alvo.length} snapshot(s) alvo${dryRun ? ' — DRY RUN, nada sera gravado' : ''}\n`);

let gravados = 0;
let puladosDivergencia = 0;
let puladosEncolhimento = 0;

for (const linha of alvo) {
  const r = await backfillMes(linha);
  const d = (a, b) => `${a} -> ${b}${b > a ? ` (+${b - a})` : ''}`;
  console.log(
    `${r.slug}  queries ${d(r.antes.gscQueries, r.depois.gscQueries)}` +
    ` | gsc pages ${d(r.antes.gscPages, r.depois.gscPages)}` +
    ` | ga4 pages ${d(r.antes.ga4Pages, r.depois.ga4Pages)}` +
    ` | fontes ${d(r.antes.ga4Sources, r.depois.ga4Sources)}`
  );

  if (r.divergencia) {
    console.warn(
      `   ⚠️  PULADO: total de cliques do periodo mudou (${r.totalGravado} gravado vs ${r.totalNovo} agora).` +
      ` O Google reprocessou o periodo. Sobrescrever as listas deixaria o snapshot inconsistente com os proprios totais.`
    );
    puladosDivergencia++;
    continue;
  }

  if (r.encolheria) {
    console.warn(
      `   ⚠️  PULADO: a coleta nova e MENOR que a gravada. Backfill so adiciona cauda;` +
      ` gravar aqui apagaria historico. Mes de trafego baixo, abaixo do piso de impressoes.`
    );
    puladosEncolhimento++;
    continue;
  }

  if (dryRun) continue;

  await serviceRequest(
    'PATCH',
    `/rest/v1/analytics_snapshots?month=eq.${r.slug}-01`,
    { gsc_data: r.gscNovo, ga4_data: r.ga4Novo },
    { Prefer: 'return=minimal' }
  );
  gravados++;
}

const motivos = [
  puladosDivergencia ? `${puladosDivergencia} por reprocessamento do Google` : null,
  puladosEncolhimento ? `${puladosEncolhimento} porque encolheria o historico` : null,
].filter(Boolean);
console.log(
  `\n${dryRun ? 'dry run concluido' : `${gravados} snapshot(s) atualizado(s)`}` +
  (motivos.length ? `, pulados: ${motivos.join(' e ')}` : '')
);
console.log('indexation, risingQueries, fallingQueries e context NAO foram tocados.');
