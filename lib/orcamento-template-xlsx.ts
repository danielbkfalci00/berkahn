// Server-only. Gera o template modelo-orcamento.xlsx on-demand.
// xlsx-js-style importado dinamicamente (CJS-only) — ver next.config.ts:serverExternalPackages.

import { PLANILHA_COLUNAS } from "@/types/orcamento-estimativa"

const EXEMPLO: Record<string, string | number> = {
  cliente_nome: "Família Teste",
  cliente_email: "contato@familiateste.com.br",
  cliente_telefone: "(48) 99999-9999",
  obra_endereco: "Rua Exemplo, 123",
  obra_cidade: "Florianópolis - SC",
  obra_referencia: "Lote 15, Quadra B",
  area_m2: 280,
  pavimentos: 2,
  piscina: "sim, 4x8m",
  padrao_acabamento: "alto",
  valor_min: 1800000,
  valor_max: 2100000,
  valor_m2_min: 6400,
  valor_m2_max: 7500,
  regime_recomendado: "administracao",
  data_cotacao: new Date().toISOString().slice(0, 10),
  validade_dias: 30,
  responsavel_tecnico: "Bruno Falci",
}

export async function gerarTemplateXlsx(): Promise<Buffer> {
  const XLSX = await import("xlsx-js-style")

  const headerRow = PLANILHA_COLUNAS.map((c) => ({
    v: c,
    t: "s" as const,
    s: {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "1F2937" } },
      alignment: { horizontal: "left" as const, vertical: "center" as const },
    },
  }))

  const exemploRow = PLANILHA_COLUNAS.map((c) => {
    const valor = EXEMPLO[c]
    if (typeof valor === "number") {
      return { v: valor, t: "n" as const }
    }
    return { v: String(valor ?? ""), t: "s" as const }
  })

  const ws = XLSX.utils.aoa_to_sheet([headerRow, exemploRow])

  ws["!cols"] = PLANILHA_COLUNAS.map((c) => ({
    wch: Math.max(c.length + 2, 16),
  }))
  ws["!rows"] = [{ hpt: 22 }]

  // Hint via cell comment para colunas enum (xlsx-js-style não suporta
  // dataValidation no write path; comment é o fallback compatível).
  const HINTS: Partial<Record<(typeof PLANILHA_COLUNAS)[number], string>> = {
    padrao_acabamento: "Valores válidos: baixo, medio, alto, altissimo",
    regime_recomendado:
      "Valores válidos: administracao, fechado, pmg, indefinido",
    data_cotacao: "Formato: YYYY-MM-DD (ou DD/MM/YYYY)",
  }
  PLANILHA_COLUNAS.forEach((col, idx) => {
    const hint = HINTS[col]
    if (!hint) return
    const addr = XLSX.utils.encode_cell({ r: 0, c: idx })
    const cell = ws[addr]
    if (cell) {
      cell.c = [{ a: "Berkahn", t: hint, T: true }]
    }
  })

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "orcamento")

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" })
  return Buffer.isBuffer(buf) ? buf : Buffer.from(buf)
}
