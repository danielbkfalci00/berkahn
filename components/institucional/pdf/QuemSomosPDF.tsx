import { QUEM_SOMOS, optImg } from "@/lib/institucional-data";
import styles from "@/app/institucional/pdf/institucional.module.css";

// Página 2 — Quem somos. Título gigante + números enormes + tabela mono.
export function QuemSomosPDF() {
  const q = QUEM_SOMOS;

  return (
    <div className={`${styles.page} ${styles.light}`}>
      <span className={`${styles.corner} ${styles.cTL}`} />
      <span className={`${styles.corner} ${styles.cBR}`} />
      <div className={styles.frame}>
        <div className={styles.runHead}>
          <span className={styles.mono} style={{ fontWeight: 700 }}>BERKAHN — QUEM SOMOS</span>
          <span className={styles.mono}>FOLHA 02/09</span>
        </div>

        {/* Título + foto */}
        <div style={{ display: "flex", gap: 28, paddingTop: 26, alignItems: "flex-start" }}>
          <div style={{ flex: "1 1 auto" }}>
            <span className={styles.sectionTag} style={{ marginBottom: 16 }}>
              <span className={styles.tagBox}>S.02</span> QUEM SOMOS
            </span>
            <h2 className={styles.display} style={{ fontSize: 58, marginTop: 14 }}>
              Construtora,<br />não empreiteira
            </h2>
          </div>
          <figure style={{ margin: 0, width: 210, height: 168, flexShrink: 0, overflow: "hidden", position: "relative" }} className={styles.bleedR}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={optImg("/images/empresa/primeira-imagem.webp", 384)} alt="Equipe e canteiro Berkahn" className={styles.imgCover} style={{ position: "absolute", inset: 0 }} />
          </figure>
        </div>

        <div style={{ display: "flex", gap: 40, marginTop: 18 }}>
          <p className={styles.body} style={{ flex: 1, fontSize: 12 }}>{q.intro}</p>
          <p className={`${styles.body} ${styles.bodyMute}`} style={{ flex: 1, fontSize: 11 }}>{q.historia}</p>
        </div>

        {/* Números enormes */}
        <div className={styles.barThick} style={{ marginTop: 26 }} />
        <div style={{ display: "flex", gap: 24, paddingTop: 18 }}>
          {q.stats.map((s, i) => (
            <div key={s.label} style={{ flex: i === 2 ? 1.6 : 1 }}>
              <div className={styles.huge} style={{ fontSize: i === 2 ? 48 : 72 }}>{s.value}</div>
              <div className={styles.mono} style={{ marginTop: 10 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Comparativo — tabela mono */}
        <div style={{ marginTop: 42 }}>
          <p className={styles.monoBig} style={{ fontWeight: 700, marginBottom: 16, textTransform: "none", letterSpacing: "-0.01em" }}>
            {q.comparativo.subtitulo}
          </p>
          <div style={{ display: "flex", gap: 32 }}>
            <div style={{ flex: 1 }}>
              <div className={styles.barMed} style={{ marginBottom: 12 }} />
              <p className={styles.mono} style={{ fontWeight: 700, marginBottom: 12 }}>CONSTRUTORA BERKAHN</p>
              <ul className={styles.specList}>
                {q.comparativo.construtora.map((it) => (
                  <li key={it} className={styles.specItem}>{it}</li>
                ))}
              </ul>
            </div>
            <div style={{ flex: 1 }}>
              <div className={styles.barMed} style={{ marginBottom: 12, opacity: 0.35 }} />
              <p className={`${styles.mono} ${styles.monoMute}`} style={{ fontWeight: 700, marginBottom: 12 }}>EMPREITEIRA</p>
              <ul className={styles.specList}>
                {q.comparativo.empreiteira.map((it) => (
                  <li key={it} className={styles.specItem} style={{ color: "var(--mute)" }}>{it}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Banda de foto — canteiro Berkahn */}
        <figure className={styles.bleedX} style={{ margin: 0, marginTop: "auto", height: 210, position: "relative", overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={optImg("/images/empresa/segunda-imagem.webp", 828)} alt="Canteiro Berkahn" className={styles.imgCover} style={{ position: "absolute", inset: 0 }} />
          <span className={styles.mono} style={{ position: "absolute", bottom: 12, left: "var(--edge)", background: "var(--ink)", color: "var(--paper)", padding: "3px 8px" }}>
            EQUIPE + CANTEIRO · SÃO PAULO
          </span>
        </figure>
      </div>
    </div>
  );
}
