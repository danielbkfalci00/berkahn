---
tipo: meta
criado: 2026-05-21
atualizado: 2026-08-27
tags:
  - project/site
  - project/blog
  - status/active
ai_summary: "Sprint 24–28/08: fechar governança documental, publicar o pacote editorial aprovado e concluir smokes humanos. Detalhes e tarefas vivem nos hubs; esta nota mantém somente estado, prioridade e ponteiros."
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
semana_inicio: 2026-08-24
semana_fim: 2026-08-28
---

# Sprint Ativa — semana de 2026-08-24

> [!info] Regra de contexto
> Esta nota é um painel curto. Fatos, KPIs e tarefas ficam uma única vez nos hubs
> responsáveis; histórico vive em `00-meta/standup/`, `00-meta/wrap-up/` e
> [[CHANGELOG]]. O agregador de tarefas é [[MOC#MOC_Pendencias]].

## Objetivo da semana

**Fechar a governança operacional e transformar o conteúdo já aprovado em
distribuição mensurável**, sem reabrir decisões arquiteturais concluídas.

## Estado por projeto

| Projeto | Estado | Próxima ação canônica |
|---------|--------|-----------------------|
| [[blog]] | Terreno em declive publicado, 43 artigos no ar | Solicitar indexação no Search Console |
| [[linkedin]] | Quatro posts aprovados, nenhum publicado | Publicar manualmente e registrar URL/data |
| [[site]] | Pages neutralizado; admin multiusuário em produção | Smokes humanos e encerramento administrativo |
| [[seo-aeo]] | Baseline técnico e de conversão disponível | Observar janelas de 7/28 dias |
| [[apresentacoes]] | Apresentação executiva ativa | Smoke visual dos 16 slides |
| [[00-meta/projetos/materiais|materiais]] | Banco de imagens catalogado | Institucional v4 e triagem das capas |
| [[pesquisas]] | Pesquisa da pauta registrada | Validar composição com dado interno anonimizado |
| [[orcamento-automacao]] | MVP publicado | Smoke E2E do PDF |

## Entregue nesta semana

- [x] Next.js 16.3, fontes locais, ESLint flat, imagens otimizadas e zero
  advisories; detalhes em [[stack-nextjs-supabase]]
- [x] GitHub Pages legado neutralizado com noindex, canonical, redirect e
  exclusão dos caminhos sensíveis; estado em [[site]]
- [x] Analytics mensal hospedado validado e snapshot de julho persistido;
  operação em [[admin-setup]]
- [x] Gate do vault convertido para fail-closed: configuração do Linter,
  `--single`, argumentos, campos vazios, pendências e wikilinks/anchors
- [x] MOC reconciliado com os oito hubs; CWV e follow-ups da home passaram a
  ter owner único
- [x] Sprint histórica compactada; contexto detalhado segue acessível por
  wikilink, sem duplicação

## Prioridades restantes

As tarefas editoriais e de rollout vivem nos hubs:

- [[blog#Próximos 7 dias]]
- [[linkedin#Próximos 7 dias]]
- [[site#Próximos 7 dias]]
- [[pesquisas#Bloqueios ativos]]
- [[2026-08-diagnostico-integrado-site]]

Pendências cross-project que continuam pertencendo a esta sprint:

- [ ] @bruno Redesenhar o worker para execução sob demanda ou heartbeat leve antes de reativá-lo; o agendamento antigo aponta para worktree removido e uma task completa a cada 15 minutos tem custo desnecessário #pendencia
- [ ] @bruno Decidir o destino das quatro capas órfãs em [[00-meta/projetos/materiais|materiais]]: Reestruturando Concreto, energia_solar, mármore e piscina_arraia #pendencia

## Guardrails

- Aprovação editorial e publicação permanecem humanas.
- Status do quadro nunca comprova publicação real.
- O worker de conteúdo continua pausado até redesenho explícito.
- Nova pendência deve nascer no hub owner usando
  `- [ ] @responsavel … #pendencia`; MOC e sprint apenas apontam.
- Validar o vault com `node scripts/vault-validate.mjs`; para uma nota, usar
  `node scripts/vault-validate.mjs --single <path>`.
