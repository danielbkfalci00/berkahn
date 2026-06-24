import type {
  Orcamento,
  OrcamentoInsert,
  PadraoAcabamento,
  RegimeRecomendado,
  CondicionanteExtra,
  ExclusaoExtra,
  CardEntregaId,
} from "@/types/orcamento-estimativa"
import { CARDS_ENTREGA_DEFAULT } from "@/types/orcamento-estimativa"

export type StepId = 1 | 2 | 3 | 4 | 5

export interface WizardState {
  dados: OrcamentoInsert
  hasUnsavedChanges: boolean
  ultimoStepVisitado: StepId
}

export type WizardAction =
  | {
      type: "UPDATE_FIELD"
      field: keyof OrcamentoInsert
      valor: OrcamentoInsert[keyof OrcamentoInsert]
    }
  | { type: "UPDATE_BULK"; patch: Partial<OrcamentoInsert> }
  | { type: "MARK_SAVED" }
  | { type: "VISITAR_STEP"; step: StepId }
  | { type: "RESET"; dados: OrcamentoInsert }

const HOJE = () => new Date().toISOString().slice(0, 10)

export function initialState(orcamentoInicial?: Orcamento): WizardState {
  if (orcamentoInicial) {
    const {
      id: _id,
      numero: _numero,
      slug: _slug,
      criado_em: _criado,
      atualizado_em: _atualizado,
      ...rest
    } = orcamentoInicial
    void _id
    void _numero
    void _slug
    void _criado
    void _atualizado
    return {
      dados: rest as OrcamentoInsert,
      hasUnsavedChanges: false,
      ultimoStepVisitado: 1,
    }
  }
  return {
    dados: {
      status: "rascunho",
      cliente_nome: "",
      cliente_email: null,
      cliente_telefone: null,
      obra_endereco: "",
      obra_cidade: "",
      obra_referencia: null,
      projeto_area_m2: 0,
      projeto_pavimentos: 1,
      projeto_piscina: null,
      projeto_padrao: "alto",
      valor_min: 0,
      valor_max: 0,
      valor_m2_min: 0,
      valor_m2_max: 0,
      regime_recomendado: "indefinido",
      data_cotacao: HOJE(),
      data_elaboracao: HOJE(),
      validade_dias: 30,
      hero_image_url: null,
      condicionantes_extras: [],
      exclusoes_extras: [],
      entrega_categorias_ativas: [...CARDS_ENTREGA_DEFAULT],
      responsavel_tecnico: null,
      pdf_url: null,
      pdf_storage_path: null,
      criado_por: null,
    },
    hasUnsavedChanges: false,
    ultimoStepVisitado: 1,
  }
}

export function reducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        dados: { ...state.dados, [action.field]: action.valor },
        hasUnsavedChanges: true,
      }
    case "UPDATE_BULK":
      return {
        ...state,
        dados: { ...state.dados, ...action.patch },
        hasUnsavedChanges: true,
      }
    case "MARK_SAVED":
      return { ...state, hasUnsavedChanges: false }
    case "VISITAR_STEP":
      return { ...state, ultimoStepVisitado: action.step }
    case "RESET":
      return {
        dados: action.dados,
        hasUnsavedChanges: false,
        ultimoStepVisitado: 1,
      }
  }
}

// ============================================
// Validation
// ============================================

