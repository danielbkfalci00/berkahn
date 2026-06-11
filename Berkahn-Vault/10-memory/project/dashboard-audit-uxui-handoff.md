---
tipo: memory
criado: 2026-05-29
atualizado: 2026-05-29
tags:
  - ai/memory
  - status/active
  - project/site
  - source/manual
ai_summary: Prompt de auditoria UX/UI/storytelling/visualizações do dashboard /admin/analytics após 4 sprints entregues. Investigação aberta para identificar oportunidades reais (não polimento). Foca em fricção de uso, narrativa, hierarquia, interatividade. Inclui metodologia, dimensões, restrições e output esperado.
status: active
subtipo: project
---

# Auditoria de UX/UI/Storytelling — Dashboard `/admin/analytics`

> **Como usar este prompt**: cole esta linha no início da nova sessão Claude Code no projeto Berkahn:
>
> *"Conduz a auditoria do dashboard analytics seguindo `Berkahn-Vault/10-memory/project/dashboard-audit-uxui-handoff.md`. Quero um plano priorizado de melhorias com impacto real, não polimento."*
>
> Claude vai ler este arquivo + acessar produção + investigar componentes e propor um plano (plan mode).

---

## Missão

Investigar o dashboard `/admin/analytics` com olhar **crítico, cirúrgico e cético** e produzir um plano de melhorias priorizadas. O dashboard já está maduro (4 sprints, ~25 componentes, em produção). O risco maior é **polishing eterno** que não move a agulha. A missão é identificar **fricções reais** e **oportunidades de alto impacto**, não enumerar 30 ajustes cosméticos.

Bruno apresenta o dashboard mensalmente para o time interno via share screen Meet/Zoom. Audiência: time interno (não-técnico em métricas). Goal: contar a história de "como estamos, o que mudou, para onde ir".

---

## Estado atual (após 4 sprints)

### URL produção
https://admin.berkahn.com.br/admin/analytics

### Commits entregues
| Sprint | Commit | Entrega resumida |
|--------|--------|------------------|
| 1 | `1e54351` | 4 atos + Health Score 0-100 + Hero/Win/RedFlag + IAs consolidadas + refactor em Acts |
| 2 | `92aceda` | Ato 3 Performance dos Posts (PostHeroCards + PostPerformanceTable + 7 métricas GA4 por página) |
| 3 | `9224ed8` | Metas dinâmicas + Red flags inteligentes (6 detectores) + Comparativo MoM com toggle e URL state |
| 4 | `c9b5f6b` | Timeline de posts no GrowthChart + DevicesMiniChart + FallingQueriesPanel + TopQueriesTable mobile + loading.tsx + A11y básico |

### Arquitetura
- **Página**: `app/admin/analytics/page.tsx` (Server Component) + `AnalyticsContent.tsx` (Client orquestrador)
- **Loading**: `loading.tsx` (Skeleton via Suspense)
- **Atos** (`components/admin/analytics/acts/`):
  - `Act0Status` — Hero Health Score + WinCard + RedFlagCard
  - `Act1Growth` — KPI grid (6 cards) + GrowthChart (com timeline)
  - `Act2Origin` — AreaDistribution + TrafficSources + DevicesMiniChart + TopQueriesTable
  - `Act3Posts` — PostHeroCards + PostPerformanceTable filtrável
  - `Act4Action` — InsightsList + ActionsPriority + IndexationStatus + FallingQueriesPanel
- **Header**: AnalyticsHeader com PeriodSelect + toggle Comparar + Exportar PDF
- **Modo comparativo**: ComparisonView (toggle `?compare=1`)
- **Helpers `lib/analytics/`**: health-score, narrative, goals, red-flags, post-performance, timeline-events, ai-sources, queries, period

### Metodologia documentada
- [[analytics-methodology]] — Health Score, classificação posts, metas, red flags, timeline

### Stack
- Next.js 15 App Router (Server Components + Client)
- Recharts 3.6 para visualizações
- shadcn/ui (Card, Table, Accordion, Tabs, Select, Skeleton, Tooltip, Badge, Progress, Button)
- Tailwind + Manrope (Google Fonts)
- Supabase Auth + Postgres (`analytics_snapshots` table)

---

## Dimensões da investigação

Cada dimensão tem perguntas que devem ser respondidas com OBSERVAÇÕES REAIS (não suposições). Para cada problema identificado, dizer:
- **O que é** (descrição neutra, sem interpretação)
- **Por que importa** (impacto pra quem usa)
- **Custo de mudar** (S/M/L)
- **Recomendação** (manter / mudar / remover)

