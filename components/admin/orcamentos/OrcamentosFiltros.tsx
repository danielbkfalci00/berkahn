"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

export type StatusFiltro =
  | "ativos"
  | "rascunho"
  | "finalizado"
  | "arquivado"
  | "todos"

interface Props {
  statusAtivo: StatusFiltro
  qAtivo: string
  contagens: Record<StatusFiltro, number>
}

const CHIPS: { id: StatusFiltro; label: string }[] = [
  { id: "ativos", label: "Ativos" },
  { id: "rascunho", label: "Rascunhos" },
  { id: "finalizado", label: "Finalizados" },
  { id: "arquivado", label: "Arquivados" },
  { id: "todos", label: "Todos" },
]

export function OrcamentosFiltros({ statusAtivo, qAtivo, contagens }: Props) {
  const router = useRouter()
  const [q, setQ] = useState(qAtivo)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const aplicar = useCallback(
    (novoStatus: StatusFiltro, novoQ: string) => {
      const params = new URLSearchParams()
      if (novoStatus !== "ativos") params.set("status", novoStatus)
      if (novoQ.trim()) params.set("q", novoQ.trim())
      const qs = params.toString()
      router.replace(qs ? `/admin/orcamentos?${qs}` : "/admin/orcamentos")
    },
    [router]
  )

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (q === qAtivo) return
    debounceRef.current = setTimeout(() => {
      aplicar(statusAtivo, q)
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [q, qAtivo, statusAtivo, aplicar])

  const trocarStatus = (id: StatusFiltro) => {
    if (id === statusAtivo) return
    aplicar(id, q)
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Buscar por cliente..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full rounded-md border border-neutral-200 bg-white pl-9 pr-9 py-2 text-sm placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
        />
        {q && (
          <button
            type="button"
            onClick={() => setQ("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-900"
            aria-label="Limpar busca"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {CHIPS.map((chip) => {
          const ativo = chip.id === statusAtivo
          const count = contagens[chip.id]
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => trocarStatus(chip.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                ativo
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              )}
            >
              {chip.label}
              <span
                className={cn(
                  "tabular-nums",
                  ativo ? "text-white/70" : "text-neutral-500"
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
