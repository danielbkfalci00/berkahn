"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import type { Architect, ArchitectProject } from "@/lib/architects-data";
import { ArchitectImageLightbox } from "./ArchitectImageLightbox";

interface Props {
  architect: Architect;
}

export function ArchitectProjectsGallery({ architect }: Props) {
  // Tira o projeto-âncora da galeria (ele já tem destaque próprio)
  const galleryProjects = architect.projects.filter((p) => !p.isAnchor);

  const [openProject, setOpenProject] = useState<ArchitectProject | null>(null);

  return (
    <>
      <section className="relative w-full bg-off-white py-24 lg:py-36 px-6 lg:px-12">
        <div className="max-w-[1500px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
            className="flex items-end justify-between mb-12 lg:mb-16 flex-wrap gap-4"
          >
            <div>
              <p className="text-[11px] uppercase tracking-[0.4em] text-black-50 mb-3">
                Portfólio completo
              </p>
              <h3 className="font-heading text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-black">
                Demais projetos
              </h3>
            </div>
            <p className="text-sm text-black-50">
              {galleryProjects.length}{" "}
              {galleryProjects.length === 1 ? "projeto" : "projetos"} ·
              clique para abrir
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {galleryProjects.map((project, i) => (
              <motion.button
                key={project.id}
                onClick={() => setOpenProject(project)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                transition={{
                  duration: 0.9,
                  delay: (i % 3) * 0.12,
                  ease: [0.19, 1, 0.22, 1],
                }}
                whileHover={{ y: -4 }}
                className="group text-left bg-white overflow-hidden hover:shadow-luxury-md transition-shadow duration-500 cursor-zoom-in"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={project.images[0]}
                    alt={project.name}
                    fill
                    quality={78}
                    className="object-cover transition-transform duration-1000 ease-expo group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-700" />
                </div>
                <div className="p-5 lg:p-6 flex items-baseline justify-between gap-4">
                  <h4 className="font-heading text-lg md:text-xl font-light tracking-tight text-black truncate">
                    {project.name}
                  </h4>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-black-50 tabular-nums whitespace-nowrap">
                    {project.area} m² · {project.year}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <ArchitectImageLightbox
        open={!!openProject}
        images={openProject?.images ?? []}
        title={openProject?.name}
        meta={
          openProject
            ? `${openProject.area} m² · ${openProject.year} · ${openProject.city}`
            : undefined
        }
        footer={openProject?.program}
        onClose={() => setOpenProject(null)}
      />
    </>
  );
}
