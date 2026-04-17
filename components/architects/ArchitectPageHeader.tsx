"use client";

import { useEffect, useState } from "react";
import { Link } from "next-view-transitions";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface Props {
  studioName: string;
}

export function ArchitectPageHeader({ studioName }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    router.prefetch("/curadoria-berkahn");
    return () => window.removeEventListener("scroll", onScroll);
  }, [router]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-5 flex items-center justify-between transition-all duration-500 ${
        scrolled
          ? "bg-black/70 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <Link
        href="/curadoria-berkahn"
        className="group inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-300"
      >
        <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-500 ease-expo group-hover:-translate-x-1" />
        <span className="text-[11px] uppercase tracking-[0.25em]">
          Curadoria
        </span>
      </Link>

      <span className="absolute left-1/2 -translate-x-1/2 hidden sm:block text-[11px] uppercase tracking-[0.3em] text-white/70 whitespace-nowrap">
        BERKAHN <span className="text-white/30 mx-1">×</span> {studioName}
      </span>

      <div className="w-[160px]" />
    </header>
  );
}
