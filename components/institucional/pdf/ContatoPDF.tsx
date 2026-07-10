import { CONTATO_INSTITUCIONAL, optImg } from "@/lib/institucional-data";
import styles from "@/app/institucional/pdf/institucional.module.css";

// Página 9 — Contato. Fecho escuro editorial.
export function ContatoPDF() {
  const c = CONTATO_INSTITUCIONAL;

  const canais = [
    { label: "E-mail", value: c.email },
    { label: "Telefone", value: c.phone },
    { label: "Site", value: c.website },
    { label: "LinkedIn", value: c.linkedin },
  ];

  return (
    <div className={`${styles.page} ${styles.dark}`}>
      <div className={styles.frame}>
        {/* Topo: logo */}
        <div className={styles.runHead}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={optImg(c.logoBranco, 384)} alt="Berkahn" style={{ height: 26, width: "auto", objectFit: "contain" }} />
          <span className={styles.eyebrow}>09 / 09</span>
        </div>

        {/* Centro */}
        <div className={styles.grow} style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <span className={styles.eyebrow} style={{ marginBottom: 22 }}>Contato</span>
          <h2 className={styles.display} style={{ fontSize: 62, maxWidth: 560 }}>{c.headline}</h2>
          <div className={styles.hairlineInk} style={{ margin: "28px 0 26px" }} />
          <p className={styles.lead} style={{ maxWidth: 400, marginBottom: 44 }}>{c.subtitle}</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px 40px", maxWidth: 620 }}>
            {canais.map((ch) => (
              <div key={ch.label}>
                <div className={styles.eyebrow} style={{ marginBottom: 7 }}>{ch.label}</div>
                <div className={styles.display} style={{ fontSize: 18, wordBreak: "break-word" }}>{ch.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Rodapé */}
        <div className={styles.runFoot}>
          <span style={{ fontFamily: "var(--font-manrope), sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.32em", color: "#f4f2ec" }}>
            BERKAHN
          </span>
          <span className={styles.eyebrow}>CNPJ {c.cnpj} · {c.local}</span>
        </div>
      </div>
    </div>
  );
}
