// Server-only. Parser + validador de planilha-modelo (CSV/XLSX) para o módulo de orçamentos.
// xlsx-js-style importado dinamicamente (CJS-only) — ver next.config.ts:serverExternalPackages.

import Papa from "papaparse"
import {
  PLANILHA_COLUNAS,
  PLANILHA_COLUNAS_OBRIGATORIAS,
  type OrcamentoInsert,
  type PadraoAcabamento,
  type PlanilhaOrcamentoRow,
  type RegimeRecomendado,
} from "@/types/orcamento-estimativa"
import { initialState } from "@/components/admin/orcamentos/wizard-state"

export interface ErroPlanilha {
  campo?: string
  mensagem: string
}

export interface ResultadoParse {
  row: PlanilhaOrcamentoRow | null
  erros: ErroPlanilha[]
  warnings: string[]
}

const PADROES_VALIDOS: PadraoAcabamento[] = ["baixo", "medio", "alto", "altissimo"]
const REGIMES_VALIDOS: RegimeRecomendado[] = [
  "administracao",
  "fechado",
  "pmg",
  "indefinido",
]

// ============================================
// Validação de headers
// ============================================

export function validarHeaders(headers: string[]): {
  faltantes: string[]
  extras: string[]
} {
  const headersNormalizados = headers.map((h) => (h ?? "").toString().trim())
  const headersSet = new Set(headersNormalizados)
  const colunasSet = new Set<string>(PLANILHA_COLUNAS as readonly string[])

  const faltantes = (PLANILHA_COLUNAS_OBRIGATORIAS as readonly string[]).filter(
    (c) => !headersSet.has(c)
  )
  const extras = headersNormalizados.filter(
    (h) => h.length > 0 && !colunasSet.has(h)
  )
  return { faltantes, extras }
}

// ============================================
// Coerção de tipos
// ============================================

function coerceString(valor: unknown): string {
  if (valor === null || valor === undefined) return ""
  return String(valor).trim()
}

function coerceNumber(valor: unknown): number | null {
  if (valor === null || valor === undefined || valor === "") return null
  if (typeof valor === "number") return Number.isFinite(valor) ? valor : null
  const str = String(valor).trim()
  if (!str) return null
  // Aceita formato BR ("1.500,50") e US ("1500.50")
  const temVirgula = str.includes(",")
  const temPonto = str.includes(".")
  let normalizado: string
  if (temVirgula && temPonto) {
    // assume BR: ponto=milhar, vírgula=decimal
    normalizado = str.replace(/\./g, "").replace(",", ".")
  } else if (temVirgula) {
    normalizado = str.replace(",", ".")
  } else {
    normalizado = str
  }
  const n = Number(normalizado.replace(/[^\d.\-]/g, ""))
  return Number.isFinite(n) ? n : null
}

function coerceDate(valor: unknown): string | null {
  if (valor === null || valor === undefined || valor === "") return null
  if (valor instanceof Date) {
    if (Number.isNaN(valor.getTime())) return null
    return valor.toISOString().slice(0, 10)
  }
  const str = String(valor).trim()
  if (!str) return null
  // ISO YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str
  // BR DD/MM/YYYY
  const brMatch = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (brMatch) return `${brMatch[3]}-${brMatch[2]}-${brMatch[1]}`
  // Excel serial number — improvável (xlsx usa cellDates:true) mas defensivo
  if (/^\d+(\.\d+)?$/.test(str)) {
    const serial = Number(str)
    if (serial > 25569 && serial < 100000) {
      const epoch = new Date(Date.UTC(1899, 11, 30))
      const ms = serial * 86400000
      return new Date(epoch.getTime() + ms).toISOString().slice(0, 10)
    }
  }
  return null
}

// ============================================
// Normalização de uma row crua → PlanilhaOrcamentoRow
// ============================================

