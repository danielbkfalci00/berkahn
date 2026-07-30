import { NextResponse } from "next/server"
import { launchBrowser, getBaseUrl } from "@/lib/puppeteer-launch"

export const maxDuration = 60
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  let browser: Awaited<ReturnType<typeof launchBrowser>> | null = null
  try {
    // ?dpr=1.5 gera arquivo mais leve (WhatsApp); default 2 pra rasterização nítida.
    const dprParam = Number(new URL(request.url).searchParams.get("dpr"))
    const dpr = dprParam >= 1 && dprParam <= 3 ? dprParam : 2

    browser = await launchBrowser()
    const page = await browser.newPage()
    // Viewport A4-native (794×1123 @ 96dpi). Sem preferCSSPageSize: misturar
    // viewport + preferCSSPageSize causa scale-down não-uniforme (pt vs px)
    // — ver app/api/admin/orcamentos/[id]/pdf.
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: dpr })

    await page.evaluateOnNewDocument(() => {
      try {
        window.localStorage.setItem("cookieConsent", "accepted")
      } catch {
        // ignore
      }
    })

    const baseUrl = getBaseUrl(request.url)
    await page.goto(`${baseUrl}/institucional/pdf`, {
      waitUntil: "networkidle0",
      timeout: 30000,
    })
    await page.evaluateHandle("document.fonts.ready")

    // Esconde o indicador do Next dev (badge "N") — não existe em produção,
    // mas apareceria no PDF gerado a partir do dev server.
    await page
      .addStyleTag({
        content:
          "nextjs-portal,[data-next-badge-root],[data-nextjs-dev-indicator],#__next-build-watcher{display:none!important}",
      })
      .catch(() => {})

    // Percorre a página inteira e volta ao topo: garante que toda imagem
    // decodifique antes do print, mesmo se algum request escapou do networkidle0.
    await page.evaluate(async () => {
      const passo = window.innerHeight
      for (let y = 0; y <= document.body.scrollHeight; y += passo) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 100))
      }
      window.scrollTo(0, 0)
    })
    await new Promise((resolve) => setTimeout(resolve, 800))

    const pdfUint8 = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    })

    return new NextResponse(Buffer.from(pdfUint8), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="Berkahn-Institucional.pdf"',
        "Cache-Control": "no-store",
      },
    })
  } catch (err) {
    console.error("Erro ao gerar PDF institucional:", err)
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
