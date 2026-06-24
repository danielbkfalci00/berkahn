import { NextResponse } from "next/server"
import sharp from "sharp"
import { createServiceClient } from "@/lib/supabase/admin"

const MAX_INPUT_BYTES = 10 * 1024 * 1024
const TARGET_MAX_BYTES = 500 * 1024
const QUALITIES = [85, 75, 65]

interface RouteContext {
  params: Promise<{ id: string }>
}

async function processarHero(buffer: Buffer): Promise<Buffer> {
  let lastBuffer: Buffer | null = null
  for (const quality of QUALITIES) {
    const out = await sharp(buffer)
      .resize(1920, 1080, { fit: "cover", position: "center" })
      .webp({ quality })
      .toBuffer()
    lastBuffer = out
    if (out.byteLength <= TARGET_MAX_BYTES) return out
  }
  return lastBuffer!
}

export async function POST(request: Request, ctx: RouteContext) {
  const { id } = await ctx.params
  const formData = await request.formData()
  const file = formData.get("file")

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Campo 'file' ausente" }, { status: 400 })
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Arquivo precisa ser uma imagem" }, { status: 400 })
  }
  if (file.size > MAX_INPUT_BYTES) {
    return NextResponse.json(
      { error: `Imagem maior que ${MAX_INPUT_BYTES / 1024 / 1024}MB` },
      { status: 400 }
    )
  }

  const inputBuffer = Buffer.from(await file.arrayBuffer())
  let processed: Buffer
  try {
    processed = await processarHero(inputBuffer)
  } catch (err) {
    console.error("Sharp processing error:", err)
    return NextResponse.json({ error: "Falha ao processar imagem" }, { status: 500 })
  }

  const supabase = createServiceClient()
  const path = `${id}/hero.webp`

  const { error: uploadError } = await supabase.storage
    .from("orcamento-heroes")
    .upload(path, processed, {
      contentType: "image/webp",
      cacheControl: "3600",
      upsert: true,
    })

  if (uploadError) {
    console.error("Storage upload error:", uploadError)
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data: signed, error: signedError } = await supabase.storage
    .from("orcamento-heroes")
    .createSignedUrl(path, 60 * 60 * 24 * 7)

  if (signedError || !signed) {
    return NextResponse.json(
      { error: signedError?.message ?? "Falha ao gerar signed URL" },
      { status: 500 }
    )
  }

  const { error: updateError } = await supabase
    .from("orcamentos")
    .update({ hero_image_url: path })
    .eq("id", id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({
    path,
    signedUrl: signed.signedUrl,
    sizeBytes: processed.byteLength,
  })
}
