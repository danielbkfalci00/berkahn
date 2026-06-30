import {
  Hammer,
  ShoppingCart,
  Users,
  CalendarDays,
  FileText,
  ShieldCheck,
  HardHat,
  Warehouse,
  BadgeCheck,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { CARDS_ENTREGA } from "@/lib/orcamento-estimativa-data"
import type { CardEntregaId } from "@/types/orcamento-estimativa"

interface Props {
  categoriasAtivas: CardEntregaId[]
}

const ICON_MAP: Record<string, LucideIcon> = {
  Hammer,
  ShoppingCart,
  Users,
  CalendarDays,
  FileText,
  ShieldCheck,
  HardHat,
  Warehouse,
  BadgeCheck,
}

export function OQueEntregamos({ categoriasAtivas }: Props) {
  const cards = CARDS_ENTREGA.filter((c) =>
    categoriasAtivas.includes(c.id)
  )

  return (
    <section className="est-secao">
      <div className="est-secao-header">
        <div className="est-numero-secao">03</div>
        <h2
          className="est-display"
          style={{ fontSize: "36pt", margin: "12px 0 0", lineHeight: 1.1 }}
        >
          O que entregamos
        </h2>
        <div className="est-divisor-champagne" />
      </div>

      <p
        style={{
          fontSize: "11pt",
          lineHeight: 1.7,
          margin: "0 0 32px",
          maxWidth: 620,
          color: "var(--c-soft-gray)",
        }}
      >
        Ao contratar a Berkahn, você não está comprando apenas mão de obra: está
        contratando uma estrutura de gestão completa, que assume a responsabilidade
        técnica, administrativa e financeira de levar sua obra do canteiro à
        entrega das chaves.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          marginTop: 8,
        }}
      >
        {cards.map((card) => {
          const Icon = ICON_MAP[card.icone] ?? FileText
          return (
            <div
              key={card.id}
              className="est-card"
              style={{
                background: "var(--c-off-white)",
                padding: "16px 14px",
                borderRadius: 2,
                borderTop: "2px solid var(--c-champagne)",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                minHeight: 160,
              }}
            >
              <Icon
                size={28}
                strokeWidth={1.5}
                color="var(--c-charcoal)"
              />
              <h3
                style={{
                  fontSize: "11.5pt",
                  fontWeight: 700,
                  margin: 0,
                  lineHeight: 1.25,
                  letterSpacing: "-0.005em",
                }}
              >
                {card.titulo}
              </h3>
              <p
                style={{
                  fontSize: "9.5pt",
                  lineHeight: 1.55,
                  margin: 0,
                  color: "var(--c-soft-gray)",
                }}
              >
                {card.descricao}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
