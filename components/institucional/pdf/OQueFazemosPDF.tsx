import { O_QUE_FAZEMOS } from "@/lib/institucional-data";
import { RunHead, Eyebrow, Footer } from "@/components/institucional/pdf/chrome";

// Página 3 — O que fazemos. Quatro serviços numerados em grade 2×2.
export function OQueFazemosPDF() {
  const s = O_QUE_FAZEMOS;

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
      <RunHead label="O Que Fazemos" />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "16mm 0" }}>
        <Eyebrow>O Que Fazemos</Eyebrow>
        <h2 style={{ fontSize: 46, fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.02, color: "#1A1A1A", margin: "0 0 20px" }}>
          {s.headline}
        </h2>
        <p style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.55, color: "#666", margin: "0 0 40px", maxWidth: "60ch" }}>
          {s.intro}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "1px solid #1A1A1A" }}>
          {s.servicos.map((serv, i) => {
            const col = i % 2;
            const row = Math.floor(i / 2);
            return (
              <div
                key={serv.numero}
                style={{
                  padding: col === 0 ? "30px 34px 30px 0" : "30px 0 30px 34px",
                  borderRight: col === 0 ? "1px solid #d9d7cf" : undefined,
                  borderBottom: row === 0 ? "1px solid #d9d7cf" : undefined,
                }}
              >
                <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.02em", color: "#c9c6bc", lineHeight: 1, marginBottom: 16 }}>
                  {serv.numero}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 600, color: "#1A1A1A", margin: "0 0 10px" }}>{serv.title}</h3>
                <p style={{ fontSize: 12, fontWeight: 400, lineHeight: 1.6, color: "#666", margin: 0 }}>{serv.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      <Footer page="03 / 09" line="#d9d7cf" />
    </div>
  );
}
