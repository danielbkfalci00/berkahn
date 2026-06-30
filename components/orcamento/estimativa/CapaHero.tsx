import { LOGOS, TAGLINE, NATUREZA_RODAPE } from "@/lib/orcamento-estimativa-data"

interface Props {
  clienteNome: string
  numero: string
  heroUrl: string
  obraCidade: string
  dataElaboracao: string
  validadeDias: number
}

function formatarData(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number)
  const data = new Date(y, (m ?? 1) - 1, d ?? 1)
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

export function CapaHero({
  clienteNome,
  numero,
  heroUrl,
  obraCidade,
  dataElaboracao,
  validadeDias,
}: Props) {
  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "270mm",
        color: "#fff",
        overflow: "hidden",
        pageBreakAfter: "always",
        breakAfter: "page",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={heroUrl}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(0.45)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      <div
        style={{
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 72px",
        }}
      >
        {/* Logo topo */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOGOS.claro}
            alt="Berkahn"
            style={{ height: 36, width: "auto", objectFit: "contain" }}
          />
          <div
            className="est-eyebrow"
            style={{ color: "rgba(255,255,255,0.7)", fontSize: 9 }}
          >
            {numero}
          </div>
        </div>

        {/* Bloco central */}
        <div style={{ maxWidth: "78%" }}>
          <div
            className="est-eyebrow"
            style={{ color: "rgba(255,255,255,0.7)", marginBottom: 16 }}
          >
            Apresentação & Estimativa Preliminar
          </div>
          <h1
            className="est-display"
            style={{
              fontSize: "56pt",
              lineHeight: 1.05,
              margin: 0,
              fontWeight: 700,
            }}
          >
            {clienteNome}
          </h1>
          <div className="est-divisor-champagne" style={{ marginTop: 32, marginBottom: 24 }} />
          <p
            style={{
              fontSize: "13pt",
              lineHeight: 1.55,
              maxWidth: "520pt",
              opacity: 0.85,
              margin: 0,
            }}
          >
            Construção de residência unifamiliar em {obraCidade}.
          </p>
        </div>

        {/* Rodapé */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: "9pt",
            color: "rgba(255,255,255,0.7)",
            gap: 32,
          }}
        >
          <div style={{ maxWidth: "60%" }}>
            <div style={{ marginBottom: 4 }}>
              Data de elaboração: {formatarData(dataElaboracao)}
            </div>
            <div style={{ marginBottom: 12 }}>
              Validade: {validadeDias} dias corridos a partir da data acima
            </div>
            <div style={{ fontSize: "8pt", opacity: 0.7 }}>{NATUREZA_RODAPE}</div>
          </div>
          <div
            className="est-display"
            style={{ fontSize: "11pt", color: "#fff", opacity: 0.9 }}
          >
            {TAGLINE}
          </div>
        </div>
      </div>
    </section>
  )
}
