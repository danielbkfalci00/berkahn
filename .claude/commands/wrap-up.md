---
description: Wrap-up semanal — consolida semana, calcula deltas de KPIs vs standup, atualiza histórico dos 8 hubs e gera nota em 00-meta/wrap-up/YYYY-MM-DD.md
---

Wrap-up semanal Berkahn — rodado sexta-feira 17h (manual ou via scheduled-task).

## Leitura de contexto (obrigatória)

Leia em paralelo:
- `Berkahn-Vault/00-meta/projetos/sprint-ativa.md`
- Os 8 hubs em `Berkahn-Vault/00-meta/projetos/{blog,linkedin,site,seo-aeo,apresentacoes,materiais,pesquisas,orcamento-automacao}.md`
- Standup da semana atual: `ls Berkahn-Vault/00-meta/standup/ | tail -1` (deve ser desta segunda)
- Último wrap-up: `ls Berkahn-Vault/00-meta/wrap-up/ | tail -1`
- Standups anteriores se necessário para tendência

## Execução

### 1. Coletar conquistas da semana

Para cada projeto, identifique o que foi entregue:
- Posts publicados (blog, linkedin)
- Bugs corrigidos (site)
- Páginas indexadas (seo-aeo)
- Slides validados (apresentacoes)
- Materiais criados (materiais)
- Atomic notes geradas (pesquisas)

### 2. Calcular deltas de KPIs

Compare `kpi_*` atuais dos hubs vs valores no standup da segunda:
- Variação absoluta (Δ)
- % progresso vs meta
- Flag de "atrasado" se Δ < 80% da meta semanal

### 3. Identificar bloqueios resolvidos vs persistentes

- Bloqueios marcados como `[x]` ou ausentes vs standup → resolvidos
- Bloqueios que permanecem → arrastam para próxima sprint
- Novos bloqueios identificados durante a semana

### 4. Escrever wrap-up do dia

Arquivo: `Berkahn-Vault/00-meta/wrap-up/YYYY-MM-DD.md`

Estrutura:
```markdown
---
tipo: meta
criado: YYYY-MM-DD
atualizado: YYYY-MM-DD
tags:
  - source/wrap-up
  - status/active
ai_summary: Wrap-up YYYY-MM-DD — conquistas, KPIs deltas, bloqueios resolvidos vs persistentes. Input para próximo /standup.
status: active
semana_inicio: YYYY-MM-DD (segunda)
semana_fim: YYYY-MM-DD (sexta)
---

# Wrap-up — YYYY-MM-DD (sexta)

> Standup desta semana: [[YYYY-MM-DD-segunda]] · Próximo standup: [[YYYY-MM-DD-próxima-segunda]]

## Conquistas

### Cross-projeto
- ...

### Por projeto
- [[blog]]: post X publicado, +1 indexado
- [[linkedin]]: post Y publicado
- [[seo-aeo]]: 5 posts com meta tags atualizadas
- (...)

## Deltas KPIs (semana)

| Projeto | KPI | Início (seg) | Fim (sex) | Δ | Meta semanal | % |
|---------|-----|--------------|-----------|---|--------------|---|
| blog | kpi_publicados | 35 | 36 | +1 | +1 | 100% ✅ |
| seo-aeo | kpi_paginas_indexadas | 6 | 10 | +4 | +5 | 80% ⚠️ |
| (...) | | | | | | |

## Bloqueios resolvidos

- [[seo-aeo]]: SearchAction bug — fix em PR #...
- (...)

## Bloqueios persistentes (arrastam para próxima sprint)

- [[blog]]: backfill 35 artigos — aguardando Sprint 2
- (...)

## Decisões da semana

- (consolidar decisões do sprint-ativa)

## Reflexão (opcional)

- O que funcionou
- O que não funcionou
- Ajustes para próxima sprint

## Inputs para próximo /standup

- Bloqueios persistentes
- Bloqueios novos
- Próximas 7 dias prováveis
- Mudanças de KPIs externos (GSC, Vercel Analytics, Supabase counts)
```

### 5. Atualizar histórico em cada hub

Para cada hub que teve mudança:
- Append em "## Histórico recente": `- YYYY-MM-DD: wrap-up — <sumário 1 linha>`
- Atualizar `kpi_atualizado_em:` → hoje
- Atualizar KPIs no frontmatter conforme dados finais da semana

### 6. Atualizar sprint-ativa.md

- Campo `atualizado:` → hoje
- Mover bloqueios resolvidos para histórico interno
- Atualizar tabela de métricas com valores finais

### 7. Validar completude (linter rápido)

Antes de finalizar, checar:
- Todos os 8 hubs têm `atualizado:` desta semana?
- Standup desta semana existe? (se não, alerta)
- Algum hub não foi tocado em > 2 semanas? (flag stale)
- Wikilinks quebrados nos novos arquivos? (`obsidian unresolved` se disponível)

**Rodar vault-validate.mjs**:
```bash
node scripts/vault-validate.mjs
```

- Se exit code 0: OK, prosseguir
- Se exit code 1 (ERRORs): incluir contagem + 3-5 primeiros ERRORs no wrap-up + criar tarefas de correção
- Se exit code 2 (WARNs): mencionar tendência (subiu/desceu vs wrap-up anterior?)

### 8. Reportar a Bruno

- Arquivo wrap-up criado
- Hubs atualizados (lista com KPI deltas)
- Bloqueios resolvidos vs persistentes (contagem)
- Reflexão sugerida
- Próximo standup: segunda 9h

$ARGUMENTS
