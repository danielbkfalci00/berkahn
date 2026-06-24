"use client"

import { useState, useCallback, useRef } from "react"
import { Upload, ImageIcon, Loader2, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Props {
  orcamentoId: string
  initialPreviewUrl?: string | null
}

interface UploadState {
  status: "idle" | "uploading" | "success" | "error"
  previewUrl: string | null
  message: string | null
}

export function HeroUpload({ orcamentoId, initialPreviewUrl }: Props) {
  const [state, setState] = useState<UploadState>({
    status: "idle",
    previewUrl: initialPreviewUrl ?? null,
    message: null,
  })
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const upload = useCallback(
    async (file: File) => {
      setState({ status: "uploading", previewUrl: null, message: null })
      const fd = new FormData()
      fd.append("file", file)
      try {
        const res = await fetch(`/api/admin/orcamentos/${orcamentoId}/hero`, {
          method: "POST",
          body: fd,
        })
        const json = await res.json()
        if (!res.ok) {
          setState({
            status: "error",
            previewUrl: null,
            message: json.error ?? "Falha no upload",
          })
          return
        }
        setState({
          status: "success",
          previewUrl: json.signedUrl,
          message: `Imagem processada (${Math.round(json.sizeBytes / 1024)}KB)`,
        })
      } catch (err) {
        setState({
          status: "error",
          previewUrl: null,
          message: err instanceof Error ? err.message : "Erro inesperado",
        })
      }
    },
    [orcamentoId]
  )

  const onFileSelected = (file: File | null) => {
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setState({
        status: "error",
        previewUrl: null,
        message: "Selecione um arquivo de imagem",
      })
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
        {state.previewUrl && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setState({ status: "idle", previewUrl: null, message: null })
            }
          >
            <X className="h-4 w-4" />
          </Button>
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
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onFileSelected(e.target.files?.[0] ?? null)}
          />
        </button>
      )}

      {state.message && (
        <p
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
