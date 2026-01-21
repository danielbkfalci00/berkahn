'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Post, PostInsert, PostUpdate } from '@/types/admin'

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

export async function toggleFeatured(id: string, featured: boolean): Promise<{ error: string | null }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('posts')
    .update({ featured })
    .eq('id', id)

  if (error) {
    console.error('Error toggling featured:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/posts')
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
