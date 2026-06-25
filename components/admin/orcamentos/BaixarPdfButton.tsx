"use client"

import { useState } from "react"
import { Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  pdfUrl: string
  filename: string
}

export function BaixarPdfButton({ pdfUrl, filename }: Props) {
  const [downloading, setDownloading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const baixar = async () => {
    setErro(null)
    setDownloading(true)
    try {
      const res = await fetch(pdfUrl)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const blob = await res.blob()
      const objectUrl = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = objectUrl
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Falha ao baixar")
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="space-y-1">
      <Button variant="outline" size="sm" onClick={baixar} disabled={downloading}>
        {downloading ? (
          <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
        ) : (
          <Download className="h-3.5 w-3.5 mr-1.5" />
        )}
        Baixar PDF
      </Button>
      {erro && <p className="text-xs text-red-600">{erro}</p>}
    </div>
  )
}
