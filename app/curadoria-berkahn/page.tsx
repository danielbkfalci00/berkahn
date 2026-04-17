import { architects } from "@/lib/architects-data";
import { PROJECTS } from "@/data/projects";
import { ArchitectHubHero } from "@/components/architects/ArchitectHubHero";
import { PathChooser } from "@/components/architects/PathChooser";
import { SectionLabel } from "@/components/architects/SectionLabel";
import { ArchitectHubCardCarousel } from "@/components/architects/ArchitectHubCardCarousel";
import { NarrativeDivider } from "@/components/architects/NarrativeDivider";
import { ModelHubCardWide } from "@/components/architects/ModelHubCardWide";
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
        subtitle="Quatro escritórios autorais que dominam steel frame e podem assinar o projeto da sua próxima obra."
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
        body="Sem projeto pronto e com pressa? Conheça os modelos engenheirados pela Berkahn — projeto, especificações e prazo já resolvidos."
      />

      {/* ─── Seção 02 — Curado · Modelos engenheirados ──────────────────── */}
      <SectionLabel
        id="modelos"
        kicker="02 · Curado"
        title="Modelos engenheirados Berkahn"
        subtitle="Linha própria de catálogo · projeto pronto para construir em 30 a 90 dias."
      />

      {featuredModels.map((project, idx) => (
        <ModelHubCardWide
          key={project.slug}
          project={project}
          reversed={idx % 2 === 1}
          index={idx}
          total={featuredModels.length}
        />
      ))}

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
