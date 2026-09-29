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
            try {
              resolve(buf ? JSON.parse(buf) : null);
            } catch {
              reject(new Error('Supabase retornou uma resposta JSON inválida.'));
            }
          } else {
            reject(new Error(`Supabase ${res.statusCode}: ${buf}`));
          }
        });
      }
    );
    req.on('error', reject);
    req.setTimeout(30_000, () => req.destroy(new Error('Tempo limite ao persistir o snapshot no Supabase.')));
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
export async function upsertSnapshot({ monthSlug, ga4, gsc, ga4Prev, gscPrev, context }, { request = serviceRequest } = {}) {
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
  const written = await request('POST', '/rest/v1/analytics_snapshots?select=month,generated_at', payload, {
    Prefer: 'resolution=merge-duplicates,return=representation',
  });
  if (!Array.isArray(written) || written.length !== 1 || written[0].month !== month ||
      Date.parse(written[0].generated_at) !== Date.parse(payload[0].generated_at)) {
    throw new Error(`Persistência do snapshot ${monthSlug} não foi confirmada pelo Supabase.`);
  }
  return written[0];
}

/** O pipeline hospedado só pode ficar verde após confirmar a gravação. */
export async function persistSnapshot(input, {
  required = false,
  serviceKey = getServiceKey(),
  upload = upsertSnapshot,
  warn = console.warn,
} = {}) {
  try {
    if (!serviceKey) throw new Error('Chave de serviço do Supabase ausente; snapshot não foi enviado.');
    await upload(input);
    return true;
  } catch (error) {
    if (required) throw error;
    warn(`Falha ao salvar snapshot: ${error.message}. O relatório local foi preservado.`);
    return false;
  }
}
