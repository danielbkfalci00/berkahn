// Estado de indexação de URLs específicas via URL Inspection API do GSC.
// Uso: node --env-file=.env.local scripts/analytics/adhoc-inspect-urls.mjs slug1 slug2 ...
import { google } from 'googleapis';
import { getAuth, getGscSiteUrl } from './lib/auth.mjs';

const SITE = 'https://www.berkahn.com.br';
const slugs = process.argv.slice(2);
if (!slugs.length) { console.error('passe ao menos um slug'); process.exit(1); }

const auth = await getAuth(['https://www.googleapis.com/auth/webmasters.readonly']);
const sc = google.searchconsole({ version: 'v1', auth });
const siteUrl = getGscSiteUrl();

for (const slug of slugs) {
  const inspectionUrl = `${SITE}/atualidades/${slug}`;
  try {
    const r = await sc.urlInspection.index.inspect({ requestBody: { inspectionUrl, siteUrl } });
    const i = r.data.inspectionResult?.indexStatusResult || {};
    console.log(slug);
    console.log(`   veredito : ${i.verdict}`);
    console.log(`   cobertura: ${i.coverageState}`);
    console.log(`   crawl    : ${i.lastCrawlTime ? String(i.lastCrawlTime).slice(0,10) : 'NUNCA'}`);
    if (i.robotsTxtState && i.robotsTxtState !== 'ALLOWED') console.log(`   robots   : ${i.robotsTxtState}`);
  } catch (e) {
    console.log(`${slug}\n   ERRO: ${e.message}`);
  }
  await new Promise(r => setTimeout(r, 300)); // throttle
}
