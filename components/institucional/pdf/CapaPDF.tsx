import { INSTITUCIONAL_CAPA, optImg } from "@/lib/institucional-data";
import styles from "@/app/institucional/pdf/institucional.module.css";

// Página 1 — Capa. Foto full-bleed escurecida + título editorial Playfair.
export function CapaPDF() {
  const c = INSTITUCIONAL_CAPA;

  return (
    <div className={`${styles.page} ${styles.onDark}`} style={{ background: "#1a1a1a" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={optImg(c.heroImage, 1200)} alt="" className={`${styles.imgCover} ${styles.fill} ${styles.dim}`} />
      <div className={`${styles.coverGradient} ${styles.fill}`} />

      <div className={styles.frame} style={{ justifyContent: "space-between", padding: "56px 64px 48px" }}>
        {/* Topo: logo + label */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={optImg(c.logoBranco, 384)} alt="Berkahn" style={{ height: 30, width: "auto", objectFit: "contain" }} />
          <span className={styles.eyebrow}>{c.label}</span>
        </div>

        {/* Bloco inferior: título */}
        <div>
          <h1 className={styles.display} style={{ fontSize: 74, maxWidth: "88%" }}>
            {c.headline}
          </h1>
          <div className={styles.hairlineInk} style={{ margin: "30px 0 22px" }} />
          <p className={styles.lead} style={{ maxWidth: 440, color: "rgba(244,242,236,0.82)" }}>
            {c.subtitle}
          </p>
        </div>

        {/* Rodapé: wordmark + tagline */}
        <div className={styles.runFoot} style={{ marginTop: 30 }}>
          <span style={{ fontFamily: "var(--font-manrope), sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: "0.34em", color: "#f4f2ec" }}>
            BERKAHN
          </span>
          <span className={styles.eyebrow}>{c.tagline}</span>
        </div>
      </div>
    </div>
  );
}
