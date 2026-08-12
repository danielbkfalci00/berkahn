---
tipo: context
criado: 2026-08-05
atualizado: 2026-08-12
tags:
  - project/site
  - project/blog
  - project/linkedin
  - status/active
  - domain/integrations
ai_summary: "Fonte operacional em /admin/conteudo. Status é livre e publicação real é derivada. Migrations 014–030 estão em produção; a 030 mantém revisão de artigo publicado staged até aprovação. /conteudo orquestra o CLI existente com contexto progressivo."
status: active
projeto: site
contextos_aplicados:
  - stack-nextjs-supabase
  - admin-setup
  - article-pipeline
---

# Quadro de conteúdo — arquitetura

> Substitui o Notion "Cronograma Conteúdo", que era preenchido à mão e vivia fora da ferramenta. Rotas: `/admin/conteudo` (quadro) e `/admin/conteudo/[id]` (card).

## A unidade é o assunto, não o artigo

`posts` é 1 linha = 1 artigo. Mas o trabalho real gira em torno de um **assunto**, que rende pesquisa, um artigo, um post de LinkedIn e duas capas. Os campos que ligariam essas peças (`linkedin_slug`, `material_visual_slug`) existiam em 14 de 41 artigos e estavam `null` em quase todos.

Daí `conteudo_pautas` ([migration 010](../../supabase/migrations/010_conteudo_pautas.sql)) ser tabela própria, e não colunas novas em `posts`: **um card existe antes de qualquer artigo** — 44 dos 66 nascem sem `post_id`, e 22 são posts de LinkedIn para artigos que já estão no ar.

O vínculo é FK com `ON DELETE SET NULL` e UNIQUE parcial. `CASCADE` apagaria semanas de pesquisa por causa de um artigo; `RESTRICT` faria o delete em `/admin/posts` falhar por uma tabela que aquela tela nem conhece. A UNIQUE **dispara de propósito** — quatro pautas Core são refresh de artigo existente, e ali o certo é fundir os cards, não duplicar.

## Status é posição; publicação real é outro fato

Qualquer status válido pode ser escolhido, em qualquer direção, mesmo com gaps.
O quadro registra a intenção operacional; ele não publica e não altera
`posts.status`. Os gaps permanecem visíveis como avisos e próxima ação.

Aprovação editorial continua manual. A publicação real do Blog existe somente
quando `posts.status = published`; no LinkedIn, somente quando URL e data estão
registradas. A visão Geral usa `estadoDoQuadro`: duas trilhas em `publicado` sem
esses artefatos ficam em **Pronta para publicar**, nunca em Concluída.

`/artigo publicar` é a única operação que publica post+pauta. Registrar a
publicação real do LinkedIn continua separado do chip de status.

## Duas trilhas, três visões

A migration 012 adicionou `status_blog`, `status_linkedin`, ordens próprias,
`draft_path` e os campos de publicação do LinkedIn. Status e ordem são
`NULL` quando a plataforma não se aplica. A aba Geral deriva cinco estados e
não persiste um terceiro status: Planejada, Em produção, Aguardando aprovação,
Pronta para publicar e Concluída.

A migration 013, aplicada em 2026-08-07, removeu `coluna`, `ordem` e
`idx_pautas_coluna_ordem`. As duas trilhas são agora a única fonte persistida.

A RPC `mover_pautas_conteudo` recebe todo o diff de uma solta e executa em uma
transação. Qualquer item inválido desfaz o lote, evitando meia reordenação.
`activity_logs.details` registra canal, origem, estado anterior e novo.
Drag-and-drop, chips inline, menu do card e ação em lote reutilizam a mesma RPC. Gaps nunca bloqueiam o movimento; aprovação e publicação real permanecem operações explícitas.

> [!success] Migration 013 aplicada
> Dry-run com rollback passou antes da execução. Em produção, as 66 pautas
> foram preservadas e o verificador confirmou zero colunas legadas.

> [!success] Smoke autenticado
> Playwright validou agenda, filtros por URL, renomeação, data e tags inline,
> status livre com gaps, clipboard com clique real e upload/remoção das duas
> capas. O teste removeu seus dados e confirmou zero objeto órfão no Storage.

