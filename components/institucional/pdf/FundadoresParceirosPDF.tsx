import { FUNDADORES, PARCEIROS, optImg } from "@/lib/institucional-data";
import styles from "@/app/institucional/pdf/institucional.module.css";

// Página 8 — Fundadores + parceiros. Retratos editoriais + fileira de logos.
export function FundadoresParceirosPDF() {
  return (
    <div className={`${styles.page} ${styles.light}`}>
      <div className={styles.frame}>
        <div className={styles.runHead}>
          <span className={styles.eyebrow}>Berkahn · Apresentação Institucional</span>
          <span className={styles.eyebrow}>08 / 09</span>
        </div>

        {/* Cabeçalho */}
        <div style={{ paddingTop: 30 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 12 }}>
            <span className={styles.numeralKicker}>08</span>
            <span className={styles.eyebrow}>Fundadores</span>
          </div>
          <h2 className={styles.h2}>Experiência que constrói confiança</h2>
        </div>

        {/* Fundadores */}
        <div className={styles.grow} style={{ display: "flex", gap: 32, paddingTop: 30 }}>
          {FUNDADORES.map((f) => (
            <div key={f.name} style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <figure style={{ margin: 0, width: "100%", height: 420, flexShrink: 0, position: "relative", overflow: "hidden", borderRadius: 2, marginBottom: 16 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={optImg(f.image, 640)} alt={f.name} className={styles.imgCover} style={{ position: "absolute", inset: 0, objectPosition: "top" }} />
              </figure>
              <h3 className={styles.display} style={{ fontSize: 21, marginBottom: 3 }}>{f.name}</h3>
              <span className={styles.eyebrow} style={{ marginBottom: 12 }}>{f.role}</span>
              <p
                className={`${styles.body} ${styles.bodySoft}`}
                style={{
                  fontSize: 10,
                  lineHeight: 1.6,
                  display: "-webkit-box",
                  WebkitLineClamp: 5,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {f.bio}
              </p>
            </div>
          ))}
        </div>

        {/* Parceiros */}
        <div style={{ marginTop: 26 }}>
          <div className={styles.hairline} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 18, gap: 24 }}>
            <span className={styles.eyebrow} style={{ flexShrink: 0 }}>Marcas Parceiras</span>
            <div style={{ display: "flex", alignItems: "center", gap: 40, flex: 1, justifyContent: "flex-end" }}>
              {PARCEIROS.map((parc) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={parc.name}
                  src={optImg(parc.logo, 256)}
                  alt={parc.name}
                  style={{ height: 26, width: "auto", maxWidth: 120, objectFit: "contain", opacity: 0.75 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
