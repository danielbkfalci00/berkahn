// Testa o motor do autosave (lib/conteudo/autosave.ts) contra a fonte real.
//
// É a lógica mais delicada do quadro e o modo de falha é texto perdido em
// silêncio — o tipo de defeito que não aparece em teste manual. A RLS barra a
// escrita fora de sessão, então o round-trip fica para o Bruno; a máquina de
// estados não precisa de servidor.
//
// Compila o TS na hora com o tsc do projeto: testar uma cópia não provaria nada.
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = mkdtempSync(join(tmpdir(), "autosave-"));
execFileSync(
  process.execPath,
  [fileURLToPath(import.meta.resolve("typescript/lib/tsc.js")), "lib/conteudo/autosave.ts",
   "--module", "esnext", "--target", "es2022",
   "--moduleResolution", "bundler", "--outDir", dir],
  { stdio: "pipe" }
);
const { criarMotorAutosave, temPendencia } = await import(
  `file:///${join(dir, "autosave.js").replace(/\\/g, "/")}`
);

let falhas = 0;
function checar(nome, condicao, detalhe = "") {
  if (!condicao) falhas++;
  console.log(`  ${condicao ? "PASSOU" : "FALHOU  <<<<"}  ${nome}${detalhe ? ` — ${detalhe}` : ""}`);
}
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

/** Motor com `salvar` controlável, para simular rede lenta e erro. */
function montar({ atrasoMs = 30, responder } = {}) {
  const chamadas = [];
  const motor = criarMotorAutosave({
    valorInicial: "",
    atrasoMs,
    aoMudar: () => {},
    agora: () => 1_000_000,
    salvar: (texto) => {
      const registro = { texto };
      chamadas.push(registro);
      return responder ? responder(texto, chamadas.length) : Promise.resolve({ error: null });
    },
  });
  return { motor, chamadas };
}

// --------------------------------------------------------------------------
console.log("\nDEBOUNCE E BLUR");
{
  const { motor, chamadas } = montar();
  motor.digitar("a");
  motor.digitar("ab");
  motor.digitar("abc");
  checar("digitar não grava na hora", chamadas.length === 0);
  checar("fica sujo enquanto digita", motor.estado().fase === "sujo");

  await esperar(80);
  checar("debounce grava UMA vez, não uma por tecla", chamadas.length === 1, `${chamadas.length} chamada(s)`);
  checar("grava o texto final", chamadas[0]?.texto === "abc", chamadas[0]?.texto);
  checar("estado vira salvo", motor.estado().fase === "salvo", motor.estado().fase);
  motor.destruir();
}
{
  const { motor, chamadas } = montar({ atrasoMs: 5000 });
  motor.digitar("x");
  motor.sair();
  await esperar(30);
  checar("blur grava sem esperar o debounce", chamadas.length === 1);
  motor.destruir();
}
{
  const { motor, chamadas } = montar();
  motor.sair();
  await esperar(30);
  checar("blur em campo intacto não bate no banco", chamadas.length === 0);
  motor.destruir();
}
{
  const { motor, chamadas } = montar();
  motor.digitar("y");
  await esperar(60);
  motor.sair();
  await esperar(30);
  checar("blur depois de salvo não regrava", chamadas.length === 1, `${chamadas.length}`);
  motor.destruir();
}

// --------------------------------------------------------------------------
console.log("\nSEQUENCIAMENTO — resposta antiga não pode vencer a nova");
{
  // Primeira gravação demora 120ms e FALHA; a segunda demora 10ms e passa.
  // Sem o contador, o erro antigo chega por último e a tela mente.
  const { motor } = montar({
    atrasoMs: 5,
    responder: (_t, n) =>
      n === 1
        ? esperar(120).then(() => ({ error: "erro antigo" }))
        : esperar(10).then(() => ({ error: null })),
  });

  motor.digitar("primeiro");
  await esperar(20);           // dispara a 1ª, que fica em voo
  motor.digitar("segundo");
  await esperar(20);           // dispara a 2ª
  await esperar(150);          // a 1ª responde depois da 2ª

  checar(
    "resposta atrasada que falhou não sobrescreve o salvo novo",
    motor.estado().fase === "salvo",
    `terminou em "${motor.estado().fase}"`
  );
  motor.destruir();
}
{
  // Digitou DURANTE a gravação: o estado tem que voltar a sujo, não a salvo —
  // senão o texto novo fica só na tela e ninguém percebe.
  const { motor } = montar({
    atrasoMs: 5,
    responder: () => esperar(60).then(() => ({ error: null })),
  });
  motor.digitar("antes");
  await esperar(20);
  motor.digitar("antes + depois");
  await esperar(60);
  checar(
    "digitar durante a gravação mantém sujo",
    motor.estado().fase === "sujo" || motor.estado().fase === "salvando",
    motor.estado().fase
  );
  motor.destruir();
}

// --------------------------------------------------------------------------
console.log("\nERRO E RETRY");
{
  let deveFalhar = true;
  const { motor, chamadas } = montar({
    atrasoMs: 5,
    responder: () => Promise.resolve(deveFalhar ? { error: "sem rede" } : { error: null }),
  });

  motor.digitar("texto que importa");
  await esperar(40);
  checar("erro vira estado de erro", motor.estado().fase === "erro", motor.estado().fase);
  checar("erro carrega a mensagem", motor.estado().mensagem === "sem rede");
  checar("o texto local NÃO é revertido", motor.valor() === "texto que importa");

  deveFalhar = false;
  motor.salvarAgora();
  await esperar(30);
  checar("retry regrava", chamadas.length === 2, `${chamadas.length} chamada(s)`);
  checar("retry chega a salvo", motor.estado().fase === "salvo", motor.estado().fase);
  motor.destruir();
}

// --------------------------------------------------------------------------
console.log("\nTETO DE CARACTERES");
{
  const { motor, chamadas } = montar({ atrasoMs: 5 });
  motor.digitar("x".repeat(60001));
  await esperar(40);
  checar("acima de 60k não grava", chamadas.length === 0, `${chamadas.length} chamada(s)`);
  checar("avisa em vez de truncar calado", motor.estado().fase === "erro", motor.estado().fase);
  checar("o texto continua inteiro na tela", motor.valor().length === 60001);

  motor.sair();
  motor.salvarAgora();
  await esperar(30);
  checar("blur e Ctrl+S também não gravam acima do teto", chamadas.length === 0);

  motor.digitar("x".repeat(100));
  await esperar(40);
  checar("volta a gravar quando cabe", chamadas.length === 1);
  motor.destruir();
}

// --------------------------------------------------------------------------
console.log("\nGUARD DE SAÍDA E CLEANUP");
{
  checar("limpo não tem pendência", !temPendencia({ fase: "limpo" }));
  checar("salvo não tem pendência", !temPendencia({ fase: "salvo", em: 1 }));
  checar("sujo tem pendência", temPendencia({ fase: "sujo" }));
  checar("salvando tem pendência", temPendencia({ fase: "salvando" }));
  checar("erro tem pendência", temPendencia({ fase: "erro", mensagem: "x" }));
}
{
  const { motor, chamadas } = montar({ atrasoMs: 40 });
  motor.digitar("vai sumir");
  motor.destruir();
  await esperar(80);
  checar("destruir cancela o timer pendente", chamadas.length === 0, `${chamadas.length} chamada(s)`);
}

rmSync(dir, { recursive: true, force: true });
console.log(falhas === 0 ? "\n✅ tudo passou" : `\n❌ ${falhas} falha(s)`);
process.exit(falhas === 0 ? 0 : 1);
