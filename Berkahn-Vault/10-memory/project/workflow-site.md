---
tipo: memory
criado: 2026-05-22
atualizado: 2026-08-07
tags:
  - ai/memory
  - status/active
  - project/site
ai_summary: Workflow do Site — mudanças exigem configuração de medição registrada, 3 rodadas por arquétipo, lint/typecheck/build, crawl, ISR/404, axe e reviews proporcionais. Pós-deploy usa smoke imediato, 7 dias de tendência e 28 dias para campo conclusivo.
status: active
subtipo: project
why: "Site em produção precisa de evolução contínua sem comprometer Core Web Vitals (LCP≤2.5s, INP≤200ms, CLS≤0.1) e SEO técnico. Workflow definido evita regressões e mantém qualidade arquitetural."
how_to_apply: "Para cada change: ler hub [[site]] + contexto relevante (stack/admin/design/seo) + rodar build local + invocar subagent de review apropriado + validar live env."
---

# Workflow do projeto Site

> Hub: [[site]] · Stack: [[stack-nextjs-supabase]] · Pipeline: [[article-pipeline]] · Brand: [[design-principles]]

## Pipeline

Sem cadência fixa — disparado por:
- Issue/bug reportado (GitHub, GSC, monitoramento Vercel)
- Nova feature/página solicitada
- Refactor/melhoria identificada
- Auditoria SEO ([[seo-aeo]]) gerando ação técnica
- Performance regression (Core Web Vitals)

## Etapas

### 1. Contextualização (5-10 min)
- Ler hub [[site]] (status atual, bloqueios)
- Ler contexto relevante: [[stack-nextjs-supabase]], [[admin-setup]], [[design-principles]], [[seo-aeo-strategy]]
- Identificar `code_paths` afetados (campo no hub)

### 2. Implementação
- Editar arquivos em `app/`, `components/`, `lib/`, `public/`
- Seguir naming conventions e padrões de [[design-principles]]
- Usar componentes shadcn/ui existentes antes de criar novos
- Manter ISR revalidate 60s (não quebrar)

### 3. Validação local
- `npm run dev` — testar em http://localhost:3000+
- Fixar commit, viewport, throttling, cache e consentimento; usar 3 rodadas e mediana
- Rodar `npm run lint`, `npm run typecheck` e `npm run build`
- Em mudança estrutural, crawlear sitemap, confirmar ISR/404 e executar axe nos arquétipos e superfícies públicas `noindex`
- gitleaks scan automático pre-commit (já ativo)
### 4. Review
- Para PRs com mudança em arquitetura/lógica: invocar `@pragmatic-code-review` (Opus, framework Net Positive)
- Para mudanças visuais/UX: invocar `@design-review` (Sonnet + Playwright em live env)
- Para mudanças em auth/payments/data: invocar `@security-review` ANTES de commit

### 5. Deploy
- Push para branch → Vercel preview automático
- Validar preview URL
- Merge para main → produção

### 6. Pós-deploy
- Fazer smoke imediato
- Monitorar Vercel Analytics + Speed Insights por 7 dias
- Avaliar CWV de campo p75 em 28 dias; 24–48 h não são campo conclusivo
- Se SEO/AEO for afetado, acompanhar GSC sem atribuir causalidade antes de volume suficiente
## Prompts e bases

- Prompt direto: nenhum específico ainda (usar `/seo` para auditoria após mudança)
- Bases consumidas: [[kpis.base]] (KPIs do site)
- Output em: código (`app/`, `components/`, `lib/`) + opcional: nota em `40-content/auditorias-seo/` se gerou audit

## Outputs típicos

- PR no GitHub com diff de código
- Atualização do hub [[site]] com novo estado/bloqueio resolvido
- Opcional: nova auditoria em `40-content/auditorias-seo/`

## Subagents úteis

- `@pragmatic-code-review` — code review pós-feature ou pré-merge
- `@design-review` — UI/UX changes (live env first via Playwright)
- `@security-review` — antes de PRs em auth/payments/data handling

## Materiais relacionados

- [[indices-mockups-remodelacao]] — mockups e visão de redesign futuro
- [[paginas-conteudo-v2]] — estratégia de páginas residencial/comercial
- [[home-subsecoes]], [[lp-base]], [[area-casa-lote]] — site copy
