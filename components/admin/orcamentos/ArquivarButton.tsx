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
  atualizadoEm: string
}

export function ArquivarButton({ orcamentoId, status, atualizadoEm }: Props) {
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
      try {
        const res = ehArquivado
          ? await desarquivarOrcamento(orcamentoId, atualizadoEm)
          : await arquivarOrcamento(orcamentoId, atualizadoEm)
        if (!res.ok) {
          setErro(res.conflito ? "O orçamento mudou. Atualize a página e confira seu estado antes de tentar novamente." : res.erro)
          return
        }
        router.refresh()
      } catch {
        setErro("Não foi possível alterar o orçamento. Tente novamente.")
      }
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
      {erro && <p role="alert" className="text-xs text-red-600">{erro}</p>}
    </div>
  )
}
