"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Architect, ArchitectProject } from "@/lib/architects-data";

interface Props {
  architect: Architect;
}

export function ArchitectProjectsGallery({ architect }: Props) {
  // Tira o projeto-âncora da galeria (ele já tem destaque próprio)
  const galleryProjects = architect.projects.filter((p) => !p.isAnchor);

  const [openProject, setOpenProject] = useState<ArchitectProject | null>(null);
  const [imageIndex, setImageIndex] = useState(0);

  const handleOpen = (project: ArchitectProject) => {
    setOpenProject(project);
    setImageIndex(0);
  };

  const handleClose = () => {
    setOpenProject(null);
    setImageIndex(0);
  };

  const next = () => {
    if (!openProject) return;
    setImageIndex((i) => (i + 1) % openProject.images.length);
  };

  const prev = () => {
    if (!openProject) return;
    setImageIndex(
      (i) => (i - 1 + openProject.images.length) % openProject.images.length
    );
  };

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
                onClick={() => handleOpen(project)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                transition={{
                  duration: 0.9,
                  delay: (i % 3) * 0.12,
                  ease: [0.19, 1, 0.22, 1],
                }}
                whileHover={{ y: -4 }}
                className="group text-left bg-white overflow-hidden hover:shadow-luxury-md transition-shadow duration-500"
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

      {/* Lightbox */}
      <Dialog open={!!openProject} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent
          hideCloseButton
          className="max-w-[95vw] w-[95vw] h-[90vh] p-0 bg-black border-0 overflow-hidden"
        >
          <DialogTitle className="sr-only">
            {openProject?.name ?? "Projeto"}
          </DialogTitle>

          {openProject && (
            <div className="relative w-full h-full flex flex-col">
              {/* Top bar */}
              <div className="flex items-center justify-between px-6 lg:px-10 py-5 text-white">
                <div className="space-y-1">
                  <h4 className="font-heading text-xl md:text-2xl font-light tracking-tight">
                    {openProject.name}
                  </h4>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-white/60">
                    {openProject.area} m² · {openProject.year} ·{" "}
                    {openProject.city}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-light tabular-nums text-white/70 hidden sm:inline">
                    {String(imageIndex + 1).padStart(2, "0")} /{" "}
                    {String(openProject.images.length).padStart(2, "0")}
                  </span>
                  <button
                    onClick={handleClose}
                    className="p-2 text-white/70 hover:text-white transition-colors"
                    aria-label="Fechar"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Image area */}
              <div className="flex-1 relative flex items-center justify-center px-6 lg:px-16 pb-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={imageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={openProject.images[imageIndex]}
                      alt={`${openProject.name} — ${imageIndex + 1}`}
                      fill
                      className="object-contain"
                      sizes="95vw"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>

                {openProject.images.length > 1 && (
                  <>
                    <button
                      onClick={prev}
                      className="absolute left-2 lg:left-6 top-1/2 -translate-y-1/2 p-3 text-white/60 hover:text-white transition-colors"
                      aria-label="Imagem anterior"
                    >
                      <ChevronLeft className="w-7 h-7 lg:w-9 lg:h-9" />
                    </button>
                    <button
                      onClick={next}
                      className="absolute right-2 lg:right-6 top-1/2 -translate-y-1/2 p-3 text-white/60 hover:text-white transition-colors"
                      aria-label="Próxima imagem"
                    >
                      <ChevronRight className="w-7 h-7 lg:w-9 lg:h-9" />
                    </button>
                  </>
                )}
              </div>

              {/* Bottom — program */}
              <div className="px-6 lg:px-10 py-4 border-t border-white/10 text-white/60 text-xs uppercase tracking-[0.2em]">
                {openProject.program}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
