// Busca metadados de posts publicados no Supabase para enriquecer relatório

import https from 'node:https';

const SUPABASE_HOST = 'sfqaknxomxwmviarpwfy.supabase.co';

function get(path) {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!key) throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY ausente em .env.local');
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: SUPABASE_HOST,
      path,
      method: 'GET',
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    }, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`Supabase ${res.statusCode}: ${body}`));
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

let cached = null;

export async function getPublishedPostsMap() {
  if (cached) return cached;
  const posts = await get('/rest/v1/posts?status=eq.published&select=slug,title,category,published_at');
  cached = new Map(posts.map((p) => [p.slug, p]));
  return cached;
}

// Títulos legíveis para páginas não-blog (home, pillar, etc)
const NON_BLOG_TITLES = {
  '/': 'Home',
  '/lsf': 'Pillar LSF',
  '/servicos': 'Serviços',
  '/residencial': 'Residencial',
  '/comercial-industrial': 'Comercial e Industrial',
  '/empresa': 'Empresa',
  '/apresentacao-executiva': 'Apresentação Executiva',
  '/atualidade': 'Atualidades (índice)',
  '/atualidades': 'Atualidades (índice)',
  '/contato': 'Contato',
  '/orcamento': 'Orçamento',
  '/perguntas-frequentes': 'FAQ',
  '/portfolio': 'Portfolio',
  '/privacidade': 'Política de Privacidade',
  '/termos-de-uso': 'Termos de Uso',
};

function extractPath(row) {
  if (row.path) return row.path;
  if (row.page) {
    try {
      return new URL(row.page).pathname || '/';
    } catch (e) {
      // page é só path
      return row.page;
    }
  }
  return null;
}

export async function enrichRowsWithTitle(rows, slugKey = 'slug') {
  const map = await getPublishedPostsMap();
  return rows.map((r) => {
    const slug = r[slugKey] || '';
    const path = extractPath(r) || (slug.startsWith('/') ? slug : `/${slug}`);
    // Tentar match no Supabase só se slug parece ser de artigo (não-vazio e sem /)
    const post = slug && !slug.startsWith('/') ? map.get(slug) : null;
    let title;
    if (post?.title) {
      title = post.title;
    } else if (NON_BLOG_TITLES[path]) {
      title = NON_BLOG_TITLES[path];
    } else if (path === '/' || (!slug && !path)) {
      title = 'Home';
    } else {
      title = path; // fallback: mostra path completo
    }
    return {
      ...r,
      path,
      title,
      category: post?.category || null,
    };
  });
}

export async function getAllPostUrls(base = 'https://www.berkahn.com.br') {
  const map = await getPublishedPostsMap();
  return Array.from(map.keys()).map((slug) => `${base}/atualidades/${slug}`);
}
