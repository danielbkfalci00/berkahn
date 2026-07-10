import { SISTEMAS_CONSTRUTIVOS, optImg } from "@/lib/institucional-data";
import styles from "@/app/institucional/pdf/institucional.module.css";

// Camadas reais da parede LSF (public/images/Lsf/Layers) — spec técnica.
const CAMADAS_LSF = [
  "Placa cimentícia",
  "Manta hidrófuga",
  "Perfil steel frame — montante 90mm",
  "Lã de vidro — isolamento termoacústico",
  "Placa de gesso",
];

// Página 4 — Sistemas construtivos. Página BLUEPRINT, tipográfica.
export function SistemasConstrutivosPDF() {
  const s = SISTEMAS_CONSTRUTIVOS;
  const [linha1, linha2] = s.headline.split(". ");

  return (
    <div className={`${styles.page} ${styles.blue}`}>
      <div className={styles.gridLines} />
      <span className={`${styles.corner} ${styles.cTL}`} />
      <span className={`${styles.corner} ${styles.cBR}`} />
      <div className={styles.frame}>
        <div className={styles.runHead}>
          <span className={styles.mono} style={{ fontWeight: 700 }}>BERKAHN — SISTEMAS CONSTRUTIVOS</span>
          <span className={styles.mono}>FOLHA 04/09</span>
        </div>

        <div style={{ paddingTop: 24 }}>
          <span className={styles.sectionTag} style={{ marginBottom: 14 }}>
            <span className={styles.tagBox}>S.04</span> SISTEMAS CONSTRUTIVOS
          </span>
          <h2 className={styles.display} style={{ fontSize: 46, marginTop: 12 }}>{linha1}.</h2>
          <p className={styles.displaySoft} style={{ fontSize: 22, marginTop: 10, color: "var(--paper-on-blue)" }}>
            {linha2}
          </p>
          <p className={styles.body} style={{ maxWidth: 500, marginTop: 16, fontSize: 11.5 }}>{s.intro}</p>
        </div>

        {/* Corpo: 3 blocos + camadas */}
        <div className={styles.grow} style={{ display: "flex", gap: 36, paddingTop: 24 }}>
          <div style={{ flex: "1 1 58%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            {s.blocos.map((b) => (
              <div key={b.title} style={{ paddingTop: 12, borderTop: "1.5px solid rgba(238,241,244,0.35)" }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 5 }}>
                  <h3 className={styles.h2} style={{ fontSize: 17 }}>{b.title}</h3>
                  <span className={styles.mono}>{b.subtitle}</span>
                </div>
                <p className={`${styles.body} ${styles.bodyMute}`} style={{ fontSize: 10.5 }}>{b.description}</p>
              </div>
            ))}
          </div>

          {/* Coluna técnica — camadas + foto */}
          <div style={{ flex: "0 0 34%", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ border: "1.5px solid var(--paper-on-blue)", padding: "16px 16px 18px" }}>
              <p className={styles.mono} style={{ fontWeight: 700, marginBottom: 4 }}>PAREDE LSF</p>
              <p className={`${styles.mono} ${styles.monoMute}`} style={{ marginBottom: 14 }}>CAMADAS — EXTERIOR ▸ INTERIOR</p>
              <ol style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {CAMADAS_LSF.map((c, i) => (
                  <li key={c} style={{ display: "flex", gap: 10, paddingBottom: 10 }}>
                    <span className={styles.mono} style={{ fontWeight: 700, flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={styles.body} style={{ fontSize: 10, lineHeight: 1.35 }}>{c}</span>
                  </li>
                ))}
              </ol>
            </div>
            <figure style={{ margin: 0, flex: 1, minHeight: 120, position: "relative", overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={optImg("/images/Lsf/lsf-hero-structure.webp", 384)} alt="Estrutura em Light Steel Frame" className={styles.imgCover} style={{ position: "absolute", inset: 0 }} />
            </figure>
          </div>
        </div>

        {/* NBRs */}
        <div className={styles.titleBlock} style={{ marginTop: 8 }}>
          {s.normas.map((n) => (
            <div key={n.norma} className={styles.tbCell} style={{ flex: 1, whiteSpace: "normal" }}>
              <span className={styles.tbKey}>{n.norma}</span>{n.descricao}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
