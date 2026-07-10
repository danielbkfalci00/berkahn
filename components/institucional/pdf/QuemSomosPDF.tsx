import { QUEM_SOMOS, optImg } from "@/lib/institucional-data";
import styles from "@/app/institucional/pdf/institucional.module.css";

// Página 2 — Quem somos. Grid assimétrico: texto estreito + foto; stats; comparativo.
export function QuemSomosPDF() {
  const q = QUEM_SOMOS;

  return (
    <div className={`${styles.page} ${styles.light}`}>
      <div className={styles.frame}>
        <div className={styles.runHead}>
          <span className={styles.eyebrow}>Berkahn · Apresentação Institucional</span>
          <span className={styles.eyebrow}>02 / 09</span>
        </div>

        {/* Bloco 1: texto (esq) + foto (dir) */}
        <div style={{ display: "flex", gap: 40, paddingTop: 30 }}>
          <div style={{ flex: "0 0 55%" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 14 }}>
              <span className={styles.numeralKicker}>02</span>
              <span className={styles.eyebrow}>{q.label}</span>
            </div>
            <h2 className={styles.h2} style={{ maxWidth: 320 }}>{q.headline}</h2>
            <div className={styles.hairlineInk} style={{ margin: "20px 0" }} />
            <p className={styles.body} style={{ marginBottom: 12 }}>{q.intro}</p>
            <p className={`${styles.body} ${styles.bodySoft}`}>{q.historia}</p>
          </div>
          <figure style={{ flex: "1 1 auto", margin: 0, position: "relative", minHeight: 300 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={optImg("/images/empresa/primeira-imagem.webp", 828)} alt="Equipe e canteiro Berkahn" className={styles.imgCover} style={{ position: "absolute", inset: 0 }} />
          </figure>
        </div>

        {/* Bloco 2: stats */}
        <div style={{ marginTop: 26 }}>
          <div className={styles.hairline} />
          <div style={{ display: "flex", gap: 32, paddingTop: 18 }}>
            {q.stats.map((s, i) => (
              <div key={s.label} style={{ flex: i === 2 ? 1.5 : 1 }}>
                <div className={styles.statValue}>{s.value}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bloco 3: comparativo */}
        <div style={{ marginTop: 26 }}>
          <p className={styles.eyebrowInk} style={{ fontSize: 12, fontFamily: "var(--font-playfair), serif", textTransform: "none", letterSpacing: "-0.01em", fontWeight: 700, marginBottom: 18 }}>
            {q.comparativo.subtitulo}
          </p>
          <div style={{ display: "flex", gap: 40 }}>
            <div style={{ flex: 1 }}>
              <p className={styles.eyebrow} style={{ marginBottom: 12 }}>Construtora Berkahn</p>
              <ul className={styles.tickList}>
                {q.comparativo.construtora.map((it) => (
                  <li key={it} className={styles.tickItem}>{it}</li>
                ))}
              </ul>
            </div>
            <div style={{ width: 1, background: "var(--hairline)", alignSelf: "stretch" }} />
            <div style={{ flex: 1 }}>
              <p className={styles.eyebrow} style={{ marginBottom: 12 }}>Empreiteira</p>
              <ul className={styles.tickList}>
                {q.comparativo.empreiteira.map((it) => (
                  <li key={it} className={styles.tickItem} style={{ color: "var(--soft)" }}>{it}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
