---
tipo: context
criado: 2026-07-31
atualizado: 2026-07-31
tags:
  - ai/context
  - project/site
  - domain/admin
ai_summary: Comentários inline em /admin/documentacoes, estilo Notion. Três decisões que não são óbvias e custam caro se reabertas — a ponte por postMessage (o documento roda em iframe de origem opaca), a ancoragem por texto e não por id (o HTML é regenerado por upsert), e as funções serializadas com toString() precisarem ser autossuficientes (o bundle de servidor do Next é minificado, e a falha só aparece em produção). Tabelas documento_threads e documento_comentarios, migration 009.
status: active
escopo: berkahn
---

# Comentários inline nas documentações

> Selecionar um trecho de um documento em `/admin/documentacoes/[slug]`, abrir uma thread, responder, editar e resolver — com posição (comentário / dúvida / aprovo / reprovo). Implementado em 2026-07-31, PR [#39](https://github.com/danielbkfalci00/berkahn/pull/39).

Esta nota existe para **três decisões que parecem arbitrárias no código e não são**. Se alguém reabrir qualquer uma delas sem o contexto, vai reintroduzir um bug que já custou caro. O resto (nomes de componente, estilo) o código conta sozinho.

## 1. Por que a ponte por `postMessage`

O documento **não é React**. É um HTML standalone completo, guardado na coluna `documentos.html` e injetado num `<iframe sandbox="allow-scripts">` **sem `allow-same-origin`** — origem opaca. O admin não alcança o DOM dele: não dá para `getSelection()`, medir range nem pintar destaque de fora.

O sandbox é deliberado e continua certo ([[admin-setup]] descreve o painel; o motivo está comentado em `app/admin/documentacoes/[slug]/DocumentoViewer.tsx`): o `<style>` do documento é global e traz `* { margin: 0 }`, que sobrescreveria o layout do admin. E manter a origem opaca impede o HTML vindo do banco de ler cookies de sessão.

A saída foi injetar um script-ponte no HTML servido por `/raw` e conversar por mensagem.

**Assimetria que não é opcional**: child → parent usa a origem exata do admin, injetada pelo servidor (o documento não descobre sozinho — `window.parent.origin` lança). parent → child é **obrigatoriamente `'*'`**: origem opaca serializa como a string `"null"`, que não parseia como URL e faz `postMessage` lançar `SyntaxError`. Por isso nenhuma mensagem daqui carrega segredo.

**Validação no admin é por identidade de janela, não por origem.** `event.origin` vale `"null"` para *qualquer* frame opaco da página, então não distingue nada. O que vale é `event.source === iframeRef.current?.contentWindow` — referência de objeto, não forjável.

## 2. Por que a âncora é por texto, e não por id de elemento

Os documentos são **reescritos**. O relatório de performance é regenerado pelo cron todo mês, e o modo `--partial` reescreve o mesmo slug **várias vezes dentro do mês corrente**, com números diferentes a cada rodada.

Qualquer id posicional (`bloco-17`) desloca quando uma seção cresce; qualquer id por hash de conteúdo muda quando os números mudam — que é exatamente o caso. Então a âncora guarda o **trecho citado mais contexto** (modelo W3C Web Annotation): `texto_exato`, `prefixo`, `sufixo`, `posicao_relativa` e `ancora_secao`.

Três regras do motor (`lib/documentacoes/ancoragem.ts`) que existem por motivo concreto:

- **Índice e mapa de nós construídos na mesma passada.** O markdown-it deixa `\n` literal entre `</td>` e `<td>`; normalizar um `textContent` já pronto destruiria o mapeamento offset → nó.
- **`ancora_secao` é bônus de score, nunca filtro.** Como filtro duro, renomear um `<h2>` orfanaria tudo abaixo dele.
- **Limiar de confiança só quando há mais de uma ocorrência.** Este foi um defeito real, pego pelo harness: sem limiar, um quote ambíguo com o contexto destruído resolvia **na posição errada** com confiança 0,05 e era pintado como se estivesse certo. Com ocorrência única passa sempre — exigir contexto ali produziria órfão falso toda vez que o parágrafo vizinho fosse editado.

Comentário que não resolve vira **órfão explícito**, num grupo à parte do painel. É melhor do que apontar para o lugar errado com cara de acerto.

## 3. Por que `criarMotorAncoragem` e `bridgeMain` são autossuficientes

⚠️ **A pegadinha mais cara desta feature.**

As duas funções são serializadas com `Function.prototype.toString()` e injetadas no HTML (`lib/documentacoes/injecao.ts`). O **bundle de servidor do Next é minificado** — verificado em `.next/server/app/atualidades/page.js`: identificadores de uma letra e referências entre módulos via objeto do webpack (`c.d(b,{Q:()=>g})`).

Consequência: se uma delas chamar função de **outro módulo**, o `toString()` emite `(0,e.Ay)(…)`, e `e` não existe dentro do iframe. A ponte morre.

E o dev server **não minifica**. Ou seja: passa em desenvolvimento e quebra só em produção.

Daí a forma do código, que sem esta nota parece capricho:

- `ancoragem.ts` exporta **uma factory** que declara tudo no próprio corpo e devolve o motor
- a ponte recebe o motor **por parâmetro**
- nenhuma das duas importa nada em runtime — nem as constantes de `protocolo.ts`, que estão repetidas literalmente
- `import type` continua livre (some na compilação)

**Como verificar depois de mexer**: `npm run build` e depois `next start`, buscar o documento e conferir que o `<script>` injetado não contém `(0,x.y)(` nem `require(`. O harness em `app/dev-harness` roda no dev server e por isso **não** prova nada sobre isto — serve para a ancoragem, não para a serialização.

## Modelo de dados

`supabase/migrations/009_documentacao_comentarios.sql`. Duas tabelas: `documento_threads` é dona da âncora e do status; `documento_comentarios` é dona do texto. Resposta é só um comentário seguinte na mesma thread.

**O tipo vive no comentário, não na thread.** Uma thread aberta como dúvida pode receber "aprovo" de outra pessoa sem deixar de ser uma pergunta — que é o caso de uso pedido. A thread exibe o tipo do primeiro comentário.

`doc_versao` guarda `documentos.atualizado_em` no momento da criação. Quando defasado, o card avisa "o documento mudou depois deste comentário" — funciona porque `upsertDocumento` grava `atualizado_em` a cada upsert.

RLS `FOR ALL TO authenticated`, no padrão de `analytics_tasks`. **Obrigatória**: o middleware protege a rota, não a tabela, e a anon key alcança o PostgREST direto.

## Identidade — limitação conhecida

Todo mundo entra no admin com a **mesma conta compartilhada**, então `auth.uid()` não distingue ninguém. A atribuição é um nome digitado, guardado no `localStorage` (`hooks/use-autor.ts`). Não é identidade verificada e a interface não finge que é.

`autor_user_id` é gravado mesmo assim, para que migrar para contas reais depois não exija migration nem backfill. Migrar é um projeto próprio: hoje o código de acesso está hardcoded no bundle client (`components/admin/LoginForm.tsx`), o que é uma exposição independente desta feature.

## Fora de escopo, deliberado

Realtime (`postgres_changes`), menções `@`, notificação, e link público de revisão para quem não tem acesso ao admin.

## Ver também

- [[admin-setup]] — painel admin, autenticação, RLS
- [[stack-nextjs-supabase]] — arquitetura geral
- [[site]] — hub do projeto
