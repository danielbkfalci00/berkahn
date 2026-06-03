import Image from "next/image";
import { architects } from "@/lib/architects-data";
import { PROJECTS } from "@/data/projects";
import { ArchitectHubHero } from "@/components/architects/ArchitectHubHero";
import { PathChooser } from "@/components/architects/PathChooser";
import { SectionLabel } from "@/components/architects/SectionLabel";
import { ArchitectHubCardCarousel } from "@/components/architects/ArchitectHubCardCarousel";
import { NarrativeDivider } from "@/components/architects/NarrativeDivider";
import { UnifiedCTA } from "@/components/architects/UnifiedCTA";

const FEATURED_MODEL_SLUGS = ["casa-de-campo", "chale", "loft"] as const;

export default function CuradoriaHub() {
  const featuredModels = FEATURED_MODEL_SLUGS
    .map((slug) => PROJECTS.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <main className="min-h-screen w-full bg-white">
      <ArchitectHubHero />

      {/* ─── Apresentação dos dois caminhos ─────────────────────────────── */}
      <PathChooser />

      {/* ─── Seção 01 — Autoral · Arquitetos parceiros ──────────────────── */}
      <SectionLabel
        id="arquitetos"
        kicker="01 · Autoral"
        title="Arquitetos parceiros"
        subtitle="Três escritórios parceiros que assinam o projeto da sua próxima obra. A Berkahn constrói em Light Steel Frame."
      />

      {architects.map((architect, idx) => (
        <ArchitectHubCardCarousel
          key={architect.slug}
          architect={architect}
          index={idx}
        />
      ))}

      {/* ─── Divisor narrativo ──────────────────────────────────────────── */}
      <NarrativeDivider
        variant="dark"
        eyebrow="Outro caminho"
        body="Em breve: a linha própria de modelos engenheirados da Berkahn, com projeto, especificações e prazo já resolvidos."
      />

      {/* ─── Seção 02 — Curado · Modelos engenheirados (EM MOCKUP) ───────── */}
      {/* Os modelos ainda são mockup → bloqueados como teaser "Em desenvolvimento".
          Para REABILITAR quando forem reais: trocar o teaser abaixo de volta pelo
          map de <ModelHubCardWide project={project} reversed={idx % 2 === 1}
          index={idx} total={featuredModels.length} /> (reimportar ModelHubCardWide). */}
      <SectionLabel
        id="modelos"
        kicker="02 · Curado"
        title="Modelos engenheirados Berkahn"
        subtitle="Em desenvolvimento. A linha própria Berkahn estará disponível em breve."
      />

      <section className="relative w-full bg-off-white pb-24 lg:pb-36 px-6 lg:px-12">
        <div className="relative max-w-[1500px] mx-auto">
          {/* Preview borrado dos modelos — não-clicável (mockup) */}
          <div
            aria-hidden
            className="grid grid-cols-3 gap-4 lg:gap-6 blur-[6px] opacity-40 pointer-events-none select-none"
          >
            {featuredModels.map((project) => (
              <div
                key={project.slug}
                className="relative aspect-[4/3] overflow-hidden bg-black-5"
              >
                <Image
                  src={project.cardImage}
                  alt=""
                  fill
                  quality={65}
                  className="object-cover"
                  sizes="33vw"
                />
              </div>
            ))}
          </div>

          {/* Selo central */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-black text-white text-[11px] uppercase tracking-[0.3em] shadow-luxury-md">
              <span className="w-2 h-2 rounded-full bg-white/70 animate-pulse" />
              Em desenvolvimento · em breve
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA unificado ──────────────────────────────────────────────── */}
      <UnifiedCTA />

      {/* Rodapé minimal */}
      <footer className="bg-off-white py-16 px-6 text-center border-t border-black-5">
        <p className="text-[10px] uppercase tracking-[0.4em] text-black-50 mb-3">
          Berkahn
        </p>
        <p className="text-sm text-black-70 font-light">
          Curadoria · Arquitetos parceiros + Modelos engenheirados · Steel Frame
        </p>
      </footer>
    </main>
  );
}
