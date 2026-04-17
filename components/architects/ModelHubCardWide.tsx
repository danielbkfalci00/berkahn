"use client";

import { useRef } from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { useRouter } from "next/navigation";
import { motion, useInView } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/types/project";

interface Props {
  project: Project;
  reversed?: boolean;
  index: number;
  total: number;
}

export function ModelHubCardWide({
  project,
  reversed = false,
  index,
  total,
}: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const router = useRouter();
  const href = `/curadoria-berkahn/modelos/${project.slug}`;
  const prefetch = () => router.prefetch(href);

  return (
    <section
      ref={ref}
      className="relative w-full bg-off-white py-24 lg:py-36 overflow-hidden"
    >
      {/* Section index */}
      <div className="absolute top-12 left-6 lg:left-12 z-10">
        <span className="font-heading text-sm tracking-[0.3em] text-black-30">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>

      <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            className={`relative lg:col-span-7 aspect-[4/3] lg:aspect-[5/4] overflow-hidden group ${
              reversed ? "lg:order-2" : ""
            }`}
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1] }}
          >
            <Link
              href={href}
              onMouseEnter={prefetch}
              onFocus={prefetch}
              className="block w-full h-full"
              style={{ viewTransitionName: `model-${project.slug}` }}
            >
              <Image
                src={project.heroImage}
                alt={`${project.name} — Modelo Berkahn`}
                fill
                quality={78}
                className="object-cover transition-transform duration-1000 ease-expo group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-700" />

              <div className="absolute bottom-6 right-6 px-5 py-3 bg-white text-black text-xs uppercase tracking-[0.25em] opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-700 ease-expo flex items-center gap-2">
                Ver modelo
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </motion.div>

          {/* Info */}
          <motion.div
            className={`lg:col-span-5 space-y-8 ${
              reversed ? "lg:order-1 lg:pl-8" : "lg:pr-8"
            }`}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
          >
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.4em] text-black-50">
                Linha Berkahn · Modelo pronto
              </p>
              <h3 className="font-heading text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05] tracking-tight">
                {project.name}
              </h3>
            </div>

            <p className="text-lg lg:text-xl text-black-70 leading-relaxed font-light">
              {project.tagline}
            </p>

            {/* Mini-meta */}
            <div className="flex items-center gap-8 pt-2 text-sm flex-wrap">
              <div>
                <span className="block text-[10px] uppercase tracking-[0.25em] text-black-30 mb-1">
                  Área
                </span>
                <span className="font-light tabular-nums">
                  {project.area.builtArea.toFixed(0)} m²
                </span>
              </div>
              <div className="w-px h-8 bg-black-10" />
              <div>
                <span className="block text-[10px] uppercase tracking-[0.25em] text-black-30 mb-1">
                  Dorms
                </span>
                <span className="font-light tabular-nums">
                  {project.features.bedrooms}
                </span>
              </div>
              <div className="w-px h-8 bg-black-10" />
              <div>
                <span className="block text-[10px] uppercase tracking-[0.25em] text-black-30 mb-1">
                  Banhos
                </span>
                <span className="font-light tabular-nums">
                  {project.features.bathrooms}
                </span>
              </div>
              {project.constructionTime && (
                <>
                  <div className="w-px h-8 bg-black-10" />
                  <div>
                    <span className="block text-[10px] uppercase tracking-[0.25em] text-black-30 mb-1">
                      Construção
                    </span>
                    <span className="font-light tabular-nums">
                      {project.constructionTime}
                    </span>
                  </div>
                </>
              )}
            </div>

            <Link
              href={href}
              onMouseEnter={prefetch}
              onFocus={prefetch}
              className="group/cta inline-flex items-center gap-3 pt-4"
            >
              <span className="text-xs uppercase tracking-[0.3em] border-b border-black/30 pb-1 group-hover/cta:border-black transition-colors duration-300">
                Ver detalhes do modelo
              </span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-500 ease-expo group-hover/cta:translate-x-1 group-hover/cta:-translate-y-1" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
