'use server'

import { createClient } from '@/lib/supabase/server'

const BUCKET_NAME = 'post-images'

export async function uploadCoverImage(formData: FormData): Promise<{
  url: string | null
  error: string | null
}> {
  try {
    const file = formData.get('file') as File
    const postSlug = formData.get('postSlug') as string

    if (!file) {
      return { url: null, error: 'No file provided' }
    }

    const supabase = await createClient()

    // Generate filename for covers folder
    const fileExt = file.name.split('.').pop()
    const fileName = `covers/${postSlug}.${fileExt}`

    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: true, // Overwrite if exists
      })

    if (error) {
      console.error('Storage upload error:', error)
      return { url: null, error: error.message }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path)

    return {
      url: urlData.publicUrl,
      error: null,
    }
  } catch (err) {
    console.error('Upload error:', err)
    return { url: null, error: 'Failed to upload image' }
  }
}

export async function deleteCoverImage(path: string): Promise<{ error: string | null }> {
  try {
    const supabase = await createClient()

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([path])

    if (error) {
      console.error('Storage delete error:', error)
      return { error: error.message }
    }

    return { error: null }
  } catch (err) {
    console.error('Delete error:', err)
    return { error: 'Failed to delete image' }
  }
}
