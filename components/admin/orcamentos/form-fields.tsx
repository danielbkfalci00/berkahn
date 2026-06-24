"use client"

import { useState, useEffect, useCallback } from "react"
import { X, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// ============================================
// CurrencyField — input com máscara BRL
// ============================================

function formatBRL(valor: number | null | undefined): string {
  if (valor === null || valor === undefined || Number.isNaN(valor)) return ""
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valor)
}

function parseBRL(str: string): number {
  const onlyDigits = str.replace(/\D/g, "")
  if (!onlyDigits) return 0
  return Number(onlyDigits)
}

interface CurrencyFieldProps {
  id?: string
  label: string
  value: number
  onChange: (valor: number) => void
  required?: boolean
  erro?: string | null
  className?: string
  hint?: string
}

export function CurrencyField({
  id,
  label,
  value,
  onChange,
  required,
  erro,
  className,
  hint,
}: CurrencyFieldProps) {
  const [display, setDisplay] = useState(formatBRL(value))

  useEffect(() => {
    setDisplay(formatBRL(value))
  }, [value])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const parsed = parseBRL(e.target.value)
      onChange(parsed)
      setDisplay(formatBRL(parsed))
    },
    [onChange]
  )

  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500 pointer-events-none">
          R$
        </span>
        <Input
          id={id}
          inputMode="numeric"
          value={display}
          onChange={handleChange}
          className={cn("pl-9 tabular-nums", erro && "border-red-500")}
          placeholder="0"
        />
      </div>
      {hint && !erro && (
        <p className="text-xs text-neutral-400">{hint}</p>
      )}
      {erro && <p className="text-xs text-red-600">{erro}</p>}
    </div>
  )
}

// ============================================
// IntegerField — input para inteiros
// ============================================

interface IntegerFieldProps {
  id?: string
  label: string
  value: number
  onChange: (valor: number) => void
  required?: boolean
  erro?: string | null
  className?: string
  min?: number
  suffix?: string
  hint?: string
}

export function IntegerField({
  id,
  label,
  value,
  onChange,
  required,
  erro,
  className,
  min = 0,
  suffix,
  hint,
}: IntegerFieldProps) {
  const [display, setDisplay] = useState(value === 0 ? "" : String(value))

  useEffect(() => {
    setDisplay(value === 0 ? "" : String(value))
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyDigits = e.target.value.replace(/\D/g, "")
    setDisplay(onlyDigits)
    const num = onlyDigits ? Number(onlyDigits) : 0
    onChange(num >= min ? num : min)
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      <div className="relative">
        <Input
          id={id}
          inputMode="numeric"
          value={display}
          onChange={handleChange}
          className={cn("tabular-nums", suffix && "pr-12", erro && "border-red-500")}
          placeholder="0"
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500 pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {hint && !erro && (
        <p className="text-xs text-neutral-400">{hint}</p>
      )}
      {erro && <p className="text-xs text-red-600">{erro}</p>}
    </div>
  )
}

// ============================================
// RadioPills — opções como botões selecionáveis
// ============================================

interface RadioOption<T extends string> {
  id: T
  label: string
  descricao?: string
}

interface RadioPillsProps<T extends string> {
  label: string
  options: readonly RadioOption<T>[]
  value: T
  onChange: (valor: T) => void
  required?: boolean
  erro?: string | null
  className?: string
}

export function RadioPills<T extends string>({
  label,
  options,
  value,
  onChange,
  required,
  erro,
  className,
}: RadioPillsProps<T>) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label>
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((opt) => {
          const ativo = opt.id === value
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={cn(
                "rounded-md border px-3 py-2.5 text-left transition-all",
                ativo
                  ? "border-neutral-900 bg-neutral-900 text-white shadow-sm"
                  : "border-neutral-200 hover:border-neutral-400 bg-white"
              )}
            >
              <div className="text-sm font-medium">{opt.label}</div>
              {opt.descricao && (
                <div
                  className={cn(
                    "text-xs mt-0.5",
                    ativo ? "text-white/70" : "text-neutral-500"
                  )}
                >
                  {opt.descricao}
                </div>
              )}
            </button>
          )
        })}
      </div>
      {erro && <p className="text-xs text-red-600">{erro}</p>}
    </div>
  )
}

// ============================================
// ChipsInput — array de strings com add/remove
// ============================================

interface ChipsInputProps {
  label: string
  values: string[]
  onChange: (next: string[]) => void
  placeholder?: string
  className?: string
  hint?: string
}

export function ChipsInput({
  label,
  values,
  onChange,
  placeholder = "Adicionar item e pressionar Enter",
  className,
  hint,
}: ChipsInputProps) {
  const [draft, setDraft] = useState("")

  const adicionar = () => {
    const texto = draft.trim()
    if (!texto) return
    if (values.includes(texto)) {
      setDraft("")
      return
    }
    onChange([...values, texto])
    setDraft("")
  }

  const remover = (idx: number) => {
    onChange(values.filter((_, i) => i !== idx))
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      adicionar()
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={adicionar}
          disabled={!draft.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {hint && (
        <p className="text-xs text-neutral-400">{hint}</p>
      )}
      {values.length > 0 && (
        <ul className="space-y-1.5">
          {values.map((v, i) => (
            <li
              key={`${v}-${i}`}
              className="flex items-start gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm"
            >
              <span className="flex-1">{v}</span>
              <button
                type="button"
                onClick={() => remover(i)}
                className="text-neutral-400 hover:text-red-600 transition-colors flex-shrink-0"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ============================================
// TextField — wrapper simples com label + erro
// ============================================

interface TextFieldProps {
  id?: string
  label: string
  value: string
  onChange: (valor: string) => void
  required?: boolean
  erro?: string | null
  className?: string
  placeholder?: string
  type?: "text" | "email" | "tel" | "date"
  hint?: string
}

export function TextField({
  id,
  label,
  value,
  onChange,
  required,
  erro,
  className,
  placeholder,
  type = "text",
  hint,
}: TextFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(erro && "border-red-500")}
      />
      {hint && !erro && (
        <p className="text-xs text-neutral-400">{hint}</p>
      )}
      {erro && <p className="text-xs text-red-600">{erro}</p>}
    </div>
  )
}
