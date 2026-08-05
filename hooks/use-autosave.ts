"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  criarMotorAutosave,
  type EstadoSave,
  type MotorAutosave,
} from "@/lib/conteudo/autosave";

/**
 * Casca React do motor em lib/conteudo/autosave.ts.
 *
 * A lógica toda mora lá porque é o que quebra em silêncio e precisa de teste
 * fora do navegador. Aqui só ficam o render e os handlers de evento.
 *
 * Não usa `useTransition`: `salvarBloco` não chama `revalidatePath` de
 * propósito, então não há re-render caro a agendar — e `isPending` é global à
 * transição, quando o que precisamos é um estado por bloco.
 */
export function useAutosave(
  valorInicial: string,
  salvar: (texto: string) => Promise<{ error: string | null }>
) {
  const [valor, setValor] = useState(valorInicial);
  const [estado, setEstado] = useState<EstadoSave>({ fase: "limpo" });

  // A action muda de identidade a cada render do pai; guardá-la num ref evita
  // recriar o motor (e perder o timer pendente) a cada re-render.
  const salvarRef = useRef(salvar);
  salvarRef.current = salvar;

  const motorRef = useRef<MotorAutosave | null>(null);
  if (motorRef.current === null) {
    motorRef.current = criarMotorAutosave({
      valorInicial,
      salvar: (texto) => salvarRef.current(texto),
      aoMudar: () => {
        const m = motorRef.current;
        if (!m) return;
        setValor(m.valor());
        setEstado(m.estado());
      },
    });
  }
  const motor = motorRef.current;

  useEffect(() => () => motor.destruir(), [motor]);

  const aoDigitar = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      motor.digitar(e.target.value);
      setValor(e.target.value);
    },
    [motor]
  );

  const aoSair = useCallback(() => motor.sair(), [motor]);

  const aoTeclar = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Local ao textarea, não em window: mata o "Salvar página" do navegador
      // sem precisar saber qual bloco está focado.
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        motor.salvarAgora();
      }
    },
    [motor]
  );

  const salvarAgora = useCallback(() => motor.salvarAgora(), [motor]);

  return { valor, estado, aoDigitar, aoSair, aoTeclar, salvarAgora };
}
