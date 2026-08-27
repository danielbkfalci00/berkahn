---
tipo: memory
criado: 2026-08-27
atualizado: 2026-08-27
tags:
  - ai/memory
  - status/active
  - project/site
ai_summary: Sessão longa em worktree fica presa no commit de origem e não recebe correções de ferramenta que outras sessões mergeiam no meio do caminho. Em 27/08 isso fez o vault-validate reportar 0 issues a sessão inteira com a regra de ordem de keys silenciosamente desligada.
status: active
subtipo: feedback
why: "Este repositório roda várias sessões em paralelo, cada uma na própria worktree. Uma sessão de horas parte de origin/main e envelhece enquanto as outras mergeiam. Se o que mergeou foi correção de ferramenta de verificação, a sessão antiga continua se verificando com a versão quebrada e reporta verde com confiança."
how_to_apply: "Antes de afirmar que um verificador passou, leia a linha de diagnóstico dele, não só o veredito. Em sessão longa, refazer fetch e conferir se a ferramenta mudou antes do relatório final."
---

# Worktree de sessão longa fica para trás

Em 2026-08-27 a worktree da sessão foi criada de `origin/main` em `025506b` e
viveu a sessão inteira ali. No meio do caminho, outra sessão mergeou o PR #74,
que consertava duas coisas ao mesmo tempo: o `data.json` do Obsidian Linter, que
era JSON inválido por ter quebras de linha cruas dentro de uma string, e o
`loadLinterOrder` do `vault-validate.mjs`, que engolia esse erro num `catch` e
seguia com `canonicalOrder = []`.

Resultado prático: a sessão inteira rodou `vault-validate` com a regra R2, de
ordem canônica de keys no frontmatter, **silenciosamente desligada**, e reportou
"0 issues" quatro vezes. Rodado depois em `main` atualizado, o mesmo comando achou
na hora um `contextos_aplicados` fora de ordem no artigo publicado naquela sessão.

O sinal estava impresso na tela o tempo todo, na linha `Linter order: 0 keys
carregadas`. Eu li o veredito e não li o diagnóstico.

Duas regras que saem daqui:

1. **Veredito verde com diagnóstico estranho não é verde.** Se a ferramenta
   imprime quantas regras carregou, quantos arquivos leu ou qual config usou,
   esses números fazem parte do resultado.
2. **Sessão longa envelhece.** Antes do relatório final, `git fetch` e conferir se
   as ferramentas de verificação mudaram desde o início. Correção de ferramenta
   vinda de outra sessão não chega sozinha na worktree.

O `loadLinterOrder` hoje lança em vez de engolir, então este modo de falha
específico está fechado na ferramenta. O que continua aberto é o hábito, que é o
motivo desta nota existir. Relacionado: [[verificar-antes-de-descartar]].
