// Renderiza HTML branded a partir do MD usando markdown-it + template Mustache
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import MarkdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';
import Mustache from 'mustache';
// Não escapar Mustache no HTML porque o bodyHtml já é HTML válido do markdown-it
Mustache.escape = (text) => String(text);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const md = new MarkdownIt({ html: true, linkify: true, typographer: false });
md.use(markdownItAttrs);

// Strip frontmatter YAML (entre --- ---)
function stripFrontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return content;
  return content.slice(m[0].length);
}

// Pós-processa HTML para aplicar classes nas tabelas e adicionar KPI cards
function postProcessHtml(html, context) {
  // KPI grid hero (depois do título)
  const kpiCards = renderKpiCards(context);
  html = html.replace(/<h1>([^<]+)<\/h1>/, `<h1>$1</h1>${kpiCards}`);

  // Wrap sections "Ações priorizadas" em containers com classe
  html = html.replace(/<h3>P0, urgente<\/h3>\s*<ul>([\s\S]*?)<\/ul>/, '<h3>P0, urgente</h3><ul class="actions-list actions-p0">$1</ul>');
  html = html.replace(/<h3>P1, esta semana<\/h3>\s*<ul>([\s\S]*?)<\/ul>/, '<h3>P1, esta semana</h3><ul class="actions-list actions-p1">$1</ul>');
  html = html.replace(/<h3>P2, backlog<\/h3>\s*<ul>([\s\S]*?)<\/ul>/, '<h3>P2, backlog</h3><ul class="actions-list actions-p2">$1</ul>');

  // Insights list
  html = html.replace(/<h2>Insights<\/h2>\s*<ol>/, '<h2>Insights</h2><ol class="insights-list">');

  // Callout de relatório parcial: markdown-it não conhece [!warning], então
  // vira blockquote genérico. Aqui ele recebe a classe e perde o marcador.
  html = html.replace(
    /<blockquote>\s*<p>\[!warning\][ \t]*([^\n<]*)/,
    '<blockquote class="partial-banner"><p><span class="partial-banner-title">$1</span><br>'
  );

  // Status pills na tabela de indexação
  html = html.replace(/✅ Indexada/g, '<span class="status-pill status-indexed">Indexada</span>');
  html = html.replace(/❌ Não indexada/g, '<span class="status-pill status-not-indexed">Não indexada</span>');
  html = html.replace(/⚠️ Crawled/g, '<span class="status-pill status-pending">Crawled</span>');

  // Âncoras nos h2. Por último de propósito: as substituições acima casam
  // `<h2>Insights</h2>` literal e deixariam de casar depois do id.
  html = injetarAncoras(html);

  return html;
}

// Espelha scripts/documentacoes/build-doc.mjs. Os dois geradores são separados
// e não compartilham módulo; manter o mesmo slugify é o que faz um id gerado
// aqui ser igual ao gerado lá para o mesmo título.
function slugify(texto) {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/**
 * Dá id aos <h2>, que antes não tinham nenhum.
 *
 * Serve a duas coisas: o CSS `h2[id] { scroll-margin-top }` do template já
 * existia esperando por isto, e a ancoragem dos comentários inline usa o h2
 * mais próximo como desempate quando o mesmo trecho aparece várias vezes no
 * documento — o que é comum nas tabelas destes relatórios.
 */
function injetarAncoras(html) {
  const usados = new Set();
  let n = 0;

  return html.replace(/<h2>([\s\S]*?)<\/h2>/g, (_full, interno) => {
    n += 1;
    const texto = interno.replace(/<[^>]+>/g, '').trim();
    const base = slugify(texto) || `secao-${n}`;
    let id = base;
    let sufixo = 2;
    while (usados.has(id)) id = `${base}-${sufixo++}`;
    usados.add(id);
    return `<h2 id="${id}">${interno}</h2>`;
  });
}

function renderKpiCards(context) {
  const cards = [
    { label: 'Users (GA4)', value: context.ga4.users.toLocaleString('pt-BR'), delta: context.ga4.usersMoMText },
    { label: 'Sessions', value: context.ga4.sessions.toLocaleString('pt-BR'), delta: context.ga4.sessionsMoMText },
    { label: 'Clicks (GSC)', value: context.gsc.clicks.toLocaleString('pt-BR'), delta: context.gsc.clicksMoMText },
    { label: 'Impressions', value: context.gsc.impressions.toLocaleString('pt-BR'), delta: context.gsc.impressionsMoMText },
    { label: 'CTR médio', value: `${context.gsc.ctr}%`, delta: context.gsc.ctrMoMText },
    { label: 'Indexados', value: `${context.indexedCount} / ${context.totalArticles}`, delta: '' },
  ];

  const cardsHtml = cards.map((c) => {
    let deltaClass = 'delta-flat';
    if (c.delta?.startsWith('↑')) deltaClass = 'delta-up';
    else if (c.delta?.startsWith('↓')) deltaClass = 'delta-down';
    const deltaSpan = c.delta && c.delta !== '—' && c.delta !== ''
      ? `<span class="kpi-card-delta ${deltaClass}">${c.delta}</span>` : '';
    return `<div class="kpi-card"><div class="kpi-card-label">${c.label}</div><div class="kpi-card-value">${c.value}</div>${deltaSpan}</div>`;
  }).join('');

  return `<div class="kpi-grid">${cardsHtml}</div>`;
}

export async function renderHtml(mdContent, context, outputPath) {
  const templatePath = path.join(__dirname, 'templates', 'report.html');
  const htmlTemplate = fs.readFileSync(templatePath, 'utf-8');

  const stripped = stripFrontmatter(mdContent);
  let bodyHtml = md.render(stripped);
  bodyHtml = postProcessHtml(bodyHtml, context);

  // Header customizado
  const header = `
<div class="header">
  <div>
    <div class="header-brand">Berkahn</div>
    <div class="header-tagline">Performance Report</div>
  </div>
  <div class="header-meta">
    <strong>${context.monthLabel}</strong>${context.partial ? ` <span class="status-pill status-partial">parcial · ${context.daysCovered}/${context.daysInMonth} dias</span>` : ''}
    <div>${context.periodStart} a ${context.periodEnd}</div>
    <div>Gerado em ${context.generatedDate}</div>
  </div>
</div>
  `;

  bodyHtml = header + bodyHtml;

  const html = Mustache.render(htmlTemplate, {
    ...context,
    // O template é compartilhado com scripts/documentacoes/build-doc.mjs, que
    // gera documentos que não são relatório mensal. Por isso o <title> é
    // parâmetro e não string fixa.
    docTitle: `Performance Blog Berkahn — ${context.monthLabel}`,
    bodyHtml,
  });

  fs.writeFileSync(outputPath, html);
  return outputPath;
}

// CLI entry (debug)
// pathToFileURL porque no Windows a URL de um path C:\ tem três barras
// (file:///C:/...), e a comparação montada à mão nunca casa. O guard de
// argv[1] evita quebrar quando o módulo é importado via `node -e`.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const mdPath = process.argv[2];
  if (!mdPath || !fs.existsSync(mdPath)) {
    console.error('Usage: node render-html.mjs <path-to-md>');
    process.exit(1);
  }
  console.log('CLI mode: render-html requires context. Use via generate-report.mjs.');
}
