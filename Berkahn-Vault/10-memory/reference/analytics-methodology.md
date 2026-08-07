---
tipo: memory
criado: 2026-05-28
atualizado: 2026-08-07
tags:
  - ai/memory
  - status/active
  - source/manual
  - project/site
  - project/blog
  - project/seo-aeo
ai_summary: "Metodologia do /admin/analytics. Leads ficam no Supabase antes da planilha; métrica norte é qualificados por 100 sessões engajadas em 28 dias, com amostra insuficiente abaixo de 30. article_progress mede 25/50/75/90 após consentimento. Recomendações exigem aprovação."
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

**Fórmula**: meta = **último mês fechado** × `MOM_GROWTH_MULTIPLIER` (1.30).

- **users, sessions, pageviews, clicks, impressions**: mês anterior × 1.30
- **Indexação**: fixa em 100% (não escala — meta é o catálogo inteiro)

**Quando não há histórico** (1º mês ou menos): meta = valor atual × 1.30 (placeholder). Tooltip avisa.

Meses parciais são excluídos da base — são um prefixo do fechamento e puxariam a meta do mês seguinte para baixo.

**Status por progresso**:
- on-track: ≥ 80% atingido
- at-risk: 50-80%
- off-track: < 50%

**Como ajustar ambição**: editar `MOM_GROWTH_MULTIPLIER` em `lib/analytics/goals.ts`. Anotar mudança aqui.

### Histórico de ajustes do multiplier

| Data | Base | Multiplier | Razão |
|------|------|-----------|-------|
| 2026-05-28 | média 3m | 1.30 | Setup inicial. Crescimento agressivo de 30% MoM como meta de partida. Reavaliar após 3 meses de calibração. |
| 2026-07-29 | **último mês fechado** | 1.30 (mantido) | Calibração dos 3 meses. Ver análise abaixo. |

#### Calibração de 2026-07-29

Série fev-jul/2026. O multiplier **não** era o problema — a base era.

**MoM real (users)**: +10,1% (mar) · +168,3% (abr) · +110,9% (mai) · +73,6% (jun) · +42,3% (jul, extrapolado de 26 dias). Desaceleração consistente, fator ~0,62 ao mês.

**Atingimento com a fórmula antiga** (média 3m × 1,30) — todo KPI, todo mês:

| Mês | users | sessions | pageviews | clicks | impressions |
|-----|------:|---------:|----------:|-------:|------------:|
| Mai/2026 | 284% | 211% | 152% | 588% | 850% |
| Jun/2026 | 243% | 225% | 190% | 427% | 310% |
| Jul/2026* | 178% | 164% | 150% | 238% | 153% |

Nenhuma meta foi furada em nenhum mês, e o display satura em 200% — a barra sempre verde não distinguia mês bom de mês ótimo, ou seja, não informava nada.

**Diagnóstico**: com crescimento rápido, a média de 3 meses fica muito abaixo do mês mais recente. Em julho a meta de users era 945 enquanto junho já havia realizado 1179 — uma "meta" menor que o mês anterior.

**Correção**: base passa a ser o último mês fechado. Atingimento vira 162% (mai) · 134% (jun) · 109% (jul), refletindo a desaceleração real e voltando a ser um sinal.

**Por que manter 1,30 e não subir para a mediana histórica (1,83)**: os +82,8% de mediana vêm da fase de lançamento partindo de 25 cliques/mês. Não é meta prospectiva. Com a desaceleração observada, a projeção para agosto é ~+26% — 1,30 fica bem calibrado agora.

**Reavaliar em novembro/2026**, ou antes se o atingimento cair abaixo de 80% por dois meses seguidos.

\* Julho extrapolado de 26 para 31 dias.

## Mês parcial e janela equivalente no MoM

Implementado em [`scripts/analytics/lib/period.mjs`](../../../../scripts/analytics/lib/period.mjs) (`partialMonthBounds`, `equivalentPreviousWindow`).

O pipeline mensal foi desenhado para meses **fechados**. Para ver o mês corrente sem mentir no rótulo, o modo parcial corta a janela em `hoje − GSC_LAG_DAYS` (3 por padrão, via `ANALYTICS_GSC_LAG_DAYS`), porque o Search Console consolida com atraso e os últimos dias vêm artificialmente baixos.

**A regra que importa**: em mês parcial o MoM compara contra a **mesma contagem de dias** do mês anterior, não contra o mês inteiro. Sem isso, 26 dias de julho seriam medidos contra 30 de junho e todo delta viria negativo por construção — um erro de janela lido como queda de desempenho.

