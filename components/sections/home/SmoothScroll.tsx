"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import "lenis/dist/lenis.css";

/**
 * Smooth scroll escopado à home (montado em app/page.tsx, renderiza null).
 *
 * - Roda sobre o scroll nativo (Lenis): âncoras, sticky e a11y preservados.
 * - Com prefers-reduced-motion nada é instanciado — scroll 100% nativo.
 * - Sincroniza com ScrollTrigger via gsap.ticker (pattern canônico Lenis+GSAP).
 * - Pausa automaticamente quando qualquer modal trava o body: MutationObserver
 *   cobre tanto style.overflow inline (Sidebar/MenuProvider) quanto o atributo
 *   data-scroll-locked que o Radix/react-remove-scroll usa (ContactFormDialog),
 *   sem tocar na API de nenhum componente compartilhado.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // anchors: true — links #hash (ex.: "Ver projetos" do hero) rolam via Lenis;
    // sem isso o salto nativo é revertido pelo alvo interno do Lenis.
    const lenis = new Lenis({ autoRaf: false, lerp: 0.12, anchors: true });

    const handleScroll = () => ScrollTrigger.update();
    lenis.on("scroll", handleScroll);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const body = document.body;
    const isBodyLocked = () =>
      body.style.overflow === "hidden" || body.hasAttribute("data-scroll-locked");
    const syncWithBodyLock = () => {
      if (isBodyLocked()) {
        lenis.stop();
      } else {
        lenis.start();
      }
    };
    const observer = new MutationObserver(syncWithBodyLock);
    observer.observe(body, {
      attributes: true,
      attributeFilter: ["style", "data-scroll-locked"],
    });
    syncWithBodyLock();

    return () => {
      observer.disconnect();
      gsap.ticker.remove(raf);
      // lagSmoothing é global do GSAP — restaura os defaults ao sair da home
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, []);

  return null;
}
