---
tipo: memory
criado: 2026-05-28
atualizado: 2026-05-28
tags:
  - ai/memory
  - status/archived
  - project/site
  - source/manual
ai_summary: Handoff do Sprint 4 do dashboard /admin/analytics, executado e mergeado em 2026-05-28 (commit c9b5f6b). Entregou Timeline de posts no GrowthChart, DevicesMiniChart em Act2, FallingQueriesPanel em Act4, TopQueriesTable mobile cards, loading.tsx skeleton e A11y básico. 3 sprints anteriores concluídos (commits 1e54351, 92aceda, 9224ed8).
status: archived
subtipo: project
concluido: 2026-05-28
commit: c9b5f6b
---

# Sprint 4 — Dashboard `/admin/analytics`: Mobile polish + Timeline + Dados subutilizados

> **Como usar este prompt**: cole esta linha no início da próxima sessão Claude Code no projeto Berkahn:
>
> *"Executa o Sprint 4 do dashboard analytics seguindo `Berkahn-Vault/10-memory/project/dashboard-sprint-4-handoff.md`"*
>
> Claude vai ler este arquivo + o plan file e executar com as decisões já tomadas.

---

## Contexto

3 sprints entregues no dashboard `/admin/analytics` (Next.js admin, autenticado via Supabase Auth):

| Sprint | Commit | Entrega |
|--------|--------|---------|
| 1 | `1e54351` | Storytelling em 4 atos + Health Score 0-100 + Hero/Win/RedFlag + IAs consolidadas + refactor em Acts |
| 2 | `92aceda` | Ato 3 (Performance dos Posts) — PostHeroCards + PostPerformanceTable filtrável + 7 métricas GA4 por página |
| 3 | `9224ed8` | Metas dinâmicas (média 3m × 1.30) + Red flags inteligentes (6 detectores) + Comparativo MoM (toggle + URL state `?compare=1`) |

**Estado atual**:
- Dashboard em produção em https://admin.berkahn.com.br/admin/analytics
- Fixtures `2026-02/03/04.json` com bounceRate + engagementRate + sessions + newUsers por página
- Snapshots no Supabase `analytics_snapshots` populados
- Health Score, classificação de posts, metas, red flags funcionando
- Documentação completa em [[analytics-methodology]]

**Próximo cron mensal**: dia 1, 9h via scheduled-task `berkahn-performance-mensal` (gera Maio/2026).

---

## Decisões confirmadas com Bruno (sessão de 2026-05-28)

1. ✅ **Timeline de Posts** usa `published_at` dos posts publicados, **agrupando por dia** (1 marker por data, tooltip lista os posts)
2. ✅ **EventsCards: PULAR** — eventos GA4 zerados nas fixtures (`ga4.events: []`). Vira follow-up: configurar eventos no painel GA4 primeiro
3. ✅ **Skeleton loading**: Suspense + `app/admin/analytics/loading.tsx` (Next 15 idiomático, automático)
4. ✅ **Cor dos markers de timeline**: roxo `#7C3AED` (mesmo das IAs — coerência visual)

---

## Escopo do Sprint 4 (~60 min)

### 1. Timeline de Posts no GrowthChart

**Helper novo** `lib/analytics/timeline-events.ts`:
```typescript
export interface TimelineEvent {
  date: string; // YYYY-MM-DD
  posts: Array<{ title: string; category: string; slug: string }>;
}

export function buildTimelineEvents(
  postsMap: Map<string, PostMeta>,
  visibleMonths: string[] // ["2026-02", "2026-03", "2026-04"]
): TimelineEvent[] {
  // Agrupa posts por data de publicação (YYYY-MM-DD)
  // Filtra só os que caem em algum dos meses visíveis
  // Retorna eventos ordenados por data
}
```

**Modificar** `components/admin/analytics/GrowthChart.tsx`:
- Nova prop `events?: TimelineEvent[]`
- Adicionar `<ReferenceLine x={event.date} stroke="#7C3AED" strokeWidth={1} strokeDasharray="2 2" />` para cada evento
- Tooltip customizado (label component): quando hover na linha, lista posts da data
- Se múltiplos posts no mesmo dia, mostra "N posts publicados" + lista

**Modificar** `app/admin/analytics/page.tsx`:
- Após `getPublishedPosts()`, calcular `events = buildTimelineEvents(postsMap, trendMonths)`
- Passar `events` para `AnalyticsContent`

**Modificar** `app/admin/analytics/AnalyticsContent.tsx`:
- Aceitar prop `events` e passar para `Act1Growth`

