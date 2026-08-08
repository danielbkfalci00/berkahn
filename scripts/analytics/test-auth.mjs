// Usage: node --env-file=.env.local scripts/analytics/test-auth.mjs
import { google } from 'googleapis';
import { getAuth, getServiceAccountInfo, getGa4PropertyId, getGscSiteUrl, getActiveAuthMode } from './lib/auth.mjs';

const GA4_SCOPE = 'https://www.googleapis.com/auth/analytics.readonly';
const GSC_SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';

async function testGa4() {
  const auth = getAuth([GA4_SCOPE]);
  const propertyId = getGa4PropertyId();
  const data = google.analyticsdata({ version: 'v1beta', auth });
  const res = await data.properties.runReport({
    property: `properties/${propertyId}`,
    requestBody: {
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      metrics: [{ name: 'sessions' }],
      limit: 1,
    },
  });
  return res.data.rowCount ?? 0;
}

async function testGsc() {
  const auth = getAuth([GSC_SCOPE]);
  const siteUrl = getGscSiteUrl();
  const sc = google.searchconsole({ version: 'v1', auth });
  const sites = await sc.sites.list();
  const entries = sites.data.siteEntry || [];
  // Aceita match exato OU contém "berkahn" (caso a configuração seja URL-prefix em vez de sc-domain)
  let found = entries.find((s) => s.siteUrl === siteUrl);
  if (!found) {
    found = entries.find((s) => s.siteUrl.includes('berkahn'));
  }
  if (!found) {
    const known = entries.map((s) => s.siteUrl).join(', ') || '(nenhum)';
    throw new Error(`GSC site ${siteUrl} não encontrado. Sites visíveis: ${known}`);
  }
  if (found.siteUrl !== siteUrl) {
    console.log(`⚠️  GSC_SITE_URL configurado como "${siteUrl}" mas encontrado "${found.siteUrl}". Considere atualizar .env.local.`);
  }
  return { perm: found.permissionLevel, siteUrl: found.siteUrl };
}

function checkKeyAge() {
  const sa = getServiceAccountInfo();
  if (!sa || !sa.private_key_id) return null;
  return { email: sa.client_email, projectId: sa.project_id };
}

async function main() {
  const ok = { ga4: false, gsc: false };
  const mode = getActiveAuthMode();
  console.log(`Auth mode: ${mode || '(nenhum)'}`);
  if (mode === 'sa') {
    const info = checkKeyAge();
    if (info) {
      console.log(`Service account: ${info.email}`);
      console.log(`Project: ${info.projectId}`);
    }
  } else if (mode === 'adc') {
    console.log('Usando Application Default Credentials (gcloud auth application-default login)');
  }
  console.log('');

  try {
    const rows = await testGa4();
    console.log(`✅ GA4 OK (property ${getGa4PropertyId()}, ${rows} linhas em 7 dias)`);
    ok.ga4 = true;
  } catch (e) {
    console.error(`❌ GA4 FAIL: ${e.message}`);
  }

  try {
    const { perm, siteUrl } = await testGsc();
    console.log(`✅ GSC OK (${siteUrl}, permissão: ${perm})`);
    ok.gsc = true;
  } catch (e) {
    console.error(`❌ GSC FAIL: ${e.message}`);
  }

  console.log('');
  if (ok.ga4 && ok.gsc) {
    console.log('✅ Tudo pronto — pode rodar /performance');
    process.exit(0);
  } else {
    console.log('❌ Setup incompleto — checar erros acima');
    process.exit(1);
  }
}

main().catch((e) => {
  console.error('Erro fatal:', e.message);
  process.exit(2);
});
