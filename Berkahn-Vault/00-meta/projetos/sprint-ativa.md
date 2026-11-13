---
tipo: meta
criado: 2026-05-21
atualizado: 2026-10-27
tags:
  - project/site
  - project/blog
  - project/linkedin
  - status/active
ai_summary: "Sessão de 22/09 a 27/10/2026: as cinco pautas dos sócios publicadas no blog com capa real, reedição de outubro de 12 rascunhos e novo calendário reconciliados no repositório, pilar de financiamento criado, e Fábio Carvalho atualizado no site/apresentação/PDF institucional. Pendências que só o Bruno resolve: confirmar publicação da hidráulica no LinkedIn e aprovar automação + instalações internacionais. Handoff completo em [[handoff-2026-10-27-claude-code]]."
status: active
projetos_em_curso:
  - blog
  - linkedin
  - site
  - seo-aeo
  - apresentacoes
  - materiais
  - pesquisas
  - orcamento-automacao
semana_inicio: 2026-10-26
semana_fim: 2026-10-30
---

# Sprint Ativa — semana de 2026-10-26

> [!info] Regra de contexto
> Esta nota é um painel curto. Fatos, KPIs e tarefas ficam uma única vez nos hubs
> responsáveis; histórico vive em `00-meta/standup/`, `00-meta/wrap-up/` e
> [[CHANGELOG]]. O agregador de tarefas é [[MOC#MOC_Pendencias]].

> [!info] Troca de sessão em 27/10/2026
> Esta sessão de conteúdo foi encerrada porque a conta do Claude Code vai mudar.
> Handoff completo, com gotchas de ambiente e o que falta, em
> [[handoff-2026-10-27-claude-code]]. Leia aquela nota antes de continuar
> qualquer trabalho de conteúdo ou de site.

## Objetivo da semana

**Fechar o lote dos sócios e a reedição de outubro**, deixando só o que exige
decisão humana (aprovar e postar no LinkedIn, confirmar uma publicação já
feita) como pendência.

## Estado por projeto

| Projeto | Estado | Próxima ação canônica |
|---------|--------|-----------------------|
| [[blog]] | 5 pautas dos sócios + 4 republicações de outubro publicadas | Próxima pauta da fila é `normas-light-steel-frame-brasil`; ver [[blog#Próximos 7 dias]] |
| [[linkedin]] | Fachada e projeto integrado publicados; hidráulica, automação e prediais aguardam o Bruno | Aprovar/confirmar os 3 pendentes; ver [[linkedin#Próximos 7 dias]] |
| [[site]] | Fábio Carvalho atualizado (sócio + bio) nos 3 lugares | Avaliar a branch `codex/admin-performance-mobile`, 61 atrás / 16 à frente da main |
| [[seo-aeo]] | Queda de outubro diagnosticada, fix de meta já em produção desde 20/10 | Medir CTR de 7 dias contra a base de 3,0% |
| [[apresentacoes]] | Slide de fundadores sincronizado com o site | — |
| [[00-meta/projetos/materiais|materiais]] | 41 fotos de `obra-carrossel` catalogadas por conteúdo | — |
| [[pesquisas]] | — | — |
| [[orcamento-automacao]] | — | — |

## Entregue neste período (22/09 a 27/10)

- [x] As cinco pautas dos sócios (fachada, hidráulica, projeto integrado,
  automação, instalações internacionais) produzidas, verificadas
  adversarialmente e publicadas no blog com capa de foto real
- [x] Catálogo das 41 fotos de `obra-carrossel` por conteúdo, antes
  inexistente; 4 das 5 capas do lote saíram de foto real em vez de gerada
- [x] Contradição entre dois artigos sobre o teto de furo no montante,
  achada só pela verificação cruzada, arbitrada e corrigida nos dois
- [x] Um mês de trabalho de conteúdo/SEO (diagnóstico da queda de tráfego,
  reedição de 12 rascunhos, calendário novo, auditoria de claims de obra)
  que só existia na working tree local, trazido para o repositório (PR #144)
- [x] Pilar de comparação de financiamento criado (`c7db4c6d`), sem duplicar
  o acervo existente
- [x] Fábio Carvalho atualizado no site, na apresentação executiva e no PDF
  institucional (PRs #145 e #146), com a bio final incluindo o cargo
- [x] Dois bugs do `pauta.mjs` corrigidos: `abortar()` escondia o erro real
  do Postgres atrás de `[object Object]`; a checagem de pendência de
  LinkedIn exigia `linkedin_url`, que o processo já tinha parado de coletar

## Prioridades restantes

As tarefas detalhadas vivem nos hubs:

- [[blog#Próximos 7 dias]]
- [[linkedin#Próximos 7 dias]]
- [[site#Próximos 7 dias]]

Resumo do que só o Bruno decide:

- [ ] @bruno Confirmar se `f4d25753` (hidráulica) foi postada no LinkedIn em 30/09 como combinado; o card segue sem URL nem data #pendencia
- [ ] @bruno Aprovar e postar `159d3128` (automação) e `0820e59d` (instalações internacionais) no LinkedIn; texto e capa já passam nos gates #pendencia
- [ ] @bruno Pedir reindexação no Search Console das URLs publicadas desde 20/09 que ainda não foram pedidas #pendencia
- [ ] @bruno Decidir o que fazer com a branch `codex/admin-performance-mobile` (61 commits atrás da main, 16 à frente, ~170 arquivos não commitados de outra frente de trabalho) #pendencia

## Guardrails

- Aprovação editorial e publicação no LinkedIn permanecem humanas.
- Status do quadro nunca comprova publicação real no LinkedIn.
- Capa real de `Docs/banco-imagens/obras-projetos/` tem prioridade sobre
  imagem gerada; consultar o catálogo em [[indices-obras-projetos]] antes de
  escrever prompt de imagem.
- O worker de conteúdo continua pausado até redesenho explícito.
- Nova pendência deve nascer no hub owner usando
  `- [ ] @responsavel … #pendencia`; MOC e sprint apenas apontam.
- Validar o vault com `node scripts/vault-validate.mjs`; para uma nota, usar
  `node scripts/vault-validate.mjs --single <path>`.
