// Motor do autosave dos blocos de texto da pauta.
//
// Módulo NEUTRO e sem React de propósito: é a lógica mais delicada do quadro e
// o modo de falha é texto perdido em silêncio. Separado da casca, ele roda em
// Node e pode ser testado de verdade — ver scripts/db/testar-autosave.mjs.
// O hook hooks/use-autosave.ts é só o invólucro que liga isto ao render.

export type EstadoSave =
  | { fase: "limpo" }
  | { fase: "sujo" }
  | { fase: "salvando" }
  | { fase: "salvo"; em: number }
  | { fase: "erro"; mensagem: string };

export interface MotorAutosave {
  /** Texto corrente. Fonte da verdade enquanto a pessoa edita. */
  valor(): string;
  estado(): EstadoSave;
  /** Uma tecla: atualiza o texto e reagenda a gravação. */
  digitar(texto: string): void;
  /** Blur: cancela o timer e grava agora, se houver o que gravar. */
  sair(): void;
  /** Ctrl/Cmd+S e o botão de tentar de novo. */
  salvarAgora(): void;
  /** Reativa a assinatura após o ciclo de efeitos do React Strict Mode. */
  iniciar(): void;
  /** Limpa o timer pendente. Chamar no unmount. */
  destruir(): void;
}

interface Opcoes {
  valorInicial: string;
  salvar: (texto: string, anterior: string) => Promise<{ error: string | null; valorSalvo?: string }>;
  aoMudar: () => void;
  atrasoMs?: number;
  maxChars?: number;
  /** Injetável para o teste não depender do relógio real. */
  agora?: () => number;
}

export function criarMotorAutosave(opcoes: Opcoes): MotorAutosave {
  const atrasoMs = opcoes.atrasoMs ?? 1200;
  const maxChars = opcoes.maxChars ?? 60000;
  const agora = opcoes.agora ?? (() => Date.now());

  let valor = opcoes.valorInicial;
  let estado: EstadoSave = { fase: "limpo" };
  let timer: ReturnType<typeof setTimeout> | null = null;

  let confirmado = opcoes.valorInicial;
  let emVoo = false;
  let gravacaoPendente = false;
  let destruido = false;

  function mudar(proximo: EstadoSave) {
    estado = proximo;
    if (!destruido) opcoes.aoMudar();
  }

  function cancelarTimer() {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  }

  async function gravar() {
    cancelarTimer();
    if (destruido || valor.length > maxChars) return;
    // Uma única escrita por bloco. Ignorar respostas antigas não impediria a
    // própria escrita antiga de chegar ao banco depois da nova.
    if (emVoo) {
      gravacaoPendente = true;
      return;
    }
    // Nada sujo para gravar: evita bater no banco a cada blur de campo intacto.
    if (estado.fase === "limpo" || estado.fase === "salvo") return;

    const texto = valor;
    if (texto === confirmado) {
      mudar({ fase: "limpo" });
      return;
    }
    emVoo = true;
    gravacaoPendente = false;
    mudar({ fase: "salvando" });

    let res: { error: string | null; valorSalvo?: string };
    try {
      res = await opcoes.salvar(texto, confirmado);
    } catch {
      res = { error: "Não foi possível salvar. Confira a conexão e tente de novo." };
    } finally {
      emVoo = false;
    }

    if (!res.error) confirmado = res.valorSalvo ?? texto;
    if (destruido) return;
    if (res.error) {
      cancelarTimer();
      gravacaoPendente = false;
      mudar({ fase: "erro", mensagem: res.error });
      return;
    }
    if (valor === texto) {
      valor = confirmado;
      mudar({ fase: "salvo", em: agora() });
    } else if (valor.length <= maxChars) {
      mudar({ fase: "sujo" });
      if (gravacaoPendente) void gravar();
    }
  }

  return {
    valor: () => valor,
    estado: () => estado,

    digitar(texto: string) {
      valor = texto;

      // Recusa em vez de deixar truncar: `limpar()` na server action faz
      // slice(0, 60000) em SILÊNCIO, então sem esta barreira a tela diria
      // "salvo" para um texto que chegou cortado no banco.
      if (texto.length > maxChars) {
        cancelarTimer();
        mudar({
          fase: "erro",
          mensagem: `Passou de ${maxChars.toLocaleString("pt-BR")} caracteres. Corte o texto para conseguir salvar.`,
        });
        return;
      }

      mudar({ fase: "sujo" });
      cancelarTimer();
      timer = setTimeout(() => void gravar(), atrasoMs);
    },

    sair() {
      if (estado.fase === "erro" && valor.length > maxChars) return;
      void gravar();
    },

    salvarAgora() {
      if (valor.length > maxChars) return;
      // Retry depois de erro: o estado precisa voltar a "sujo", senão `gravar`
      // acha que não há o que fazer.
      if (estado.fase === "erro") mudar({ fase: "sujo" });
      void gravar();
    },

    iniciar() { destruido = false; },
    destruir() {
      destruido = true;
      cancelarTimer();
    },
  };
}

/** True quando há texto pendente de gravação — usado no guard de saída. */
export function temPendencia(estado: EstadoSave): boolean {
  return estado.fase === "sujo" || estado.fase === "salvando" || estado.fase === "erro";
}
