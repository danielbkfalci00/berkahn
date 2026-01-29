import Image from "next/image";

interface OrcamentoWatermarkProps {
  /** "light" para fundos claros, "dark" para fundos escuros */
  variant?: "light" | "dark";
  /** Exibir logo Berkahn no canto inferior direito */
  showLogo?: boolean;
  /** Posição do logo */
  logoPosition?: "center" | "top-right" | "bottom-right";
  /** Texto vertical na margem esquerda */
  sideText?: string;
}

/**
 * Marca d'água sutil para seções do orçamento.
 * Linha vertical + texto rotacionado na margem esquerda + logo discreto no canto.
 * Estilo documento técnico/orçamento profissional.
 *
 * Uso: Adicionar como primeiro filho de uma section com position: relative.
 */
export function OrcamentoWatermark({
  variant = "light",
  showLogo = true,
  logoPosition = "bottom-right",
  sideText = "BERKAHN CONSTRUTORA",
}: OrcamentoWatermarkProps) {
  const isLight = variant === "light";
  const textColor = isLight ? "text-black/[0.04]" : "text-white/[0.06]";
  const lineColor = isLight ? "bg-black/[0.06]" : "bg-white/[0.08]";
  const logoFilter = isLight ? "brightness-0" : "brightness-0 invert";

  const logoPositionClasses: Record<string, string> = {
    center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    "top-right": "top-8 md:top-12 right-8 md:right-12",
    "bottom-right": "bottom-8 md:bottom-12 right-8 md:right-12",
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
      {/* Logo Berkahn discreto */}
      {showLogo && (
        <div className={`absolute ${logoPositionClasses[logoPosition]} hidden md:block`}>
          <Image
            src="/images/logo/berkahn-logo.webp"
            alt=""
            width={80}
            height={28}
            className={`${logoFilter} opacity-[0.025]`}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
}
