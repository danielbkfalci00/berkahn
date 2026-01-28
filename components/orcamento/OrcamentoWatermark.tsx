import Image from "next/image";

interface OrcamentoWatermarkProps {
  /** "light" para fundos claros (grid preto), "dark" para fundos escuros (grid branco) */
  variant?: "light" | "dark";
  /** Exibir logo Berkahn */
  showLogo?: boolean;
  /** Posição do logo */
  logoPosition?: "center" | "top-right" | "bottom-right";
}

/**
 * Marca d'água profissional para seções do orçamento.
 * Combina grid técnico/blueprint + logo Berkahn sutil.
 *
 * Uso: Adicionar como primeiro filho de uma section com position: relative.
 */
export function OrcamentoWatermark({
  variant = "light",
  showLogo = true,
  logoPosition = "top-right",
}: OrcamentoWatermarkProps) {
  const gridColor = variant === "light" ? "#000000" : "#FFFFFF";
  const gridOpacity = variant === "light" ? "opacity-[0.018]" : "opacity-[0.025]";
  const logoFilter = variant === "dark" ? "brightness-0 invert" : "brightness-0";

  const logoPositionClasses: Record<string, string> = {
    center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    "top-right": "top-8 md:top-12 right-8 md:right-12",
    "bottom-right": "bottom-8 md:bottom-12 right-8 md:right-12",
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
      {/* Grid técnico/blueprint */}
      <div
        className={`absolute inset-0 ${gridOpacity}`}
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, ${gridColor} 0px, ${gridColor} 1px, transparent 1px, transparent 60px),
            repeating-linear-gradient(90deg, ${gridColor} 0px, ${gridColor} 1px, transparent 1px, transparent 60px)
          `,
        }}
      />

      {/* Logo Berkahn */}
      {showLogo && (
        <div className={`absolute ${logoPositionClasses[logoPosition]}`}>
          <Image
            src="/images/logo/berkahn-logo.webp"
            alt=""
            width={120}
            height={40}
            className={`${logoFilter} opacity-[0.03]`}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
}
