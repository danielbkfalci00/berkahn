"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Copiar para a área de transferência, com fallback para contexto inseguro.
 *
 * ⚠️ A decisão de caminho é **síncrona, antes de qualquer `await`**. Em HTTP
 * simples — abrir o admin pelo IP da rede para testar no celular —
 * `navigator.clipboard` é `undefined`, não lança: não dá para descobrir isso
 * num `catch`. E se o `await` acontecer primeiro, o gesto do usuário já
 * expirou e o `execCommand` do fallback também falha.
 */
export function useCopiar(msDeAviso = 2000) {
  const [copiado, setCopiado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    []
  );

  const sinalizar = useCallback(() => {
    setErro(null);
    setCopiado(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopiado(false), msDeAviso);
  }, [msDeAviso]);

  const copiar = useCallback(
    (texto: string) => {
      if (!texto) return;

      const temApiModerna =
        typeof navigator !== "undefined" &&
        Boolean(navigator.clipboard) &&
        window.isSecureContext;

      if (temApiModerna) {
        navigator.clipboard.writeText(texto).then(sinalizar, () =>
          setErro("Não consegui copiar. Selecione o texto e use Ctrl+C.")
        );
        return;
      }

      // Fallback. `opacity:0` e não `display:none`: escondido de verdade o
      // campo não pode ser selecionado, e sem seleção não há o que copiar.
      const campo = document.createElement("textarea");
      campo.value = texto;
      campo.readOnly = true; // evita abrir o teclado no iOS
      campo.style.cssText =
        "position:fixed;top:0;left:0;opacity:0;pointer-events:none";
      document.body.appendChild(campo);
      try {
        campo.select();
        // No iOS, select() sozinho não seleciona campo readonly.
        campo.setSelectionRange(0, texto.length);
        if (document.execCommand("copy")) sinalizar();
        else setErro("Não consegui copiar. Selecione o texto e use Ctrl+C.");
      } catch {
        setErro("Não consegui copiar. Selecione o texto e use Ctrl+C.");
      } finally {
        document.body.removeChild(campo);
      }
    },
    [sinalizar]
  );

  return { copiado, erro, copiar };
}