## Hardening operacional e ciclo de aprendizado

As migrations 021–023 não mudam o modelo editorial. Elas reduzem custo e risco:

- `conteudo_pautas_quadro` exclui os blocos de até 60 mil caracteres da listagem;
- `atualizar_pauta_metadados` salva propriedades e tags na mesma transação;
- reordenação de `analytics_tasks` também é transacional;
- `conteudo_worker_heartbeats` diferencia fila vazia de worker desligado;
- `worker-de-conte-do-berkahn` está pausado: o agendamento antigo de 15 minutos
  aponta para um worktree removido e não deve ser reativado. Jobs permanecem na
  fila até execução manual ou até existir um worker leve, estável e aprovado;
- `conteudo_performance_snapshots` guarda janelas de 28 dias sem PII;
- recomendações entram pendentes em `analytics_tasks`, nunca alteram conteúdo;
- a migration 023 corrige apenas o label UTF-8 de `domain/integrations`.

A visão Geral é uma agenda: Atrasadas, próximos 7 dias, Depois e Sem data. Ela
carrega 18 cards inicialmente; Blog e LinkedIn continuam Kanban com drag livre.
Filtros ficam na URL, então voltar, recarregar ou compartilhar preserva o recorte.

## O seed é gerador, não importador

`scripts/conteudo/gerar-seed.mjs` lê o [[2026-08-calendario-editorial]] e os `ideas-2026-*.md` e **emite um `.sql` para revisão a olho**, em vez de escrever direto.

O calendário é documento estático e a tabela nasceu vazia: o seed roda **uma vez**. Um importador idempotente exigiria coluna de rastreio e `merge-duplicates` — máquina cara para sobreviver a uma reexecução que não vai acontecer. Como gerador, uma data errada aparece no diff antes de tocar o banco. Se sair errado: `DELETE FROM conteudo_pautas;` e gera de novo.

> [!warning] A armadilha do parser
> A herança de semana **atravessa a fronteira das tabelas de mês**: `S5 31/08` é declarado em agosto e sua herdeira é a primeira linha de setembro, sem linha anterior de onde herdar. Idem `S18` (novembro → dezembro). Herança "linha anterior da mesma tabela" produz data nula ou recalcula como `31/09`, que não existe. Por isso o mapa `semana → data` é montado varrendo **todas** as tabelas antes, numa passada só de leitura.
>
> E o calendário afirma 22 Core + 22 Exp; as tabelas entregam **21 + 23**. O gate é o total, não o split.

## Toda mutação confere a linha afetada

> [!danger] O PostgREST não devolve erro quando a RLS filtra a linha
> O `update` "funciona" e afeta **zero linhas**. Sem checar isso, uma sessão expirada com a aba aberta faz o autosave reportar "Salvo" para sempre enquanto o banco não recebe nada — e a pessoa perde o texto ao fechar a aba.
>
> Aconteceu de verdade na verificação: a tela dizia "Salvo às 18:41" com `null` no banco. As mutações de `app/admin/conteudo/actions.ts` conferem a linha afetada com `.select("id")` ou `.single()`, que erra em zero linhas.

Vale para qualquer tabela com RLS neste projeto, não só esta.

## O autosave

O motor vive em `lib/conteudo/autosave.ts`, **sem React**, e o hook é só a casca. É a lógica mais delicada do quadro e o modo de falha é texto perdido em silêncio — separado, ele roda em Node e tem teste real (`scripts/db/testar-autosave.mjs`, 25 casos).

Dois que importam: resposta atrasada não pode vencer a nova (contador monotônico descarta a fora de ordem), e acima de 60.000 caracteres **recusa** em vez de deixar truncar — o `limpar()` da action faz `slice` em silêncio.

Blur grava na hora, debounce de 1200 ms cobre quem digita sem tirar o foco, `Ctrl/Cmd+S` grava. Em erro o texto local **não** é revertido.

`BlocoColapsavel` não usa `components/ui/accordion.tsx`: a linha 47 renderiza o `Content` sem `forceMount`, então fechar **desmonta** o textarea e mata o timer do debounce. Aqui o corpo fica sempre montado, escondido com `hidden`, e o indicador de gravação vive no cabeçalho — bloco fechado com pendência continua sinalizando.

