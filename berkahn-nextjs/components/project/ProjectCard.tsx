"use client";

import Image from "next/image";
import Link from "next/link";
import { Project, getCategoryLabel, formatArea } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Maximize2 } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projetos/${project.slug}`}
      className="group block overflow-hidden bg-white shadow-luxury-sm hover:shadow-luxury-lg transition-all duration-500"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={project.cardImage}
          alt={project.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

        {/* Badge categoria */}
        <div className="absolute top-4 left-4 z-10">
          <Badge
            variant="secondary"
            className="bg-white/90 text-black hover:bg-white px-3 py-1 text-xs uppercase tracking-wider font-medium"
          >
            {getCategoryLabel(project.category)}
          </Badge>
        </div>

        {/* Área em destaque */}
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center gap-1.5 bg-black/80 text-white px-3 py-1.5 text-sm font-medium">
            <Maximize2 className="w-3.5 h-3.5" />
            {formatArea(project.area.builtArea)}
          </div>
        </div>

        {/* Conteúdo inferior */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          <h3 className="text-white text-xl md:text-2xl font-heading font-medium mb-2 group-hover:translate-x-1 transition-transform duration-300">
            {project.name}
          </h3>
          <p className="text-white/80 text-sm line-clamp-2">
            {project.tagline}
          </p>
        </div>

        {/* Hover indicator */}
        <div className="absolute bottom-6 right-6 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <ArrowRight className="w-5 h-5 text-black" />
          </div>
        </div>
      </div>

      {/* Info bar inferior */}
      <div className="px-6 py-4 border-t border-black/5 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-black-70">
          <span className="flex items-center gap-1.5">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            {project.features.bedrooms} quarto{project.features.bedrooms !== 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1.5">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {project.features.bathrooms} banho{project.features.bathrooms !== 1 ? "s" : ""}
          </span>
        </div>

        <span className="text-sm font-medium text-black group-hover:text-black-70 transition-colors flex items-center gap-1">
          Ver projeto
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </span>
      </div>
    </Link>
  );
}
