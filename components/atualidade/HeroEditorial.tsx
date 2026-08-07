import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/types/blog";

interface HeroEditorialProps {
  post?: BlogPost;
}

export function HeroEditorial({ post }: HeroEditorialProps) {
  return (
    <section className="bg-carbon pb-10 pt-24 text-white md:pb-12 md:pt-20 lg:pb-14">
      <div className="container">
        <header>
          <p className="font-tech text-[11px] lowercase tracking-wide text-white-50 md:text-xs">
            caderno técnico · atualidades
          </p>

          <div className="mt-4 border-t-[3px] border-white pt-5 md:pt-6">
            <div className="grid gap-4 md:grid-cols-12 md:items-end md:gap-6">
              <h1 className="font-display text-[clamp(3.5rem,4.6vw,5rem)] font-semibold leading-[0.88] tracking-[-0.06em] md:col-span-7">
                Atualidades
              </h1>
              <p className="max-w-md text-sm leading-relaxed text-white-70 md:col-span-4 md:col-start-9 md:text-base">
                Engenharia explicada com rigor: guias, custos, normas e decisões
                para construir melhor em Steel Frame.
              </p>
            </div>
          </div>
        </header>

        {post && (
          <article className="mt-8" aria-label="Artigo em destaque">
            <Link
              href={`/atualidades/${post.slug}`}
              prefetch={false}
              className="group grid border-b-[3px] border-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white lg:grid-cols-12 lg:items-stretch"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-carbon-soft lg:col-span-7 lg:aspect-auto lg:min-h-[420px] xl:min-h-[460px]">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover grayscale-[12%] transition duration-700 ease-expo group-hover:scale-[1.025] group-hover:grayscale-0 motion-reduce:transform-none motion-reduce:transition-none"
                />
              </div>

              <div className="flex flex-col border-t-[3px] border-white py-5 lg:col-span-5 lg:border-l-[3px] lg:border-t-0 lg:py-7 lg:pl-8 xl:pl-10">
                <div className="flex items-start justify-between gap-5 font-tech text-[10px] lowercase leading-relaxed tracking-wide md:text-xs">
                  <p className="text-white">em destaque · {post.category}</p>
                  <p className="shrink-0 text-right text-white-50">
                    {post.date} · {post.readTime}
                  </p>
                </div>

                <div className="mt-10 lg:my-auto lg:py-8">
                  <h2 className="font-display text-[clamp(2.25rem,3.2vw,3.5rem)] font-semibold leading-[0.98] tracking-[-0.035em]">
                    {post.title}
                  </h2>
                  <p className="mt-4 line-clamp-3 max-w-xl text-sm leading-relaxed text-white-70 md:text-base">
                    {post.excerpt}
                  </p>
                </div>

                <span className="mt-8 inline-flex items-center gap-3 self-start font-tech text-[10px] lowercase tracking-wide text-white md:text-xs lg:mt-0">
                  ler análise
                  <span
                    className="h-[3px] w-8 bg-white transition-[width] duration-500 ease-expo group-hover:w-14 motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </Link>
          </article>
        )}
      </div>
    </section>
  );
}
