"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import type { BigNumber } from "@/lib/sustentabilidade-data";

interface CountingNumberProps {
  figure: BigNumber;
  /** Classe de tamanho do numeral. O prefixo e a unidade derivam dela em em. */
  className?: string;
  /**
   * Foto que preenche o numeral por dentro, via background-clip. Entra só
   * depois de a imagem carregar: se falhar, o número continua na cor da classe
   * em vez de sumir. A foto ainda deriva devagar dentro das letras enquanto a
   * seção passa, o que põe duas velocidades nos mesmos pixels.
   */
  fillImage?: string;
}

/**
 * Numeral grande que conta uma vez, quando entra na tela.
 *
 * O estado inicial do HTML é o valor FINAL, então sem JS ou com
 * prefers-reduced-motion o número já está certo. O GSAP só entra quando há
 * `from` e o usuário aceita movimento, e nesse caso reescreve o nó a partir do
 * zero. O prefixo (`~`, `< `, `até `) fica escondido durante a contagem para
 * "< 5%" não passar por "< 3%" no caminho.
 */
export function CountingNumber({ figure, className = "", fillImage }: CountingNumberProps) {
  const rootRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const root = rootRef.current;
      if (!root || !contextSafe) return;

      if (fillImage) {
        const probe = new window.Image();
        // contextSafe é obrigatório aqui: o onload roda depois que a execução
        // síncrona deste callback terminou, e o que é criado fora dela não entra
        // no contexto do useGSAP. Sem isso, sair da rota antes de a imagem
        // carregar deixaria um ScrollTrigger com scrub escutando para sempre.
        probe.onload = contextSafe(() => {
          root.style.backgroundImage = `url("${fillImage}")`;
          root.style.backgroundSize = "150% auto";
          root.style.backgroundPosition = "12% 30%";
          // A foto precisa ficar escura para o numeral ler como numeral sobre o
          // off-white. Sem o brightness, a planta de cimento vira um fantasma.
          root.style.filter = "grayscale(1) contrast(1.45) brightness(0.42)";
          root.classList.add("bg-clip-text", "text-transparent");
          if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            gsap.to(root, {
              backgroundPositionX: "88%",
              backgroundPositionY: "70%",
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            });
          }
        });
        probe.src = fillImage;
      }

      // Estreitados aqui fora: o TypeScript não leva a narrowing para dentro do
      // callback do matchMedia, e um cast ali dentro só calaria o compilador.
      const from = figure.from;
      const to = figure.to;
      if (from === undefined || to === undefined) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const numberEl = root.querySelector<HTMLElement>("[data-count-value]");
        const prefixEl = root.querySelector<HTMLElement>("[data-count-prefix]");
        if (!numberEl) return;

        const state = { value: from };
        const render = () => {
          const value = Math.round(state.value);
          numberEl.textContent = String(value);
          if (prefixEl) prefixEl.style.opacity = value === to ? "1" : "0";
        };
        render();

        gsap.to(state, {
          value: to,
          duration: 1.6,
          ease: "expo.out",
          onUpdate: render,
          scrollTrigger: { trigger: root, start: "top 96%", once: true },
        });
      });
    },
    { scope: rootRef, dependencies: [figure.from, figure.to, fillImage] }
  );

  return (
    <span
      ref={rootRef}
      className={`block font-display font-semibold leading-none tracking-tight tabular-nums ${className}`}
    >
      {figure.prefix && (
        <span
          data-count-prefix
          className="mr-[0.06em] align-baseline text-[0.42em] font-medium opacity-70"
        >
          {figure.prefix.trim()}
        </span>
      )}
      <span data-count-value>{figure.value}</span>
      {figure.unit && (
        <span className="ml-[0.06em] align-baseline text-[0.36em] font-medium opacity-70">
          {figure.unit.trim()}
        </span>
      )}
    </span>
  );
}