export function normalizarRow(raw: Record<string, unknown>): {
  row: PlanilhaOrcamentoRow | null
  erros: ErroPlanilha[]
} {
  const erros: ErroPlanilha[] = []
  const push = (campo: string, mensagem: string) => erros.push({ campo, mensagem })

  const cliente_nome = coerceString(raw.cliente_nome)
  if (!cliente_nome) push("cliente_nome", "obrigatório e vazio")

  const obra_endereco = coerceString(raw.obra_endereco)
  if (!obra_endereco) push("obra_endereco", "obrigatório e vazio")

  const obra_cidade = coerceString(raw.obra_cidade)
  if (!obra_cidade) push("obra_cidade", "obrigatório e vazio")

  const area_m2 = coerceNumber(raw.area_m2)
  if (area_m2 === null || area_m2 <= 0)
    push("area_m2", "deve ser número maior que zero")

  const pavimentos = coerceNumber(raw.pavimentos)
  if (pavimentos === null || pavimentos <= 0 || !Number.isInteger(pavimentos))
    push("pavimentos", "deve ser inteiro maior que zero")

  const padraoStr = coerceString(raw.padrao_acabamento).toLowerCase()
  if (!PADROES_VALIDOS.includes(padraoStr as PadraoAcabamento))
    push(
      "padrao_acabamento",
      `valor inválido (use: ${PADROES_VALIDOS.join(", ")})`
    )

  const valor_min = coerceNumber(raw.valor_min)
  if (valor_min === null || valor_min < 0)
    push("valor_min", "deve ser número não-negativo")

  const valor_max = coerceNumber(raw.valor_max)
  if (valor_max === null || valor_max < 0)
    push("valor_max", "deve ser número não-negativo")

  if (valor_min !== null && valor_max !== null && valor_min > valor_max)
    push("valor_max", "valor_max não pode ser menor que valor_min")

  const valor_m2_min = coerceNumber(raw.valor_m2_min)
  if (valor_m2_min === null || valor_m2_min < 0)
    push("valor_m2_min", "deve ser número não-negativo")

  const valor_m2_max = coerceNumber(raw.valor_m2_max)
  if (valor_m2_max === null || valor_m2_max < 0)
    push("valor_m2_max", "deve ser número não-negativo")

  if (
    valor_m2_min !== null &&
    valor_m2_max !== null &&
    valor_m2_min > valor_m2_max
  )
    push("valor_m2_max", "valor_m2_max não pode ser menor que valor_m2_min")

  const regimeStr = coerceString(raw.regime_recomendado).toLowerCase()
  if (!REGIMES_VALIDOS.includes(regimeStr as RegimeRecomendado))
    push(
      "regime_recomendado",
      `valor inválido (use: ${REGIMES_VALIDOS.join(", ")})`
    )

  const data_cotacao = coerceDate(raw.data_cotacao)
  if (!data_cotacao)
    push("data_cotacao", "formato inválido (use YYYY-MM-DD ou DD/MM/YYYY)")

  // Opcionais
  const cliente_email = coerceString(raw.cliente_email) || undefined
  const cliente_telefone = coerceString(raw.cliente_telefone) || undefined
  const obra_referencia = coerceString(raw.obra_referencia) || undefined
  const piscina = coerceString(raw.piscina) || undefined
  const responsavel_tecnico = coerceString(raw.responsavel_tecnico) || undefined

  let validade_dias: number | undefined
  if (raw.validade_dias !== undefined && raw.validade_dias !== "") {
    const v = coerceNumber(raw.validade_dias)
    if (v === null || v <= 0 || !Number.isInteger(v)) {
      push("validade_dias", "se preenchido, deve ser inteiro maior que zero")
    } else {
      validade_dias = v
    }
  }

  if (erros.length > 0) return { row: null, erros }

  const row: PlanilhaOrcamentoRow = {
    cliente_nome,
    cliente_email,
    cliente_telefone,
    obra_endereco,
    obra_cidade,
    obra_referencia,
    area_m2: area_m2 as number,
    pavimentos: pavimentos as number,
    piscina,
    padrao_acabamento: padraoStr as PadraoAcabamento,
    valor_min: valor_min as number,
    valor_max: valor_max as number,
    valor_m2_min: valor_m2_min as number,
    valor_m2_max: valor_m2_max as number,
    regime_recomendado: regimeStr as RegimeRecomendado,
    data_cotacao: data_cotacao as string,
    validade_dias,
    responsavel_tecnico,
  }
  return { row, erros: [] }
}

// ============================================
// Parser principal (CSV/XLSX)
// ============================================

