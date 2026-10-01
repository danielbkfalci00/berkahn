import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/admin"
import { exigirSessao } from "@/lib/supabase/sessao"
import { launchBrowser, getBaseUrl } from "@/lib/puppeteer-launch"
import { assinarToken, ORCAMENTO_TOKEN_HEADER } from "@/lib/orcamento-token"
import { getOrcamentoPdfRevision, salvarPdfOrcamento } from "@/lib/orcamento-pdf-storage"
import { validarTudo } from "@/components/admin/orcamentos/wizard-state"
import { LOGO_DATA_URI } from "@/lib/orcamento-logo-data-uri"
import type { Orcamento } from "@/types/orcamento-estimativa"

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export const maxDuration = 60
export const dynamic = "force-dynamic"

const CAMPOS_OBRIGATORIOS: (keyof Orcamento)[] = [
  "cliente_nome",
  "obra_endereco",
  "obra_cidade",
  "projeto_area_m2",
  "projeto_padrao",
  "valor_min",
  "valor_max",
  "valor_m2_min",
  "valor_m2_max",
  "data_cotacao",
]

interface RouteContext {
  params: Promise<{ id: string }>
}

async function limparPdf(supabase: ReturnType<typeof createServiceClient>, path: string) {
  try {
    const { error } = await supabase.storage.from("orcamento-pdfs").remove([path])
    if (error) console.error("Falha ao limpar PDF:", error.message)
  } catch (error) {
    console.error("Falha ao limpar PDF:", error)
  }
}

