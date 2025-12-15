import Image from "next/image";

interface HeroPageProps {
  title: string;
  subtitle?: string;
  imageSrc: string;
  imageAlt: string;
}

export function HeroPage({ title, subtitle, imageSrc, imageAlt }: HeroPageProps) {
  return (
    <section className="relative h-[50vh] min-h-[400px] flex items-start justify-start pt-20 md:pt-24 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 text-left">
        <div className="hero-content-left">
          {/* Decorative Line */}
          <div className="hero-decorative-line w-24 mb-8" />

          {subtitle && (
            <p className="hero-label text-white mb-4 hero-text-shadow">{subtitle}</p>
          )}
          <h1 className="headline-lg text-white hero-text-shadow-strong">{title}</h1>
        </div>
      </div>
    </section>
  );
}