### 1. Storytelling dos dados

> A narrativa entre os 5 atos faz sentido pro time não-técnico?

- Os títulos das seções formam uma história ("Status → Crescimento → Origem → Performance → Ação")?
- Os subtítulos dinâmicos do narrative.ts conectam os atos com referência ao dado anterior?
- Há overlap conceitual entre atos (ex: Hero score do Ato 0 vs KPIs do Ato 1)?
- O leitor consegue parar em qualquer ato e entender sozinho?
- Algum ato seria mais útil em outra posição?
- Falta algum ato (ex: "Como o time interpreta isso")?
- O footer é útil ou ruído?

### 2. Visual hierarchy & UI design

> Onde o olho do leitor pousa primeiro? E depois?

- Hero metric (Health Score) tem o peso visual correto vs cards menores?
- Win + Red Flag ao lado do Hero competem por atenção?
- KPI cards: o valor principal salta? Delta + progress + sparkline + footer — sobrecarga?
- Spacing entre seções é consistente?
- Cor é usada com critério (semântica clara) ou decorativa?
- A paleta preto/off-white/cinzas + cores semânticas funciona, ou parece monótona?
- Cards têm shadow/border consistente?
- Tabelas têm zebra/divider que ajuda leitura?
- Mobile (375px) tem sobrecarga ou está OK?

### 3. Visualizações (charts) e tipos certos

> Cada chart escolhido é o melhor pra aquele dado?

- LineChart com 2 eixos no GrowthChart funciona ou confunde?
- Sparklines em cada KpiCard somam ou poluem?
- Donut para áreas e devices: legível?
- BarChart horizontal para top fontes: tamanho dos labels?
- Sparkline inline na PostPerformanceTable: visível?
- PostPerformanceTable tem 7 colunas — overload?
- TrafficSourcesChart com IAs consolidadas em UMA linha está claro?
- Recharts está sendo aproveitado bem? Há tooltips ricos?
- Falta algum tipo de viz que daria insight novo? (ex: heatmap, funnel, cohort, scatter)
- Algum chart poderia virar tabela ou vice-versa?

### 4. Widgets interativos & affordances

> O dashboard convida a explorar ou só é leitura passiva?

- Drilldown: clicar num KPI/Post/Query mostra detalhe?
- Hover states: revelam info adicional ou são planos?
- Filtros: existem (post status, period, compare) — suficientes ou faltam?
- Tabs/Acordion: usar mais? menos?
- Tooltips: explicam "como calculei" suficientemente? Tem MetricTooltip em tudo que precisa?
- Empty states: comunicam ação clara ("configure eventos no GA4 →") ou só dizem "sem dados"?
- Skeleton loading: aparece de fato? (Server Component pode ser rápido demais e nunca renderizar)
- Keyboard navigation: tab funciona em tudo?

### 5. Densidade de informação & fricção cognitiva

> Há sobrecarga? Há vazio?

- Quantos números o leitor processa antes do primeiro insight?
- Há repetição de informação entre seções? (ex: indexação no Hero + KpiCard + Status)
- O modo comparativo (`?compare=1`) substitui a visão normal — útil ou destrutivo?
- Os Insights da seção Ação são specific actionable ou genéricos?
- Os 3 P0/P1/P2 + 3 Insights + 3 RedFlags + tabelas dão sensação de tarefas demais?
- Page total scroll: 3 telas? 5? 10? Cabe na atenção de reunião?
- Footer técnico (GA4 property, GSC site) ajuda ou é ruído?

### 6. Mobile experience

> Bruno acessa do celular pra checar. Funciona?

- Hero metric: legível? Sparkline funciona?
- KPI cards em 2 cols: spacing OK ou apertado?
- GrowthChart com timeline markers: tap funciona pra ver tooltip?
- TopQueriesTable em cards mobile: completa? 4 métricas mostradas são as certas?
- PostPerformanceTable cards 2x2: legível? Falta status badge claro?
- ComparisonView empilha vertical: parece estranho ou natural?
- Header com botões Comparar/Exportar/Select: cabe em 375px?
- Filtros chips do PostPerformance: rolam horizontal?

### 7. Performance & acessibilidade

> O dashboard é rápido pra abrir? Funciona pra todos?

