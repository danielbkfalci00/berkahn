import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { blogPosts } from '../data/posts';

// Carregar variáveis de ambiente
config({ path: '.env.local' });

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erro: NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não estão definidos');
  console.error('Certifique-se de que o arquivo .env.local existe e contém essas variáveis');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migratePosts() {
  console.log(`🚀 Iniciando migração de ${blogPosts.length} posts...`);

  for (const post of blogPosts) {
    // Converter BlogPost para formato Post do Supabase
    const postData = {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: '', // Posts estáticos não têm conteúdo completo
      cover_image: post.image,
      category: post.category,
      tags: post.tags,
      author: post.author,
      status: 'published',
      published_at: new Date(post.date).toISOString(),
      read_time: parseInt(post.readTime) || 5,
      featured: post.featured || false,
      meta_title: post.title,
      meta_description: post.excerpt,
    };

    // Verificar se já existe
    const { data: existing } = await supabase
      .from('posts')
      .select('id')
      .eq('slug', post.slug)
      .single();

    if (existing) {
      console.log(`⏭️  Post "${post.title}" já existe, pulando...`);
      continue;
    }

    // Inserir no Supabase
    const { error } = await supabase
      .from('posts')
      .insert(postData);

    if (error) {
      console.error(`❌ Erro ao migrar "${post.title}":`, error.message);
    } else {
      console.log(`✅ Post "${post.title}" migrado com sucesso`);
    }
  }

  console.log('🎉 Migração concluída!');
}

migratePosts().catch(console.error);
