---
tipo: meta
criado: 2026-05-21
atualizado: 2026-09-10
tags:
  - project/site
  - project/blog
  - status/active
ai_summary: "Sprint 07–11/09: levar a pauta de home equity ate a aprovacao editorial, preservando o slug indexado e a publicacao humana. Detalhes e tarefas vivem nos hubs; esta nota mantem somente estado, prioridade e ponteiros."
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
semana_inicio: 2026-09-07
semana_fim: 2026-09-11
---

# Sprint Ativa — semana de 2026-09-07

> [!info] Regra de contexto
> Esta nota é um painel curto. Fatos, KPIs e tarefas ficam uma única vez nos hubs
> responsáveis; histórico vive em `00-meta/standup/`, `00-meta/wrap-up/` e
> [[CHANGELOG]]. O agregador de tarefas é [[MOC#MOC_Pendencias]].

## Objetivo da semana

**Entregar um pacote editorial completo para aprovação**, revisando o artigo
indexado sem trocar a URL e preparando a distribuição manual no LinkedIn.

## Estado por projeto

| Projeto | Estado | Próxima ação canônica |
|---------|--------|-----------------------|
| [[blog]] | Revisão de `financiar-construcao-light-steel-frame` staged | Revisão humana do pacote; ver [[blog#Próximos 7 dias]] |
| [[linkedin]] | Copy de 130 palavras e capa 4:5 prontas | Aprovar o pacote e publicar manualmente depois do Blog |
| [[site]] | Pages neutralizado; admin multiusuário em produção | Smokes humanos e encerramento administrativo |
| [[seo-aeo]] | Baseline técnico e de conversão disponível | Observar janelas de 7/28 dias |
| [[apresentacoes]] | Apresentação executiva ativa | Smoke visual dos 16 slides |
| [[00-meta/projetos/materiais|materiais]] | Banco de imagens catalogado | Institucional v4 e triagem das capas |
| [[pesquisas]] | Pesquisa da pauta registrada | Validar composição com dado interno anonimizado |
| [[orcamento-automacao]] | MVP publicado | Smoke E2E do PDF |

## Entregue nesta semana

- [x] Próxima pauta escolhida explicitamente no quadro, sem depender do seletor
  genérico que priorizaria outro card atrasado
- [x] Séries 20773 e 29973 conferidas na API oficial do Banco Central
- [x] Conversão anual/mensal corrigida por equivalência composta e tabelas
  recalculadas
- [x] Afirmações de mercado sem fonte primária removidas do artigo
- [x] Artigo vinculado ao post existente como revisão staged; versão publicada
  continua intacta
- [x] Texto do LinkedIn reescrito em 130 palavras e URL UTM preparada
- [x] Capas Blog 1200×800 e LinkedIn 1080×1350 já vinculadas ao card

## Prioridades restantes

As tarefas editoriais e de rollout vivem nos hubs:

- [[blog#Próximos 7 dias]]
- [[linkedin#Próximos 7 dias]]
- [[site#Próximos 7 dias]]
- [[pesquisas#Bloqueios ativos]]
- [[2026-08-diagnostico-integrado-site]]

O único bloqueio editorial desta entrega é a aprovação humana registrada em
[[blog#Próximos 7 dias]]. Pendências cross-project preservadas:

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