## Duas armadilhas dos blocos de capa e artigo

**`listarArtigosVinculaveis` exclui o artigo da própria pauta.** A query filtra todo post que já pertence a alguma pauta — inclusive a que está aberta. Alimentar um seletor só com essa lista faria um card que **tem** artigo mostrar "nenhum selecionado", e os 22 cards de acervo são exatamente esse caso. Por isso `BlocoArtigo` lê o vínculo atual de `pauta.artigo` e usa a lista só para **trocar**.

**JPEG não tem canal alfa.** O processamento pinta o fundo de branco. O upload
usa path versionado por SHA-256 em `conteudo/{id}/{canal}/{hash}.jpg`: primeiro
envia, depois atualiza o banco e só então remove a versão anterior. Se o update
falhar, a versão nova é apagada e a anterior permanece. Falha de cleanup fica
visível com retry no card. LinkedIn valida 4:5 e normaliza para 1080×1350. No
Blog, o CLI `produzir` converte staging para WebP público por slug.

## Os comandos gravam na pauta

Desde 2026-08-06, `/pesquisa` e `/linkedin` **não criam mais arquivo no vault**. Eles chamam `scripts/conteudo/pauta.mjs`, que grava direto na coluna. Acabou a dupla escrita.

O script é versionado seletivamente e cobre `selecionar`, `criar`, `gravar`,
`tags`, `capa`, `registrar-draft`, `produzir`, `aprovar` e `publicar`. Três regras existem porque a
tabela **não tem versionamento nem undo**:

- **O texto vai por `--arquivo`, nunca no argv.** O output do `/pesquisa` tem milhares de caracteres com aspas, `$` e quebras de linha — isso quebra no PowerShell na primeira execução real.
- **Bloco preenchido não é sobrescrito sem
  `--forcar --confirmar-substituicao`**, e o anterior vai para
  `scripts/.cache/`.
- **Acima de 60.000 caracteres recusa**, batendo com o teto da UI. A server action corta em silêncio.

`capa --canal=linkedin` move a trilha para `produzido` quando o texto já existe,
espelhando a regra que `gravar` aplica no sentido inverso. Antes disso a
transição só disparava ao gravar o texto **depois** da capa, então subir a capa
por último deixava a trilha presa em `producao` com tudo pronto. `produzir` não
faz o mesmo no Blog de propósito: lá o `produzido` exige `post_id` e
`draft_path`, não só a capa.

`publicar` aceita reexecução quando `draft_path` já aponta para `publicados/`,
e valida o frontmatter antes de mover o arquivo. Em atualização do mesmo slug,
a migration 030 separa revisão e live: `produzir` guarda o objeto novo em
`post_draft_payload`, sem mudar o post `published`; `publicar` regenera a WebP a
partir da capa versionada no Storage, promove markdown+capa com backup e a RPC
aplica o payload, limpa staging e muda pauta atomicamente. Em falha do banco, os
arquivos são restaurados. Assim, a aprovação não depende do cache ou da máquina
que produziu a revisão.

`selecionar --escopo=pacote` evita começar mais trabalho quando já existe WIP e
usa desempate determinístico: aprovação pendente, fila, trabalho em curso, data,
prioridade e ordem. O card copia um prompt completo; `.claude/commands/conteudo.md`
limita o run a uma pauta e oito transições. O worker de 15 minutos continua
pausado.

O comando **pergunta** quando a busca devolve mais de um resultado ou nenhum — nunca escolhe nem cria pauta sozinho. As 66 vêm de um calendário pensado, e um tema já planejado com fraseado diferente viraria a 67ª duplicada.

`linkedin_briefing` (o ângulo do calendário) é **somente leitura** para os comandos: é a única cópia daquele texto.

`40-content/linkedin/` virou acervo congelado com quatro pastas. Somente ICMS
foi reconciliado no banco; os arquivos legados não foram apagados.

---

**Relacionado**: [[site]] · [[blog]] · [[linkedin]] · [[stack-nextjs-supabase]] · [[admin-setup]] · [[2026-08-calendario-editorial]]

**Contexto aplicado**: [[article-pipeline]] · [[seo-aeo-strategy]]
