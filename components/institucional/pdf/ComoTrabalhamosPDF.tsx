import { COMO_TRABALHAMOS, EXECUTION_PHASES, optImg } from "@/lib/institucional-data";
import { RunHead, Eyebrow, Footer, PHOTO_BG } from "@/components/institucional/pdf/chrome";

// Texto das 4 fases conforme o design aprovado (Berkahn Institucional.dc.html).
// A imagem de cada fase vem de EXECUTION_PHASES (mesma ordem: pré-obra → acabamentos).
const FASES = [
  {
    numero: "01",
    title: "Pré Obra",
    duracao: "2 a 3 semanas",
    description: "Desenvolvemos e acompanhamos todos os projetos da obra, junto da estruturação técnica e financeira do empreendimento.",
  },
  {
    numero: "02",
    title: "Terraplanagem, Fundação e Superestrutura",
    duracao: "4 a 6 semanas",
    description: "Implantação física do empreendimento com preparação do terreno, fundações e estrutura principal.",
  },
  {
    numero: "03",
    title: "Estrutura, Vedação e Instalações",
    duracao: "6 a 8 semanas",
    description: "Fechamento da edificação com vedações, cobertura e execução completa de sistemas prediais.",
  },
  {
    numero: "04",
    title: "Acabamentos",
    duracao: "3 a 4 semanas",
    description: "Finalização da obra com revestimentos, pinturas e instalação de todos os elementos de acabamento.",
  },
];

// Página 6 — Como trabalhamos. Quatro fases com foto, prazo e descrição.
export function ComoTrabalhamosPDF() {
  const c = COMO_TRABALHAMOS;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#F4F2EC",
        padding: "18mm 20mm",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <RunHead label="Como Trabalhamos" />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "16mm 0" }}>
        <Eyebrow>Como Trabalhamos</Eyebrow>
        <h2 style={{ fontSize: 46, fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.02, color: "#1A1A1A", margin: "0 0 20px" }}>
          {c.headline}
        </h2>
        <p style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.55, color: "#666", margin: "0 0 40px", maxWidth: "60ch" }}>
          {c.intro}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 22 }}>
          {FASES.map((fase, i) => (
            <div key={fase.numero} style={{ display: "flex", flexDirection: "column" }}>
              <figure style={{ margin: "0 0 16px", aspectRatio: "3 / 4", background: PHOTO_BG, position: "relative", overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={optImg(EXECUTION_PHASES[i].images.primary, 384)}
                  alt={EXECUTION_PHASES[i].images.primaryAlt}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                />
              </figure>
              <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em", color: "#77736b", lineHeight: 1, marginBottom: 10 }}>
                {fase.numero}
              </div>
              <h3 style={{ fontSize: 13.5, fontWeight: 700, color: "#1A1A1A", margin: "0 0 4px", lineHeight: 1.2 }}>{fase.title}</h3>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#666", marginBottom: 10 }}>{fase.duracao}</div>
              <p style={{ fontSize: 10.5, lineHeight: 1.55, color: "#666", margin: 0 }}>{fase.description}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer page="06 / 09" line="#d9d7cf" />
    </div>
  );
}
