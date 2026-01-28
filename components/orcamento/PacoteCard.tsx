"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { formatarValor } from "@/lib/orcamento-data";
import type { PacoteInvestimento } from "@/types/orcamento";
import { cn } from "@/lib/utils";

interface PacoteCardProps {
  pacote: PacoteInvestimento;
  metragem: number;
  index: number;
}

export function PacoteCard({
  pacote,
  metragem,
  index,
}: PacoteCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position for subtle parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation
  const springConfig = { damping: 30, stiffness: 200 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // Subtle rotation on hover
  const rotateX = useTransform(y, [-0.5, 0.5], ["1deg", "-1deg"]);
  const rotateY = useTransform(x, [-0.5, 0.5], ["-1deg", "1deg"]);

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

  const isDestaque = pacote.destaque;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.19, 1, 0.22, 1],
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: isDestaque ? rotateX : 0,
        rotateY: isDestaque ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "group relative flex flex-col h-full overflow-hidden rounded-xl transition-all duration-500",
        isDestaque
          ? "bg-white border-2 border-black/50 shadow-luxury-lg hover:shadow-luxury-xl scale-[1.01] z-10"
          : "bg-white border border-black/10 hover:border-black/20",
        "hover:scale-[1.02]"
      )}
    >
      {/* Image Header */}
      {pacote.imagemRepresentativa && (
        <div className="relative h-40 overflow-hidden">
          <Image
            src={pacote.imagemRepresentativa}
            alt={pacote.nome}
            fill
            className={cn(
              "object-cover transition-transform duration-700",
              isHovered && "scale-110"
            )}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
        </div>
      )}

      {/* Badge Destaque - Blueprint Brackets */}
      {isDestaque && (
        <>
          {/* Top-left corner bracket */}
          <svg
            className="absolute top-4 left-4 w-6 h-6 text-black z-20"
            viewBox="0 0 32 32"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M0,8 L0,0 L8,0" />
            <path d="M24,0 L32,0 L32,8" />
          </svg>

          {/* Center label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="absolute top-5 left-1/2 -translate-x-1/2 z-20"
          >
            <div className="bg-black text-white px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.25em] border-l-2 border-r-2 border-white whitespace-nowrap">
              Recomendado
            </div>
          </motion.div>

          {/* Bottom-right corner bracket */}
          <svg
            className="absolute bottom-4 right-4 w-6 h-6 text-black z-20"
            viewBox="0 0 32 32"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M0,24 L0,32 L8,32" />
            <path d="M24,32 L32,32 L32,24" />
          </svg>
        </>
      )}

      {/* Content */}
      <div className={cn("flex-1 flex flex-col p-6 lg:p-8", isDestaque && !pacote.imagemRepresentativa && "pt-14")}>
        {/* Header */}
        <div className="mb-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-1">
            Opção {String.fromCharCode(65 + index)}
          </p>
          <h3 className="text-2xl lg:text-3xl font-bold text-black mb-2">{pacote.nome}</h3>
          <p className="text-sm text-black/60 leading-relaxed">{pacote.descricao}</p>
        </div>

        {/* Price with highlight */}
        <div className="mb-6 pb-6 border-b border-black/10">
          <motion.p
            animate={isHovered ? { scale: 1.02 } : { scale: 1 }}
            className={cn(
              "text-4xl lg:text-5xl font-bold mb-2",
              isDestaque ? "text-black" : "text-black/90"
            )}
          >
            {formatarValor(pacote.valorTotal)}
          </motion.p>
          <p className="text-sm text-black/50">
            {formatarValor(pacote.valorM2)}/m² | {metragem}m²
          </p>
        </div>

        {/* Resumo com valores */}
        {pacote.resumo && pacote.resumo.length > 0 && (
          <div className="mt-6 pt-5 border-t border-black/10">
            <p className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-3">
              Resumo
            </p>
            <div className="space-y-2">
              {pacote.resumo.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-black/70">{item.nome}</span>
                  <span className="font-mono text-black/60">{formatarValor(item.valor)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Shine effect on hover - only for destaque card */}
      {isDestaque && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-30"
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 45%, transparent 50%)",
          }}
          initial={{ x: "-100%" }}
          animate={{ x: isHovered ? "100%" : "-100%" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      )}
    </motion.div>
  );
}