| Aspecto | Tratamento |
|---------|-----------|
| Health Score | Não muda. Com janelas equivalentes os MoM ficam válidos; `engagementRate` é taxa e `indexation` é point-in-time |
| Metas dinâmicas | Não pro-rateadas. `computeMonthlyGoals` já exclui o mês corrente da média móvel (`monthSlug < currentMonthSlug`), então a baseline fica intacta |
| Hubs `blog.md`/`seo-aeo.md` | **Não** atualizados — valores parciais são um prefixo do fechamento, e gravá-los faria `/standup` e `/wrap-up` narrarem regressão inexistente |
| Modo comparativo do dashboard | Desabilitado — ele lê `ga4_data` das duas linhas, e a linha anterior guarda o mês inteiro |
| `no-posts` | Texto muda para "primeiros N dias", mas a flag **não** é suprimida |

**Limitação conhecida**: a composição de dias da semana só é idêntica quando `daysCovered` é múltiplo de 7. Fora disso as duas janelas pegam quantidades diferentes de fim de semana, o que enviesa levemente o MoM. Não foi corrigido por normalização de média diária — isso introduziria um segundo modelo mental ("users/dia") que ninguém lembraria em reunião.

**Auto-cura**: o run do dia 1 (sem flags) regenera o mesmo mês como fechado, sobrescrevendo o mesmo arquivo MD e a mesma linha do Supabase (PK `month`). Não há estado órfão para limpar.

## Red flags (Ato 0)

Implementado em [`lib/analytics/red-flags.ts`](../../../../lib/analytics/red-flags.ts). Lista até 3 visíveis com acordion para o resto.

| Flag | Severity | Critério |
|------|----------|----------|
| **users-drop** | critical (≤-20%) / warning (≤-10%) | `usersMoMPct` abaixo do threshold |
| **clicks-drop** | critical (≤-20%) / warning (≤-10%) | `clicksMoMPct` abaixo do threshold |
| **indexation-drop** | critical | `indexedCount < previous.indexedCount` |
| **engagement-drop** | warning | `engagementRateMoMPct <= -15` |
| **no-posts** | warning | nenhum post publicado no mês (em mês parcial, "nos primeiros N dias") |
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
- **MoM**: Month over Month. Comparação com mês imediatamente anterior. Em relatório parcial, com a **janela equivalente** (mesma contagem de dias), não com o mês inteiro.
- **Relatório parcial**: mês ainda aberto, com janela cortada no lag do GSC. Marcado por `periodo_parcial: true` no frontmatter e badge "Parcial" no dashboard.
- **Indexado**: `coverageState` do GSC contém "indexed" **e não contém "not indexed"** (case-insensitive). A segunda condição é obrigatória: `Crawled - currently not indexed` e `Discovered - currently not indexed` contêm a substring "indexed" e eram contados como indexados até 2026-07-29, inflando `indexedCount` (Julho/2026 reportava 38/38 quando o real era 34/38) e, por tabela, o Health Score. Ver ressalva sobre o histórico abaixo.
- **Health Score**: número único 0-100 que resume saúde do projeto naquele mês. Ver fórmula acima.

## Ressalva: relatórios de fev a jun/2026 têm indexação inflada

O bug de contagem de indexação (ver Glossário) afetou **todos** os relatórios anteriores, sempre em +1:

| Relatório | Reportado | Real |
|-----------|----------:|-----:|
| 2026-02 | 30/30 | 29/30 |
| 2026-03 | 30/30 | 29/30 |
| 2026-04 | 30/30 | 29/30 |
| 2026-05 | 31/31 | 30/31 |
| 2026-06 | 35/35 | 34/35 |

**Esses relatórios não foram regenerados**, decisão de 2026-07-29. Regenerar reescreveria `criado:` e `data_diagnostico:` para a data da regeneração, apagando quando a análise realmente foi feita — custo maior que o benefício, já que o erro é de 1 página e move o Health Score em ~1 ponto.

Consequências práticas: qualquer relatório anterior a julho/2026 que afirme "100% indexado" está errado por 1 página, e os `indexedCount` gravados em `analytics_snapshots` para esses meses seguem inflados. A série de Health Score histórica está ~1 ponto alta. **Não recalcular tendência de indexação usando fev-jun sem descontar isso.**

Julho/2026 em diante está correto.

## ⚠️ Corte de série em 2026-07-30: consentimento passou a ser respeitado