- TTFB (Time To First Byte) em produção: medir
- Bundle size dos componentes Recharts: árvores grandes podem virar `dynamic()`?
- LCP / CLS no mobile: Lighthouse mede
- Contraste WCAG AA: cores `text-neutral-500` sobre `bg-white` passam?
- Screen reader: aria-labels presentes em todos os charts?
- Focus visible: navegação por tab clara?
- Color blindness: vermelho/verde semânticos têm fallback de ícone?

### 8. Brand & voice (Berkahn-specific)

> O dashboard sente Berkahn?

- Paleta (preto/off-white/cinzas) respeita brand guide?
- Manrope está sendo usada bem em todos os pesos?
- Subtítulos seguem voz "engenheiro experiente" sem ser corporativo?
- Aplica `copy-sem-travessao` (sem `—`, `–`, `-` estilísticos)?
- Empty states e errors têm voz Berkahn ou são genéricos?

---

## Metodologia sugerida (passos)

1. **Carregar contexto** (5 min):
   - SessionStart hook já carrega vault
   - Ler `Berkahn-Vault/10-memory/reference/analytics-methodology.md`
   - Ler `Berkahn-Vault/20-context/berkahn-brand.md` e `[[copy-sem-travessao]]`
   - Ler plan file `~/.claude/plans/eu-quero-fazer-o-snoopy-koala.md` (histórico completo dos 4 sprints)

2. **Mapear código atual** (10 min):
   - Ler `AnalyticsContent.tsx` (orquestrador) e cada Act
   - Ler cada componente principal em `components/admin/analytics/`
   - Anotar dependências, props, fluxo de dados

3. **Acessar produção** (5 min):
   - `curl -sI https://admin.berkahn.com.br/admin/analytics` (confirma deploy)
   - Verificar `lib/analytics/queries.ts` para entender data shape
   - Abrir uma fixture (`scripts/analytics/fixtures/2026-04.json`) para ver dado real

4. **Análise crítica por dimensão** (30-45 min):
   - Para cada uma das 8 dimensões acima, fazer 3-5 observações concretas
   - Citar arquivos + linhas específicas
   - Não inventar problemas — só anotar o que vê

5. **Priorização** (10 min):
   - Matriz Impacto × Custo:
     - **Quick wins** (alto impacto, baixo custo) — fazer primeiro
     - **Strategic** (alto impacto, alto custo) — fazer com plano
     - **Polishing** (baixo impacto, baixo custo) — fazer se sobrar tempo
     - **Avoid** (baixo impacto, alto custo) — não fazer
   - Cada item ganha 1 dessas 4 etiquetas

6. **Escrever plan file** (15 min):
   - Sair do plan mode com plano estruturado
   - Bruno aprova, decide quais quick wins fazer, quais strategic levar pra outro sprint

---

## Output esperado

O plan file deve conter:

```markdown
# Auditoria do Dashboard — Plano de melhorias priorizadas

## Contexto
[resumo do dashboard atual]

## Achados por dimensão
### 1. Storytelling
- 🟢 Quick win: [observação concreta] → [recomendação]
- 🔵 Strategic: [observação] → [recomendação]
- 🟡 Polishing: ...

### 2. Visual hierarchy
...

[continua pelas 8 dimensões]

## Top 5 quick wins (executar agora)
1. [item] — esforço S, impacto H
2. ...

## Top 3 strategic (próximo sprint)
1. [item] — esforço M, impacto H

## Itens descartados (com justificativa)
- [item considerado e rejeitado] — por quê

## Métricas de sucesso
[como saberemos se as mudanças foram boas]
```

---

## Restrições / Não-objetivos

**NÃO mudar (escolhas estabelecidas)**:
- ❌ Arquitetura em 5 atos (Status → Crescimento → Origem → Posts → Ação) — funciona, validada com time
- ❌ Health Score como métrica única — base já documentada
- ❌ Paleta brand (preto + off-white + cinzas + semânticas) — alinhado com guia de design
- ❌ Recharts como lib — não trocar (já maduro)
- ❌ Auto-período mensal — não adicionar semanal/trimestral (decidido como backlog)
- ❌ Eventos GA4 / EventsCards — pulado por falta de dados, follow-up separado
- ❌ Modo apresentação dedicado — decidido como não-necessário

**SUGERIR REMOVER se identificar como ruído**:
- ✅ Footer técnico se for percebido como ruído
- ✅ Cards/elementos que duplicam informação
- ✅ Filtros que ninguém usa
- ✅ Tooltips redundantes

**Princípios**:
- Adicionar < remover < ajustar
- Buscar simplicidade
- Impacto > Polimento
- Specific actionable > generic

---

## Padrões estabelecidos (respeitar)

