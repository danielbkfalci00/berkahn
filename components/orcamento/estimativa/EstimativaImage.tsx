// Helper de imagem para o renderer PDF de orçamentos.
// Usa <img> nativo (puppeteer renderiza melhor que Next/Image otimizado em
// runtime) com loading="eager" pra garantir carregamento antes do PDF capturar.

interface Props {
  src: string
  alt: string
  caption?: string
  aspect?: "16:9" | "4:3" | "1:1" | "3:2"
  rounded?: boolean
  className?: string
}

const ASPECT_MAP: Record<NonNullable<Props["aspect"]>, string> = {
  "16:9": "56.25%",
  "4:3": "75%",
  "3:2": "66.67%",
  "1:1": "100%",
}

export function EstimativaImage({
  src,
  alt,
  caption,
  aspect = "3:2",
  rounded = true,
  className,
}: Props) {
  const paddingBottom = ASPECT_MAP[aspect]
  return (
    <figure
      className={className}
      style={{
        margin: 0,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div
        className="est-imagem-wrap"
        style={{
          position: "relative",
          width: "100%",
          paddingBottom,
          overflow: "hidden",
          borderRadius: rounded ? 4 : 0,
          background: "var(--c-off-white)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading="eager"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            display: "block",
          }}
        />
      </div>
      {caption && (
        <figcaption
          className="est-eyebrow"
          style={{ fontSize: 9, color: "var(--c-soft-gray)" }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
