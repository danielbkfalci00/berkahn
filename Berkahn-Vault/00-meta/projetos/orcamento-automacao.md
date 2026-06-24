---
tipo: projeto
criado: 2026-06-23
atualizado: 2026-06-24
tags:
  - project/orcamento-automacao
  - status/active
ai_summary: Hub do Gerador de Estimativa Preliminar Premium — automação de PDFs de orçamento via admin Berkahn (form ou planilha-modelo). Sprints 1, 2 e 3 entregues (fundação + renderer + 12 componentes + form wizard 5 steps com livre navegação). Faltam Sprints 4 (planilha) e 5 (polish). Plano em ~/.claude/plans/eu-preciso-seguir-com-optimized-starlight.md.
status: active
projeto: orcamento-automacao
kpi_sprints_total: 5
kpi_sprints_completos: 3
kpi_orcamentos_gerados_mes: 0
kpi_tempo_medio_geracao_segundos: 0
kpi_componentes_pdf_criados: 12
kpi_componentes_pdf_meta: 12
kpi_atualizado_em: 2026-06-24
contextos_aplicados:
  - stack-nextjs-supabase
  - berkahn-brand
  - guia-orcamento
  - design-principles
workflow: workflow-site
prompts_relacionados: []
bases_relacionadas:
  - projetos
  - kpis
subagents_uteis:
  - pragmatic-code-review
  - design-review
  - security-review
code_paths:
  - app/admin/orcamentos/
  - app/api/admin/orcamentos/
  - app/orcamento/estimativa/
  - components/orcamento/estimativa/
  - components/admin/orcamentos/
  - lib/orcamento-token.ts
  - lib/puppeteer-launch.ts
  - lib/orcamento-pdf-storage.ts
  - lib/orcamento-planilha.ts
  - lib/orcamento-template-xlsx.ts
  - lib/orcamento-estimativa-data.ts
  - supabase/migrations/006_create_orcamentos.sql
  - types/orcamento-estimativa.ts
---

# Orçamento Automação — Projeto

> Hub do projeto Gerador de Estimativa Preliminar Premium. Substitui o processo manual de Word (`Apresentacao_Estimativa_Preliminar.docx`) por pipeline **input estruturado → renderer React → PDF A4 premium**, com persistência no Supabase. Plano completo em `~/.claude/plans/eu-preciso-seguir-com-optimized-starlight.md`.

## Status atual

**Sprints 1, 2 e 3 entregues** (2026-06-23 a 2026-06-24): toda infra de geração de PDF + form wizard prontos. Sprint 4 (planilha-modelo XLSX/CSV) e Sprint 5 (polish) são os próximos.

**Sprint 3 destaques**: wizard de 5 passos (`OrcamentoWizard.tsx`) com navegação livre + indicador visual de validação por step (verde/amarelo/vazio). Sem Zod/zustand/react-hook-form (segue padrão `useState/useReducer` do PostEditor). Server actions em `app/admin/orcamentos/actions.ts`. Helpers de input próprios em `form-fields.tsx` (CurrencyField BRL, IntegerField, RadioPills, ChipsInput, TextField). Modo edição reusa o wizard via prop `orcamentoInicial`. Botão Editar no detalhe redireciona para `/admin/orcamentos/[id]/edit`. Finalizar valida tudo e redireciona pra detalhe (reusa GerarPdfButton/HeroUpload do Sprint 2).

## Visão geral

Reusa ~70% da infra de PDF existente — `puppeteer-core` + `@sparticuz/chromium` serverless já rodam para o `/orcamento/pdf` LSF — mas constrói **módulo novo separado** porque o conteúdo é diferente: estimativa preliminar **não-vinculante** com faixa de valor (min–max) e 3 regimes comerciais (Administração 13% / Preço Fechado / PMG), vs proposta LSF fechada com pacotes hardcoded.

## Bloqueios ativos

- [ ] **Dívida técnica registrada**: tabela `proposals` está no DB ([001_initial_schema.sql:91](../../../supabase/migrations/001_initial_schema.sql)) e em [types/admin.ts:261](../../../types/admin.ts) mas conceito é diferente (proposta transacional com items+descontos). Sem ação imediata — `orcamentos` nova é semanticamente separada.
- [ ] **Hardening futuro**: gate de segurança do `/orcamento/pdf` LSF atual ([route.ts:27](../../../app/api/orcamento/pdf/route.ts)) — público sem token. Fora do escopo deste projeto. Helper `lib/puppeteer-launch.ts` criado aqui poderá ser adotado depois pelo LSF.

## Próximos 7 dias

- [x] Plano aprovado e gravado em `~/.claude/plans/`
- [x] Hub criado no vault
- [x] Sprint 1 — fundação completa (migration, types, libs, API CRUD, esqueleto admin)
- [x] Sprint 2 — renderer + 12 componentes + API generate-pdf + pipeline Sharp + página admin [id]
- [x] Sprint 3 — form wizard 5 steps + server actions + form-fields + modo edição
- [x] **Bruno**: migration 006 aplicada no Supabase
- [ ] **Ação Bruno**: setar `CHROME_LOCAL_PATH` em `.env.local` para testar PDF localmente
- [ ] Smoke test E2E em prod (criar orçamento via wizard, subir hero, gerar PDF, validar visual)
- [ ] Sprint 4 — planilha-modelo XLSX/CSV (geração do template + parser strict + pré-preenchimento)

## KPIs (snapshot)