> [!warning] Queda esperada nos números de agosto. **Não é perda de tráfego.**

Até 30/07/2026 o site chamava `gtag('config', ...)` **sem** `gtag('consent', 'default')`. Na prática: o primeiro `page_view` saía com consentimento implicitamente concedido, antes de o banner aparecer. E o `update` só rodava no clique do banner — quem tinha escolhido "apenas necessários" numa visita anterior voltava e era medido normalmente, porque o provider fazia `setConsent` e retornava sem chamar o `gtag`.

Os dois bugs foram corrigidos. Agora o default é `denied` nas 4 categorias do Consent Mode v2 antes do `config`, e a escolha salva é replayed no carregamento.

**Consequência na medição**: usuários que não aceitam cookies deixam de ser contados. A queda em `users`, `sessions` e `pageviews` a partir de 01/08/2026 é a diferença entre o que era medido indevidamente e o que passa a ser medido com consentimento.

**Ao ler o relatório de agosto (gerado pelo cron em 01/09)**:

- `detectRedFlags` (`lib/analytics/red-flags.ts`) vai disparar `users-drop`. É falso positivo desta mudança.
- O MoM de julho→agosto **não é comparável**. A base de comparação válida volta a existir em setembro→outubro, quando os dois meses já terão a mesma regra.
- O GSC **não é afetado** — cliques e impressões vêm do Search Console, que não depende de cookie. Se `users` cair e `clicks` não, é este corte.

## Eventos de conversão — série começa em 2026-07-30

Antes desta data `ga4_data.events` era `[]` em **todos** os meses, e não por falta de tráfego: `fetch-ga4.mjs` filtrava por 5 nomes de evento que o site não disparava, enquanto os 3 que ele disparava (os de `/architects`) ficavam fora da allowlist. Os dois lados existiam e não se encontravam.

Agora a allowlist (`EVENTOS_RASTREADOS` em `fetch-ga4.mjs`) espelha o `type EventName` de `lib/analytics.ts`. **Ao adicionar evento, mexer nos dois** — eles não se importam, então o desencontro é silencioso.

Eventos e o que cada um significa:

| Evento | Dispara quando | Dimensões |
|---|---|---|
| `cta_click` | modal de contato **abre** (qualquer gatilho) | `cta_location`, `page_path`, `segment` |
| `form_submit` | usuário envia o formulário | + `channel: form` |
| `generate_lead` | Supabase confirma o lead; planilha é espelho | + `channel: form` |
| `article_progress` | leitura cruza 25%, 50%, 75% ou 90% | `article_slug`, `percent_scrolled` |
| `whatsapp_click` | clique em qualquer link `wa.me` | `cta_location`, `page_path`, `channel` |

`cta_location` responde "qual gatilho" (`header`, `menu_lateral`, `contato_pagina`, `blog:<slug>`); `page_path` responde "em que página". Os dois juntos são o que permite ligar pauta a lead. A diferença entre `form_submit` e `generate_lead` mede a perda entre enviar e confirmar.

Relatórios anteriores a agosto/2026 não têm esta seção preenchida — ausência ali é falta de instrumentação, não ausência de conversão.

## Referências

- Contexto: [[seo-aeo-strategy]] · [[article-pipeline]]
- Hubs com KPIs: [[blog]] · [[seo-aeo]]
- Setup técnico: [[google-apis-setup]]

## Ciclo de aprendizado de conteúdo — série inicia em 2026-08-07

`leads` é a fonte primária. Atribuição de página, slug, CTA, UTMs, `post_id` e
`pauta_id` é resolvida no servidor; Google Sheets é espelho com retry. Analytics
não recebe nome, email, telefone nem fingerprint.

A métrica norte é:

`leads qualificados / sessões engajadas × 100`

A leitura usa janela móvel de 28 dias. Artigos com menos de 30 sessões
engajadas recebem **amostra insuficiente** e não geram recomendação editorial.
Comprimento, estrutura, retenção, profundidade, busca, CTR e conversão são
evidências, não regras isoladas.

`article_progress` dispara em 25%, 50%, 75% e 90%, uma vez por sessão e somente
depois do consentimento. Para relatórios por threshold, `article_slug` e
`percent_scrolled` precisam existir como dimensões personalizadas no GA4.

Recomendações entram em `analytics_tasks` com pauta, evidências e
`approval_status = pendente`. Aprovar transforma a recomendação em trabalho;
nunca altera pauta, artigo ou prompt automaticamente. Prompts `locked` seguem
intocados.
