"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

/**
 * Lista espelhada do servidor com mutação otimista.
 *
 * Generaliza o padrão de components/admin/analytics/TaskBoard.tsx (runOptimistic
 * + flashError + o useEffect de reconciliação), com uma diferença deliberada no
 * tratamento de erro.
 *
 * ⚠️ O TaskBoard reverte para a prop do servidor quando a action falha
 * (`setLocalTasks(tasks)`). Só que a action de reordenar não chama
 * `revalidatePath` — de propósito, para não causar flicker — então a prop é o
 * estado do último carregamento de página. Um erro depois de cinco arrastos
 * bem-sucedidos apaga os cinco da tela enquanto o banco os manteve, e a UI
 * passa a mentir até alguém recarregar.
 *
 * Aqui o erro pede um `router.refresh()`: busca a verdade em vez de adivinhá-la.
 */
export function useListaOtimista<T>(doServidor: T[]) {
  const router = useRouter();
  const [itens, setItens] = useState<T[]>(doServidor);
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciarTransicao] = useTransition();
  const timerErro = useRef<number | null>(null);

  // Reconcilia quando o servidor revalida (criar, excluir, vincular) ou no refresh.
  useEffect(() => {
    setItens(doServidor);
  }, [doServidor]);

  useEffect(() => {
    return () => {
      if (timerErro.current) window.clearTimeout(timerErro.current);
    };
  }, []);

  function mostrarErro(mensagem: string) {
    setErro(mensagem);
    if (timerErro.current) window.clearTimeout(timerErro.current);
    timerErro.current = window.setTimeout(() => setErro(null), 6000);
  }

  /**
   * Aplica `proximo` na hora e persiste em seguida. Em falha, mostra o erro e
   * re-busca do servidor.
   *
   * `proximo` é o array já calculado, não um updater: calcular dentro de
   * `setState` tentaria disparar a action de dentro de um updater, que o React
   * pode invocar duas vezes em StrictMode — é o bug que o TaskBoard tem hoje.
   */
  function aplicar(proximo: T[], persistir: () => Promise<{ error: string | null }>) {
    setItens(proximo);
    iniciarTransicao(async () => {
      const res = await persistir();
      if (res?.error) {
        mostrarErro(res.error);
        router.refresh();
      }
    });
  }

  return { itens, setItens, erro, mostrarErro, limparErro: () => setErro(null), pendente, aplicar };
}
