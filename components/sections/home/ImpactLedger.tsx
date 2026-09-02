import Image from "next/image";
import Link from "next/link";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import {
  IMPACT_SECTION,
  impactSources,
  type DataSource,
  type ImpactFigure,
} from "@/lib/impact-data";

const SUPERSCRIPT = ["¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];

/**
 * "05 · impacto": o que o Light Steel Frame muda para quem mora, quem paga e a
 * cidade. Três linhas de um ledger, cada uma com dois números grandes, e um
 * rodapé de fontes derivado dos dados. Substitui o antigo StatsCounter da home.
 *
 * Server Component: só RevealOnScroll (client) por bloco. Sem count-up, de
 * propósito: os valores são faixas e inequações, e contador em bloco preto é o
 * template que a home evita. A foto usa a utility CSS `.sda-scale-in`
 * (scroll-driven, com fallback estático onde não há suporte).
 */
export function ImpactLedger() {
  const section = IMPACT_SECTION;
  const sources = impactSources(section);
  const sourceIndex = new Map(sources.map((source, index) => [source.id, index]));
  const noteOf = (source?: DataSource): Note | null => {
    const index = source ? sourceIndex.get(source.id) : undefined;
    if (index === undefined) return null;
    return { n: index + 1, glyph: SUPERSCRIPT[index] ?? String(index + 1) };
  };

  return (
    <section id="impacto" className="bg-carbon text-white py-2xl md:py-3xl">
      <div className="container">
        <RevealOnScroll>
          <p className="font-tech text-xs lowercase tracking-wide text-white-50 mb-4">
            {section.eyebrow}
          </p>
          <h2 className="headline-md text-white max-w-3xl">{section.headline}</h2>
          <p className="mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-white-70">
            {section.lede}
            <Sup note={noteOf(section.ledeSource)} />
          </p>
        </RevealOnScroll>

        <figure className="mt-12 md:mt-16">
          <div className="relative aspect-[4/3] md:aspect-[16/9] overflow-hidden bg-carbon-soft">
            <Image
              src={section.image.src}
              alt={section.image.alt}
              fill
              quality={70}
              sizes="(min-width: 1280px) 1152px, 100vw"
              className="object-cover sda-scale-in"
            />
          </div>
          <figcaption className="mt-4 flex items-center gap-3">
            <span className="h-[3px] w-10 bg-white" aria-hidden="true" />
            <span className="font-tech text-xs lowercase tracking-wide text-white-50">
              {section.image.caption}
            </span>
          </figcaption>
        </figure>

        <div className="mt-16 md:mt-24 border-t-[3px] border-white">
          {section.blocks.map((block, index) => (
            <RevealOnScroll key={block.id} delay={index * 0.1}>
              <article className="grid gap-8 md:grid-cols-12 md:gap-10 py-12 md:py-16 border-b border-white-10">
                <div className="md:col-span-5">
                  <p className="font-tech text-xs lowercase tracking-wide text-white-50 mb-4">
                    {block.index} · {block.audience}
                  </p>
                  <h3 className="font-display font-semibold tracking-tight text-2xl md:text-3xl text-white">
                    {block.headline}
                  </h3>
                  <p className="mt-4 max-w-md leading-relaxed text-white-70">{block.body}</p>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:col-span-6 md:col-start-7 md:gap-x-10">
                  {block.figures.map((figure, figureIndex) => (
                    <Figure
                      key={`${block.id}-${figureIndex}`}
                      figure={figure}
                      note={noteOf(figure.source)}
                      compareNote={noteOf(figure.compareSource)}
                    />
                  ))}
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </div>

        <div className="mt-12 md:mt-16 grid gap-8 md:grid-cols-12 md:gap-10 md:items-start">
          <RevealOnScroll className="md:col-span-5">
            <Link
              href={section.cta.href}
              className="group inline-flex items-center gap-4 text-sm uppercase tracking-wider font-medium text-white"
            >
              <span className="h-[3px] w-10 bg-white transition-all duration-500 ease-expo group-hover:w-16" />
              {section.cta.label}
            </Link>
          </RevealOnScroll>

          <p
            id="fontes"
            className="md:col-span-6 md:col-start-7 font-tech text-[11px] md:text-xs tracking-wide leading-relaxed text-white-50"
          >
            fontes
            {sources.map((source, index) => (
              <span key={source.id}>
                {" · "}
                {SUPERSCRIPT[index]}{" "}
                {source.url ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-white-30 underline-offset-2 hover:text-white-70"
                  >
                    {source.name}
                  </a>
                ) : (
                  source.name
                )}
                {source.year ? ` (${source.year})` : ""}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}

type Note = { n: number; glyph: string };

/** Marcador de fonte com rótulo para leitor de tela; aponta para o rodapé. */
function Sup({ note }: { note: Note | null }) {
  if (!note) return null;
  return (
    <sup className="ml-1 font-tech text-[10px] normal-case text-white-50">
      <a href="#fontes" aria-label={`fonte ${note.n}`} className="no-underline">
        {note.glyph}
      </a>
    </sup>
  );
}

function Figure({
  figure,
  note,
  compareNote,
}: {
  figure: ImpactFigure;
  note: Note | null;
  compareNote: Note | null;
}) {
  return (
    <div className="min-w-0">
      <p className="font-display font-semibold tracking-tight leading-[1.05] text-4xl md:text-5xl lg:text-6xl text-white">
        {figure.value}
        {figure.unit && (
          <span className="ml-1.5 text-lg md:text-2xl font-medium tracking-normal text-white-70 whitespace-nowrap">
            {figure.unit}
          </span>
        )}
      </p>
      <div className="mt-4 flex items-start gap-3">
        <span className="mt-[6px] h-[3px] w-8 shrink-0 bg-white" aria-hidden="true" />
        <div>
          <p className="text-xs uppercase tracking-wider text-white-70 font-medium">
            {figure.label}
            <Sup note={note} />
          </p>
          {figure.compare && (
            <p className="mt-1 text-xs text-white-50">
              {figure.compare}
              <Sup note={compareNote} />
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
