"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import type { BigNumber } from "@/lib/sustentabilidade-data";

interface CountingNumberProps {
  figure: BigNumber;
  /** Classe de tamanho do numeral. O prefixo e a unidade derivam dela em em. */
  className?: string;
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
export function CountingNumber({ figure, className = "" }: CountingNumberProps) {
  const rootRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

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
    { scope: rootRef, dependencies: [figure.from, figure.to] }
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
      {/* Faixa ("7 a 8"): o conector cai para 0,34em. Com o "a" no mesmo corpo
          dos dígitos, o numeral lê como erro de digitação, não como intervalo. */}
      <span data-count-value>
        {figure.value.includes(" a ") ? (
          <>
            {figure.value.split(" a ")[0]}
            <span className="mx-[0.1em] align-middle text-[0.4em] font-medium opacity-60">a</span>
            {figure.value.split(" a ")[1]}
          </>
        ) : (
          figure.value
        )}
      </span>
      {figure.unit && (
        <span className="ml-[0.06em] align-baseline text-[0.36em] font-medium opacity-70">
          {figure.unit.trim()}
        </span>
      )}
    </span>
  );
}
