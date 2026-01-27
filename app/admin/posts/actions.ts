'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Post, PostInsert, PostUpdate } from '@/types/admin'

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
          url: `https://berkahn.com.br/atualidade/${post.slug}`,
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

  const { data: post, error } = await supabase
    .from('posts')
    .insert(data)
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
  return { data: post as Post, error: null }
}

export async function updatePost(id: string, data: PostUpdate): Promise<{ data: Post | null; error: string | null }> {
  const supabase = await createClient()

  // Get previous status to detect publish action
  const { data: previousPost } = await supabase
    .from('posts')
    .select('status')
    .eq('id', id)
    .single()

  const previousStatus = previousPost?.status

  const { data: post, error } = await supabase
    .from('posts')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating post:', error)
    return { data: null, error: error.message }
  }

  // Log activity
  const { data: { user } } = await supabase.auth.getUser()
  if (user && post) {
    const action = data.status === 'published' ? 'Post publicado' : 'Post atualizado'
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
  if (post && data.status === 'published' && previousStatus !== 'published') {
    await triggerPublishWebhook(post as Post)
  }

  revalidatePath('/admin/posts')
  revalidatePath('/admin')
  revalidatePath(`/atualidade/${post?.slug}`)
  return { data: post as Post, error: null }
}

export async function deletePost(id: string): Promise<{ error: string | null }> {
  const supabase = await createClient()

  // Get post info before deleting for activity log
  const { data: post } = await supabase
    .from('posts')
    .select('title')
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
  revalidatePath('/atualidade')
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
