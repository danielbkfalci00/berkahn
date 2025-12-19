"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";

interface FounderCardProps {
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin?: string;
  className?: string;
  imagePosition?: "top" | "center" | "bottom" | string;
}

export function FounderCard({
  name,
  role,
  bio,
  image,
  linkedin,
  className,
  imagePosition = "center"
}: FounderCardProps) {
  return (
    <motion.div
      className={cn("flex flex-col items-center text-center", className)}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
    >
      {/* Photo */}
      <div className="relative w-48 h-64 sm:w-56 sm:h-72 md:w-64 md:h-80 lg:w-72 lg:h-96 mb-6 overflow-hidden rounded-sm">
        <Image
          src={image}
          alt={`${name} - ${role}`}
          fill
          className={cn(
            "object-cover transition-transform duration-700 ease-out hover:scale-105",
            imagePosition === "top" && "object-top",
            imagePosition === "bottom" && "object-bottom"
          )}
          style={
            imagePosition !== "top" && imagePosition !== "bottom" && imagePosition !== "center"
              ? { objectPosition: imagePosition }
              : undefined
          }
          sizes="(max-width: 768px) 200px, 300px"
        />
      </div>

      {/* Info */}
      <h3 className="font-heading text-xl sm:text-2xl font-semibold tracking-tight mb-1">
        {name}
      </h3>
      <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-black/50 mb-4">
        {role}
      </p>
      <p className="text-sm sm:text-base text-black/70 leading-relaxed max-w-xs">
        {bio}
      </p>

      {/* LinkedIn Link */}
      {linkedin && (
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-black/60 hover:text-black transition-colors"
          aria-label={`LinkedIn de ${name}`}
        >
          <Linkedin className="w-5 h-5" />
        </a>
      )}
    </motion.div>
  );
}
