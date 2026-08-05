---
tipo: context
criado: 2026-08-05
atualizado: 2026-08-05
tags:
  - project/site
  - project/blog
  - project/linkedin
  - status/active
  - domain/integrations
ai_summary: "Quadro Kanban de pautas em /admin/conteudo. A unidade é o ASSUNTO, não o artigo: um card agrega insights, pesquisa, artigo (por FK), post de LinkedIn e capas. Quatro decisões que a próxima sessão re-derivaria sozinha: por que a pauta é entidade separada de posts, por que o quadro nunca escreve posts.status, por que o seed é gerador de uma vez só, e por que toda mutação confere a linha afetada (RLS não devolve erro, devolve zero linhas)."
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

## O quadro nunca escreve em `posts.status`

Arrastar um card para "Publicado" move o card, não publica o artigo. Publicar continua sendo ato explícito no editor de posts.

O preço é que a coluna do quadro e o estado real do artigo podem discordar. Em vez de esconder isso, `SeloPostVinculado` **mostra**: o selo traz o status real e acende um aviso quando os dois divergem. Cards `linkedin-acervo` ficam fora da checagem — eles nascem de artigo já publicado, e sem a exceção o aviso apareceria em 22 dos 66 de uma vez, ensinando a ignorá-lo.

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
> Aconteceu de verdade na verificação: a tela dizia "Salvo às 18:41" com `null` no banco. As oito mutações de `app/admin/conteudo/actions.ts` agora conferem: cinco com `.select("id")` + checagem de vazio, três já cobertas por `.single()`, que erra em zero linhas.

Vale para qualquer tabela com RLS neste projeto, não só esta.

## O autosave

O motor vive em `lib/conteudo/autosave.ts`, **sem React**, e o hook é só a casca. É a lógica mais delicada do quadro e o modo de falha é texto perdido em silêncio — separado, ele roda em Node e tem teste real (`scripts/db/testar-autosave.mjs`, 25 casos).

Dois que importam: resposta atrasada não pode vencer a nova (contador monotônico descarta a fora de ordem), e acima de 60.000 caracteres **recusa** em vez de deixar truncar — o `limpar()` da action faz `slice` em silêncio.

Blur grava na hora, debounce de 1200 ms cobre quem digita sem tirar o foco, `Ctrl/Cmd+S` grava. Em erro o texto local **não** é revertido.

`BlocoColapsavel` não usa `components/ui/accordion.tsx`: a linha 47 renderiza o `Content` sem `forceMount`, então fechar **desmonta** o textarea e mata o timer do debounce. Aqui o corpo fica sempre montado, escondido com `hidden`, e o indicador de gravação vive no cabeçalho — bloco fechado com pendência continua sinalizando.

## Duas armadilhas dos blocos de capa e artigo

**`listarArtigosVinculaveis` exclui o artigo da própria pauta.** A query filtra todo post que já pertence a alguma pauta — inclusive a que está aberta. Alimentar um seletor só com essa lista faria um card que **tem** artigo mostrar "nenhum selecionado", e os 22 cards de acervo são exatamente esse caso. Por isso `BlocoArtigo` lê o vínculo atual de `pauta.artigo` e usa a lista só para **trocar**.

**JPEG não tem canal alfa.** `comprimirImagem` pinta o fundo de branco antes de desenhar; sem isso um PNG transparente é achatado contra o que o navegador escolher, normalmente preto. Importa porque as capas são geradas por IA e gerador entrega PNG com frequência. O nome do arquivo também precisa virar `.jpg`, porque `definirCapa` deriva a extensão dele — bytes JPEG num `.png` gravam o objeto errado no bucket.

## Estado dos comandos (pendência aberta)

`/pesquisa` ainda grava em `blog/pesquisa/*.md` e `/linkedin` em `linkedin/*/post.md`, enquanto `pesquisa_conteudo` e `linkedin_texto` existem no banco. **É dupla escrita, e é temporária.**

Enquanto durar: o `.md` gerado pelos comandos é rascunho descartável — **quem manda é o card**. Migrar os dois para gravar na pauta é a próxima entrega.

---

**Relacionado**: [[site]] · [[blog]] · [[linkedin]] · [[stack-nextjs-supabase]] · [[admin-setup]] · [[2026-08-calendario-editorial]]

**Contexto aplicado**: [[article-pipeline]] · [[seo-aeo-strategy]]
