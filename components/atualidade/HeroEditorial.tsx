import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/types/blog";

interface HeroEditorialProps {
  post?: BlogPost;
}

export function HeroEditorial({ post }: HeroEditorialProps) {
  return (
    <section className="bg-carbon pb-8 pt-24 text-white md:pt-20">
      <div className="container">
        <header>
          <p className="font-tech text-[11px] lowercase tracking-wide text-white-50 md:text-xs">
            caderno técnico · atualidades
          </p>
          <div className="my-4 h-[3px] w-full bg-white" aria-hidden="true" />
        </header>

        <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-end lg:gap-8">
          <div className="flex h-full flex-col justify-between gap-4">
            <h1 className="font-display text-[clamp(3.75rem,6vw,6.5rem)] font-semibold leading-[0.78] tracking-[-0.075em]">
              Atualidades
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-white-70 md:text-base">
              Engenharia explicada com rigor: guias, custos, normas e decisões
              para construir melhor em Steel Frame.
            </p>
          </div>

          {post && (
            <article aria-label="Artigo em destaque">
              <Link
                href={`/atualidades/${post.slug}`}
                prefetch={false}
                className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-carbon-soft md:aspect-[16/6] lg:aspect-[16/7]">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    priority
                    fetchPriority="high"
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover grayscale-[12%] transition duration-700 ease-expo group-hover:scale-[1.025] group-hover:grayscale-0 motion-reduce:transform-none motion-reduce:transition-none"
                  />
                  <span className="absolute left-0 top-0 bg-white px-3 py-2 font-tech text-[10px] lowercase tracking-wide text-black md:px-4 md:text-xs">
                    em destaque
                  </span>
                </div>

                <div className="grid gap-3 border-t-[3px] border-white pt-3 md:grid-cols-[0.34fr_0.66fr] md:gap-5">
                  <div className="font-tech text-[10px] lowercase leading-relaxed tracking-wide text-white-50 md:text-xs">
                    <p className="text-white">{post.category}</p>
                    <p>{post.date} · {post.readTime}</p>
                  </div>

                  <div>
                    <h2 className="font-display text-2xl font-semibold leading-[1.02] tracking-tight md:text-3xl">
                      {post.title}
                    </h2>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white-70 md:text-base">
                      {post.excerpt}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-3 font-tech text-[10px] lowercase tracking-wide text-white md:text-xs">
                      ler análise
                      <span
                        className="h-[3px] w-8 bg-white transition-[width] duration-500 ease-expo group-hover:w-14 motion-reduce:transition-none"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
