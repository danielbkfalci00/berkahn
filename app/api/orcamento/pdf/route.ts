import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export const maxDuration = 60; // Timeout de 60 segundos para geração

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pacoteId = searchParams.get("pacote") || "material-acompanhamento-berkahn";
  const numeroOrcamento = searchParams.get("numero") || "BRK-2026-0042";

  try {
    // Configuração do Chromium
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();

    // Viewport desktop para layout consistente
    await page.setViewport({ width: 1440, height: 900 });

    // URL base - usa localhost em dev ou site em produção
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const pdfUrl = `${baseUrl}/orcamento/pdf?pacote=${pacoteId}`;

    // Navega para a página PDF otimizada
    await page.goto(pdfUrl, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    // Aguarda fontes carregarem
    await page.evaluateHandle("document.fonts.ready");

    // Aguarda um pouco para garantir renderização completa
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Gera o PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true, // Crítico para seções escuras
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      preferCSSPageSize: true,
    });

    await browser.close();

    // Converte Uint8Array para Buffer para uso com Response
    const pdf = Buffer.from(pdfBuffer);

    // Retorna o PDF como response
    return new Response(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Orcamento-Berkahn-${numeroOrcamento}.pdf"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    return new Response(
      JSON.stringify({
        error: "Falha ao gerar PDF",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
