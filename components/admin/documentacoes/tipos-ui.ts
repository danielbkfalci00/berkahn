import { Check, HelpCircle, MessageSquare, X, type LucideIcon } from "lucide-react";
import type { TipoComentario } from "@/types/comentario";

/**
 * Aparência de cada posição. As cores reusam a paleta semântica já em uso nos
 * badges de status dos posts (components/admin/posts/PostsTable.tsx), para o
 * admin não ganhar um segundo vocabulário de cor.
 */
export const APARENCIA_TIPO: Record<
  TipoComentario,
  { rotulo: string; icone: LucideIcon; badge: string; ponto: string }
> = {
  comentario: {
    rotulo: "Comentário",
    icone: MessageSquare,
    badge: "bg-neutral-100 text-neutral-600",
    ponto: "bg-neutral-400",
  },
  duvida: {
    rotulo: "Dúvida",
    icone: HelpCircle,
    badge: "bg-amber-100 text-amber-700",
    ponto: "bg-amber-500",
  },
  aprovacao: {
    rotulo: "Aprovo",
    icone: Check,
    badge: "bg-green-100 text-green-700",
    ponto: "bg-green-500",
  },
  reprovacao: {
    rotulo: "Reprovo",
    icone: X,
    badge: "bg-red-100 text-red-700",
    ponto: "bg-red-500",
  },
};

export const ORDEM_TIPOS: TipoComentario[] = [
  "comentario",
  "duvida",
  "aprovacao",
  "reprovacao",
];

/** "há 3 min", "há 2 h", "ontem" — o projeto não tem date-fns nem dayjs. */
export function tempoRelativo(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const seg = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seg < 60) return "agora";
  if (seg < 3600) return `há ${Math.floor(seg / 60)} min`;
  if (seg < 86400) return `há ${Math.floor(seg / 3600)} h`;
  if (seg < 172800) return "ontem";
  if (seg < 604800) return `há ${Math.floor(seg / 86400)} dias`;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}
