"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FounderCardProps {
  name: string;
  role: string;
  bio: string;
  image: string;
  className?: string;
}

export function FounderCard({
  name,
  role,
  bio,
  image,
  className
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
          className="object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-out"
          sizes="(max-width: 768px) 200px, 300px"
        />
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors duration-500" />
      </div>

      {/* Info */}
      <h3 className="font-heading text-xl sm:text-2xl font-semibold tracking-tight mb-1">
        {name}
      </h3>
      <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-black/50 mb-4">
        {role}
      </p>
      <p className="text-sm sm:text-base text-black/70 leading-relaxed max-w-xs line-clamp-4">
        {bio}
      </p>
    </motion.div>
  );
}
