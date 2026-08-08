// Upsert de documento HTML no Supabase (tabela `documentos`)
// Usado pelo generate-report.mjs (relatórios mensais) e pelo
// scripts/documentacoes/seed-documentos.mjs (demais documentos).
// Espelha supabase-snapshot.mjs — mesmo transporte, mesma credencial.
import https from 'node:https';

const SUPABASE_HOST = 'sfqaknxomxwmviarpwfy.supabase.co';

function getServiceKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
}

function request(method, path, body, headers = {}) {
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

const CATEGORIAS = new Set(['performance-mensal', 'estrategia-editorial']);

/**
 * UPSERT idempotente por slug.
 * @param {object} doc
 * @param {string} doc.slug ex: "2026-06-performance-blog"
 * @param {string} doc.titulo
 * @param {string} doc.categoria "performance-mensal" | "estrategia-editorial"
 * @param {string} [doc.resumo]
 * @param {string} [doc.periodoLabel] ex: "Junho/2026"
 * @param {string} doc.referenciaData "YYYY-MM-DD"
 * @param {string} doc.html documento standalone completo
 */
export async function upsertDocumento({
  slug,
  titulo,
  categoria,
  resumo,
  periodoLabel,
  referenciaData,
  html,
}) {
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    throw new Error(`slug inválido: ${slug}`);
  }
  if (!CATEGORIAS.has(categoria)) {
    throw new Error(`categoria inválida: ${categoria}`);
  }
  if (!referenciaData || !/^\d{4}-\d{2}-\d{2}$/.test(referenciaData)) {
    throw new Error(`referenciaData inválida: ${referenciaData}`);
  }
  if (!html || !html.trim()) {
    throw new Error(`html vazio para ${slug}`);
  }

  const agora = new Date().toISOString();
  const payload = [
    {
      slug,
      titulo,
      categoria,
      resumo: resumo || null,
      periodo_label: periodoLabel || null,
      referencia_data: referenciaData,
      html,
      gerado_em: agora,
      atualizado_em: agora,
    },
  ];

  return request('POST', '/rest/v1/documentos', payload, {
    Prefer: 'resolution=merge-duplicates,return=minimal',
  });
}
