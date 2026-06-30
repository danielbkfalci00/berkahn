import { LOGOS, TAGLINE } from "@/lib/orcamento-estimativa-data"
import { CONTATOS } from "@/lib/orcamento-data"
import { EstimativaImage } from "./EstimativaImage"

interface Props {
  responsavelTecnico: string | null
}

export function ContatoFinal({ responsavelTecnico }: Props) {
  return (
    <section
      className="est-secao est-secao-fundo-escuro est-secao-quebra-antes"
      style={{
        minHeight: "270mm",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LOGOS.claro}
          alt="Berkahn"
          style={{ height: 36, width: "auto", objectFit: "contain" }}
        />
      </div>

      <div style={{ maxWidth: "78%" }}>
        <div
          className="est-eyebrow"
          style={{ color: "rgba(255,255,255,0.7)", marginBottom: 16 }}
        >
          Encerramento
        </div>
        <h2
          className="est-display"
          style={{
            fontSize: "48pt",
            lineHeight: 1.05,
            margin: 0,
            fontWeight: 700,
            color: "#fff",
          }}
        >
          {TAGLINE}
        </h2>
        <div
          className="est-divisor-champagne"
          style={{ marginTop: 32, marginBottom: 24 }}
        />
        <p
          style={{
            fontSize: "12pt",
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.8)",
            maxWidth: 520,
            margin: 0,
          }}
        >
          A Berkahn permanece à disposição para esclarecer qualquer ponto desta
          estimativa preliminar e avançar para a próxima etapa do empreendimento.
        </p>
      </div>

      <div style={{ margin: "0 0 32px" }}>
        <EstimativaImage
          src="/images/empresa/segunda-imagem.webp"
          alt="Berkahn — construção em steel frame"
          aspect="16:9"
          rounded={false}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 56,
          paddingTop: 40,
          borderTop: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <div>
          <div
            className="est-eyebrow"
            style={{ color: "rgba(255,255,255,0.6)", marginBottom: 16 }}
          >
            Responsável técnico
          </div>
          <div
            style={{
              fontSize: "14pt",
              fontWeight: 600,
              color: "#fff",
              marginBottom: 24,
            }}
          >
            {responsavelTecnico ?? "Berkahn"}
          </div>
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.2)",
              paddingTop: 12,
              marginTop: 64,
              fontSize: "9pt",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Assinatura
          </div>
        </div>

        <div>
          <div
            className="est-eyebrow"
            style={{ color: "rgba(255,255,255,0.6)", marginBottom: 16 }}
          >
            Contato
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              fontSize: "10.5pt",
              color: "rgba(255,255,255,0.85)",
              lineHeight: 1.5,
            }}
          >
            <div>{CONTATOS.email}</div>
            <div>{CONTATOS.telefone}</div>
            <div>{CONTATOS.endereco}</div>
            <div style={{ fontSize: "9pt", opacity: 0.6, marginTop: 6 }}>
              CNPJ {CONTATOS.cnpj}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