**Modificar** `components/admin/analytics/acts/Act1Growth.tsx`:
- Repassar `events` para `<GrowthChart events={events} />`

### 2. DevicesMiniChart — Devices na Seção Origem

**Componente novo** `components/admin/analytics/DevicesMiniChart.tsx`:
- PieChart Recharts compacto h-40
- Dados: `ga4.byDevice` (já temos: desktop, mobile, tablet)
- Cores em gradient preto/cinza:
  - desktop: `#0A0A0A`
  - mobile: `#4A4A4A`
  - tablet: `#8A8A8A`
- Legenda inline com % e count
- innerRadius=30 outerRadius=55 (donut)
- Empty state: "Sem dados de device no período"

**Modificar** `components/admin/analytics/acts/Act2Origin.tsx`:
- Adicionar `<DevicesMiniChart data={context.ga4.byDevice} />` em uma nova linha após o grid de Donut + TrafficSources
- Layout sugerido: grid 3 cols desktop (AreaDistribution + TrafficSources + Devices)

### 3. FallingQueriesPanel — Queries em queda

**Componente novo** `components/admin/analytics/FallingQueriesPanel.tsx`:
- shadcn `<Accordion>` colapsável (default collapsed para não poluir)
- Header mostra contagem: "X queries perdendo cliques"
- Tabela compacta:
  - Query | Clicks atual | Clicks anterior | Δ
  - Linha vermelha sutil de fundo (#F8E8E8 hover)
- Empty state se array vazio: "Nenhuma queda significativa neste período"
- Limit 10 com botão "Ver todas" se houver mais

**Modificar** `components/admin/analytics/acts/Act4Action.tsx`:
- Adicionar `<FallingQueriesPanel queries={context.gsc.fallingQueries} />` após IndexationStatus
- Em mobile, fica empilhado abaixo

### 4. Mobile polish completo

**`TopQueriesTable.tsx`** (Sprint 2 fez `PostPerformanceTable` mobile cards, este NÃO):
- Replicar pattern do `PostPerformanceTable.tsx` linhas 200-228:
  ```tsx
  {/* Desktop tabela ≥768px */}
  <div className="hidden md:block"> ... tabela ... </div>
  {/* Mobile cards <768px */}
  <div className="md:hidden divide-y divide-neutral-100 px-4 pb-4">
    {rows.map((q) => (
      <div className="py-4">
        <h4 className="text-sm font-semibold mb-2">{q.query}</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
          {/* Clicks / Impressions / CTR / Posição */}
        </div>
      </div>
    ))}
  </div>
  ```

**Charts Recharts (todos)**:
- `fontSize={11}` em mobile vs `fontSize={12}` desktop via `tickFormatter` ou ResponsiveContainer breakpoints
- Validar tooltips funcionam em touch (testar abrir/fechar com tap)

**`KpiCardGrid.tsx`**:
- Adicionar `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6` (viewports <375px ganham 1 coluna)

**`HeroMetric.tsx`**:
- Sparkline lateral já vira embaixo no mobile via `flex flex-col lg:flex-row` — validar visualmente

**`PostHeroCards.tsx`** (Sprint 2):
- Já tem `grid-cols-1 md:grid-cols-2` — OK no mobile

**`ComparisonView.tsx`** (Sprint 3):
- Já tem `grid-cols-1 md:grid-cols-2` — OK no mobile

### 5. Skeleton loading via Suspense

**Arquivo novo** `app/admin/analytics/loading.tsx`:
```tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsLoading() {
  return (
    <div className="space-y-12 max-w-[1400px]">
      {/* Header skeleton */}
      <div className="flex items-end justify-between pb-6 border-b">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-44" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Hero skeleton */}
      <Skeleton className="h-48 w-full" />

      {/* Win + RedFlag */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>

      {/* Sections */}
      <Skeleton className="h-72 w-full" />
      <Skeleton className="h-72 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}
```

### 6. Acessibilidade (cross-cutting)

- `aria-label` em todos os charts Recharts: `<ResponsiveContainer aria-label="...">`
- `<section aria-labelledby="ato-X-title">` em cada Act
- `id="ato-X-title"` nos H2 correspondentes
- Validar focus visible em buttons + selects (deve estar via shadcn defaults)
- Validar contraste 4.5:1 em todo texto `text-neutral-500` sobre `bg-white`

### 7. Validate + commit + push
- `npx tsc --noEmit` deve passar sem erros
- Validar mobile 375px viewport (Chrome DevTools)
- Commit cirúrgico (ver pattern abaixo)
- Push para `origin/main`
- Vercel auto-deploya

---

## Files

**Novos**:
- `lib/analytics/timeline-events.ts`
- `components/admin/analytics/DevicesMiniChart.tsx`
- `components/admin/analytics/FallingQueriesPanel.tsx`
- `app/admin/analytics/loading.tsx`

**Modificar**:
- `components/admin/analytics/GrowthChart.tsx` (events prop + ReferenceLine + tooltip custom)
- `components/admin/analytics/TopQueriesTable.tsx` (mobile cards)
- `components/admin/analytics/KpiCardGrid.tsx` (grid-cols-1 em viewports <375px)
- `components/admin/analytics/acts/Act1Growth.tsx` (passa events)
- `components/admin/analytics/acts/Act2Origin.tsx` (add DevicesMiniChart)
- `components/admin/analytics/acts/Act4Action.tsx` (add FallingQueriesPanel)
- `app/admin/analytics/page.tsx` (busca events e passa)
- `app/admin/analytics/AnalyticsContent.tsx` (passa events para Act1)

---

## Padrões a seguir (estabelecidos nos sprints anteriores)

**Brand**:
- Background: `#FFFFFF`, off-white `#F4F2EC`, zebra `#FAF8F2`
- Texto: `#0A0A0A`, `#4A4A4A`, `#8A8A8A`
- Borders: `#E5E2D9`
- Brand accent IAs/timeline: `#7C3AED` (roxo)

**Cores semânticas**:
- Up/On-track: `#1F6F3D` (verde) + bg `#E8F3EC`
- Down/Critical: `#B83A3A` (vermelho) + bg `#F8E8E8`
- At-risk/Warning: `#B8801F` (âmbar) + bg `#FDF4D8`

**Tipografia (Manrope)**:
- Hero metric: `text-6xl font-bold` (60px)
- KPI value: `text-3xl font-semibold` (30px)
- Section title (h2): `text-2xl font-bold tracking-tight`
- Subtítulo dinâmico: `text-base text-neutral-600`

**Espaçamento**:
- Section: `space-y-12`
- KPI card padding: `p-4` (compacto)
- Hero card padding: `p-6 sm:p-8`

**Recharts defaults**:
- `isAnimationActive={false}` (para Meet/Zoom share screen)
- `strokeWidth={2}` em lines
- ResponsiveContainer envolvendo tudo
- Tooltip com `backgroundColor: "#FFFFFF"`, `border: "1px solid #E5E2D9"`, `borderRadius: 6`

**Mobile breakpoint**: `md` (768px). Abaixo → cards, acima → tabelas.

**Tooltips**: usar `<MetricTooltip>` de `components/admin/analytics/MetricTooltip.tsx`

**Empty states**: ícone cinza + texto explicativo curto

**Copy**: regra [[copy-sem-travessao]] — sem `—`, `–` ou hífens estilísticos

---

## Critérios de aceite
- [ ] GrowthChart tem markers roxos (`#7C3AED`) nas datas de publicação
- [ ] Tooltip do marker lista posts daquela data (título + categoria)
- [ ] Múltiplos posts no mesmo dia agrupam em 1 marker
- [ ] DevicesMiniChart aparece em Act2Origin (donut compacto)
- [ ] FallingQueriesPanel aparece em Act4Action (colapsável)
- [ ] TopQueriesTable funciona em mobile (cards verticais 2x2)
- [ ] `app/admin/analytics/loading.tsx` aparece entre navegações
- [ ] KpiCardGrid em viewport <375px tem 1 coluna
- [ ] `aria-label` em todos os charts + sections
- [ ] Mobile validation: 375px viewport sem scroll horizontal
- [ ] `npx tsc --noEmit` passa
- [ ] Commit + push + deploy Vercel

---

## Follow-ups (NÃO bloqueiam Sprint 4)

1. **Configurar eventos no GA4** — form_submit, whatsapp_click, cta_click, contact_click. Hoje `ga4.events: []` em todas as fixtures. Sem isso, EventsCards e Conversões por post ficam impossíveis. Item de sprint futuro: configurar manualmente no GA4 Admin → Events → Create event.
2. **EventsCards** componente — depois de configurar eventos, criar em sprint futuro.
3. **Filtro de tráfego interno GA4** — Bruno + time abrindo o site contamina dados. Configurar em GA4 Admin → Data Streams → internal traffic → adicionar IPs. Impacta meses futuros (não retroativo).
4. **Lighthouse audit** — rodar após deploy do Sprint 4 e investigar scores Performance/Accessibility. Targets: 90+.
5. **Multi-período (semana/trimestre)** — backlog. Hoje só mensal cobre 95% das reuniões.

---

## Credenciais e setup (já configurado, não precisa repetir)

| Item | Onde |
|------|------|
| Supabase URL/anon/service | `.env.local` |
| GCP OAuth client | `secrets/oauth-client.json` |
| GCP OAuth tokens | `secrets/oauth-tokens.json` (refresh persistente) |
| GA4 Property ID | `.env.local` (`GA4_PROPERTY_ID`) |
| GSC Site URL | `sc-domain:berkahn.com.br` |
| `gh` CLI auth | `brunofalci00` (collaborator) |
| Vercel deploy | auto-trigger no push pra `main` |
| Push command | `$tok=(gh auth token).Trim(); git push "https://x-access-token:$tok@github.com/danielbkfalci00/berkahn.git" main` |

---

## Commit pattern (igual sprints anteriores)

```
feat(analytics): Sprint 4 — Timeline + Devices + FallingQueries + Mobile polish

[descrição em bullets das mudanças principais]

[seção sobre A11y, skeleton loading, etc se aplicável]

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
```

---

## Resultado da execução

**Data**: 2026-05-28  
**Commit**: `c9b5f6b` (`feat(analytics): Sprint 4 — Timeline + Devices + FallingQueries + Mobile polish`)  
**Push**: `origin/main` (Vercel auto-deploy)

### Entregue conforme plano
- Timeline de posts no GrowthChart (markers roxos `#7C3AED` por mês com tooltip rico)
- `DevicesMiniChart` em Act2Origin (grid `lg:grid-cols-3`)
- `FallingQueriesPanel` em Act4Action (Accordion shadcn colapsável)
- `TopQueriesTable` mobile cards (pattern `hidden md:block` / `md:hidden`)
- `app/admin/analytics/loading.tsx` (skeleton Next 15 Suspense)
- A11y: `aria-label` em 4 charts + `aria-labelledby` + `id` em todos os 5 Acts

### Desvios do plano original
- **DevicesMiniChart**: altura `h-72` (não `h-40` como o handoff sugeriu). Razão: harmonizar com `AreaDistributionChart` e `TrafficSourcesChart` no grid 3-cols. Donut com mesmas dimensões dos peers (`innerRadius=50`, `outerRadius=90`).
- **Timeline markers**: agrupados por mês (não por dia). Razão: XAxis categórico (`monthLabel`) não suporta posições intra-mês sem refactor para escala temporal. Tooltip preserva data precisa.
- **KpiCardGrid**: mantido `grid-cols-2 md:grid-cols-3 xl:grid-cols-6` (não trocou pra `grid-cols-1` em viewport <420px). Razão: decisão de validar visualmente antes de mudar — pode ajustar em Sprint futuro se Bruno achar necessário.
- **Contraste A11y**: NÃO mudou `text-neutral-500` globalmente. Razão: cor `#737373` sobre `#FFF` = 4.6:1 → passa WCAG AA. Era over-engineering.

### Pendente (não bloqueia Sprint 4)
- Validação mobile manual 375px em produção (Bruno faz)
- Lighthouse audit (Performance + Accessibility) pós-deploy
- Follow-ups do handoff original (EventsCards, GA4 events config, filtro de tráfego interno, multi-período)

## Referências no vault

- [[analytics-methodology]] — fórmulas e thresholds usados em Health Score, classificação posts, metas, red flags
- [[google-apis-setup]] — setup GCP/OAuth (renew em 2026-08-25)
- [[blog]] — hub com KPIs do dashboard sincronizados (`kpi_health_score_mes`, `kpi_ga4_users_mes`, etc)
- [[seo-aeo]] — hub com `kpi_paginas_indexadas`, `kpi_ctr_medio`, etc
- Plan file: `C:\Users\bruno\.claude\plans\eu-quero-fazer-o-snoopy-koala.md` — histórico completo dos 4 sprints com auditoria, decisões e gaps

---

## Verificação end-to-end pós-Sprint 4

1. Acessa `admin.berkahn.com.br/admin/analytics` em desktop
2. GrowthChart mostra trend 3 meses + markers roxos nas datas de publicações
3. Hover no marker mostra título + categoria dos posts
4. Act2Origin tem 3 visualizações: AreaDistribution + TrafficSources + Devices
5. Act4Action tem IndexationStatus + FallingQueriesPanel
6. Trocar mês → skeleton aparece brevemente
7. Mobile 375px: todos os componentes funcionam, sem scroll horizontal
8. Toggle "Comparar" funciona normalmente (regressão check)
9. `?compare=1` na URL ativa modo comparativo
10. Lighthouse mobile + desktop: investigar scores
