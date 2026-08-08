import { PORTFOLIO_INSTITUCIONAL, presentationProjects, optImg } from "@/lib/institucional-data";
import { RunHead, Eyebrow, Footer, PHOTO_BG } from "@/components/institucional/pdf/chrome";

// Página 7 — Portfólio (página escura). Três obras com foto e ficha técnica.
export function PortfolioPDF() {
  const p = PORTFOLIO_INSTITUCIONAL;
  const obras = presentationProjects.slice(0, 3);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#1A1A1A",
        padding: "18mm 20mm",
        display: "flex",
        flexDirection: "column",
        color: "#fff",
      }}
    >
      <RunHead label="Portfólio" dark />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "14mm 0" }}>
        <Eyebrow dark>Portfólio</Eyebrow>
        <h2 style={{ fontSize: 46, fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.02, color: "#fff", margin: "0 0 44px" }}>
          {p.headline}
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 26 }}>
          {obras.map((obra) => {
            const specs: [string, string][] = [
              ["Local", obra.location],
              ["Ano", obra.year],
              ["Área", obra.area],
              ["Sistema", obra.system],
            ];
            return (
              <div key={obra.number}>
                <figure style={{ margin: "0 0 18px", aspectRatio: "4 / 5", background: PHOTO_BG, position: "relative", overflow: "hidden" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={optImg(obra.images[0], 640)}
                    alt={obra.title}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </figure>
                <div style={{ fontSize: 9, fontWeight: 800, color: "#aaa", marginBottom: 8 }}>{obra.number}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: "0 0 16px" }}>{obra.title}</h3>
                <div style={{ borderTop: "1px solid #3a3a3a" }}>
                  {specs.map(([k, v], j) => (
                    <div
                      key={k}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 8,
                        padding: "7px 0",
                        borderBottom: j < specs.length - 1 ? "1px solid #2a2a2a" : undefined,
                      }}
                    >
                      <span style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "#aaa", flexShrink: 0 }}>{k}</span>
                      <span style={{ fontSize: 10, color: "#ccc", textAlign: "right" }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Footer page="07 / 09" dark />
    </div>
  );
}
