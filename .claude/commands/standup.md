---
description: Standup semanal — atualiza sprint-ativa + 8 hubs de projeto e gera nota em 00-meta/standup/YYYY-MM-DD.md
---

Standup semanal Berkahn — rodado segunda-feira 9h (manual ou via scheduled-task).

## Leitura de contexto (obrigatória)

Leia em paralelo:
- `Berkahn-Vault/00-meta/projetos/sprint-ativa.md` — sprint atual
- `Berkahn-Vault/00-meta/projetos/blog.md`
- `Berkahn-Vault/00-meta/projetos/linkedin.md`
- `Berkahn-Vault/00-meta/projetos/site.md`
- `Berkahn-Vault/00-meta/projetos/seo-aeo.md`
- `Berkahn-Vault/00-meta/projetos/apresentacoes.md`
- `Berkahn-Vault/00-meta/projetos/materiais.md`
- `Berkahn-Vault/00-meta/projetos/pesquisas.md`
- `Berkahn-Vault/00-meta/projetos/orcamento-automacao.md`
- Último standup em `Berkahn-Vault/00-meta/standup/` (se existir): `ls Berkahn-Vault/00-meta/standup/ | tail -1`
- Último wrap-up em `Berkahn-Vault/00-meta/wrap-up/` (se existir)

## Execução

### 1. Coletar status atual de cada hub

Para cada um dos 8 hubs, identifique:
- Status atual (campo "## Status atual")
- Bloqueios ativos (`- [ ]` em "## Bloqueios ativos")
- KPIs no frontmatter (campos `kpi_*`)
- Última atualização (`atualizado:` no frontmatter)
- Próximos 7 dias (campo "## Próximos 7 dias")

### 2. Detectar mudanças vs último standup

Se houver standup anterior, compare:
- KPIs que mudaram (snapshot Δ)
- Bloqueios resolvidos (movidos para wrap-up histórico)
- Bloqueios novos
- Próximos 7 dias do standup anterior — quais foram cumpridos?

### 3. Propor atualizações ao usuário

Apresente para Bruno:
- Status sugerido por projeto (markdown table)
- KPIs atualizados (se Bruno tiver dados novos, perguntar; senão manter)
- Novos bloqueios identificados
- Tarefas dos próximos 7 dias

**Perguntar antes de gravar** (use AskUserQuestion se múltiplas opções, ou mostrar diff antes de Write).

### 4. Escrever standup do dia

Arquivo: `Berkahn-Vault/00-meta/standup/YYYY-MM-DD.md`

Estrutura:
```markdown
---
tipo: meta
criado: YYYY-MM-DD
atualizado: YYYY-MM-DD
tags:
  - source/standup
  - status/active
ai_summary: Standup YYYY-MM-DD — snapshot semanal dos 7 projetos. Mudanças vs semana anterior + bloqueios + próximas ações.
status: active
semana_inicio: YYYY-MM-DD (segunda)
semana_fim: YYYY-MM-DD (sexta)
---

# Standup — YYYY-MM-DD (segunda)

> Sprint: [[sprint-ativa]] · Anterior: [[YYYY-MM-DD-anterior]] · Próximo wrap-up: [[YYYY-MM-DD-sexta]]

## Status por projeto

| Projeto | Status | Bloqueio | Próxima ação |
|---------|--------|----------|--------------|
| [[blog]] | ... | ... | ... |
| (...) | | | |

## Deltas vs semana anterior

### KPIs
- [[blog]]: kpi_publicados 35 → 36 (+1 ✅)
- [[seo-aeo]]: kpi_paginas_indexadas 6 → 8 (+2 ✅)
- (...)

### Bloqueios resolvidos
- [[seo-aeo]]: SearchAction bug fix ✅

### Bloqueios novos
- [[site]]: ...

## Próximos 7 dias (consolidado)

- [ ] [[blog]]: post da semana
- [ ] [[linkedin]]: post da semana
- [ ] (...)

## Decisões
- (nenhuma ainda — adicionar conforme aparecerem)
```

### 5. Atualizar sprint-ativa.md

- Campo `atualizado:` → hoje
- Seção "## Status por projeto" → atualizada conforme standup
- Seção "## Bloqueios consolidados" → atualizada (P0/P1/P2 + bloqueios resolvidos saem)
- Adicionar entrada em "## Decisões da semana" se houver

### 6. Atualizar cada hub modificado

Para cada hub que teve mudança:
- Campo `atualizado:` → hoje
- Campo `kpi_atualizado_em:` → hoje
- KPIs alterados no frontmatter
- Seção "## Status atual" se mudou
- Seção "## Bloqueios ativos" — checkar items resolvidos
- Append em "## Histórico recente": `- YYYY-MM-DD: standup — <sumário 1 linha>`

### 7. Sanity check com vault-validate

Antes de reportar, rodar:
```bash
node scripts/vault-validate.mjs --quiet
```

- Se exit code 0 (OK): seguir para reportar
- Se exit code 1 (ERRORs): incluir no relatório a Bruno os ERRORs detectados (não bloqueia, mas alerta)
- Se exit code 2 (só WARNs): mencionar contagem no resumo

### 8. Reportar a Bruno

Apresentar resumo:
- Arquivo standup criado
- Hubs atualizados (lista)
- Sprint-ativa atualizada
- Status do vault-validate (ERRORs/WARNs)
- Próxima ação cross-projeto sugerida
- Próximo wrap-up: sexta 17h

$ARGUMENTS
