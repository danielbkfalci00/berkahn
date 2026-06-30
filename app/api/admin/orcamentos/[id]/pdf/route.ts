import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/admin"
import { launchBrowser, getBaseUrl } from "@/lib/puppeteer-launch"
import { assinarToken, ORCAMENTO_TOKEN_HEADER } from "@/lib/orcamento-token"
import { salvarPdfOrcamento } from "@/lib/orcamento-pdf-storage"
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

export async function POST(request: Request, ctx: RouteContext) {
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
    await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 })
    await page.evaluateHandle("document.fonts.ready")
    await new Promise((resolve) => setTimeout(resolve, 800))

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

    const { error: updateError } = await supabase
      .from("orcamentos")
      .update({
        pdf_url: signedUrl,
        pdf_storage_path: path,
        status: orcamento.status === "rascunho" ? "finalizado" : orcamento.status,
      })
      .eq("id", id)

    if (updateError) {
      console.error("Falha ao atualizar pdf_url:", updateError)
    }

    return NextResponse.json({
      pdf_url: signedUrl,
      pdf_storage_path: path,
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
