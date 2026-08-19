---
tipo: projeto
criado: 2026-05-22
atualizado: 2026-08-19
tags:
  - project/site
  - status/active
ai_summary: "Hub do Site — Next 16.3, dependências sem advisories e fontes locais estão validados em build. CRM Supabase, GA4, retenção mensal e dispatcher Web Push estão em produção. Pendem smoke autenticado, assinatura push em um dispositivo e despublicar o GitHub Pages legado com uma conta admin."
status: active
projeto: site
kpi_paginas_indexadas: 34
kpi_paginas_total: 38
kpi_lcp_target_ms: 2500
kpi_inp_target_ms: 200
kpi_cls_target: 0.1
kpi_isr_revalidate_s: 60
kpi_componentes_article: 19
kpi_atualizado_em: 2026-08-07
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

Site em produção (Next.js 16 App Router + Supabase + Vercel + Tailwind + shadcn/ui). O CRM leve em `/admin/leads` foi mergeado pela PR #53 no commit `5121941` e está deployado nos projetos `berkahn` e `berkahn-admin`; arquitetura e runbook vivem em [[admin-setup]]. Supabase é a única fonte operacional; Google Sheets e Apps Script são legado desativado em [[google-sheets]].

**Diagnóstico integrado 2026-08-07**: o crawl agora cobre as 47 URLs do sitemap e superfícies públicas `noindex`; o artigo caiu de 371 para 218 kB de First Load JS (-41,2%), com home em 241 kB e `/atualidades` em 179 kB. SSG/ISR de 60 s e 404 foram preservados. Evidências, limites de laboratório e baseline de conversão vivem em [[2026-08-diagnostico-integrado-site]].

## Bloqueios ativos

