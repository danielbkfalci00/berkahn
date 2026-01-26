import { createClient } from '@/lib/supabase/server'

const BUCKET_NAME = 'post-images'

export interface UploadResult {
  url: string
  path: string
}

/**
 * Upload an image to Supabase Storage for a post
 * @param file - The file to upload
 * @param postSlug - The slug of the post (used for organizing files)
 * @returns The public URL of the uploaded image
 */
export async function uploadPostImage(
  file: File,
  postSlug: string
): Promise<{ data: UploadResult | null; error: string | null }> {
  try {
    const supabase = await createClient()

    // Generate unique filename
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${postSlug}/${timestamp}-${sanitizedName}`

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('Storage upload error:', error)
      return { data: null, error: error.message }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path)

    return {
      data: {
        url: urlData.publicUrl,
        path: data.path,
      },
      error: null,
    }
  } catch (err) {
    console.error('Upload error:', err)
    return { data: null, error: 'Failed to upload image' }
  }
}

/**
 * Delete an image from Supabase Storage
 * @param path - The path of the file to delete
 */
export async function deletePostImage(
  path: string
): Promise<{ error: string | null }> {
  try {
    const supabase = await createClient()

    const { error } = await supabase.storage.from(BUCKET_NAME).remove([path])

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

/**
 * List all images for a post
 * @param postSlug - The slug of the post
 */
export async function listPostImages(
  postSlug: string
): Promise<{ data: string[]; error: string | null }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(postSlug, {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' },
      })

    if (error) {
      console.error('Storage list error:', error)
      return { data: [], error: error.message }
    }

    // Convert to public URLs
    const urls = data
      .filter((file) => !file.name.startsWith('.'))
      .map((file) => {
        const { data: urlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(`${postSlug}/${file.name}`)
        return urlData.publicUrl
      })

    return { data: urls, error: null }
  } catch (err) {
    console.error('List error:', err)
    return { data: [], error: 'Failed to list images' }
  }
}
