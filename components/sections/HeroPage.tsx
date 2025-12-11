import Image from "next/image";

interface HeroPageProps {
  title: string;
  subtitle?: string;
  imageSrc: string;
  imageAlt: string;
}

export function HeroPage({ title, subtitle, imageSrc, imageAlt }: HeroPageProps) {
  return (
    <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
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

      {/* Overlay */}
      <div className="absolute inset-0 bg-black-70 z-10" />

      {/* Content */}
      <div className="relative z-20 text-center px-6">
        {subtitle && (
          <p className="label-text text-white mb-4">{subtitle}</p>
        )}
        <h1 className="headline-lg text-white">{title}</h1>
      </div>
    </section>
  );
}