| Métrica | Atual | Meta | Δ |
|---------|-------|------|---|
| Sprints completos | 3 | 5 | -2 |
| Componentes PDF criados | 12 | 12 | ✅ |
| Wizard steps criados | 5 | 5 | ✅ |
| Orçamentos gerados/mês | 0 | TBD | aguarda 1º teste E2E |
| Tempo médio geração PDF | n/d | < 30s | medir após teste em prod |

## Roadmap (5 sprints, 2-3 semanas full-time)

| # | Foco | Entregáveis | Dias FT |
|---|------|-------------|---------|
| 1 | Fundação | Migration + sequence + buckets, tipos, libs, API CRUD, esqueleto admin, hub vault | 3-4 |
| 2 | Renderer + PDF | 12 componentes, rota renderer, gate HMAC, Playfair Display, API generate-pdf, pipeline Sharp hero | 4-5 |
| 3 | Form wizard | `WizardShell` + 5 steps + validação zod + listas dinâmicas | 3-4 |
| 4 | Planilha-modelo | `modelo-orcamento.xlsx` + upload + parser strict + pré-preenchimento | 2-3 |
| 5 | Polish | Edição/regeração + filtros + smoke test 3 orçamentos reais + update hub | 2 |

## Decisões consolidadas

| # | Decisão | Escolha |
|---|---------|---------|
| 1 | Relação com `/orcamento/pdf` LSF | Convive (módulo separado), unificação adiada |
| 2 | Input | Formulário + upload CSV/XLSX (schema fixo, template downloadable) |
| 3 | Entrega ao cliente | PDF anexo simples |
| 4 | Variações de template | 1 universal MVP |
| 5 | Elementos premium | Capa hero + range bar SVG + cards entrega + comparativo regimes |
| 6 | Persistência | Supabase + bucket Storage (PDFs + hero + template) |
| 7 | Modo CSV | Pré-preenchimento 1-a-1 |
| 8 | Tipografia | Manrope + Playfair Display |

## Contexto aplicado

- [[stack-nextjs-supabase]] — Next.js 15 + Supabase + RLS + Vercel + puppeteer-core serverless
- [[berkahn-brand]] — identidade (preto/off-white/Manrope) + voice "quiet luxury"
- [[guia-orcamento]] — pesquisa de mercado, template premium 12-16 páginas
- [[design-principles]] — paleta, hierarquia, acessibilidade WCAG

## Workflow & prompts

- Workflow: [[workflow-site]] (herda do hub site — projeto é infra dentro do admin)
- Plano completo: `~/.claude/plans/eu-preciso-seguir-com-optimized-starlight.md`

## Bases relacionadas

- [[projetos.base]] — agrega `tipo: projeto` (auto-detect)
- [[kpis.base]] — agrega `kpi_*` deste hub

## Subagents úteis

- `@pragmatic-code-review` — review do módulo após Sprint 2 e Sprint 5
- `@design-review` — UI/UX dos componentes premium em Sprint 2 (live env Playwright)
- `@security-review` — gate HMAC + RLS (Sprint 1) e upload Sharp (Sprint 2)

## Code paths

| Path | Conteúdo | Doc vault |
|------|----------|-----------|
| `app/admin/orcamentos/` | Rotas admin (lista, novo, edit) | [[stack-nextjs-supabase]] |
| `app/api/admin/orcamentos/` | CRUD + PDF gen + hero upload + parse-planilha | [[stack-nextjs-supabase]] |
| `app/orcamento/estimativa/[id]/` | Renderer A4 gated por HMAC | — |
| `components/orcamento/estimativa/` | 12 componentes PDF premium | [[guia-orcamento]] |
| `components/admin/orcamentos/` | Wizard 5 steps + upload | [[design-principles]] |
| `lib/orcamento-*.ts` | Token, storage, planilha, template | — |
| `supabase/migrations/006_*.sql` | Tabela + sequence + RLS + buckets | — |

## Histórico recente

- 2026-06-23: hub criado, plano aprovado, Sprint 1 entregue (DB + tipos + libs + API CRUD + esqueleto admin); Sprint 2 entregue (renderer A4 com gate HMAC, 12 componentes Playfair+Manrope, range bar SVG, API generate-pdf com viewport explícito + cookie bypass, pipeline Sharp hero, página admin [id] com `<GerarPdfButton />` e `<HeroUpload />`). TSC limpo. Falta Bruno rodar migration + setar `CHROME_LOCAL_PATH`.
- 2026-06-24: Bruno rodou migration 006 no Supabase. Sprint 3 entregue: form wizard 5 steps (`OrcamentoWizard.tsx` + `Step1Cliente`/`Step2Obra`/`Step3ValoresRegime`/`Step4ListasEntrega`/`Step5Revisao` em `components/admin/orcamentos/steps/`), reducer + validações por step (`wizard-state.ts`), server actions (`actions.ts` com `criarOrcamento`/`atualizarOrcamento`/`finalizarOrcamento`), helpers de input (`form-fields.tsx` com CurrencyField/IntegerField/RadioPills/ChipsInput/TextField), Checkbox shadcn (`components/ui/checkbox.tsx` + `@radix-ui/react-checkbox`), páginas `/admin/orcamentos/novo/form` e `/admin/orcamentos/[id]/edit`, botão Editar no detalhe. Navegação livre com indicador visual (verde/amarelo/vazio) por step. `beforeunload` warn quando hasUnsavedChanges. Finalizar redireciona pra detalhe — reusa `<GerarPdfButton />` e `<HeroUpload />` do Sprint 2. TSC limpo.
