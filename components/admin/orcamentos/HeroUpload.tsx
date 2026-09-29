"use client"

import { useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { Upload, ImageIcon, Loader2, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
// Comprime via Canvas pra ficar abaixo do limite de body do Vercel (~4.5MB) e
// do nosso server (10MB). Extraída para lib/imagens/ quando o quadro de
// conteúdo passou a precisar dela — e lá ganhou o fundo branco, que evita
// tarja preta em PNG transparente.
import { comprimirImagem, nomeComprimido } from "@/lib/imagens/comprimir"

interface Props {
  orcamentoId: string
  atualizadoEm: string
  hasImage: boolean
  initialPreviewUrl?: string | null
}

interface UploadState {
  status: "idle" | "uploading" | "success" | "error"
  previewUrl: string | null
  message: string | null
}

export function HeroUpload({ orcamentoId, initialPreviewUrl, atualizadoEm, hasImage }: Props) {
  const router = useRouter()
  const busy = useRef(false)
  const revision = useRef(atualizadoEm)
  const [imageExists, setImageExists] = useState(hasImage)
  const [state, setState] = useState<UploadState>({
    status: "idle",
    previewUrl: initialPreviewUrl ?? null,
    message: null,
  })
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const upload = useCallback(
    async (file: File) => {
      if (busy.current) return
      busy.current = true
      setState((current) => ({ ...current, status: "uploading", message: null }))
      try {
        const payload = await comprimirImagem(file)
        const fd = new FormData()
        fd.append("file", payload, nomeComprimido(file.name))

        const res = await fetch(`/api/admin/orcamentos/${orcamentoId}/hero`, {
          method: "POST",
          headers: { "If-Match": `"${revision.current}"` },
          body: fd,
        })
        // Server pode retornar texto plain em erros de infra (413 do Vercel etc)
        const texto = await res.text()
        let json: {
          error?: string
          signedUrl?: string
          sizeBytes?: number
          path?: string
          atualizado_em?: string
        } = {}
        try {
          json = JSON.parse(texto)
        } catch {
          // resposta não-JSON (Vercel proxy, gateway, etc)
        }
        if (!res.ok) {
          const msg =
            json.error ??
            (texto && texto.length < 200 ? texto : `HTTP ${res.status}`)
          setState((current) => ({ ...current, status: "error", message: msg }))
          return
        }
        if (json.atualizado_em) revision.current = json.atualizado_em
        setImageExists(true)
        setState({
          status: "success",
          previewUrl: json.signedUrl ?? null,
          message: `Imagem processada (${Math.round((json.sizeBytes ?? 0) / 1024)}KB)`,
        })
        router.refresh()
      } catch (err) {
        setState((current) => ({
          ...current,
          status: "error",
          message: err instanceof Error ? err.message : "Erro inesperado",
        }))
      } finally {
        busy.current = false
        if (inputRef.current) inputRef.current.value = ""
      }
    },
    [orcamentoId, router]
  )

  const remove = async () => {
    if (busy.current || !window.confirm("Remover a foto da capa deste orçamento? Será necessário gerar o PDF novamente.")) return
    busy.current = true
    setState((current) => ({ ...current, status: "uploading", message: null }))
    try {
      const response = await fetch(`/api/admin/orcamentos/${orcamentoId}/hero`, { method: "DELETE", headers: { "If-Match": `"${revision.current}"` } })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? "Não foi possível remover a capa.")
      revision.current = result.atualizado_em
      setImageExists(false)
      setState({ status: "success", previewUrl: null, message: "Capa removida. Gere o PDF atualizado antes de enviar." })
      router.refresh()
    } catch (error) {
      setState((current) => ({ ...current, status: "error", message: error instanceof Error ? error.message : "Não foi possível remover a capa." }))
    } finally {
      busy.current = false
    }
  }

  const onFileSelected = (file: File | null) => {
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setState((current) => ({
        ...current,
        status: "error",
        message: "Selecione um arquivo de imagem",
      }))
      return
    }
    void upload(file)
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">Foto da capa</h3>
          <p className="text-xs text-neutral-500">
            Recomendado: 1920×1080, até 10MB. É processada automaticamente.
          </p>
        </div>
        {imageExists && (
          <div className="flex items-center gap-1">
          <Button type="button" variant="ghost" size="sm" disabled={state.status === "uploading"} onClick={() => inputRef.current?.click()}>
            Trocar foto
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label="Remover foto da capa"
            disabled={state.status === "uploading"}
            onClick={remove}
          >
            <X className="h-4 w-4" />
          </Button>
          </div>
        )}
      </div>

      {state.previewUrl ? (
        <div className="relative aspect-video overflow-hidden rounded border border-neutral-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={state.previewUrl}
            alt="Preview hero"
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <button
          type="button"
          disabled={state.status === "uploading"}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            onFileSelected(e.dataTransfer.files?.[0] ?? null)
          }}
          className={`flex aspect-video w-full flex-col items-center justify-center gap-2 rounded border-2 border-dashed transition-colors ${
            dragOver
              ? "border-neutral-900 bg-neutral-50"
              : "border-neutral-300 hover:border-neutral-500"
          }`}
        >
          {state.status === "uploading" ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
              <span className="text-sm text-neutral-500">Processando...</span>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-neutral-400" />
              <span className="text-sm font-medium text-neutral-700">
                Arraste a foto ou clique para selecionar
              </span>
              <span className="text-xs text-neutral-400">
                JPEG, PNG ou WebP
              </span>
            </>
          )}
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" disabled={state.status === "uploading"} onChange={(e) => onFileSelected(e.target.files?.[0] ?? null)} />
      {state.status === "uploading" && state.previewUrl && <p role="status" className="mt-3 text-xs text-neutral-500">Processando capa...</p>}

      {state.message && (
        <p
          role={state.status === "error" ? "alert" : "status"}
          className={`mt-3 text-xs ${
            state.status === "error" ? "text-red-600" : "text-neutral-500"
          }`}
        >
          {state.status === "success" && <ImageIcon className="inline h-3 w-3 mr-1" />}
          {state.message}
        </p>
      )}
    </Card>
  )
}
