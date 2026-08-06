---
tipo: context
criado: 2026-08-05
atualizado: 2026-08-06
tags:
  - project/site
  - project/blog
  - project/linkedin
  - status/active
  - domain/integrations
ai_summary: "Fonte operacional do conteúdo em /admin/conteudo. Uma pauta tem trilhas Blog e LinkedIn independentes, estado geral derivado e reordenação transacional. Mover card nunca publica; somente /artigo publicar atualiza post+pauta. Migration 012 aplicada com 66 pautas e ICMS reconciliado; 013 aguarda deploy compatível."
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

## Mover no quadro nunca escreve em `posts.status`

As trilhas não aceitam arrastar para `publicado`. Aprovação é manual, mas
publicação é uma operação explícita: `/artigo publicar` chama a RPC
`publicar_artigo_pauta`, que altera `posts.status` e `status_blog` na mesma
transação. No LinkedIn, a action exige URL e data após a publicação externa.

O selo continua comparando a trilha Blog com o artigo real e torna divergências
visíveis. Cards `linkedin-acervo` ficam fora da checagem porque Blog não se
aplica a eles.

## Duas trilhas, três visões

A migration 012 adicionou `status_blog`, `status_linkedin`, ordens próprias,
`draft_path` e os campos de publicação do LinkedIn. Status e ordem são
`NULL` quando a plataforma não se aplica. A aba Geral deriva cinco estados e
não persiste um terceiro status: Planejada, Em produção, Aguardando aprovação,
Pronta para publicar e Concluída.

A RPC `mover_pautas_conteudo` recebe todo o diff de uma solta e executa em uma
transação. Qualquer item inválido desfaz o lote, evitando meia reordenação.
`activity_logs.details` registra canal, origem, estado anterior e novo.
Drag-and-drop, menu do card e ação em lote reutilizam a mesma RPC. O lote só
oferece etapas de produção; aprovação e publicação permanecem individuais.

> [!warning] Migration 013 ainda não existe
> `coluna`, `ordem` e o índice antigo permanecem somente para compatibilidade
> de deploy. Removê-los antes do smoke autenticado criaria uma janela sem volta.

> [!todo] Smoke autenticado
> Build, tipos, lint, testes puros e banco passaram. Três tentativas Playwright
> locais não receberam o DOM nem em `next dev` nem em `next start`, mesmo sem
> proxy; isso é bloqueio do loopback desta sessão, não aceite visual. Ainda é
> obrigatório testar logado e validar o clipboard com clique humano.

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

**JPEG não tem canal alfa.** O processamento pinta o fundo de branco. Os objetos
de staging usam paths fixos `conteudo/{id}/blog.jpg` e
`conteudo/{id}/linkedin.jpg`; troca não acumula extensões e remoção limpa banco
e Storage. Se um upload novo não chegar ao update e não havia capa anterior, a
action também remove o objeto recém-criado. LinkedIn valida 4:5 e normaliza para 1080×1350. No Blog, o CLI
`produzir` converte staging para WebP público por slug.

## Os comandos gravam na pauta

Desde 2026-08-06, `/pesquisa` e `/linkedin` **não criam mais arquivo no vault**. Eles chamam `scripts/conteudo/pauta.mjs`, que grava direto na coluna. Acabou a dupla escrita.

O script é versionado seletivamente e cobre `criar`, `gravar`,
`registrar-draft`, `produzir` e `publicar`. Três regras existem porque a
tabela **não tem versionamento nem undo**:

- **O texto vai por `--arquivo`, nunca no argv.** O output do `/pesquisa` tem milhares de caracteres com aspas, `$` e quebras de linha — isso quebra no PowerShell na primeira execução real.
- **Bloco preenchido não é sobrescrito sem
  `--forcar --confirmar-substituicao`**, e o anterior vai para
  `scripts/.cache/`.
- **Acima de 60.000 caracteres recusa**, batendo com o teto da UI. A server action corta em silêncio.

`publicar` aceita reexecução quando `draft_path` já aponta para
`publicados/`, e valida o frontmatter antes de mover o arquivo. Em falha da
RPC, restaura o markdown original.

O comando **pergunta** quando a busca devolve mais de um resultado ou nenhum — nunca escolhe nem cria pauta sozinho. As 66 vêm de um calendário pensado, e um tema já planejado com fraseado diferente viraria a 67ª duplicada.

`linkedin_briefing` (o ângulo do calendário) é **somente leitura** para os comandos: é a única cópia daquele texto.

`40-content/linkedin/` virou acervo congelado com quatro pastas. Somente ICMS
foi reconciliado no banco; os arquivos legados não foram apagados.

---

**Relacionado**: [[site]] · [[blog]] · [[linkedin]] · [[stack-nextjs-supabase]] · [[admin-setup]] · [[2026-08-calendario-editorial]]

**Contexto aplicado**: [[article-pipeline]] · [[seo-aeo-strategy]]
