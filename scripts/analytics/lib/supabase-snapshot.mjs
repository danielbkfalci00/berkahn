// Upsert de snapshot mensal no Supabase analytics_snapshots
// Usado pelo generate-report.mjs após gerar MD/HTML/KPIs
import https from 'node:https';

const SUPABASE_HOST = 'sfqaknxomxwmviarpwfy.supabase.co';

function getServiceKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
}

export function serviceRequest(method, path, body, headers = {}) {
  const key = getServiceKey();
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY ausente em .env.local');
  const data = body ? JSON.stringify(body) : null;
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: SUPABASE_HOST,
        path,
        method,
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
          ...headers,
        },
      },
      (res) => {
        let buf = '';
        res.on('data', (c) => (buf += c));
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(buf ? JSON.parse(buf) : null);
          } else {
            reject(new Error(`Supabase ${res.statusCode}: ${buf}`));
          }
        });
      }
    );
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

/**
 * Faz UPSERT (idempotente por month) de um snapshot mensal.
 * @param {string} monthSlug formato "YYYY-MM"
 * @param {object} ga4 dados crus de fetchGa4
 * @param {object} gsc dados crus de fetchGsc
 * @param {object|null} ga4Prev mês anterior (opcional)
 * @param {object|null} gscPrev mês anterior (opcional)
 * @param {object} context contexto enriched (insights, actions, indexation, summary, etc)
 */
export async function upsertSnapshot({ monthSlug, ga4, gsc, ga4Prev, gscPrev, context }) {
  if (!monthSlug || !/^\d{4}-\d{2}$/.test(monthSlug)) {
    throw new Error(`monthSlug inválido: ${monthSlug}`);
  }
  const month = `${monthSlug}-01`; // primeiro dia do mês como DATE

  const payload = [
    {
      month,
      ga4_data: ga4,
      gsc_data: gsc,
      ga4_prev: ga4Prev || null,
      gsc_prev: gscPrev || null,
      context,
      generated_at: new Date().toISOString(),
    },
  ];

  // PostgREST upsert: header Prefer resolution=merge-duplicates
  return serviceRequest('POST', '/rest/v1/analytics_snapshots', payload, {
    Prefer: 'resolution=merge-duplicates,return=minimal',
  });
}