### Brand
- Background: `#FFFFFF`, off-white `#F4F2EC`
- Texto: `#0A0A0A`, `#4A4A4A`, `#8A8A8A`
- Borders: `#E5E2D9`
- Up/On-track: `#1F6F3D` + bg `#E8F3EC`
- Down/Critical: `#B83A3A` + bg `#F8E8E8`
- At-risk/Warning: `#B8801F` + bg `#FDF4D8`
- IAs/Timeline: `#7C3AED` (roxo coerência semântica)

### Tipografia (Manrope)
- Hero metric: text-6xl bold
- KPI value: text-3xl semibold
- Section title (h2): text-2xl bold
- Subtítulo: text-base text-neutral-600

### Recharts defaults
- `isAnimationActive={false}` (Meet/Zoom share screen)
- `strokeWidth={2}` em lines
- ResponsiveContainer wrapping
- Tooltip bg white + border #E5E2D9

### Mobile breakpoint
- `md` (768px). Abaixo → cards, acima → tabelas

### Copy
- Aplicar [[copy-sem-travessao]] em qualquer copy nova
- Voz Berkahn: "engenheiro experiente compartilhando"

---

## Arquivos a ler primeiro

**Código (entender o que existe)**:
1. `app/admin/analytics/page.tsx` — orquestrador server-side
2. `app/admin/analytics/AnalyticsContent.tsx` — montagem dos atos
3. `app/admin/analytics/loading.tsx` — skeleton
4. `components/admin/analytics/AnalyticsHeader.tsx`
5. `components/admin/analytics/acts/Act0Status.tsx` até `Act4Action.tsx` (5 arquivos)
6. `components/admin/analytics/HeroMetric.tsx`, `KpiCard.tsx`, `KpiCardGrid.tsx`
7. `components/admin/analytics/GrowthChart.tsx` (timeline já integrada)
8. `components/admin/analytics/PostPerformanceTable.tsx` + `PostHeroCards.tsx`
9. `components/admin/analytics/TopQueriesTable.tsx` (mobile cards Sprint 4)
10. `components/admin/analytics/ComparisonView.tsx`
11. `components/admin/analytics/RedFlagCard.tsx`
12. `lib/analytics/narrative.ts` — geração de subtítulos

**Dado real (uma fixture)**:
- `scripts/analytics/fixtures/2026-04.json` — ver formato do snapshot

**Contexto**:
- `Berkahn-Vault/10-memory/reference/analytics-methodology.md`
- `Berkahn-Vault/20-context/berkahn-brand.md`
- `Berkahn-Vault/10-memory/feedback/copy-sem-travessao.md`
- `~/.claude/plans/eu-quero-fazer-o-snoopy-koala.md` (histórico)

---

## Inspirações (referencial, não copiar)

- **Linear**: hierarquia visual, denso sem overload
- **Stripe Dashboard**: cards com sparkline, padrões de comparação
- **Vercel Analytics**: minimalismo, hierarquia de número grande
- **Tremor.so**: componentes de dashboard com Recharts
- **Notion Dashboards**: storytelling com seções claras

Olhar pra entender padrões — NÃO copiar.

---

## Workflow recomendado da nova sessão

1. Bruno cola a linha de abertura
2. Claude entra em **plan mode** automaticamente (não fazer edits)
3. Claude executa metodologia (read code + read prod + analyze + categorize)
4. Claude faz perguntas críticas via `AskUserQuestion` se descobrir trade-offs reais
5. Claude escreve plan file com achados + priorização + top 5 quick wins
6. Bruno aprova → executa quick wins primeiro
7. Strategic items viram Sprint 5 (próxima sessão)

---

## Referências no vault

- [[analytics-methodology]] — fórmulas e thresholds
- [[berkahn-brand]] — voz, paleta, princípios
- [[copy-sem-travessao]] — regra de copy
- [[dashboard-sprint-4-handoff]] — handoff do Sprint 4 (arquivado)
- [[google-apis-setup]] — credenciais e setup
- Plan file: `~/.claude/plans/eu-quero-fazer-o-snoopy-koala.md`

---

## Critério de sucesso da auditoria

✅ Plano tem ao menos 5 quick wins acionáveis com referência a arquivo:linha
✅ Plano descarta ao menos 3 itens com justificativa clara (resistência ao polishing)
✅ Top 1 strategic tem cost-benefit articulado
✅ Bruno consegue priorizar com confiança após ler
✅ Nada de "vamos refazer o dashboard" — incremental sempre
