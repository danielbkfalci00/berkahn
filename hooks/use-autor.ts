"use client";

import { useCallback, useEffect, useState } from "react";

const CHAVE = "berkahn:documentacoes:autor";

/**
 * Nome de quem comenta, guardado no navegador.
 *
 * Hoje todo mundo entra no admin com a mesma conta compartilhada, então
 * `auth.uid()` não distingue ninguém — o nome digitado é a única atribuição
 * possível. As server actions gravam o `auth.uid()` junto mesmo assim, para
 * que migrar para contas reais depois não exija migration nem backfill.
 *
 * Não é identidade verificada, e a UI não finge que é.
 */
export function useAutor() {
  const [nome, setNome] = useState<string | null>(null);
  // Antes do efeito o valor é sempre null, o que faria a UI piscar "informe seu
  // nome" para quem já preencheu. Este flag distingue "ainda não li" de "leu e
  // não tem".
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    try {
      setNome(window.localStorage.getItem(CHAVE));
    } catch {
      // Modo restrito de privacidade: segue sem persistir.
    }
    setCarregado(true);
  }, []);

  const salvar = useCallback((valor: string) => {
    const limpo = valor.trim().slice(0, 80);
    if (!limpo) return;
    setNome(limpo);
    try {
      window.localStorage.setItem(CHAVE, limpo);
    } catch {
      // Ignora: o nome vale para esta sessão.
    }
  }, []);

  return { nome, carregado, salvar };
}
