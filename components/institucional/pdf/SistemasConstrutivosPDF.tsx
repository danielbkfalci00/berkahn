import { SISTEMAS_CONSTRUTIVOS, optImg } from "@/lib/institucional-data";
import styles from "@/app/institucional/pdf/institucional.module.css";

// Página 4 — Sistemas construtivos. Spread escuro: 3 blocos + diagrama LSF + normas.
export function SistemasConstrutivosPDF() {
  const s = SISTEMAS_CONSTRUTIVOS;

  return (
    <div className={`${styles.page} ${styles.dark}`}>
      <div className={styles.frame}>
        <div className={styles.runHead}>
          <span className={styles.eyebrow}>Berkahn · Apresentação Institucional</span>
          <span className={styles.eyebrow}>04 / 09</span>
        </div>

        {/* Cabeçalho */}
        <div style={{ paddingTop: 28 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 14 }}>
            <span className={styles.numeralKicker}>04</span>
            <span className={styles.eyebrow}>{s.label}</span>
          </div>
          <h2 className={styles.h2} style={{ fontSize: 33, maxWidth: 560 }}>{s.headline}</h2>
          <p className={styles.lead} style={{ maxWidth: 480, marginTop: 16 }}>{s.intro}</p>
        </div>

        {/* Corpo: 3 blocos (esq) + diagrama (dir) */}
        <div className={styles.grow} style={{ display: "flex", gap: 44, paddingTop: 30, alignItems: "stretch" }}>
          <div style={{ flex: "0 0 52%", display: "flex", flexDirection: "column" }}>
            {s.blocos.map((b) => (
              <div key={b.title} style={{ flex: 1, paddingTop: 16, paddingBottom: 16, borderTop: "1px solid var(--hairline-dark)" }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 7 }}>
                  <h3 className={styles.h3} style={{ fontSize: 20 }}>{b.title}</h3>
                  <span className={styles.eyebrow} style={{ flexShrink: 0 }}>{b.subtitle}</span>
                </div>
                <p className={`${styles.body} ${styles.bodySoft}`}>{b.description}</p>
              </div>
            ))}
          </div>
          <figure style={{ flex: 1, margin: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ background: "var(--paper)", padding: 18, borderRadius: 2 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={optImg(s.image, 1080)} alt={s.imageAlt} style={{ width: "100%", height: "auto", objectFit: "contain", display: "block" }} />
            </div>
            <figcaption className={styles.figCaption}>{s.imageAlt}</figcaption>
          </figure>
        </div>

        {/* Normas */}
        <div style={{ marginTop: 12 }}>
          <div className={styles.hairline} />
          <div style={{ display: "flex", gap: 28, paddingTop: 16 }}>
            {s.normas.map((n) => (
              <div key={n.norma} style={{ flex: 1 }}>
                <div className={styles.display} style={{ fontSize: 17, marginBottom: 5 }}>{n.norma}</div>
                <div className={`${styles.body} ${styles.bodySoft}`} style={{ fontSize: 10 }}>{n.descricao}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
