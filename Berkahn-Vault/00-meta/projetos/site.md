---
tipo: projeto
criado: 2026-05-22
atualizado: 2026-08-07
tags:
  - project/site
  - status/active
ai_summary: "Hub do Site — migrations 014–020 e código em produção: status livre, capas RLS, edição inline/tags, fila Codex e leads primários com PII restrita ao admin. Banco e smoke autenticado verdes com 66 pautas. Pende redeploy externo do Apps Script e dimensões GA4."
status: active
projeto: site
kpi_paginas_indexadas: 34
kpi_paginas_total: 38
kpi_lcp_target_ms: 2500
kpi_fid_target_ms: 100
kpi_cls_target: 0.1
kpi_isr_revalidate_s: 60
kpi_componentes_article: 19
kpi_atualizado_em: 2026-07-29
contextos_aplicados:
  - stack-nextjs-supabase
  - admin-setup
  - design-principles
  - home-redesign-direcao
  - seo-aeo-strategy
  - google-sheets
workflow: workflow-site
prompts_relacionados: []
bases_relacionadas:
  - kpis
subagents_uteis:
  - pragmatic-code-review
  - design-review
  - security-review
code_paths:
  - app/
  - components/
  - lib/
  - public/
  - scripts/
---

# Site — Projeto

> Hub do projeto Site (next-app + admin). Em produção em [berkahn.com.br](https://www.berkahn.com.br). Ajustes contínuos.

## Status atual

Site em produção (Next.js App Router + Supabase + Vercel + Tailwind + shadcn/ui). 16 rotas em `app/` (atualidades, empresa, admin, apresentacao-executiva, etc.). Admin com painel de posts ativo (`app/admin/`). Integração Google Sheets para leads via Apps Script.

**Indexação**: 34 de 38 artigos indexados (89%) em 2026-07-29, contra 6/44 em abril. O pipeline `/performance` inspeciona **só URLs de artigo** — as páginas institucionais (`/empresa`, `/servicos`, `/lsf`, `/portfolio`, etc.) nunca foram medidas. Se isso importar, ampliar `getAllPostUrls()` em `scripts/analytics/lib/posts.mjs`. Ver [[seo-aeo]].

## Bloqueios ativos

- [x] ~~**PR #17 (institucional v3) pendente merge**~~ — mergeado em 2026-07-30, junto com #15 e #16. **O que sobrou**: validar `/institucional/pdf` em produção, atualizar o briefing para v4 e distribuir o PDF (ver "Próximos 7 dias")
- [x] **Indexação Google** (delegado a [[seo-aeo]]): resolvido em 2026-07-29 — 34/38 artigos (89%), contra 6/44 em abril
- [x] ~~**Bug SearchAction**~~ — resolvido em 2026-07-30 **removendo** o bloco. Não era URL inválida: o `urlTemplate` apontava para `/perguntas-frequentes?q=`, e aquela página ignora o parâmetro (o componente não recebe props) e devolve a FAQ inteira. Como o sitelinks searchbox foi descontinuado pelo Google em nov/2024, declarar a busca não tinha contrapartida
- [x] ~~**Quatro CTAs apontando para `/contato`, que respondia 404**~~ — resolvido em 2026-07-30. `app/portfolio/page.tsx:153`, `ProjectModels.tsx:180`, `ProjectSpecs.tsx:72` e `ProjectsGrid.tsx:41` linkavam para uma rota que **nunca existiu**: a captura de lead só existia como modal. O `ContactForm` foi extraído do `ContactFormDialog` e agora serve os dois — o modal e a página `/contato`, indexável e linkável. Fecha o item 7 do diagnóstico ("não existe caminho público para pedir orçamento")
- [x] ~~**Senha da conta Supabase no bundle público do admin**~~ — resolvido em 2026-07-31 (#42). `LoginForm.tsx` era Client Component e a constante `ACCESS_CODE` era, na verdade, a senha passada para `signInWithPassword`. Autenticação movida para Server Action; não há mais segredo no repositório nem no ambiente. Senha rotacionada. Detalhes e o que ainda cabe fazer em [[supabase-config]] (Histórico de incidentes)
- [x] ~~**Seis rotas `/api/admin/*` sem autenticação**~~ — resolvido em 2026-08-05. O matcher do middleware era `['/', '/admin/:path*']` e não cobria `/api/admin/*`; três das rotas usavam `createServiceClient()`, que bypassa RLS. Sem login dava para listar todos os orçamentos com dado pessoal do cliente, apagar por id, e pegar signed URL do PDF. Fechado com matcher + `exigirSessao()` nos 10 handlers. Verificado: as 9 combinações devolvem 401
- [x] ~~**Dupla escrita dos comandos de conteúdo**~~ — resolvido em 2026-08-06. `/pesquisa` e `/linkedin` gravam na pauta via `scripts/conteudo/pauta.mjs` e não criam mais `.md` no vault. `/criacao` e `/calendario` foram corrigidos junto: um procurava a pesquisa na pasta que deixou de ser alimentada, o outro contava posts pendentes varrendo uma pasta congelada. Ver [[quadro-conteudo]]
- [ ] **Contas Supabase por pessoa**: hoje todos entram com a mesma conta compartilhada, então `auth.uid()` não distingue ninguém e o autor dos comentários é nome digitado no localStorage. Projeto próprio — ver [[comentarios-inline-documentacoes]], seção "Identidade"
- [x] **Google Sheets SPOF encerrado**: `leads` no Supabase é primário e a planilha é espelho com retry. Apps Script 1.1 aguarda redeploy manual
- [ ] **Core Web Vitals de campo**: `/atualidades` preserva SSG/ISR e CLS = 0. Após GA condicionado ao consentimento, prioridade da imagem LCP e boundary interativo menor, 3 rodadas em produção ficaram em LCP 3,04–3,54 s e TBT 304–756 ms (baseline chegava a 5,38 s/1.736 ms). O sintético ainda oscila acima da meta; validar Speed Insights antes de ampliar a refatoração global. Meta: LCP < 2,5 s, CLS < 0,1 e TBT < 200 ms

## Próximos 7 dias

- [x] ~~**Home redesign — fechar o PR #43**~~ — mergeado em 2026-08-06 com hub reconciliado; `@design-review` executado e follow-up PR #44 mergeado
- [x] ~~**Trocar take e restaurar copy institucional da home**~~ — 1080p integral convertido em 72/36 frames; copy conferida contra `bc6515f`; rail de projetos preservado no código e desmontado da composição
- [ ] **CWV da home nova**: medir no Speed Insights após deploy. Build local: First Load 264 kB; hero carrega 5,28 MB no desktop ou 1,01 MB no mobile, com 580 KB imediatos no desktop. Lighthouse local final (3×): LCP 2,80–4,24 s, CLS 0–0,001, TBT 682–1.226 ms; não há baseline local comparável para cravar regressão
- [x] ~~**Próxima página do redesign: `/atualidades`**~~ — concluída em 2026-08-06: abertura fundida, bento, categorias canônicas, payload 141/26 KB e ISR 60 preservado
- [ ] Importar Clube Quinta dos Lagos para o banco de imagens antes de reativar o rail de projetos
- [ ] Validar `/institucional/pdf` gerando PDF em produção (pós-merge do #17)
- [ ] Atualizar o briefing do institucional para **v4** antes de distribuir — o código está em v4, a documentação em v3
- [ ] Validar build (`npm run build`) sem warnings críticos
- [ ] gitleaks scan pre-commit ativo

## KPIs (snapshot)

| Métrica | Atual | Meta | Δ |
|---------|-------|------|---|
| Artigos indexados | 34/38 (89%) | 38 | -4 |
| Páginas institucionais indexadas | não medido | — | ampliar escopo do `/performance` |
| LCP `/atualidades` produção (sintético) | 3,04–3,54 s | < 2,5 s | validar Speed Insights |
| CLS `/atualidades` local | 0 | < 0,1 | ✅ |
| ISR revalidate | 60s | 60s | OK |

## Contexto aplicado

- [[stack-nextjs-supabase]] — arquitetura geral (Next.js 15 + Supabase + RLS + Vercel)
- [[admin-setup]] — painel admin, autenticação, schema `posts`
- [[comentarios-inline-documentacoes]] — comentários inline em `/admin/documentacoes`: ponte com o iframe, ancoragem por texto e a restrição de minificação
- [[quadro-conteudo]] — quadro de pautas em `/admin/conteudo`: por que a pauta é entidade separada de `posts`, por que o quadro nunca escreve `posts.status`, e por que toda mutação confere a linha afetada (a RLS não devolve erro, devolve zero linhas)
- [[design-principles]] — paleta preto/off-white, Manrope, ícones outline
- [[home-redesign-direcao]] — direção "luxo de engenharia" da home: paleta mono estrita, Archivo/Space Mono, hero com scrub por canvas, pipeline de troca de take e banco de prompts steel-frame
- [[seo-aeo-strategy]] — regras técnicas SEO (schema, meta, robots)
- [[google-sheets]] — integração leads via Apps Script

## Workflow & prompts

- Workflow: [[workflow-site]] — manutenção, novas páginas, refactors, bugs (criado em Sprint 1.8)
- Prompts: (nenhum específico ainda; usar `/seo` para auditoria)

## Bases relacionadas

- [[kpis.base]] — agrega `kpi_*` do site + outros projetos

## Subagents úteis

- `@pragmatic-code-review` — review de PRs (arquitetura, segurança, qualidade)
- `@design-review` — UI/UX changes (testes Playwright em live env)
- `@security-review` — antes de mexer em auth/payments/data handling

## Code paths (mapeamento com `60-arquitetura/`)

| Path | Conteúdo | Doc vault |
|------|----------|-----------|
| `app/` | 16 rotas Next.js App Router | [[stack-nextjs-supabase]] |
| `components/article/` | 19 componentes interativos | [[article-pipeline]] |
| `components/presentation/` | Slides + UI da /apresentacao-executiva | [[presentation-system]] |
| `lib/documentacoes/` | Ancoragem, ponte e queries dos comentários inline | [[comentarios-inline-documentacoes]] |
| `lib/` | Utilitários (Supabase client, helpers) | [[stack-nextjs-supabase]] |
| `public/images/img_blog/` | Capas WebP por artigo | — |
| `scripts/conteudo/pauta.mjs` | CLI genérico versionado do pipeline | [[quadro-conteudo]] |

## Materiais de apoio

- ~~`indices-mockups-remodelacao`~~ — a nota e a pasta `Docs/REMODELAÇÃO/` não existem mais (link órfão desde a consolidação do banco de imagens). Mockups vivos: [[banco-imagens]]
- [[paginas-conteudo-v2]] — estratégia de páginas (migrado de Docs/)

## Histórico recente

- 2026-08-06: home atualizada com take integral 1080p (72/36 WebPs), preload reduzido a seis frames, copy institucional restaurada de `bc6515f`, quatro fases canônicas e `ProjectsRail` temporariamente desmontado sem afetar `/portfolio`; `@design-review` fechou sobreposição do CTA com consentimento e reduced-motion dos parceiros
- 2026-08-06: PRs #43/#44 mergeados; `/atualidades` redesenhada na linguagem [[home-redesign-direcao]], migration 012 aplicada (40 posts, cinco categorias, featured único), payload ~83% menor bruto, analytics condicionado ao consentimento e SSG/ISR preservado

- 2026-07-20: standup — infra nova do **Documento Institucional PDF**: rota `app/institucional/pdf/`, `GET /api/institucional/pdf`, `components/institucional/pdf/*.tsx` (9 páginas), copy em `lib/institucional-data.ts` (2026-07-09/10). Branch `design/institucional-monografia` → PR #17 pendente merge. Reusa pipeline Puppeteer + `optImg()` (PDF 31MB → 6.7MB).
- 2026-05-22: hub criado
- 2026-05-21: vault migrado, integração documentada em `60-arquitetura/`
