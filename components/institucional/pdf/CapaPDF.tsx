import { INSTITUCIONAL_CAPA, optImg } from "@/lib/institucional-data";

// Página 1 — Capa. Foto de fachada full-bleed + gradiente + título grande.
export function CapaPDF() {
  const c = INSTITUCIONAL_CAPA;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background: "#1A1A1A" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={optImg(c.heroImage, 1080, 70)}
        alt=""
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(10,10,10,0.72) 0%, rgba(10,10,10,0.35) 42%, rgba(10,10,10,0.82) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: "20mm",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          color: "#fff",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: "0.22em" }}>BERKAHN</span>
          <span
            style={{
              fontSize: 9.5,
              fontWeight: 500,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "#cfcdc6",
            }}
          >
            {c.label}
          </span>
        </div>

        <div style={{ marginBottom: "8mm" }}>
          <div style={{ width: 52, height: 1.5, background: "#fff", marginBottom: 22 }} />
          <h1 style={{ fontSize: 62, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.0, margin: 0, maxWidth: "15ch" }}>
            {c.headline}
          </h1>
          <p style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.55, color: "#d8d6ce", margin: "26px 0 0", maxWidth: "52ch" }}>
            {c.subtitle}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid rgba(255,255,255,0.22)",
            paddingTop: 16,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.22em" }}>BERKAHN</span>
          <span style={{ fontSize: 16, fontWeight: 300, letterSpacing: "0.02em", color: "#d8d6ce" }}>{c.tagline}</span>
        </div>
      </div>
    </div>
  );
}
