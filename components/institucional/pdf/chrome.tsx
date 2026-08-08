import type { ReactNode } from "react";

// Chrome compartilhado das páginas do documento institucional (v4 — porte fiel
// do design aprovado no Claude Design, "Berkahn Institucional.dc.html").
// Runhead + eyebrow + footer repetem em todas as páginas; centralizados aqui
// para consistência e para facilitar o passe de acabamento (Commit B).

export const INK = "#1A1A1A";
export const OFFWHITE = "#F4F2EC";
export const MUTED = "#666666";
export const FAINT = "#666666";
export const PHOTO_BG = "#E9E7DF";

// Cabeçalho corrido: wordmark BERKAHN + label da seção.
export function RunHead({ label, dark = false }: { label: string; dark?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.2em", color: dark ? "#fff" : INK }}>
        BERKAHN
      </span>
      <span
        style={{
          fontSize: 9,
          fontWeight: 500,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: dark ? "#888" : FAINT,
        }}
      >
        {label}
      </span>
    </div>
  );
}

// Eyebrow (kicker) acima do título da seção.
export function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <p
      style={{
        fontSize: 10,
        fontWeight: 500,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: dark ? "#888" : FAINT,
        margin: "0 0 14px",
      }}
    >
      {children}
    </p>
  );
}

// Rodapé: tagline + numeração de folha.
export function Footer({
  page,
  dark = false,
  line,
}: {
  page: string;
  dark?: boolean;
  line?: string;
}) {
  const borderColor = line ?? (dark ? "#3a3a3a" : "#e2e0d8");
  const color = dark ? "#888" : FAINT;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: `1px solid ${borderColor}`,
        paddingTop: 12,
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 300, color }}>Erguendo o amanhã</span>
      <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.15em", color }}>{page}</span>
    </div>
  );
}
