"use client";

import { useEffect, useState } from "react";

/**
 * True quando a viewport passa do breakpoint. Devolve `null` até montar, para
 * o servidor e o primeiro render do cliente concordarem — checar `matchMedia`
 * direto no `useState` daria mismatch de hidratação.
 *
 * Quem consome precisa tratar o `null`: em geral, comportando-se como tela
 * larga (que é o caso mais comum no admin) ou não renderizando o que depende
 * da resposta.
 */
export function useTelaLarga(minWidth = 768): boolean | null {
  const [larga, setLarga] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${minWidth}px)`);
    setLarga(mq.matches);

    const aoMudar = (e: MediaQueryListEvent) => setLarga(e.matches);
    mq.addEventListener("change", aoMudar);
    return () => mq.removeEventListener("change", aoMudar);
  }, [minWidth]);

  return larga;
}
