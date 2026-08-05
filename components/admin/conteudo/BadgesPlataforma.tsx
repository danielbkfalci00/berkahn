import { PLATAFORMA_LABEL, type Plataforma } from "@/types/conteudo";
import { cn } from "@/lib/utils";

/** Tons das pílulas do Notion de onde o quadro veio: blog em terroso, LinkedIn em azul. */
const ESTILO: Record<Plataforma, string> = {
  blog: "bg-amber-50 text-amber-800 ring-amber-200/70",
  linkedin: "bg-sky-50 text-sky-800 ring-sky-200/70",
};

interface Props {
  plataformas: Plataforma[];
  className?: string;
}

export function BadgesPlataforma({ plataformas, className }: Props) {
  if (plataformas.length === 0) return null;

  return (
    <ul className={cn("flex flex-wrap items-center gap-1", className)}>
      {plataformas.map((p) => (
        <li
          key={p}
          className={cn(
            "rounded px-1.5 py-0.5 text-[11px] font-medium leading-none ring-1 ring-inset",
            ESTILO[p]
          )}
        >
          {PLATAFORMA_LABEL[p]}
        </li>
      ))}
    </ul>
  );
}
