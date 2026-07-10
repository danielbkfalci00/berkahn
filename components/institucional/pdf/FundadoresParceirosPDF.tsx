import { FUNDADORES, PARCEIROS, optImg } from "@/lib/institucional-data";
import styles from "@/app/institucional/pdf/institucional.module.css";

// Página 8 — Fundadores + parceiros. Retratos hard-edge + faixa de logos mono.
export function FundadoresParceirosPDF() {
  return (
    <div className={`${styles.page} ${styles.light}`}>
      <span className={`${styles.corner} ${styles.cTL}`} />
      <span className={`${styles.corner} ${styles.cBR}`} />
      <div className={styles.frame}>
        <div className={styles.runHead}>
          <span className={styles.mono} style={{ fontWeight: 700 }}>BERKAHN — FUNDADORES</span>
          <span className={styles.mono}>FOLHA 08/09</span>
        </div>

        <div style={{ paddingTop: 24 }}>
          <span className={styles.sectionTag} style={{ marginBottom: 12 }}>
            <span className={styles.tagBox}>S.08</span> FUNDADORES
          </span>
          <h2 className={styles.display} style={{ fontSize: 40, marginTop: 12 }}>Experiência que<br />constrói confiança</h2>
        </div>

        <div className={styles.grow} style={{ display: "flex", gap: 26, paddingTop: 24 }}>
          {FUNDADORES.map((f, i) => (
            <div key={f.name} style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <figure style={{ margin: 0, width: "100%", height: 415, flexShrink: 0, position: "relative", overflow: "hidden", marginBottom: 14 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={optImg(f.image, 640)} alt={f.name} className={styles.imgCover} style={{ position: "absolute", inset: 0, objectPosition: "top" }} />
                <span className={styles.mono} style={{ position: "absolute", top: 8, left: 8, background: "var(--ink)", color: "var(--paper)", padding: "2px 6px" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </figure>
              <div className={styles.barMed} style={{ marginBottom: 10 }} />
              <h3 className={styles.displaySoft} style={{ fontSize: 19, marginBottom: 4 }}>{f.name}</h3>
              <span className={`${styles.mono} ${styles.monoMute}`} style={{ marginBottom: 10 }}>{f.role}</span>
              <p
                className={`${styles.body} ${styles.bodyMute}`}
                style={{ fontSize: 9.5, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 5, WebkitBoxOrient: "vertical", overflow: "hidden" }}
              >
                {f.bio}
              </p>
            </div>
          ))}
        </div>

        {/* Parceiros */}
        <div style={{ marginTop: 20 }}>
          <div className={styles.barThick} style={{ marginBottom: 14 }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
            <span className={styles.mono} style={{ fontWeight: 700, flexShrink: 0 }}>MARCAS PARCEIRAS</span>
            <div style={{ display: "flex", alignItems: "center", gap: 40, flex: 1, justifyContent: "flex-end" }}>
              {PARCEIROS.map((parc) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={parc.name} src={optImg(parc.logo, 256)} alt={parc.name} style={{ height: 24, width: "auto", maxWidth: 118, objectFit: "contain" }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