- [x] ~~**PR #17 (institucional v3) pendente merge**~~ — mergeado em 2026-07-30, junto com #15 e #16. **O que sobrou**: validar `/institucional/pdf` em produção, atualizar o briefing para v4 e distribuir o PDF (ver "Próximos 7 dias")
- [x] **Indexação Google** (delegado a [[seo-aeo]]): resolvido em 2026-07-29 — 34/38 artigos (89%), contra 6/44 em abril
- [x] ~~**Bug SearchAction**~~ — resolvido em 2026-07-30 **removendo** o bloco. Não era URL inválida: o `urlTemplate` apontava para `/perguntas-frequentes?q=`, e aquela página ignora o parâmetro (o componente não recebe props) e devolve a FAQ inteira. Como o sitelinks searchbox foi descontinuado pelo Google em nov/2024, declarar a busca não tinha contrapartida
- [x] ~~**Quatro CTAs apontando para `/contato`, que respondia 404**~~ — resolvido em 2026-07-30. `app/portfolio/page.tsx:153`, `ProjectModels.tsx:180`, `ProjectSpecs.tsx:72` e `ProjectsGrid.tsx:41` linkavam para uma rota que **nunca existiu**: a captura de lead só existia como modal. O `ContactForm` foi extraído do `ContactFormDialog` e agora serve os dois — o modal e a página `/contato`, indexável e linkável. Fecha o item 7 do diagnóstico ("não existe caminho público para pedir orçamento")
- [x] ~~**Senha da conta Supabase no bundle público do admin**~~ — resolvido em 2026-07-31 (#42). `LoginForm.tsx` era Client Component e a constante `ACCESS_CODE` era, na verdade, a senha passada para `signInWithPassword`. Autenticação movida para Server Action; não há mais segredo no repositório nem no ambiente. Senha rotacionada. Detalhes e o que ainda cabe fazer em [[supabase-config]] (Histórico de incidentes)
- [x] ~~**Seis rotas `/api/admin/*` sem autenticação**~~ — resolvido em 2026-08-05. O matcher do middleware era `['/', '/admin/:path*']` e não cobria `/api/admin/*`; três das rotas usavam `createServiceClient()`, que bypassa RLS. Sem login dava para listar todos os orçamentos com dado pessoal do cliente, apagar por id, e pegar signed URL do PDF. Fechado com matcher + `exigirSessao()` nos 10 handlers. Verificado: as 9 combinações devolvem 401
- [x] ~~**Dupla escrita dos comandos de conteúdo**~~ — resolvido em 2026-08-06. `/pesquisa` e `/linkedin` gravam na pauta via `scripts/conteudo/pauta.mjs` e não criam mais `.md` no vault. `/criacao` e `/calendario` foram corrigidos junto: um procurava a pesquisa na pasta que deixou de ser alimentada, o outro contava posts pendentes varrendo uma pasta congelada. Ver [[quadro-conteudo]]
- [ ] **Contas Supabase por pessoa**: hoje todos entram com a mesma conta compartilhada, então `auth.uid()` não distingue ninguém e o autor dos comentários é nome digitado no localStorage. Projeto próprio — ver [[comentarios-inline-documentacoes]], seção "Identidade"
- [x] **Banco do CRM aplicado**: migrations 024–029 em produção; funil, RPCs, vínculos, RLS canônica, responsáveis, prioridade, resumo operacional, arquivos, remoção atômica, outbox push, `pg_cron` e `pg_net` instalados. Matriz RLS, rollback atômico, cleanup de arquivos e payload push sem PII verdes
- [x] **Retenção operacional**: `lead-retention` v1 publicada, segredos sincronizados no Edge/Vault e job mensal ativo desde 2026-08-14; rollout sem candidatos ou objetos pendentes
- [x] **Web Push configurado**: VAPID + `LEAD_PUSH_CRON_SECRET` nos projetos site/admin, segredo homônimo no Vault e dispatcher agendado a cada 15 minutos desde 2026-08-14
- [x] **GA4 Admin concluído**: OAuth de edição validado; `article_slug` e `percent_scrolled` registrados em 10/08
- [x] **Apps Script encerrado**: nenhuma captura ou notificação depende de Google Sheets; Web Push é o canal opcional do admin
- **Core Web Vitals de campo**: otimizações estruturais entregues em [[2026-08-diagnostico-integrado-site]]; a tarefa de medição vive em “Próximos 7 dias”.

## Próximos 7 dias

- [x] ~~**Home redesign — fechar o PR #43**~~ — mergeado em 2026-08-06 com hub reconciliado; `@design-review` executado e follow-up PR #44 mergeado
- [x] ~~**Trocar take e restaurar copy institucional da home**~~ — 1080p integral convertido em 72/36 frames; copy conferida contra `bc6515f`; rail de projetos preservado no código e desmontado da composição
- [ ] @bruno Medir CWV no Speed Insights por 7 dias e consolidar em 28 dias, sem misturar as séries anterior e posterior ao Consent Mode de 2026-07-30; baseline em [[2026-08-diagnostico-integrado-site]] #pendencia
- [ ] @bruno Executar smoke autenticado de Inbox, Kanban, upload, responsável, PWA e configurações conforme [[admin-setup]]; PR #53, deploys e smoke público já estão concluídos #pendencia
- [ ] @bruno Despublicar o GitHub Pages `legacy/errored` em `Settings → Pages` com a conta proprietária; a API recusou o DELETE porque a conta CLI não tem `admin` #pendencia

> [!warning] Não é só ruído no CI: o Pages legado serve conteúdo duplicado
> Reverificado em 2026-08-18. O status é `errored`, mas `https://danielbkfalci00.github.io/berkahn/`
> responde **200** e serve um export estático antigo do próprio site. A home e
> `/servicos` estão de pé; `/atualidades` dá 404 porque o blog é dinâmico.
> A cópia **não tem canonical e não tem robots.txt**, então é conteúdo duplicado
> indexável competindo com `berkahn.com.br` nas páginas que existem lá.
> Não expõe fonte do repositório (README, package.json e CLAUDE.md dão 404).
>
> **Não dá para resolver por push.** O `pages-build-deployment` falha em toda
> execução desde pelo menos 2026-08-12, então o conteúdo servido está congelado
> num build antigo e commit novo não o atualiza. Adicionar `robots.txt` ou
> canonical no repositório não teria efeito. Só `Settings → Pages` com conta
> admin encerra isso.
>
> A tentativa de `DELETE /repos/.../pages` volta `404`, que é como o GitHub
> responde falta de permissão. O token da sessão tem `push` e `triage`,
> `admin: false`.
- [x] **Upgrade breaking de dependências concluído em 12/08**: Next 16.3, Sharp 0.35.3, Puppeteer 25.6, ESLint flat e D3 corrigido; `npm audit` retorna zero. Fontes locais retiraram a dependência de Google Fonts no CI. Detalhe em [[stack-nextjs-supabase]]
- [x] ~~**Próxima página do redesign: `/atualidades`**~~ — concluída em 2026-08-06: abertura fundida, bento, categorias canônicas, payload 141/26 KB e ISR 60 preservado
- [ ] Importar Clube Quinta dos Lagos para o banco de imagens antes de reativar o rail de projetos
- [ ] Validar `/institucional/pdf` gerando PDF em produção (pós-merge do #17)
- [ ] Atualizar o briefing do institucional para **v4** antes de distribuir — o código está em v4, a documentação em v3
- [x] Validar build (`npm run build`) sem warnings — passou em 2026-08-12 com Next 16.3; três `<img>` migrados, Browserslist atualizado, `middleware` migrado para `proxy` e tracing integral do harness removido
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

- [[stack-nextjs-supabase]] — arquitetura geral (Next.js 16 + Supabase + RLS + Vercel)
- [[admin-setup]] — painel admin, autenticação, schema `posts`
- [[comentarios-inline-documentacoes]] — comentários inline em `/admin/documentacoes`: ponte com o iframe, ancoragem por texto e a restrição de minificação
- [[quadro-conteudo]] — quadro de pautas em `/admin/conteudo`: por que a pauta é entidade separada de `posts`, por que o quadro nunca escreve `posts.status`, e por que toda mutação confere a linha afetada (a RLS não devolve erro, devolve zero linhas)
- [[design-principles]] — paleta preto/off-white, Manrope, ícones outline
- [[home-redesign-direcao]] — direção "luxo de engenharia" da home: paleta mono estrita, Archivo/Space Mono, hero com scrub por canvas, pipeline de troca de take e banco de prompts steel-frame
- [[seo-aeo-strategy]] — regras técnicas SEO (schema, meta, robots)
- [[google-sheets]] — histórico da integração desativada

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

- ~~`indices-mockups-remodelacao`~~ — a nota e a pasta `Docs/REMODELAÇÃO/` não existem mais (link órfão desde a consolidação do banco de imagens). Mockups vivos: [[40-content/materiais/banco-imagens|banco-imagens]]
- [[paginas-conteudo-v2]] — estratégia de páginas (migrado de Docs/)

## Histórico recente

- 2026-08-07: sprint integrado de performance/UX/SEO/AEO — fontes escopadas por rota, shell sem Motion, formulário lazy, charts sob demanda, sizes corrigidos, tracking de WhatsApp padronizado e axe sério/crítico zerado em 28 cenários. Ver [[2026-08-diagnostico-integrado-site]]

- 2026-08-06: home atualizada com take integral 1080p (72/36 WebPs), preload reduzido a seis frames, copy institucional restaurada de `bc6515f`, quatro fases canônicas e `ProjectsRail` temporariamente desmontado sem afetar `/portfolio`; `@design-review` fechou sobreposição do CTA com consentimento e reduced-motion dos parceiros
- 2026-08-06: PRs #43/#44 mergeados; `/atualidades` redesenhada na linguagem [[home-redesign-direcao]], migration 012 aplicada (40 posts, cinco categorias, featured único), payload ~83% menor bruto, analytics condicionado ao consentimento e SSG/ISR preservado

- 2026-07-20: standup — infra nova do **Documento Institucional PDF**: rota `app/institucional/pdf/`, `GET /api/institucional/pdf`, `components/institucional/pdf/*.tsx` (9 páginas), copy em `lib/institucional-data.ts` (2026-07-09/10). Branch `design/institucional-monografia` → PR #17 pendente merge. Reusa pipeline Puppeteer + `optImg()` (PDF 31MB → 6.7MB).
- 2026-05-22: hub criado
- 2026-05-21: vault migrado, integração documentada em `60-arquitetura/`
