"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Project, getCategoryLabel, formatArea } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Maximize2 } from "lucide-react";

interface ProjectCardPremiumProps {
  project: Project;
  index?: number;
  variant?: "default" | "featured";
}

export function ProjectCardPremium({
  project,
  index = 0,
  variant = "default",
}: ProjectCardPremiumProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position for parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation
  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // Transform mouse position to rotation
  const rotateX = useTransform(y, [-0.5, 0.5], ["2deg", "-2deg"]);
  const rotateY = useTransform(x, [-0.5, 0.5], ["-2deg", "2deg"]);

  // Image parallax on hover
  const imageX = useTransform(x, [-0.5, 0.5], ["-5px", "5px"]);
  const imageY = useTransform(y, [-0.5, 0.5], ["-5px", "5px"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    mouseX.set((e.clientX - centerX) / rect.width);
    mouseY.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const isFeatured = variant === "featured";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.19, 1, 0.22, 1],
      }}
    >
      <Link href={`/projetos/${project.slug}`} className="block">
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className={`group relative overflow-hidden bg-white shadow-luxury-sm hover:shadow-luxury-xl transition-shadow duration-700 ${
            isFeatured ? "aspect-[16/10]" : "aspect-[4/3]"
          }`}
        >
          {/* Image Container with parallax */}
          <motion.div
            style={{ x: imageX, y: imageY }}
            className="absolute inset-0 scale-105"
          >
            <Image
              src={project.cardImage}
              alt={project.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes={isFeatured ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
            />
          </motion.div>

          {/* Gradient Overlay - intensifies on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: isHovered ? 0.8 : 0.5 }}
            transition={{ duration: 0.5 }}
          />

          {/* Top badges */}
          <div className="absolute top-3 md:top-4 left-3 md:left-4 right-3 md:right-4 z-10 flex justify-between items-start">
            <Badge
              variant="secondary"
              className="bg-white/90 text-black hover:bg-white px-2 py-0.5 text-[10px] uppercase tracking-wide font-medium backdrop-blur-sm"
            >
              {getCategoryLabel(project.category)}
            </Badge>

            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-1 bg-black/80 text-white px-2 py-0.5 text-[11px] font-medium backdrop-blur-sm"
            >
              <Maximize2 className="w-3 h-3" />
              {formatArea(project.area.builtArea)}
            </motion.div>
          </div>

          {/* Content - slides up on hover */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-10"
            initial={{ y: 0 }}
            animate={{ y: isHovered ? -10 : 0 }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
          >
            {/* Project name */}
            <motion.h3
              className={`text-white font-heading font-medium mb-2 ${
                isFeatured
                  ? "text-2xl md:text-3xl lg:text-4xl"
                  : "text-xl md:text-2xl"
              }`}
            >
              {project.name}
            </motion.h3>

            {/* Tagline */}
            <motion.p
              className="text-white/80 text-sm md:text-base line-clamp-2 mb-4"
              initial={{ opacity: 0.8 }}
              animate={{ opacity: isHovered ? 1 : 0.8 }}
            >
              {project.tagline}
            </motion.p>

            {/* Features row - appears on hover */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex items-center gap-4 text-white/70 text-sm"
            >
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
                {project.features.bedrooms} quarto
                {project.features.bedrooms !== 1 ? "s" : ""}
              </span>
              <span className="w-1 h-1 rounded-full bg-white/50" />
              <span className="flex items-center gap-1.5">
                {project.features.bathrooms} banho
                {project.features.bathrooms !== 1 ? "s" : ""}
              </span>
              <span className="w-1 h-1 rounded-full bg-white/50" />
              <span>{project.constructionTime}</span>
            </motion.div>
          </motion.div>

          {/* View project button - appears on hover */}
          <motion.div
            className="absolute bottom-4 md:bottom-6 right-4 md:right-6 z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0.8,
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-luxury-md group-hover:shadow-luxury-lg transition-shadow">
              <ArrowRight className="w-5 h-5 text-black transition-transform duration-300 group-hover:translate-x-0.5" />
            </div>
          </motion.div>

          {/* Shine effect on hover */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, transparent 50%)",
            }}
            initial={{ x: "-100%" }}
            animate={{ x: isHovered ? "100%" : "-100%" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
}

// Simple variant without mouse tracking (better performance for grids)
export function ProjectCardSimple({ project, index = 0 }: { project: Project; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.19, 1, 0.22, 1],
      }}
    >
      <Link
        href={`/projetos/${project.slug}`}
        className="group block overflow-hidden bg-white shadow-luxury-sm hover:shadow-luxury-lg transition-all duration-500"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={project.cardImage}
            alt={project.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

          <div className="absolute top-3 left-3 z-10">
            <Badge
              variant="secondary"
              className="bg-white/90 text-black hover:bg-white px-2 py-0.5 text-[10px] uppercase tracking-wide font-medium"
            >
              {getCategoryLabel(project.category)}
            </Badge>
          </div>

          <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-1 bg-black/80 text-white px-2 py-0.5 text-[11px] font-medium">
              <Maximize2 className="w-3 h-3" />
              {formatArea(project.area.builtArea)}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
            <h3 className="text-white text-xl md:text-2xl font-heading font-medium mb-2 group-hover:translate-x-1 transition-transform duration-300">
              {project.name}
            </h3>
            <p className="text-white/80 text-sm line-clamp-2">
              {project.tagline}
            </p>
          </div>

          <div className="absolute bottom-6 right-6 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-black" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
