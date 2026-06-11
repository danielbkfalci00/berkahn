---
tipo: memory
criado: 2026-05-28
atualizado: 2026-05-28
tags:
  - ai/memory
  - status/active
  - source/manual
  - project/site
  - project/blog
  - project/seo-aeo
ai_summary: Metodologia do dashboard /admin/analytics. Fórmulas, thresholds e critérios usados em Health Score, classificação de posts, metas dinâmicas e red flags. Atualizar quando ajustar pesos.
status: active
subtipo: reference
---

# Metodologia do dashboard `/admin/analytics`

Este documento explica como os números são calculados. Atualize sempre que ajustar pesos ou thresholds.

## Health Score (0-100)

Implementado em [`lib/analytics/health-score.ts`](../../scripts/../../lib/analytics/health-score.ts). Aplicado no Hero do Ato 0.

**Fórmula**: média ponderada de 4 componentes:

| Componente | Peso | Cálculo |
|------------|------|---------|
| Indexação Google | 30% | `(indexedCount / totalArticles) * 100` |
| Crescimento de users MoM | 30% | sigmoide via `50 + 40 * tanh(usersMoMPct / 40)` |
| Crescimento de cliques GSC MoM | 20% | sigmoide via `50 + 40 * tanh(clicksMoMPct / 40)` |
| Engagement rate atual | 20% | direto 0-100 |

**Status por faixa**: ≥80 excelente · 60-80 bom · 40-60 atenção · <40 crítico.

**Por que sigmoide para MoM?** Crescimento de +200% não vale 200, vale ~95. Mapeia retornos decrescentes — não permite que um KPI explosivo encubra problemas em outros.

**Pesos atuais (30/30/20/20)**: dão prioridade equivalente para "estamos chegando ao público" (indexação) e "estamos crescendo" (users MoM). Cliques GSC e engagement entram com peso menor porque já são parcialmente correlacionados a users.

**Como ajustar**: editar a constante `DEFAULT_WEIGHTS` em `lib/analytics/health-score.ts`. Documentar a mudança aqui com data + razão.

## Classificação de posts (Ato 3)

Implementado em [`lib/analytics/post-performance.ts`](../../../../lib/analytics/post-performance.ts). Cascata por prioridade.

| Status | Critério | Threshold atual |
|--------|----------|-----------------|
| **Engajado** 🏆 | `retentionPct >= X` | 60% |
| **Em alta** ↑ | `pageviewsMoMPct >= X` | 30% |
| **Em queda** ↓ | `pageviewsMoMPct <= -X` | 30% |
| **Abandonado** ⚠ | `avgEngagementTime < X` OR `bounceRate > Y` | 15s / 80% |
| **Neutro** — | nenhum critério acima | — |

**Retention %**: `min(100, (avgEngagementTime / (read_time_min * 60)) * 100)`. read_time vem do campo `read_time` em `posts` (default 5 min via DB default).

**Por que cascata (não OR)?** Um post engajado E em alta vira "engajado" porque retenção é métrica mais robusta. Evita ambiguidade visual.

**Como ajustar**: editar constantes em `lib/analytics/post-performance.ts`. Lembre de avisar o time se mudar — afeta o que aparece nos chips de filtro.

## Metas dinâmicas (Ato 1)

Implementado em [`lib/analytics/goals.ts`](../../../../lib/analytics/goals.ts). Aplicado no progress bar de cada KPI.

**Fórmula**: meta = média dos últimos `LOOKBACK_MONTHS` (3) × `MOM_GROWTH_MULTIPLIER` (1.30).

- **users, sessions, pageviews, clicks, impressions**: média móvel × 1.30
- **Indexação**: fixa em 100% (não escala — meta é o catálogo inteiro)

**Quando não há histórico** (1º mês ou menos): meta = valor atual × 1.30 (placeholder). Tooltip avisa.

**Status por progresso**:
- on-track: ≥ 80% atingido
- at-risk: 50-80%
- off-track: < 50%

**Como ajustar ambição**: editar `MOM_GROWTH_MULTIPLIER` em `lib/analytics/goals.ts`. Anotar mudança aqui.

### Histórico de ajustes do multiplier

| Data | Multiplier | Razão |
|------|-----------|-------|
| 2026-05-28 | 1.30 | Setup inicial. Crescimento agressivo de 30% MoM como meta de partida. Reavaliar após 3 meses de calibração. |

## Red flags (Ato 0)

Implementado em [`lib/analytics/red-flags.ts`](../../../../lib/analytics/red-flags.ts). Lista até 3 visíveis com acordion para o resto.

| Flag | Severity | Critério |
|------|----------|----------|
| **users-drop** | critical (≤-20%) / warning (≤-10%) | `usersMoMPct` abaixo do threshold |
| **clicks-drop** | critical (≤-20%) / warning (≤-10%) | `clicksMoMPct` abaixo do threshold |
| **indexation-drop** | critical | `indexedCount < previous.indexedCount` |
| **engagement-drop** | warning | `engagementRateMoMPct <= -15` |
| **no-posts** | warning | nenhum post publicado no mês |
| **opportunity-queries** | warning | query com `impressions ≥ 500` E `ctr < 2%` |

Cada flag inclui `action` sugerida quando aplicável.

**Quando não há nenhuma flag**: card verde "Tudo dentro da faixa esperada".

## Timeline de Posts no GrowthChart (Ato 1)

Implementado em [`lib/analytics/timeline-events.ts`](../../../../lib/analytics/timeline-events.ts). Agrupa `publishedAt` de `postsMap` por `monthSlug` (YYYY-MM) e mantém só os meses presentes em `trendPoints` (eixo categórico do gráfico).

**Como aparece**: `<ReferenceLine>` vertical roxa (`#7C3AED`, mesma cor das IAs consolidadas — coerência semântica de "elementos relacionados à curadoria de conteúdo") no GrowthChart, com tooltip rico listando data (`dd/MM`) + título + categoria dos posts daquele mês.

**Por que agrupado por mês**: XAxis é categórico (`monthLabel`). Markers por dia exigiriam refactor pra eixo temporal — Sprint 4 priorizou simplicidade. Posts dentro do mês aparecem ordenados desc no tooltip.

## Glossário

- **Bounce rate**: % de sessões que saíram sem nenhuma interação. GA4 padrão. 0-100.
- **Engagement rate**: % de sessões "engajadas" (>10s OU >1 evento). GA4 padrão. 0-100.
- **Retention %** (Berkahn-specific): tempo médio engajado ÷ read_time configurado. Mede leitura do conteúdo, não bounce do tráfego.
- **MoM**: Month over Month. Comparação com mês imediatamente anterior.
- **Indexado**: cobertura state do GSC inclui "indexed" (case-insensitive).
- **Health Score**: número único 0-100 que resume saúde do projeto naquele mês. Ver fórmula acima.

## Referências

- Contexto: [[seo-aeo-strategy]] · [[article-pipeline]]
- Hubs com KPIs: [[blog]] · [[seo-aeo]]
- Setup técnico: [[google-apis-setup]]
