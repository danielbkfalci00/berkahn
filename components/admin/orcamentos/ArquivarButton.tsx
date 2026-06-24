"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Archive, ArchiveRestore, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  arquivarOrcamento,
  desarquivarOrcamento,
} from "@/app/admin/orcamentos/actions"
import type { OrcamentoStatus } from "@/types/orcamento-estimativa"

interface Props {
  orcamentoId: string
  status: OrcamentoStatus
}

export function ArquivarButton({ orcamentoId, status }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [erro, setErro] = useState<string | null>(null)

  const ehArquivado = status === "arquivado"

  const handle = () => {
    const msg = ehArquivado
      ? "Desarquivar este orçamento? Status volta para Rascunho."
      : "Arquivar este orçamento? Ele some da lista padrão (filtro pra ver). Pode desarquivar depois."
    if (!window.confirm(msg)) return

    setErro(null)
    startTransition(async () => {
      const res = ehArquivado
        ? await desarquivarOrcamento(orcamentoId)
        : await arquivarOrcamento(orcamentoId)
      if (!res.ok) {
        setErro(res.erro)
        return
      }
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        variant="outline"
        size="sm"
        onClick={handle}
        disabled={pending}
      >
        {pending ? (
          <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
        ) : ehArquivado ? (
          <ArchiveRestore className="h-3.5 w-3.5 mr-1.5" />
        ) : (
          <Archive className="h-3.5 w-3.5 mr-1.5" />
        )}
        {ehArquivado ? "Desarquivar" : "Arquivar"}
      </Button>
      {erro && <p className="text-xs text-red-600">{erro}</p>}
    </div>
  )
}
