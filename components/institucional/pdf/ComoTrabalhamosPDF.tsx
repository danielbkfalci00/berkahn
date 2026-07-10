import { COMO_TRABALHAMOS, EXECUTION_PHASES, optImg } from "@/lib/institucional-data";
import styles from "@/app/institucional/pdf/institucional.module.css";

// Página 6 — Como trabalhamos. Timeline editorial das 4 fases (conceito → chaves).
export function ComoTrabalhamosPDF() {
  const c = COMO_TRABALHAMOS;

  return (
    <div className={`${styles.page} ${styles.light}`}>
      <div className={styles.frame}>
        <div className={styles.runHead}>
          <span className={styles.eyebrow}>Berkahn · Apresentação Institucional</span>
          <span className={styles.eyebrow}>06 / 09</span>
        </div>

        {/* Cabeçalho */}
        <div style={{ paddingTop: 30, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 14 }}>
              <span className={styles.numeralKicker}>06</span>
              <span className={styles.eyebrow}>{c.label}</span>
            </div>
            <h2 className={styles.h2}>{c.headline}</h2>
          </div>
          <p className={styles.lead} style={{ maxWidth: 250, flexShrink: 0 }}>{c.intro}</p>
        </div>

        {/* Timeline */}
        <div className={styles.grow} style={{ display: "flex", flexDirection: "column", paddingTop: 24 }}>
          {EXECUTION_PHASES.map((fase, i) => (
            <div
              key={fase.id}
              style={{
                flex: 1,
                display: "flex",
                gap: 26,
                alignItems: "center",
                borderTop: i === 0 ? "none" : "1px solid var(--hairline)",
                paddingTop: 16,
                paddingBottom: 16,
              }}
            >
              <span className={styles.display} style={{ fontSize: 40, width: 54, flexShrink: 0, lineHeight: 1 }}>
                {String(fase.number).padStart(2, "0")}
              </span>
              <figure style={{ margin: 0, width: 120, height: 82, flexShrink: 0, position: "relative", overflow: "hidden", borderRadius: 2 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={optImg(fase.images.primary, 384)} alt={fase.images.primaryAlt} className={styles.imgCover} style={{ position: "absolute", inset: 0 }} />
              </figure>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 6 }}>
                  <h3 className={styles.h3} style={{ fontSize: 20 }}>{fase.title}</h3>
                  <span className={styles.eyebrow} style={{ flexShrink: 0 }}>{fase.duration}</span>
                </div>
                <p className={`${styles.body} ${styles.bodySoft}`} style={{ fontSize: 11 }}>
                  {fase.summary ?? fase.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
