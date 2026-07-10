import { O_QUE_FAZEMOS, optImg } from "@/lib/institucional-data";
import styles from "@/app/institucional/pdf/institucional.module.css";

// Página 3 — O que fazemos. Spec-list numerada + foto vertical.
export function OQueFazemosPDF() {
  const s = O_QUE_FAZEMOS;

  return (
    <div className={`${styles.page} ${styles.light}`}>
      <span className={`${styles.corner} ${styles.cTL}`} />
      <span className={`${styles.corner} ${styles.cBR}`} />
      <div className={styles.frame}>
        <div className={styles.runHead}>
          <span className={styles.mono} style={{ fontWeight: 700 }}>BERKAHN — O QUE FAZEMOS</span>
          <span className={styles.mono}>FOLHA 03/09</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 32, paddingTop: 24 }}>
          <div>
            <span className={styles.sectionTag} style={{ marginBottom: 14 }}>
              <span className={styles.tagBox}>S.03</span> O QUE FAZEMOS
            </span>
            <h2 className={styles.display} style={{ fontSize: 46, marginTop: 12 }}>
              Da prancheta<br />ao canteiro
            </h2>
          </div>
          <p className={styles.body} style={{ maxWidth: 210, flexShrink: 0 }}>{s.intro}</p>
        </div>

        <div className={styles.barThick} style={{ marginTop: 20 }} />

        {/* Corpo: lista à esquerda + foto vertical à direita */}
        <div className={styles.grow} style={{ display: "flex", gap: 28, paddingTop: 4 }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {s.servicos.map((serv) => (
              <div
                key={serv.numero}
                style={{ flex: 1, display: "flex", gap: 20, alignItems: "flex-start", paddingTop: 16, paddingBottom: 16, borderBottom: "1.5px solid var(--ink)" }}
              >
                <span className={styles.huge} style={{ fontSize: 46, width: 74, flexShrink: 0, color: "var(--blueprint-line)" }}>
                  {serv.numero}
                </span>
                <div>
                  <h3 className={styles.h2} style={{ fontSize: 18, marginBottom: 6 }}>{serv.title}</h3>
                  <p className={`${styles.body} ${styles.bodyMute}`} style={{ fontSize: 10.5 }}>{serv.description}</p>
                </div>
              </div>
            ))}
          </div>
          <figure style={{ margin: 0, flex: "0 0 34%", position: "relative", overflow: "hidden" }} className={styles.bleedR}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={optImg("/images/Services/servicos-structure.webp", 640)} alt="Obra em Light Steel Frame" className={styles.imgCover} style={{ position: "absolute", inset: 0 }} />
            <span className={styles.mono} style={{ position: "absolute", bottom: 10, left: 10, background: "var(--ink)", color: "var(--paper)", padding: "3px 8px" }}>
              DA CONCEPÇÃO À EXECUÇÃO
            </span>
          </figure>
        </div>
      </div>
    </div>
  );
}
