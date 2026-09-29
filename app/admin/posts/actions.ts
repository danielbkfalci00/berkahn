'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Post, PostInsert, PostUpdate } from '@/types/admin'
import { normalizeBlogCategory } from '@/types/blog'
import { getAdminSession } from '@/lib/supabase/sessao'

/** Uses the pauta revision already consumed by the approved publishing flow. */
export async function savePostRevision(
  id: string, payload: PostInsert, postUpdatedAt: string, pautaUpdatedAt: string | null
): Promise<{ error: string | null; pautaId?: string; updatedAt?: string }> {
  const session = await getAdminSession()
  if (!session || !['owner', 'conteudo'].includes(session.membership.role))
    return { error: 'Sua sessão não permite editar artigos.' }
  if (!payload.title.trim() || !payload.slug.trim() || !payload.content.trim())
    return { error: 'Preencha título, slug e conteúdo antes de salvar.' }
  const { status: _status, published_at: _publishedAt, scheduled_at: _scheduledAt, ...revision } = payload
  const { data, error } = await session.supabase.rpc('salvar_revisao_post_admin', {
    p_post_id: id,
    p_payload: { ...revision, category: normalizeBlogCategory(payload.category) },
    p_post_updated_at: postUpdatedAt,
    p_pauta_updated_at: pautaUpdatedAt,
  })
  if (error) return { error: error.message }
  if (!data?.pauta_id || !data?.atualizado_em) return { error: 'Não foi possível confirmar a revisão salva.' }
  revalidatePath('/admin/conteudo')
  revalidatePath(`/admin/conteudo/${data.pauta_id}`)
  revalidatePath(`/admin/posts/${id}`)
  return { error: null, pautaId: data.pauta_id, updatedAt: data.atualizado_em }
}

export async function publishPostRevision(
  id: string, postUpdatedAt: string, pautaUpdatedAt: string
): Promise<{ error: string | null; postUpdatedAt?: string; updatedAt?: string }> {
  const session = await getAdminSession()
  if (!session || !['owner', 'conteudo'].includes(session.membership.role))
    return { error: 'Sua sessão não permite publicar artigos.' }
  const { data, error } = await session.supabase.rpc('publicar_revisao_post_admin', {
    p_post_id: id, p_post_updated_at: postUpdatedAt, p_pauta_updated_at: pautaUpdatedAt,
  })
  if (error) return { error: error.message }
  if (!data?.post_updated_at || !data?.atualizado_em) return { error: 'Não foi possível confirmar a publicação.' }
  revalidatePath('/admin/posts')
  revalidatePath(`/admin/posts/${id}`)
  revalidatePath('/admin/conteudo')
  revalidatePath(`/admin/conteudo/${data.pauta_id}`)
  revalidatePath('/atualidades', 'layout')
  return { error: null, postUpdatedAt: data.post_updated_at, updatedAt: data.atualizado_em }
}

// Webhook helper for N8N integration
async function triggerPublishWebhook(post: Post): Promise<void> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL

  if (!webhookUrl) {
    console.log('N8N_WEBHOOK_URL not configured, skipping webhook')
    return
  }

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'post_published',
        post: {
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          cover_image: post.cover_image,
          category: post.category,
          author: post.author,
          published_at: post.published_at,
          url: `https://berkahn.com.br/atualidades/${post.slug}`,
        },
        timestamp: new Date().toISOString(),
      }),
    })
    console.log('N8N webhook triggered for post:', post.title)
  } catch (err) {
    console.error('Failed to trigger N8N webhook:', err)
    // Don't throw - webhook failure shouldn't block post publication
  }
}

export async function createPost(data: PostInsert): Promise<{ data: Post | null; error: string | null }> {
  const supabase = await createClient()

  const normalizedData: PostInsert = {
    ...data,
    category: normalizeBlogCategory(data.category),
  }

  if (normalizedData.featured) {
    const { error: featuredError } = await supabase
      .from('posts')
      .update({ featured: false })
      .eq('featured', true)

    if (featuredError) return { data: null, error: featuredError.message }
  }

  const { data: post, error } = await supabase
    .from('posts')
    .insert(normalizedData)
    .select()
    .single()

  if (error) {
    console.error('Error creating post:', error)
    return { data: null, error: error.message }
  }

  // Log activity
  const { data: { user } } = await supabase.auth.getUser()
  if (user && post) {
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      user_name: user.email || 'Admin',
      action: 'Post criado',
      entity_type: 'post',
      entity_id: post.id,
      entity_name: post.title,
    })
  }

  revalidatePath('/admin/posts')
  revalidatePath('/admin')
  revalidatePath('/atualidades')
  revalidatePath(`/atualidades/${post.slug}`)
  return { data: post as Post, error: null }
}