async function lerRowsXlsx(
  buffer: Buffer
): Promise<{ headers: string[]; rows: Record<string, unknown>[] }> {
  const XLSX = await import("xlsx-js-style")
  const wb = XLSX.read(buffer, { type: "buffer", cellDates: true })
  const primeiraSheet = wb.SheetNames[0]
  if (!primeiraSheet) return { headers: [], rows: [] }
  const sheet = wb.Sheets[primeiraSheet]
  const aoa = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    blankrows: false,
    defval: "",
    raw: true,
  })
  if (aoa.length === 0) return { headers: [], rows: [] }
  const headers = (aoa[0] as unknown[]).map((h) => String(h ?? "").trim())
  const rows: Record<string, unknown>[] = []
  for (let i = 1; i < aoa.length; i++) {
    const linha = aoa[i] as unknown[]
    // Pula linhas inteiramente vazias
    const algumValor = linha.some(
      (v) => v !== null && v !== undefined && String(v).trim() !== ""
    )
    if (!algumValor) continue
    const obj: Record<string, unknown> = {}
    headers.forEach((h, idx) => {
      obj[h] = linha[idx]
    })
    rows.push(obj)
  }
  return { headers, rows }
}

function lerRowsCsv(buffer: Buffer): {
  headers: string[]
  rows: Record<string, unknown>[]
} {
  const texto = buffer.toString("utf-8").replace(/^﻿/, "")
  const parsed = Papa.parse<Record<string, unknown>>(texto, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (h) => h.trim(),
  })
  const headers = parsed.meta?.fields ?? []
  return { headers, rows: parsed.data }
}

export async function parsePlanilha(
  buffer: Buffer,
  filename: string
): Promise<ResultadoParse> {
  const erros: ErroPlanilha[] = []
  const warnings: string[] = []
  const lower = filename.toLowerCase()
  const ehCsv = lower.endsWith(".csv")
  const ehXlsx = lower.endsWith(".xlsx")

  if (!ehCsv && !ehXlsx) {
    return {
      row: null,
      erros: [{ mensagem: "Formato não suportado. Use .csv ou .xlsx." }],
      warnings,
    }
  }

  let headers: string[]
  let rows: Record<string, unknown>[]
  try {
    const lido = ehXlsx ? await lerRowsXlsx(buffer) : lerRowsCsv(buffer)
    headers = lido.headers
    rows = lido.rows
  } catch (err) {
    return {
      row: null,
      erros: [
        {
          mensagem: `Falha ao ler arquivo: ${
            err instanceof Error ? err.message : "erro desconhecido"
          }`,
        },
      ],
      warnings,
    }
  }

  const { faltantes, extras } = validarHeaders(headers)
  for (const f of faltantes) {
    erros.push({
      campo: f,
      mensagem: `Coluna obrigatória ausente: ${f}`,
    })
  }
  for (const e of extras) {
    warnings.push(`Coluna '${e}' ignorada — não consta no schema`)
  }

  if (rows.length === 0) {
    erros.push({ mensagem: "Planilha não contém linha de dados (apenas headers)" })
    return { row: null, erros, warnings }
  }
  if (rows.length > 1) {
    erros.push({
      mensagem: `Planilha deve conter exatamente 1 linha de dados (${rows.length} encontradas)`,
    })
    return { row: null, erros, warnings }
  }

  if (faltantes.length > 0) {
    return { row: null, erros, warnings }
  }

  const { row, erros: errosRow } = normalizarRow(rows[0])
  for (const e of errosRow) erros.push(e)
  return { row, erros, warnings }
}

// ============================================
// Mapeamento PlanilhaOrcamentoRow → OrcamentoInsert
// ============================================

export function rowParaInsert(row: PlanilhaOrcamentoRow): OrcamentoInsert {
  const defaults = initialState().dados
  return {
    ...defaults,
    cliente_nome: row.cliente_nome,
    cliente_email: row.cliente_email ?? null,
    cliente_telefone: row.cliente_telefone ?? null,
    obra_endereco: row.obra_endereco,
    obra_cidade: row.obra_cidade,
    obra_referencia: row.obra_referencia ?? null,
    projeto_area_m2: row.area_m2,
    projeto_pavimentos: row.pavimentos,
    projeto_piscina: row.piscina ?? null,
    projeto_padrao: row.padrao_acabamento,
    valor_min: row.valor_min,
    valor_max: row.valor_max,
    valor_m2_min: row.valor_m2_min,
    valor_m2_max: row.valor_m2_max,
    regime_recomendado: row.regime_recomendado,
    data_cotacao: row.data_cotacao,
    validade_dias: row.validade_dias ?? defaults.validade_dias,
    responsavel_tecnico: row.responsavel_tecnico ?? null,
  }
}
