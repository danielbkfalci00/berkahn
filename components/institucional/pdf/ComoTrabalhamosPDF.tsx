import { COMO_TRABALHAMOS, EXECUTION_PHASES, optImg } from "@/lib/institucional-data";
import styles from "@/app/institucional/pdf/institucional.module.css";

// Página 6 — Como trabalhamos. Timeline como folhas de spec.
export function ComoTrabalhamosPDF() {
  const c = COMO_TRABALHAMOS;

  return (
    <div className={`${styles.page} ${styles.light}`}>
      <div className={styles.frame}>
        <div className={styles.runHead}>
          <span className={styles.mono} style={{ fontWeight: 700 }}>BERKAHN — COMO TRABALHAMOS</span>
          <span className={styles.mono}>FOLHA 06/09</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 32, paddingTop: 26 }}>
          <div>
            <span className={styles.sectionTag} style={{ marginBottom: 14 }}>
              <span className={styles.tagBox}>S.06</span> COMO TRABALHAMOS
            </span>
            <h2 className={styles.display} style={{ fontSize: 44, marginTop: 14 }}>
              Do conceito<br />à entrega das chaves
            </h2>
          </div>
          <p className={styles.body} style={{ maxWidth: 240, flexShrink: 0 }}>{c.intro}</p>
        </div>

        <div className={styles.barThick} style={{ marginTop: 22 }} />

        <div className={styles.grow} style={{ display: "flex", flexDirection: "column" }}>
          {EXECUTION_PHASES.map((fase) => (
            <div
              key={fase.id}
              style={{ flex: 1, display: "flex", gap: 24, alignItems: "center", paddingTop: 14, paddingBottom: 14, borderBottom: "1.5px solid var(--ink)" }}
            >
              <div style={{ width: 92, flexShrink: 0 }}>
                <div className={styles.mono} style={{ fontWeight: 700, marginBottom: 2 }}>FASE</div>
                <div className={styles.huge} style={{ fontSize: 46 }}>{String(fase.number).padStart(2, "0")}</div>
              </div>
              <figure style={{ margin: 0, width: 118, height: 80, flexShrink: 0, position: "relative", overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={optImg(fase.images.primary, 384)} alt={fase.images.primaryAlt} className={styles.imgCover} style={{ position: "absolute", inset: 0 }} />
              </figure>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, marginBottom: 5 }}>
                  <h3 className={styles.h2} style={{ fontSize: 18 }}>{fase.title}</h3>
                  <span className={styles.mono} style={{ flexShrink: 0, border: "1.5px solid var(--ink)", padding: "2px 7px" }}>{fase.duration}</span>
                </div>
                <p className={`${styles.body} ${styles.bodyMute}`} style={{ fontSize: 10.5 }}>{fase.summary ?? fase.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
