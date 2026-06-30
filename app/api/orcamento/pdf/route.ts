import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export const maxDuration = 60; // Timeout de 60 segundos para geração

// Determina a URL base correta para o ambiente
function getBaseUrl(requestUrl: string): string {
  // Em desenvolvimento local
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  // No Vercel, usa a URL do request ou VERCEL_URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Fallback: extrai a origem do request
  try {
    const url = new URL(requestUrl);
    return url.origin;
  } catch {
    return "http://localhost:3000";
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pacoteId = searchParams.get("pacote") || "material-acompanhamento-berkahn";
  const numeroOrcamento = searchParams.get("numero") || "BRK-2026-0042";

  try {
    // Configuração do Chromium para ambiente serverless
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();

    // Viewport A4-native (794×1123 @ 96dpi) com DPR=2 — espelha o renderer admin
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });

    // Bypass do CookieBanner — evita banner sobrepondo a última seção do PDF
    await page.evaluateOnNewDocument(() => {
      try {
        window.localStorage.setItem("cookieConsent", "accepted");
      } catch {
        // ignore
      }
    });

    // URL base - usa a URL correta para o ambiente
    const baseUrl = getBaseUrl(request.url);
    const pdfUrl = `${baseUrl}/orcamento/pdf?pacote=${pacoteId}`;

    console.log("Generating PDF from:", pdfUrl);

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
