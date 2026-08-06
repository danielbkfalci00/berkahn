import Link from "next/link";
import { AlertCircle, ExternalLink } from "lucide-react";
import { ARTIGO_BADGE } from "@/lib/conteudo/colunas";
import { STATUS_LABEL, divergeDoArtigo, type Pauta } from "@/types/conteudo";
import { cn } from "@/lib/utils";

interface Props {
  pauta: Pauta;
}

/**
 * Estado real do artigo vinculado.
 *
 * O quadro nunca escreve em `posts.status`, então a coluna do card e o estado
 * do artigo podem discordar — card em "Publicado" com artigo em rascunho, por
 * exemplo. Este selo existe para tornar a discordância visível em vez de
 * deixá-la silenciosa: é o preço, e a defesa, de manter as duas coisas
 * separadas.
 */
export function SeloPostVinculado({ pauta }: Props) {
  if (!pauta.artigo) return null;

  const badge = ARTIGO_BADGE[pauta.artigo.status];
  const diverge = divergeDoArtigo(pauta);

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span
        className={cn(
          "rounded px-1.5 py-0.5 text-[11px] font-medium leading-none",
          badge.classe
        )}
      >
        {badge.label}
      </span>

      {diverge && (
        <span
          className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700"
          title={`A trilha Blog está em "${pauta.statusBlog ? STATUS_LABEL[pauta.statusBlog] : "não se aplica"}", mas o artigo está como "${badge.label}" no site.`}
        >
          <AlertCircle className="h-3 w-3" strokeWidth={2} aria-hidden />
          discorda
        </span>
      )}

      <Link
        href={`/admin/posts/${pauta.artigo.id}`}
        className="inline-flex items-center gap-1 rounded text-[11px] text-neutral-500 underline-offset-2 hover:text-neutral-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
      >
        <ExternalLink className="h-3 w-3" strokeWidth={2} aria-hidden />
        artigo
      </Link>
    </div>
  );
}