export async function updatePost(id: string, data: PostUpdate, expectedUpdatedAt: string): Promise<{ data: Post | null; error: string | null }> {
  const supabase = await createClient()

  const normalizedData: PostUpdate = data.category
    ? { ...data, category: normalizeBlogCategory(data.category) }
    : data

  const { data: previousPost, error: previousError } = await supabase
    .from('posts').select('status,published_at,updated_at').eq('id', id).single()
  if (previousError || !previousPost) return { data: null, error: 'Não foi possível carregar a versão atual do artigo.' }
  if (previousPost.status === 'published')
    return { data: null, error: 'Artigos publicados devem ser salvos como revisão na pauta antes de publicar alterações.' }
  if (previousPost.updated_at !== expectedUpdatedAt)
    return { data: null, error: 'Este artigo mudou em outra aba ou por outra pessoa. Copie suas alterações e atualize a página.' }
  normalizedData.published_at = normalizedData.status === 'published'
    ? previousPost.published_at ?? new Date().toISOString() : previousPost.published_at

  if (normalizedData.featured) {
    const { error: featuredError } = await supabase
      .from('posts')
      .update({ featured: false })
      .eq('featured', true)
      .neq('id', id)

    if (featuredError) {
      return { data: null, error: featuredError.message }
    }
  }

  const previousStatus = previousPost?.status

  const { data: post, error } = await supabase
    .from('posts')
    .update(normalizedData)
    .eq('id', id)
    .eq('updated_at', expectedUpdatedAt)
    .select()
    .single()

  if (error) {
    console.error('Error updating post:', error)
    return { data: null, error: error.message }
  }

  // Log activity
  const { data: { user } } = await supabase.auth.getUser()
  if (user && post) {
    const action = normalizedData.status === 'published' ? 'Post publicado' : 'Post atualizado'
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      user_name: user.email || 'Admin',
      action,
      entity_type: 'post',
      entity_id: post.id,
      entity_name: post.title,
    })
  }

  // Trigger N8N webhook if post was just published
  if (post && normalizedData.status === 'published' && previousStatus !== 'published') {
    await triggerPublishWebhook(post as Post)
  }

  revalidatePath('/admin/posts')
  revalidatePath('/admin')
  revalidatePath(`/atualidades/${post?.slug}`)
  revalidatePath('/atualidades')
  return { data: post as Post, error: null }
}

export async function deletePost(id: string): Promise<{ error: string | null }> {
  const supabase = await createClient()

  // Get post info before deleting for activity log
  const { data: post } = await supabase
    .from('posts')
    .select('title, slug')
    .eq('id', id)
    .single()

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting post:', error)
    return { error: error.message }
  }

  // Log activity
  const { data: { user } } = await supabase.auth.getUser()
  if (user && post) {
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      user_name: user.email || 'Admin',
      action: 'Post excluído',
      entity_type: 'post',
      entity_id: id,
      entity_name: post.title,
    })
  }

  revalidatePath('/admin/posts')
  revalidatePath('/admin')
  revalidatePath('/atualidades')
  if (post?.slug) {
    revalidatePath(`/atualidades/${post.slug}`)
  }
  return { error: null }
}

export async function toggleFeatured(
  id: string,
  featured: boolean
): Promise<{ error: string | null }> {
  const supabase = await createClient()

  // Se marcando como destaque, desmarcar todos os outros primeiro
  if (featured) {
    await supabase
      .from('posts')
      .update({ featured: false })
      .neq('id', id)
  }

  const { error } = await supabase
    .from('posts')
    .update({ featured })
    .eq('id', id)

  if (error) {
    console.error('Error toggling featured:', error)
    return { error: error.message }
  }

  // Log de atividade
  const { data: { user } } = await supabase.auth.getUser()
  const { data: post } = await supabase
    .from('posts')
    .select('title')
    .eq('id', id)
    .single()

  if (user && post) {
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      user_name: user.email || 'Admin',
      action: featured ? 'Post marcado como destaque' : 'Post removido do destaque',
      entity_type: 'post',
      entity_id: id,
      entity_name: post.title,
    })
  }

  revalidatePath('/admin/posts')
  revalidatePath('/atualidades')
  return { error: null }
}

export async function getPost(id: string): Promise<{ data: Post | null; error: string | null }> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching post:', error)
    return { data: null, error: error.message }
  }

  return { data: data as Post, error: null }
}

export async function getPostBySlug(slug: string): Promise<{ data: Post | null; error: string | null }> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching post by slug:', error)
    return { data: null, error: error.message }
  }

  return { data: data as Post, error: null }
}