export async function POST(request: Request, ctx: RouteContext) {
  // `assinarToken` abaixo autentica a chamada ao RENDERER, não esta entrada:
  // sem esta checagem, gerar PDF de qualquer orçamento era público.
  const barrado = await exigirSessao()
  if (barrado) return barrado

  const { id } = await ctx.params

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from("orcamentos")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: "Orçamento não encontrado" }, { status: 404 })
  }
  const orcamento = data as unknown as Orcamento
  const expectedRevision = request.headers.get("If-Match")?.replace(/^"|"$/g, "")
  if (!expectedRevision || expectedRevision !== orcamento.atualizado_em) return NextResponse.json({ error: "O orçamento mudou. Atualize a página e confira os dados antes de gerar o PDF." }, { status: 409 })
  if (orcamento.status === "arquivado") return NextResponse.json({ error: "Reabra o orçamento antes de gerar outra versão." }, { status: 409 })
  const validation = validarTudo(orcamento)
  if (!validation.ok) return NextResponse.json({ error: "Revise os campos antes de gerar o PDF.", campos: Object.values(validation.erros) }, { status: 400 })

  const ausentes = CAMPOS_OBRIGATORIOS.filter(
    (campo) =>
      orcamento[campo] === null ||
      orcamento[campo] === undefined ||
      orcamento[campo] === ""
  )
  if (ausentes.length > 0) {
    return NextResponse.json(
      { error: "Campos obrigatórios ausentes", campos: ausentes },
      { status: 400 }
    )
  }

  let browser: Awaited<ReturnType<typeof launchBrowser>> | null = null
  try {
    browser = await launchBrowser()
    const page = await browser.newPage()
    // Viewport A4-native (794×1123 @ 96dpi) com DPR=2 pra rasterização nítida.
    // Mistura desktop viewport + preferCSSPageSize causa scale-down não-uniforme
    // (pt vs px escalam diferente) — origem dos cards "saindo da borda".
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 })

    await page.evaluateOnNewDocument(() => {
      try {
        window.localStorage.setItem("cookieConsent", "accepted")
      } catch {
        // ignore
      }
    })

    await page.setExtraHTTPHeaders({
      [ORCAMENTO_TOKEN_HEADER]: assinarToken(id),
    })

    const baseUrl = getBaseUrl(request.url)
    const url = `${baseUrl}/orcamento/estimativa/${id}`
    const response = await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 })
    if (!response?.ok()) throw new Error(`Renderer indisponível (${response?.status() ?? "sem resposta"}).`)
    await page.waitForSelector("main[data-orcamento-id]", { timeout: 10_000 })
    const renderedId = await page.$eval("main[data-orcamento-id]", (element) => element.getAttribute("data-orcamento-id"))
    if (renderedId !== id) throw new Error("O renderer não confirmou o orçamento solicitado.")
    await page.evaluateHandle("document.fonts.ready")
    await page.waitForFunction(() => Array.from(document.querySelectorAll<HTMLImageElement>("main img")).every((image) => image.complete), { timeout: 10_000 })
    const imagesReady = await page.$eval("main", (element) => Array.from(element.querySelectorAll<HTMLImageElement>("img")).every((image) => image.naturalWidth > 0))
    if (!imagesReady) throw new Error("Uma imagem do orçamento não carregou. Tente gerar novamente.")

    // O Chromium embute WebP como PNG no PDF. As fotos locais ficam até 10x
    // maiores; JPEG preserva a nitidez impressa sem duplicar assets no repo.
    await page.evaluate(async () => {
      for (const image of document.querySelectorAll<HTMLImageElement>("main img")) {
        const originalSrc = image.currentSrc || image.src
        const source = new URL(originalSrc, location.href)
        if (source.origin !== location.origin || !source.pathname.toLowerCase().endsWith(".webp")) continue

        const scale = Math.min(1, 1600 / Math.max(image.naturalWidth, image.naturalHeight))
        const canvas = document.createElement("canvas")
        canvas.width = Math.round(image.naturalWidth * scale)
        canvas.height = Math.round(image.naturalHeight * scale)
        const context = canvas.getContext("2d")
        if (!context) continue

        try {
          context.drawImage(image, 0, 0, canvas.width, canvas.height)
          image.src = canvas.toDataURL("image/jpeg", 0.8)
          await image.decode()
        } catch {
          image.src = originalSrc
          await image.decode().catch(() => {})
        }
      }
    })

    const cliente = escapeHtml(orcamento.cliente_nome)
    const numero = escapeHtml(orcamento.numero)
    const headerTemplate = `<div style="width:100%;padding:0 15mm;display:flex;justify-content:space-between;align-items:center;font-size:8pt;color:#666;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif"><img src="${LOGO_DATA_URI}" style="height:14px"/><span style="letter-spacing:0.05em">${cliente} · ${numero}</span></div>`
    const footerTemplate = `<div style="width:100%;padding:0 15mm;text-align:right;font-size:8pt;color:#666;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">${numero} · Página <span class="pageNumber"></span> de <span class="totalPages"></span> · Estimativa Preliminar</div>`

    const pdfUint8 = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate,
      footerTemplate,
      margin: { top: "15mm", bottom: "12mm", left: 0, right: 0 },
    })
    const pdfBuffer = Buffer.from(pdfUint8)

    const { path, signedUrl } = await salvarPdfOrcamento(orcamento.numero, pdfBuffer)

    let { data: savedVersion, error: updateError } = await supabase
      .from("orcamentos")
      .update({
        pdf_url: signedUrl,
        pdf_storage_path: path,
        pdf_generated_at: new Date().toISOString(),
        pdf_revision_hash: getOrcamentoPdfRevision(orcamento),
        status: orcamento.status === "rascunho" ? "finalizado" : orcamento.status,
      })
      .eq("id", id)
      .eq("atualizado_em", orcamento.atualizado_em)
      .select("id,atualizado_em")
      .maybeSingle()

    // A lost response can follow a successful commit. Confirm which file is
    // referenced before deleting the upload or reporting an unsuccessful save.
    if (updateError) {
      const { data: current, error: readError } = await supabase.from("orcamentos")
        .select("id,atualizado_em,pdf_storage_path").eq("id", id).maybeSingle()
      if (!readError && current?.pdf_storage_path === path) {
        savedVersion = current
      } else {
        if (!readError && current) await limparPdf(supabase, path)
        console.error("Falha ao confirmar versão do PDF:", updateError)
        return NextResponse.json({ error: "Não foi possível confirmar a gravação do PDF. Atualize a página antes de tentar novamente." }, { status: 503 })
      }
    }
    if (!savedVersion) {
      await limparPdf(supabase, path)
      return NextResponse.json({ error: "O orçamento mudou durante a geração. Atualize a página antes de gerar novamente." }, { status: 409 })
    }
    if (orcamento.pdf_storage_path && orcamento.pdf_storage_path !== path) {
      await limparPdf(supabase, orcamento.pdf_storage_path)
    }

    return NextResponse.json({
      pdf_url: signedUrl,
      pdf_storage_path: path,
      numero: orcamento.numero,
      atualizado_em: savedVersion.atualizado_em,
    })
  } catch (err) {
    console.error("Erro ao gerar PDF:", err)
    return NextResponse.json(
      {
        error: "Falha ao gerar PDF",
        details: err instanceof Error ? err.message : "Erro desconhecido",
      },
      { status: 500 }
    )
  } finally {
    if (browser) {
      await browser.close().catch(() => {})
    }
  }
}