export interface StepValidation {
  ok: boolean
  erros: Record<string, string>
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validarStep1(dados: OrcamentoInsert): StepValidation {
  const erros: Record<string, string> = {}
  if (!dados.cliente_nome?.trim()) {
    erros.cliente_nome = "Nome do cliente é obrigatório"
  }
  if (dados.cliente_email && !EMAIL_RE.test(dados.cliente_email)) {
    erros.cliente_email = "Email inválido"
  }
  return { ok: Object.keys(erros).length === 0, erros }
}

export function validarStep2(dados: OrcamentoInsert): StepValidation {
  const erros: Record<string, string> = {}
  if (!dados.obra_endereco?.trim()) {
    erros.obra_endereco = "Endereço da obra é obrigatório"
  }
  if (!dados.obra_cidade?.trim()) {
    erros.obra_cidade = "Cidade é obrigatória"
  }
  if (!dados.projeto_area_m2 || dados.projeto_area_m2 <= 0) {
    erros.projeto_area_m2 = "Área construída deve ser maior que zero"
  }
  if (!dados.projeto_pavimentos || dados.projeto_pavimentos <= 0) {
    erros.projeto_pavimentos = "Pavimentos deve ser pelo menos 1"
  }
  const padroesValidos: PadraoAcabamento[] = ["baixo", "medio", "alto", "altissimo"]
  if (!padroesValidos.includes(dados.projeto_padrao)) {
    erros.projeto_padrao = "Selecione um padrão de acabamento"
  }
  return { ok: Object.keys(erros).length === 0, erros }
}

export function validarStep3(dados: OrcamentoInsert): StepValidation {
  const erros: Record<string, string> = {}
  if (!dados.valor_min || dados.valor_min <= 0) {
    erros.valor_min = "Valor mínimo deve ser maior que zero"
  }
  if (!dados.valor_max || dados.valor_max <= 0) {
    erros.valor_max = "Valor máximo deve ser maior que zero"
  }
  if (dados.valor_min > 0 && dados.valor_max > 0 && dados.valor_min > dados.valor_max) {
    erros.valor_max = "Valor máximo não pode ser menor que o mínimo"
  }
  if (!dados.valor_m2_min || dados.valor_m2_min <= 0) {
    erros.valor_m2_min = "R$/m² mínimo deve ser maior que zero"
  }
  if (!dados.valor_m2_max || dados.valor_m2_max <= 0) {
    erros.valor_m2_max = "R$/m² máximo deve ser maior que zero"
  }
  if (
    dados.valor_m2_min > 0 &&
    dados.valor_m2_max > 0 &&
    dados.valor_m2_min > dados.valor_m2_max
  ) {
    erros.valor_m2_max = "R$/m² máximo não pode ser menor que o mínimo"
  }
  const regimesValidos: RegimeRecomendado[] = [
    "administracao",
    "fechado",
    "pmg",
    "indefinido",
  ]
  if (!regimesValidos.includes(dados.regime_recomendado)) {
    erros.regime_recomendado = "Selecione um regime"
  }
  if (!dados.data_cotacao) {
    erros.data_cotacao = "Data de cotação é obrigatória"
  }
  if (!dados.validade_dias || dados.validade_dias <= 0) {
    erros.validade_dias = "Validade deve ser maior que zero"
  }
  return { ok: Object.keys(erros).length === 0, erros }
}

export function validarStep4(dados: OrcamentoInsert): StepValidation {
  const erros: Record<string, string> = {}
  if (
    !Array.isArray(dados.entrega_categorias_ativas) ||
    dados.entrega_categorias_ativas.length === 0
  ) {
    erros.entrega_categorias_ativas =
      "Mantenha pelo menos uma categoria de entrega selecionada"
  }
  return { ok: Object.keys(erros).length === 0, erros }
}

export function validarTudo(dados: OrcamentoInsert): StepValidation {
  return {
    ok:
      validarStep1(dados).ok &&
      validarStep2(dados).ok &&
      validarStep3(dados).ok &&
      validarStep4(dados).ok,
    erros: {
      ...validarStep1(dados).erros,
      ...validarStep2(dados).erros,
      ...validarStep3(dados).erros,
      ...validarStep4(dados).erros,
    },
  }
}

export function statusDoStep(
  dados: OrcamentoInsert,
  step: StepId,
  ultimoVisitado: StepId
): "vazio" | "valido" | "invalido" {
  const visitado = step <= ultimoVisitado
  if (!visitado) return "vazio"
  const validation =
    step === 1
      ? validarStep1(dados)
      : step === 2
        ? validarStep2(dados)
        : step === 3
          ? validarStep3(dados)
          : step === 4
            ? validarStep4(dados)
            : validarTudo(dados)
  return validation.ok ? "valido" : "invalido"
}

// Helpers de manipulação de listas dinâmicas
export function toggleCardEntrega(
  ativas: CardEntregaId[],
  id: CardEntregaId
): CardEntregaId[] {
  return ativas.includes(id) ? ativas.filter((c) => c !== id) : [...ativas, id]
}

export function condicionantesToStrings(
  extras: CondicionanteExtra[]
): string[] {
  return extras.map((c) => c.texto)
}

export function stringsToCondicionantes(
  textos: string[]
): CondicionanteExtra[] {
  return textos.map((texto) => ({ texto }))
}

export function exclusoesToStrings(extras: ExclusaoExtra[]): string[] {
  return extras.map((e) => e.texto)
}

export function stringsToExclusoes(textos: string[]): ExclusaoExtra[] {
  return textos.map((texto) => ({ texto }))
}
