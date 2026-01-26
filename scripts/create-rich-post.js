/**
 * Script para criar posts ricos no Supabase
 *
 * Uso: node scripts/create-rich-post.js
 *
 * O script lê os dados de um arquivo JSON (post-data.json) no mesmo diretório
 * ou recebe os dados via argumento --data='{ ... }'
 *
 * Exemplo de uso pelo Claude Code:
 * 1. Criar arquivo scripts/post-data.json com os dados do post
 * 2. Executar: node scripts/create-rich-post.js
 *
 * Estrutura do JSON:
 * {
 *   "title": "Título do Post",
 *   "slug": "titulo-do-post",
 *   "excerpt": "Resumo do post...",
 *   "content": "# Conteúdo em Markdown...",
 *   "category": "Tecnologia",
 *   "tags": ["tag1", "tag2"],
 *   "author": "Berkahn",
 *   "cover_image": "https://...",
 *   "read_time": 10,
 *   "meta_title": "SEO Title",
 *   "meta_description": "SEO Description",
 *   "components": {
 *     "stats": [...],
 *     "tables": [...],
 *     "charts": [...]
 *   }
 * }
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function createPost(postData) {
  // Validate required fields
  const required = ['title', 'slug', 'excerpt', 'content', 'category', 'author'];
  const missing = required.filter(field => !postData[field]);

  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }

  // Calculate read time if not provided
  if (!postData.read_time) {
    const wordCount = postData.content.split(/\s+/).length;
    postData.read_time = Math.max(1, Math.ceil(wordCount / 200));
  }

  // Prepare post object
  const post = {
    title: postData.title,
    slug: postData.slug,
    excerpt: postData.excerpt,
    content: postData.content,
    category: postData.category,
    author: postData.author,
    tags: postData.tags || [],
    cover_image: postData.cover_image || null,
    read_time: postData.read_time,
    meta_title: postData.meta_title || postData.title,
    meta_description: postData.meta_description || postData.excerpt,
    status: postData.status || 'scheduled', // Default to scheduled
    scheduled_at: postData.scheduled_at || null,
    featured: postData.featured || false,
    components: postData.components || {},
  };

  // Insert into Supabase
  const response = await fetch(`${SUPABASE_URL}/rest/v1/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create post: ${error}`);
  }

  const [createdPost] = await response.json();
  return createdPost;
}

async function main() {
  console.log('📝 Creating rich post...\n');

  // Check for --data argument
  const dataArg = process.argv.find(arg => arg.startsWith('--data='));
  let postData;

  if (dataArg) {
    // Parse from command line argument
    try {
      postData = JSON.parse(dataArg.replace('--data=', ''));
      console.log('   Source: command line argument');
    } catch (e) {
      console.error('❌ Failed to parse --data argument:', e.message);
      process.exit(1);
    }
  } else {
    // Read from post-data.json
    const dataPath = path.join(__dirname, 'post-data.json');

    if (!fs.existsSync(dataPath)) {
      console.error('❌ No data source found.');
      console.log('\nUsage:');
      console.log('  1. Create scripts/post-data.json with post data');
      console.log('  2. Run: node scripts/create-rich-post.js');
      console.log('\nOr use --data argument:');
      console.log('  node scripts/create-rich-post.js --data=\'{"title":"..."}\'');
      process.exit(1);
    }

    try {
      postData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      console.log('   Source: scripts/post-data.json');
    } catch (e) {
      console.error('❌ Failed to read post-data.json:', e.message);
      process.exit(1);
    }
  }

  console.log('   Title:', postData.title);
  console.log('   Slug:', postData.slug);
  console.log('   Category:', postData.category);
  console.log('   Components:', Object.keys(postData.components || {}).join(', ') || 'none');
  console.log('');

  try {
    const created = await createPost(postData);

    console.log('✅ Post created successfully!\n');
    console.log('   ID:', created.id);
    console.log('   Slug:', created.slug);
    console.log('   Status:', created.status);
    console.log('   Read time:', created.read_time, 'min');
    console.log('\n📌 View in admin: admin.berkahn.com.br/posts/' + created.id);

    // Clean up post-data.json if it was used
    const dataPath = path.join(__dirname, 'post-data.json');
    if (fs.existsSync(dataPath) && !dataArg) {
      fs.unlinkSync(dataPath);
      console.log('\n🧹 Cleaned up post-data.json');
    }

    return created;
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { createPost };
