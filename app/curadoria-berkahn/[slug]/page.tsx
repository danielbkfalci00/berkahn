import type { Metadata } from "next";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import {
  architects,
  getArchitectBySlug,
  getAllArchitectSlugs,
} from "@/lib/architects-data";
import { ArchitectIndividualHero } from "@/components/architects/ArchitectIndividualHero";
import { ArchitectBio } from "@/components/architects/ArchitectBio";
import { ArchitectMetrics } from "@/components/architects/ArchitectMetrics";
import { ArchitectAnchorProject } from "@/components/architects/ArchitectAnchorProject";
import { ArchitectBerkahnPartnership } from "@/components/architects/ArchitectBerkahnPartnership";
import { ArchitectContactBlock } from "@/components/architects/ArchitectContactBlock";
import { ArchitectPageHeader } from "@/components/architects/ArchitectPageHeader";
import { ScrollProgress } from "@/components/architects/ScrollProgress";

const ArchitectProjectsGallery = dynamic(() =>
  import("@/components/architects/ArchitectProjectsGallery").then((m) => ({
    default: m.ArchitectProjectsGallery,
  })),
);
const ArchitectTimeline = dynamic(() =>
  import("@/components/architects/ArchitectTimeline").then((m) => ({
    default: m.ArchitectTimeline,
  })),
);

export function generateStaticParams() {
  return getAllArchitectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const architect = getArchitectBySlug(slug);

  if (!architect) {
    return { title: "Arquiteto não encontrado | BERKAHN" };
  }

  return {
    title: `${architect.studioName} | Arquitetos Parceiros BERKAHN`,
    description: architect.shortPitch,
    robots: "noindex, nofollow",
  };
}

export default async function ArchitectIndividualPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const architect = getArchitectBySlug(slug);

  if (!architect) {
    notFound();
  }

  return (
    <main className="min-h-screen w-full bg-white">
      <ScrollProgress />
      <ArchitectPageHeader studioName={architect.studioName} />
      <ArchitectIndividualHero architect={architect} />
      <ArchitectBio architect={architect} />
      <ArchitectMetrics architect={architect} />
      <ArchitectAnchorProject architect={architect} />
      <ArchitectProjectsGallery architect={architect} />
      <ArchitectTimeline architect={architect} />
      <ArchitectBerkahnPartnership architect={architect} />
      <ArchitectContactBlock architect={architect} />

      {/* Footer minimal — apenas no contexto da página individual */}
      <footer className="bg-white py-12 px-6 text-center border-t border-black-5">
        <p className="text-[10px] uppercase tracking-[0.4em] text-black-50 mb-3">
          Berkahn
        </p>
        <p className="text-sm text-black-70 font-light">
          Curadoria de arquitetos parceiros · Steel Frame
        </p>
      </footer>
    </main>
  );
}
